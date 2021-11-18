---
layout: post
extra_css: [images.css, syntax-highlighting.css, tables.css]
title: A Survey of CPU Caches
description: Cache-friendliness is key to writing fast code.  This article illuminates how
    CPU caches work with code samples and profiling results.
image: /assets/cache-paper/access-time-plot.svg
---

<style>
img.chart {
  max-width: calc(100vw - 8px);
  width: 110%;
}
body.dark img.chart { filter: invert(100%) brightness(88%) }
</style>

CPU caches are very fast and small memory.  They are part of the CPU and store a
subset of the data present in main memory (RAM) that is expected to be used again soon.
Their purpose is to reduce the frequency of main memory access.

Why can't we just have one uniform type of memory that's both big and fast?  Cost is one
reason, but more fundamentally, since no signal can propagate faster than the speed of
light, every possible storage technology can only reach a finite amount of data within a
desired access latency.

## Cache Operation Overview

Whenever a program requests a memory address the CPU will check its caches.  If the
location is present, a *cache hit* occurs.  Otherwise, the result is a *cache miss* and
the next level of the memory hierarchy, which could be another CPU cache, is tried.

CPU caches are managed by the CPU directly.  They are generally opaque to the operating
system and other software.  That is, programmers have no direct control over the contents
of CPU caches.  Unless explicitly prevented, the CPU brings all accessed data into cache.
This happens in response to cache misses and will, much more often than not, cause another
cache entry to be evicted and replaced.

## Types of CPU Caches

Current x86 CPUs generally have three main types of caches: data caches, instruction
caches, and translation lookaside buffers ({::nomarkdown}TLBs{:/}).  Some caches are used
for data as well as instructions and are called *{::nomarkdown}unified{:/}*.  A processor
may have multiple caches of each type, which are organized into numerical *levels*
starting at 1, the smallest and fastest level, based on their size and speed.

In practice, a currently representative x86 cache hierarchy consists of:
*   Separate level 1 data and instruction caches of 32 to 64 KiB for each core (denoted
    L1d and L1i).
*   A unified L2 cache of 256 to 512 KiB for each core.
*   Often a unified L3 cache of 2 to 16 MiB shared between all cores.
*   One or more TLBs per core.  They cache virtual-to-physical address associations of
    memory pages.[^tangential]

[^tangential]: You don't need to know what that means to understand the rest of this post.

Here's a table with approximate access latencies:

|        | L1d  | L2     | L3     | Main Memory |
|--------|------|--------|--------|-------------|
| Cycles | 3--4 | 10--12 | 30--70 | 100--150    |

<!-- TODO: note about data cache being the biggest target for optimizations? -->

My laptop's AMD E-450 CPU has cores with an L1d cache of 32 KiB and a unified L2 cache of
512 KiB each:

```bash
$ lscpu | grep 'L1d\|L2'
L1d cache:           32K
L2 cache:            512K
```

