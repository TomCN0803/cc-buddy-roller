import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'cc-buddy-roller': 'src/cli.ts',
    'cc-buddy-roller-server': 'src/server.ts',
  },
  format: 'esm',
  target: 'es2022',
  outDir: 'dist',
  clean: true,
});
