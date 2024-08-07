---
layout: post
extra_css: [images.css]
title: Virtual Environments Demystified
description: The number of available programs for managing virtual environments is
    bafflingly large.  This post boils down what exactly a Python virtual environments is
    by creating one manually.
categories: python
image: /assets/virtual-boy-avgn.jpg
changelog: true
---

<p>
<div class="confined-img-aspect-ratio-box"
     style="padding-top: calc(640 / 1464 * 100% + 640 / 1464 * 15px)">
<picture>
<source type="image/webp"
srcset="/assets/virtual-boy-avgn-651w.webp 651w,
        /assets/virtual-boy-avgn-976w.webp 976w,
        /assets/virtual-boy-avgn-1464w.webp 1464w"
sizes="(max-width: 75ch) 100vw, 75ch">
<img class="aspect-ratio-box-inside" src="/assets/virtual-boy-avgn.jpg"
     alt="The nerd with his Virtual Boy">
</picture>
</div>
</p>

Here's a non-exhaustive list of programs that are all meant to help create or manage
virtual environments in some way:

>   [Hatch](https://github.com/ofek/hatch),
>   [VirtualEnvManager](https://pypi.python.org/pypi/VirtualEnvManager),
>   [autoenv](https://github.com/kennethreitz/autoenv),
>   [fades](https://github.com/PyAr/fades),
>   [inve](https://gist.github.com/datagrok/2199506#a-better-activate-inve),
>   [pew](https://github.com/berdario/pew),
>   [pipenv](https://github.com/kennethreitz/pipenv),
>   [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv),
>   [pyenv-virtualenvwrapper](https://github.com/pyenv/pyenv-virtualenvwrapper),
>   [pyenv](https://github.com/pyenv/pyenv),
>   [pyvenv][],
>   [rvirtualenv](https://github.com/kvbik/rvirtualenv),
>   [tox](https://github.com/tox-dev/tox),
>   [v](https://github.com/borntyping/v),
>   [venv][library/venv],
>   [vex](https://pypi.python.org/pypi/vex),
>   [virtual-python][],
>   [virtualenv-burrito](https://github.com/brainsik/virtualenv-burrito),
>   [virtualenv-mv](https://github.com/brbsix/virtualenv-mv),
>   [virtualenv][],
>   [virtualenvwrapper-win](https://pypi.python.org/pypi/virtualenvwrapper-win),
>   [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper),
>   [workingenv](https://pypi.python.org/pypi/workingenv.py)

Clearly, this stuff must be really hard to get right.  I also must be a moron, since,
after having written some thousand lines of Python, I don't even know what problem we are
trying to solve here, and the abundance of relevant programs with subtly different names
has deterred me from reading up on it so far.

So what is a virtual environment?  The [official docs' tutorial][tutorial/venv] describes
it as

>   a self-contained directory tree that contains a Python installation for a particular
>   version of Python, plus a number of additional packages.

A directory with a Python interpreter?  Easy enough.

```
$ mkdir virtual_env
$ cp /bin/python3 virtual_env/
```

Let's see.  Directory?  Check.  Contains a Python installation?  Check.  Contains a number
of additional packages?  Zero is a number!  (Check.)  Particular version?  Um...

```
$ cd virtual_env/
$ ./python3 --version
Python 3.6.3
```

I think that will do.  Is it self-contained, though?  It doesn't contain itself...

<div style="width: 33%; margin: auto">
<picture>
<source type="image/webp"
srcset="/assets/russell-200w.webp 200w,
        /assets/russell-300w.webp 300w,
        /assets/russell-450w.webp 450w,
        /assets/russell-675w.webp 675w"
sizes="(max-width: 75ch) 33vw, 25ch">
<img class="normal-img" style="width: 100%"
src="/assets/russell.png"
alt="Another nerd: Bertrand Russell in 1916"
title="Consider the directory containing all directories that don't contain themselves.">
</picture>
</div>

Jokes aside, there are only two things missing to actually make our directory a virtual
environment as specified by [PEP 405][], the proposal that integrated a standard mechanism
for virtual environments with Python.[^before-405]

[^before-405]: Before PEP 405 was accepted, virtual environments were purely the domain of
    third-party tools with no direct support from the language itself.

1.  A file named `pyvenv.cfg` containing the line `home = /usr/bin`
2.  A `lib/python3.6/site-packages` subdirectory

(Both paths are subject to the OS and the second one also to the Python version used.)

```
$ echo 'home = /usr/bin' > pyvenv.cfg
$ mkdir -p lib/python3.6/site-packages
```

I will also move the Python binary into a `bin` subdirectory.[^why-tho]

```
$ mkdir bin && mv python3 bin/
```

[^why-tho]: I think this *should* not be necessary.  But, because of what I assume to be a
    bug in CPython, it is.  A `bin/` subdirectory certainly is the conventional location
    for the binary, though.

{::comment}
>   [T]he internal virtual environment layout mimics the layout of the Python installation
>   itself on each platform.  
>   ---<https://www.python.org/dev/peps/pep-0405/#creating-virtual-environments>
{:/comment}

Fair.  We have a directory that formally qualifies as a virtual environment:

```
$ tree --noreport
.
├── bin
│   └── python3
├── lib
│   └── python3.6
│       └── site-packages
└── pyvenv.cfg
```

This leads us to the next question.

## What's the point?

When we run our copy of the Python binary, the `pyvenv.cfg` file changes what happens
during startup: the presence of the `home` key tells Python the binary belongs to a
virtual environment, the key's value (`/usr/bin`) tells it where to find a complete Python
installation that includes the standard library.

The bottom line is that `./lib​/python3.6​/site-packages` becomes part of the [module search
path][].  The point is that we can now install packages to that location, in particular,
specific versions that may conflict with the dependencies of another Python program on the
same system.[^python-level-isolation]

[^python-level-isolation]: Be aware that we only get [Python-level isolation][].

[Python-level isolation]: https://web.archive.org/web/20191129151330/https://pythonrants.wordpress.com/2013/12/06/why-i-hate-virtualenv-and-pip/

[module search path]: https://docs.python.org/3/library/site.html

For example, if your project needs exactly version 0.0.3 of
[left-pad](https://pypi.python.org/pypi/left-pad):

```
$ pip3 install -t lib/python3.6/site-packages/ left-pad==0.0.3
```

Now this will work:

```
$ ./bin/python3 -c 'import left_pad'
```

While this should raise [`ModuleNotFoundError`], as desired:

```
$ python3 -c 'import left_pad'
```

[`ModuleNotFoundError`]: https://docs.python.org/3/library/exceptions.html#ModuleNotFoundError

Another project on the same system could have a different version of left-pad in its own
virtual environment, without interfering with this one.

<!--
TODO: talk about isolation from the system-level and user-level site-packages directories?
-->

## The standard tool for creating virtual environments

In practice, one does not simply create virtual environments by hand, which brings us back
to the dauntingly long list of tools above.  Fortunately, one of them is not like the
others, because it ships with Python as part of the
standard library: [*venv*][library/venv].[^venv-and-pyvenv]

[^venv-and-pyvenv]: pyvenv also ships with Python, but was deprecated in version 3.6.
    Both venv and pyvenv were added to Python in version 3.3.

In its simplest form, venv is used to create a virtual environment like so:

```
$ python3 -m venv virtual_env
```

This creates the `virtual_env` directory and also copies or symlinks the Python
interpreter:

```
$ cd virtual_env
$ find -name python3
./bin/python3
```

It also copies a bunch of other stuff: I get 650 files in 89 subdirectories amounting to
about 10 MiB in total.  One of those files is the `pip` binary, and we can use it to
install packages into the virtual environment without passing extra command-line
arguments:

```
$ ./bin/pip install left-pad
```

You can read more about using venv and *optional* magic like "activate" scripts in the
[Python tutorial](https://docs.python.org/3/tutorial/venv.html) or venv's
[documentation](https://docs.python.org/3/library/venv.html)---this post is only meant to
boil down what a virtual environment actually is.

## Summary

A virtual environment is a directory containing a Python interpreter, a special
`pyvenv.cfg` file that affects startup of the interpreter, and some third-party Python
packages.  Python packages installed into a virtual environment will not interfere with
other Python applications on the same system.  The "[standard tool for creating virtual
environments](https://docs.python.org/3/installing/)" is venv.

## Appendix: timeline

<!-- TODO: When and by whom was the term "virtual environment" coined? -->

I think Ian Bicking's [`non_root_python.py`][] qualifies as the first tool for creating
virtual environments.  Based on that, [`virtual-python.py`][] was
[added][setuptools-commit-3df2aab] to [EasyInstall][] in version
[0.6a6][easy-install-release-notes] in October 2005.  Here's a timeline summarizing some
main events.

2005-10-17
:   `virtual-python.py` is added to EasyInstall.

2006-03-08
:   Ian Bicking publishes a blog post about improving `virtual-python.py` titled
    "[Working Environment Brainstorm][working-env-brainstorm]".

2006-03-15
:   Ian Bicking [announces][working-env-post] [`working-env.py`][].

2006-04-26
:   Ian Bicking [announces][workingenv-revisited-post] an improved version of
    `working-env.py` called [workingenv][].
{::comment}
TODO: did anything important happen here?
{:/}

2007-09-14
:   [virtualenv][]'s [first commit][virtualenv-initial-commit]

2007-10-10
:   Ian Bicking announces virtualenv: "[Workingenv is dead, long live
Virtualenv!][virtualenv-post]"

2009-10-24
:   `virtual-python.py` is [removed][setuptools-commit-43d3473] from EasyInstall.
{::comment}
TODO: did anything important happen here?
{:/}

2011-06-13
:   PEP 405 is created.

2012-05-25
:   PEP 405 is accepted for inclusion in Python 3.3.

2012-09-29
:   [Python 3.3][] is released and venv and [pyvenv][] become part of the
    standard library.

2014-03-16
:   [Python 3.4][] is released and venv "[defaults to installing pip into all created
    virtual environments][installing]" now.

2015-09-13
:   [Python 3.5][] is released.  "[The use of venv is now recommended for creating virtual
environments.][installing]"

2016-12-23
:   [Python 3.6][] is released; "[pyvenv was the recommended tool for creating virtual
environments for Python 3.3 and 3.4, and is deprecated in Python 3.6.][installing]"

[Python 3.3]: https://docs.python.org/dev/whatsnew/3.3.html#pep-405-virtual-environments
[Python 3.4]: https://docs.python.org/dev/whatsnew/3.4.html
[Python 3.5]: https://docs.python.org/dev/whatsnew/3.5.html
[Python 3.6]: https://docs.python.org/dev/whatsnew/3.6.html#id8
[`working-env.py`]: https://web.archive.org/web/20060425105635/http://svn.colorstudy.com/home/ianb/working-env.py
[easy-install-release-notes]: http://peak.telecommunity.com/DevCenter/EasyInstall#release-notes-change-history
[installing]: https://docs.python.org/3/installing/
[setuptools-commit-3df2aab]: https://github.com/pypa/setuptools/commit/3df2aabcc056e6d001355d4cec780437387ac4fa
[setuptools-commit-43d3473]: https://github.com/pypa/setuptools/commit/43d34734c801d2d9a72d5fa6e7fc74d80bdc11c1
[virtualenv-initial-commit]: https://github.com/pypa/virtualenv/commit/e02aa46f4f0eb5321c31641e89bde2c9b92547bb
[virtualenv-post]: http://www.ianbicking.org/blog/2007/10/workingenv-is-dead-long-live-virtualenv.html
[working-env-brainstorm]: http://www.ianbicking.org/working-env-brainstorm.html
[working-env-post]: http://www.ianbicking.org/working-env.html
[workingenv-revisited-post]: http://www.ianbicking.org/workingenv-revisited.html
[workingenv]: https://web.archive.org/web/20060516191525/http://svn.colorstudy.com:80/home/ianb/workingenv

## Notes
{:style="display: initial"}

*   The "Virtual Boy" image is used with permission from
    [James Rolfe](https://en.wikipedia.org/wiki/James_Rolfe).
*   If you found this article helpful or otherwise worthwhile and want to say thanks, one
    way you can do so is by [buying me a coffee](https://www.buymeacoffee.com/meribold).

[library/venv]: https://docs.python.org/3/library/venv.html
    "The Python Standard Library: venv — Creation of virtual environments"
[PEP 405]: https://www.python.org/dev/peps/pep-0405/
    "PEP 405 -- Python Virtual Environments"
[tutorial/venv]: https://docs.python.org/3/tutorial/venv.html
    "The Python Tutorial: Virtual Environments and Packages"

[EasyInstall]: https://en.wikipedia.org/wiki/Setuptools#EasyInstall
[`non_root_python.py`]: https://web.archive.org/web/20051203055434/http://svn.colorstudy.com/home/ianb/non_root_python.py
[pyvenv-deprecated]: https://docs.python.org/dev/whatsnew/3.6.html#id8
[pyvenv]: https://github.com/python/cpython/blob/3.6/Tools/scripts/pyvenv
[virtualenv]: https://github.com/pypa/virtualenv
[virtual-python]: http://peak.telecommunity.com/DevCenter/EasyInstall#creating-a-virtual-python
[`virtual-python.py`]: http://peak.telecommunity.com/dist/virtual-python.py

*[OS]: Operating system
*[PEP]: Python Enhancement Proposal
*[pip]: pip installs packages
