Warn for violating emphasis markers.

Options: `'consistent'`, `'*'`, or `'_'`, default: `'consistent'`.

`'consistent'` detects the first used emphasis style and warns when
subsequent emphasis use different styles.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
formats emphasis using an underscore (`_`) by default. Pass
[`emphasis: '*'`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsemphasis)
to use asterisks instead.

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.