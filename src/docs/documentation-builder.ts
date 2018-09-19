import path from 'path';
import rule, { Rule } from './util/rule';
import rules from './util/rules';

const root = '/tmp/remark-lint/packages';

const allRules = rules(root)
  .map((basename: string) => {
    const base = path.resolve(root, basename);
    return rule(base);
  })
  .filter(r => r !== undefined) as ReadonlyArray<Rule>;

export default allRules;
