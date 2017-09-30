---
layout: post
title: "TODO"
---

*   Only alternate the background color of table rows if there is a minimum amount?
*   Are the lines after the header and before the footer beneficial?  Try what it looks
    like without them.
*   Not using level one (`#`) headings in my Markdown files is reasonable since they are
    really just subheadings.  Using `###` and skipping `<h2>` is weird, though.  Add some
    CSS so `<h2>` becomes what I want my second level headers to look like.
*   Figure out how Google constructs SERP snippets, optimize metadata accordingly, and
    record the process in the [meta post][meta].
*   Figure out a consistent style to attribute quotations in Markdown.  I want to use some
    type of [dash][], probably the [em dash][].  [Kramdown][1] converts `---` to an em
    dash.
    *   Should there be a space after the dash?  There [doesn't seem to][2] be a
        convention.
    *   Should the dash be indented?
    *   The attribution could also be on the same line.
    *   The [quotation dash][] is probably [not appropriate][3].

    >   Consequences! My old nemesis.  
    ---Master Po Ping
    ^
    >   Consequences! My old nemesis.  
    --- Master Po Ping
    ^
    >   Consequences! My old nemesis. ---Master Po Ping

    I think I like the first option.

*   Syntax highlighting for code blocks.
*   Make this website the first Google result for my name.
*   Create a kind of personal wiki.
*   Don't have link labels with the `https?://` in paragraphs.  It makes full
    justification difficult for browsers.
*   Maybe use one line per paragraph and wrapping in Vim.  This is better for diffs (TODO:
    Git has some option to highlight the difference).
*   Apparently `px` [doesn't work the way I thought][4]:
    >   Pixels (px) are relative to the viewing device.  For low-dpi devices, 1px is one
    >   device pixel (dot) of the display.  For printers and high resolution screens 1px
    >   implies multiple device pixels.

    I guess using `px` is portable then.

[meta]: /jekyll/2017/09/02/meta.html
[dash]: https://en.wikipedia.org/wiki/Dash
[em dash]: https://en.wikipedia.org/wiki/Dash#Em_dash
[1]: https://kramdown.gettalong.org/syntax.html#typographic-symbols
[2]: https://english.stackexchange.com/q/28601
[quotation dash]: https://en.wikipedia.org/wiki/Quotation_mark#Quotation_dash
[3]: https://english.stackexchange.com/q/28601#comment142336_59320
[4]: https://www.w3schools.com/cssref/css_units.asp

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
