var pages = {
	login: {
		html: 'login.html',
		js: 'login.js',
		init: null // bound in login.js
	},
	main: {
		html: 'main.html',
		js: 'main.js',
		init: null // bound in main.js
	},
}

function loadScript(file, onload) {
	var scriptEl = document.createElement('script');
	scriptEl.type = 'text/javascript';
	scriptEl.src = file;
	scriptEl.onload = onload;
	document.body.appendChild(scriptEl);
}

function pageLoader(page) {
	$('.page-container').load(page.html, () => {
		if (!page.init) // if init function undefined, the script needs to be loaded first
			loadScript(page.js, () => page.init()); // after page.js is loaded, call page.init
		else
			page.init(); // js is already loaded, call init
	});
}

var username;

// unified message reciever
function onMessage(request, sendResponse) {
	console.log(request);
	switch (request.action) {
		case "login_updated":
			if (request.username) {
				username = request.username;
				pageLoader(pages.main);
			} else {
				pageLoader(pages.login);
			}
			break;
	}
}

// routes broadcasts to unified message receiver
// TODO: return false if not sending a response
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	onMessage(request, sendResponse);
});

// unified message sender
// routes responses through the global receiver "onMessage" as well as the response callback
// this is necessary because, unlike content scripts, extension popups can't receive direct
// messages from the background script, so if we want requests (eg 'popup_init') to update
// data (eg 'username') through the same mechanism as message receivers (eg 'login_updated'),
// we have to use this workaround.
function sendMessage(msg, responseFn) {
	chrome.runtime.sendMessage(msg, response => {
		if (response == undefined) return;
		onMessage(response);
		if (responseFn) responseFn(response);
	});
}

sendMessage({ action: 'popup_init' });
