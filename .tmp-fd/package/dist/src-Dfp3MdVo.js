import { i as templates, r as sourceDir, t as depVersions } from "./constants-UZ9hhOMa.js";
import { r as tryGitInit, t as copy } from "./utils-BZh9vMXJ.js";
import fs from "node:fs/promises";
import path from "node:path";
import { x } from "tinyexec";
//#region src/auto-install.ts
const managers = [
	"npm",
	"yarn",
	"bun",
	"pnpm"
];
function getPackageManager() {
	const userAgent = process.env.npm_config_user_agent ?? "";
	if (userAgent.startsWith("yarn")) return "yarn";
	if (userAgent.startsWith("pnpm")) return "pnpm";
	if (userAgent.startsWith("bun")) return "bun";
	return "npm";
}
async function autoInstall(manager, dest) {
	await x(manager, ["install"], {
		throwOnError: true,
		nodeOptions: {
			env: {
				...process.env,
				NODE_ENV: "development",
				DISABLE_OPENCOLLECTIVE: "1"
			},
			cwd: dest
		}
	});
}
//#endregion
//#region src/index.ts
async function create(createOptions) {
	const { outputDir, plugins = [], packageManager = "npm", initializeGit = false, installDeps = false, log = console.log } = createOptions;
	let template = templates.find((item) => item.value === createOptions.template);
	for (const plugin of plugins) template = await plugin.template?.call({ dest: outputDir }, template) ?? template;
	const appDir = path.join(outputDir, template.appDir);
	const projectName = path.basename(outputDir);
	const pluginContext = {
		template,
		dest: outputDir,
		log,
		appDir
	};
	await copy(path.join(sourceDir, "template", template.value), outputDir, { rename(file) {
		file = file.replace("example.gitignore", ".gitignore");
		return template.rename?.(file) ?? file;
	} });
	const packageJsonPath = path.join(outputDir, "package.json");
	let packageJson = await initPackageJson(projectName, packageJsonPath);
	for (const plugin of plugins) packageJson = await plugin.packageJson?.call(pluginContext, packageJson) ?? packageJson;
	await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
	const readmePath = path.join(outputDir, "README.md");
	let readme = `# ${projectName}\n\n${await fs.readFile(readmePath)}`;
	for (const plugin of plugins) readme = await plugin.readme?.call(pluginContext, readme) ?? readme;
	await fs.writeFile(readmePath, readme);
	for (const plugin of plugins) await plugin.afterWrite?.call(pluginContext);
	if (installDeps) try {
		await autoInstall(packageManager, outputDir);
		log("Installed dependencies");
	} catch (err) {
		log(`Failed to install dependencies: ${err}`);
	}
	if (initializeGit && await tryGitInit(outputDir)) log("Initialized Git repository");
}
async function initPackageJson(projectName, packageJsonPath) {
	function replaceWorkspaceDeps(deps = {}) {
		for (const k in deps) if (deps[k].startsWith("workspace:") && k in depVersions) deps[k] = depVersions[k];
		return deps;
	}
	const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
	const dependencies = replaceWorkspaceDeps(packageJson.dependencies);
	const devDependencies = replaceWorkspaceDeps(packageJson.devDependencies);
	const scripts = { ...packageJson.scripts };
	if (dependencies["fumadocs-mdx"] || devDependencies["fumadocs-mdx"]) scripts.postinstall = "fumadocs-mdx";
	return {
		...packageJson,
		name: projectName,
		scripts,
		dependencies,
		devDependencies
	};
}
//#endregion
export { getPackageManager as n, managers as r, create as t };

//# sourceMappingURL=src-Dfp3MdVo.js.map