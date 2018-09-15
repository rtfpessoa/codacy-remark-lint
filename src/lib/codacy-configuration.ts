import toVFile from 'to-vfile';

export default function configFromCodacy(configPath?: string): Configuration {
  const codacyConfig = readCodacyConfiguration(configPath);
  const possibleFiles = codacyConfig ? { files: codacyConfig.files } : {};
  const possibleConfig = codacyConfig ? { config: { plugins: configFromPatterns(codacyConfig) } } : {};

  return {
    ...possibleFiles,
    ...possibleConfig
  };
};

export interface Configuration {
  readonly files?: ReadonlyArray<string>,
  readonly config?: object
}

type ParameterValueScalar = string | number | boolean | object;
interface ParameterValueArray {
  readonly [index: number]: ParameterValueScalar | ParameterValueArray;
}
type ParameterValue = ParameterValueScalar | ParameterValueArray;

interface CodacyParameter {
  readonly name: string,
  readonly value: ParameterValue
}

interface CodacyPattern {
  readonly patternId: string,
  readonly parameters?: ReadonlyArray<CodacyParameter>
}

interface CodacyTool {
  readonly name: string,
  readonly patterns?: ReadonlyArray<CodacyPattern>
}

interface CodacyConfiguration {
  readonly files: ReadonlyArray<string>,
  readonly tools?: ReadonlyArray<CodacyTool>
}

function readCodacyConfiguration(configPath?: string): CodacyConfiguration | undefined {
  const path = configPath || '/.codacyrc';
  const configFileContents = toVFile.readSync(path, 'utf8').contents;

  try {
    const codacyConfigAny: any = (typeof configFileContents === 'string') ? JSON.parse(configFileContents) : configFileContents.toJSON;
    const codacyConfig: CodacyConfiguration = codacyConfigAny as CodacyConfiguration;
    return codacyConfig;
  } catch (err) {
    console.error(err)
    return;
  }
}

function configFromPatterns(codacyConfig: CodacyConfiguration): ReadonlyArray<ReadonlyArray<ParameterValue>> | undefined {
  if (codacyConfig.tools) {
    const remarkTool = codacyConfig.tools.find((tool: CodacyTool) => tool.name === 'remark-lint')

    if (remarkTool && remarkTool.patterns) {
      return remarkTool.patterns.map((pattern: CodacyPattern) => {
        if (pattern.parameters && pattern.parameters.length === 1) {
          return [pattern.patternId, pattern.parameters[0].value];
        }

        return [];
      }).filter((e) => e.length > 0);
    }
  }

  return;
}
