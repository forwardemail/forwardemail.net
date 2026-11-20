// (embedded as text by esbuild, see build.mjs)
declare module '*.yml' {
  const content: string;
  export default content;
}

declare module '*.example' {
  const content: string;
  export default content;
}

declare const __VERSION__: string;
