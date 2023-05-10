import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePluginRadar({
            // Google Analytics tag injection
            analytics: {
                id: "G-EHFVBGXZSL",
            },
        }),
    ],
    server: {
        host: true,
        port: 3000,
    },
});
