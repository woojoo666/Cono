// initializes and adds click listeners to a tooltip
function initTooltip(element) {
	element.find('.cono-add').click(e => {
		$(e.target).toggleClass('cono-adding');
		element.find('.cono-add-dialogue').toggleClass('cono-adding');
	});

	var tagButtons = element.find('.cono-tag').click((e) => {
		$(e.target).toggleClass("cono-personal");
	});
}
