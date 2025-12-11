import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/vue-shop/", // 👈 obowiązkowe dla GitHub Pages
});
