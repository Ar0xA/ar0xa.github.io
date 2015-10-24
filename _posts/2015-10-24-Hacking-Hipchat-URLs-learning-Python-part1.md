---
layout: post
title: Scratching an itch, hacking HipChat URLs & learning Python, part 1
description: Part 1 of my curiosity about HipChat randomly generated URL's
---
<p class="message">
Disclaimer: I'm not a programmer, nor did I try to make the code I wrote neat. It mostly works, but it's hacked together that's why I'm a hacker not a programmer. I guess for entertainment value, it can show you my thought process as I work through a program.
</p>

<h1>Intro</h1>
Atlassian products, especially Jira and Confluence, are very popular. There are some serious benefits to using various products together since the integrations of the products into each other is pretty well done.

One of these products is a chat client named <a href="http://www.hipchat.com" target="_blank">HipChat</a> . This chat program allows some neat features through its <a href="https://www.hipchat.com/docs/api" target="_blank">decapricated</a> and <a href="https://www.hipchat.com/docs/apiv2" target="_blank">new</a> API, like sending a notification to a room if a build fails or a new ticket is created.

However, HipChat is a little underdeveloped compared to some other products. One of the biggest possible security issues I saw was that it allows for rooms to be set to allow guests, meaning anyone who would know the "random"-URL would be able to visit the room. There is currently no way to put a password on the guest-enabled room.

This got me thinking:<br />
- Exactly how random is that URL? <br />
- How likely is it going to be that a random person finds your room?<br />
- Is it possible to find a room with guest access within 4 hours?<br />

Why 4 hours? I have no idea, it seemed like a reasonably short time period. If the generation of the URL's is flawed it should be possible.

<h2>Some basic notes</h2>

First thing I noticed, after a while is that while the URL appears to be 9 random characters, in fact the first character always appears to be 'g'. Well that shaves a considerable amount of possible character combinations of the total, leaving only 8.
 
These characters could be anything from a-z, A-Z and 0-9, in what appeared to be a random order.

There seems to be a download for the server component at <a href="https://www.hipchat.com/server/get-it" target="_blank">https://www.hipchat.com/server/get-it</a> but to be honest, there is no guarantee that it's 100% the same code that they run themselves. Still good to know though.

The decapricated API still works fine and though limited in some cases, it can do the same functionality faster than in the new v2 API. However a lot of functionality is also missing, which could be a pain.

<h2>Try 1: The hard way</h2>

I figured the best way to find out if it's really bad is to just hammer it with randomly generated URLs and hope for the best.

What I found out is that if you request a URL that could technically be valid (starting with a 'g') it would return a 200 OK. Use anything other than 'g' for the first character and you would get an error-code.

The second bit was a bit more annoying. I would have to parse the page returned to me, if the HTTP code was a 200 OK and do a string-match. The string to match for was "This guest access URL is no longer valid". If the string would not be part of the response page, it would be a valid room.

This birthed the following rather simple, yet ugly, code <a href="https://github.com/Ar0xA/hipchatresearch/blob/master/findpubrooms.py">findpubrooms.py</a>

<pre class="brush: python">
#bruteforce, inefficient.

import random
import string
import requests
import sys
import re

