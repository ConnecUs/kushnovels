
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// Import the HTML transform plugin
import htmlTransform from "./vite-plugin-html-transform.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Remove or set to "/" if not deploying to a subfolder
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    htmlTransform(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
