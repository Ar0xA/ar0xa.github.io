---
layout: post
title: Stagefright; the not focused on vectors are more scary
description: While the stagefright MMS vector is dangerous, there are more worrying ones.
---

Well, the internet exploded..again. This time the virtual a-bomb was dropped by <a href="https://twitter.com/jduck" target="_blank">@jduck</a>. He discovered a Remote Code Execution vulnerability in a library of Android that handles processing media called <a href="http://blog.zimperium.com/experts-found-a-unicorn-in-the-heart-of-android/" target="_blank">Stagefright</a>. It's bad, quite bad (estimated 950 million devices vulnerable), despite that it doesn't give you RCE root access to a device straight up.

![jduck_no_root]({{ site.url }}/public/images/stagefright/jduck_no_root.JPG)

The most talked about exploitation currently is MMS for one simple obvious reason; almost all messaging apps use pre-loading of an MMS message. This means you don't have to open the message to be exploited. While this is indeed a cool vector, I hope people agree that there are much more serious other vectors. 

I mean how many people on my phone can I actually send an MMS? 25? 100 max perhaps?

How many people can I send an email however or make to visit a web page at virtually no cost at all? Many more and much easier too.

Here in a short discussion with <a href="https://twitter.com/rikvduijn" target="_blank">@rikvduijn</a> and jduck it's obvious that the implications are much more frightening than the people who have you as their contact or can find your phonenumber:

![jduck_other_vectors]({{ site.url }}/public/images/stagefright/jduck_other_vectors.JPG)

And while carriers might be able to block the attack over MMS; you can't block it on a web page or email so easily. So while I think that the MMS pre-loading is a frightening an issue; I'm much more worried about the attack vectors of email and web browsers and the fact that it's extremely unlikely any phone older than a few months will get patched. 

tl;dr: We're pretty much fucked and this one will be around for a long time to come.