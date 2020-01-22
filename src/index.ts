#!/usr/bin/env node

import run from './lib/remark-runner';
import { isPatternDisabled } from './patterns/disabledPatterns';

/* tslint:disable:no-expression-statement*/

run().then(
  results => {
    results
      // filter patterns that are in the list of disabled patterns
      .filter(r => !isPatternDisabled(r.patternId))
      .forEach(result => {
        process.stdout.write(`${JSON.stringify(result)}\n`);
      });

    process.exit(0);
  },
  reason => {
    process.stderr.write(`${JSON.stringify(reason)}\n`);
    process.exit(1);
  }
);

/* tslint:enable:no-expression-statement*/
