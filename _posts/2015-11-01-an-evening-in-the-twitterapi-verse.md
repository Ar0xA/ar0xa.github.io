An evening spend in the Twitterverse API

<h2>intro</h2>
I'm an avid user of Twitter, mostly because it's generally a great way to keep in touch about whats happening in the infosec world. You can't keep an eye on everything yourself, but if you follow the right people there is hardly anything interesting that you will miss. Obviously following too many people just ends up in random noise, so I try avoid that.

Now I've never done anything with the Twitter API, but I was kind of curious as to how it would work, so I figured I'd spend an evening poking at it.

Since my preferred choice of hack-it-up language is Python and I didn't want to spend doing everything in JSON myself, I went out to look for a library to use. I did some Googling and found <a href="https://github.com/bear/python-twitter" target="_blank">Python-Twitter</a> to be one of the more actively updated. The alternatives all seemed to be rather old and abandoned, so a quick *pip install pythont-twitter* made the library available on my local Kali VM on which I do most of my fiddling.

Now the official github page itself gives really very little information past the <a href="https://github.com/bear/python-twitter#api">basics</a>. Thankfully the python docs were much more informative, and a quick *pydoc twitter.api* gives information about all the exposed functions, the required and the optional parameters and more.

Since I just wanted to fiddle a bit with the API and not do something too serious I came up with the following idea: Make a program that checks it's mentions (Twitter messages that mention it's name) and do <a href="https://en.wikipedia.org/wiki/Base64" target="_blank">base64</a> magic on this. If the tweet contained base64 it should decode it and tweet it back in the same conversation, if it was NOT base64 it should encode it and tweet that back in the same conversation.

First, I had to get the tokens required from Twitter for my bot. So I signed up for a new account and called it <a href="https://twitter.com/base64bot">@base64bot</a>. Not very original that's true, but oh well. Having created the account, I went to look around in the settings menu to find options to generate API keys. Failing this after a few minutes I turned to google and found out that the new API only allows OAUTH and you need to create an application on <a href="https://apps.twitter.com/app/new" target="_blank">https://apps.twitter.com/app/new</a>. 

Don't bother looking on <a href="https://dev.twitter.com" target="_blank">https://dev.twitter.com</a>, because while this does give a lot of information about the different types of tokens and all that, you need to be on the other page to create tokens to use with your own account.
 
Trying to create the application, make me hit the first snag:

<img src="/images/twitterAPI/createapp.PNG" />

Well crap...they want my mobile number to be a dev? I find this rather lame and excessive, but not to be denied. I did add my phone number to my account after which I could create a new application:

<img src="/images/twitterAPI/applicationmade.PNG" />

<h2>Coding!</h2>
From the example I knew that if I wanted to use this API on my own account (unlike when you make an application to authorize other people) I would need to have a Consumer Key (API), Consumer Secret (API Secret), a Access Token and Access Token Secret. These can all be made and generated on the "Keys and Access Tokens" tab in the same page.

Using this information I made my first attempt at the python program, which would do nothing more than try to authorize and print the returned information. This proved to be rather trivial:

<pre class="brush: python">
import twitter

CK=""
CS=""
AT=""
ATS=""

#lets auth
print ("Authenticating...")
api = twitter.Api(consumer_key=CK, consumer_secret=CS, access_token_key=AT, access_token_secret=ATS)
print api.VerifyCredentials()
</pre>

This proved to be easy with the GitHub example, but I noticed the data returned was much more informative than mentioned in the example:

<img src="/images/twitterAPI/auth1.PNG" />

I assume this has to do with the profile changes that happened a while ago, and functionally it doesn't really change anything. So I figured the program-flow should be something like this:

1. check mentions the bot didn't respond to yet and that start with the name of the bot
2. check if it's base64 -> decode, if its not encode
3. tweet the response back
4. somehow store the tweet the bot responded to, so it won't respond again to the same tweet

Checking the API pydoc, number 1 could be done with GetMentions. All it required was the tweet ID to start looking from and the amount of mentions you wanted to retrieve in one go. Poking around with this, I noticed that this API also has a request limiter. Too many API requests in a short period of time and you'd get an error back from Twitter. After some trying out, I settled on something like this:

