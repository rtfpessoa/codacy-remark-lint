#!/usr/bin/env node

import run, { isCodacyIssue } from './lib/remark-runner';
import { isPatternDisabled } from './patterns/disabledPatterns';

/* tslint:disable:no-expression-statement*/

run().then(
  (results) => {
    results
      .filter((result) => {
        if (isCodacyIssue(result)) {
          // filter out patterns that are in the list of disabled patterns
          return !isPatternDisabled(result.patternId);
        } else {
          // does not filter out any file error
          return true;
        }
      })
      .forEach((result) => {
        process.stdout.write(`${JSON.stringify(result)}\n`);
      });

    process.exit(0);
  },
  (reason) => {
    process.stderr.write(`${JSON.stringify(reason)}\n`);
    process.exit(1);
  }
);

/* tslint:enable:no-expression-statement*/
