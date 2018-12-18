pages.main.init = function () {
	$('button.sign-out').click((e) => {
		sendMessage({ action: 'sign_out' });
	});
}
