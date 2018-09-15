import remark from 'remark';
import toVFile from 'to-vfile';
import engine from 'unified-engine';
import { VFile, VFileMessage } from 'vfile';

export function run(): any {
  const file = toVFile('README.md');

  const extensions = require('markdown-extensions');

  if (!file.extname || extensions.indexOf(file.extname.slice(1)) === -1) {
    throw new Error(`Unsupported file extension for filename: ${file.path}`);
    return;
  }

  return new Promise((resolve, reject) => {
    return engine(
      {
        extensions,
        files: [file],
        ignoreName: '.remarkignore',
        packageField: 'remarkConfig',
        pluginPrefix: 'remark',
        presetPrefix: 'remark-preset',
        processor: remark(),
        rcName: '.remarkrc',
        reporter: results => {
          return resolve(reportVFileMessagesAsIssue(results[0]));
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
  vfile: VFile<{
    readonly path: string;
    readonly contents: string;
    readonly messages: ReadonlyArray<VFileMessage>;
  }>
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
