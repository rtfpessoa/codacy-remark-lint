Warn when the horizontal rules violate a given or detected style.

Options: `string`, either a valid markdown rule, or `'consistent'`,
default: `'consistent'`.

`'consistent'` detects the first used rule style and warns when subsequent
rules use different styles.

Note: horizontal rules are also called “thematic break”.

## Fix

[`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
has three settings that define how rules are created:

*   [`rule`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsrule)
    (default: `*`) — Marker to use
*   [`ruleRepetition`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsrulerepetition)
    (default: `3`) — Number of markers to use
*   [`ruleSpaces`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#optionsrulespaces)
    (default: `true`) — Whether to pad markers with spaces

See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
on how to automatically fix warnings for this rule.