---
layout: post
title: Virtual Environments Demystified
description: TODO
categories: python
---

<img class="confined-img"
src="http://cinemassacre.com/wp-content/uploads/2008/02/VirtualBoy.jpg"
alt="The fucking nerd with his Virtual Boy"
title="What were they thinking?!">
<!-- title="Wikipedia redirects to the page about &quot;virtual reality&quot; when searching for &quot;virtual environment&quot;."> -->

Here's a (presumably non-exhaustive) list of programs that do something with virtual
environments:

1.  [autoenv](https://github.com/kennethreitz/autoenv)
2.  [pew](https://github.com/berdario/pew)
3.  [pipenv](https://github.com/kennethreitz/pipenv)
4.  [pyenv](https://github.com/pyenv/pyenv)
5.  [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)
6.  [pyenv-virtualenvwrapper](https://github.com/pyenv/pyenv-virtualenvwrapper)
7.  [pyvenv][]
8.  [rvirtualenv](https://github.com/kvbik/rvirtualenv)
9.  [venv][library/venv]
10. [vex](https://pypi.python.org/pypi/vex)
11. [v](https://github.com/borntyping/v)
12. [virtualenv-burrito](https://github.com/brainsik/virtualenv-burrito)
13. [virtualenv][]
14. [VirtualEnvManager](https://pypi.python.org/pypi/VirtualEnvManager)
15. [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper)
16. [virtualenvwrapper-win](https://pypi.python.org/pypi/virtualenvwrapper-win)
17. [virtual-python][]
18. [workingenv](https://pypi.python.org/pypi/workingenv.py)

Wow.  This stuff must be really hard to get right.  I also must be a moron, since, after
having written <!--several--> <!--a few--> some thousand lines of Python, I don't even
know what problem we are trying to solve here.  The abundance of relevant programs with
subtly different names has deterred me from reading up on it so far.

## So what *is* a virtual environment?

<!-- Somewhere in the [official docs][1], a virtual environment is defined as -->
<!-- Luckily, virtual environments are treated in the in the [official docs][1], which define -->
<!-- one as -->
The [official docs' tutorial][1] describes a virtual environment as

[1]: https://docs.python.org/3/tutorial/venv.html
     "When confronted with too much information, refer to the official documentation."

>   a self-contained directory tree that contains a Python installation for a particular
>   version of Python, plus a number of additional packages.

So it's a directory with a Python interpreter?  <!--I can do that.-->Easy enough.

    $ mkdir virtual_env
    $ cd virtual_env
    $ cp /bin/python3 .

Let's see.  Directory?  Check.  Contains a Python installation?  Check.  Contains
a number of additional packages?  ... Zero is a number!  (Check.)  Particular version?
Um...

    $ ./python --version
    Python 3.6.3

I think that will do.  Is it self-contained, though?  It doesn't contain itself...

<img style="width: 33%"
src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Bertrand_Russell_transparent_bg.png"
alt="Another nerd: Bertrand Russell in 1916"
title="Consider the directory containing all directories that don't contain themselves.">

<!-- Better check the dictionary:

    $ dict 'self-contained'
    From The Collaborative International Dictionary of English v.0.48 [gcide]:

    Self-contained \Self`-con*tained"\, a.
        1. Having self-control; reserved; uncommunicative; wholly
            engrossed in one's self.
            [1913 Webster]

        2. (Mach.) Having all the essential working parts connected
            by a bedplate or framework, or contained in a case, etc.,
            so that mutual relations of the parts do not depend upon
            fastening outside of the machine itself.
            [1913 Webster]

Maybe I should keep reading the documentation.
-->

Jokes aside, there are only two things missing to actually make our directory a virtual
environment as specified by [PEP 405][], the proposal that integrated a standard mechanism
for virtual environments with Python<!--elevated virtual environments from a purely
third-party hack-->.
<!--(Everything prior to PEP 405 were purely third-party tools without any support from
the language itself.)-->
(Before PEP 405 was accepted, virtual environments were purely the domain of third-party
tools with no direct support from the language itself.)

1.  A file called `pyvenv.cfg` containing the line `home = /usr/bin`
2.  A `lib/python3.6/site-packages` subdirectory[^site-packages]
^
    $ echo 'home = /usr/bin' > pyvenv.cfg
    $ mkdir -p lib/python3.6/site-packages

[^site-packages]: The path is subject to the OS and Python version used.

Because of what I assume to be a bug in CPython, we also need to move the Python binary
into a `bin` subdirectory.

    $ mkdir bin && mv python3 bin/

{::comment}
>   [T]he internal virtual environment layout mimics the layout of the Python installation
>   itself on each platform.  
>   ---<https://www.python.org/dev/peps/pep-0405/#creating-virtual-environments>
{:/comment}

Fair.  We have a directory that formally qualifies as a virtual environment.  This leads
us to the next question.

## What's the point? <!-- WIP -->

When we execute our copy of the Python binary, the `pyvenv.cfg` file slightly changes what
happens during startup: the presence of the `home` key tells Python <!--that--> the binary
belongs to a virtual environment, the <!--key's--> value (`/usr/bin`) tells it where to
find the system's Python installation.

The location of the `pyvenv.cfg` file becomes the Python processes' [prefix][]: a
directory used to initialize the module search path... TODO

<!--
Consider `ls -l /usr/lib/python3.6/site-packages/`: `site-packages` contains packages, but
also standalone modules.
-->

Here's what we get when starting `./bin/python3`:

```python
>>> import sys
>>> sys.prefix
'/home/meribold/virtual_env'
>>> sys.path
['', '/usr/lib/python36.zip', '/usr/lib/python3.6', '/usr/lib/python3.6/lib-dynload', '/home/meribold/virtual_env/lib/python3.6/site-packages', '/home/meribold/.local/lib/python3.6/site-packages', '/usr/lib/python3.6/site-packages']
```

When running my system's Python interpreter, `sys.prefix` has the value `'/usr'` and the
`sys.path` list doesn't contain `'/home/meribold/virtual_env/lib/python3.6/site-packages'`
(but is otherwise identical).

All this means is that we can install packages (TODO: modules?) into
`./lib/python3.6/site-packages` now, and that we can `import` these like any other package
(TODO: modules?).

## venv

One of the <!--many--> tools I listed above isn't like the others<!--:
[*venv*][library/venv]-->.  While it's predated by <!--many--> most of them, this one
<!--is an official part of and--> ships with Python (3.3 or later)<!--[^new-in-3-3]--> as
part of the standard library: [*venv*][library/venv].[^pyvenv]

[^pyvenv]: Actually, pyvenv also ships with Python, but it was deprecated in version 3.6
    (only 3 minor versions after its introduction).

[^new-in-3-3]: Since version 3.3

In it simplest form, venv is used to create a virtual environment like so:

    $ python3 -m venv virtual_env

This creates the `virtual_env` directory and also copies or symlinks the Python
interpreter:

    $ cd virtual_env
    $ find -name python3
    ./bin/python3

It also copies the whole standard library (TODO: does it) and a bunch of other stuff.  I
get 650 files in 89 subdirectories using up about 10 MiB of disk space in total.  It
doesn't have to be this way, though.  The directory we created manually before almost
qualified as a virtual environment as specified by [PEP 405][], it only needs a file
called `pyvenv.cfg` and a directory called `site-packages.`

<!--
    $ find | wc -l
    740
-->

<!-- ## What problem does that solve? -->

## Summary

A virtual environment is a directory containing a Python executable and a special
`pyvenv.cfg` file that affects startup of the interpreter.

>   venv is the standard tool for creating virtual environments.  
>   ---<https://docs.python.org/3/installing/>

## Appendices

### History

<!-- TODO: When and by whom was the term "virtual environment" coined? -->

I think Ian Bicking's [`non_root_python.py`][] qualifies as the first tool for creating
virtual environments.  Based on that, [`virtual-python.py`][] was
[added][setuptools-commit-3df2aab] to [EasyInstall][] in version
[0.6a6][easy-install-release-notes] in October 2005.

Here's a timeline summarizing some main events.

*   2005-10-17: [`virtual-python.py`][] is [added][setuptools-commit-3df2aab] to
    EasyInstall
*   2006-03-08: Ian Bicking, the author of [`non_root_python.py`][]---on which
    [`virtual-python.py`][] is is based---publishes a blog post about improving
    [`virtual-python.py`][] titled "[Working Environment
    Brainstorm][working-env-brainstorm]"
*   2006-03-15: Ian Bicking [announces][working-env-post] [`working-env.py`][]
*   2006-04-26: Ian Bicking [announces][workingenv-revisited-post] an improved version of
    [`working-env.py`][] called [workingenv][]
<!-- TODO: did anything important happen here? -->
*   2007-09-14: [virtualenv][virtualenv-initial-commit]'s first commit
*   2007-10-10: Ian Bicking announces [virtualenv][]: "[Workingenv is dead, long live
Virtualenv!][virtualenv-post]"
*   2009-10-24: [`virtual-python.py`] is [removed][setuptools-commit-43d3473] from
    EasyInstall
<!-- TODO: did anything important happen here? -->
*   2012-05-25: [PEP 405][] is accepted for inclusion in Python 3.3
*   2012-09-29: [Python 3.3][] is released; [venv][library/venv] and [pyvenv][] become
    part of the standard library
*   2014-03-16: [Python 3.4][] is released; "[[venv] defaults to installing pip into all
created virtual environments.][installing]"
*   2015-09-13: [Python 3.5][] is released.  "[The use of venv is now recommended for
creating virtual environments.][installing]"
*   2016-12-23: [Python 3.6][] is released; "[pyvenv was the recommended tool for creating
virtual environments for Python 3.3 and 3.4, and is deprecated in Python 3.6][installing]"

[easy-install-release-notes]: http://peak.telecommunity.com/DevCenter/EasyInstall#release-notes-change-history
[setuptools-commit-3df2aab]: https://github.com/pypa/setuptools/commit/3df2aabcc056e6d001355d4cec780437387ac4fa
[setuptools-commit-43d3473]: https://github.com/pypa/setuptools/commit/43d34734c801d2d9a72d5fa6e7fc74d80bdc11c1
[working-env-brainstorm]: http://www.ianbicking.org/working-env-brainstorm.html
[working-env-post]: http://www.ianbicking.org/working-env.html
[workingenv-revisited-post]: http://www.ianbicking.org/workingenv-revisited.html
[`working-env.py`]: https://web.archive.org/web/20060425105635/http://svn.colorstudy.com/home/ianb/working-env.py
[workingenv]: https://web.archive.org/web/20060516191525/http://svn.colorstudy.com:80/home/ianb/workingenv
[virtualenv-initial-commit]: https://github.com/pypa/virtualenv/commit/e02aa46f4f0eb5321c31641e89bde2c9b92547bb
[virtualenv-post]: http://www.ianbicking.org/blog/2007/10/workingenv-is-dead-long-live-virtualenv.html
<!-- [virtualenv-post]: http://www.ianbicking.org/blog/2007/10/10/workingenv-is-dead-long-live-virtualenv/ -->
<!-- [Python 3.3]: https://docs.python.org/dev/whatsnew/3.3.html -->
[Python 3.3]: https://docs.python.org/dev/whatsnew/3.3.html#pep-405-virtual-environments
[Python 3.4]: https://docs.python.org/dev/whatsnew/3.4.html
[installing]: https://docs.python.org/3/installing/
[Python 3.5]: https://docs.python.org/dev/whatsnew/3.5.html
[Python 3.6]: https://docs.python.org/dev/whatsnew/3.6.html#id8

{::comment}
### More definitions of "virtual environment"

>   A virtual environment is a semi-isolated Python environment that allows packages to be
>   installed for use by a particular application, rather than being installed system
>   wide.  
>   ---<https://docs.python.org/3/installing/>

>   A [virtual environment is a] cooperatively isolated runtime environment that allows
>   Python users and applications to install and upgrade Python distribution packages
>   without interfering with the behaviour of other Python applications running on the
>   same system.  
>   ---<https://docs.python.org/3/glossary.html#term-virtual-environment>

>   Python "Virtual Environments" allow Python packages to be installed in an isolated
>   location for a particular application, rather than being installed globally.  
>   ---"[Creating Virtual Environments][]" subsection of the "Installing Packages" tutorial at [packaging.python.org][]

[Creating Virtual Environments]: https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments
[packaging.python.org]: https://packaging.python.org
{:/comment}

### Potential bug 1

The following doesn't appear to work when the Python executable is in the same directory
as `pyvenv.cfg`.

>   [If the Python binary belongs to a virtual environment] `sys.prefix` is set to the
>   directory containing `pyvenv.cfg`.  
>   ---[PEP 405](https://www.python.org/dev/peps/pep-0405/#specification)

    $ pwd
    /home/meribold/virtual_env
    $ ./python3 --version
    Python 3.6.3
    $ ./python3
    >>> import sys; sys.prefix
    '/home/meribold'

### Potential bug 2

This doesn't appear to be the case:

>   By default, a virtual environment is entirely isolated from the system-level
>   site-packages directories.  
>   ---[PEP 405](https://www.python.org/dev/peps/pep-0405/#isolation-from-system-site-packages)

{::comment}
>   If the `pyvenv.cfg` file also contains a key `include-system-site-packages` with a
>   value of `true` (not case sensitive), the site module will also add the system site
>   directories to `sys.path` after the virtual environment site directories.  
>   ---[PEP 405](https://www.python.org/dev/peps/pep-0405/#isolation-from-system-site-packages)
{:/comment}

>   If `pyvenv.cfg` [...] contains the key `include-system-site-packages` set to anything
>   other than `false` [...], the system-level prefixes will still also be searched for
>   site-packages; *otherwise they won't.*  
>   ---[Documentation of the `site` module](https://docs.python.org/3/library/site.html) (emphasis added)

Here's what actually happens:
[`site.py`](https://github.com/python/cpython/blob/3.6/Lib/site.py#L447)  I.e., when the
file doesn't contain the key `include-system-site-packages` at all, `system_site` will
still be `"true"`.

What I need to do is explicitly put `include-system-site-packages = false` into
`pyvenv.cfg`.  Otherwise I can still `import numpy` etc.

## Footnotes

[virtualenv]: https://github.com/pypa/virtualenv
[`non_root_python.py`]: https://web.archive.org/web/20051203055434/http://svn.colorstudy.com/home/ianb/non_root_python.py
[virtual-python]: http://peak.telecommunity.com/DevCenter/EasyInstall#creating-a-virtual-python
[`virtual-python.py`]: http://peak.telecommunity.com/dist/virtual-python.py
[pyvenv]: https://docs.python.org/dev/whatsnew/3.3.html#pep-405-virtual-environments
[pyvenv-deprecated]: https://docs.python.org/dev/whatsnew/3.6.html#id8
[EasyInstall]: https://en.wikipedia.org/wiki/Setuptools#EasyInstall

[prefix]: https://docs.python.org/3/library/sys.html#sys.prefix
    "Python 3 documentation for sys.prefix"
[library/venv]: https://docs.python.org/3/library/venv.html
    "The Python Standard Library: venv — Creation of virtual environments"
[PEP 405]: https://www.python.org/dev/peps/pep-0405/
    "PEP 405 -- Python Virtual Environments"
[tutorial-venv]: https://docs.python.org/3/tutorial/venv.html
    "The Python Tutorial: Virtual Environments and Packages"

[4]: http://docs.python-guide.org/en/latest/dev/virtualenvs/

*[PEP]: Python Enhancement Proposal

<!-- vim: set tw=90 sts=-1 sw=4 et spell wrap: -->