<pre class="brush: python">
        mentions=""
        print ("Getting mentions")
        try:
            mentions = api.GetMentions(5,sinceID,None,False,False,False)
        except:
            #bugger, prolly a timeout
            traceback.print_exc()
            time.sleep(60)
        if len(mentions)> 0:
            print("we got mentions!")
</pre>

This worked rather well to be honest. Sure, you can spend your API calls checking the headers for how many calls you can make, but why not make it simpler and the first time you get an error because you hit the limit just have a 60 second wait? 

The first parameter in the GetMentions is the amount of mentions you want to get back at a maximum. Since I was just testing 5 would be fine. The sinceID would hold the value of the tweet ID to look from, to prevent the bot to respond more than once to the same tweet. Because you can get more items back in one reply from the API, the response needed to be iterated over, and some data needed to be extracted to respond back correctly and do analysis om what the text was that was tweeted.

<pre class="brush: python">
            print("we got mentions!")
            for item in mentions:
                mentionData=json.loads(str(item))
                #print mentionData
                mentionName=mentionData['user']['name']
                mentionText=mentionData['text']
                mentionID=mentionData['id'] #we need this to update since_id lateron
                print ("who tweeted us: %s " % mentionName)
                print ("what was tweeted: %s " % mentionText)
                print ("messageid is: %s" % mentionID)
                #ok so lets handle what was tweeted at us
                #format requires it starts with our own name
                if mentionText.startswith(BSN):
                    print ("alright, we need to do something with this!")
</pre>

To prevent the bot trying to respond if other people tweet about it, I figured I would require the mention to start with the bots name itself before doing anything else. After that some basic information was extracted and stored, so that it can be used later to respond back. The mentionText parameter is the part that actually contains the text of the tweet to be encoded/decoded.

Now I had the next problem to solve "how to figure out of it's valid base64?". This, it seemed is not very easy. Because base64 contains valid printable characters, and text can look very much like base64, especially if it's one word, I ended up using a trick.

First, I would check if the base64.decodestring worked. If this generated an exception it's most definitely NOT base64. But if it did not fail, it still technically did not have to be base64 yet so I figured that if the tweet text did not generate an exception, but did contain unprintable characters it would not be valid base64 and thus needed encoding. I solved it like this:

First, here we try decode and see if it generates an exception or not
<pre class="brush: python">
	                #So, is this a base64 string?
                #this is not foolproof, thats why workWithValid
                #requires an extra test to see if it really is base64 or not
                    try:
                        decodeResult = base64.decodestring(editText)
                        print("seems valid base64, lets try decode")
                        workWithValid(decodeResult, mentionName, mentionID)
                    except: #not valid base64, so lets encode
                        traceback.print_exc()
                        print ("seems invalid, lets try encode instead")
                        encodedResult = encodeB64(editText)
                        tweetIt(encodedResult, mentionName, mentionID)
</pre>

And here we check a possibly valid string to see if it's base64						
<pre class="brush: python">
def workWithValid(decodeResult, mentionName, mentionID):
    printable = set(decodeResult).issubset(string.printable)
    if printable:
        print ("valid printable lets tweet")
        tweetIt(decodeResult,mentionName,mentionID)
    else:
        print ("not valid base64, so lets encode")
        encodedResult = encodeB64(decodeResult)
        tweetIt(encodedResult, mentionName,mentionID)
    return
</pre>

Surprisingly, this worked very well! I was a rather happy camper with this. However I noticed the next challenge, base64 encoded responses could be more than the maximum length of what it could fit in a tweet. While 140 characters is the maximum we already lose a few because of the @[name]{space} that we need to reply back to the user. 

This ended up being a bit of a pain, but was fun to solve. What I did was construct the response, and if it was more than 140 characters in total, I would break it up in various pieces until the whole response was given back to the user. The end result of tweetIt procedure:

