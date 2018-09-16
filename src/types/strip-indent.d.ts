declare module 'strip-indent' {
  export interface StripIndent {
    (str: string): string;
  }

  const strip: StripIndent;
  export default strip;
}
