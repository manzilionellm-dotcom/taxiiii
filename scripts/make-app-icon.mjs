import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Forest-green square icon — no extra image deps. */
const SIZE = 1024;
const FOREST = [0x1f, 0x3d, 0x2b, 0xff];
const CREAM = [0xff, 0xfd, 0xf8, 0xff];

const raw = Buffer.alloc(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const i = (y * SIZE + x) * 4;
    const dx = x - SIZE / 2;
    const dy = y - SIZE / 2;
    const r = Math.sqrt(dx * dx + dy * dy);
    const ring = r > 310 && r < 390;
    const pixel = ring ? CREAM : FOREST;
    raw[i] = pixel[0];
    raw[i + 1] = pixel[1];
    raw[i + 2] = pixel[2];
    raw[i + 3] = pixel[3];
  }
}

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

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8;
ihdr[9] = 6;

const rows = [];
for (let y = 0; y < SIZE; y++) {
  rows.push(Buffer.from([0]));
  rows.push(raw.subarray(y * SIZE * 4, (y + 1) * SIZE * 4));
}
const idat = deflateSync(Buffer.concat(rows), { level: 9 });
const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "assets");
mkdirSync(assets, { recursive: true });
writeFileSync(join(assets, "icon.png"), png);
writeFileSync(join(assets, "splash.png"), png);
console.log("wrote assets/icon.png and assets/splash.png");
