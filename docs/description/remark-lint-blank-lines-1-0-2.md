This [remark-lint](https://github.com/wooorm/remark-lint) rule was created for [free-programming-books-lint](https://github.com/vhf/free-programming-books-lint) to enforce [free-programming-books](https://github.com/vhf/free-programming-books) [formatting guidelines](https://github.com/vhf/free-programming-books/blob/master/CONTRIBUTING.md#formatting).

This rule ensures that a file has

-   2 empty lines between last link and new section
-   1 empty line between heading & first link of its section
-   0 empty line between two list items
-   1 empty line at the end of each .md file

```Text
<!-- Invalid -->

[...]
* [An Awesome Book](http://example.com/example.html)

### Example
* [Another Awesome Book](http://example.com/book.html)

* [Some Other Book](http://example.com/other.html)

<!-- Valid -->

[...]
* [An Awesome Book](http://example.com/example.html)


### Example

* [Another Awesome Book](http://example.com/book.html)
* [Some Other Book](http://example.com/other.html)
```