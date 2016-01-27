(function() {

	'use strict';

	const notification = document.querySelector('.notification');
	if (notification) {
		notification.onclick = notification.ontouchend = function() {
			notification.remove();
		};
	}

}());
