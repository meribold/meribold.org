---
layout: page
title: Projects
description: A list of programs I wrote and other projects.
last_modified_at: 2021-10-30T22:22+08:00
permalink: /projects/
---

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {{ project.description }}
{% endfor %}

I've also written a couple more small [World of Warcraft addons][curseforge], but most of
these are probably defunct now.  You can find some more of my work on [GitHub][].

[GitHub]: https://github.com/meribold
[curseforge]: https://www.curseforge.com/members/meribold/projects
[flutterrust]: https://github.com/meribold/flutterrust
