/****************************************************

/global/javascript/footer.js:

Contains generic functions of use to multiple pages. Must be placed at the BOTTOM of the page. For now it
automates popup creation when a link has a class of:
*	shopLocator - when clicking on the T[Life] shop locator link (telstra.com.au/shoplocator)
*	externalSite - when linking to a non-Telstra site
*	popupDocument - when linking to a document (e.g., a PDF) which should open in a new window
*	popupInfo - a small dialogue-like info box
*	internalFaq - links to Help Centre content
*	popupAppLarge - apps that require a large (near-fullscreen) screen area
*	popupAppMid - apps requiring a smaller popup

DATE:  	2008-10-14
AUTHOR:	d317834

REFERENCES:
1.	http://www.howtocreate.co.uk/tutorials/javascript/domevents
2.	http://snipplr.com/view/3561/addclass-removeclass-hasclass/
3.	http://www.quirksmode.org/dom/w3c_events.html
4.	http://www.telstra.com.au/standards/docs/pop_ups_v3.doc
5.	http://simon.incutio.com/archive/2004/05/26/addLoadEvent

CHANGELOG:
14/10/2008 (d317834):
*	v. 1.0
20/10/2008 (d317834):
*	Now adds title attribute to link (if none exists), advising that it opens in a new window.
*	Minor performance enhancements.
09/12/2008 (d317834):
*	Fixed bug for when the link had child nodes (e.g., <a><img /></a>).
*	Fixed bug to use window.outer[Width/Height] instead of erroneous document.body.client[Width/Height].
*	Now handles the dubiously coded tabbed interface JavaScript (/global/javascript/tabs.js).
03/02/2009 (d317834):
*	Switched from window.outer[Width/Height] to window.screen.avail[Height/Width].

*****************************************************/


/*****************************************************
makeExternalLinksSpawnPopUps() - main function that modifies the links if required
******************************************************/
function makeExternalLinksSpawnPopUps() {
	var a = document.getElementsByTagName('a'), msg = 'Opens in new window';
	for(var i=0, linkCount=a.length;i<linkCount;i++) {
		     if(hasClass(a[i], 'shopLocator'))   {addEventToLink(a[i], function(e) {autoPopUp(e, 'shopLocator')});   addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'popupChat'))     {addEventToLink(a[i], function(e) {autoPopUp(e, 'popupChat')});     addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'externalSite'))  {addEventToLink(a[i], function(e) {autoPopUp(e, 'externalSite')});  addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'popupDocument')) {addEventToLink(a[i], function(e) {autoPopUp(e, 'popupDocument')}); addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'popupInfo'))     {addEventToLink(a[i], function(e) {autoPopUp(e, 'popupInfo')});     addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'internalFaq'))   {addEventToLink(a[i], function(e) {autoPopUp(e, 'internalFaq')});   addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'popupAppLarge')) {addEventToLink(a[i], function(e) {autoPopUp(e, 'popupAppLarge')}); addTitleToLink(a[i], msg);}
		else if(hasClass(a[i], 'popupAppMid'))   {addEventToLink(a[i], function(e) {autoPopUp(e, 'popupAppMid')});   addTitleToLink(a[i], msg);}
	}
}


/*****************************************************
hasClass() - returns true if the object has the class given.
******************************************************/
function hasClass(objectToTest, className) {
	var result = false;
	if(typeof(objectToTest)=='object') {
		// An object, so continue
		result = objectToTest.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)')); // [Ref 2]
	}
	return result;
}


/*****************************************************
addEventToLink() - adds the event to the link using whatever method it will accept.
******************************************************/
function addEventToLink(oLink, functionToAdd) {
	if(oLink.addEventListener) {
		// Standards-compliant
		oLink.addEventListener('click', functionToAdd, false);
	}
	else if(oLink.attachEvent) {
		// Old IE
		oLink.attachEvent('onclick', functionToAdd);
	}
}


