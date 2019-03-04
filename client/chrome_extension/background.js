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

var cono_url = 'http://144.202.18.51:5000';
var get_tags_endpoint = cono_url+'/read-tag-counts';
var add_tags_endpoint = cono_url+'/write';

// TODO: we need to split all message passing into two categories:
// 1. regular message passing, just request and response
// 2. state management, involving requests (eg 'popup_init'), updates (eg 'login'), and broadcasts (eg 'login_updated').

// TODO: return false if not sending a response
// return true if sending a response asynchronously (see https://stackoverflow.com/questions/20077487/)
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
			chrome.tabs.sendMessage(sender.tab.id, { action: 'login_updated', username: username }, response => {
				console.log(response);
			});
			break;
		case 'toggle-tooltips':
			// tells the current tab/page to toggle tagging
			getCurrentTab( tab => chrome.tabs.sendMessage(tab.id, {action: 'toggle-tooltips'}) );
			break;
		case 'get-tooltips-enabled':
			// when popup asks if tooltips is enabled, forward the request to content script, then send the response back to popup
			getCurrentTab( tab => {
				chrome.tabs.sendMessage(tab.id, {action: 'get-tooltips-enabled'}, response => sendResponse(response) )
			});
			return true; // return true to indicate that we are sending a response asynchronously
		case 'get_tags':
			getTags(request.url)
				.then(response => sendResponse(response))
				.catch(error => {
					// note: we can't send the raw error object back, so we report the error here, and send a custom error object in the response
					console.log(error);
					sendResponse({result: 'Fail', errorMessage: 'Error getting tags for ' + request.url + '. Check background script log for more details'})
			});
			return true; // return true to indicate that we are sending a response asynchronously
		case 'add_tag':
			addTag(request.url, request.tag)
				.then(response => sendResponse(response))
				.catch(error => {
					// note: we can't send the raw error object back, so we report the error here, and send a custom error object in the response
					console.log(error);
					sendResponse({result: 'Fail', errorMessage: 'Error adding tag ' + request.tag + ' for ' + request.url + '. Check background script log'})
			});
			return true; // return true to indicate that we are sending a response asynchronously
	}
	sendResponse(response);
});

// necessary for extension popup to figure out its parent tab
function getCurrentTab(callback) {
	// TODO: should I use "lastFocusedWindow: true" or "currentWindow: true"?
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
		var tab = tabs[0];
		if (!tab) {
			console.log('Error: no current active tab??');
			return;
		}
		// var url = tabs[0].url;
		callback(tab);
	});
}

// broadcast to all tabs
function broadcast(msg, responseFn) {
	console.log('broadcast: ' + msg.action);
	chrome.extension.sendMessage(msg, responseFn);
	chrome.tabs.query({}, function (tabs) {
		tabs.forEach(tab => {
			chrome.tabs.sendMessage(tab.id, msg, responseFn);
		});
	});
}

function removeTag (url, tag) {
	// TODO
}

function addTag (url, tag) {
	return postrequest(add_tags_endpoint, { username, url, tag });
}

function getTags (url) {
	return getrequest(get_tags_endpoint, { username, url });
}

// sends a GET request with query params, returns a Promise
function getrequest(url, params) {
	var urlObj = new URL(url);
	Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]))
	return fetch(urlObj).then(response => response.json());
}

// sends a POST request, returns a Promise
function postrequest(url, data) {
	var urlEncoded = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
	return fetch(url, {
		method: 'POST',
		body: urlEncoded,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
	}).then(response => response.json());
}
