import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/orders": "http://localhost:8081",
      "/customers": "http://localhost:8082",
      "/products": "http://localhost:8083",
      "/inventory": "http://localhost:8084",
      "/payments": "http://localhost:8085",
      "/api/notifications": "http://localhost:8086",
      '/api/events': 'http://localhost:8081',
    },
  },
});