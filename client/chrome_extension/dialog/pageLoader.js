var pages = {
	login: {
		html: 'login.html',
		onloadFn: login_onloadFn // defined in login.js
	},
}

function pageLoader(page) {
	$('.page-container').load(page.html, page.onloadFn);
}

pageLoader(pages.login);
