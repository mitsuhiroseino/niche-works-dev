export type InstallFromLocalOptions = {
  /**
   * package.jsonのパス
   * @default './package.json'
   */
  packageJsonPath?: string;

  /**
   * node_modulesのパス
   * @default './node_modules'
   */
  nodeModulesPath?: string;

  /**
   * お試し
   * ファイルの操作は行わない
   */
  dryRun?: boolean;
};
