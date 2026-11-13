// Lets plain CSS side-effect imports (e.g. `import "./globals.css"`) type-check
// under TypeScript versions that enable noUncheckedSideEffectImports by default.
declare module "*.css";
