import fs from 'fs';

function rulesSync(filePath: string): ReadonlyArray<string> {
  return fs.readdirSync(filePath).filter(filter);
}

function filter(basename: string): boolean {
  return /remark-lint/.test(basename);
}

export default rulesSync;
