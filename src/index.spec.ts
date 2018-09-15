// tslint:disable:no-expression-statement
import test from 'ava';
import { run } from './index';

test('getABC', async t => {
  t.deepEqual(await run(), [
    {
      filename: 'README.md',
      line: 7,
      message: '[no-undefined-references] Found reference to undefined definition',
      pattern: 'remark-lint.no-undefined-references',
      ruleId: 'no-undefined-references'
    }
  ]);
});
