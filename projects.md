---
layout: page
title: Projects
permalink: /projects/
---

<!-- Write something here? -->

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {:style="text-align: initial"}{{ project.description }}
{% endfor %}

I also dabbled in [Haskell][haskell-experiments], and wrote some more small [Warcraft
addons][curse] which are mostly dead now.  Most of my experience is with C++, Lua, Python,
and Bash.

<!--
For a C++ class in university, I wrote a crude, interactive [ecosystem
simulation][flutterrust] with an infinite, procedurally generated map.
-->

[curse]: https://mods.curse.com/members/meribold/projects
[curseforge]: https://wow.curseforge.com/members/meribold/projects
[haskell-experiments]: https://github.com/meribold/haskell-experiments
[flutterrust]: https://github.com/meribold/flutterrust

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
