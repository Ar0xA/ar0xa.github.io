---
layout: post
title: Ditch WhatsApp now! Use Signal Messenger
description: Why the new WhatsApp is a bad idea and Telegram shouldnt be considered
tags: whatsapp signal telegram
---
<h2>WhatsApps nasty data sharing clause</h2>
WhatsApp dropped the bomb. After shouting down doomsayers that it will not share data with Facebook (wish I could find the link now but Google is all filled with the current articles), it 
announced it will do just that anwyay. Thereafter the world erupted in how to disable this by a <a href="http://bfy.tw/7RbO">million articles and pages</a>.<br>

However what I originally also missed and was pointed out to me by <a href="https://www.twitter.com/miezkatz">@Miezkatz</a> is that there's a nasty clause in the article on the WhatsApp page:<br>
<img src="/static/img/twitter_miezkatz.png"><br>
<br> 
<b>You can turn off the sharing of data ONLY for targetted advertisements! They can and will still use your data; phonenumber, contact lists, groups and all <a href="http://www.wortzmans.com/blog/what-does-your-metadata-say-about-you-and-why-you-should-care">metadata</a> for tons of vague purposes other than targetted advertising.</b><br>
<br>
Infact nearly everyone seems to gloss over this distinction with remarkable ease in such a way that searching on how to turn it off hits tons of pages other than the official WhatsApp support page at 
<a href="https://www.whatsapp.com/faq/en/general/26000016">https://www.whatsapp.com/faq/en/general/26000016</a>. I hope I don't have to point out this is a bad idea.
<br>
<h2>Alternatives</h2>
The most obvious and well-known alternative is <a href="https://telegram.org/">Telegram</a>. But there's been quite a bit of buzz around <a href="http://gizmodo.com/why-you-should-stop-using-telegram-right-now-1782557415">why you shouldn't use</a> Telegram in the first place if you actually care about security. The tl:dr; is that their security implementation has a lot of issues and does not live up to their claims.<br>
<br>
The next best thing seems to be <a href="https://whispersystems.org/">Signal Private Messenger</a>; It's open source and available for both Android, iOS and (in combination with an Android smartphone) a desktop client for Windows in the form of a <a href="https://chrome.google.com/webstore/detail/signal-private-messenger/bikioccmkafdpakkkcpdbppfkghcmihk">Chrome plugin</a>. Since it's actual opensource and you can check, download and compile the sources from <a href="https://github.com/WhisperSystems">https://github.com/WhisperSystems</a> you can at least assume that it does what it says it does. Of course being opensource is no magic fix for all issues, since there are enough opensource programs that still contain serious bugs and not every developer is also a crytpography expert.
<br>
However considering that there are not so many other serious altenatives some respected sources have endorsed the use of Signal: <a href="https://google.com/#q=why+you+should+use+Signal">Why you should use Signal</a>.
<br>
<h2>Does Signal still have some issues?</h2>
<br>
Yes, for example if you let it be your default SMS app, it's easy to miss that the message is not received or read if your recipient has no data. It does have the received and read checks that are so well known, but it's still easy to miss.<br>
<br>
Other things, like groups; which WhatsApp is used for a lot, are supported in Signal. However there is one major issue with that as my buddy <a href="https://twitter.com/thecolonial">@TheColonial</a> found out when I was testing the group functionality. <br>
<br>
<b>If you add contacts to a group their phonenumbers will be visible to all members of that group, even if those people are not known to eachother!</b><br>
<br>
It's obvious why this is done; all members in the group need eachothers keys to communicate with eachother. However this is a serious information leak that you can't even protect yourself against at this moment. It should instead have an option to deny being added to a group that includes people that you not already have keys of.<br>
<br>
tl;dr: ditch WhatsApp and Telegram. Use Signal, but beware the group-functionality information leak.<br>
<br>