/*****************************************************
addNewWindowTitleToLink() - adds a title to a link (so long as there isn't one already) saying it opens in a new window.
******************************************************/
function addTitleToLink(oLink, msg) {
	if(typeof(oLink.title)!='string' || oLink.title=='') {
		// Title doesn't exist or it's blank, so overwrite
		oLink.title=msg;
	}
}


/*****************************************************
openLinkInNewWindow() - often dynamically added. Returns false in case it's called directly (i.e., onclick="return openLinkInNewWindow(...);").
******************************************************/
function openLinkInNewWindow(url, linkType) {
	var // Defaults
		width=300, height=200, menubar='yes', status='yes', location='yes', toolbar='yes', scrollbars='yes', resizable='yes';
	var	// Maximum values (to constrain windows to usable sizes)
		maxWidth = Math.round(Math.max(width, (window.screen.availWidth) * 0.8)),
		maxHeight = Math.round(Math.max(height, (window.screen.availHeight) * 0.8));
	switch(linkType) {
		// Need only set height & width and any properties that aren't yes
		case 'shopLocator':
			// Shop locator window has set dimensions (not yet constrained to window dimensions)
			width = 810;
			height = 500;
			break;
		case 'popupChat':
			// The "Chat online to a consultant" window; it gets resized anyway, so **none of the variables need changing**
			break;
		case 'externalSite':
			// External sites get a fullsize window
			width = maxWidth;
			height = maxHeight;
			break;
		case 'popupDocument':
			// Documents (e.g., PDFs) get a fullsize window without any chrome
			width = maxWidth;
			height = maxHeight;
			menubar = 'no'; status = 'no'; location = 'no'; toolbar = 'no'; scrollbars = 'no';
			break;
		case 'popupInfo':
			height = 200;
			width = 350;
			menubar = 'no'; status = 'no'; location = 'no'; toolbar = 'no';
			break;
		case 'internalFaq':
			width = Math.min(800, maxWidth);
			height = maxHeight;
			menubar='no'; status='no'; location='no'; toolbar='no';
			break;
		case 'popupAppLarge':
			// Internal applications get a near-chromeless experience
			width = maxWidth;
			height = maxHeight;
			menubar = 'no'; location = 'no'; toolbar = 'no';
			break;
		case 'popupAppMid':
			width=Math.min(maxWidth, 600);
			height=Math.min(maxHeight, 500);
			menubar='no'; location='no'; toolbar='no';
			break;
	}
	window.open(url,'newWindow','width='+width+',height='+height+',menubar='+menubar+',status='+status+',location='+location+',toolbar='+toolbar+',scrollbars='+scrollbars+',resizable='+resizable);
	return false;
}


/*****************************************************
autoPopUp() - open link in new window (for standard links)
******************************************************/
function autoPopUp(e, linkType) {
	var url = typeof(e.target)=='object' ? e.target : e.srcElement;		// The href="..." value (to deal with IE's non-standard behaviour)
	var doPopup = true;
	while(url.nodeName.toLowerCase() != "a") {
		// Click was on a child node of the link, e.g., an img within a link.
		// This resolves the problems with event bubbling.
		url=url.parentNode;
		if(url.nodeName.toLowerCase() == 'body') {
			doPopup = false; // Don't bother doing the popup - it will fail
			break;
		}
	}
	// Open the new window, but only if the function doesn't seem to have failed (just a precaution).
	if(doPopup) {
		openLinkInNewWindow(url, linkType);
		// Prevent default behaviour [Ref 1]
		if (typeof e.preventDefault == 'function') { e.preventDefault(); }	// Standards-compliant
		else { e.returnValue = false; }                                   	// IE
	}
}


/*****************************************************
Now run the function.
******************************************************/
/* This is to counter the function in /global/javascript/tabs.js which would otherwise prevent the code from working */
function addLoadEventForPopUps(func) {	// Ref [5]
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	}
	else {
		window.onload = function() {
			if (oldonload) {
			    oldonload();
			}
			func();
		}
	}
}
if(typeof addLoadEventForTabs=='function') {
	addLoadEventForPopUps(makeExternalLinksSpawnPopUps);
}
else {
	makeExternalLinksSpawnPopUps();
}