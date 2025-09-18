import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ command }) => ({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                exportType: 'default',
            },
        })
    ],
    base: command === 'build' ? '/minesweeper/' : '/',
    build: {
        outDir: 'dist',
        sourcemap: true
    }
}));