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

interface AnalysisFailure {
  readonly error: Error;
  readonly message: string;
}

export default function run(
  options: {
    readonly sourcePath?: string;
    readonly codacyConfigPath?: string;
    readonly getCodacyConfiguration?: (path: string) => Configuration;
  } = {}
): Promise<ReadonlyArray<CodacyIssue>> {
  const {
    sourcePath = '/src',
    codacyConfigPath = '/.codacyrc',
    getCodacyConfiguration = configFromCodacy
  } = options;

  const extensions = require('markdown-extensions');

  const { files = [sourcePath], config } = codacyConfigPath
    ? getCodacyConfiguration(codacyConfigPath)
    : EmptyConfiguration;

  const remarkLocalDefaults = {
    packageField: 'remarkConfig',
    pluginPrefix: 'remark',
    presetPrefix: 'remark-preset',
    rcName: '.remarkrc'
  };

  const configurationSource = config
    ? { defaultConfig: config }
    : {
        ...remarkLocalDefaults,
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
        reporter: (results: ReadonlyArray<FileWithResults>) =>
          resolve(getCodacyIssues(results)),
        silentlyIgnore: true
      },
      (error, code, context) => {
        const analysisFailure = callback(error, code, context);
        if (analysisFailure) {
          return reject(analysisFailure);
        }

        return;
      }
    );
  });
}

function callback(
  error: Error | null,
  code: number | undefined,
  context: object | undefined
): AnalysisFailure | undefined {
  if (error) {
    return onError(error, code, context);
  }

  return;
}

function onError(
  error: Error,
  code: number | undefined,
  context: object | undefined
): AnalysisFailure {
  const message = `Error running processor
  
  ${error.toString()}
  
  code: ${code}
  context: ${context}`;

  return { error, message };
}

function getCodacyIssues(
  results: ReadonlyArray<FileWithResults>
): ReadonlyArray<CodacyIssue> {
  const fileCodacyIssues = results.map((fileResults: FileWithResults) => {
    const { path, messages } = fileResults;
    return messages.map((message: VFileMessage) =>
      getCodacyIssue(path, message)
    );
  });

  return Array<CodacyIssue>().concat(...fileCodacyIssues);
}

function getCodacyIssue(path: string, msg: VFileMessage): CodacyIssue {
  return {
    file: path,
    line: msg.location.start.line || msg.line || 1,
    message: `${msg.ruleId ? `[${msg.ruleId}] ` : ''}${msg.reason}`,
    patternId: `${msg.source}.${msg.ruleId}`
  };
}
