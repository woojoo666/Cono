function login_onloadFn () {
	$('button.sign-in').click(() => {
		console.log($('input.username').val());
	});
}
