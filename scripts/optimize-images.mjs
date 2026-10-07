// Gera versões otimizadas (WebP) dos assets em public/img.
// Uso: npm run optimize-images
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";

// Originais ficam fora de public/ para não serem publicados no deploy.
const SRC = "assets";
const OUT = "public/img";
await mkdir(OUT, { recursive: true });

const jobs = [];
const job = (name, fn) => jobs.push(fn().then((info) => console.log(name, info?.width ?? "", info?.height ?? "", info?.size ?? "")));

// Fotos reais do Kalleb
const photos = (await readdir(`${SRC}/kalleb`)).filter((f) => /^foto-\d+\.(png|jpe?g|webp)$/i.test(f)).sort();
for (const file of photos) {
  const n = file.match(/\d+/)[0];
  job(`foto-${n}`, () =>
    sharp(`${SRC}/kalleb/${file}`)
      .rotate()
      .flatten({ background: "#F8ECD8" })
      .resize({ width: 1080, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`${OUT}/kalleb-${n}.webp`),
  );
}

// Retrato estilizado (usado na escotilha do encerramento)
job("retrato", () =>
  sharp(`${SRC}/kalleb/retrato-estilizado-opcional.png`).resize({ width: 640 }).webp({ quality: 80 }).toFile(`${OUT}/kalleb-retrato.webp`),
);

// Personagens: recorta o espaço transparente para facilitar o posicionamento
for (const n of ["leao", "urso", "zebra", "macaco", "hipopotamo", "girafa", "elefante"]) {
  job(n, async () => {
    const trimmed = await sharp(`${SRC}/characters/${n}.png`).trim({ threshold: 4 }).toBuffer();
    return sharp(trimmed)
      .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 90 })
      .toFile(`${OUT}/${n}.webp`);
  });
}

// Arca (sem recorte: a composição em camadas usa as coordenadas do PNG original 1448×1086)
job("arca", () =>
  sharp(`${SRC}/scene/arca.png`).resize({ width: 1200 }).webp({ quality: 82, alphaQuality: 90 }).toFile(`${OUT}/arca.webp`),
);

// Marca
job("logo-1ano", async () => {
  const t = await sharp(`${SRC}/brand/kalleb-1ano.png`).trim({ threshold: 4 }).toBuffer();
  return sharp(t).resize({ width: 720 }).webp({ quality: 84 }).toFile(`${OUT}/kalleb-1ano.webp`);
});

// Elementos pequenos de cena — foram recortados de um fundo creme e têm halo claro.
// "fringe": remove o fundo claro conectado à transparência (flood fill) e suaviza a borda.
// "feather": corrói e esfuma o alfa (nuvens não têm contorno, então só suavizamos).
async function cleanScene(file, mode) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) alpha[i] = data[i * 4 + 3];

  if (mode === "fringe") {
    const isLight = (i) => {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      return Math.min(r, g, b) > 200 && Math.max(r, g, b) - Math.min(r, g, b) < 45;
    };
    const seen = new Uint8Array(w * h);
    const queue = [];
    for (let i = 0; i < w * h; i++) if (alpha[i] < 24) { seen[i] = 1; queue.push(i); }
    while (queue.length) {
      const i = queue.pop();
      alpha[i] = 0;
      const x = i % w, y = (i / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (!seen[j] && isLight(j)) { seen[j] = 1; queue.push(j); }
      }
    }
  } else {
    // erosão 2px
    for (let pass = 0; pass < 2; pass++) {
      const src = alpha.slice();
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          let m = src[y * w + x];
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy;
            m = Math.min(m, nx < 0 || ny < 0 || nx >= w || ny >= h ? 0 : src[ny * w + nx]);
          }
          alpha[y * w + x] = m;
        }
    }
  }

  const alphaImg = await sharp(Buffer.from(Uint8Array.from(alpha)), { raw: { width: w, height: h, channels: 1 } })
    .blur(mode === "fringe" ? 0.6 : 2)
    .extractChannel(0)
    .raw()
    .toBuffer();
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = alphaImg[i];
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

const scene = {};
const sceneModes = {
  "nuvem-01": "feather",
  "nuvem-02": "feather",
  "arco-iris": "feather",
  pomba: "feather",
  "folhas-01": "fringe",
  "folhas-02": "fringe",
  "onda-frente": "feather",
  "onda-fundo": "feather",
};
for (const [n, mode] of Object.entries(sceneModes)) {
  scene[n] = await cleanScene(`${SRC}/scene/${n}.png`, mode);
  job(n, () => sharp(scene[n]).webp({ quality: 90, alphaQuality: 95 }).toFile(`${OUT}/${n}.webp`));
}

// Texturas
job("papel", () => sharp(`${SRC}/textures/papel.png`).resize({ width: 768 }).webp({ quality: 60 }).toFile(`${OUT}/papel.webp`));

// Ícones (rosto do leão)
job("icon", async () => {
  const lion = await sharp(`${SRC}/characters/leao.png`).extract({ left: 340, top: 40, width: 880, height: 880 }).toBuffer();
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="112" fill="#DCECF4"/></svg>`,
  );
  const face = await sharp(lion).resize(440, 440).toBuffer();
  const icon = await sharp(bg).composite([{ input: face, left: 36, top: 44 }]).png().toBuffer();
  await sharp(icon).resize(180, 180).png().toFile("app/apple-icon.png");
  return sharp(icon).resize(64, 64).png().toFile("app/icon.png");
});

// Open Graph 1200×630
job("og", async () => {
  const sky = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#A8D2E8"/><stop offset=".62" stop-color="#DCECF4"/><stop offset="1" stop-color="#F8ECD8"/>
    </linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
  const cloud = await sharp(scene["nuvem-02"]).resize({ width: 420 }).toBuffer();
  const cloud2 = await sharp(scene["nuvem-01"]).resize({ width: 240 }).toBuffer();
  const ark = await sharp(`${SRC}/scene/arca.png`).resize({ width: 660 }).toBuffer();
  const logo = await sharp(await sharp(`${SRC}/brand/kalleb-1ano.png`).trim({ threshold: 4 }).toBuffer())
    .resize({ width: 470 })
    .toBuffer();
  const dove = await sharp(scene.pomba).resize({ width: 84 }).toBuffer();
  return sharp(sky)
    .composite([
      { input: cloud, left: -60, top: 20 },
      { input: cloud2, left: 900, top: 40 },
      { input: ark, left: 520, top: 150 },
      { input: logo, left: 50, top: 70 },
      { input: dove, left: 560, top: 90 },
    ])
    .jpeg({ quality: 84 })
    .toFile("public/og.jpg");
});

await Promise.all(jobs);
