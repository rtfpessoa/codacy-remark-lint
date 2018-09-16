import remark from 'remark';
import engine from 'unified-engine';
import { VFile, VFileMessage } from 'vfile';
import configFromCodacy, {
  Configuration,
  EmptyConfiguration
} from './codacy-configuration';

type FileWithResults = VFile<{
  readonly path: string;
  readonly contents: string;
  readonly messages: ReadonlyArray<VFileMessage>;
}>;

interface CodacyIssue {
  readonly file: string;
  readonly message: string;
  readonly patternId: string;
  readonly line: number;
}

// interface CodacyFileError {
//   readonly file: string;
//   readonly message?: string;
// }

export default function run(
  options: {
    readonly sourcePath?: string;
    readonly codacyConfigPath?: string;
    readonly codacyConfigurationRetriever?: (path: string) => Configuration;
  } = {}
): Promise<ReadonlyArray<CodacyIssue>> {
  const {
    sourcePath = '/src',
    codacyConfigPath = '/.codacyrc',
    codacyConfigurationRetriever = configFromCodacy
  } = options;
  const { files = [sourcePath], config } = codacyConfigPath
    ? codacyConfigurationRetriever(codacyConfigPath)
    : EmptyConfiguration;

  const extensions = require('markdown-extensions');

  const remarkDefaults = {
    packageField: 'remarkConfig',
    pluginPrefix: 'remark',
    presetPrefix: 'remark-preset',
    rcName: '.remarkrc'
  };

  const configurationSource = config
    ? { defaultConfig: config }
    : {
        ...remarkDefaults,
        defaultConfig: {
          plugins: [
            'remark-preset-lint-recommended',
            ['remark-lint-list-item-indent', false],
            ['remark-lint-ordered-list-marker-value', 'one']
          ]
        }
      };

  return new Promise((resolve, reject) => {
    return engine(
      {
        ...configurationSource,
        cwd: sourcePath,
        extensions,
        files: [...files],
        ignoreName: '.remarkignore',
        pluginPrefix: 'remark',
        processor: remark(),
        reporter: (results: ReadonlyArray<FileWithResults>) => {
          const fileCodacyIssues = results.map((fileResults: FileWithResults) =>
            convertVFileMessagesAsIssue(fileResults)
          );
          const codacyIssues = Array<CodacyIssue>().concat(...fileCodacyIssues);
          return resolve(codacyIssues);
        },
        silentlyIgnore: true
      },
      (error, code, context) => {
        if (!error) {
          return;
        }

        const message = `Error running processor
        
        ${error.toString()}
        
        code: ${code}
        context: ${context}`;

        return reject({ error, message });
      }
    );
  });
}

function convertVFileMessagesAsIssue(
  vfile: FileWithResults
): ReadonlyArray<CodacyIssue> {
  const { path, messages } = vfile;

  return messages.map((msg: VFileMessage) => {
    return {
      file: path,
      line: msg.location.start.line || msg.line || 1,
      message: `${msg.ruleId ? `[${msg.ruleId}] ` : ''}${msg.reason}`,
      patternId: `${msg.source}.${msg.ruleId}`
    };
  });
}
