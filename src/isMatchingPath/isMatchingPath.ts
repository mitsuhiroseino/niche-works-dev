import fs from 'fs-extra';
import { posix as path } from 'path';
import { isFunction, isString } from 'remeda';
import type { ConditionValues } from './_types';
import type { IsMatchingPathCondition, IsMatchingPathOptions } from './types';

/**
 * 処理対象のパスか判定する
 * @param targetPath 検査対象のパス
 * @param conditions 一致条件
 * @param options オプション
 * @returns 一致するか
 */
export default function isMatchingPath(
  targetPath: string,
  conditions:
    | IsMatchingPathCondition
    | IsMatchingPathCondition[]
    | null
    | undefined,
  options: IsMatchingPathOptions = {},
) {
  if (!conditions) {
    return false;
  }
  const conditionList = Array.isArray(conditions) ? conditions : [conditions];
  // パスは'/'区切り
  const posixPath = path.normalize(targetPath);
  const parsedPath = path.parse(posixPath);
  const parsedDir = path.parse(parsedPath.dir);
  const values = {
    path: posixPath,
    ...parsedPath,
    dirpath: parsedPath.dir,
    dirbase: parsedDir.base,
    dirname: parsedDir.name,
    dirext: parsedDir.ext,
  };
  values.path = posixPath;

  for (const condition of conditionList) {
    if (_isMatching(values.path, values, condition, options)) {
      // conditionの内の何れかがtrueならば一致
      return true;
    }
  }
  return false;
}

function _isMatching(
  value: string,
  values: ConditionValues,
  condition: IsMatchingPathCondition,
  options: IsMatchingPathOptions,
): boolean {
  if (isString(condition)) {
    // 条件が文字列
    if (value.includes(condition)) {
      return true;
    }
  } else if (condition instanceof RegExp) {
    // 条件が正規表現
    if (condition.test(value)) {
      return true;
    }
  } else if (isFunction(condition)) {
    // 条件が関数
    return condition(values, options.conditionOptions ?? {});
  } else {
    // 条件が設定
    const { valueType = 'path', entryType = 'both', conditions } = condition;
    if (entryType !== 'both') {
      const stat = fs.statSync(values.path);
      if (
        (stat.isDirectory() && entryType !== 'dir') ||
        (stat.isFile() && entryType !== 'file')
      ) {
        return false;
      }
    }
    const conditionList = Array.isArray(conditions) ? conditions : [conditions];
    // 設定配下のconditionsはand条件
    return conditionList.every((cond) =>
      _isMatching(values[valueType], values, cond, options),
    );
  }
  return false;
}
