import fs from 'fs-extra';
import path from 'path';
import isTargetPath from '../isTargetPath';
import type { MoveFilesToSubdirOptions } from './types';

/**
 * 対象のディレクトリ直下のファイルを、拡張子を除いた同名のサブディレクトリ直下に移動する
 * @param dirPath 対象のディレクトリのパス
 */
export default async function moveFilesToSubdir(
  dirPath: string,
  options: MoveFilesToSubdirOptions = {},
) {
  const { process, index, ...rest } = options;
  const items = await fs.readdir(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    if (isTargetPath(itemPath, rest)) {
      const { name, ext } = path.parse(item);
      // 移動先のディレクトリパスを生成
      const subdirPath = path.join(dirPath, name);
      // 移動先のディレクトリが存在しなければ作成
      fs.ensureDirSync(subdirPath);
      // 移動
      fs.moveSync(itemPath, path.join(subdirPath, item));
      if (index) {
        fs.writeFileSync(
          path.join(subdirPath, `index.${ext}`),
          `export { default } from ${name}`,
          {
            encoding: 'utf8',
          },
        );
      }
      if (process) {
        process(subdirPath, item);
      }
    }
  }
}
