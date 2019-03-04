var tag_template = $('<div class="cono-tag"></div>')
		.click(e => {
			// TODO: send tag add/remove to backend
			$(e.target).toggleClass('cono-user-tagged');
		});

var testData = {
	'good': { count: 3, user_tagged: true },
	'bad': { count: 10, user_tagged: false }, // note: "user_tagged" property is optional, and defaults to false
	'clickbait': { count: 2, user_tagged: true },
	'funny': { count: 1, user_tagged: false }
};

function testGet (url) {
	return new Promise(resolve => resolve(testData));
}

function getTags(url) {
	return new Promise((resolve, reject) => {
		chrome.extension.sendMessage({action: 'get_tags', url}, response => {
			if (response.error) throw new Error(response.errorMessage);
			else resolve(response);
		});
	});
}

// initializes and adds click listeners to a tooltip
function initTooltip(element, link) {
	element.find('.cono-add').click(e => {
		// TODO: send tag addition to backend
		$(e.target).toggleClass('cono-adding');
		element.find('.cono-add-dialogue').toggleClass('cono-adding');
	});

	//testGet(link) // test using local data
	getTags(link)
	.then(tags => {
		Object.entries(tags).forEach(([tag, {count, user_tagged = false}]) => {
			tag_template
				.clone(true) // clone template with event handlers
				.text(tag + ' | ' + count)
				.toggleClass('cono-user-tagged', user_tagged)
				.prependTo( element.find('.cono-tooltip') );
		});
	});
}
