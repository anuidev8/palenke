import { t as depVersions } from "../constants-UZ9hhOMa.js";
import { n as pick } from "../utils-BZh9vMXJ.js";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
//#region src/plugins/next-use-takumi.ts
function nextUseTakumi() {
	return {
		packageJson(packageJson) {
			if (this.template.value.startsWith("+next")) return {
				...packageJson,
				dependencies: {
					...packageJson.dependencies,
					...pick(depVersions, ["takumi-js"])
				}
			};
			return packageJson;
		},
		async afterWrite() {
			if (this.template.value.startsWith("+next")) {
				await replaceImports(this);
				await replaceImagePath(this);
				await nextConfigExternal(this);
			}
		}
	};
}
async function replaceImports(context) {
	const path = join(context.appDir, "app/og/docs/[...slug]/route.tsx");
	await writeFile(path, (await readFile(path, "utf-8")).replaceAll("next/og", "takumi-js/response").replaceAll("fumadocs-ui/og", "fumadocs-ui/og/takumi").replace("height: 630,", "height: 630,\n      format: 'webp',"));
}
async function replaceImagePath(context) {
	const path = join(context.appDir, "lib/source.ts");
	await writeFile(path, (await readFile(path, "utf-8")).replaceAll("image.png", "image.webp"));
}
async function nextConfigExternal(context) {
	const path = join(context.dest, "next.config.mjs");
	await writeFile(path, (await readFile(path, "utf-8")).replace("const config = {", `const config = {
  serverExternalPackages: ['@takumi-rs/core'],`));
}
//#endregion
export { nextUseTakumi };

//# sourceMappingURL=next-use-takumi.js.map