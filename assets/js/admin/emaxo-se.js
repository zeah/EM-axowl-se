(function() {

	var qs = function(d) { return document.querySelector(d) } 
	var qsa = function(d) { return document.querySelectorAll(d) } 

	var hideAll = function() {
		try {
			var arr = qsa('.em-settings');
			for (var i = 0; i < arr.length; i++)
				arr[i].classList.add('em-hidden');

			var arr = qsa('.em-settings-anchor');
			for (var i = 0; i < arr.length; i++)
				arr[i].classList.remove('em-settings-anchor-active');

		} catch (e) {}
	}

	try {

		qs('.em-settings-anchor-name').addEventListener('click', function(e) {
			hideAll();
			qs('.em-settings-name').classList.remove('em-hidden');
			e.target.classList.add('em-settings-anchor-active');
		});

		qs('.em-settings-anchor-data').addEventListener('click', function(e) {
			hideAll();
			qs('.em-settings-data').classList.remove('em-hidden');
			e.target.classList.add('em-settings-anchor-active');
		});

		qs('.em-settings-anchor-input').addEventListener('click', function(e) {
			hideAll();
			qs('.em-settings-input').classList.remove('em-hidden');
			e.target.classList.add('em-settings-anchor-active');
		});

		// qs('.em-settings-anchor-ab').addEventListener('click', function(e) {
		// 	hideAll();
		// 	qs('.em-settings-ab').classList.remove('em-hidden');
		// 	e.target.classList.add('em-settings-anchor-active');
		// });

		qs('.em-settings-anchor-popup').addEventListener('click', function(e) {
			hideAll();
			qs('.em-settings-popup').classList.remove('em-hidden');
			e.target.classList.add('em-settings-anchor-active');
		});


		// var n = qsa('.em-settings');

		// for (var i = 0; i < n.length; i++)

		// qs('.em-settings-name').style.backgroundColor = 'pink';
		// 
	} catch (e) {}


})();