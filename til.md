---
layout: page
title: Today I Learned…
---

**2024-06-25.**  You can make Less (the pager program) behave a bit more like programs
that use GNU Readline do by creating a `~/.config​/lesskey` file with these contents:

    #line-edit
    ^A home
    ^E end
    ^F right
    ^B left
    ^P up
    ^N down
    ^D delete
    ^W word-backspace
    \ed word-delete
    \ef word-right

**2023-01-24.**  You can get dates and times formatted nicely in Firefox's <i>Library</i>
window (Control+Shift+O) by setting these preferences in `about:config` or `user.js`:

* `intl.date_time.pattern_override.date_short`{:style="word-wrap: break-word"} to
  `yyyy-MM-dd`
* `intl.date_time.pattern_override.time_short`{:style="word-wrap: break-word"} to `HH:mm`
* `intl.date_time.pattern_override.connector_short`{:style="word-wrap: break-word"} to
  `{1} {0}`

Setting the `LC_TIME` environment variable to `en_DK.UTF-8` does not work.

**2022-02-08.**  You can type `-i` while in Less (the pager program) to toggle whether
searches are case sensitive.  I literally mean typing `-i` into Less, not passing a
command-line option.
