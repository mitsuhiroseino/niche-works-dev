import fs from 'fs-extra';
import path from 'path';
import { defineConfig } from 'tsdown';
import addJsExtensions from './src/addJsExtensions';
import generatePublishPackageJson from './src/generatePublishPackageJson';
import removeFiles from './src/removeFiles';

export default defineConfig((options) => ({
  entry: ['./src/**/*.ts'],
  unbundle: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: false,
  plugins: [
    {
      name: 'post-build',
      async buildEnd() {
        const opts = options ?? {};
        if (opts.watch) {
          return;
        }

        const outDir = opts.outDir ?? 'dist';
        await Promise.all([
          // import,requireの補完
          addJsExtensions(outDir),
          // package.jsonの編集
          generatePublishPackageJson({
            jsonWriteOptions: { spaces: 2 },
          }),
          // その他のファイルのコピー
          fs.copyFile('LICENSE', path.join(outDir, 'LICENSE')),
          fs.copyFile('README.md', path.join(outDir, 'README.md')),
        ]);
        await removeFiles(`${outDir}/**/*.d.cts`);
      },
    },
  ],
}));
