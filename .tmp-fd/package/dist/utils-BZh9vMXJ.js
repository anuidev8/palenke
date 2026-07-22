import fs from "node:fs/promises";
import path, { join } from "node:path";
import { x } from "tinyexec";
//#region src/utils.ts
async function writeFile$1(file, content) {
	await fs.mkdir(path.dirname(file), { recursive: true });
	await fs.writeFile(file, content);
}
async function copy(from, to, options = {}) {
	const { rename = (s) => s, filterDir = () => true, filter = () => true } = options;
	const stats = await fs.stat(from);
	if (stats.isDirectory() && filterDir(from)) {
		const files = await fs.readdir(from);
		await Promise.all(files.map((file) => copy(path.join(from, file), path.join(to, file), options)));
	}
	if (stats.isFile() && filter(from)) {
		to = rename(to);
		await fs.mkdir(path.dirname(to), { recursive: true });
		await fs.copyFile(from, to);
	}
}
async function isInGitRepository(cwd) {
	const { exitCode } = await x("git", ["rev-parse", "--is-inside-work-tree"], { nodeOptions: { cwd } });
	return exitCode === 0;
}
async function isDefaultBranchSet(cwd) {
	const { exitCode } = await x("git", ["config", "init.defaultBranch"], { nodeOptions: { cwd } });
	return exitCode === 0;
}
async function tryGitInit(cwd) {
	const { exitCode } = await x("git", ["--version"]);
	if (exitCode !== 0) return false;
	if (await isInGitRepository(cwd)) return false;
	try {
		await x("git", ["init"], {
			throwOnError: true,
			nodeOptions: { cwd }
		});
		if (!await isDefaultBranchSet(cwd)) await x("git", [
			"checkout",
			"-b",
			"main"
		], {
			throwOnError: true,
			nodeOptions: { cwd }
		});
		await x("git", ["add", "-A"], {
			throwOnError: true,
			nodeOptions: { cwd }
		});
		await x("git", [
			"commit",
			"-m",
			"Initial commit from Create Fumadocs App"
		], {
			throwOnError: true,
			nodeOptions: { cwd }
		});
		return true;
	} catch {
		await fs.rm(join(cwd, ".git"), {
			recursive: true,
			force: true
		});
		return false;
	}
}
function pick(obj, keys) {
	const result = {};
	for (const key of keys) if (key in obj) result[key] = obj[key];
	return result;
}
//#endregion
export { writeFile$1 as i, pick as n, tryGitInit as r, copy as t };

//# sourceMappingURL=utils-BZh9vMXJ.js.map