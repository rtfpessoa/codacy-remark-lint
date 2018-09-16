// tslint:disable:no-expression-statement
import test from 'ava';
import configFromCodacy from './codacy-configuration';

test('read inexistant codacy configuration file', async t => {
  t.deepEqual(
    await configFromCodacy(
      './test_samples/configs/remark-config-file/codacyrc'
    ),
    {}
  );
});

test('read valid codacy configuration file', async t => {
  t.deepEqual(
    await configFromCodacy(
      './test_samples/configs/codacy-config-file-with-files-and-patterns/codacyrc'
    ),
    {
      config: { plugins: [['remark-lint-ordered-list-marker-value', 'one']] },
      files: ['README.md']
    }
  );
});

test('read valid codacy configuration file with only files', async t => {
  t.deepEqual(
    await configFromCodacy(
      './test_samples/configs/codacy-config-file-only-files/codacyrc'
    ),
    {
      files: ['README.md']
    }
  );
});
