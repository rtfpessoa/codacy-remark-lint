declare module 'to-vfile' {
  import { VFile } from 'vfile';

  export interface WriteOptions {
    readonly path: string;
    readonly contents: string | Buffer;
  }

  export interface ToVFile {
    (options: string | Buffer): VFile<{}>;
    readSync(options: string | Buffer, enconding?: string): VFile<{}>;
    writeSync(options: WriteOptions, fsOptions?: object): VFile<{}>;
  }

  const toVFile: ToVFile;
  export default toVFile;
}
