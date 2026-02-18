import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    optimizeDeps: {
        exclude: ["@imgly/background-removal"],
    },

    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_API_URL || "http://localhost:5003",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});