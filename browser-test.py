from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


PROJECT = Path(__file__).resolve().parent
ARTIFACTS = PROJECT / "artifacts"
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        return


def choose(page, label, exact=False):
    control = page.get_by_role("button", name=label, exact=exact)
    control.wait_for()
    control.click()


def main():
    ARTIFACTS.mkdir(exist_ok=True)
    for old_screenshot in ARTIFACTS.glob("*.png"):
        if old_screenshot.parent == ARTIFACTS:
            old_screenshot.unlink()
    old_pdf = ARTIFACTS / "孩子未来职业推演报告.pdf"
    if old_pdf.exists():
        old_pdf.unlink()
    handler = partial(QuietHandler, directory=str(PROJECT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}/"
    errors = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=str(EDGE), headless=True)
        mobile_intro = browser.new_page(viewport={"width": 390, "height": 720})
        mobile_intro.goto(url, wait_until="networkidle")
        assert mobile_intro.locator("#startButton").is_visible()
        assert mobile_intro.evaluate("document.documentElement.scrollHeight <= window.innerHeight + 1")
        assert mobile_intro.locator("#introScreen").evaluate("el => el.scrollHeight <= el.clientHeight + 1")
        assert mobile_intro.get_by_text("不替孩子敲定一生，触摸时代脉搏，感受未来职业变化与能力方向。").is_visible()
        for label in ["AI创意设计", "AIGC", "AI机器人", "AI通识", "AI智能体"]:
            assert mobile_intro.get_by_text(label, exact=True).is_visible()
        mobile_intro.screenshot(path=str(ARTIFACTS / "00-mobile-intro-one-screen.png"))
        mobile_intro.close()

        page = browser.new_page(viewport={"width": 430, "height": 932})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(url, wait_until="networkidle")
        assert page.locator("#introTitle").is_visible()
        page.screenshot(path=str(ARTIFACTS / "01-intro.png"))

        page.click("#startButton")
        choose(page, "9—11岁")
        choose(page, "程序员", exact=True)
        choose(page, "稳定、有保障")
        choose(page, "策略闯关／虚拟探索")
        message_box = page.locator("#messageList").bounding_box()
        dock_box = page.locator("#answerDock").bounding_box()
        last_message_box = page.locator("#messageList .message-row").last.bounding_box()
        assert abs((message_box["y"] + message_box["height"]) - dock_box["y"]) <= 2
        assert last_message_box["y"] + last_message_box["height"] <= message_box["y"] + message_box["height"] + 2
        page.screenshot(path=str(ARTIFACTS / "02-chat-no-overlap.png"))
        choose(page, "体能挑战／团队竞技")
        choose(page, "搭建／拆解")
        page.locator("#confirmMulti").click()
        choose(page, "经常主动改造")
        page.get_by_role("button", name="不会再继续", exact=True).wait_for()
        assert page.get_by_role("button", name="不会再继续", exact=True).is_visible()
        assert page.get_by_role("button", name="很快放弃", exact=True).count() == 0
        page.screenshot(path=str(ARTIFACTS / "03-setback-neutral.png"))
        choose(page, "会换方法继续试")
        choose(page, "会比较多版结果")

        page.locator("#toInsightButton").wait_for()
        page.locator("#toInsightButton").click()
        page.wait_for_timeout(500)
        assert page.locator("#careerTitle").inner_text() == "软件工程师／程序员"
        page.screenshot(path=str(ARTIFACTS / "04-career-insight.png"))

        page.locator("#showAbilityButton").click()
        page.wait_for_timeout(500)
        assert page.locator(".ability-item").count() >= 3
        assert page.locator(".direction-item").count() == 3
        assert page.get_by_text("不等于职业定论", exact=True).count() == 0
        assert page.get_by_text("原始回答 → 谨慎推断", exact=True).count() == 0
        assert page.get_by_text("演示版：此按钮上线时接入您的课程落地页或教育顾问。", exact=True).count() == 0
        assert page.get_by_text("互动游戏与体验设计", exact=True).is_visible()
        assert page.get_by_text("运动科技与团队项目", exact=True).is_visible()
        assert "互动挑战" in page.locator("#challengeTitle").inner_text()
        page.screenshot(path=str(ARTIFACTS / "05-result-top.png"))

        page.locator("#resultScreen .result-scroll").evaluate("(el) => el.scrollTop = el.scrollHeight")
        page.wait_for_timeout(150)
        page.screenshot(path=str(ARTIFACTS / "06-result-action.png"))
        with page.expect_download() as download_info:
            page.locator("#pdfButton").click()
        download = download_info.value
        pdf_path = ARTIFACTS / "孩子未来职业推演报告.pdf"
        download.save_as(str(pdf_path))
        assert download.suggested_filename.endswith(".pdf")
        assert pdf_path.read_bytes().startswith(b"%PDF-")
        assert pdf_path.stat().st_size > 100_000
        page.locator("#courseButton").click()
        assert page.locator("#courseDialog").get_attribute("open") is not None
        qr = page.locator("#courseDialog .qr-frame img")
        assert qr.is_visible()
        assert qr.evaluate("img => img.complete && img.naturalWidth >= 400")
        assert page.get_by_text("天马老师 · 首新科技", exact=True).is_visible()
        assert page.get_by_role("link", name="保存二维码到手机").is_visible()
        page.screenshot(path=str(ARTIFACTS / "07-course-dialog.png"))
        assert not errors, "PAGE_ERRORS: " + " | ".join(errors)
        browser.close()

    server.shutdown()
    print("BROWSER_VERIFY_OK mobile_intro_scroll=0 mobile_cta=1 preview_paths=5 intro=1 chat_overlap=0 new_interests=2 neutral_setback_label=1 downstream_directions=2 challenge=1 career=1 abilities>=3 directions=3 ambiguous_labels=0 pdf=1 wecom=1 dialog=1 errors=0")
    for screenshot in sorted(ARTIFACTS.glob("*.png")):
        print(f"{screenshot.name} bytes={screenshot.stat().st_size}")
    print(f"孩子未来职业推演报告.pdf bytes={(ARTIFACTS / '孩子未来职业推演报告.pdf').stat().st_size}")


if __name__ == "__main__":
    main()
