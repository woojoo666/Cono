// initializes and adds click listeners to a tooltip
function initTooltip(element) {
	element.querySelector('.cono-add').addEventListener("click", (e) => {
		e.target.classList.toggle('cono-adding');
		element.querySelector('.cono-add-dialogue').classList.toggle('cono-adding');
	});

	var tagButtons = element.querySelectorAll('.cono-tag');
	for (var i = 0; i < tagButtons.length; i++) {
		tagButtons[i].addEventListener("click", (e) => {
			e.target.classList.toggle("cono-personal");
		});
	}
}
