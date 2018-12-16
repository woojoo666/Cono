var pages = {
	login: {
		html: 'login.html',
		onloadFn: login_onloadFn // defined in login.js
	},
	main: {
		html: 'main.html',
		onloadFn: main_onloadFn
	}
}

function pageLoader(page) {
	$('.page-container').load(page.html, page.onloadFn);
}

var username;

// unified message reciever
function onMessage(request) {
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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var response = onMessage(request);
	if (response) sendResponse(response);
});

// unified message sender
// routes responses through the global receiver "onMessage" as well as the response callback
// this is necessary because, unlike content scripts, extension popups can't receive direct
// messages from the background script, so if we want requests (eg 'popup_init') to update
// data (eg 'username') through the same mechanism as message receivers (eg 'login_updated'),
// we have to use this workaround.
function sendMessage(msg, responseFn) {
	chrome.runtime.sendMessage(msg, response => {
		if (!response) return;
		onMessage(response);
		if (responseFn) responseFn(response);
	});
}

sendMessage({ action: 'popup_init' });
