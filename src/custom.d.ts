/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
  import type * as React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
declare module "*.json" {
  const value: any;
  export default value;
}
declare module "*.scss" {
  const value: any;
  export default value;
}
declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.webp" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
