import colors from "flat-palettes";
import { colord } from "colord";

const seedColor = () => {
  while (true) {
    const hex = colors(1)[0];
    const { s, l } = colord(hex).toHsl();
    if (l > 20 && l < 65) {
      return hex;
    }
  }
};
let colorStore = seedColor();
const queue = new Set();
const state = {
  grid: 1,
};

/**
 * @param {HTMLCanvasElement} el
 */
function draw(el) {
  const { radius, warpQ, noiseFreq, time, grid } = state;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const ctx = el.getContext("2d");
  const current = ctx.getImageData(0, 0, width, height).data.slice();

  el.width = width;
  el.height = height;
  ctx.fillStyle = colorStore;
  ctx.rect(0, 0, width, height);
  ctx.fill();
  const imageData = ctx.getImageData(0, 0, width, height);

  const at = (x, y) =>
    current[4 * ((y % height) * width + (x % width)) + 3] ? 1 : 0;
  for (let y = 0; y < height; y += grid) {
    for (let x = 0; x < width; x += grid) {
      const liveNeighbors =
        at(x - grid, y - grid) +
        at(x - grid, y) +
        at(x - grid, y + grid) +
        at(x, y - grid) +
        at(x, y + grid) +
        at(x + grid, y - grid) +
        at(x + grid, y) +
        at(x + grid, y + 1);
      const isLive = at(x, y);
      const pivot = 4 * (y * width + x);
      const nextLive =
        liveNeighbors === 3 ||
        (isLive && liveNeighbors === 2) ||
        queue.has(pivot);
      imageData.data[pivot + 3] = nextLive ? 255 : 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  queue.clear();
}

const dom = {
  canvas: document.getElementById("app"),
  regenerate: document.getElementById("regenerate"),
};

dom.regenerate.addEventListener("click", () => {
  colorStore = seedColor();
});

let last = Date.now();
const tick = () => {
  state.time += (Date.now() - last) / state.period;
  last = Date.now();
  draw(dom.canvas);
  requestAnimationFrame(tick);
};

function seed(x, y, spread = 6, items = 20) {
  const width = window.innerWidth;
  const idx = 4 * (Math.floor(y) * width + Math.floor(x));
  const d = () => Math.round(spread * (Math.random() - 0.5));
  for (let i = 0; i < items; i++) {
    queue.add(idx + 4 * (width * d() + d()));
  }
}
let tracking = false;
dom.canvas.addEventListener("pointerdown", () => (tracking = true));
dom.canvas.addEventListener("pointermove", (e) => {
  tracking && seed(e.clientX, e.clientY);
});
dom.canvas.addEventListener("pointerup", (e) => {
  !queue.size && seed(e.clientX, e.clientY);
  tracking = false;
});

seed(window.innerWidth / 2, window.innerHeight / 2, 100, 5000);
tick();
