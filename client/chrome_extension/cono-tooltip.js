var tag_template = $('<div class="cono-tag"></div>')
		.click(e => {
			// TODO: send tag add/remove to backend
			$(e.target).toggleClass('cono-personal');
		});

var testData = {
	tags: {
		'good': { count: 3, personal: true },
		'bad': { count: 10, personal: false }, // note: "personal" property is optional, and defaults to false
		'clickbait': { count: 2, personal: true },
		'funny': { count: 1, personal: false }
	}
};

function testGet () {
	return new Promise(resolve => resolve(testData));
}

// initializes and adds click listeners to a tooltip
function initTooltip(element) {
	element.find('.cono-add').click(e => {
		// TODO: send tag addition to backend
		$(e.target).toggleClass('cono-adding');
		element.find('.cono-add-dialogue').toggleClass('cono-adding');
	});

	// $.get(cono_url, { url: cono_url })
	testGet() // test using local data
	.then(({tags}) => {
		Object.entries(tags).forEach(([tag, {count, personal = false}]) => {
			tag_template
				.clone(true) // clone template with event handlers
				.text(tag + ' | ' + count)
				.toggleClass('cono-personal', personal)
				.prependTo( element.find('.cono-tooltip') );
		});
	});
}
