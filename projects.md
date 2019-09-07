---
layout: page
title: Projects
description: A list of programs I wrote and other projects.
last_modified_at: 2017-10-09
permalink: /projects/
---

<!-- TODO: write something here? -->

## Software

<!-- TODO: write something here? -->

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {{ project.description }}
{% endfor %}

I also dabbled in [Haskell][haskell-experiments], and wrote some more small [Warcraft
addons][curseforge] which are mostly dead now.  Most of my experience is with C++, Lua,
Python, and Bash.

<!--
For a C++ class in university, I wrote a crude, interactive [ecosystem
simulation][flutterrust] with an infinite, procedurally generated map.
-->

## Articles

"[Scoring Board Games with Computer Vision][1]" (2018)
: Thesis about automating end-of-game scoring of board games based on photos taken with
  camera phones

"[Hardware Caches and Optimization][2]" (2017)
: Seminar paper about CPU caches with illustrative code samples and profiling results

[1]: {{ site.url }}/thesis.pdf
[2]: {{ site.url }}/assets/cache-paper.pdf

<!-- We could also use <https://www.curseforge.com/members/meribold/projects>. -->
[curseforge]: https://wow.curseforge.com/members/meribold/projects
[haskell-experiments]: https://github.com/meribold/haskell-experiments
[flutterrust]: https://github.com/meribold/flutterrust

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