<pre class="brush: python">
    #if so, we can just tweet back
    if mentionName == "soot":
        encodedResult = "Sorry Dave, I can't do that."
    tweetString = "@" + mentionName + " " + encodedResult
    if len(tweetString) < 140:
        twitResult=api.PostUpdates(tweetString, in_reply_to_status_id=mentionID)
    else:
        print("we need to split this up in bits of 140 chars")
        #the extra chars are
        # @[mentionname]{space}x/y{space}
        maxTweetLen = 140-(len(mentionName)+6)
        howManyTweets = int(math.ceil(len(encodedResult)/float(maxTweetLen)))
        tweetNum=1
        #ok so maximum amount of chars we can fit into one message is maxTweetLen
        #lets do some formating magic, to get all the tweets out
        while len(encodedResult) > 1:
            tmpTweetStr = encodedResult[0:maxTweetLen]
            encodedResult=encodedResult[maxTweetLen:len(encodedResult)]
            tweetStr = "@%s %i/%i %s" % (mentionName,tweetNum,howManyTweets,tmpTweetStr)
            twitResult=api.PostUpdates(tweetStr, in_reply_to_status_id=mentionID)
            tweetNum+=1
    return
</pre>

Note the while loop, I am quite proud of that solution :)

After the response was given back, the ID of the tweet was stored in a file to prevent a restart of the bot to make it start responding to whatever it saw. This was trivial and not worth mentioning here.

This was as far as I originally wanted to go, but to be honest it left me a little unsatisfied. It felt rather trivial to do so I figured I would need to expand it a bit. My idea was to allow the bot to respond to a tweet containing only a Pastebin URL. 

As I hoped this made the program quite a bit more complex. First of all I wanted to get ONLY Pastebin posts, to prevent abuse so other than trivial "does the string start with http or https", I would need to do some detection to see if it's actually Pastebin or another site.

The main loop hardly changed, but if a http:// or https:// was detected, a new function was called doTheURLDance. This function will check if it's really Pastebin, get the content and decode/encode it and post the result back to Pastebin and finally respond to the original Twitter conversation with the link to the encoded/decoded Pastebin to the author of the tweet.

Now there were a few interesting issues with this, the most notable being that Twitter has it's own shortening service to make usage of URL's in tweets more optimal. Initially I did a *requests.get(URL)* but that already returned the actual page, not the redirection reply from Twitter. Looking at the documentation for requests, it was rather obvious I would need to use the "allow_redirection=False" optional parameter. Using this I indeed would get a nice set of headers from the Twitter redirection service without already retrieving the page it redirected to:

<img src="/images/twitterAPI/pastebinURL.PNG" />

Extracting the URL and checking if it's Pastebin is trivial now! Once we knew it was Pastebin or not, we would need the random characters after the domain, to request the RAW format of the message to download and encode/decode. This created the following code:

(obviously not done, since this only encodes! But since I already did the base64 detection in normal tweets this was not something I felt was a productive way to spend my time)

<pre class="brush: python">
        locInfo = getInfo.headers['location']
        getUrlID = locInfo[locInfo.rfind("/")+1:len(locInfo)]
        getUrlDomain = locInfo[0:locInfo.rfind("/")]
        if getUrlDomain == "https://pastebin.com" or getUrlDomain == "http://pastebin.com":
            print("Its pastebin, go go go!")
            rawPaste=requests.get("http://pastebin.com/raw.php?i=%s" %(getUrlID))
            if rawPaste.status_code != 200:
                print("well, that didnt work out. give up and try encode normally")

            else:
                result = rawPaste.text
                #TODO: check if text or base64

                #if NOT base64, encode
                #now to do our magicly magic
                b64Result= base64.b64encode(result)
                #and now, we create a new paste
                #containing this data
                pastebinURL =makePastebinPost(b64Result, mentionName)
                if len(pastebinURL) > 1:
                    tweetIt(pastebinURL,mentionName,mentionID)
                    return True
        else: #not pastebin, abort abort! abandon ship!
            return False
</pre>

Obviously, once the raw content of the Pastebin was encoded, it would need to be posted back to Pastebin again. I did this using an API key, though you could technically do without. The <a href="http://pastebin.com/api" target="_blank">API page</a> of Pastebin was very well done, and it ended up being very easy. The only thing that threw me off was that it needed to be JSON encoded, instead of curl based like the example to work well in Python.

After that all that was needed was to tweet back the URL response from Pastebin and done!

<h2>Conclusion</h2>
tl;dr: I had an evening of fun with the Twitter and Pastebin API's. Full code can be found on <a href="https://github.com/Ar0xA/Twitter_base64_bot" target="_blank">my GitHub</a>.







