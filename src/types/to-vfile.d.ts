declare module 'to-vfile' {
  import { VFile } from 'vfile';

  export interface ToVFile {
    (options: string | Buffer): VFile<{}>;
    readSync(options: string | Buffer, enconding?: string): VFile<{}>;
  }

  const toVFile: ToVFile;
  export default toVFile;
}
