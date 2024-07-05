---
layout: page
title: SnapScore
description: >
    SnapScore automates scoring of the <cite>Take It Easy</cite> board game using computer
    vision
---

SnapScore automates scoring of the board game [<cite>Take It Easy</cite>][wp] using
computer vision.
The user takes a photo of their game board, and SnapScore computes the score.  I developed
the image recognition underlying SnapScore in my bachelor's thesis titled [<cite>Scoring
Board Games with Computer Vision</cite>][thesis].

A basic web frontend backed by AWS Lambda is available at [snapscore.meribold.org][].  A
now-discontinued SnapScore Android app was available on Google Play from 2018 to 2023.

[wp]: https://en.wikipedia.org/wiki/Take_It_Easy_(game)
[snapscore.meribold.org]: https://snapscore.meribold.org
[thesis]: {{ "/scoring-board-games-with-computer-vision/" | relative_url }}
