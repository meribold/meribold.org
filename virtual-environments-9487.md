---
layout: post
title: Virtual Environments Demystified
description: TODO
categories: python
sitemap: false
---

<a href="#image-sources">
<img class="confined-img"
src="{{ site.url }}/assets/virtual-boy-avgn.jpg"
alt="The fucking nerd with his Virtual Boy"
title="What were they thinking?!">
</a>

**H**ere's a non-exhaustive list of programs that are all meant to help create or manage
virtual environments in some way:
[pipenv](https://github.com/kennethreitz/pipenv),
[v](https://github.com/borntyping/v),
[pyenv-virtualenvwrapper](https://github.com/pyenv/pyenv-virtualenvwrapper),
[inve](https://gist.github.com/datagrok/2199506#a-better-activate-inve),
[autoenv](https://github.com/kennethreitz/autoenv),
[virtualenv-mv](https://github.com/brbsix/virtualenv-mv),
[vex](https://pypi.python.org/pypi/vex),
[virtualenv-burrito](https://github.com/brainsik/virtualenv-burrito),
[pew](https://github.com/berdario/pew),
[fades](https://github.com/PyAr/fades),
[virtualenvwrapper-win](https://pypi.python.org/pypi/virtualenvwrapper-win),
[venv][library/venv],
[virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper),
[pyvenv][],
[virtualenv][],
[tox](https://github.com/tox-dev/tox),
[VirtualEnvManager](https://pypi.python.org/pypi/VirtualEnvManager),
[pyenv](https://github.com/pyenv/pyenv),
[rvirtualenv](https://github.com/kvbik/rvirtualenv),
[workingenv](https://pypi.python.org/pypi/workingenv.py),
[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv),
[Hatch](https://github.com/ofek/hatch),
[virtual-python][].

Clearly, this stuff must be really hard to get right.  I also must be a moron, since,
after having written some thousand lines of Python, I don't even know what problem we are
trying to solve here, and the abundance of relevant programs with subtly different names
has deterred me from reading up on it so far.

## So what *is* a virtual environment?

The [official docs' tutorial][tutorial/venv] describes a virtual environment as

>   a self-contained directory tree that contains a Python installation for a particular
>   version of Python, plus a number of additional packages.

So it's a directory with a Python interpreter?  Easy enough.

```bash
$ mkdir virtual_env
$ cp /bin/python3 virtual_env/
```

Let's see.  Directory?  Check.  Contains a Python installation?  Check.  Contains a number
of additional packages?  Zero is a number!  (Check.)  Particular version?  Um...

```bash
$ cd virtual_env/
$ ./python3 --version
Python 3.6.3
```

I think that will do.  Is it self-contained, though?  It doesn't contain itself...

<a href="#image-sources" style="display: block; width: 33%; margin: auto">
<img class="normal-img" style="width: 100%"
src="{{ site.url }}/assets/russell.png"
alt="Another nerd: Bertrand Russell in 1916"
title="Consider the directory containing all directories that don't contain themselves.">
</a>

Jokes aside, there are only two things missing to actually make our directory a virtual
environment as specified by [PEP 405][], the proposal that integrated a standard mechanism
for virtual environments with Python.[^before-405]

[^before-405]: Before PEP 405 was accepted, virtual environments were purely the domain of
    third-party tools with no direct support from the language itself.

1.  A file named `pyvenv.cfg` containing the line `home = /usr/bin`
2.  A `lib/python3.6/site-packages` subdirectory

(Both paths are subject to the OS and the second one also to the Python version used.)

```bash
$ echo 'home = /usr/bin' > pyvenv.cfg
$ mkdir -p lib/python3.6/site-packages
```

I will also move the Python binary into a `bin` subdirectory.[^why-tho]

```bash
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

```bash
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

The bottom line is that `./lib/python3.6/site-packages` becomes part of the [module search
path][].  The point is that we can now install packages to that location, in particular,
specific versions that may conflict with the dependencies of another Python program on the
same system.[^python-level-isolation]

[^python-level-isolation]: Be aware that we only get [python-level isolation][].

[python-level isolation]: https://pythonrants.wordpress.com/2013/12/06/why-i-hate-virtualenv-and-pip/

[module search path]: https://docs.python.org/3/library/site.html

For example, if your project needs exactly version 0.0.3 of
[left-pad](https://pypi.python.org/pypi/left-pad):

```bash
$ pip3 install -t lib/python3.6/site-packages/ left-pad==0.0.3
```

Now this will work:

```bash
$ ./bin/python3 -c 'import left_pad'  # OK
```

And this will not:

```bash
$ python3 -c 'import left_pad'  # module not found
```

<!--
TODO: talk about isolation from the system-level and user-level site-packages directories?
-->

## The standard tool for creating virtual environments

In practice, one does not simply create virtual environments by hand, which brings us back
to the dauntingly long list of tools above.  Fortunately, one of them is not like the
others.  While it's predated by most of them, this one ships with Python as part of the
standard library: [*venv*][library/venv].[^venv-and-pyvenv]

[^venv-and-pyvenv]: Actually, pyvenv also ships with Python, but was deprecated in version
    3.6 (only 3 minor versions after its introduction).  Both venv and pyvenv were added
    to Python in version 3.3.

In its simplest form, venv is used to create a virtual environment like so:

```bash
$ python3 -m venv virtual_env
```

This creates the `virtual_env` directory and also copies or symlinks the Python
interpreter:

```bash
$ cd virtual_env
$ find -name python3
./bin/python3
```

It also copies a bunch of other stuff: I get 650 files in 89 subdirectories amounting to
about 10 MiB in total.  One of those files is the `pip` binary, and we can use it to
install packages into the virtual environment without passing extra command-line
arguments:

```bash
$ ./bin/pip install left-pad
```

You can read more about using venv and *optional* magic like "activate" scripts in the
[Python tutorial](https://docs.python.org/3/tutorial/venv.html) or venv's
[documentation](https://docs.python.org/3/library/venv.html)---this post is only meant to
boil down what a virtual environment actually is.

## Summary

**A** virtual environment is a directory containing a Python interpreter, a special
`pyvenv.cfg` file that affects startup of the interpreter, and some third-party Python
modules.

**P**ython modules installed into a virtual environment will not interfere with other
Python applications on the same system.

**T**he "[standard tool for creating virtual
environments](https://docs.python.org/3/installing/)" is venv.

## Appendices

### History

<!-- TODO: When and by whom was the term "virtual environment" coined? -->

I think Ian Bicking's [`non_root_python.py`][] qualifies as the first tool for creating
virtual environments.  Based on that, [`virtual-python.py`][] was
[added][setuptools-commit-3df2aab] to [EasyInstall][] in version
[0.6a6][easy-install-release-notes] in October 2005.  Here's a timeline summarizing some
main events.

2005-10-17
:   [`virtual-python.py`][] is [added][setuptools-commit-3df2aab] to EasyInstall.

2006-03-08
:   Ian Bicking, the author of [`non_root_python.py`][]---on which [`virtual-python.py`][]
    is is based---publishes a blog post about improving [`virtual-python.py`][] titled
    "[Working Environment Brainstorm][working-env-brainstorm]".

2006-03-15
:   Ian Bicking [announces][working-env-post] [`working-env.py`][].

2006-04-26
:   Ian Bicking [announces][workingenv-revisited-post] an improved version of
    [`working-env.py`][] called [workingenv][].
{::comment}
TODO: did anything important happen here?
{:/}

2007-09-14
:   [virtualenv][virtualenv-initial-commit]'s first commit

2007-10-10
:   Ian Bicking announces [virtualenv][]: "[Workingenv is dead, long live
Virtualenv!][virtualenv-post]"

2009-10-24
:   [`virtual-python.py`] is [removed][setuptools-commit-43d3473] from EasyInstall.
{::comment}
TODO: did anything important happen here?
{:/}

2011-06-13
:   [PEP 405][] is created.

2012-05-25
:   [PEP 405][] is accepted for inclusion in Python 3.3.

2012-09-29
:   [Python 3.3][] is released.  [venv][library/venv] and [pyvenv][] become part of the
    standard library.

2014-03-16
:   [Python 3.4][] is released.  "[[venv] defaults to installing pip into all created
    virtual environments.][installing]".

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

### Image sources

The "Virtual Boy" image is a slightly edited version of [this
picture](http://cinemassacre.com/wp-content/uploads/2008/02/VirtualBoy.jpg) by [James
Rolfe](http://cinemassacre.com).  The photograph of Bertrand Russell is from
[Wikipedia](https://en.wikipedia.org/wiki/File:Bertrand_Russell_transparent_bg.png) and in
the public domain.

## Footnotes

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

<!-- vim: set tw=90 sts=-1 sw=4 et spell wrap: -->
