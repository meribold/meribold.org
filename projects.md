---
layout: page
title: Projects
description: A list of programs I wrote and other projects.
last_modified_at: 2017-10-09
permalink: /projects/
---

## Software

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {{ project.description }}
{% endfor %}

I've also written a couple more small [World of Warcraft addons][curseforge], but most of
these are probably defunct now.  You can find some more of my work on [GitHub][].

## Articles

[Scoring Board Games with Computer Vision][1] (2018)
: Thesis about automating end-of-game scoring of board games based on photos taken with
  camera phones

[Hardware Caches and Optimization][2] (2017)
: Seminar paper about CPU caches with illustrative code samples and profiling results

[1]: https://s3.eu-central-1.amazonaws.com/meribold.org/thesis.pdf
[2]: {{ "/assets/cache-paper.pdf" | relative_url }}

[GitHub]: https://github.com/meribold
[curseforge]: https://www.curseforge.com/members/meribold/projects
[flutterrust]: https://github.com/meribold/flutterrust
