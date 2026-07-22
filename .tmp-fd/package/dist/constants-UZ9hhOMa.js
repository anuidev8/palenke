import { fileURLToPath } from "node:url";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region ../create-app-versions/package.json
var dependencies$3 = {
	"@biomejs/biome": "^2.5.5",
	"@orama/core": "^1.2.19",
	"fumadocs-core": "workspace:*",
	"fumadocs-mdx": "workspace:*",
	"fumadocs-ui": "workspace:*",
	"oxlint": "^1.74.0",
	"react": "^19.2.8",
	"takumi-js": "^2.4.0"
};
//#endregion
//#region ../core/package.json
var package_exports$2 = /* @__PURE__ */ __exportAll({
	author: () => author$2,
	bugs: () => bugs$1,
	default: () => package_default$2,
	dependencies: () => dependencies$2,
	description: () => description$2,
	devDependencies: () => devDependencies$2,
	exports: () => exports$2,
	files: () => files$2,
	homepage: () => homepage$2,
	inlinedDependencies: () => inlinedDependencies$1,
	keywords: () => keywords$2,
	license: () => license$2,
	name: () => name$2,
	peerDependencies: () => peerDependencies$2,
	peerDependenciesMeta: () => peerDependenciesMeta$2,
	publishConfig: () => publishConfig$2,
	repository: () => repository$2,
	scripts: () => scripts$2,
	type: () => type$2,
	version: () => version$2
});
var name$2 = "fumadocs-core";
var version$2 = "16.12.0";
var description$2 = "The React.js library for building a documentation website";
var keywords$2 = ["Docs", "Fumadocs"];
var homepage$2 = "https://fumadocs.dev";
var bugs$1 = { "url": "https://github.com/fuma-nama/fumadocs/issues" };
var license$2 = "MIT";
var author$2 = "Fuma Nama";
var repository$2 = "github:fuma-nama/fumadocs";
var files$2 = ["dist"];
var type$2 = "module";
var exports$2 = {
	"./breadcrumb": "./dist/breadcrumb.js",
	"./content/github": "./dist/content/github.js",
	"./content/md": "./dist/content/md.js",
	"./content/md/frontmatter": "./dist/content/md/frontmatter.js",
	"./content/mdx/preset-bundler": "./dist/content/mdx/preset-bundler.js",
	"./content/mdx/preset-runtime": "./dist/content/mdx/preset-runtime.js",
	"./content/toc": "./dist/content/toc.js",
	"./dynamic-link": "./dist/dynamic-link.js",
	"./framework": "./dist/framework/index.js",
	"./framework/astro": "./dist/framework/astro.js",
	"./framework/next": "./dist/framework/next.js",
	"./framework/react-router": "./dist/framework/react-router.js",
	"./framework/tanstack": "./dist/framework/tanstack.js",
	"./framework/waku": "./dist/framework/waku.js",
	"./highlight": "./dist/highlight/index.js",
	"./highlight/client": "./dist/highlight/client.js",
	"./highlight/shiki": "./dist/highlight/shiki/index.js",
	"./highlight/shiki/full": "./dist/highlight/shiki/full.js",
	"./highlight/shiki/react": "./dist/highlight/shiki/react.js",
	"./i18n": "./dist/i18n/index.js",
	"./i18n/middleware": "./dist/i18n/middleware.js",
	"./link": "./dist/link.js",
	"./mdx-plugins": "./dist/mdx-plugins/index.js",
	"./mdx-plugins/codeblock-utils": "./dist/mdx-plugins/codeblock-utils.js",
	"./mdx-plugins/rehype-code": "./dist/mdx-plugins/rehype-code.js",
	"./mdx-plugins/rehype-code.core": "./dist/mdx-plugins/rehype-code.core.js",
	"./mdx-plugins/rehype-toc": "./dist/mdx-plugins/rehype-toc.js",
	"./mdx-plugins/remark-admonition": "./dist/mdx-plugins/remark-admonition.js",
	"./mdx-plugins/remark-block-id": "./dist/mdx-plugins/remark-block-id.js",
	"./mdx-plugins/remark-code-tab": "./dist/mdx-plugins/remark-code-tab.js",
	"./mdx-plugins/remark-directive-admonition": "./dist/mdx-plugins/remark-directive-admonition.js",
	"./mdx-plugins/remark-feedback-block": "./dist/mdx-plugins/remark-feedback-block.js",
	"./mdx-plugins/remark-gfm": "./dist/mdx-plugins/remark-gfm.js",
	"./mdx-plugins/remark-heading": "./dist/mdx-plugins/remark-heading.js",
	"./mdx-plugins/remark-image": "./dist/mdx-plugins/remark-image.js",
	"./mdx-plugins/remark-llms": "./dist/mdx-plugins/remark-llms.js",
	"./mdx-plugins/remark-llms.runtime": "./dist/mdx-plugins/remark-llms.runtime.js",
	"./mdx-plugins/remark-mdx-files": "./dist/mdx-plugins/remark-mdx-files.js",
	"./mdx-plugins/remark-mdx-mermaid": "./dist/mdx-plugins/remark-mdx-mermaid.js",
	"./mdx-plugins/remark-npm": "./dist/mdx-plugins/remark-npm.js",
	"./mdx-plugins/remark-steps": "./dist/mdx-plugins/remark-steps.js",
	"./mdx-plugins/remark-structure": "./dist/mdx-plugins/remark-structure.js",
	"./mdx-plugins/stringifier": "./dist/mdx-plugins/stringifier.js",
	"./mdx-plugins/transformer-icon": "./dist/mdx-plugins/transformer-icon.js",
	"./negotiation": "./dist/negotiation/index.js",
	"./page-tree": "./dist/page-tree/index.js",
	"./search": "./dist/search/index.js",
	"./search/algolia": "./dist/search/algolia.js",
	"./search/client": "./dist/search/client.js",
	"./search/client/algolia": "./dist/search/client/algolia.js",
	"./search/client/fetch": "./dist/search/client/fetch.js",
	"./search/client/flexsearch-static": "./dist/search/client/flexsearch-static.js",
	"./search/client/mixedbread": "./dist/search/client/mixedbread.js",
	"./search/client/orama-cloud": "./dist/search/client/orama-cloud.js",
	"./search/client/orama-cloud-legacy": "./dist/search/client/orama-cloud-legacy.js",
	"./search/client/orama-static": "./dist/search/client/orama-static.js",
	"./search/flexsearch": "./dist/search/flexsearch.js",
	"./search/mixedbread": "./dist/search/mixedbread.js",
	"./search/orama-cloud": "./dist/search/orama-cloud.js",
	"./search/orama-cloud-legacy": "./dist/search/orama-cloud-legacy.js",
	"./search/server": "./dist/search/server.js",
	"./source": "./dist/source/index.js",
	"./source/client": "./dist/source/client/index.js",
	"./source/dynamic": "./dist/source/dynamic.js",
	"./source/llms": "./dist/source/llms.js",
	"./source/plugins/lucide-icons": "./dist/source/plugins/lucide-icons.js",
	"./source/plugins/slugs": "./dist/source/plugins/slugs.js",
	"./source/plugins/status-badges": "./dist/source/plugins/status-badges.js",
	"./source/schema": "./dist/source/schema.js",
	"./toc": "./dist/toc.js",
	"./utils/use-media-query": "./dist/utils/use-media-query.js",
	"./utils/use-on-change": "./dist/utils/use-on-change.js",
	"./package.json": "./package.json",
	"./source/*": {
		"types": "./dist/source/plugins/*.d.ts",
		"import": "./dist/source/plugins/*.js"
	}
};
var publishConfig$2 = { "access": "public" };
var scripts$2 = {
	"build": "tsdown",
	"clean": "rimraf dist",
	"dev": "tsdown --watch --clean false",
	"lint": "oxlint .",
	"types:check": "tsc --noEmit"
};
var dependencies$2 = {
	"@orama/orama": "^3.1.18",
	"estree-util-value-to-estree": "^3.5.0",
	"github-slugger": "^2.0.0",
	"hast-util-to-estree": "^3.1.3",
	"hast-util-to-jsx-runtime": "^2.3.6",
	"mdast-util-mdx": "^3.0.0",
	"mdast-util-to-markdown": "^2.1.2",
	"npm-to-yarn": "3.1.0",
	"remark": "^15.0.1",
	"remark-gfm": "^4.0.1",
	"remark-rehype": "^11.1.2",
	"scroll-into-view-if-needed": "^3.1.0",
	"shiki": "^4.3.1",
	"tinyglobby": "^0.2.17",
	"unified": "^11.0.5",
	"unist-util-visit": "^5.1.0",
	"vfile": "^6.0.3",
	"yaml": "^2.9.0"
};
var devDependencies$2 = {
	"@formatjs/intl-localematcher": "^0.8.13",
	"@mdx-js/mdx": "^3.1.1",
	"@mixedbread/sdk": "0.77.0",
	"@orama/core": "^1.2.19",
	"@oramacloud/client": "^2.1.4",
	"@shikijs/transformers": "^4.3.1",
	"@tanstack/react-router": "1.170.18",
	"@types/estree-jsx": "^1.0.5",
	"@types/hast": "^3.0.5",
	"@types/mdast": "^4.0.4",
	"@types/negotiator": "^0.6.4",
	"@types/node": "26.1.1",
	"@types/react": "^19.2.17",
	"@types/react-dom": "^19.2.3",
	"algoliasearch": "5.56.0",
	"flexsearch": "^0.8.212",
	"image-size": "^2.0.2",
	"lucide-react": "^1.25.0",
	"negotiator": "^1.0.0",
	"next": "16.2.11",
	"path-to-regexp": "^8.4.2",
	"react-router": "^8.3.0",
	"remark-directive": "^4.0.0",
	"remark-mdx": "^3.1.1",
	"remove-markdown": "^0.6.4",
	"tsconfig": "workspace:*",
	"tsdown": "0.22.13",
	"typescript": "^6.0.3",
	"waku": "1.0.0-beta.7",
	"zod": "4.4.3"
};
var peerDependencies$2 = {
	"@mdx-js/mdx": "*",
	"@mixedbread/sdk": "0.x.x",
	"@orama/core": "1.x.x",
	"@oramacloud/client": "2.x.x",
	"@tanstack/react-router": "1.x.x",
	"@types/estree-jsx": "*",
	"@types/hast": "*",
	"@types/mdast": "*",
	"@types/react": "*",
	"algoliasearch": "5.x.x",
	"flexsearch": "*",
	"lucide-react": "*",
	"next": "16.x.x",
	"react": "^19.2.0",
	"react-dom": "^19.2.0",
	"react-router": "7.x.x || 8.x.x",
	"waku": "*",
	"zod": "4.x.x"
};
var peerDependenciesMeta$2 = {
	"flexsearch": { "optional": true },
	"@mdx-js/mdx": { "optional": true },
	"@types/estree-jsx": { "optional": true },
	"@types/hast": { "optional": true },
	"@types/mdast": { "optional": true },
	"@mixedbread/sdk": { "optional": true },
	"@types/react": { "optional": true },
	"@orama/core": { "optional": true },
	"@oramacloud/client": { "optional": true },
	"algoliasearch": { "optional": true },
	"next": { "optional": true },
	"react": { "optional": true },
	"react-dom": { "optional": true },
	"react-router": { "optional": true },
	"waku": { "optional": true },
	"@tanstack/react-router": { "optional": true },
	"lucide-react": { "optional": true },
	"zod": { "optional": true }
};
var inlinedDependencies$1 = {
	"@formatjs/fast-memoize": "3.1.7",
	"@formatjs/intl-localematcher": "0.8.13",
	"@shikijs/transformers": "4.3.1",
	"image-size": "2.0.2",
	"negotiator": "1.0.0",
	"path-to-regexp": "8.4.2",
	"remove-markdown": "0.6.4"
};
var package_default$2 = {
	name: name$2,
	version: version$2,
	description: description$2,
	keywords: keywords$2,
	homepage: homepage$2,
	bugs: bugs$1,
	license: license$2,
	author: author$2,
	repository: repository$2,
	files: files$2,
	type: type$2,
	exports: exports$2,
	publishConfig: publishConfig$2,
	scripts: scripts$2,
	dependencies: dependencies$2,
	devDependencies: devDependencies$2,
	peerDependencies: peerDependencies$2,
	peerDependenciesMeta: peerDependenciesMeta$2,
	inlinedDependencies: inlinedDependencies$1
};
//#endregion
//#region ../mdx/package.json
var package_exports$1 = /* @__PURE__ */ __exportAll({
	author: () => author$1,
	bin: () => bin,
	bugs: () => bugs,
	default: () => package_default$1,
	dependencies: () => dependencies$1,
	description: () => description$1,
	devDependencies: () => devDependencies$1,
	exports: () => exports$1,
	files: () => files$1,
	homepage: () => homepage$1,
	keywords: () => keywords$1,
	license: () => license$1,
	name: () => name$1,
	peerDependencies: () => peerDependencies$1,
	peerDependenciesMeta: () => peerDependenciesMeta$1,
	publishConfig: () => publishConfig$1,
	repository: () => repository$1,
	scripts: () => scripts$1,
	type: () => type$1,
	version: () => version$1
});
var name$1 = "fumadocs-mdx";
var version$1 = "15.2.0";
var description$1 = "The built-in source for Fumadocs";
var keywords$1 = ["Docs", "fumadocs"];
var homepage$1 = "https://fumadocs.dev";
var bugs = { "url": "https://github.com/fuma-nama/fumadocs/issues" };
var license$1 = "MIT";
var author$1 = "Fuma Nama";
var repository$1 = "github:fuma-nama/fumadocs";
var bin = { "fumadocs-mdx": "./bin.js" };
var files$1 = ["dist", "bin.js"];
var type$1 = "module";
var exports$1 = {
	".": "./dist/index.js",
	"./bin": "./dist/bin.js",
	"./bun": "./dist/bun/index.js",
	"./config": "./dist/config/index.js",
	"./macro": "./dist/macro/index.js",
	"./next": "./dist/next/index.js",
	"./node": "./dist/node/index.js",
	"./node/_loader": "./dist/node/_loader.js",
	"./node/loader": "./dist/node/loader.js",
	"./plugins/index-file": "./dist/plugins/index-file.js",
	"./plugins/json-schema": "./dist/plugins/json-schema.js",
	"./plugins/last-modified": "./dist/plugins/last-modified.js",
	"./rolldown": "./dist/rolldown/index.js",
	"./runtime/browser": "./dist/runtime/browser.js",
	"./runtime/dynamic": "./dist/runtime/dynamic.js",
	"./runtime/macro": "./dist/runtime/macro.js",
	"./runtime/server": "./dist/runtime/server.js",
	"./runtime/types": "./dist/runtime/types.js",
	"./vite": "./dist/vite/index.js",
	"./webpack/macro": "./dist/webpack/macro.js",
	"./webpack/mdx": "./dist/webpack/mdx.js",
	"./webpack/meta": "./dist/webpack/meta.js",
	"./package.json": "./package.json"
};
var publishConfig$1 = { "access": "public" };
var scripts$1 = {
	"build": "tsdown",
	"clean": "rimraf dist",
	"dev": "tsdown --watch",
	"lint": "oxlint .",
	"types:check": "tsc --noEmit"
};
var dependencies$1 = {
	"@mdx-js/mdx": "^3.1.1",
	"@standard-schema/spec": "^1.1.0",
	"chokidar": "^5.0.0",
	"esbuild": "^0.28.1",
	"estree-util-value-to-estree": "^3.5.0",
	"github-slugger": "^2.0.0",
	"magic-string": "^1.0.0",
	"mdast-util-mdx": "^3.0.0",
	"picocolors": "^1.1.1",
	"picomatch": "^4.0.5",
	"tinyexec": "^1.2.4",
	"tinyglobby": "^0.2.17",
	"unified": "^11.0.5",
	"unist-util-remove-position": "^5.0.0",
	"unist-util-visit": "^5.1.0",
	"vfile": "^6.0.3",
	"yaml": "^2.9.0",
	"yuku-analyzer": "^0.7.3",
	"zod": "^4.4.3"
};
var devDependencies$1 = {
	"@fumadocs/satteri": "workspace:*",
	"@fumadocs/vite": "workspace:*",
	"@types/bun": "^1.3.14",
	"@types/mdast": "^4.0.4",
	"@types/mdx": "^2.0.14",
	"@types/node": "^26.1.1",
	"@types/picomatch": "^4.0.3",
	"@types/react": "^19.2.17",
	"fumadocs-core": "workspace:*",
	"mdast-util-directive": "^3.1.0",
	"next": "^16.2.11",
	"react": "^19.2.8",
	"remark": "^15.0.1",
	"remark-directive": "^4.0.0",
	"remark-mdx": "^3.1.1",
	"rolldown": "^1.2.0",
	"satteri": "^0.9.5",
	"tsconfig": "workspace:*",
	"tsdown": "0.22.13",
	"vite": "^8.1.5",
	"webpack": "^5.108.4"
};
var peerDependencies$1 = {
	"@fumadocs/satteri": "0.x.x",
	"@types/mdast": "*",
	"@types/mdx": "*",
	"@types/react": "*",
	"fumadocs-core": "^16.7.0",
	"mdast-util-directive": "*",
	"next": "^15.3.0 || ^16.0.0",
	"react": "^19.2.0",
	"rolldown": "*",
	"satteri": "^0.9.4",
	"vite": "7.x.x || 8.x.x"
};
var peerDependenciesMeta$1 = {
	"@fumadocs/satteri": { "optional": true },
	"satteri": { "optional": true },
	"rolldown": { "optional": true },
	"mdast-util-directive": { "optional": true },
	"@types/mdast": { "optional": true },
	"@types/mdx": { "optional": true },
	"react": { "optional": true },
	"@types/react": { "optional": true },
	"next": { "optional": true },
	"vite": { "optional": true }
};
var package_default$1 = {
	name: name$1,
	version: version$1,
	description: description$1,
	keywords: keywords$1,
	homepage: homepage$1,
	bugs,
	license: license$1,
	author: author$1,
	repository: repository$1,
	bin,
	files: files$1,
	type: type$1,
	exports: exports$1,
	publishConfig: publishConfig$1,
	scripts: scripts$1,
	dependencies: dependencies$1,
	devDependencies: devDependencies$1,
	peerDependencies: peerDependencies$1,
	peerDependenciesMeta: peerDependenciesMeta$1
};
//#endregion
//#region ../base-ui/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	author: () => author,
	default: () => package_default,
	dependencies: () => dependencies,
	description: () => description,
	devDependencies: () => devDependencies,
	exports: () => exports,
	files: () => files,
	homepage: () => homepage,
	inlinedDependencies: () => inlinedDependencies,
	keywords: () => keywords,
	license: () => license,
	name: () => name,
	peerDependencies: () => peerDependencies,
	peerDependenciesMeta: () => peerDependenciesMeta,
	publishConfig: () => publishConfig,
	repository: () => repository,
	scripts: () => scripts,
	type: () => type,
	version: () => version
});
var name = "@fumadocs/base-ui";
var version = "16.12.0";
var description = "The Base UI version of Fumadocs UI";
var keywords = ["Docs", "Fumadocs"];
var homepage = "https://fumadocs.dev";
var license = "MIT";
var author = "Fuma Nama";
var repository = "github:fuma-nama/fumadocs";
var files = ["css", "dist"];
var type = "module";
var exports = {
	"./components/accordion": "./dist/components/accordion.js",
	"./components/banner": "./dist/components/banner.js",
	"./components/callout": "./dist/components/callout.js",
	"./components/card": "./dist/components/card.js",
	"./components/codeblock": "./dist/components/codeblock.js",
	"./components/codeblock.rsc": "./dist/components/codeblock.rsc.js",
	"./components/dialog/search": "./dist/components/dialog/search.js",
	"./components/dialog/search-algolia": "./dist/components/dialog/search-algolia.js",
	"./components/dialog/search-default": "./dist/components/dialog/search-default.js",
	"./components/dialog/search-orama": "./dist/components/dialog/search-orama.js",
	"./components/dynamic-codeblock": "./dist/components/dynamic-codeblock.js",
	"./components/dynamic-codeblock.core": "./dist/components/dynamic-codeblock.core.js",
	"./components/files": "./dist/components/files.js",
	"./components/github-info": "./dist/components/github-info.js",
	"./components/heading": "./dist/components/heading.js",
	"./components/image-zoom": "./dist/components/image-zoom.js",
	"./components/inline-toc": "./dist/components/inline-toc.js",
	"./components/sidebar/base": "./dist/components/sidebar/base.js",
	"./components/sidebar/link-item": "./dist/components/sidebar/link-item.js",
	"./components/sidebar/page-tree": "./dist/components/sidebar/page-tree.js",
	"./components/sidebar/tabs": "./dist/components/sidebar/tabs/index.js",
	"./components/sidebar/tabs/dropdown": "./dist/components/sidebar/tabs/dropdown.js",
	"./components/steps": "./dist/components/steps.js",
	"./components/tabs": "./dist/components/tabs.js",
	"./components/toc": "./dist/components/toc/index.js",
	"./components/toc/clerk": "./dist/components/toc/clerk.js",
	"./components/toc/default": "./dist/components/toc/default.js",
	"./components/type-table": "./dist/components/type-table.js",
	"./components/ui/accordion": "./dist/components/ui/accordion.js",
	"./components/ui/button": "./dist/components/ui/button.js",
	"./components/ui/collapsible": "./dist/components/ui/collapsible.js",
	"./components/ui/popover": "./dist/components/ui/popover.js",
	"./components/ui/scroll-area": "./dist/components/ui/scroll-area.js",
	"./components/ui/tabs": "./dist/components/ui/tabs.js",
	"./contexts/i18n": "./dist/contexts/i18n.js",
	"./contexts/search": "./dist/contexts/search.js",
	"./contexts/tree": "./dist/contexts/tree.js",
	"./i18n": "./dist/i18n.js",
	"./layouts/docs": "./dist/layouts/docs/index.js",
	"./layouts/docs/page": "./dist/layouts/docs/page/index.js",
	"./layouts/docs/page/slots/breadcrumb": "./dist/layouts/docs/page/slots/breadcrumb.js",
	"./layouts/docs/page/slots/container": "./dist/layouts/docs/page/slots/container.js",
	"./layouts/docs/page/slots/footer": "./dist/layouts/docs/page/slots/footer.js",
	"./layouts/docs/page/slots/toc": "./dist/layouts/docs/page/slots/toc.js",
	"./layouts/docs/slots/container": "./dist/layouts/docs/slots/container.js",
	"./layouts/docs/slots/header": "./dist/layouts/docs/slots/header.js",
	"./layouts/docs/slots/sidebar": "./dist/layouts/docs/slots/sidebar.js",
	"./layouts/flux": "./dist/layouts/flux/index.js",
	"./layouts/flux/page": "./dist/layouts/flux/page/index.js",
	"./layouts/flux/page/slots/breadcrumb": "./dist/layouts/flux/page/slots/breadcrumb.js",
	"./layouts/flux/page/slots/container": "./dist/layouts/flux/page/slots/container.js",
	"./layouts/flux/page/slots/footer": "./dist/layouts/flux/page/slots/footer.js",
	"./layouts/flux/page/slots/toc": "./dist/layouts/flux/page/slots/toc.js",
	"./layouts/flux/slots/container": "./dist/layouts/flux/slots/container.js",
	"./layouts/flux/slots/sidebar": "./dist/layouts/flux/slots/sidebar.js",
	"./layouts/flux/slots/tab-dropdown": "./dist/layouts/flux/slots/tab-dropdown.js",
	"./layouts/glass": "./dist/layouts/glass/index.js",
	"./layouts/glass/page": "./dist/layouts/glass/page/index.js",
	"./layouts/glass/page/slots/breadcrumb": "./dist/layouts/glass/page/slots/breadcrumb.js",
	"./layouts/glass/page/slots/footer": "./dist/layouts/glass/page/slots/footer.js",
	"./layouts/glass/page/slots/toc": "./dist/layouts/glass/page/slots/toc.js",
	"./layouts/glass/slots/header": "./dist/layouts/glass/slots/header.js",
	"./layouts/glass/slots/sidebar": "./dist/layouts/glass/slots/sidebar.js",
	"./layouts/home": "./dist/layouts/home/index.js",
	"./layouts/home/navbar": "./dist/layouts/home/navbar.js",
	"./layouts/home/not-found": "./dist/layouts/home/not-found.js",
	"./layouts/home/slots/container": "./dist/layouts/home/slots/container.js",
	"./layouts/home/slots/header": "./dist/layouts/home/slots/header.js",
	"./layouts/notebook": "./dist/layouts/notebook/index.js",
	"./layouts/notebook/page": "./dist/layouts/notebook/page/index.js",
	"./layouts/notebook/page/slots/breadcrumb": "./dist/layouts/notebook/page/slots/breadcrumb.js",
	"./layouts/notebook/page/slots/container": "./dist/layouts/notebook/page/slots/container.js",
	"./layouts/notebook/page/slots/footer": "./dist/layouts/notebook/page/slots/footer.js",
	"./layouts/notebook/page/slots/toc": "./dist/layouts/notebook/page/slots/toc.js",
	"./layouts/notebook/slots/container": "./dist/layouts/notebook/slots/container.js",
	"./layouts/notebook/slots/header": "./dist/layouts/notebook/slots/header.js",
	"./layouts/notebook/slots/sidebar": "./dist/layouts/notebook/slots/sidebar.js",
	"./layouts/shared": "./dist/layouts/shared/index.js",
	"./layouts/shared/slots/language-select": "./dist/layouts/shared/slots/language-select.js",
	"./layouts/shared/slots/search-trigger": "./dist/layouts/shared/slots/search-trigger.js",
	"./layouts/shared/slots/theme-switch": "./dist/layouts/shared/slots/theme-switch.js",
	"./mdx": {
		"types": "./dist/mdx.d.ts",
		"node": "./dist/mdx.server.js",
		"import": "./dist/mdx.js"
	},
	"./og": "./dist/og.js",
	"./og/takumi": "./dist/og/takumi.js",
	"./page": "./dist/page.js",
	"./provider/astro": "./dist/provider/astro.js",
	"./provider/base": "./dist/provider/base.js",
	"./provider/next": "./dist/provider/next.js",
	"./provider/react-router": "./dist/provider/react-router.js",
	"./provider/tanstack": "./dist/provider/tanstack.js",
	"./provider/waku": "./dist/provider/waku.js",
	"./utils/use-copy-button": "./dist/utils/use-copy-button.js",
	"./utils/use-footer-items": "./dist/utils/use-footer-items.js",
	"./utils/use-is-scroll-top": "./dist/utils/use-is-scroll-top.js",
	"./package.json": "./package.json",
	"./components/image-zoom2.css": "./dist/components/image-zoom2.css",
	"./style.css": "./dist/style.css",
	"./css/*": "./css/*"
};
var publishConfig = { "access": "public" };
var scripts = {
	"build": "pnpm build:layout && pnpm build:tailwind",
	"build:layout": "tsdown",
	"build:tailwind": "tailwindcss -i css/style.css -o ./dist/style.css",
	"clean": "rimraf dist",
	"dev": "concurrently \"tsdown --watch --clean false\" \"tailwindcss -i css/style.css -o ./dist/style.css -w\"",
	"lint": "oxlint .",
	"types:check": "tsc --noEmit"
};
var dependencies = {
	"@base-ui/react": "^1.6.0",
	"@fuma-translate/react": "^1.0.2",
	"@fumadocs/tailwind": "workspace:*",
	"class-variance-authority": "^0.7.1",
	"cnfast": "^0.0.8",
	"lucide-react": "^1.25.0",
	"motion": "^12.42.2",
	"next-themes": "^0.4.6",
	"react-remove-scroll": "^2.7.2",
	"rehype-raw": "^7.0.0",
	"scroll-into-view-if-needed": "^3.1.0",
	"shiki": "^4.3.1",
	"unist-util-visit": "^5.1.0"
};
var devDependencies = {
	"@fumadocs/cli": "workspace:*",
	"@tailwindcss/cli": "^4.3.3",
	"@tailwindcss/oxide": "^4.3.3",
	"@tsdown/css": "^0.22.13",
	"@types/hast": "^3.0.5",
	"@types/mdx": "^2.0.14",
	"@types/node": "^26.1.1",
	"@types/react": "^19.2.17",
	"@types/react-dom": "^19.2.3",
	"fuma-cli": "^0.1.1",
	"fumadocs-core": "workspace:*",
	"react-medium-image-zoom": "^5.4.8",
	"tailwindcss": "^4.3.3",
	"tsconfig": "workspace:*",
	"tsdown": "0.22.13",
	"unified": "^11.0.5"
};
var peerDependencies = {
	"@types/mdx": "*",
	"@types/react": "*",
	"fumadocs-core": "workspace:*",
	"next": "16.x.x",
	"react": "^19.2.0",
	"react-dom": "^19.2.0",
	"takumi-js": "*"
};
var peerDependenciesMeta = {
	"next": { "optional": true },
	"takumi-js": { "optional": true },
	"@types/mdx": { "optional": true },
	"@types/react": { "optional": true }
};
var inlinedDependencies = { "react-medium-image-zoom": "5.4.8" };
var package_default = {
	name,
	version,
	description,
	keywords,
	homepage,
	license,
	author,
	repository,
	files,
	type,
	exports,
	publishConfig,
	scripts,
	dependencies,
	devDependencies,
	peerDependencies,
	peerDependenciesMeta,
	inlinedDependencies
};
//#endregion
//#region src/constants.ts
const sourceDir = fileURLToPath(new URL(`../`, import.meta.url).href);
const isCI = Boolean(process.env.CI);
const templates = [
	{
		value: "+next+fuma-docs-mdx",
		label: "Next.js: Fumadocs MDX",
		hint: "recommended",
		appDir: "",
		rootProviderPath: "app/layout.tsx"
	},
	{
		value: "astro",
		label: "Astro: React Islands",
		hint: "uses Astro Content Collections and Fumadocs UI as a React island",
		appDir: "src",
		rootProviderPath: "components/docs.tsx"
	},
	{
		value: "+next+fuma-docs-mdx+static",
		label: "Next.js Static: Fumadocs MDX",
		appDir: "",
		rootProviderPath: "components/provider.tsx"
	},
	{
		value: "waku",
		label: "Waku: Fumadocs MDX",
		appDir: "src",
		rootProviderPath: "components/provider.tsx"
	},
	{
		value: "react-router",
		label: "React Router: Fumadocs MDX (not RSC)",
		appDir: "app",
		rootProviderPath: "root.tsx"
	},
	{
		value: "react-router-spa",
		label: "React Router SPA: Fumadocs MDX (not RSC)",
		hint: "SPA mode allows you to host the site statically, compatible with a CDN.",
		appDir: "app",
		rootProviderPath: "root.tsx"
	},
	{
		value: "tanstack-start",
		label: "Tanstack Start: Fumadocs MDX (not RSC)",
		appDir: "src",
		rootProviderPath: "routes/__root.tsx"
	},
	{
		value: "tanstack-start-spa",
		label: "Tanstack Start SPA: Fumadocs MDX (not RSC)",
		hint: "SPA mode allows you to host the site statically, compatible with a CDN.",
		appDir: "src",
		rootProviderPath: "routes/__root.tsx"
	}
];
const workspaces = [
	package_exports$2,
	package_exports$1,
	package_exports
];
const depVersions = dependencies$3;
for (const workspace of workspaces) depVersions[workspace.name] = workspace.version;
depVersions["fumadocs-ui"] = `npm:${name}@${version}`;
//#endregion
export { templates as i, isCI as n, sourceDir as r, depVersions as t };

//# sourceMappingURL=constants-UZ9hhOMa.js.map