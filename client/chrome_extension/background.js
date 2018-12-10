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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	sendResponse("response");
});
