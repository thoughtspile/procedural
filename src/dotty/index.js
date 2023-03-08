import colors from "flat-palettes";
import { colord } from "colord";
import { perlin3 as noise, seed } from "../lib/perlin";

const seedColor = () => {
  while (true) {
    const hex = colors(1)[0];
    const { s, l } = colord(hex).toHsl();
    if (l > 20 && l < 65) {
      console.log(s, l);
      return hex;
    }
  }
};
let colorStore = seedColor();
const state = {
  time: 0,
  noiseFreq: 150,
  period: 1000,
  grid: 10,
  radius: 1.5,
  warpQ: 3,
};

/**
 * @param {HTMLCanvasElement} el
 */
function draw(el) {
  const { radius, warpQ, noiseFreq, time, grid } = state;

  const width = window.innerWidth;
  const height = window.innerHeight;
  el.width = width;
  el.height = height;
  const ctx = el.getContext("2d");
  for (let y = 0; y < height; y += grid) {
    for (let x = 0; x < width; x += grid) {
      const r =
        radius *
        0.5 *
        grid *
        (0.5 +
          0.5 *
            noise(
              x / noiseFreq + warpQ * noise(x / noiseFreq, y / noiseFreq, time),
              y / noiseFreq + warpQ * noise(x / noiseFreq, y / noiseFreq, time),
              time
            ));
      ctx.beginPath();
      ctx.ellipse(x, y, r, r, 0, 2 * Math.PI, 0);
      ctx.fillStyle = colorStore;
      ctx.fill();
    }
  }
}

seed(Math.random());

const dom = {
  radius: document.getElementById("radius-scale"),
  warp: document.getElementById("warp-amount"),
  noiseFreq: document.getElementById("noise-freq"),
  period: document.getElementById("period"),

  canvas: document.getElementById("app"),
  regenerate: document.getElementById("regenerate"),
};

dom.radius.value = state.radius;
dom.radius.addEventListener(
  "input",
  (e) => (state.radius = Number(e.target.value))
);

dom.warp.value = state.warpQ;
dom.warp.addEventListener(
  "input",
  (e) => (state.warpQ = Number(e.target.value))
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
  colorStore = seedColor();
});

let last = Date.now();
const tick = () => {
  state.time += (Date.now() - last) / state.period;
  last = Date.now();
  draw(dom.canvas);
  requestAnimationFrame(tick);
};
tick();
