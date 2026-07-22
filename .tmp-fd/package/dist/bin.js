#!/usr/bin/env node
import { i as templates, n as isCI } from "./constants-UZ9hhOMa.js";
import { n as getPackageManager, r as managers, t as create } from "./src-Dfp3MdVo.js";
import fs from "node:fs/promises";
import path from "node:path";
import { cancel, confirm, group, intro, isCancel, outro, select, spinner, text } from "@clack/prompts";
import pc from "picocolors";
import { Option, program } from "@commander-js/extra-typings";
//#region src/bin.ts
const command = program.argument("[name]", "the project name").option("--src", "(Next.js only) enable `src/` directory").option("--install", "install packages automatically").option("--no-git", "disable auto Git repository initialization").addOption(new Option("--linter <name>", "configure a linter/formatter, ESLint is currently Next.js only.").choices([
	"eslint",
	"oxlint",
	"biome"
])).addOption(new Option("--search <name>", "configure a search solution").choices(["orama", "orama-cloud"])).addOption(new Option("--og-image <name>", "configure OG image generation").choices(["next-og", "takumi"])).addOption(new Option("--ai-chat <name>", "configure AI chat").choices([
	"openrouter",
	"llmgateway",
	"inkeep"
])).addOption(new Option("--template <name>", "choose a template").choices(templates.map((item) => item.value))).addOption(new Option("--pm <name>", "choose a package manager").choices(managers).default(getPackageManager()));
async function main() {
	command.parse(process.argv);
	const defaultName = command.args[0];
	const config = command.opts();
	intro(pc.bgCyan(pc.bold("Create Fumadocs App")));
	const options = await group({
		name: async () => {
			if (defaultName) return defaultName;
			if (isCI) return "untitled";
			return text({
				message: "Project name",
				placeholder: "my-app",
				defaultValue: "my-app"
			});
		},
		template: async () => {
			if (config.template) return config.template;
			if (isCI) return "+next+fuma-docs-mdx";
			return select({
				message: "Choose a template",
				initialValue: "+next+fuma-docs-mdx",
				options: templates
			});
		},
		src: async ({ results }) => {
			if (config.src !== void 0) return config.src;
			if (isCI || !results.template?.startsWith("+next")) return false;
			return confirm({
				message: "Use `/src` directory?",
				initialValue: false
			});
		},
		lint: async ({ results }) => {
			if (config.linter !== void 0) return config.linter;
			if (isCI) return "disabled";
			return select({
				message: "Configure linter?",
				options: results.template?.startsWith("+next") ? [
					{
						value: "disabled",
						label: "Disabled"
					},
					{
						value: "eslint",
						label: "ESLint"
					},
					{
						value: "biome",
						label: "Biome"
					},
					{
						value: "oxlint",
						label: "Oxlint"
					}
				] : [
					{
						value: "disabled",
						label: "Disabled"
					},
					{
						value: "biome",
						label: "Biome"
					},
					{
						value: "oxlint",
						label: "Oxlint"
					}
				]
			});
		},
		search: async () => {
			if (config.search !== void 0) return config.search;
			if (isCI) return "orama";
			return select({
				message: "Choose a search solution?",
				options: [{
					value: "orama",
					label: "Default",
					hint: "local search powered by Orama, recommended"
				}, {
					value: "orama-cloud",
					label: "Orama Cloud",
					hint: "3rd party search solution, signup needed"
				}]
			});
		},
		ogImage: async ({ results }) => {
			if (config.ogImage !== void 0) return config.ogImage;
			if (!results.template?.startsWith("+next")) return "takumi";
			if (isCI) return "next/og";
			return select({
				message: "Configure Open Graph Image generation?",
				options: [{
					value: "next/og",
					label: "next/og",
					hint: "Next.js built-in solution"
				}, {
					value: "takumi",
					label: "Takumi",
					hint: "Output WebP format, framework-agnostic"
				}]
			});
		},
		aiChat: async ({ results }) => {
			if (config.aiChat !== void 0) return config.aiChat;
			if (isCI || results.template === "astro" || results.template === "+next+fuma-docs-mdx+static" || results.template.endsWith("-spa")) return false;
			return select({
				message: "Configure AI Chat?",
				options: [
					{
						value: false,
						label: "No"
					},
					{
						value: "openrouter",
						label: "AI SDK",
						hint: "default to OpenRouter"
					},
					{
						value: "llmgateway",
						label: "LLMGateway",
						hint: "open-source LLM gateway, API key required"
					},
					{
						value: "inkeep",
						label: "Inkeep AI",
						hint: "API key required"
					}
				]
			});
		},
		installDeps: async () => {
			if (config.install !== void 0) return config.install;
			if (isCI) return false;
			return confirm({ message: `Do you want to install packages automatically? (detected as ${config.pm})` });
		}
	}, { onCancel: () => {
		cancel("Installation Stopped.");
		process.exit(0);
	} });
	const projectName = options.name.toLowerCase().replace(/\s/, "-");
	if (options.template === "astro" && options.aiChat) {
		console.warn(pc.yellow("AI Chat is not supported by the Astro template yet, skipping it."));
		options.aiChat = false;
	}
	if (!isCI) await checkDir(projectName);
	const info = spinner();
	info.start(`Generating Project`);
	const plugins = [];
	if (options.src) {
		const { nextUseSrc } = await import("./plugins/next-use-src.js");
		plugins.push(nextUseSrc());
	}
	if (options.search === "orama-cloud") {
		const { oramaCloud } = await import("./plugins/orama-cloud.js");
		plugins.push(oramaCloud());
	}
	switch (options.lint) {
		case "eslint": {
			const { eslint } = await import("./plugins/eslint.js");
			plugins.push(eslint());
			break;
		}
		case "biome": {
			const { biome } = await import("./plugins/biome.js");
			plugins.push(biome());
			break;
		}
		case "oxlint": {
			const { oxlint } = await import("./plugins/oxlint.js");
			plugins.push(oxlint());
			break;
		}
	}
	if (options.ogImage === "takumi") {
		const { nextUseTakumi } = await import("./plugins/next-use-takumi.js");
		plugins.push(nextUseTakumi());
	}
	if (options.aiChat) {
		const { ai } = await import("./plugins/ai.js");
		plugins.push(ai(options.aiChat));
	}
	await create({
		packageManager: config.pm,
		template: options.template,
		outputDir: projectName,
		installDeps: options.installDeps,
		initializeGit: config.git,
		plugins,
		log: (message) => {
			info.message(message);
		}
	});
	info.stop("Project Generated");
	outro(pc.bgGreen(pc.bold("Done")));
	console.log(pc.bold("\nOpen the project"));
	console.log(pc.cyan(`cd ${projectName}`));
	console.log(pc.bold("\nRun Development Server"));
	if (config.pm === "npm" || config.pm === "bun") console.log(pc.cyan(`${config.pm} run dev`));
	else console.log(pc.cyan(`${config.pm} dev`));
	console.log(pc.bold("\nYou can now open the project and start writing documents"));
	process.exit(0);
}
async function checkDir(outputDir) {
	const destDir = await fs.readdir(outputDir).catch(() => null);
	if (!destDir || destDir.length === 0) return;
	const del = await confirm({ message: `directory ${outputDir} already exists, do you want to delete its files?` });
	if (isCancel(del)) {
		cancel();
		process.exit(1);
	}
	if (!del) return;
	const info = spinner();
	info.start(`Deleting files in ${outputDir}`);
	await Promise.all(destDir.map((item) => {
		return fs.rm(path.join(outputDir, item), {
			recursive: true,
			force: true
		});
	}));
	info.stop(`Deleted files in ${outputDir}`);
}
main().catch((e) => {
	console.error(e);
	process.exit(1);
});
//#endregion
export {};

//# sourceMappingURL=bin.js.map