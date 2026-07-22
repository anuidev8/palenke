//#region src/auto-install.d.ts
type PackageManager = (typeof managers)[number];
declare const managers: readonly ["npm", "yarn", "bun", "pnpm"];
//#endregion
//#region src/constants.d.ts
interface TemplateInfo {
  value: '+next+fuma-docs-mdx' | 'astro' | 'waku' | 'react-router' | 'react-router-spa' | 'tanstack-start' | 'tanstack-start-spa' | '+next+fuma-docs-mdx+static';
  label: string;
  appDir: string;
  /**
   * path to root provider, relative to `appDir``
   */
  rootProviderPath: string;
  hint?: string;
  /**
   * rename files when copying from template
   */
  rename?: (name: string) => string;
}
//#endregion
//#region src/index.d.ts
type Template = TemplateInfo['value'];
interface Options {
  outputDir: string;
  template: Template;
  /**
   * the package manager to use
   *
   * @defaultValue 'npm'
   */
  packageManager?: PackageManager;
  installDeps?: boolean;
  initializeGit?: boolean;
  log?: (message: string) => void;
  plugins?: TemplatePlugin[];
}
interface TemplatePluginContext {
  template: TemplateInfo;
  log: (message: string) => void;
  /**
   * output directory
   */
  dest: string;
  /**
   * output directory for app code (e.g. under `/src`)
   */
  appDir: string;
}
type PackageJsonType = {
  name?: string;
  version?: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} & Record<string, unknown>;
type Awaitable<T> = T | Promise<T>;
interface TemplatePlugin {
  template?: (this: Pick<TemplatePluginContext, 'dest'>, info: TemplateInfo) => Awaitable<void | TemplateInfo>;
  packageJson?: (this: TemplatePluginContext, packageJson: PackageJsonType) => Awaitable<void | PackageJsonType>;
  afterWrite?: (this: TemplatePluginContext) => Awaitable<void>;
  readme?: (this: TemplatePluginContext, content: string) => Awaitable<void | string>;
}
declare function create(createOptions: Options): Promise<void>;
//#endregion
export { TemplatePluginContext as a, TemplatePlugin as i, PackageJsonType as n, create as o, Template as r, Options as t };
//# sourceMappingURL=index-Dw7e2NvW.d.ts.map