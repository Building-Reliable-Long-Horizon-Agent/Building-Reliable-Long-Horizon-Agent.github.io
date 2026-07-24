import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import React from "react";
import satori from "satori";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const geist = await readFile(
  new URL(
    "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
    root,
  ),
);

const generatedSvg = await satori(
  React.createElement(
    "div",
    {
      style: {
        alignItems: "center",
        background: "#ffffff",
        color: "#080808",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          fontFamily: "Geist",
          fontSize: 55,
          fontWeight: 400,
          letterSpacing: 1.5,
          lineHeight: 1,
          whiteSpace: "nowrap",
        },
      },
      "LONG-HORIZON",
    ),
    React.createElement(
      "div",
      {
        style: {
          fontFamily: "Geist",
          fontSize: 112,
          fontWeight: 400,
          letterSpacing: 2.3,
          lineHeight: 1,
          marginTop: 28,
          whiteSpace: "nowrap",
        },
      },
      "AGENTS",
    ),
  ),
  {
    width: 512,
    height: 512,
    fonts: [
      {
        name: "Geist",
        data: geist,
        weight: 400,
        style: "normal",
      },
    ],
  },
);

const svg = generatedSvg.replace(
  ">",
  ' role="img"><title>Long-Horizon Agents</title>',
);

await writeFile(new URL("public/favicon-long-horizon.svg", root), svg);

const raster = sharp(Buffer.from(svg)).png({
  compressionLevel: 9,
  adaptiveFiltering: true,
});

await Promise.all([
  raster
    .clone()
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .toFile(fileURLToPath(new URL("public/favicon-long-horizon-512.png", root))),
  raster
    .clone()
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .toFile(fileURLToPath(new URL("public/favicon-long-horizon-192.png", root))),
  raster
    .clone()
    .resize(32, 32, { kernel: sharp.kernel.lanczos3 })
    .toFile(fileURLToPath(new URL("public/favicon-long-horizon-32.png", root))),
  raster
    .clone()
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .toFile(fileURLToPath(new URL("public/apple-touch-icon-long-horizon.png", root))),
]);
