// Custom Vite plugin to transform the HTML output
export default function htmlTransform() {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      // Make sure gptengineer.js is loaded after the app script
      return html.replace(
        '</body>',
        '<!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->\n    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>\n  </body>'
      );
    }
  };
}
