import fs from 'fs-extra';
import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/**/*.ts'],
  bundle: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: false,
  external: [/node_modules/],
  plugins: [
    {
      name: 'copy-packagejson',
      async buildEnd(context) {
        const packageJson = await fs.readJSON('./package.json');
        const distPackageJson = {
          name: packageJson.name,
          version: packageJson.version,
          keywords: packageJson.keywords,
          repository: packageJson.repository,
          license: packageJson.license,
          author: packageJson.author,
          type: packageJson.type,
          exports: {
            '.': {
              import: './index.js',
              reqire: './index.cjs',
              type: './index.d.ts',
            },
            './*': {
              import: './*/index.js',
              reqire: './*/index.cjs',
              type: './*/index.d.ts',
            },
            './*/constants': {
              import: './*/constants.js',
              reqire: './*/constants.cjs',
              type: './*/constants.d.ts',
            },
          },
          dependencies: packageJson.dependencies,
        };
        const outDir = this.options?.outDir ?? 'dist';
        await fs.writeJSON(path.join(outDir, 'package.json'), distPackageJson, {
          spaces: 2,
        });
      },
    },
  ],
});
