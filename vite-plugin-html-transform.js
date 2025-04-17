
// Custom Vite plugin to transform the HTML output
export default function htmlTransform() {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      // Remove any existing gptengineer.js script
      html = html.replace(/<script src="https:\/\/cdn\.gpteng\.co\/gptengineer\.js"[^>]*><\/script>/g, '');
      
      // Move all scripts from head to body
      const headScripts = [];
      html = html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (match, attrs, content) => {
        if (html.indexOf(match) < html.indexOf('</head>')) {
          headScripts.push({ attrs, content });
          return '';
        }
        return match;
      });
      
      // Insert all scripts at the end of body, ensuring the Lovable script tag is before the app script
      return html.replace('</body>', () => {
        let result = '';
        result += '<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>\n    ';
        headScripts.forEach(script => {
          result += `<script${script.attrs}>${script.content}</script>\n    `;
        });
        result += '<!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->\n  </body>';
        return result;
      });
    }
  };
}
