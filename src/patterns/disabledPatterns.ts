const disabledPatterns: ReadonlyArray<string> = ['remark-validate-links'];

export function isPatternDisabled(patternId: string): boolean {
  return (
    disabledPatterns.includes(patternId) ||
    disabledPatterns.find(x => patternId.startsWith(x)) !== undefined
  );
}
