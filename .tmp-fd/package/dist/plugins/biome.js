import { t as depVersions } from "../constants-UZ9hhOMa.js";
import { i as writeFile, n as pick } from "../utils-BZh9vMXJ.js";
import biome_base_default from "./biome.base.js";
import biome_next_default from "./biome.next.js";
import path from "node:path";
//#region src/plugins/biome.ts
function biome() {
	return {
		packageJson(packageJson) {
			return {
				...packageJson,
				scripts: {
					...packageJson.scripts,
					lint: "biome check",
					format: "biome format --write"
				},
				devDependencies: {
					...packageJson.devDependencies,
					...pick(depVersions, ["@biomejs/biome"])
				}
			};
		},
		async afterWrite() {
			const config = this.template.value.startsWith("+next") ? biome_next_default : biome_base_default;
			await writeFile(path.join(this.dest, "biome.json"), JSON.stringify(config, null, 2));
			this.log("Configured Biome");
		}
	};
}
//#endregion
export { biome };

//# sourceMappingURL=biome.js.map