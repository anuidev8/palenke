import { t as depVersions } from "../constants-UZ9hhOMa.js";
import { n as pick } from "../utils-BZh9vMXJ.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
//#region src/plugins/oxlint.ts
const reactVersion = depVersions.react.replace("^", "");
const baseConfig = {
	$schema: "./node_modules/oxlint/configuration_schema.json",
	plugins: [
		"typescript",
		"react",
		"import"
	],
	categories: {},
	env: { builtin: true },
	settings: {
		react: { version: reactVersion },
		tailwindcss: { callees: [
			"clsx",
			"cva",
			"cn"
		] }
	},
	ignorePatterns: ["node_modules/", "dist/"]
};
const nextConfig = {
	$schema: "./node_modules/oxlint/configuration_schema.json",
	plugins: [
		"typescript",
		"react",
		"import",
		"nextjs"
	],
	categories: {},
	env: { builtin: true },
	settings: {
		react: { version: reactVersion },
		tailwindcss: { callees: [
			"clsx",
			"cva",
			"cn"
		] }
	},
	ignorePatterns: ["node_modules/", "dist/"]
};
function oxlint() {
	return {
		packageJson(packageJson) {
			return {
				...packageJson,
				scripts: {
					...packageJson.scripts,
					lint: "oxlint"
				},
				devDependencies: {
					...packageJson.devDependencies,
					...pick(depVersions, ["oxlint"])
				}
			};
		},
		async afterWrite() {
			const config = this.template.value.startsWith("+next") ? nextConfig : baseConfig;
			await writeFile(path.join(this.dest, ".oxlintrc.json"), JSON.stringify(config, null, 2));
			this.log("Configured Oxlint");
		}
	};
}
//#endregion
export { oxlint };

//# sourceMappingURL=oxlint.js.map