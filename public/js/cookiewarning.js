/////////////////////////////////////////////////////////////
//
// Author Scott Herbert (www.scott-herbert.com)
//		  Dimitri Kourkoulis (http://dimitros.net/en/home)
//
// Version History 
// 1 (10-Feb-2013) Inital release on to GitHub.
//
// 2 (12-Mar-2013) Small modification by Dimitri Kourkoulis.
//    This version of the script, keeps visitors on the web site
//    if they decline the use of cookies. However, in that event,
//    the cookie stored in their browser is named 'jsNoCookieCheck'
//    instead of 'jsCookieCheck'. This can be used by the software
//    and/or CMS of the web site to disable cookie producing content.
//    An example of how this has been used in one case on the Umbraco
//    CMS can be found here: 
//    http://dimitros.net/en/blog/complyingwiththecookielaw    
// 
// 3 (03-April-2013) SAH - Added a variable that allows the developer to 
//	  select if the script redirects (as it originally did) or carry?s
//    on (as per Dimitri?s great addition).
// 
// Download from http://adf.ly/IvElY

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}


function displayNotification(c_action) {

    // this sets the page background to semi-transparent black should work with all browsers
    var message = "<div id='cookiewarning' >";

    // center vert
    message = message + "<div style='text-align:center;margin:0px;padding:10px;padding-left:20rem;width:auto;background:#EE6363;color:black;font-size:90%;'><div class='leftimg'><img src='/public/images/giphy.gif'></div>";

    // this is the message displayed to the user.
    message = message + "This site uses <b>heavy sarcasm</b>, talks about imaginary friends and things that never happened or even might be physically possible. <br />If you are too much of a sissy to handle that, I prefer would prefer if you just go somewhere else <br />and click the \"I don't agree\" button. <br /> <br />Oh, also this site uses cookies: <br />In order for it to work correctly, we store a small file (called a cookie) on your computer. <br /> If you click \"I agree\" below we will create the cookies all is well. If you click on \"I don't agree\" we will send you on your merry way..far, VERY far away from here.<br />";

    // Displays the I agree/disagree buttons.
    // Feel free to change the address of the I disagree redirection to either a non-cookie site or a Google or the ICO web site 
    message = message + "<br /><INPUT TYPE='button' VALUE='I Agree' onClick='JavaScript:doAccept();' /> <INPUT TYPE='button' VALUE=\"I don't agree\" onClick='JavaScript:doNotAccept("
	message = message + c_action;
	message = message + ");' />";

    // and this closes everything off.
    message = message + "</div></div>";

    document.writeln(message);
}

function doAccept() {
    setCookie("ILoveAr0xA", null, 365);
    location.reload(true);
}

function doNotAccept(c_action) {

	if (c_action == 1) {
        alert("You didn't want sarcasm or tracking cookies #sadpanda is sad. Hope you have more fun somewhere else.");
		window.location.replace("http://www.wikihow.com/Have-Fun-with-Grandma");
	} else {
		window.location.replace("http://www.wikihow.com/Have-Fun-with-Grandma");
	}
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString() + "; path=/");
    document.cookie = c_name + "=" + c_value;    
}

function checkCookie(c_action) {

    var cookieName = "ILoveAr0xA";
    var cookieChk = getCookie(cookieName);
    if (cookieChk != null && cookieChk != "") {
        // the jsCookieCheck cookie exists so we can assume the person has read the notification
        // within the last year and has accepted the use of cookies
        setCookie(cookieName, cookieChk, 365); // set the cookie to expire in a year.
    }
    else {
        // No cookie exists, so display the lightbox effect notification.
        displayNotification(c_action);
    }
}

// blockOrCarryOn - 1 = Carry on, store a do not store cookies cookie and carry on
//					0 = Block, redirect the user to a different website (google for example)
var blockOrCarryOn = 1;
checkCookie(blockOrCarryOn);
