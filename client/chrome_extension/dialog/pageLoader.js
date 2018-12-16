var pages = {
	login: {
		html: 'login.html',
		onloadFn: login_onloadFn // defined in login.js
	},
	main: {
		html: 'main.html',
		onloadFn: () => console.log('main page loaded') // TODO: replace this with a real function
	}
}

function pageLoader(page) {
	$('.page-container').load(page.html, page.onloadFn);
}

var username;

function updateLogin(info) {
	if (info.username) {
		username = info.username;
		pageLoader(pages.main);
	} else {
		pageLoader(pages.login);
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	switch (request.action) {
		case "login_updated":
			updateLogin(request);
			break;
	}
});

chrome.runtime.sendMessage({ action: 'popup_init' }, function (response) {
		updateLogin(response);
	});
