import remark from 'remark';
import toVFile from 'to-vfile';
import engine from 'unified-engine';
import { VFile, VFileMessage } from 'vfile';
import configFromCodacy from './lib/codacy-configuration';

type FileWithResults = VFile<{
  readonly path: string;
  readonly contents: string;
  readonly messages: ReadonlyArray<VFileMessage>;
}>;

export function run(): any {
  const tmp = configFromCodacy('/tmp/.codacyrc');
  const { files = ['./'], config } = tmp;

  const file = toVFile('README.md');

  const extensions = require('markdown-extensions');

  if (!file.extname || extensions.indexOf(file.extname.slice(1)) === -1) {
    throw new Error(`Unsupported file extension for filename: ${file.path}`);
    return;
  }

  const remarkDefaults = {
    ignoreName: '.remarkignore',
    packageField: 'remarkConfig',
    pluginPrefix: 'remark',
    presetPrefix: 'remark-preset',
    rcName: '.remarkrc'
  }

  const configurationSource = config ? { defaultConfig: config } : (
    {
      ...remarkDefaults,
      defaultConfig: {
        plugins: [
          "remark-preset-lint-recommended",
          ["remark-lint-list-item-indent", false],
          ["remark-lint-ordered-list-marker-value", "one"]
        ]
      }
    }
  );

  return new Promise((resolve, reject) => {
    return engine(
      {
        ...configurationSource,
        extensions,
        files: [...files],
        processor: remark(),
        reporter: (results: ReadonlyArray<FileWithResults>) => {
          const resultsOrEmpty = results || [];
          const json = [].concat(...resultsOrEmpty.map((fileResults: FileWithResults) => reportVFileMessagesAsIssue(fileResults)));
          return resolve(json);
        }
      },
      (error, code, context) => {
        if (!error) {
          return;
        }

        const message = `${file.path}
        Error running processor
        
        ${error.toString()}
        
        code: ${code}
        context: ${context}`;

        return reject({ error, message });
      }
    );
  });
}

function reportVFileMessagesAsIssue(
  vfile: FileWithResults
): any {
  const { path, messages } = vfile;

  return messages.map((msg: VFileMessage) => {
    return {
      filename: path,
      line: msg.location.start.line || msg.line || 1,
      message: `${msg.ruleId ? `[${msg.ruleId}] ` : ''}${msg.reason}`,
      pattern: `${msg.source}.${msg.ruleId}`,
      ruleId: msg.ruleId
    };
  });
}
