
declare const htmlTransform: () => {
  name: string;
  transformIndexHtml(html: string): string;
};

export default htmlTransform;
