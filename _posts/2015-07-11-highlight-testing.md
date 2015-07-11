---
layout: post
title: Testing highlight javascript
---

<pre><code class="python">
import socket, random, time
from urllib import urlencode
from urllib2 import urlopen, Request

NICKNAME='foo'
CHANNEL='#offtopicsec'
network = 'adams.freenode.net'
port = 6667

lame_excuses =["My dog ate my brain :(","Zug zug!","Err, I didn't quite get that :(", "What?", "What? Sorry I was not paying attention. Hmm, I don't know","*dances* I don't know what you mean, but I love the Internet!"," *cry* I think my brain died :("]

def connect():
    irc = socket.socket ( socket.AF_INET, socket.SOCK_STREAM )
    irc.connect ( ( network, port ) )
    print irc.recv ( 4096 )
    irc.send('NICK %s \r\n' % NICKNAME)
    irc.send ( 'USER Foo foo foo : SphaZ is my master\r\n' )
    irc.send('JOIN %s \r\n' % CHANNEL)
    return irc

def sendmsg(irc, message):
    irc.send(message)

def botspeak(speaker, what_is_said):
    what_was_said="derp derp"

    chatbot_url ='http://www.pandorabots.com/pandora/talk?botid=f5d922d97e345aa1&skin=custom_input'
    post_stuff = urlencode([("botcust2","9a41a3f618c439e2"),("input",what_is_said)])
    try:
        page=urlopen(Request(chatbot_url),post_stuff,120).read()
        pagelist = page.split("\n")
        i=-1
        botreply= pagelist[-1]
        while botreply.find("<br>  ALICE:") == -1:
            botreply=pagelist[i]
            i-=1

        botreply=botreply.replace("<br>","")
        print "org reply was: " + botreply
        botreply=botreply.replace("  ALICE:  ","")
        botreply=botreply.replace("  "," ")
        botreply=botreply.replace("ALICE", "foo")
        botreply=botreply.replace("judge", speaker[0:speaker_whole.find('!')])
        botreply=botreply.replace("Judge", speaker[0:speaker_whole.find('!')])
        print "fixed reply was:" + botreply
    except:
        print "something whent wrong, lets think up a lame excuse"
        botreply = " "+ lame_excuses[random.randint(0,len(lame_excuses)-1)]
    return botreply

if __name__ == "__main__":
    irc = connect()
    while True:
        talking_to_us = False
        data = irc.recv ( 4096 )
        if data.find ( 'PING' ) != -1:
            irc.send('PONG '+ data.split() [ 1 ] + '\r\n')

        data_string = str(data).lower()
        if data.find ('PRIVMSG '+ CHANNEL +' :') != -1 and data_string.find (':' + NICKNAME.lower()) != -1:
                talking_to_us = True

        speaker_whole = data[1:data.find(' ')]
        speaker_name= speaker_whole[0:speaker_whole.find('!')]

        if talking_to_us:
                print "data: >" + data

                what_is_said = data[data_string.find(':' + NICKNAME.lower()):]
                what_is_said =what_is_said[len(':' + NICKNAME)+1:]
                print "User %s said %s "  % (speaker_name,what_is_said)

                what_to_say = botspeak(speaker_whole,what_is_said)
                sendmsg(irc,'PRIVMSG '+ CHANNEL + ' :%s:%s\r\n' % (speaker_name,what_to_say))

        print data

</code>
</pre>