---
layout: page
title: Projects
permalink: /projects/
---

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {{ project.description }}
{% endfor %}

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
