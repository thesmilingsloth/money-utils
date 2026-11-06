import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      name: 'MoneyUtils',
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.cjs';
        return 'index.umd.js';
      },
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['decimal.js'],
      output: {
        exports: 'named',
        globals: {
          'decimal.js': 'Decimal',
        },
      },
    },
    target: ['es2020', 'chrome80', 'firefox80', 'safari14'],
    sourcemap: true,
    minify: 'terser',
  },
  plugins: [dts()],
});
