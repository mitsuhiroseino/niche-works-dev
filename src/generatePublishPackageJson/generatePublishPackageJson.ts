import fs from 'fs-extra';
import type { GeneratePublishPackageJsonOptions } from './types';

async function generatePublishPackageJson(
  options: GeneratePublishPackageJsonOptions = {},
) {
  const {
    packageJsonPath = './package.json',
    outputPackageJsonPath = './dist/package.json',
    exports = {
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
      './constants': {
        import: './constants.js',
        reqire: './constants.cjs',
        type: './constants.d.ts',
      },
      './*/constants': {
        import: './*/constants.js',
        reqire: './*/constants.cjs',
        type: './*/constants.d.ts',
      },
    },
    transform = (pkgJson) => pkgJson,
    jsonReadOptions,
    jsonWriteOptions,
  } = options;
  const packageJson = await fs.readJSON(packageJsonPath, jsonReadOptions);
  const distPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    keywords: packageJson.keywords,
    repository: packageJson.repository,
    license: packageJson.license,
    author: packageJson.author,
    type: packageJson.type,
    exports,
    dependencies: packageJson.dependencies,
  };
  await fs.writeJSON(
    outputPackageJsonPath,
    transform(distPackageJson),
    jsonWriteOptions,
  );
}

export default generatePublishPackageJson;