Let's verify those sizes and measure the access latencies.  The [following C
program](#listing-1) repeatedly reads elements from an array in random
order.[^prefetching] To minimize the overhead of picking a random index, the array is
first set up as a circular, singly linked list where every element except the last points
to a random successor. When compiled with `-DBASELINE`, only this initialization is done.

[^prefetching]: We use random accesses because the CPU will detect and optimize sequential
    access by a technique called *[prefetching][]*, which would prevent us from
    determining access times.

[prefetching]: #prefetching

```c
#define N 100000000  // 100 million

struct elem {
   struct elem *next;
} array[SIZE];

int main() {
   for (size_t i = 0; i < SIZE - 1; ++i) array[i].next = &array[i + 1];
   array[SIZE - 1].next = array;
   // Fisher-Yates shuffle the array.
   for (size_t i = 0; i < SIZE - 1; ++i) {
      size_t j = i + rand() % (SIZE - i);  // j is in [i, SIZE).
      struct elem temp = array[i];  // Swap array[i] and array[j].
      array[i] = array[j];
      array[j] = temp;
   }
#ifndef BASELINE
   int64_t dummy = 0;
   struct elem *i = array;
   for (size_t n = 0; n < N; ++n) {
      dummy += (int64_t)i;
      i = i->next;
   }
   printf("%d\n", dummy);
#endif
}
```
{:id="listing-1"}

The difference in CPU cycles used by this program when complied with and without
`-DBASELINE` is the number of cycles that `N` memory accesses take.  Dividing by `N`
yields the number of cycles one access takes on average.

Here are my results for different array sizes (set at compile time with the `SIZE` macro):

{::comment}
"Plot of..." is the images alt text (https://en.wikipedia.org/wiki/Alt_attribute).  It is
displayed when the image cannot be rendered and may be read aloud by screen readers used
due to visual impairment.  It is also processed by search engine bots.
{:/comment}
![Plot of the average number of CPU cycles one access takes vs. the array size; the
differences are due to how much of the array fits into which CPU
cache][access-time-plot]{:.chart}

{::comment}
    The text in quotes is the image's title.  It's optional and shown on mouseover as a
    tooptip.  It can be used to give additional information.
{:/comment}
[access-time-plot]: {{ "/assets/cache-paper/access-time-plot.svg" | relative_url }}
    "There is a table with the exact numerical results further down."

Up to 32 KiB, each access takes almost exactly 3 cycles.  This is the L1d access time.  At
32 KiB (the size of the L1d) the time increases to about 3.5 cycles.  This is not
surprising since the cache is shared with other processes and the operating system, so
some of our data gets evicted.  The first dramatic increase happens at 64 KiB followed by
smaller increases at 128 and 256 KiB.  I suspect we are seeing a mixture of L2 and L1d
accesses, with less and less L1d hits and an L2 access time of around 25 cycles.

The values from 512 KiB (the size of the L2) to 128 MiB exhibit a similar pattern.  As
more and more accesses go to main memory, the average delay for one access approaches 200
cycles.

<!-- FIXME: having a <style> tag outside of the page's head section may be a bad idea. -->
<style>
    .funny-table, body.dark .funny-table {
        border: none;
    }
    /* FIXME: these borders are slightly offset compared to where they would normally
    appear. */
    .funny-table th {
        border-top: 2px solid #ccc;
    }
    body.dark .funny-table th {
        border-top: 2px solid #444;
    }
    .funny-table > tbody > tr:last-child {
        border-bottom: 2px solid #ccc;
    }
    body.dark .funny-table > tbody > tr:last-child {
        border-bottom: 2px solid #444;
    }
    .funny-table th, .funny-table td {
        text-align: center;
    }
    /* TODO: make the width of the border dynamic. */
    .funny-table th:nth-child(2), .funny-table td:nth-child(2) {
        border-right: 2ch solid #f8f1e3;
        padding-right: 3.75px;
    }
    body.dark .funny-table th:nth-child(2), body.dark .funny-table td:nth-child(2) {
        border-right: 2ch solid #121212;
    }
    .funny-table td:nth-child(3), .funny-table th:nth-child(3) {
        padding-left: 3.75px;
    }
</style>

| Array Size (KiB) | Cycles / Iteration | Array Size (KiB) | Cycles / Iteration |
|------------------|--------------------|------------------|--------------------|
|   1              |  3.01              |    512           |  27.23             |
|   2              |  3.01              |   1024           | 117.28             |
|   4              |  3.01              |   2048           | 157.85             |
|   8              |  3.01              |   4096           | 174.74             |
|  16              |  3.01              |   8192           | 183.54             |
|  32              |  3.46              |  16384           | 188.00             |
|  64              | 15.34              |  32768           | 191.39             |
| 128              | 18.85              |  65536           | 193.95             |
| 256              | 24.73              | 131072           | 194.83             |
{:.funny-table}

## Cache Lines

*Cache lines* or *cache blocks* are the unit of data transfer between main memory and
cache.  They have a fixed size which is typically 64 bytes on x86/x64 CPUs---this means
accessing a single, uncached 4-byte integer entails loading another 60 adjacent bytes.

My E-450 CPU is no exception and both of its data caches have 64-byte cache lines:

```bash
$ getconf LEVEL1_DCACHE_LINESIZE; getconf LEVEL2_CACHE_LINESIZE
64
64
```

We can verify this quite easily.  The following program loops over an array with an
increment given at compile time as `STEP` and measures the processor time.

```c
#define SIZE 67108864  // 64 * 1024 * 1024.  The array will be 512 MiB.

int main() {
   int64_t* array = (int64_t*)calloc(SIZE, sizeof(int64_t));
   clock_t t0 = clock();
   for (size_t i = 0; i < SIZE; i += STEP) {
      array[i] &= 1;  // Do something.  Anything.
   }
   clock_t t1 = clock();
   printf("%d %f\n", STEP, 1000. * (t1 - t0) / CLOCKS_PER_SEC);
}
```
{:id="listing-2"}

These are my results for different values of `STEP`:

![Plot of the CPU time used to run the program vs. the step size; the CPU time stays
nearly constant for step sizes of 1, 2, 4, and 8][line-size-plot]{:.chart}

[line-size-plot]: {{ "/assets/cache-paper/line-size-plot.svg" | relative_url }}
    "The CPU time is nearly constant for the first 4 step sizes."

As expected, the time roughly halves whenever the step size is doubled---but only from a
step size of 16.  For the first 4 step sizes, it is almost constant.

This is because the run times are primarily due to memory accesses.  Up to a step size of
8, every 64-byte line has to be loaded.  At 16, the values we modify are 128 bytes
apart,[^128-bytes] so every other cache line is skipped.  At 32, three out of four cache
lines are skipped, and so on.

[^128-bytes]: 16 `int64_t` values of 8 bytes each

Both cache and main memory can be thought of as being partitioned (in the [set-theoretic
sense](https://en.wikipedia.org/wiki/Partition_of_a_set)) into cache lines.  Data is not
read or written starting from arbitrary main memory addresses, but only from addresses
that are multiples of the cache line size.

## Prefetching

Consider a simplified version of [the C program accessing elements of an array at
random](#listing-1) that just walks over the array sequentially.  It still follows the
pointers to do this, but the array is no longer shuffled.  These are my results of
profiling this new program as before:

![Plot of the average number of CPU cycles one access takes vs. the array size when the
array is not shuffled]({{ "/assets/cache-paper/seq-access-time-plot.svg" | relative_url }}
"A table with the numerical results is further down again."){:.chart}

Until the working set size matches that of the L1d, the access times are virtually
unchanged at 3 cycles, but exceeding the L1d and hitting the L2 increases this by no more
than a single cycle.  More strikingly, exceeding the L2 has similarly limited effect: the
access time plateaus not much above 6 cycles---about 3% of the maximum we saw for random
reads.

<!-- Here's a table with the numerical results again: -->

| Array Size (KiB) | Cycles / Iteration | Array Size (KiB) | Cycles / Iteration |
|------------------|--------------------|------------------|--------------------|
|   1              | 3.01               |    512           | 5.15               |
|   2              | 3.01               |   1024           | 6.17               |
|   4              | 3.01               |   2048           | 6.20               |
|   8              | 3.01               |   4096           | 6.16               |
|  16              | 3.01               |   8192           | 6.14               |
|  32              | 3.05               |  16384           | 6.16               |
|  64              | 3.99               |  32768           | 6.13               |
| 128              | 3.98               |  65536           | 6.13               |
| 256              | 3.94               | 131072           | 6.14               |
{:.funny-table}

Much of the improved performance can be explained by the more optimal use of cache lines:
the penalty of loading a cache line is distributed among 8 accesses now.  This could at
best get us down to 12.5%.  The missing improvements are due to *prefetching*.

Prefetching is a technique by which CPUs predict access patterns and preemptively push
cache lines up the memory hierarchy before the program needs them.  This can not work
unless cache line access is predictable, though, which basically means
linear.[^stride-example]

[^stride-example]: For example, the most complicated stride pattern my laptop's CPU can detect is
    one that skips over at most 3 cache lines (for- or backwards) and may alternate
    strides (e.g. +1, +2, +1, +2, ...).

Prefetching happens asynchronously to normal program execution and can therefore almost
completely hide the main memory latency.  This is not quite what we observed because the
CPU performs little enough work for memory bandwidth to become the bottleneck.
[Adding some expensive operations][github-seq-access-times-source] like integer divisions
every loop iteration changes that and effectively levels the cycles spent per iteration
across all working set sizes:

[github-seq-access-times-source]: https://github.com/meribold/cache-seminar-paper/blob/a32597fbb2c37c52d54a9b87194cc17760ffbc11/seq-access-times/access-times.c#L26

![Plot of the average number of CPU cycles one access takes vs. the array size when the
array is not shuffled and the CPU performs some work for every accessed element](
{{ "/assets/cache-paper/cpu-bound-seq-access-time-plot.svg" | relative_url }}){:.chart}

{::comment}
TODO: add captions to the images?  `kramdown` doesn't support this directly, but something
like the following may work.

<figure style="width: 110%">
    <figcaption style="text-align: center">
        TODO
    </figcaption>
    <img src="{{ "/assets/cache-paper/cpu-bound-seq-access-time-plot.svg" | relative_url }}"
         style="width: 100%"/>
</figure>
{:/comment}

What I described in this section is *hardware prefetching*.  It uses dedicated silicon to
automatically detect access patterns.  There is also *software prefetching*, which is
triggered by special machine instructions that may be inserted by the compiler or manually
by the programmer.[^drepper]

[^drepper]: Software prefetching is discussed by Ulrich Drepper in his paper "What Every
    Programmer Should Know About Memory" available [here
    (PDF)](https://www.akkadia.org/drepper/cpumemory.pdf).  He also goes into more detail
    on practically everything touched on in this post.

## Locality of Reference

Two properties exhibited by computer code to varying degrees distinctly impact cache
effectiveness.  One is *temporal locality*.  The other is *spatial locality*.  Both are
measures of how well the code's memory access pattern matches certain principles.

### Temporal Locality

One access suggests another.  That is, once referenced memory locations tend to be used
again within a short time frame.  This is really the intrinsic motivation for having a
memory hierarchy in the first place.  When a cache line is loaded but not accessed again
before being evicted, the cache provided no benefit.

### Spatial Locality

**1.** For each accessed memory location, nearby locations are used as well within a short
time frame.  **2.** Memory is accessed sequentially.

We have already seen that caches take advantage of both these principles by design:
1. <span>Data is loaded in blocks; subsequent accesses to locations in an already loaded
   cache line are basically free.</span>{:style="font-weight: normal"}
2. <span>Cache lines from sequential access patterns are prefetched ahead of
   time.</span>{:style="font-weight: normal"}
{:style="font-weight: bold"}

### Notes

Access to instructions inherently has good spatial locality since they are executed
sequentially outside of jumps, and good temporal locality because of loops and function
calls.  Programs with good locality are said to be *cache-friendly*.

## Example: `std::vector` vs. `std::list`

The following C++ program (adapted from [this article][big-os] by Sergey
Ignatchenko) initializes a number of STL containers with random numbers and measures the
processor time needed to sum all of them.  I first ran it with `Container` being a type
alias for `std::list`, then for `std::vector`.  Either way, the asymptotic
complexity is Θ(N).

[big-os]: https://accu.org/var/uploads/journals/Overload134.pdf#page=6

```cpp
constexpr int N = 5000;

int main() {
   Container containers[N];
   std::srand(std::time(nullptr));
   // Append an average of 5000 random values to each container.
   for (int i = 0; i < N * 5000; ++i) {
      containers[std::rand() % N].push_back(std::rand());
   }

   int sum = 0;
   std::clock_t t0 = std::clock();
   for (int m = 0; m < N; ++m) {
      for (int num : containers[m]) {
         sum += num;
      }
   }
   std::clock_t t1 = std::clock();

   // Also print the sum so the loop doesn't get optimized out.
   std::cout << sum << '\n' << (t1 - t0) << '\n';
}
```
{:id="listing-3"}

My result is that computing the sum completes 158 times faster when using
`std::vector`.[^flags]  Some of this difference can be attributed to space overhead of the
linked list and the added indirection, but the more cache-friendly memory access pattern
of `std::vector` is decisive:  using `std::list` as in this example means random memory
access.

[^flags]: I used GCC 6.3.1 with `-O3` and `-march=native`.

### Note: "True" OO Style

In OOP, variables are typically referred to by pointers to a common base class.  A
polymorphic container of such pointers allows for dynamic dispatch of virtual functions.
However, this carries the risk of degrading the performance of a sequential data structure
to that of a list.

![Graphic of a contiguous array of pointers with pointees that may be scattered pretty
randomly throughout memory][oo-picture]{:.chart}

[oo-picture]: {{ "/assets/cache-paper/oo-picture.png" | relative_url }}
    "The numbered boxes represent pointers that are laid out contiguously in memory.  The unlabeled boxes represent the corresponding pointees, which may be scattered across memory pretty randomly."

## Conclusion

The hidden constant separating the time complexities of two reasonable algorithms under
asymptotic analysis can get quite big because of cache effects.  Understanding how CPU
caches work helps make good choices for writing fast programs and I hope this article
provided some insight.  For a more in-depth discussion, you can read Ulrich Drepper's
paper "[What Every Programmer Should Know About
Memory](https://www.akkadia.org/drepper/cpumemory.pdf)", which also covers virtual memory,
cache associativity, write policies, replacement policies, cache coherence, software
prefetching, instruction caches, TLBs, and more.

## Footnotes

*   This post is based on a seminar paper which you can find [here][paper] for some more
    details and sources for further reading.  The TeX files, full source code of all
    programs shown, and a [makefile][] that automates running them and builds the PDF with
    the results are all available in [this repository on GitHub][repo].

[paper]: /assets/cache-paper.pdf
[repo]: https://github.com/meribold/cache-seminar-paper
[makefile]: https://github.com/meribold/cache-seminar-paper/blob/master/makefile

*[RAM]: random-access memory
*[TLB]: translation lookaside buffer
*[TLBs]: translation lookaside buffers
*[unified]: Unified caches are used for data as well as instructions.
*[STL]: Standard Template Library
*[GCC]: GNU Compiler Collection
*[OO]: object-oriented
*[OOP]: object-oriented programming
