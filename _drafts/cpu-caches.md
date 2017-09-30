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
reason but more fundamentally, since no signal can propagate faster than the speed of
light, every possible storage technology can only reach a finite amount of data within a
desired access latency.

<!-- ### How do CPU Caches Work? -->
### Cache Operation Overview

Whenever a program requests a memory address the CPU will check its caches.  If the
location is present, a *cache hit* occurs.  Otherwise, the result is a *cache miss* and
the next level of the memory hierarchy, which could be another CPU cache, is tried.

CPU caches are managed by the CPU directly.  They are generally opaque to the operating
system and other software and programmers have no direct control over their contents.
Unless explicitly prevented, the CPU brings all accessed data into cache.  This happens in
response to cache misses and will, much more often than not, cause another cache entry to
be evicted and replaced.

### Types of CPU Caches

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

The following table gives approximate access latencies.[^paper]
<!-- that are in line with typical estimates. -->
<!-- The following table gives estimates for the various levels' access latencies.[^paper] -->

|        | L1d  | L2     | L3     | Main Memory |
|--------|------|--------|--------|-------------|
| Cycles | 3--4 | 10--12 | 30--70 | 100--150    |

My laptop's AMD E-450 CPU has cores with an L1d cache of 32 KiB and a unified L2 cache of
512 KiB each:

```bash
$ lscpu | grep 'L1d\|L2'
L1d cache:           32K
L2 cache:            512K
```

Let's verify those sizes and measure the access latencies.

```C
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

### Cache Lines

### Prefetching

### Locality of Reference

#### Temporal Locality

#### Spatial Locality

### Example: `std::vector` vs. `std::list`

#### "True" OO Style


[paper]: /cache-seminar-paper/paper.pdf
[repo]: https://github.com/meribold/cache-seminar-paper
[makefile]: https://github.com/meribold/cache-seminar-paper/blob/master/makefile

[^paper]: This post summarizes a seminar paper which you can find [here (PDF)][paper] for
    some more details and sources.  You can also find the TeX files, full source code of
    all programs shown, and a [makefile][] that automates running them and builds the PDF
    with the results [here][repo].

[^sources]: TODO.

*[RAM]: Random-access memory
*[TLB]: Translation lookaside buffer
*[TLBs]: Translation lookaside buffers
*[unified]: Unified caches are used for data as well as instructions.

<!-- vim: set tw=90 sts=-1 sw=4 et spell: -->
