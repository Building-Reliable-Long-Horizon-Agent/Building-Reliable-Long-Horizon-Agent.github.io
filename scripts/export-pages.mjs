import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
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
const response = await worker.fetch(
  new Request("http://localhost/", {
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
  throw new Error(`Static render failed with status ${response.status}`);
}

const html = await response.text();
await writeFile(new URL("index.html", outputDir), html, "utf8");
await writeFile(new URL("404.html", outputDir), html, "utf8");
await writeFile(new URL(".nojekyll", outputDir), "", "utf8");

console.log(`GitHub Pages export written to ${fileURLToPath(outputDir)}`);
