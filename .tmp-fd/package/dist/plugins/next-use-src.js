import fs from "node:fs/promises";
import path from "node:path";
//#region src/plugins/next-use-src.ts
/**
* Use `src` for app directory
*/
function nextUseSrc() {
	return {
		template(info) {
			if (!info.value.startsWith("+next")) return;
			return {
				...info,
				appDir: "src",
				rename: (file) => {
					if (isRelative(path.join(this.dest, "app"), file) || isRelative(path.join(this.dest, "lib"), file) || isRelative(path.join(this.dest, "components"), file)) return path.join(this.dest, "src", path.relative(this.dest, file));
					return file;
				}
			};
		},
		async afterWrite() {
			if (!this.template.value.startsWith("+next")) return;
			const tsconfigPath = path.join(this.dest, "tsconfig.json");
			const content = await fs.readFile(tsconfigPath, "utf-8");
			const config = JSON.parse(content);
			if (config.compilerOptions?.paths) Object.assign(config.compilerOptions.paths, { "@/*": ["./src/*"] });
			await fs.writeFile(tsconfigPath, JSON.stringify(config, null, 2));
		}
	};
}
function isRelative(dir, file) {
	return !path.relative(dir, file).startsWith(`..${path.sep}`);
}
//#endregion
export { nextUseSrc };

//# sourceMappingURL=next-use-src.js.map