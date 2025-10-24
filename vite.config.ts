import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [
        react(),
        mode === "development" && componentTagger(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png", "screenshot.png"],
            manifest: {
                name: "Smart Calculator",
                short_name: "Calculator",
                description: "All-in-one smart calculator with unit converter, BMI calculator, currency exchange, and more",
                theme_color: "#2db6b6",
                background_color: "#e0e5ec",
                display: "standalone",
                orientation: "portrait",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
        }),
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist",
        sourcemap: false,
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    ui: ["@radix-ui/react-dialog", "@radix-ui/react-toast", "lucide-react"],
                },
            },
        },
    },
}));