def str_gen(size=8, chars=string.ascii_lowercase + string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def getURL(urlString):
    Url = "https://www.hipchat.com/g" + str(urlString)
    r=requests.get(Url)
    if r.status_code == 200:
        print ("Possible chatroom found: g"+urlString)
        if "This guest access URL is no longer valid." in r.text:
            print ("Inactive room :<")
            return True
        else:
           print ("Active room found at: g%s" % (urlString))
           sys.exit(0)
    else:
        print ("No room :< g%s" % (urlString) )
        return True

while getURL:
    getURL(str_gen())
</pre>

I let this run for a day and not too unsurprisingly this did not find any valid rooms. I could of course make it multi-threaded, but I'm a big fan of the "work smarter, not harder" philosophy and just throwing more threads at it seemed kind of like a last resort style of solution.

Thus, I decided to try play it smarter.

<h2>Try 2: Entropy and randomization analysis old API</h2>

Having failed at the stupid, I figured that I should generate a lot of rooms and store their names to see if I could analyze those. My idea was that after analysis I could put weights on certain characters for certain positions in the URL, so that the characters that were used more often would have a higher chance to pop up in a not-so-randomly-generated URL I could then create.

Having read the API docs, I figured I should start with the old decapricated API because it was more straight-forward and it looked faster, if less flexible than the new API. 

Having generated an API key and doing a trial run, I hit a problem...API calls are <a href="https://www.hipchat.com/docs/api/rate_limiting" target="_blank">rate-limited</a>. You could pretty much do only 100 calls within 5 minutes. After that you would have to wait for a reset.

This made my initial program a little bit more complex. I figured the easiest way to get around this, is to just make multiple API keys to use for requests and cycle between them. I wrought <a href="https://github.com/Ar0xA/hipchatresearch/blob/master/makeroompub.py" target="_blank">this monster</a>, which mostly worked(-ish):

<pre class="brush: python">
import requests
import sys
import time

AUTH_TOKEN=["","",""]
USER_ID=""
URL_CREATE="https://api.hipchat.com/v1/rooms/create?format=json&owner_user_id="+USER_ID+"&auth_token="
URL_DEL="https://api.hipchat.com/v1/rooms/delete?format=json&auth_token="

def makeroom(token_nr, room_id):
    makepost = requests.post(URL_CREATE+AUTH_TOKEN[token_nr], data ={"name":"test123", "guest_access":1})
    if makepost.status_code != 200:
        print "well, something went bad making this room. Prolly room didnt get deleted."
        print makepost.json()
        print room_id
        delroom(room_id,token_nr)
        remaining_calls = int(makepost.headers['X-RateLimit-Remaining'])
        if remaining_calls <= 5:
            print "Getting new token" 
            if token_nr == len(AUTH_TOKEN)-1:
                token_nr=0
                print "resetting to 0"
            else:
                token_nr = token_nr + 1
                print "using new token nr: %i" % (token_nr)
        return {'token_nr':token_nr}

    remaining_calls = makepost.headers['X-RateLimit-Remaining']
    if remaining_calls < 5:
        if token_nr == len(AUTH_TOKEN)-1:
            token_nr=0
            print "resetting to 0"
        else:
            token_nr = token_nr + 1
            print "using new token nr: %i" % (token_nr)
            
    resultset = makepost.json()
    roomname = resultset['room']['guest_access_url'].replace("https://www.hipchat.com/","")
    roomid = resultset['room']['room_id']
    return {"roomname":roomname,"roomid":roomid}

def writedata(roomname, roomid):
    with open("room.txt","a") as roomfile:
        roomfile.write(roomname + "\n")

def delroom(roomid, token_nr):
    delroom = requests.post(URL_DEL+AUTH_TOKEN[token_nr], data ={"room_id":roomid})

    if delroom.status_code != 200:
        print "well, something went bad deleting this room."
        remaining_calls = int(delroom.headers['X-RateLimit-Remaining'])
        if remaining_calls <= 5:
            print "Getting new token"
            if token_nr == len(AUTH_TOKEN)-1:
                token_nr=0
                print "resetting to 0"
            else:
                token_nr = token_nr + 1
                print "using new token nr: %i" % (token_nr)

token_nr=0
room_id=0
for _ in range(500000):
    result = makeroom(token_nr, room_id)
    if 'token_nr' in result:
        token_nr=result['token_nr']
    
    if 'roomname' in result:
        writedata(result['roomname'],result['roomid'])
        delroom(result['roomid'],token_nr)
        room_id=result['roomid']
        print result['roomname']

print "I'm 100% done" 
</pre>

While this pretty much worked, it was rather slow and there was another issue. Rapidly making and deleting rooms seemed to kind of annoy the server and sometimes the room did not get deleted fast enough. Despite some error handling, I couldn't quickly fix this and because I had seen that the new API can enable/disable guest access without deleting the room, I figured it was time to give that a try instead.

<h2>Try 3: Entropy and randomization analysis new API</h2>

This was going to be *IT*, I would do this right, multi-threaded and with the new API. At least, that was the idea but as I mentioned before I am not a programmer. 

Almost immediately after starting I hit a snag, I couldn't figure out how to write to a single file from multiple threads without screwing stuff up. I can tell you, it took some significant time to figure out how to use threading.condition() correctly for this purpose.

Having conquered that issue, I made a basic program which would enable guest access to a room I had created from the client. 

This was actually rather easy, but starting that program again, it returned an error from the hipchat API, because guest access was already enabled. I fixed that so that at the start of the program it walks through all the rooms it knows and disables guest access everywhere before doing anything else.

Having solved that, I was trying to figure out how to get the generated URL back and was somewhat annoyed. Enabling guest access on a room only gave you an OK or failed, the response did not include the generated URL. Rather disappointed I used up another API call to, after enabling guest access, request the generated URL and store it in a file.

My rate-limiting checks didn't work very well though, so I had to insert some extra status_code checks and create a pause and call to itself to fix any other issues.

Starting off with 3 threads, I noticed that sometimes the responses to the API calls would be very slow and sometimes very quick. I can only assume that this is because the API is quite busy, being the official public HipChat server, after all. However this was a bit of a pain, because it sometimes had all threads waiting for an API key that had some requests left.

So, I created a total of 10 rooms, created more API keys and changed the program so that I could easily insert more if I would want to. Despite the 10 threads it was quite slow though, because each generated URL was pretty much 3 API requests; Enable, retrieve URL, disable. But I decided to not hammer the servers with more threads, there was no rush after all.

I learned a lot with this, especially about multi-threaded coding in Python, of which I had done very little in the past. While not the most beautiful code ever made, I myself am quite happy with what I <a href="https://github.com/Ar0xA/hipchatresearch/blob/master/makeroom_api2.py" target="_blank">produced</a>:

<pre class="brush: python">
#lets try it the nice way
import requests, sys, time, threading, logging, json

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] (%(threadName)-10s) %(message)s',)

