import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default {
  server: {
    port: 3000
  },
  plugins: [react(), splitVendorChunkPlugin()],
};

// export default defineConfig({
//   plugins: [react(), splitVendorChunkPlugin()],
// });
