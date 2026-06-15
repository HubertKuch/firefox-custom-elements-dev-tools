import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    preact(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
    server: {
      deps: {
        inline: ['zustand'],
      },
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, './src/shared'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/shared/hooks'),
      '@types': resolve(__dirname, './src/shared/types'),
      '@components': resolve(__dirname, './src/shared/components'),
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
});
