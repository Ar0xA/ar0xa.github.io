---
layout: post
title: The Seccubus and the Jira
description: making Seccubus talk to Jira by creating tickets for findings
---

In a land, not that far away, a little mouse worked for a big wealthy lizard. This lizard had many workers that made little machines. Those machines helped people do their job better. The little mouse however, did not make machines.

The mouse was hired by the lizard for a very specific reason: to tell the lizard when there would be problems with the machines, and give advice on how to handle those possible problems.

The mouse liked this job very much. To help look for problems in machines the mouse used various tools, but one ended up being extremely handy; a tool called <a href="http://www.tenable.com/products/nessus-vulnerability-scanner" target="_blank">Nessus</a>. That tool could find possible problems very fast and well, but there also ended up being a lot of things the mouse needed to check once the tool was done checking a machine. That's why the mouse did end up spending an awful lot of time trying to figure out how to handle every possible finding that a machine could have.

Looking around the mouse found that he was not the only one having this problem, and a wizard from a country far away had created a tool called <a href="http://www.seccubus.com" target="_blank">Seccubus</a> to help organise all the possible problems. This tool was very helpful to the little mouse, and his efficiency went up a lot.

However, the lizard's company was getting bigger and bigger, and the owls who governed the forest demanded more and more of the lizard to proof that he was running his company as he should. This increased the workload for the mouse too, possible machine problems needed to be registered so that decisions regarding what to do with those possible issues could be given to the owls, if the need would arise.

The company already had a tool that they used a lot during the creation process of machines; that tool was also used to register problems that the customers that used the machines ran into.

The mouse figured that this might be a great place to also handle the issues he found, after all the system was already widely in use within the lizard's company and the machine creators were already used to working with it. This tool was called <a href="https://www.atlassian.com/software/jira" target="_blank">Jira</a>.

However as far and wide as the mouse searched, no one had made something to make the findings tool Seccubus interact with Jira. A little sad, and disappointed the mouse then started to figure things out on his own. Both tools had excellent interfaces for other programs to talk to. So the mouse figured that all that would be required is to make yet another tool that would sit between Seccubus and Jira and that would make them interact.

Thus, the mouse created a tool called <a href="https://github.com/Ar0xA/jiraLinkSeccubus" target="_blank">jiraLinkSeccubus</a>, and there was much rejoicing (mostly by the mouse).

And the mouse lived happily ever after.

The end.

**How it works**

Findings are imported into Seccubus. jiraLinkSeccubus will look for all NEW findings of a specific workspace and create tickets in Jira, using its API. That is, unless alwaysMakeJiraLink is set to True, then it will always create a link if there is none, no matter the status of the finding in Seccubus. Then in Seccubus, the findings comment field will be updated so that jiraLinkSeccubus knows where to find the information in Jira.

This means, that if you lose the information in the comment field, the application will be unable to link the finding to Jira. You can of course manually add the link; using the correct format, it's only text after all.

jiraLinkSeccubus will only update the issue status of the Seccubus finding *once* per scan, but every time you run jiraLinkSeccubus it will update the Seccubus comment field with the most recent Jira status, even if it's the same.

**caveat**

I am by no means a programmer. I added some checks and error handling, but chances are it might bugger up here and there. Because it's only text on Seccubus side, it's usually easy to fix though. If you find any issues feel free to issue a Pull request with a fix.

**Why not implement this in Seccubus?**

The reason is twofold:

* Seccubus mostly uses Perl. I do not really like Perl. While I have done pull requests to Seccubus for changes. I rather do it in Python.

* There is a big UI rewrite happening in Seccubus. I did not get any feedback on the status, ETA's or things like that. So I figured it might be easier to just make it and be done with it.

