//#region src/plugins/biome.base.json
var $schema = "https://biomejs.dev/schemas/2.2.0/schema.json";
var vcs = {
	"enabled": true,
	"clientKind": "git",
	"useIgnoreFile": true
};
var files = {
	"ignoreUnknown": true,
	"includes": [
		"**",
		"!node_modules",
		"!.source"
	]
};
var formatter = {
	"enabled": true,
	"indentStyle": "space",
	"indentWidth": 2
};
var linter = {
	"enabled": true,
	"rules": { "recommended": true },
	"domains": { "react": "recommended" }
};
var assist = { "actions": { "source": { "organizeImports": "on" } } };
var biome_base_default = {
	$schema,
	vcs,
	files,
	formatter,
	linter,
	assist
};
//#endregion
export { $schema, assist, biome_base_default as default, files, formatter, linter, vcs };

//# sourceMappingURL=biome.base.js.map