var redBox = document.createElement('div');
redBox.innerHTML = "<h3>CONO</h3><p>click to start<p>";

// styling
redBox.style.position = 'fixed';
redBox.style.left = 0;
redBox.style.top = 0;
redBox.style.width = '100px';
redBox.style.height = '150px';
redBox.style.zIndex = 100;
redBox.style.backgroundColor = 'red';
redBox.style.color = "white";

document.body.appendChild(redBox);

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

redBox.addEventListener("click", (e) => {
	// For every "reference" element, tippy will create a "tippy instance", a clone of our tooltip object.
	// We need to initialize each one of these clones. Because each tippy instance is lazily created (see Tippy docs),
	// we wait until the first time it is shown before initializing it.
	tippy(document.querySelectorAll('a'),  { content: tooltip.innerHTML, onMount: (tippyInstance) => {
			var element = tippyInstance.popperChildren.content;
			if (!element.classList.contains('cono-tooltip-initialized')) {
				initTooltip(element);

				// add a tag to prevent it from being initialized multiple times
				element.classList.add('cono-tooltip-initialized');
			}
		},
	});

	redBox.innerHTML = "<p>enabled!</p><p>hover over links to see their tags</p>"
});

//code to send message to open notification. This will eventually move into my extension logic
chrome.extension.sendMessage("test", (response) =>{
	console.log(response);
});
