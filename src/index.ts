#!/usr/bin/env node

import run from './lib/remark-runner';

/* tslint:disable:no-expression-statement*/

run().then(results => {
  results.forEach(result => {
    process.stdout.write(JSON.stringify(result));
    process.stdout.write('\n');
  });
});

/* tslint:enable:no-expression-statement*/
