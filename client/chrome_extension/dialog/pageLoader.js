var pages = {
	login: {
		html: 'login.html',
	},
}

function pageLoader(page) {
	$('.page-container').load(page.html)
}

pageLoader(pages.login);
