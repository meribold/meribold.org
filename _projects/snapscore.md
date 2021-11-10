---
layout: page
extra_css: [images.css]
title: SnapScore
description: >
    Android app that automates scoring of the *Take It Easy* board game using computer
    vision
last_modified_at: 2018-10-23
---

<style>
main p:last-child { margin-bottom: 0.25em }
main { margin-bottom: 0.75em }
</style>

<div class="confined-img-aspect-ratio-box"
     style="float: left; margin-right: 1em; margin-bottom: 0.25em; width: 45%;
            padding-top: calc(1280 / 720 * 45%)">
<img class="aspect-ratio-box-inside"
     src="{{ "/assets/snapscore-screenshot.png" | relative_url }}"
     alt="A screenshot of the SnapScore Android app">
</div>

SnapScore is an Android app that automates scoring of the board game [*Take It Easy*][]
using computer vision.  The user takes a photo of their game board and the app will
display the score.

You can find the app on [Google Play][].  The source code is available on [GitHub][].

[*Take It Easy*]: http://www.burleygames.com/board-games/take-it-easy/
[Google Play]: https://play.google.com/store/apps/details?id=xyz.meribold.snapscore
[GitHub]: https://github.com/meribold/snapscore-android
