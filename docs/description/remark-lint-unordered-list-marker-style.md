Warn when the list-item marker style of unordered lists violate a given
style.

Options: `'consistent'`, `'-'`, `'*'`, or `'*'`, default: `'consistent'`.

`'consistent'` detects the first used list style and warns when subsequent
lists use different styles.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
formats unordered lists using a hyphen-minus (`-`) by default. Pass
[`bullet: '*'` or `bullet: '+'`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsbullet)
to use asterisks or plusses instead.

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.