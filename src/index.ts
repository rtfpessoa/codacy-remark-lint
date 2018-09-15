import remark from 'remark';
import engine from 'unified-engine';
import vFile, { VFile, VFileMessage } from 'vfile';

export function run(fileName: string, fileContents: string): any {
  const file = vFile({
    contents: fileContents,
    path: fileName
  });

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
          return resolve(reportVFileMessagesAsIssue(file.path, results[0]));
        }
      },
      (error, code, context) => {
        if (!error) {
          return;
        }

        const message = `${fileName}
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
  fileName: string,
  vfile: VFile<{
    readonly path: string;
    readonly contents: string;
    readonly messages: ReadonlyArray<VFileMessage>;
  }>
): any {
  const { messages } = vfile;

  return messages.map((msg: VFileMessage) => {
    return {
      fileName,
      line: msg.location.start.line || msg.line || 1,
      message: `${msg.ruleId ? `[${msg.ruleId}] ` : ''}${msg.reason}`,
      pattern: `${msg.source}.${msg.ruleId}`,
      ruleId: msg.ruleId
    };
  });
}
