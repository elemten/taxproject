import fs from "node:fs/promises";
import path from "node:path";
import pngToIco from "png-to-ico";

const root = process.cwd();
const input = path.join(root, "public", "assets", "logo-square.png");
const output = path.join(root, "src", "app", "favicon.ico");

const ico = await pngToIco(input);
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, ico);
console.log(`Wrote ${path.relative(root, output)}`);
