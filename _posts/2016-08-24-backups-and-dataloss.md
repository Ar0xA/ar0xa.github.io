---
layout: post
title: quantum backups
description: Welp, why didn't I verify my backup
tags: idiot blog backup
---

<h2>How quantum; a backup contains of 3 states</h2>
Well, the blog is back online from github pages after my cheap VPS host decided to cancel on me. They did claim to send out warning emails, but I never saw them. <br>

<br>
No issue I thought, I make regular backups to github. Or do I? Turned out I sort of did..but considering the blog hardly never contained anything world shattering, I never verified those backups worked. <br>
<br>
I concluded that backups contain 3 possible states: <br>
- not made <br>
- made, but not verified <br>
- made and verified <br>

<br>
So I lost my milnet writeup; kind of annoying but hardly a loss to the world of information security.<br>
<br>
More annoying was that the VPS also was used as my tdlr.nu email relay. I was unable to receive any mail for a period of time; and while not too many people mail me on this domain (thankfully), if I missed something send it again. <br>
Since then I've moved my email to a premium account of <a href="https://www.protonmail.com">Protonmail</a> with which I am incredibly happy. They provide a very nice and quick guide to setup your MX, DKIM, DMARC and SPF records. Using <a href="http://dmarc.postmarkapp.com">Postmarkapp</a> I will even get free notification mails if my domain is being used for spam purposes.<br>
<br>
tl;dr: I'm an idiot for not verifying my backups. Lessons learned.







