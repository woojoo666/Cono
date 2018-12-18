var tooltip = document.createElement('div');
tooltip.innerHTML = `
<div class="cono-tooltip">
	<div class="cono-tag cono-personal">Foo</div>
	<div class="cono-tag">Bar</div>
	<div class="cono-tag cono-personal">Baz</div>
	<div class="cono-tag">Zed</div>
	<div class="cono-add"></div>
	<div class="cono-add-dialogue">
		<input type="text"/>
		<div>press enter to add<div>
	</div>
</div>
`;

tippy.setDefaults({
	interactive: true,
	theme: "cono",
	hideOnClick: "false",
	arrow: true,
	arrowType: 'round',
	interactiveDebounce: 100, // doesn't seem to fix tooltip closing sometimes on clicks
});

var username;

var tippyCollection = null;

function createTooltips () {
	// For every "reference" element, tippy will create a "tippy instance", a clone of our tooltip object.
	// We need to initialize each one of these clones. Because each tippy instance is lazily created (see Tippy docs),
	// we wait until the first time it is shown before initializing it.
	tippyCollection = tippy(document.querySelectorAll('a'),  { content: tooltip.innerHTML, onMount: (tippyInstance) => {
			var element = tippyInstance.popperChildren.content;
			if (!element.classList.contains('cono-tooltip-initialized')) {
				initTooltip(element); // defined in cono-tooltip.js

				// add a tag to prevent it from being initialized multiple times
				element.classList.add('cono-tooltip-initialized');
			}
		},
	});
};

//code to send message to open notification. This will eventually move into my extension logic
chrome.extension.sendMessage("test", (response) =>{
	console.log(response);
});

chrome.extension.sendMessage({ action: 'content_script_init' });

// TODO: content scripts on background tabs are not receiving messages. Not sure why not.
//       We might have to manually fetch data when tabs are brought back to foreground.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	switch (request.action) {
		case 'login_updated':
			if (request.username) {
				username = request.username;
				console.log('username set to ' + username);
			} else { // signed out
				console.log('signed out');
			}
			break;
		case 'toggle-tooltips':
			if (tippyCollection)
				tippyCollection.destroyAll();
			else
				createTooltips();
			break;
	}
});
