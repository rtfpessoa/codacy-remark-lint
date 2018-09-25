Warn when link and definition titles occur with incorrect quotes.

Options: `'consistent'`, `'"'`, `'\''`, or `'()'`, default: `'consistent'`.

`'consistent'` detects the first used quote style and warns when subsequent
titles use different styles.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
uses single quotes for titles if they contain a double quote, and double
quotes otherwise.

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.