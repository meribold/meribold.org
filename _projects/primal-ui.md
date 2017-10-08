---
layout: page
title: Primal UI
description: User interface for World of Warcraft
last_modified_at: 2017-09-12
---

<!-- TODO: special favicon? -->

Primal UI is a highly functional<!--, yet clean and minimal--> user interface for the
World of Warcraft MMOG[^unmaintained] that is optimized for competitive PvP[^gladiator]
and achieves a consistent, minimal, and clean look without omitting <!-- hiding -->
possibly useful information.
<!-- while showing all possibly useful information. -->
<!-- trading off functionality. -->

It comprises a collection of [original Lua addons](https://github.com/Primal-UI) as well
as configuration for existing addons[^addons] and includes interface elements that are
missing from Blizzard's default UI[^missing] and are typically added with poor visual
integration by addons like [Gladius][].

<div class="youtube-wrapper">
    <iframe class="youtube-vid" src="https://www.youtube.com/embed/qVEXJF1SYD4"
    allowfullscreen></iframe>
</div>

The UI makes one major trade-off: to be optimal for one class and specialization (Feral
Druid), I largely ignored usability for playing other classes.

[^unmaintained]: Unfortunately, it is no longer compatible with the latest version of
    World of Warcraft.

[^addons]:
    Primarily [TellMeWhen](https://wow.curseforge.com/projects/tellmewhen) and
    [WeakAuras](https://github.com/WeakAuras/WeakAuras2), but also [Tidy
    Plates](https://wow.curseforge.com/projects/tidy-plates),
    [SexyMap](https://wow.curseforge.com/projects/sexymap), a
    [fork](https://github.com/meribold/OmniCC) of
    [OmniCC](https://github.com/tullamods/OmniCC),
    [OmniBar](https://mods.curse.com/addons/wow/omnibar), and others.

[^gladiator]: I [finished PvP season 16 in the top 0.5% of the 3v3 ladder][gladiator]
    using it.

[^missing]: [DRs][], enemy [cooldowns][cooldown], visually offset [CC][] (and other
    important) auras for party members and arena opponents, ...

<!-- [MMOG]: https://en.wikipedia.org/wiki/Massively_multiplayer_online_game -->
[Gladius]: https://mods.curse.com/addons/wow/gladius
[gladiator]: https://worldofwarcraft.com/en-gb/character/outland/mornien/achievements/feats-of-strength/player-vs-player
<!-- [DR]: https://wow.gamepedia.com/Diminishing_returns -->
[DRs]: http://skill-capped.com/guides/shared_drs.php
[cooldown]: https://wow.gamepedia.com/Cooldown
[CC]: https://wow.gamepedia.com/Crowd_control

*[MMOG]: Massively multiplayer online game
*[PvP]: Player versus player
*[DRs]: Diminishing returns
*[CC]: Crowd control

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
