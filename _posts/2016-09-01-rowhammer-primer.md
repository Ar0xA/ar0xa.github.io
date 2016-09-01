---
layout: post
title: Rowhammer primer
description: What is rowhammer and why does it work?
tags: rowhammer hacking exploit
---
Attending whiskeyleaks on the 19th of september, I saw one of the talks will be about a special type of Rowhammer attack called <a href="https://www.vusec.net/projects/flip-feng-shui/">Flip Feng Shui</a>. It can be used to influence seperate virtual machines on the same hypervisor and was created by <a href="gober">Kaveh Razavi</a>, <a href="https://twitter.com/bjg">Ben Gras</a> and Erik Bosman.
While I heard about Rowhammer, I've never invested time into actually reading up on the how and why of it. Below is a tl;dr style writeup of what Rowhammer is and why it works. Personally I am hoping that with this information I will be able to understand the talk on Flip Feng Shui ;)

 
<h2>Intro</h2>
(source <a href="https://en.wikipedia.org/wiki/Row_hammer">https://en.wikipedia.org/wiki/Row_hammer</a>)

In DRAM a value of zero or one is determined electrically with use of a single transistor and capacitor. These transistors and capacitor pairs
are organized in matrices and addressed through rows and columns. Using row and column decoders bits are read by transferring their charge into a sense amplifier.
This process destroys the original charge value, and thus the cells need to be rewritten. Writing is a very similar process, but a whole row must be
rewritten for a single cell to change.<br>
<br>
Also, because of the naturally occurring discharge rate of the cells within DRAM, periodically the cells need to be rewritten with their original charge; this action
is called refreshing.<br>
<br>
Because of the density of the cells and it's charges, neighboring cells on other (usually adjacent) rows can be eletrically influenced. There are various ways to
mitigate against these random changes like <a href="https://en.wikipedia.org/wiki/Error-correcting_code_memory">ECC</a> and
<a href="https://en.wikipedia.org/wiki/Lockstep_memory">lockstep memory</a>.<br>
<br>
The more cells packed into a smaller area, the higher the chance of electrical influence of neighboring cells. Intentionally causing this change of values in cells
is basically what rowhammer is.<br>
<br>
DDR3 memory has been proven to be vulnerably to the intentional changes of cell values in other rows. When a row is frequently activated it can cause the neighboring
cells to be influenced and if the cells are not refreshed in time disturbance errors occur (i.e. the value of the victim row is influenced and altered). Activating a row
both above and below a victim, and thus having a higher probability of causing disturbance errors, is called double-sided hammering.<br>
<br>
<h2>Exploitation</h2>
On an operating system level, there are various memory protections in place to prevent the unauthorized reading, writing or otherwise manipulation of memory that is not
assigned to a certain process. By causing targeted disturbance errors these protections can be circumvented electronically, out of bounds of the operating system itself. <br>
<br>
Research in 2014 showed it should be technically possible to use these disturbance errors as an attack vector for exploitation, however they failed to provide practical examples. It
was not until 2015 that Google's Project Zero came with two exploits showing that it could actually be done. In both exploits it was accomplished by execution of
the <a href="http://x86.renejeschke.de/html/file_module_x86_id_30.html">clflush</a> machine instruction. Preventing of execution of this instruction proves to be problematic in some
systems; which means that exploitation prevention falls back to hardware based solutions. <br>
In July 2015 another practical exploit was published, this time created in JavaScript and exploitation was done inside the browser. The vector was still cache-abuse, but instead of the
clflush instruction it was done by abusing cache eviction (how a system removes data from cache) with carefully selected memory addresses.<br>
<br>
TL;DR: rowhammer works because of electrical interference between cells and is practically feasible and hard to mitigate in other ways than hardware itself.
