export type VerOptions = {
  /**
   * ワークスペースのパッケージjsonのパス
   * @default `./package.json`
   */
  workspacePackageJsonPath?: string;

  /**
   * パッケージが置かれたディレクトリのパス
   * @default `./packages`
   */
  packagesPath?: string;
};
