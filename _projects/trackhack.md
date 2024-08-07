---
layout: page
extra_css: [images.css]
title: TrackHack
description: Single-particle tracking program written in C++
---

TrackHack is a simple and fast, interactive single-particle tracking program for GNU/Linux
and Windows.  The tracking algorithm is designed for following living cells
through sequences of phase shift images obtained using [digital holographic
microscopy][dhm].

The program is written in C++ using some [Boost][] libraries (Filesystem, Regex, Thread)
and [wxWidgets][] for the GUI.  The source code is available on [GitHub][].

![screenshot]{:style="max-width: min(100vw - 15px, 110%)"}

[dhm]: https://en.wikipedia.org/wiki/Digital_holographic_microscopy
[Boost]: https://en.wikipedia.org/wiki/Boost_(C%2B%2B_libraries)
[wxWidgets]: https://en.wikipedia.org/wiki/WxWidgets
[screenshot]: {{ "/assets/trackhack-screenshot.png" | relative_url }}
[GitHub]: https://github.com/meribold/TrackHack

*[GUI]: Graphical user interface
