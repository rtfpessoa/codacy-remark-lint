Warn for violating strong markers.

Options: `'consistent'`, `'*'`, or `'_'`, default: `'consistent'`.

`'consistent'` detects the first used strong style and warns when subsequent
strongs use different styles.

Note: strong is also called “importance”.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
formats importance using an asterisk (`*`) by default. Pass
[`strong: '_'`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsstrong)
to use underscores instead.

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.