/**
 * Remove solid black backgrounds from funnel_logo.png and name_logo.png.
 * Outputs transparent PNGs to public/logo/.
 * Run: node scripts/remove-logo-backgrounds.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src", "components");
const OUT = path.join(ROOT, "public", "logo");
const FILES = ["funnel_logo.png", "name_logo.png"];
const BLACK_THRESHOLD = 35;

function removeBlackBackground(inputPath, outputPath) {
  const buffer = fs.readFileSync(inputPath);
  const png = PNG.sync.read(buffer);
  const data = png.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (
      r <= BLACK_THRESHOLD &&
      g <= BLACK_THRESHOLD &&
      b <= BLACK_THRESHOLD
    ) {
      data[i + 3] = 0;
    }
  }
  const outBuffer = PNG.sync.write(png, { colorType: 6 });
  fs.writeFileSync(outputPath, outBuffer);
}

function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  for (const name of FILES) {
    const srcPath = path.join(SRC, name);
    if (!fs.existsSync(srcPath)) {
      console.log("Skip (not found):", srcPath);
      continue;
    }
    const outPath = path.join(OUT, name);
    removeBlackBackground(srcPath, outPath);
    console.log("Saved:", outPath);
  }
}

main();
