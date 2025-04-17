
// Custom Vite plugin to transform the HTML output
export default function htmlTransform() {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      // Remove any existing gptengineer.js script
      html = html.replace(/<script src="https:\/\/cdn\.gpteng\.co\/gptengineer\.js"[^>]*><\/script>/g, '');
      
      // Insert the gptengineer.js script before the app script
      return html.replace(
        /<script type="module" src="\/src\/main\.tsx"><\/script>/,
        '<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>\n    <script type="module" src="/src/main.tsx"></script>'
      );
    }
  };
}
