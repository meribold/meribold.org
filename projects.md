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

I also dabbled in [Haskell][haskell-experiments], and wrote some more small [World of
Warcraft addons][curseforge] which are mostly dead now.  You can find some more stuff on
[GitHub][].

## Articles

[Scoring Board Games with Computer Vision][1] (2018)
: Thesis about automating end-of-game scoring of board games based on photos taken with
  camera phones

[Hardware Caches and Optimization][2] (2017)
: Seminar paper about CPU caches with illustrative code samples and profiling results

[1]: https://s3.eu-central-1.amazonaws.com/meribold.org/thesis.pdf
[2]: {{ site.url }}/assets/cache-paper.pdf

[GitHub]: https://github.com/meribold
[curseforge]: https://www.curseforge.com/members/meribold/projects
[haskell-experiments]: https://github.com/meribold/haskell-experiments
[flutterrust]: https://github.com/meribold/flutterrust
