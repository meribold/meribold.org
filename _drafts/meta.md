---
layout: post
title: "Meta"
description: >
    A webpage about creating this website.
date: 2017-09-02
last_modified_at: 2017-09-12
categories: drafts jekyll
sitemap: false
---

<p>
<div class="scrolled-img-wrapper">
<img class="scrolled-img" src="{{ "/assets/xkcd-688.png" | relative_url }}"
     title="The contents of any one panel are dependent on the contents of every panel including itself. The graph of panel dependencies is complete and bidirectional, and each node has a loop. The mouseover text has two hundred and forty-two characters."
     alt="xkcd 688: Self-Description"/>
</div>
</p>

This is a journal of my thoughts---for my own reference and to have something to play
with---while figuring out how to create this static website on [GitHub Pages][].  Step one
is to create a repository with the right name.  For me, that's
[*meribold*.github.io](https://github.com/meribold/meribold.github.io).

[GitHub Pages]: https://pages.github.com

## Rambling about Frameworks

I think I should use [Jekyll][].  It's suggested at [pages.github.com][].  I'm confused
whether this is the only option with GitHub Pages or if there are other frameworks that
can be used.  A Google search for "[blog github pages][1]" mostly results in matches about
Jekyll, but also something about [Pelican][2] and [Hugo][3].  I suppose options other than
Jekyll will require committing the generated HTML pages in addition to the files used to
generate them...  I'll just use Jekyll.

[pages.github.com]: https://pages.github.com
[Jekyll]: https://en.wikipedia.org/wiki/Jekyll_(software)
[1]: https://encrypted.google.com/search?q=blog+github+pages
[2]: https://fedoramagazine.org/make-github-pages-blog-with-pelican/
[3]: https://gohugo.io/hosting-and-deployment/hosting-on-github/

## Installing Jekyll

The [ArchWiki][4] suggests `gem install jekyll`.  There's also a gem called
[`github-pages`][5] that, I think, gives us whatever version of Jekyll is used on GitHub's
side.  Sounds good.  I'll use that version.

[4]: https://wiki.archlinux.org/index.php/Jekyll
[5]: https://jekyllrb.com/docs/github-pages/#use-the-github-pages-gem

The [README][6] of the `github-pages` gem says we need [Bundler][].  The "[quick-start
guide][7]" from the official Jekyll docs  says so too.  The docs' [installation
page][jekyllrb.com/docs/installation/] and the [ArchWiki][4] don't.  Huh.  I guess I'll
install it too.

[6]: https://github.com/github/pages-gem
[Bundler]: https://github.com/bundler/bundler
[7]: https://jekyllrb.com/docs/quickstart/
[jekyllrb.com/docs/installation/]: https://jekyllrb.com/docs/installation/

    $ gem install bundler
    $ gem install github-pages

## Creating a Jekyll Site

Back to the [quick-start guide][7].  The next step is to create the basic scaffolding of a
Jekyll site using `jekyll new`.

    $ cd meribold.github.io/
    $ jekyll new .
    Conflict: /home/meribold/meribold.github.io exists and is not empty.
    $ jekyll new . --force
    Your user account isn't allowed to install to the system RubyGems.
    You can cancel this installation and run:

        bundle install --path vendor/bundle

    to install the gems into ./vendor/bundle/, or you can enter your password
    and install the bundled gems to RubyGems using sudo.

    Password: ^C

Bail.  Installing stuff outside of `$HOME` with something other than the system package
manager is a mistake I made with pip.[^pip]

    $ bundle install --path vendor/bundle

[^pip]: In my defense, pip does make it pretty [easy][pip-issue] to shoot yourself in the
    foot.

[pip-archwiki]: https://wiki.archlinux.org/index.php/Python#Package_management
[pip-issue]: https://github.com/pypa/pip/issues/1668

OK...

    $ jekyll new . --force

