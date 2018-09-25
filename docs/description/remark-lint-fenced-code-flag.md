Check fenced code-block flags.

Options: `Array.<string>` or `Object`, optional.

Providing an array is as passing `{flags: Array}`.

The object can have an array of `'flags'` which are deemed valid.
In addition it can have the property `allowEmpty` (`boolean`, default:
`false`) which signifies whether or not to warn for fenced code-blocks
without language flags.