import sharp from "sharp";
import { mkdirSync } from "fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="80%">
      <stop offset="0%" stop-color="#221733"/>
      <stop offset="100%" stop-color="#0f0a1a"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- intersection lens -->
  <path d="M 256 121.8 A 140 140 0 0 1 256 390.2 A 140 140 0 0 1 256 121.8 Z"
        fill="#d4a574" fill-opacity="0.38"/>
  <!-- two rings -->
  <circle cx="216" cy="256" r="140" fill="none" stroke="#d4a574" stroke-width="24"/>
  <circle cx="296" cy="256" r="140" fill="none" stroke="#d4a574" stroke-width="24"/>
</svg>`;

mkdirSync("public", { recursive: true });

const buf = Buffer.from(svg);
await sharp(buf, { density: 300 }).resize(512, 512).png().toFile("public/icon-512.png");
await sharp(buf, { density: 300 }).resize(192, 192).png().toFile("public/icon-192.png");
await sharp(buf, { density: 300 }).resize(180, 180).png().toFile("public/apple-icon.png");

console.log("icons generated");
