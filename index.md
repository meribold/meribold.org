---
layout: default
extra_css: [images.css, index.css]
---

<script>
  {% include epigraph.js %}
</script>

I'm a yak shaver that likes FOSS, Tolkien, TrackPoints, coffee, tweaking my dotfiles,
and writing software.  My name is Lukas Waymann and my usual username is
Meribold.  This is my website.
Once in a while, I write an article for this website.  So far that has happened four
times:

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

There's also a [TIL page]({{ "/til/" | relative_url }}) (last update from 2024-06-25).
And I'm an unprolific maker of videos:

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

You can reach me at <a href="mailto:{{ site.email }}">{{ site.email }}</a> or on
<a rel=me href="https://mastodon.social/@meribold">Mastodon</a>.  If you want to use
encryption you can [download my PGP key](/pgp-key-meribold-7066ac79c4592c12.txt).
If you really like an article or program I wrote and want to say thanks, one way you can
do so is by [buying me a coffee](https://www.buymeacoffee.com/meribold).
If you're looking for a detail-oriented C++ or Python developer with Linux or UI design
experience, you can [peruse my résumé](/resume.pdf) or find me on
[LinkedIn](https://www.linkedin.com/in/meribold/).

Projects.  Here's some stuff I've worked on over the years:
{:#projects}

{% for project in site.projects %}
[{{ project.title | escape }}]({{ project.url | relative_url }})
: {{ project.description }}
{% endfor %}

[Muccadoro](https://github.com/meribold/muccadoro)
: Pomodoro timer using `figlet`, `cowsay`, and optionally `lolcat`

[`btry`](https://github.com/meribold/btry)
: A (marginally) useful x86-64 ELF executable in 384 bytes

[Dotfiles](https://github.com/meribold/dotfiles)
: Personal dotfiles make using computers tolerable

I've also written a couple more small [<cite>World of Warcraft</cite> addons][curseforge],
but most of these are probably defunct now.  You can find some more of my work on
[GitHub][].

[GitHub]: https://github.com/meribold
[curseforge]: https://www.curseforge.com/members/meribold/projects

Last but not least, I like the idea of blogrolls, so here are some sites I recommend:
{:#blogroll}

[noahfrederick.com](https://noahfrederick.com)
: Noah Frederick's website.  So far the main theme here has been Vim.

[www.arp242.net](https://www.arp242.net)
: Martin Tournoij's website.  As far as what I've read goes, topics and themes include
  programming, empathy, FOSS, command-line tools, and society.  Liberal usage of fleurons
  makes having ended up on a post from this blog easy to notice.

[blog.debiania.in.ua](https://blog.debiania.in.ua)
: Alexander Batischev's website.  Themes include Linux, programming, and life lessons.

[usesthis.com](https://usesthis.com)
: <cite>Uses This</cite> is a website where hundreds of people have shared what tools they
  use to do whatever it is that they do.
