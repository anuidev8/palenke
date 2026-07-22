import fs from "node:fs/promises";
import { IndentationText, Project, QuoteKind } from "ts-morph";
//#region src/transform/shared.ts
const project = new Project({
	skipAddingFilesFromTsConfig: true,
	skipLoadingLibFiles: true,
	manipulationSettings: {
		indentationText: IndentationText.TwoSpaces,
		quoteKind: QuoteKind.Single
	}
});
async function createSourceFile(path) {
	return project.createSourceFile(path, await fs.readFile(path, "utf-8"), { overwrite: true });
}
function getCodeValue(v) {
	return new Function(`return ${v}`)();
}
//#endregion
export { getCodeValue as n, createSourceFile as t };

//# sourceMappingURL=shared-Bilr6W8M.js.map