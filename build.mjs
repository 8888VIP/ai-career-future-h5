import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
for (const file of ["index.html", "styles.css", "app.js"]) {
  await cp(file, `dist/${file}`);
}
await cp("assets/wecom-qr.jpg", "dist/assets/wecom-qr.jpg");
console.log("BUILD_OK dist_files=4");
