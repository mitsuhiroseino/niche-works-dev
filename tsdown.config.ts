import distPackage from '@niche-works/rollup-plugin-dist-package';
import fs from 'fs-extra';
import path from 'path';
import { defineConfig } from 'tsdown';

export default defineConfig((options) => ({
  entry: ['./src/**/*.ts'],
  unbundle: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: false,
  inputOptions: {
    external(source, _importer, isResolved) {
      if (!isResolved) {
        return (
          !source.startsWith('.') &&
          !source.startsWith('/') &&
          !source.startsWith('src/')
        );
      }
    },
  },
  plugins: [
    distPackage({
      content: {
        exports: {
          '.': {
            import: './index.mjs',
            require: './index.cjs',
          },
          './*': {
            import: './*/index.mjs',
            require: './*/index.cjs',
          },
          './constants': {
            import: './constants.mjs',
            require: './constants.cjs',
          },
          './*/constants': {
            import: './*/constants.mjs',
            require: './*/constants.cjs',
          },
        },
      },
    }),
    {
      name: 'post-build',
      async closeBundle() {
        const outDir = options?.outDir ?? 'dist';
        await Promise.all([
          // その他のファイルのコピー
          fs.copyFile('LICENSE', path.join(outDir, 'LICENSE')),
          fs.copyFile('README.md', path.join(outDir, 'README.md')),
        ]);
      },
    },
  ],
}));
