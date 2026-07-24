import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const clientDir = new URL("../dist/client/", import.meta.url);
const serverEntry = new URL(
  `../dist/server/index.js?pages-export=${Date.now()}`,
  import.meta.url,
);
const outputDir = new URL("../out/", import.meta.url);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });

const { default: worker } = await import(serverEntry.href);
async function renderPage(pathname) {
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  if (!response.ok) {
    throw new Error(
      `Static render for ${pathname} failed with status ${response.status}`,
    );
  }

  return response.text();
}

const englishHtml = (await renderPage("/")).replace(
  '<html lang="en">',
  '<html lang="en" data-lang="en">',
);
const chineseHtml = (await renderPage("/zh")).replace(
  '<html lang="en">',
  '<html lang="zh-CN" data-lang="zh">',
);
const chineseDir = new URL("zh/", outputDir);

await mkdir(chineseDir, { recursive: true });
await writeFile(new URL("index.html", outputDir), englishHtml, "utf8");
await writeFile(new URL("404.html", outputDir), englishHtml, "utf8");
await writeFile(new URL("index.html", chineseDir), chineseHtml, "utf8");
await writeFile(new URL(".nojekyll", outputDir), "", "utf8");

console.log(`GitHub Pages export written to ${fileURLToPath(outputDir)}`);
