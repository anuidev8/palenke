import { r as sourceDir, t as depVersions } from "../constants-UZ9hhOMa.js";
import { i as writeFile$1, n as pick, t as copy } from "../utils-BZh9vMXJ.js";
import { n as getCodeValue, t as createSourceFile } from "../shared-Bilr6W8M.js";
import fs from "node:fs/promises";
import path from "node:path";
import { StructureKind, SyntaxKind, ts } from "ts-morph";
//#region src/transform/react-router.ts
var SyntaxKind$1 = ts.SyntaxKind;
/**
* filter items in a specific array initializer in the prerender function
*/
function filterReactRouterPrerenderArray(sourceFile, array, filter) {
	const methodBody = getPrerenderMethod(sourceFile)?.getBody();
	if (!methodBody) return;
	const initializer = methodBody.getDescendantsOfKind(SyntaxKind$1.VariableDeclaration).find((item) => item.getName() === array)?.getInitializerIfKind(SyntaxKind$1.ArrayLiteralExpression);
	if (!initializer) return;
	for (const element of initializer.getElements()) if (!filter(getCodeValue(element.getText()))) initializer.removeElement(element);
}
/**
* Add a new route to route config
*/
function addReactRouterRoute(sourceFile, routes) {
	modifyReactRouterRoutes(sourceFile, (arr) => {
		for (const { path, entry } of routes) arr.addElement(`route('${path}', '${entry}')`);
	});
}
/**
* Remove routes from route config (root level only)
*/
function filterReactRouterRoute(sourceFile, filter) {
	modifyReactRouterRoutes(sourceFile, (arr) => {
		for (const element of arr.getElements()) {
			if (!element.isKind(SyntaxKind$1.CallExpression) || element.getFirstChildByKind(SyntaxKind$1.Identifier)?.getText() !== "route") continue;
			const args = element.getArguments();
			if (filter({
				path: getCodeValue(args[0].getText()),
				entry: getCodeValue(args[1].getText())
			})) continue;
			arr.removeElement(element);
		}
	});
}
function modifyReactRouterRoutes(sourceFile, mod) {
	const initializer = sourceFile.getDefaultExportSymbol()?.getValueDeclaration()?.getFirstDescendantByKind(SyntaxKind$1.ArrayLiteralExpression);
	if (initializer) mod(initializer);
}
/**
* Find the prerender method from the config
*/
function getPrerenderMethod(sourceFile) {
	return sourceFile.getDefaultExportSymbol()?.getValueDeclaration()?.getFirstDescendantByKind(SyntaxKind$1.ObjectLiteralExpression)?.getProperty("prerender")?.asKind(SyntaxKind$1.MethodDeclaration) ?? null;
}
//#endregion
//#region src/transform/tanstack-start.ts
/**
* Add path to the `pages` array in tanstack start vite config.
*
* If the `pages` property doesn't exist, create one.
*/
function addTanstackPrerender(sourceFile, paths) {
	const optionsArg = getTanstackStartCall(sourceFile)?.getArguments()[0]?.asKind(SyntaxKind.ObjectLiteralExpression);
	if (!optionsArg) return;
	const pagesProperty = optionsArg.getProperty("pages")?.asKind(SyntaxKind.PropertyAssignment);
	function toItem(path) {
		return `{ path: '${path}' }`;
	}
	if (pagesProperty) {
		const initializer = pagesProperty.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
		const existingPaths = /* @__PURE__ */ new Set();
		for (const element of initializer.getElements()) {
			const value = element.asKind(SyntaxKind.ObjectLiteralExpression)?.getProperty("path")?.asKind(SyntaxKind.PropertyAssignment)?.getInitializer()?.getText();
			if (value) existingPaths.add(getCodeValue(value));
		}
		for (const path of paths) {
			if (existingPaths.has(path)) continue;
			initializer.addElement(toItem(path));
		}
	} else optionsArg.addProperty(`pages: [\n${paths.map((path) => `  ${toItem(path)}`).join(",\n")}\n]`);
}
/**
* Find the tanstackStart call expression
*/
function getTanstackStartCall(sourceFile) {
	const pluginsProperty = sourceFile.getDefaultExportSymbol()?.getValueDeclaration()?.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression)?.getProperty("plugins")?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
	if (!pluginsProperty) return;
	for (const element of pluginsProperty.getElements()) {
		const expression = element.asKind(SyntaxKind.CallExpression);
		if (expression?.getFirstChildByKind(SyntaxKind.Identifier)?.getText() === "tanstackStart") return expression;
	}
}
//#endregion
//#region src/transform/index.ts
async function rootProvider({ appDir, template }, fn) {
	const file = await createSourceFile(path.join(appDir, template.rootProviderPath));
	fn({ addSearchDialog(specifier) {
		const elements = file.getDescendantsOfKind(SyntaxKind.JsxElement);
		for (const element of elements) {
			const provider = element.getFirstChildByKind(SyntaxKind.JsxOpeningElement);
			if (provider?.getTagNameNode().getText() !== "RootProvider") continue;
			if (provider.getAttributes().some((attr) => attr.isKind(SyntaxKind.JsxAttribute) && attr.getNameNode().getText() === "search")) continue;
			provider.addAttribute({
				kind: StructureKind.JsxAttribute,
				name: "search",
				initializer: "{{ SearchDialog }}"
			});
			file.addImportDeclaration({
				moduleSpecifier: specifier,
				defaultImport: "SearchDialog"
			});
			break;
		}
	} });
	await file.save();
}
async function reactRouterRoutes({ dest, appDir }, fn) {
	const configFile = await createSourceFile(path.join(dest, "react-router.config.ts"));
	const routesFile = await createSourceFile(path.join(appDir, "routes.ts"));
	const tasks = [];
	function normalizePath(v) {
		return v.split("/").filter(Boolean).join("/");
	}
	fn({
		addRoute: (p, entry, code) => {
			addReactRouterRoute(routesFile, [{
				path: p,
				entry
			}]);
			if (code) tasks.push(fs.writeFile(path.join(appDir, entry), code));
		},
		removeRoute: (p) => {
			const normalizedPath = normalizePath(p);
			filterReactRouterRoute(routesFile, (item) => {
				if (normalizePath(item.path) !== normalizedPath) return true;
				tasks.push(fs.unlink(path.join(appDir, item.entry)).catch(() => null));
				return false;
			});
			filterReactRouterPrerenderArray(configFile, "excluded", (item) => normalizePath(item) !== normalizedPath);
			filterReactRouterPrerenderArray(configFile, "paths", (item) => normalizePath(item) !== normalizedPath);
		}
	});
	await Promise.all([
		...tasks,
		routesFile.save(),
		configFile.save()
	]);
}
async function tanstackStartRoutes({ appDir, dest }, fn) {
	const configFile = await createSourceFile(path.join(dest, "vite.config.ts"));
	const tasks = [];
	fn({
		addRoute(options) {
			if (options.code) tasks.push(fs.writeFile(path.join(appDir, "routes", options.path), options.code));
			if (options.prerender) addTanstackPrerender(configFile, [options.route]);
		},
		removeRoute(options) {
			tasks.push(fs.unlink(path.join(appDir, "routes", options.path)).catch(() => null));
		}
	});
	await Promise.all([...tasks, configFile.save()]);
}
//#endregion
//#region src/plugins/orama-cloud.ts
function oramaCloud() {
	return {
		packageJson(packageJson) {
			return {
				...packageJson,
				scripts: {
					...packageJson.scripts,
					build: `${packageJson.scripts.build} && bun scripts/sync-content.ts`
				},
				dependencies: {
					...packageJson.dependencies,
					...pick(depVersions, ["@orama/core"])
				}
			};
		},
		readme(content) {
			return `${content}\n\n## Orama Cloud
    
This project uses Orama Cloud for 3rd party search solution.

See https://fumadocs.dev/docs/headless/search/orama-cloud for integrating Orama Cloud to Fumadocs.`;
		},
		async afterWrite() {
			const { dest, appDir, template } = this;
			await copy(path.join(sourceDir, "template/+orama-cloud/@root"), dest);
			await copy(path.join(sourceDir, "template/+orama-cloud/@app"), appDir);
			await rootProvider(this, (mod) => mod.addSearchDialog("@/components/search"));
			if (template.value === "tanstack-start") await tanstackStartRoutes(this, (mod) => {
				mod.addRoute({
					path: "static[.]json.ts",
					route: "/static.json",
					code: route.tanstack,
					prerender: true
				});
				mod.removeRoute({
					path: "api/search.ts",
					route: "/api/search"
				});
			});
			else if (template.value.startsWith("react-router")) await reactRouterRoutes(this, (mod) => {
				mod.addRoute("static.json", "routes/static.ts", route["react-router"]);
				mod.removeRoute("api/search");
			});
			else if (template.value.startsWith("+next")) await Promise.all([fs.unlink(path.join(appDir, "app/api/search/route.ts")).catch(() => null), writeFile$1(path.join(appDir, "app/static.json/route.ts"), route.next)]);
			else if (template.value === "astro") await Promise.all([
				fs.unlink(path.join(appDir, "pages/api/search.ts")).catch(() => null),
				writeFile$1(path.join(appDir, "pages/static.json.ts"), route.astro),
				writeFile$1(path.join(appDir, "lib/export-static-indexes.ts"), astroExportSearchIndexes)
			]);
			else await Promise.all([fs.unlink(path.join(appDir, "pages/_api/api/search.ts")).catch(() => null), writeFile$1(path.join(appDir, "pages/_api/static.json.ts"), route.waku)]);
			const filePath = {
				"+next+fuma-docs-mdx": ".next/server/app/static.json.body",
				"+next+fuma-docs-mdx+static": ".next/server/app/static.json.body",
				"tanstack-start": ".output/public/static.json",
				"tanstack-start-spa": "dist/client/static.json",
				"react-router": "build/client/static.json",
				"react-router-spa": "build/client/static.json",
				astro: "dist/static.json",
				waku: "dist/public/static.json"
			}[template.value];
			await writeFile$1(path.join(dest, "scripts/sync-content.ts"), `import { type OramaDocument, sync } from 'fumadocs-core/search/orama-cloud';
import * as fs from 'node:fs/promises';
import { OramaCloud } from '@orama/core';

// the path of pre-rendered \`static.json\`
const filePath = '${filePath}';

async function main() {
  const orama = new OramaCloud({
    projectId: process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID,
    apiKey: process.env.ORAMA_PRIVATE_API_KEY,
  });

  const content = await fs.readFile(filePath);
  const records = JSON.parse(content.toString()) as OramaDocument[];

  await sync(orama, {
    index: process.env.NEXT_PUBLIC_ORAMA_DATASOURCE_ID,
    documents: records,
  });

  console.log(\`search updated: \${records.length} records\`);
}

void main();`);
		}
	};
}
const route = {
	next: `import { exportSearchIndexes } from '@/lib/export-search-indexes';

export const revalidate = false;

export async function GET() {
  return Response.json(await exportSearchIndexes());
}`,
	"react-router": `import { exportSearchIndexes } from '@/lib/export-search-indexes';

export async function loader() {
  return Response.json(await exportSearchIndexes());
}`,
	tanstack: `import { createFileRoute } from '@tanstack/react-router';
import { exportSearchIndexes } from '@/lib/export-search-indexes';

export const Route = createFileRoute('/static.json')({
  server: {
    handlers: {
      GET: async () => Response.json(await exportSearchIndexes()),
    },
  },
});`,
	waku: `import { exportSearchIndexes } from '@/lib/export-search-indexes';

export async function GET() {
  return Response.json(await exportSearchIndexes());
}

export const getConfig = () => ({
  render: 'static',
});`,
	astro: `import type { APIRoute } from 'astro';
import { exportSearchIndexes } from '@/lib/export-static-indexes';

export const GET: APIRoute = async () => {
  return Response.json(await exportSearchIndexes());
};`
};
const astroExportSearchIndexes = `import { getStructuredData, source } from '@/lib/source';
import type { OramaDocument } from 'fumadocs-core/search/orama-cloud';

export async function exportSearchIndexes() {
  return source.getPages().map((page) => {
    return {
      id: page.url,
      structured: getStructuredData(page.data._raw),
      url: page.url,
      title: page.data.title,
      description: page.data.description,
    } satisfies OramaDocument;
  });
}
`;
//#endregion
export { oramaCloud };

//# sourceMappingURL=orama-cloud.js.map