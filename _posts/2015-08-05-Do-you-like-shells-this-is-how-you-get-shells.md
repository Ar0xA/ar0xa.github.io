---
layout: post
title: Do you like shells? This is how you get shells.
description: How easy is it to evade anti-virus, and go around anti-exploit and anti-keylog tools
---

Every security professional knows that it's impossible to secure a system the full 100%. But we try. We use anti-virus, anti-exploit programs like <a href="https://support.microsoft.com/en-us/kb/2458544" target="_blank">EMET</a>, anti-malware programs like <a href="https://www.malwarebytes.org/" target="_blank">Malwarebytes</a>. Or perhaps even anti-keyboard logging applications like <a href="https://www.zemana.com/AntiLogger" target="_blank">Zemana's AntiLogger</a> and a password manager like <a href="https://lastpass.com/" target="_blank">LastPass</a>.

**But do those really help?**

*anti-exploit tools*

Programs like EMET, Cylance and other anti-exploit tools work by monitoring how a process is used and if that use is acceptable. They monitor your PDF reader or browser for example and when they see code functions executed in an unexpected manner that could indicate some kind of hack or exploit; they terminate the program.

The main advantage of these tools is that they, unlike most anti-virus and anti-malware applications do not rely on signatures to work. The downside is, that if the bad stuff happens outside of the application that gets protected; it's useless.

*anti-virus/malware*

These tools usually work by a combination of signature matching and some light forms of the anti-exploit tooling. But we like our systems fast so they can't bog us down too much. This means there are very possible ways of evading anti-virus solutions. The moment your bad application does not match a signature; chances are very high the anti-virus or malware tool will not find the bad piece of software.

*anti keylog applications*

This tool does not stop an attacker. It has one simple purpose, and that is to prevent bad software that logs keystrokes to either not be able to intercept this data, or make sure that the data is illegible. 

The obvious downside is that some applications might depend on not 100% API specified usage of the keyboard buffer, and those also won't work. 

*password manager*

Big extra advantage of the password manager is that keyloggers usually don't work. Other than the obvious advantage of being able to use huge long complex passwords that is. But..a lot of password managers use the clipboard for this; which also can be logged.


**How easy can you get around this?**

Sadly, very easy if you can get the user to execute a program you send them. On a fully patched Windows 8.1 system loaded up with anti-virus, EMET and AntiLogger; all it took was <a href="http://www.metasploit.com/" target="_blank">Metasploit's Meterpreter</a> and <a href="https://www.shellterproject.com/" target="_blank">Shellter</a>.

Shellter gets around the anti-virus, rather reliably. EMET is useless in this case, because we drop an infected binary and get a user to execute it. 

The only thing that worked reliably ended up being the anti-keylogging tool.


**Show me the money**

We need a binary to send to someone. The binary needs to be 32bit but that's no problem; in this case I send my fictional buddy (everyone knows I have no friends) Putty, a well known windows terminal program used to connect to Linux servers over SSH.

I download putty and Shellter. After unpacking Shellter on my Kali machine; I run it and use the default settings to backdoor putty.exe with Meterpreters reverse_tcp payload:
![shellter1]({{ site.url }}/public/images/thisishowyougetshells/shellter1.JPG)
![shellter1]({{ site.url }}/public/images/thisishowyougetshells/shellter2.JPG)
![shellter1]({{ site.url }}/public/images/thisishowyougetshells/shellter3.JPG)
![shellter1]({{ site.url }}/public/images/thisishowyougetshells/shellter4.JPG)

Once done, I email my buddy the putty.exe (as a .zip). And start up my Meterpreter's multi/handler:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf1.JPG)

Now I wait, and wait. Until my buddy runs the putty.exe on his fully "secured" system. Until:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf2.JPG)

Thanks buddy! (he does complain that the application didn't start by the way.)

Curious to see what I privileges I have I do getprivs:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf3.JPG)

What the hell? Does that guy run as admin or something? Not that I mind though if he did ;) so, lets try the magical "getsystem":
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf4.JPG)

Yeah, you got that right, I managed to evade anti-virus, anti exploit tools, all in a matter of minutes and the fact that my buddy was willing to run a program I send him. Not only that, because he runs as administrator, I could even get full system user. And you know why?

* That imaginary idiot runs programs I send him. Big <b>BIG</b> mistake;

* Anti-virus is trivial to evade, as demonstrated;

* Anti exploit tools don't help you here; it's not an exploit, but just a program he runs;

* The idiot ran it as administrator /doublefacepalm.

Now though, what about the key-logger tool? Innocently I walk over to my buddies imaginary desk, and ask him if he can log into our support portal, a web-application, to look at a ticket I have questions about.
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf5.JPG)

I see him type the URL, enter his user name and password, and log in. After we are done I go back and dump the credentials that Meterpreter should log for me:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf6.JPG)

Well darn! I guess AntiLogger does work!

Not to be foiled, I figure that perhaps the clipboard monitoring tool made by my friend OJ aka 0-day Reeves, aka <a href="https://twitter.com/thecolonial" target="_blank">TheColonial</a> made a while ago (more info: <a href="http://buffered.io/posts/3-months-of-meterpreter/" target="_blank">http://buffered.io/posts/3-months-of-meterpreter/</a>)

Invoking the extra badassery he made, I start the clipboard monitor:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf7.JPG)

After a while I do a clipboard_dump to see if anything interesting is there:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf8.JPG)

Well, not very. But at least it works. Now what about the password manager my somewhat fictional buddy uses? Will those credentials be captured after all?

And..nothing. Seems that this password manager, <a href="http://remotedesktopmanager.com/" target="_blank">Remote Desktop Manager</a>, uses browser plug-ins and does not use the clipboard to transfer data. How disappointing (from an attackers point of view).

How about a more popular password manager tool like LastPass though? How does that fare work:
![msf]({{ site.url }}/public/images/thisishowyougetshells/msf9.JPG)

Well I'll be darned; nothing. So because this also uses a browser plug-in; the clipboard isn't used and this too is a great way to protect your passwords.


**conclusion**

It's easy to evade anti-virus and anti-malware tools using tools like Metasploit, Meterpreter and Shellter. And unless you try actually execute evil code by abusing an exploit, anti-exploit tools like EMET will be rather useless too.

What did work though it dit not prevent the takeover of the system were a solid password manager that uses a browser plugin and Zemana's AntiLogger. 

What would have helped? If my fictional buddy wouldn't have executed the program I had send him, what a trusting dumb-ass. And shows that you can't trust anyone, and you should never, ever run programs unless you absolutely trust the source that send them.

That concludes today's frightening lesson.

shoutout to <a href="https://twitter.com/ehackingdotnet" target="_blank">Ehacking</a>'s article on <a href="http://www.ehacking.net/2015/07/bypass-anti-virus-with-shellter-on-kali.html" target="_blank">Shellter</a> for giving me the idea to do this.