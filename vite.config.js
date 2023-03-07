import { globSync } from "glob";
import { resolve } from "path";
import { defineConfig } from "vite";

const pages = globSync("./src/**/*.html").map((path) => resolve(path));
export default defineConfig({
  root: "src",
  base: "./",
  appType: "mpa",
  build: {
    outDir: "../docs",
    rollupOptions: {
      input: pages,
    },
  },
});