APIToken=["","", "", "", "","","","","",""]
roomNames=["apiv2room-1", "apiv2room-2", "apiv2room-3","apiv2room-4","apiv2room-5","apiv2room-6","apiv2room-7","apiv2room-8","apiv2room-9","apiv2room-10"]

#if a room has guest access enabled, turn it off!
def disableInitialRoomGuestAccess(roomName, APIToken):
    #get room info
    logging.debug('Starting')
    roomURL= "https://api.hipchat.com/v2/room/" + roomName + "?auth_token=" + APIToken
    getInfo = requests.get(roomURL)
    remaining_calls = int(getInfo.headers['X-RateLimit-Remaining'])
    logging.info('Remaining calls for this API Key: %i' % (remaining_calls))

    if getInfo.status_code != 200:
        logging.info('status code: %s' % (getInfo.status_code))
        if getInfo.status_code == 429:
            logger.info("out of keys, sleeping")
            time.sleep(60)
            logger.info("lets try again")
        #lets just try again ;)
        disableInitialRoomGuestAccess(roomName, APIToken)
    isName = getInfo.json()['name']
    isGuestAccessible = getInfo.json()['is_guest_accessible']
    logging.info("room %s is set to is_guest_accessible: %s " % (isName,isGuestAccessible))
    
    #turn off if the room is guest accessible
    if isGuestAccessible:
        logging.info("changing room %s to is_guest_accessible: False" % (isName))
        payload = getInfo.json()
        payload['is_guest_accessible'] = False
        resultPut = requests.put(roomURL, data = json.dumps(payload), headers={'content-type':'application/json'})
        remaining_calls = int(resultPut.headers['X-RateLimit-Remaining'])
        logging.info('Remaining calls for this API Key: %i' % (remaining_calls))

        if resultPut.status_code == 204:
            logging.info("Done!")
        else:
            logging.info(resultPut.status_code)
            logger.info("out of keys, sleeping")
            time.sleep(60)
            logger.info("lets try again")
    return

# thread turn initial guest access off
#only runs at start, to disable any guest access that might be 
#enabled from errors
def t_InitGuestAccessOff(roomName,APIToken):
    disableInitialRoomGuestAccess(roomName,APIToken)
    return

#get the room info
def getBasicRoomInfo(roomName,APIToken):
    #get room info
    logging.debug('Starting')
    roomURL= "https://api.hipchat.com/v2/room/" + roomName + "?auth_token=" + APIToken
    getInfo = requests.get(roomURL)
    remainingCalls = int(getInfo.headers['X-RateLimit-Remaining'])
    logging.info('Remaining calls for this API Key: %i' % (remainingCalls))

    if getInfo.status_code != 200:
        logging.info('status code: %s' % (getInfo.status_code))
        if getInfo.status_code == 429:
            logger.info("out of keys, sleeping")
            time.sleep(60)
            logger.info("lets try again")
            #lets just try again ;)
            getBasicRoomInfo(roomName,APIToken)
    return {'getInfo':getInfo.json(), 'remainingCalls':remainingCalls}

