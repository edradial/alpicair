import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// relative base: works at any GitHub Pages path (user.github.io/<repo>/)
export default defineConfig({ base: "./", plugins: [react()] });
