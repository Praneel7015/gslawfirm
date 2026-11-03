// Lets TypeScript 6 resolve side-effect stylesheet imports such as
// `import "./globals.css"` before next-env.d.ts has been generated.
declare module "*.css";
