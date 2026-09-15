import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Brand art with no image dependencies: forest ground, cream ring. */
const FOREST = [0x1f, 0x3d, 0x2b, 0xff];
const CREAM = [0xff, 0xfd, 0xf8, 0xff];

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

/**
 * @param width  pixels
 * @param height pixels
 * @param ring   outer diameter of the mark as a fraction of the shorter side
 */
function render(width, height, ring) {
  const short = Math.min(width, height);
  const outer = (short * ring) / 2;
  const inner = outer * 0.795;
  const cx = width / 2;
  const cy = height / 2;
  const raw = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const pixel = r > inner && r < outer ? CREAM : FOREST;
      raw[i] = pixel[0];
      raw[i + 1] = pixel[1];
      raw[i + 2] = pixel[2];
      raw[i + 3] = pixel[3];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const rows = [];
  for (let y = 0; y < height; y++) {
    rows.push(Buffer.from([0]));
    rows.push(raw.subarray(y * width * 4, (y + 1) * width * 4));
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "assets");
mkdirSync(assets, { recursive: true });

/** Launcher icon: the mark fills the tile, the way app icons are drawn. */
writeFileSync(join(assets, "icon.png"), render(1024, 1024, 0.76));

/**
 * Launch screen art, one file per orientation. The old build reused the square
 * 1024² icon as the splash: `android:background="@drawable/splash"` stretches a
 * bitmap to the window, so on a 9:19.5 phone the ring came out as a wide
 * ellipse. Drawing the mark at 30 % of the short side in the real aspect ratio
 * keeps it a circle on every device.
 */
writeFileSync(join(assets, "splash-port.png"), render(1080, 1920, 0.3));
writeFileSync(join(assets, "splash-land.png"), render(1920, 1080, 0.3));
/** Kept as the portrait alias for anything still reading assets/splash.png. */
writeFileSync(join(assets, "splash.png"), render(1080, 1920, 0.3));

console.log("wrote assets/icon.png, splash-port.png, splash-land.png, splash.png");
