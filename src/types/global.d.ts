declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.svg" {
  const path: string;
  export default path;
}
