---
layout: page
extra_css: [images.css]
title: SnapScore
description: >
    Android app that automates scoring of the *Take It Easy* board game using computer
    vision
---

<style>
main p:last-child { margin-bottom: 0.25em }
main { margin-bottom: 0.75em }
</style>

<div class="confined-img-aspect-ratio-box"
     style="float: left; margin: 0 1em 0.25em 0; width: 45%;
            padding-top: calc(1280 / 720 * 45%)">
<picture>
<source type="image/webp"
srcset="/assets/snapscore-screenshot-480w.webp 480w,
        /assets/snapscore-screenshot-720w.webp 720w"
sizes="(max-width: 75ch) 45vw, 33.75ch">
<img class="aspect-ratio-box-inside"
     src="{{ "/assets/snapscore-screenshot.png" | relative_url }}"
     alt="A screenshot of the SnapScore Android app">
</picture>
</div>

SnapScore is an Android app that automates scoring of the board game [*Take It Easy*][]
using computer vision.  The user takes a photo of their game board, and the app displays
the score.

You can find the app on [Google Play][].  The source code is available on [GitHub][].

[*Take It Easy*]: http://www.burleygames.com/board-games/take-it-easy/
[Google Play]: https://play.google.com/store/apps/details?id=xyz.meribold.snapscore
[GitHub]: https://github.com/meribold/snapscore-android
