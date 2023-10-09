Warn when a line feed at the end of a file is missing.
  Empty files are allowed.

  See [StackExchange](https://unix.stackexchange.com/questions/18743) for why.

  ## Fix

  [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
  always adds a final line feed to files.

  See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
  on how to automatically fix warnings for this rule.

  ## Example

  ##### `ok.md`

  ###### In

  Note: `␊` represents LF.

  ```markdown
  Alpha␊
  ```

  ###### Out

  No messages.

  ##### `not-ok.md`

  ###### In

  Note: The below file does not have a final newline.

  ```markdown
  Bravo
  ```

  ###### Out

  ```text
  1:1: Missing newline character at end of file
  ```