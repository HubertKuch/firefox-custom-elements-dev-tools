import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './',
  plugins: [
    preact(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        devtools: resolve(__dirname, 'devtools.html'),
        panel: resolve(__dirname, 'panel.html'),
        background: resolve(__dirname, 'src/entry/ext/background.ts'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
