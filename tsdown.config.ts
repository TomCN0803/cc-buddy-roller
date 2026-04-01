import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { 'cc-buddy-roller': 'src/cli.ts' },
  format: 'esm',
  target: 'es2022',
  outDir: 'dist',
  clean: true,
});
