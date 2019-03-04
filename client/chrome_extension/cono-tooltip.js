var tag_template = $('<div class="cono-tag"></div>');

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
			if (response.result && response.result == 'Fail') throw new Error(response.errorMessage);
			else resolve(response);
		});
	});
}

function addTag(url, tag) {
	return new Promise((resolve, reject) => {
		chrome.extension.sendMessage({action: 'add_tag', url, tag}, response => {
			if (response.result && response.result == 'Fail') throw new Error(response.errorMessage);
			else resolve(response);
		});
	});
}

function removeTag(url, tag) {
	return Promise.reject(new Error('remove tag not implemented'));
}

// initializes and adds click listeners to a tooltip
function initTooltip(element, link) {
	element.find('.cono-add').click(e => {
		// TODO: send tag addition to backend
		$(e.target).toggleClass('cono-adding');
		element.find('.cono-add-dialogue').toggleClass('cono-adding');
	});

	element.find('.cono-add-dialogue input').keypress(e => {
		if (e.key == 'Enter') {
			var tag = $(e.target).val();
			console.log('unimplemented: add tag ' + tag);
			// TODO: notice that the tag might already exist in the tag list
			// best way might be to just refresh the whole tag list
		}
	})

	//testGet(link) // test using local data
	getTags(link)
	.then(tags => {
		Object.entries(tags).forEach(([tag, {count, user_tagged = false}]) => {
			tag_template
				.clone(true) // clone template with event handlers
				.text(tag + ' | ' + count)
				.toggleClass('cono-user-tagged', user_tagged)
				.click(e => {
					var elem = $(e.target);
					var promise = user_tagged ? removeTag(link, tag) : addTag(link, tag);
					promise.then(() => {
						// if the promise succeeds, the tag was toggled
						user_tagged = !user_tagged;
						if (user_tagged) {
							count++;
						} else {
							count--;
						}
						elem.text(tag + ' | ' + count) // update text
						elem.toggleClass('cono-user-tagged', user_tagged);
					}).catch(error => console.log(error));
				})
				.prependTo( element.find('.cono-tooltip') );
		});
	});
}
