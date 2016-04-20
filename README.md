# inView
A library that tells if an HTML element is in view or not.
Requires jQuery.

	// This fires when inView is checked.
	// inView is checked when the browser is scrolling or resizing
	// or MOS.inView.check(); is called.
	$(document).on('MOS.inViewCheck', function(e) {
		console.log(e.states); //Returns an object with arrays of jQuery objects, split into visible, not visible elements and close to visible.
	});

	//Debug trace ON.
	MOS.inView.doTrace = true;

	// To check for elemnts ouside of the viewport you can increas outOfBoundsSize. Default is 1. 2 is 100% extra to the view port
	MOS.inView.outOfBoundsSize = 2;

	//Add item to check
	MOS.inView.add($('.item'));

	//Run check
	MOS.inView.check();

##License
License http://opensource.org/licenses/MIT

Copyright (c) Mattias Johansson 2016
