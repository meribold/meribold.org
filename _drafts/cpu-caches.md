---
layout: post
title: A Survey of CPU Caches
description: TODO.
---
<!-- title: "Introduction to CPU Caches" -->

<!-- This is an introduction to what CPU Caches are and why you care if you want to write fast -->
<!-- programs. -->

<!-- If you're like me, -->

CPU caches are very fast and small memories.  They are part of the CPU and store a subset
of the data present in main memory (RAM) that is expected to be used again soon.  Their
purpose is to reduce the frequency of main memory accesses.

Why can't we just have one uniform type of memory that's both big and fast?  Cost is one
reason, but more fundamentally, since no signal can propagate faster than the speed of
light, every possible storage technology can only reach a finite amount of data within a
desired access latency.

<!-- ## How do CPU Caches Work? -->
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
may have multiple caches of each type, which are organised into numerical *levels*
starting at 1, the smallest and fastest level, based on their size and speed.

In practice, a currently representative x86 cache hierarchy consists of:
*   Separate level 1 data and instruction caches of 32 to 64 KiB for each core (denoted
    L1d and L1i).
*   A unified L2 cache of 256 to 512 KiB for each core.
*   Often a unified L3 cache of 2 to 16 MiB shared between all cores.
*   One or more TLBs per core. They cache virtual-to-physical address associations of
    memory pages.

Here's a table with approximate access latencies:[^paper]
<!-- that are in line with typical estimates. -->

|        | L1d  | L2     | L3     | Main Memory |
|--------|------|--------|--------|-------------|
| Cycles | 3--4 | 10--12 | 30--70 | 100--150    |

[^paper]: This post summarizes a seminar paper which you can find [here (PDF)][paper] for
    some more details and sources.  You can also find the TeX files, full source code of
    all programs shown, and a [makefile][] that automates running them and builds the PDF
    with the results [here][repo].

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
cache][access-time-plot]{:style="width: 110%"}

{::comment}
    The text in quotes is the image's title.  It's optional and shown on mouseover as a
    tooptip.  It can be used to give additional information.
{:/comment}
[access-time-plot]: {{ site.url }}/assets/cache-paper/access-time-plot.png
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

Here's a table with the numerical results:

<!-- FIXME: having a <style> tag outside of the page's head section may be a bad idea. -->
<style>
    .funny-table th, .funny-table td {
        text-align: center;
    }
    .funny-table th:nth-child(1), .funny-table td:nth-child(1) {
        text-align: left;
    }
    .funny-table th:nth-child(2), .funny-table td:nth-child(2) {
        text-align: center;
        border-right: 1px dashed;
        padding-right: 2ch;
    }
    .funny-table td:nth-child(3), .funny-table th:nth-child(3) {
        text-align: left;
        padding-left: 2ch;
    }
    .funny-table td:nth-child(4), .funny-table th:nth-child(4) {
        text-align: right;
    }
</style>

| Array Size (KiB) | Cycles / Iteration | Array Size (KiB) | Cycles / Iteration |
|------------------|--------------------|------------------|--------------------|
| 1                | 3.01               | 512              | 27.23              |
| 2                | 3.01               | 1024             | 117.28             |
| 4                | 3.01               | 2048             | 157.85             |
| 8                | 3.01               | 4096             | 174.74             |
| 16               | 3.01               | 8192             | 183.54             |
| 32               | 3.46               | 16384            | 188.00             |
| 64               | 15.34              | 32768            | 191.39             |
| 128              | 18.85              | 65536            | 193.95             |
| 256              | 24.73              | 131072           | 194.83             |
{:.funny-table}

## Cache Lines

*Cache lines* or *cache blocks* are the unit of data transfer between main memory and
cache.  They have a fixed size which is typically 64 bytes on x86/x64 CPUs---this means
accessing a single, uncached 32-bit integer entails loading another 60 adjacent bytes.

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

These are my results for different values of `STEP`:

![Plot of the CPU time used to run the program vs. the step size; the CPU time stays
nearly constant for step sizes of 1, 2, 4, and 8][line-size-plot]{:style="width: 110%"}

[line-size-plot]: {{ site.url }}/assets/cache-paper/line-size-plot.png
    "The CPU time is nearly constant for the first 4 step sizes."

<!-- TODO: table -->

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
random](#listing-1) that simply walks over the array sequentially.  It still follows the
pointers to do this, but the array is no longer shuffled.  These are my results of
profiling this new program as before:

![Plot of the average number of CPU cycles one access takes vs. the array size when the
array is not shuffled]({{ site.url }}/assets/cache-paper/seq-access-time-plot.png
"A table with the numerical results is further down again."){:style="width: 110%"}

Until the working set size matches that of the L1d, the access times are virtually
unchanged at 3 cycles, but exceeding the L1d and hitting the L2 increases this by no more
than a single cycle.  More strikingly, exceeding the L2 has similarly limited effect: the
access time plateaus not much above 6 cycles---about 3% of the maximum we saw for random
reads.

<!-- Here's a table with the numerical results again: -->

| Array Size (KiB) | Cycles / Iteration | Array Size (KiB) | Cycles / Iteration |
|------------------|--------------------|------------------|--------------------|
| 1                | 3.01               | 512              | 5.15               |
| 2                | 3.01               | 1024             | 6.17               |
| 4                | 3.01               | 2048             | 6.20               |
| 8                | 3.01               | 4096             | 6.16               |
| 16               | 3.01               | 8192             | 6.14               |
| 32               | 3.05               | 16384            | 6.16               |
| 64               | 3.99               | 32768            | 6.13               |
| 128              | 3.98               | 65536            | 6.13               |
| 256              | 3.94               | 131072           | 6.14               |
{:.funny-table}

Much of the improved performance can be explained by the more optimal use of cache lines:
the penalty of loading a cache line is distributed among 8 accesses now.  This could at
best get us down to 12.5%.  The missing improvements are due to *prefetching*.

Prefetching is a technique by which CPUs predict access patterns and preemptively push
cache lines up the memory hierarchy before the program needs them.  This can not work
unless cache line access is predictable, though, which basically means linear.[^TODO]

[^TODO]: For example, the most complicated stride pattern my laptop's CPU can detect is
    one that skips over at most 3 cache lines (for- or backwards) and may alternate
    strides (e.g. +1, +2, +1, +2, ...).

WIP.

## Locality of Reference

Two properties exhibited by computer code to varying degrees distinctly impact cache
effectiveness.  One is called *spatial locality*, and the other *temporal locality*.  Both
are measures of how well the code's memory access pattern matches certain principles.

### Temporal Locality

TODO.

### Spatial Locality

TODO.

## Example: `std::vector` vs. `std::list`

TODO.

### "True" OO Style

TODO.

![TODO][oo-picture]{:style="max-width: 110%"}

[oo-picture]: {{ site.url }}/assets/cache-paper/oo-picture.png

[paper]: {{ site.url }}/assets/cache-paper.pdf
[repo]: https://github.com/meribold/cache-seminar-paper
[makefile]: https://github.com/meribold/cache-seminar-paper/blob/master/makefile

*[RAM]: Random-access memory
*[TLB]: Translation lookaside buffer
*[TLBs]: Translation lookaside buffers
*[unified]: Unified caches are used for data as well as instructions.

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
