
declare module './vite-plugin-html-transform.js' {
  export default function htmlTransform(): {
    name: string;
    transformIndexHtml(html: string): string;
  };
}