Errors...  let's start over.  I removed everything created by `jekyll new` and `bundle
install`.

    $ jekyll new . --force --skip-bundle
    New jekyll site installed in /home/meribold/meribold.github.io.
    Bundle install skipped.
^
    $ bundle exec jekyll serve

Looks promising but <http://localhost:4000> only shows my `index.html` from my initial
commit ([28919f5][]).  Delete it (`rm index.html`).

[28919f5]: https://github.com/meribold/meribold.org/commit/28919f52eb31ca263df3caadc6f4d4ca4ff4e7f3

That's better: some kind of demo page ([1327f24][]).  Let's add this Markdown file as
described in [`_posts/2017-09-02-welcome-to-jekyll.markdown`][welcome-to-jekyll.markdown]
([4f8937c][]):

[1327f24]: https://github.com/meribold/meribold.org/commit/1327f24fdf3227093340df3565e61a2e7da0725a
[welcome-to-jekyll.markdown]: https://github.com/meribold/meribold.github.io/blob/1327f24fdf3227093340df3565e61a2e7da0725a/_posts/2017-09-02-welcome-to-jekyll.markdown
[4f8937c]: https://github.com/meribold/meribold.org/commit/4f8937cdcf510f7e1b494d410c175581de638428

    $ mv meta.md _posts/$(date -I)/meta.md

When I serve the site locally, the new post shows up but isn't themed.  On GitHub it
somehow is themed.  Anyway, it probably needs some front matter: [34c1623][].  That does
it.

[34c1623]: https://github.com/meribold/meribold.org/commit/34c1623b3ca4d21b09b74e203d4925dee66d4d60

At this point I looked at and edited all those other files `jekyll new` created.

## Fork the Theme

I want to include my theme in my repository so I can make major changes easily.  This is
covered [here][8].  It's also possible to use a [gem-based theme][] and selectively
override defaults while still getting updates to the theme used.

[8]: https://jekyllrb.com/docs/themes/#converting-gem-based-themes-to-regular-themes
[gem-based theme]: https://jekyllrb.com/docs/themes/#understanding-gem-based-themes

>   The goal of gem-based themes is to allow you to get all the benefits of a robust,
>   continually updated theme without having all the theme's files getting in your way and
>   over-complicating what might be your primary focus: creating content.  
>   ---[Tom Johnson][]

[Tom Johnson]: https://github.com/jekyll/jekyll/commit/a6d357050a33b95eb448c962d7a6a6279c9e3de6

I don't want my theme to randomly change, though.  (And probably break my overrides in the
process.)

    $ bundle show minima
    /home/meribold/.gem/ruby/2.4.0/gems/minima-2.1.1
    $ cp -r /home/meribold/.gem/ruby/2.4.0/gems/minima-2.1.1/* .
    $ git checkout README.md # oops, restory my readme file
    $ git add -A
    $ git commit -m 'Fork the theme'

See commit [f978760][].

[f978760]: https://github.com/meribold/meribold.org/commit/f978760a2d7953671c57d3a3f6be7776c8e6435a

## Destroy

I removed almost everything from the [Minima][minima] theme ([de12477][]) to figure things
out from the ground up.  By the time you read this I hopefully created custom styling that
doesn't suck.

[minima]: https://github.com/jekyll/minima
[de12477]: https://github.com/meribold/meribold.org/commit/de124779eeeb7d4e83ad84dd2812cce9d902d791

## Google

Google only has two results for "[site:meribold.github.io][9]" (the site currently has 10
pages).  Following the advice of whatever ranks highly when searching for "[jekyll
seo][10]" seems logical.

[9]: https://encrypted.google.com/search?q=site%3Ameribold.github.io
[10]: https://encrypted.google.com/search?q=jekyll+seo

The [jekyll-seo-tag][] plugin will apparently automate adding a bunch of metadata tags
that will help ([a6d1930][]).  I'm also using the [jekyll-sitemap][] gem now ([435a157][])
to generate this [`sitemap.xml`][sitemap.xml][^robots] and [submitted it to Google][gsc].
Sitemaps "[inform search engines about URLs on a website that are available for
crawling][Sitemaps]".

[^robots]: It [also generates][11] [`robots.txt`][robots.txt].

[jekyll-seo-tag]: https://github.com/jekyll/jekyll-seo-tag
[a6d1930]: https://github.com/meribold/meribold.org/commit/a6d193008adb270710e9a370433ab6acefc369e5
[jekyll-sitemap]: https://github.com/jekyll/jekyll-sitemap
[435a157]: https://github.com/meribold/meribold.org/commit/435a1578492f93e0af8c1380399ecf314cf25b2a
[sitemap.xml]: /sitemap.xml
[gsc]: https://en.wikipedia.org/wiki/Google_Search_Console
[Sitemaps]: https://en.wikipedia.org/wiki/Sitemaps
[11]: https://github.com/jekyll/jekyll-sitemap/blob/2e2bb3cf19a0e070e77986f67d6c2e1ac6334107/History.markdown#minor-enhancements-2
[robots.txt]: /robots.txt

A day later (09-13), this hasn't worked out.  There is currently one Google result and the
snippet's title isn't updated.  I added some semi-made-up modification date metadata to
most pages ([d1404b2][]) that jekyll-sitemap will [use for `<lastmod>` tags][09-13.1]
(most pages were lacking this tag completely, though it was present when building
locally).  Then I submitted the Sitemap to Google again (this is probably unnecessary?)
and also [requested recrawling of my site][09-13.2].

[d1404b2]: https://github.com/meribold/meribold.org/commit/d1404b247678201d811917662b17bbef74b61997
[09-13.1]: https://github.com/jekyll/jekyll-sitemap#lastmod-tag
[09-13.2]: https://support.google.com/webmasters/answer/6065812

Another day later (09-14), there is still one result with an outdated title.  Yet another
day later (09-15), there now are no results... here's a table:

| Date  | Results | Outdated Titles |
|-------|---------|-----------------|
| 09-13 | 1       | 1               |
| 09-14 | 1       | 1               |
| 09-15 | 0       | 0               |
| 09-16 | 0       | 0               |
| 09-17 | 0       | 0               |
| 09-18 | 2       | 1               |
| 09-19 | 3       | 1               |

At some point I noticed that google.com and google.de didn't give the same results, so I
started checking both of them.

| Date  | Results on .com TLD | Outdated Titles | Results on .de TLD | Outdated Titles |
|-------|---------------------|-----------------|--------------------|-----------------|
| 09-20 | 4                   | 1               | 4                  | 2               |
| 09-21 | 5                   | 2               | 5                  | 2               |
| 09-22 | 4                   | 1               | 5                  | 2               |
| 09-23 | 3                   | 1               | 3                  | 1               |
| 09-24 | 3                   | 1               | 3                  | 1               |
| 09-25 | 3                   | 1               | 3                  | 1               |

It looks like the results are stabilizing but that's just chance.  To the contrary, they
change way more frequently than I noticed before.  Here's a table with the number of
results at various times (given in UTC) of the same day (2017-09-25):

| Time  | Results on .com TLD | Outdated Titles | Results on .de TLD | Outdated Titles |
|-------|---------------------|-----------------|--------------------|-----------------|
| 10:04 | 5                   | 2               | 5                  | 2               |
| 13:31 | 6                   | 2               | 5                  | 2               |
| 14:07 | 6                   | 2               | 6                  | 2               |
| 15:50 | 5                   | 2               | 6                  | 2               |
| 18:44 | 5                   | 2               | 5                  | 2               |
| 19:35 | 3                   | 1               | 3                  | 1               |

Some observations:

*   On 22., at least one more page could be found by [adding keywords][15].  <!-- (Didn't
    work on google.com.) --> Generally, including words from page titles in searches gives
    new results sometimes.
*   Maybe my `description` meta tags shouldn't repeat the descriptions that are already on
    the [projects][] page.
*   What pages have outdated titles didn't change, so I can probably try updating the
    timestamps (`<lastmod>` tags) of those: [/projects/](/projects/) and the current one.
*   I think all pages were indexed on the 20.  That's what [Google Search Console][gsc]
    says.[^processed]

[^processed]: It says `/sitemap.xml` was submitted on 2017-09-12, processed on 2017-09-20,
    and 10 out of 11 links were indexed.  I assume [this][14] is the one that wasn't.

[14]: /googled1df7058b163306e.html
[15]: https://www.google.de/search?q=site%3Ameribold.github.io+pvp
[projects]: /projects

## CSS

This section is a gallery of tricky and not-so-tricky content that tests how the CSS
copes.

This was an `h2` heading.

### Headings

This was an `h3` heading.

#### All

This was an `h4` heading.  It looks like `h3` and I'm trying not to use it on this site.

##### The Way

This was an `h5` heading.  It looks like `h4` and I'm trying not to use it on this site.

###### Down

This was an `h6` heading.  It looks like `h5` and I'm trying not to use it on this site.

#### Code Snippets

The following code block has quite long lines.  It may extend to the right of where the
main text is wrapped if it needs the space and the viewport is wide enough.  If you're
using a phone it probably just has a horizontal scrollbar.

```c
// This is a code block with quite long lines.  It tests how the CSS copes with something like that.

int sometimes_people_use_variable_names_which_are_much_too_long = of_course_this_can_be_somewhat_annoying();

int main() {
    printf("Hello, world!\n");
}
```

Here's another code block.  This one has a pretty ridiculous amount of characters per
line; it may extend to the very right of the viewport and still have a horizontal
scrollbar.

```c
// In actual practice some hard line breaks should probably be added to a code block with as many characters per line as this one.

int sometimes_people_use_variable_names_which_are_much_too_long = of_course_this_can_be_somewhat_annoying() + especially_when_all_names_follow_the_same_pattern();
```

## Footnotes

*   The comic strip at the top is [*xkcd* number 688](https://xkcd.com/688/) by [Randall
    Munroe](https://en.wikipedia.org/wiki/Randall_Munroe).

*[gem]: A RubyGem is a packaged Ruby program that can be installed with the RubyGems package manager.
*[pip]: pip installs packages
*[TLD]: Top-level domain
*[TLDs]: Top-level domains
*[CSS]: Cascading Style Sheets
