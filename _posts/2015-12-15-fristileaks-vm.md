---
layout: post
title: Fristileaks meetup and its vuln VM
description: About the fristileaks meetup and its vulnerable VM
tags: vulnhub hacking fristileaks meeting
---

<h2>Organizing a meeting and filling the agenda</h2>
Last friday, 11th of December, was another episode of the loosely organised hacker-meetup called Fristileaks. Originally I had asked on twitter if there was another 
meeting scheduled, and got told that if I wanted a meeting I should organise one.<br>

So I did; Fristileaks "Unlock my Pad" was born and both me and <a href="https://twitter.com/barrebas/" target="_blank">@Barrebas</a> wanted to do something with lockpicking. That became the first item on the agenda.
People said it also needed more cyber, so I volunteered @barrebas to give his <a href="http://download.vulnhub.com/media/rop-primer/rop-primer.pdf" target="_blank">ROP talk</a> that he gave at BSidesLDN this year. <br>
<br>
This however was still a little low on interesting things for a whole evening. Thankfully another regular <a href="https://twitter.com/annejanbrouwer" target="_blank">Anne Jan Brouwer</a> was kind enough to step and give a little presentation about an open source password manager project he runs called <a href="https://qtpass.org/" target="_blank">QtPass</a>. <br>
<br>
However, I felt it needed something to keep people busy in between. So I figured I'd make a vulnerable VM that should be hackable in about 4 hours, by someone with some experience in the field. Thanks to some testing and talking to both dqi and barrebas, this only took me a few hours. <br>
<br>
<h2>The meeting</h2>
The location of the Fristileaks meetup was sponored by <a href="https://twitter.com/dearbytes" target="_blank">@DearBytes</a> who by proxy of another regular Fristileaks attendant <a href="https://twitter.com/rikvduijn" target="_blank">Rik van Dujin</a> supplied not just a location, but also some beer, 
<a href="https://en.wikipedia.org/wiki/Club-Mate" target="_blank">Club Mate</a> and a few snacks. Many thanks for this! Other attendants supplied some Fristi (how could we have a Fristileaks without fristi!), cola and other beverages and snacks. <br>
<br>
Both me and barrebas were royally late, because the weather sucked, it was a bit more driving than 2 hours and location was rather hard to find. You wouldn't really expect a SOC to be located above a shoppingcenter, at least we didn't! <br>
<br>
Once at the meeting about 12 to 15 people had turned up, not unexpectantly no one on the "I might come" list came ;) Bas started up with his ROP talk, which was obviously geared at an audiance that had a bit more exploit development experience than most there present. Still, it was a very interesting talk and gave me at least more idea about the how/why of Return Orientated Programming. <br>
<br>
We brought out the locks and lockpicks after that and had quite a bit of fun trying to pick some of the locks. A lot of people had never attempted lockpicking before, so gladly I brought some super easy locks. Interestingly barrebas ended up really sucking at lockpicking, even compared to the other first-timers ;) <br> I had bought a set "4 for 5 bucks" locks, thinking they would be rather trivial to pick and I spend being frustrated with those locks most of the evening...they were obviously not very trivial even for such incredibly cheap locks.<br>
<br>
Anne Jan's talk was quite interesting; I had never heard about the project myself. It was cool to hear how a project by someone can be received so enthousiastically by the community, and than also contributed to by others when they wanted features added. He's been quite successful with getting QtPass into various distributions too!<br>
<br>
In between this all I had thrown around 2 USB sticks with the .ova of Fristileaks, the hack-me VM I made. It was interesting to see people poke at it and how their thought processes went. However in the end only @rikvduijn came close to winning the lockpick set during the meeting. However the deadline passed and me and bas still had a 2.5 hour drive home, so I took the prize, a 5 piece lockpick set, back with me. (However by the time I came home, I had received a tweet that he got the flag and root).<br>
<br>
<h2>Fristileaks 1.3 VM, and a writeup-competition</h2>
I figured other people might enjoy this little VM too, so had it put up on <a href="https://www.vulnhub.com/" target="_blank">VulnHub</a>, a well known resource for hackable VM's. So you can now enjoy this little challenge too! You can download it from <a href="https://www.vulnhub.com/entry/fristileaks-13,133/" target="_blank">here</a>. Fyi: if you have issues with DHCP, try manually setting the MAC address to 08:00:27:A5:A6:76<br>
<br>
Because I was still stuck with a 5 piece lockpick set, and most of the regulars of VulnHub are sticker-crazy, I decided to throw a competition for this VM. <br>
<br>
If people submit a writeup about how they got root and the flag before the 1st of januari 2016, I will decide a winner, and a few runner ups. The winner gets the lockpick set and a few stickers, and the others just some stickers. Just send me a tweet with your writeup, can even be a github gist if you don't have a blog :) Make it amusing or interesting to read, and you might win some of these limited stickers! <br>
<br>
tl;dr: had fun for an evening at Fristileaks hacker meetup in Den Haag, and made a vulnerable VM.







