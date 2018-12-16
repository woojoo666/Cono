// chrome.runtime.onConnect.addListener(function(port) {
// 	console.log('Port ' + port.name + ' connected');

// 	port.onMessage.addListener(function(msg) {
// 		console.log('Received message with action: ' + msg.action);
// 		if (msg.action == 'getDeviceSessions') {
// 			chrome.sessions.getDevices(function (devices) {
// 				port.postMessage({action: 'sendDeviceSessions', data: {devices: devices}});
// 			});
// 		}
// 	});
// });

var username = null;

// TODO: we need to split all message passing into two categories:
// 1. regular message passing, just request and response
// 2. state management, involving requests (eg 'popup_init'), updates (eg 'login'), and broadcasts (eg 'login_updated').

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	var response;
	switch (request.action) {
		case 'login':
			if (request.username) {
				username = request.username;
				broadcast({ action: 'login_updated', username: username });
				response = {};
			} else {
				response = { invalid_login: true };
			}
			break;
		case 'sign_out':
			username = null;
			broadcast({ action: 'login_updated', username: username }); // use empty login info to indicate signed out
			break;
		case 'popup_init':
			response = { action: 'login_updated', username: username };
			break;
		case 'content_script_init':
			chrome.tabs.sendMessage(sender.tab.id, { action: 'login_updated', username: username }, function(response) {
				console.log(response);
			});
			break;
	}
	sendResponse(response);
});

// broadcast to all tabs
function broadcast(msg, responseFn) {
	console.log('broadcast: ' + msg.action);
	chrome.extension.sendMessage(msg, responseFn);
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		tabs.forEach(tab => {
			chrome.tabs.sendMessage(tab.id, msg, responseFn);
		});
	});
}
