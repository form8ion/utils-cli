const packageScope = '@form8ion';

export const javascriptConfigs = {
  eslint: {scope: packageScope},
  remark: `${packageScope}/remark-lint-preset`,
  babelPreset: {
    name: packageScope,
    packageName: `${packageScope}/babel-preset`
  },
  typescript: {scope: packageScope},
  commitlint: {
    name: packageScope,
    packageName: `${packageScope}/commitlint-config`
  }
};
