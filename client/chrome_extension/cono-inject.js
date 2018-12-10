var redBox = document.createElement('div');
redBox.innerHTML = "CONO";

// styling
redBox.style.position = 'fixed';
redBox.style.left = 0;
redBox.style.top = 0;
redBox.style.width = '100px';
redBox.style.height = '100px';
redBox.style.zIndex = 100;
redBox.style.backgroundColor = 'red';
redBox.style.color = "white";

document.body.appendChild(redBox);

//code to send message to open notification. This will eventually move into my extension logic
chrome.extension.sendMessage("test", (response) =>{
	console.log(response);
});
