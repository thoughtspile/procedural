import colors from "flat-palettes";
import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import { perlin3 as noise, seed, lerp } from "./perlin";

extend([mixPlugin]);
const seedColors = () => {
  const [c1, c2] = colors(2).map((c) => colord(c));
  const dark = c1.isLight() ? c2 : c1;
  const light = c1.isLight() ? c1 : c2;
  return [dark.darken(0.2).toRgb(), light.lighten(0.2).toRgb()];
};
let colorStore = seedColors();
const clamp = (x) => Math.max(0, Math.min(1, x));
const state = {
  time: 0,
  noiseClamp: 2,
  noiseFreq: 30,
  period: 1000,
};

/**
 * @param {HTMLCanvasElement} el
 * @param {{ noiseClamp: number; noiseFreq: number }} param1
 */
function draw(el) {
  const { noiseClamp, noiseFreq, time } = state;
  const [baseColor, altColor] = colorStore;

  const { width, height } = el.getBoundingClientRect();
  const ctx = el.getContext("2d");
  const imageData = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mask = clamp(
        0.5 + noiseClamp * noise(x / noiseFreq, y / noiseFreq, time)
      );
      const offset = 4 * (y * width + x);
      const r = lerp(baseColor.r, altColor.r, mask);
      const g = lerp(baseColor.g, altColor.g, mask);
      const b = lerp(baseColor.b, altColor.b, mask);
      imageData.data[offset] = r;
      imageData.data[offset + 1] = g;
      imageData.data[offset + 2] = b;
      imageData.data[offset + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

seed(Math.random());

const dom = {
  clamp: document.getElementById("noise-clamp"),
  noiseFreq: document.getElementById("noise-freq"),
  period: document.getElementById("period"),
  canvas: document.getElementById("app"),
  regenerate: document.getElementById("regenerate"),
};

dom.clamp.value = state.noiseClamp;
dom.clamp.addEventListener(
  "input",
  (e) => (state.noiseClamp = Number(e.target.value))
);

dom.noiseFreq.value = state.noiseFreq;
dom.noiseFreq.addEventListener(
  "input",
  (e) => (state.noiseFreq = Number(e.target.value))
);

dom.period.value = state.period;
dom.period.addEventListener(
  "input",
  (e) => (state.period = Number(e.target.value))
);

dom.regenerate.addEventListener("click", () => {
  seed(Math.random());
  colorStore = seedColors();
});

let last = Date.now();
const tick = () => {
  state.time += (Date.now() - last) / state.period;
  last = Date.now();
  draw(dom.canvas);
  requestAnimationFrame(tick);
};
tick();