def enableGuestAccessReturnURL(roomName, APIToken, basicRoomInfo):
    logging.info("changing room %s to is_guest_accessible: True" % (roomName))
    roomURL= "https://api.hipchat.com/v2/room/" + roomName + "?auth_token=" + APIToken
    payload = basicRoomInfo
    payload['is_guest_accessible'] = True
    resultPut = requests.put(roomURL, data = json.dumps(payload), headers={'content-type':'application/json'})
    remaining_calls = int(resultPut.headers['X-RateLimit-Remaining'])
    logging.info('Remaining calls for this API Key: %i' % (remaining_calls))
    if resultPut.status_code == 204:
        logging.info("Done!")
    else:
        logging.info(resultPut.status_code)
        if getInfo.status_code == 429:
            logger.info("out of keys, sleeping")
            time.sleep(60)
            logger.info("lets try again")
            #lets just try again ;)
            enableGuestAccessReturnURL(roomName, APIToken, basicRoomInfo)

    #now extract the URL we want to know
    resultSet = getBasicRoomInfo(roomName, APIToken)
    guestURL=resultSet['getInfo']['guest_access_url']
    return guestURL.replace("https://www.hipchat.com/","")

def disableGuestAccess(roomName, APIToken, basicRoomInfo):
    logging.info("changing room %s to is_guest_accessible: False" % (roomName))
    roomURL= "https://api.hipchat.com/v2/room/" + roomName + "?auth_token=" + APIToken
    payload = basicRoomInfo
    payload['is_guest_accessible'] = False
    resultPut = requests.put(roomURL, data = json.dumps(payload), headers={'content-type':'application/json'})
    remaining_calls = int(resultPut.headers['X-RateLimit-Remaining'])
    logging.info('Remaining calls for this API Key: %i' % (remaining_calls))
    if resultPut.status_code == 204:
        logging.info("Done!")
    else:
        logging.info(resultPut.status_code)
        if getInfo.status_code == 429:
            logger.info("out of keys, sleeping")
            time.sleep(60)
            logger.info("lets try again")
            #lets just try again ;)
            disableGuestAccess(roomName, APIToken, basicRoomInfo)
    return

#here we loop through our tokens till they are spend
def t_LoopTokens(roomName, APIToken, cond):
    #first we get basic room info we need to change data in the room
    #we do this so we can turn on/off without having to request this
    #every single time
    resultSet = getBasicRoomInfo(roomName,APIToken)
    basicRoomInfo = resultSet['getInfo']
    APICallsLeft = resultSet['remainingCalls']

    #now that we have the basic info lets turn guest access on
    #we loop until we are out of tokens
    guestURLStorage=[]
    for _ in range(5):
        guestURL = enableGuestAccessReturnURL(roomName, APIToken, basicRoomInfo)
        logging.info("Guest URL: %s" % (guestURL))
        guestURLStorage.append(guestURL)
        disableGuestAccess(roomName, APIToken, basicRoomInfo)

    #now that we are done looping and have the guest URLs..lets store it someplace safe
    #aquire the file lock
    with cond:
        logging.info("++ writing result to file ++")
        with open("room_api2.txt","a") as roomfile:
            for URLs in guestURLStorage:
                roomfile.write(URLs + "\n")
        #free willie..or the file lock, whatever you prefer
    return

#initial start, no matter the quit, lets start off by disabling
#all the guest access for all rooms
threads = []
for i in range(len(roomNames)):
    t = threading.Thread(target=t_InitGuestAccessOff, args=(roomNames[i],APIToken[i]))
    threads.append(t)
    t.start()
    #lets wait for every thread to be done with that before we continue
t.join()

#now that none of the rooms have guest access enabled, lets loop
#note: we use condition for resource lock on the output file
condition = threading.Condition()
keepLooping = True
while keepLooping:
    for i in range(len(roomNames)):
        t = threading.Thread(target=t_LoopTokens, args=(roomNames[i], APIToken[i], condition,))
        threads.append(t)
        t.start()
    t.join()
</pre>

Part 2 coming soon in which I will show you the results of my requests and analysis.
