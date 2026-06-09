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
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, './src/shared'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/shared/hooks'),
      '@types': resolve(__dirname, './src/shared/types'),
      '@components': resolve(__dirname, './src/shared/components'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        devtools: resolve(__dirname, 'devtools.html'),
        panel: resolve(__dirname, 'panel.html'),
        preview: resolve(__dirname, 'preview.html'),
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
