---
layout: post
title: Dutch law and responsible disclosure
description: Some thoughts about the responsible disclosure policies and the changes in Dutch law
---

In 2013 the Dutch government published an "Advice for responsible disclosure" (source: (Dutch) <a href="http://www.rijksoverheid.nl/onderwerpen/cybercrime/documenten-en-publicaties/rapporten/2013/01/04/leidraad-om-te-komen-tot-een-praktijk-van-responsible-disclosure.html" target="_blank">leidraad responsible disclosure</a>). The idea is that if whoever finds a bug adheres to the rules of the responsible disclosure policy of whatever entity he is looking at, he or she will not prosecuted by the entity compromised.

We are 2 years further and while some progress has been made as far as companies and government institutions that have a public responsible disclosure policy, it's unclear how effective it really is.

Not going into the policy itself, there is 1 big glaring issue that was brought up almost immediately after its release. Despite having a responsible disclosure policy, it's not binding. The compromised entity is still free to press charges if it feels the need and the Dutch government might still press charges no matter what the entity wants. 

Now my point: the Dutch law will change. This all in preperation of the new European laws regarding protection of data that are being prepared right now. In januari 2016, Dutch companies and institutions will already be required to notify the authority responsible for handling the protection of personal information when a data-leak occurs or is having thought to have occured. (source: (Dutch) <a href="http://www.rijksoverheid.nl/nieuws/2015/07/10/meldplicht-datalekken-en-uitbreiding-boetebevoegdheid-cbp-1-januari-2016-van-kracht.html" target="_blank">www.rijksoverheid.nl</a>)

Currently this institution is called College Bescherming Persoonsgevens (CBP). The new name in 2016 will be: Autoriteit Persoonsgegevens. This institution will then have considerable power and can fine an entity for a considerable amount: € 810.000 or 5% of total global revenue. 

This made me think: how will this new law impact the currently existing responsible disclosure policies? 

My gut instinct would be to think that it's no longer a good idea to have a responsible disclosure policy, mainly because you might be setting yourself up for a big fine even if the researcher adhered to your responsible disclosure policy. I mean, it's still a data-leak in the sense of the law; so you will still need to notify the authority. Not just that, chances are that this authority will actively try to pursue the one who disclosed the vulnerability. 

That means research needs to be done to figure out the exact impact between the new laws and the official responsible disclosure guideline. One big and well known proponent of responsible disclosure, a Dutch journalist called <a href="https://twitter.com/brenno" target="_blank">Brenno de Winter</a> said on Twitter (source: (Dutch) <a href="https://twitter.com/Ar0xA/status/626997956894425088" target="_blank">twitter</a>) that he's busy researching it and writing a book about it's impact. 

All in all, while I personally think the change in the law is fair and just there really needs to be an official responsible disclosure policy, protected by law. This responsible disclosure policy should be made such that it protects both the person finding the vulnerability and the entity it was found. It should allow security researches to safely disclose the vulnerability and the entities so that if they handled the disclosure correctly neither will get prosecuted. 




