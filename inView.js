/**
 * Mattias Johansson
 * @author www.verodella.se
 * @copyright Mattias Johansson
 * License http://opensource.org/licenses/MIT
 */

var MOS = window.MOS || {};
MOS.inView = (function() {

	var c = (console) ? console : {log: function () {}}; c.l = c.log;

	var _watchList = [];

	function _onEventDone(event, fn, wait) {

		var tm;
		$(window).on(event, function() {
			if (tm) {
				window.clearTimeout(tm);
			}
			tm = window.setTimeout(fn, wait);
		});

	}

	function _trace(label, value) {

		if (!MOS.inView.doTrace) return;

		value += ' ';
		if (!window.traceOut) {
			window.traceOut = {
				container: $('<div id="traceOut" style="border: 1px solid #eee;text-align: left; z-index: 9999; position: fixed; right:10px; top: 10px; width: 280px; padding:10px; background-color: #fff;font-family:sans-serif;font-size:12px; color:#000;"></div>'),
				outs: {}
			};
			$(document.body).append(window.traceOut.container);
		}
		var propName = label,
			outStr = label,
			currOut;
		if (value) outStr = label + ': ' + value;
		currOut = window.traceOut.outs[propName];
		if (!currOut) {
			window.traceOut.container.append($('<div class="' + propName + '">' + outStr + '</div>'));
			window.traceOut.outs[propName] = $('#traceOut .' + propName);
		} else {
			window.traceOut.outs[propName].html(outStr);
		}
	}


	function _checkBoundery ($target, boundsSize) {

		boundsSize = boundsSize || 1;

		var boundingRect = $target[0].getBoundingClientRect(),
			outerHeight = $target.outerHeight(),
			outerWidth = $target.outerWidth();

		if (
			boundingRect.top >= -1 * (outerHeight * boundsSize) &&
			boundingRect.bottom <= window.innerHeight + (outerHeight * boundsSize) &&
			boundingRect.left >= -1 * (outerWidth * boundsSize) &&
			boundingRect.right <= window.innerWidth + (outerWidth * boundsSize)
			)
		{
			return true;
		} else {
			return false;
		}

	}

	function _whatsVisible() {

		var len = _watchList.length,
			i,
			curr,
			isVisible = [],
			isClose = [],
			notVisible = [],
			fn;

		fn = function(index) {

			curr = $(this);

			if (_checkBoundery (curr, 1)) {
				isVisible.push(curr);
				curr.addClass('isVisible');
			} else {
				notVisible.push(curr);
				curr.removeClass('isVisible');
			}

			if (_checkBoundery (curr, MOS.inView.outOfBoundsSize)) {
				if (!curr.hasClass('isVisible')) {
					isClose.push(curr);
				}
			}

		};

		for (i = 0; i < len; i += 1) {
			_watchList[i].each(fn);

		}

		return {
			isVisible: isVisible,
			notVisible: notVisible,
			isClose: isClose
		};

	}

	function _onChecked(res) {

		var len = res.isVisible.length,
			i,
			strVisible = '';


		for (i = 0; i < len; i += 1) {
			strVisible += res.isVisible[i].attr('id') + ', ';
		}

		$.event.trigger({
			type: 'MOS.inViewCheck',
			states: res
		});

		if (MOS.inView.doTrace) _trace('Visible', strVisible);

		return res;

	}

	function _init() {

		_onEventDone('scroll', function(e) {
			_onChecked(_whatsVisible());
		}, 300);

		_onEventDone('resize', function(e) {
			_onChecked(_whatsVisible());
		}, 300);

		_init = function () {};

	}

  	function _add (it) {

  		_init();
		_watchList.push(it);

	}

	function _clear() {
		_watchList.length = 0;
	}

	function _check() {
		return _onChecked(_whatsVisible());
	}

	return {
		add: _add,
		outOfBoundsSize: 2,
		whatsVisible: _whatsVisible,
		check: _check,
		doTrace: false,
		clear: _clear
	};
}());
