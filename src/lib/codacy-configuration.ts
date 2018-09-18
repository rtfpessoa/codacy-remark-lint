import readFile from './util/file';

export interface Configuration {
  readonly files?: ReadonlyArray<string>;
  readonly config?: object;
}

export const EmptyConfiguration: Configuration = {};

type ParameterValueScalar = string | number | boolean | object;
interface ParameterValueArray {
  readonly [index: number]: ParameterValueScalar | ParameterValueArray;
}
type ParameterValue = ParameterValueScalar | ParameterValueArray;

interface CodacyParameter {
  readonly name: string;
  readonly value: ParameterValue;
}

interface CodacyPattern {
  readonly patternId: string;
  readonly parameters?: ReadonlyArray<CodacyParameter>;
}

interface CodacyTool {
  readonly name: string;
  readonly patterns?: ReadonlyArray<CodacyPattern>;
}

interface CodacyConfiguration {
  readonly files: ReadonlyArray<string>;
  readonly tools?: ReadonlyArray<CodacyTool>;
}

export default function configFromCodacy(configPath?: string): Configuration {
  const codacyConfig = readCodacyConfiguration(configPath);

  if (!codacyConfig) {
    return EmptyConfiguration;
  }

  const patternsConfig = configFromPatterns(codacyConfig);
  const possibleConfig = patternsConfig
    ? { config: { plugins: patternsConfig } }
    : {};

  return {
    files: codacyConfig.files,
    ...possibleConfig
  };
}

function readCodacyConfiguration(
  configPath?: string
): CodacyConfiguration | undefined {
  const path = configPath || '/.codacyrc';
  const configFileContents = readFile(path);

  if (!configFileContents) {
    return;
  }

  try {
    const codacyConfig = JSON.parse(configFileContents) as CodacyConfiguration;
    return codacyConfig;
  } catch (err) {
    // tslint:disable-next-line:no-expression-statement
    process.stderr.write(`${err}\n`);
    // TODO: Invalid configurations should fail the analysis
    return;
  }
}

function configFromPatterns(
  codacyConfig: CodacyConfiguration
): ReadonlyArray<ReadonlyArray<ParameterValue>> | undefined {
  if (codacyConfig.tools) {
    const toolPatterns = codacyConfig.tools.find(
      (tool: CodacyTool) => tool.name === 'remark-lint'
    );

    if (toolPatterns && toolPatterns.patterns) {
      return toolPatterns.patterns
        .map((pattern: CodacyPattern) => {
          if (pattern.parameters && pattern.parameters.length === 1) {
            return [pattern.patternId, pattern.parameters[0].value];
          }

          return [];
        })
        .filter(e => e.length > 0);
    }
  }

  return;
}
