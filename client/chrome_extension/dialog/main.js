function main_onloadFn () {
	$('button.sign-out').click((e) => {
		sendMessage({ action: 'sign_out' });
	});
}
