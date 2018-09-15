declare module 'to-vfile' {
  import { VFile } from 'vfile';

  export interface ToVFile {
    (options: string | Buffer): VFile<{}>;
  }

  const toVFile: ToVFile;
  export default toVFile;
}
