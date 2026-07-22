//#region src/plugins/biome.next.json.d.ts
declare let $schema: string;
declare namespace vcs {
  let enabled: boolean;
  let clientKind: string;
  let useIgnoreFile: boolean;
}
declare namespace files {
  let ignoreUnknown: boolean;
  let includes: string[];
}
declare namespace formatter {
  let enabled_1: boolean;
  export { enabled_1 as enabled };
  export let indentStyle: string;
  export let indentWidth: number;
}
declare namespace linter {
  let enabled_2: boolean;
  export { enabled_2 as enabled };
  export namespace rules {
    let recommended: boolean;
  }
  export namespace domains {
    let next: string;
    let react: string;
  }
}
declare namespace assist {
  namespace actions {
    namespace source {
      let organizeImports: string;
    }
  }
}
declare namespace __json_default_export {
  export { $schema, vcs, files, formatter, linter, assist };
}
//#endregion
export { $schema, assist, __json_default_export as default, files, formatter, linter, vcs };
//# sourceMappingURL=biome.next.d.ts.map