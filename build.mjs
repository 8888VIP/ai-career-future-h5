import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client/assets", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
for (const file of ["index.html", "styles.css", "app.js"]) {
  await cp(file, `dist/client/${file}`);
}
await cp("assets/wecom-qr.jpg", "dist/client/assets/wecom-qr.jpg");
await cp(".openai/hosting.json", "dist/.openai/hosting.json");
await cp("worker.mjs", "dist/server/index.js");
console.log("BUILD_OK client_files=4 worker=1 hosting_meta=1");
