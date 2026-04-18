import fs from 'fs-extra';
import path from 'path';
import { defineConfig } from 'tsup';
import generatePublishPackageJson from './src/generatePublishPackageJson';

export default defineConfig((options) => ({
  entry: ['./src/**/*.ts'],
  bundle: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: false,
  external: [/node_modules/],
  async onSuccess() {
    const opts = options ?? {};
    if (opts.watch) {
      return;
    }
    await generatePublishPackageJson({
      jsonWriteOptions: { spaces: 2 },
    });
    const outDir = opts.outDir ?? 'dist';
    await fs.copyFile('LICENSE', path.join(outDir, 'LICENSE'));
    await fs.copyFile('README.md', path.join(outDir, 'README.md'));
  },
}));
