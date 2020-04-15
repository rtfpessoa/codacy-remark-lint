// tslint:disable:no-expression-statement
import test from 'ava';
import * as path from 'path';
import { Configuration, EmptyConfiguration } from './codacy-configuration';
import run from './remark-runner';

test('run analysis when codacy config file is not found but has .remarkrc', async (t) => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/remark-config-file-simple'
  );
  const results = await run({
    getCodacyConfiguration: () => EmptyConfiguration,
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'README.md',
      line: 7,
      message:
        '[no-undefined-references] Found reference to undefined definition',
      patternId: 'remark-lint-no-undefined-references'
    },
    {
      file: 'README.md',
      line: 10,
      message: '[ordered-list-marker-value] Marker should be `1`, was `2`',
      patternId: 'remark-lint-ordered-list-marker-value'
    },
    {
      file: 'README.md',
      line: 11,
      message: '[ordered-list-marker-value] Marker should be `1`, was `3`',
      patternId: 'remark-lint-ordered-list-marker-value'
    }
  ]);
});

test('run analysis when codacy config file is found with only files', async (t) => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/remark-config-file'
  );
  const results = await run({
    getCodacyConfiguration: () => {
      const config: Configuration = { files: ['SUMMARY.md'] };
      return config;
    },
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'SUMMARY.md',
      line: 7,
      message:
        '[no-undefined-references] Found reference to undefined definition',
      patternId: 'remark-lint-no-undefined-references'
    },
    {
      file: 'SUMMARY.md',
      line: 10,
      message: '[ordered-list-marker-value] Marker should be `1`, was `2`',
      patternId: 'remark-lint-ordered-list-marker-value'
    },
    {
      file: 'SUMMARY.md',
      line: 11,
      message: '[ordered-list-marker-value] Marker should be `1`, was `3`',
      patternId: 'remark-lint-ordered-list-marker-value'
    }
  ]);
});

test('run analysis when codacy config file is found with files and patterns', async (t) => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/remark-config-file'
  );
  const results = await run({
    getCodacyConfiguration: () => {
      const config: Configuration = {
        config: { plugins: [['remark-lint-ordered-list-marker-value', 'one']] },
        files: ['SUMMARY.md']
      };
      return config;
    },
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'SUMMARY.md',
      line: 10,
      message: '[ordered-list-marker-value] Marker should be `1`, was `2`',
      patternId: 'remark-lint-ordered-list-marker-value'
    },
    {
      file: 'SUMMARY.md',
      line: 11,
      message: '[ordered-list-marker-value] Marker should be `1`, was `3`',
      patternId: 'remark-lint-ordered-list-marker-value'
    }
  ]);
});
