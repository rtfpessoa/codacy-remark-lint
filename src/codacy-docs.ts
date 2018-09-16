#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import allRules from './docs/documentation-builder';
import { Rule } from './docs/util/rule';

const patterns = allRules.map((rule: Rule) => {
  const parameters = rule.defaultValue
    ? {
        parameters: [
          {
            default: rule.defaultValue,
            name: rule.ruleId
          }
        ]
      }
    : {};

  return {
    ...parameters,
    category: 'CodeStyle',
    level: 'Warning',
    patternId: rule.ruleId
  };
});

const patternsJson = {
  name: 'remark-lint',
  patterns,
  version: '6.0.2'
};

const descriptionsJson = allRules.map((rule: Rule) => {
  const parameters = rule.defaultValue
    ? {
        parameters: [
          {
            description: rule.ruleId,
            name: rule.ruleId
          }
        ]
      }
    : {};

  return {
    ...parameters,
    description: rule.title,
    patternId: rule.ruleId,
    timeToFix: 5,
    title: rule.title
  };
});

/* tslint:disable:no-expression-statement*/

const root = path.resolve(__dirname);
const docsPath = path.resolve(`${root}/../../docs`);
const descripionPath = path.resolve(`${docsPath}/description`);

if (!fs.existsSync(docsPath)) {
  fs.mkdirSync(docsPath);
}
if (!fs.existsSync(descripionPath)) {
  fs.mkdirSync(descripionPath);
}

fs.writeFileSync(`${docsPath}/patterns.json`, JSON.stringify(patternsJson));
fs.writeFileSync(
  `${descripionPath}/description.json`,
  JSON.stringify(descriptionsJson)
);
allRules.forEach((rule: Rule) => {
  fs.writeFileSync(`${descripionPath}/${rule.ruleId}.md`, rule.description);
});

/* tslint:enable:no-expression-statement*/
