pages.main.init = function () {
	$('.sign-out').click((e) => {
		sendMessage({ action: 'sign_out' });
	});
	$('#username').text(username);
	var toggleButton = $('.toggle-tooltips');

	function updateToggleButton() {
		sendMessage({action: 'get-tooltips-enabled'}, response => {
			toggleButton.toggleClass('enabled', response.tooltips_enabled); // enable class based on response
			$('.caption').text( response.tooltips_enabled ? 'Tag Tooltips Enabled' : 'Tag Tooltips Disabled' );
		});
	}

	toggleButton.click(function (e) {
		sendMessage({ action: 'toggle-tooltips' });

		updateToggleButton();
	});

	updateToggleButton();
}
