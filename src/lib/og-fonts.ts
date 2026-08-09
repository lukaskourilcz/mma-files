import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontData = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/anton-latin-ext.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/ibm-plex-mono-latin-ext.ttf")),
]);

/** Local, Czech-capable fonts keep metadata images deterministic and offline. */
export async function getOgFonts() {
  const [anton, mono] = await fontData;

  return [
    { name: "Anton", data: anton, weight: 400 as const, style: "normal" as const },
    { name: "IBM Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}
