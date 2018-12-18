pages.main.init = function () {
	$('button.sign-out').click((e) => {
		sendMessage({ action: 'sign_out' });
	});
	$('#username').text(username);
	var toggleButton = $('button.toggle-tooltips');

	function updateToggleButton() {
		toggleButton.text( toggleButton.hasClass('tooltips-enabled') ? 'Tagging Enabled' : 'Tagging Disabled' );
	}

	toggleButton.click(function (e) {
		sendMessage({ action: 'toggle-tooltips' });

		// TODO: this is a hack. Should depend on the actual state of the current tab/page.
		toggleButton.toggleClass('tooltips-enabled');
		updateToggleButton();
	});

	updateToggleButton();
}
