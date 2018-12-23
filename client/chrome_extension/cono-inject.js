var tooltip_template = $(`<div>
<div class="cono-tooltip">
	<div class="cono-tag cono-personal">Foo</div>
	<div class="cono-tag">Bar</div>
	<div class="cono-tag cono-personal">Baz</div>
	<div class="cono-tag">Zed</div>
	<div class="cono-add"></div>
	<div class="cono-add-dialogue">
		<input type="text"/>
		<div>press enter to add</div>
	</div>
</div>
</div>`);

// TODO: the arrow looks ugly. Instead, we should always have the tooltip display above the link,
//       so we can get rid of the arrow.
tippy.setDefaults({
	interactive: true,
	theme: "cono",
	hideOnClick: "false",
	arrow: true,
	arrowType: 'round',
	interactiveDebounce: 100, // doesn't seem to fix tooltip closing sometimes on clicks
});

var username;
var cono_url = '144.202.18.51:5000';

var tippyCollection = null;

function createTooltips () {
	// For every "reference" element, tippy will create a "tippy instance", a clone of our tooltip object.
	// We need to initialize each one of these clones. Because each tippy instance is lazily created (see Tippy docs),
	// we wait until the first time it is shown before initializing it.
	tippyCollection = tippy('a',  { content: tooltip_template.html(), onMount: (tippyInstance) => {
			var element = $(tippyInstance.popper);
			if (!element.hasClass('cono-tooltip-initialized')) {
				initTooltip(element); // defined in cono-tooltip.js

				// add a tag to prevent it from being initialized multiple times
				element.addClass('cono-tooltip-initialized');
			}
		},
	});
};

//code to send message to open notification. This will eventually move into my extension logic
chrome.extension.sendMessage("test", (response) =>{
	console.log(response);
});

chrome.extension.sendMessage({ action: 'content_script_init' });

// TODO: return false if not sending a response
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	switch (request.action) {
		case 'login_updated':
			if (request.username) {
				username = request.username;
				console.log('username set to ' + username);
			} else { // signed out
				// TODO: when signing out, disabled all tooltips across all tabs, because they are user-dependent
				console.log('signed out');
			}
			break;
		case 'toggle-tooltips':
			if (tippyCollection) {
				tippyCollection.destroyAll();
				tippyCollection = null;
			} else {
				createTooltips();
			}
			break;
		case 'get-tooltips-enabled':
			sendResponse({ tooltips_enabled: (tippyCollection != null) });
			break;
	}
});
