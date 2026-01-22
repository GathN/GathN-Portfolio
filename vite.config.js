import { resolve } from 'path'
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GathN-Portfolio/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        main: resolve(__dirname, 'main.html')
      }
    }
  }
});