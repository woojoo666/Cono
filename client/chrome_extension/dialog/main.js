pages.main.init = function () {
	$('button.sign-out').click((e) => {
		sendMessage({ action: 'sign_out' });
	});
	$('#username').text(username);
	var toggleButton = $('button.toggle-tooltips');

	function updateToggleButton() {
		sendMessage({action: 'get-tooltips-enabled'}, response => {
			toggleButton.toggleClass('tooltips-enabled', response.tooltips_enabled); // enable class based on response
			toggleButton.text( response.tooltips_enabled ? 'Tag Tooltips Enabled' : 'Tag Tooltips Disabled' );
		});
	}

	toggleButton.click(function (e) {
		sendMessage({ action: 'toggle-tooltips' });

		updateToggleButton();
	});

	updateToggleButton();
}
