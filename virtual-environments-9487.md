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
13. [virtualenv](https://github.com/pypa/virtualenv)
14. [VirtualEnvManager](https://pypi.python.org/pypi/VirtualEnvManager)
15. [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper)
16. [virtualenvwrapper-win](https://pypi.python.org/pypi/virtualenvwrapper-win)
17. [virtual-python](http://peak.telecommunity.com/DevCenter/EasyInstall#creating-a-virtual-python)
18. [workingenv](https://pypi.python.org/pypi/workingenv.py)

Wow.  This stuff must be really hard to get right.  I also must be a moron, since, after
having written <!--several--> <!--a few--> some thousand lines of Python, I don't even
know what problem we are trying to solve here.  The abundance of relevant programs with
subtly different names has deterred me from doing any research so far.

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
2.  A subdirectory called `site-packages`
^
    $ echo 'home = /usr/bin' > pyvenv.cfg
    $ mkdir site-packages

So we have a directory that formally qualifies as a virtual environment.  This leads us to
the next question.
<!-- Now what? -->

## What's the point?

When we execute our copy of the Python executable, the `pyvenv.cfg` file slightly changes
what happens during startup: the presence of the `home` key tells Python <!--that--> the
binary belongs to a virtual environment, the <!--key's--> value (`/usr/bin`) tells Python
where to find the base installation.

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

TODO: Which program came first?  When and by whom was the term "virtual environment"
coined?  Why do we need so many different tools to manage them?  (Historical reasons, I
guess.)

<!-- ### Timeline -->
Here's a timeline.

*   Python 3.3: [PEP 405][] is accepted; [venv][library/venv] and [pyvenv][] become part
    of the standard library
*   Python 3.4: "[venv] defaults to installing pip into all created virtual environments."
*   Python 3.5: "The use of venv is now recommended for creating virtual environments."
*   Python 3.6: "pyvenv was the recommended tool for creating virtual environments for
    Python 3.3 and 3.4, and is deprecated in Python 3.6."

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

## TODO

This doesn't match my experience and appears to be wrong:

>   By default, a virtual environment is entirely isolated from the system-level
>   site-packages directories.  
>   ---<https://www.python.org/dev/peps/pep-0405/>

<!--
Here are some suggestions that are on the `python.org` TLD: "[Creating Virtual
Environments][2]".  I don't know how long until everything said there will be deprecated,
though.
-->

[pyvenv]: https://docs.python.org/dev/whatsnew/3.3.html#pep-405-virtual-environments
[pyvenv-deprecated]: https://docs.python.org/dev/whatsnew/3.6.html#id8

[library/venv]: https://docs.python.org/3/library/venv.html
    "The Python Standard Library: venv — Creation of virtual environments"
[PEP 405]: https://www.python.org/dev/peps/pep-0405/
    "PEP 405 -- Python Virtual Environments"
[tutorial-venv]: https://docs.python.org/3/tutorial/venv.html
    "The Python Tutorial: Virtual Environments and Packages"

[4]: http://docs.python-guide.org/en/latest/dev/virtualenvs/

*[PEP]: Python Enhancement Proposal

<!-- vim: set tw=90 sts=-1 sw=4 et spell wrap: -->
