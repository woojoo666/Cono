function login_onloadFn () {
	$('button.sign-in').click(() => {
		var username = $('input.username').val();
		chrome.runtime.sendMessage({ action: "login", username: username },
			function (response) {
				if (response.invalid_login) {
					console.log("invalid login");
					// TODO: alert user about the login failure, using some element on the login dialog
				}
				console.log(response);
			});
	});
}
