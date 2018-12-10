var redBox = document.createElement('div');
redBox.innerHTML = "<h3>CONO</h3><p>click to start<p>";

// styling
redBox.style.position = 'fixed';
redBox.style.left = 0;
redBox.style.top = 0;
redBox.style.width = '100px';
redBox.style.height = '150px';
redBox.style.zIndex = 100;
redBox.style.backgroundColor = 'red';
redBox.style.color = "white";

document.body.appendChild(redBox);

redBox.addEventListener("click", (e) => {
	tippy(document.querySelectorAll('a'),  { content: "I'm a tooltip!" });
	redBox.innerHTML = "<p>enabled!</p><p>hover over links to see their tags</p>"
});

//code to send message to open notification. This will eventually move into my extension logic
chrome.extension.sendMessage("test", (response) =>{
	console.log(response);
});
