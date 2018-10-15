import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import rule, { Rule } from './util/rule';
import rules from './util/rules';

export default function allRules(): ReadonlyArray<Rule> {
  const remarkLintPath = cloneRemarkLint();
  const remarkLintPackagesPath = `${remarkLintPath}/packages`;

  const parsedRules = rules(remarkLintPackagesPath)
    .map((basename: string) => {
      const base = path.resolve(remarkLintPackagesPath, basename);
      return rule(base);
    })
    .filter(r => r !== undefined) as ReadonlyArray<Rule>;

  // tslint:disable-next-line:no-expression-statement
  fs.removeSync(remarkLintPath);

  return parsedRules;
}

function cloneRemarkLint(): string {
  const tmpDir = tmp.dirSync().name;

  // tslint:disable-next-line:no-expression-statement
  execSync(`git clone git://github.com/remarkjs/remark-lint ${tmpDir}`);

  return tmpDir;
}
