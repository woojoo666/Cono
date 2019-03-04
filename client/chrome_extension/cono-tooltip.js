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
			if (tagObjs[tag] && tagObjs[tag].user_tagged) {
				// already user tagged
				// TODO: flash the tag to show the user that it was already tagged.
				finish();
				return;
			}

			addTag(link, tag)
				.then(() => { // success, tag added
					if (tagObjs[tag]) {
						if (tagObjs[tag].user_tagged) {
							// this case should have been handled already, we shouldn't ever reach this code block
							throw "this code block should not be run, figure out how we got here";
						} else {
							tagObjs[tag].count++;
							tagObjs[tag].user_tagged = true;
							tagObjs.refresh();
						}
					} else {
						createTagObject(tag, 1, true);
					}
					finish();
				})
				.catch(error => console.log(error));

			function finish() {
				// close text input dialog
				element.find('.cono-add').removeClass('cono-adding');
				element.find('.cono-add-dialogue').removeClass('cono-adding');
			}
		}
	})

	var tagObjs = {};

	//testGet(link) // test using local data
	getTags(link)
	.then(tags => {
		Object.entries(tags).forEach(([tag, {count, user_tagged = false}]) => createTagObject(tag, count, user_tagged));
	});

	function createTagObject(tag, count, user_tagged) {
		// TODO: maybe this should be a class
		var me = { count, user_tagged };
		tagObjs[tag] = me;

		me.elem =
			tag_template
				.clone(true) // clone template with event handlers
				.click(() => me.toggle())
				.prependTo( element.find('.cono-tooltip') );

		me.toggle = function () {
			console.log("toggle tag");
			var promise = this.user_tagged ? removeTag(link, tag) : addTag(link, tag);
			promise.then(() => {
				// if the promise succeeds, the tag was toggled
				this.user_tagged = !this.user_tagged;
				if (this.user_tagged) {
					this.count++;
				} else {
					this.count--;
				}
				this.refresh();
			}).catch(error => console.log(error));
		}

		me.refresh = function () {
			this.elem
				.text(tag + ' | ' + this.count) // update text
				.toggleClass('cono-user-tagged', this.user_tagged);
		}

		me.refresh(); // initialize element
	}
}
