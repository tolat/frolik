// Builds every brand image from client/src/images/brand/balloon.svg:
//   client/public/icon_512.png, icon_192.png   install icons (manifest)
//   client/public/apple-touch-icon.png         iPhone home screen (180px)
//   client/public/favicon.ico (+ favicon-32/16) browser tab
//   client/src/images/frolik2.png              "frolik" wordmark
// Run from the repo root:  node scripts/build-brand.js
// The wordmark keeps the original lettering (client/src/images/brand/
// wordmark-letters.png, the "frolik" text with the balloon area cleared)
// and places the balloon where the old one sat.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const BRAND = path.join(ROOT, "client/src/images/brand");
const PUBLIC = path.join(ROOT, "client/public");
const balloonSVG = fs.readFileSync(path.join(BRAND, "balloon.svg"), "utf8");
// Inner markup of the balloon (everything inside its <svg>)
const balloonInner = balloonSVG.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

// Icon: the balloon on the app's blue gradient, with a soft glow and clouds.
// Full-bleed square (Android masks it to any shape; iOS rounds the corners);
// the balloon stays inside the maskable safe zone (centre 80%).
const cloud = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
    <g fill="#1b1d24" fill-opacity="0.05" transform="translate(0 6)">
      <ellipse cx="0" cy="0" rx="62" ry="22"/><circle cx="-18" cy="-14" r="26"/><circle cx="18" cy="-20" r="32"/>
    </g>
    <ellipse cx="0" cy="0" rx="62" ry="22" fill="#dde3ec"/>
    <circle cx="-18" cy="-14" r="26" fill="#e6ebf2"/>
    <circle cx="18" cy="-20" r="32" fill="#eef2f7"/>
    <ellipse cx="10" cy="-34" rx="18" ry="9" fill="#ffffff" fill-opacity="0.85"/>
  </g>`;

// Icon: the balloon on a pale sky (almost white at the top, a whisper of
// blue at the bottom) with soft grey clouds, so the balloon's colours lead.
// Full-bleed square (Android masks it to any shape; iOS rounds the corners);
// the balloon stays inside the maskable safe zone (centre 80%).
const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.6" stop-color="#f3f7fd"/>
      <stop offset="1" stop-color="#e2ebf8"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#glow)"/>
  ${cloud(96, 372, 0.95)}
  ${cloud(420, 150, 0.75)}
  <g transform="translate(256 262) scale(0.82) translate(-256 -257)">${balloonInner}</g>
</svg>`;

// Tab icon: just the balloon, filling the square
const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 60 372 392">${balloonInner}</svg>`;

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: Math.max(72, (size / 512) * 300) })
    .resize(size, size)
    .png()
    .toBuffer();

// Minimal .ico holding PNG images (supported by every current browser)
const ico = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
};

(async () => {
  fs.writeFileSync(path.join(PUBLIC, "icon_512.png"), await png(iconSVG, 512));
  fs.writeFileSync(path.join(PUBLIC, "icon_192.png"), await png(iconSVG, 192));
  fs.writeFileSync(path.join(PUBLIC, "apple-touch-icon.png"), await png(iconSVG, 180));
  // For in-app use (e.g. the "Get the Frolik app" drawer)
  fs.writeFileSync(path.join(BRAND, "app-icon.png"), await png(iconSVG, 192));
  const fav = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(faviconSVG, size) })));
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico(fav));
  fs.writeFileSync(path.join(PUBLIC, "favicon-32.png"), fav[1].data);
  fs.writeFileSync(path.join(PUBLIC, "favicon-16.png"), fav[0].data);

  // Wordmark: lettering + balloon over the "i" (old balloon box: x 440–572,
  // y 0–172 on the 710×351 image; the balloon art spans x 113–399, y 80–434)
  const letters = path.join(BRAND, "wordmark-letters.png");
  const scale = 132 / 286;
  const bw = Math.round(512 * scale);
  const balloon = await sharp(Buffer.from(balloonSVG), { density: 300 }).resize(bw, bw).png().toBuffer();
  const left = Math.round(441 - 113 * scale);
  const top = Math.round(12 - 80 * scale);
  await sharp(letters)
    .extend({ top: Math.max(0, -top), background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .composite([{ input: balloon, left, top: Math.max(0, top) }])
    .png()
    .toFile(path.join(ROOT, "client/src/images/frolik2.png"));
  // For emails: a fixed public address (no build hash), 2x for sharp text
  fs.mkdirSync(path.join(PUBLIC, "email"), { recursive: true });
  await sharp(path.join(ROOT, "client/src/images/frolik2.png"))
    .resize({ width: 320 })
    .png()
    .toFile(path.join(PUBLIC, "email/frolik-logo.png"));
  fs.writeFileSync(path.join(PUBLIC, "email/app-icon.png"), await png(iconSVG, 112));
  console.log("brand images written");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
