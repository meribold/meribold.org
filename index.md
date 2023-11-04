---
layout: default
extra_css: [images.css, index.css]
---

<script>
  {% include epigraph.js %}
</script>

I'm a yak shaver that likes FOSS, Tolkien, TrackPoints, coffee, tweaking [my dotfiles][],
and writing software.  My name is Lukas Waymann and my usual username is
Meribold.  This is my website.

Once in a while, I write an article for this website.  So far this has happened four
times.

<div style="display: table;">
  {% for post in site.posts %}
    {% unless post.draft or post.categories contains "video" %}
      <div>
        <span class="post-list-meta">{{ post.date | date: site.date_format }}</span>
        <span class="post-list-link">
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </span>
      </div>
    {% endunless %}
  {% endfor %}
</div>

You can reach me at <a href="mailto:{{ site.email }}">{{ site.email }}</a>.
If you want to use encryption you can [download my PGP
key](/pgp-key-meribold-7066ac79c4592c12.txt).
You can also contact me via [Matrix](https://matrix.to/#/@meribold:matrix.org).
Or you can find me on
[GitHub](https://github.com/meribold),
[YouTube](https://www.youtube.com/@meribold),
<a rel=me href="https://mastodon.social/@meribold">Mastodon</a>,
[Twitter](https://twitter.com/meribold), and
[LinkedIn](https://www.linkedin.com/in/meribold/).

If you really like an article or program I wrote and want to say thanks, one way you can
do so is by [buying me a
coffee](https://www.buymeacoffee.com/meribold).  If you're looking for a detail-oriented
C++ or Python developer with Linux, UI design, or computer vision experience, you can
[check out my résumé](/resume.pdf).

[my dotfiles]: https://github.com/meribold/dotfiles

# Videos

<p>
<div style="display: table;">
  {% for post in site.categories["video"] %}
    <div>
      <span class="post-list-meta">{{ post.date | date: site.date_format }}</span>
      <span class="post-list-link">
        <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      </span>
    </div>
  {% endfor %}
</div>
</p>

# PDFs

<p>
<div style="display: table;">
  <div>
    <span class="post-list-meta">{{ "2018-04-23" | date: site.date_format }}</span>
    <span class="post-list-link">
      <a href="{{ "/scoring-board-games-with-computer-vision/" | relative_url }}">Scoring Board Games with Computer Vision</a>
    </span>
  </div>
  <div>
    <span class="post-list-meta">{{ "2017-06-27" | date: site.date_format }}</span>
    <span class="post-list-link">
      <a href="{{ "/assets/cache-paper.pdf" | relative_url }}">Hardware Caches and Optimization</a>
    </span>
  </div>
</div>
</p>

# Projects

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {{ project.description }}
{% endfor %}

I've also written a couple more small [World of Warcraft addons][curseforge], but most of
these are probably defunct now.  You can find some more of my work on [GitHub][].

[GitHub]: https://github.com/meribold
[curseforge]: https://www.curseforge.com/members/meribold/projects
[flutterrust]: https://github.com/meribold/flutterrust

# Blogroll

[noahfrederick.com](https://noahfrederick.com)
: Noah Frederick's website.  So far the main theme here has been Vim.

[www.arp242.net](https://www.arp242.net)
: Martin Tournoij's website.  As far as what I've read goes, topics and themes include
  programming, empathy, FOSS, command-line tools, and society.  Liberal usage of fleurons
  makes having ended up on a post from this blog easy to notice.

[blog.debiania.in.ua](https://blog.debiania.in.ua)
: Alexander Batischev's website.  Themes include Linux, programming, and life lessons.

[usesthis.com](https://usesthis.com)
: Uses This is a website where hundreds of people have shared what tools they use to do
  whatever it is that they do.
