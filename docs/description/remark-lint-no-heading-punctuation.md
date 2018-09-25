Warn when a heading ends with a a group of characters.

Options: `string`, default: `'.,;:!?'`.

Note: these are added to a regex, in a group (`'[' + char + ']'`), be careful
for escapes and dashes.