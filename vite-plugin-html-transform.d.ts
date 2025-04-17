
declare function htmlTransform(): {
  name: string;
  transformIndexHtml(html: string): string;
};

export default htmlTransform;
