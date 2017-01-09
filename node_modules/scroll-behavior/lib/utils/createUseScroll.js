'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = createUseScroll;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _domHelpersEventsOff = require('dom-helpers/events/off');

var _domHelpersEventsOff2 = _interopRequireDefault(_domHelpersEventsOff);

var _domHelpersEventsOn = require('dom-helpers/events/on');

var _domHelpersEventsOn2 = _interopRequireDefault(_domHelpersEventsOn);

var _domHelpersQueryScrollLeft = require('dom-helpers/query/scrollLeft');

var _domHelpersQueryScrollLeft2 = _interopRequireDefault(_domHelpersQueryScrollLeft);

var _domHelpersQueryScrollTop = require('dom-helpers/query/scrollTop');

var _domHelpersQueryScrollTop2 = _interopRequireDefault(_domHelpersQueryScrollTop);

var _domHelpersUtilRequestAnimationFrame = require('dom-helpers/util/requestAnimationFrame');

var _domHelpersUtilRequestAnimationFrame2 = _interopRequireDefault(_domHelpersUtilRequestAnimationFrame);

// Try at most this many times to scroll, to avoid getting stuck.
var MAX_SCROLL_ATTEMPTS = 2;

function createUseScroll(getScrollPosition, start, stop, updateLocation) {
  return function (createHistory) {
    return function () {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var shouldUpdateScroll = options.shouldUpdateScroll;

      var historyOptions = _objectWithoutProperties(options, ['shouldUpdateScroll']);

      var history = createHistory(historyOptions);

      var scrollTarget = undefined;
      var numScrollAttempts = undefined;
      var checkScrollHandle = undefined;

      function cancelCheckScroll() {
        if (checkScrollHandle !== null) {
          _domHelpersUtilRequestAnimationFrame2['default'].cancel(checkScrollHandle);
          checkScrollHandle = null;
        }
      }

      function onScroll() {
        if (!scrollTarget) {
          return;
        }

        var _scrollTarget = scrollTarget;
        var xTarget = _scrollTarget[0];
        var yTarget = _scrollTarget[1];

        var x = _domHelpersQueryScrollLeft2['default'](window);
        var y = _domHelpersQueryScrollTop2['default'](window);

        if (x === xTarget && y === yTarget) {
          scrollTarget = null;
          cancelCheckScroll();
        }
      }

      // FIXME: This is not the right way to track whether there are listeners.
      var numListeners = 0;

      function checkStart() {
        if (numListeners === 0) {
          if (start) {
            start(history);
          }

          scrollTarget = null;
          numScrollAttempts = 0;
          checkScrollHandle = null;

          _domHelpersEventsOn2['default'](window, 'scroll', onScroll);
        }

        ++numListeners;
      }

      function checkStop() {
        --numListeners;

        if (numListeners === 0) {
          if (stop) {
            stop();
          }

          _domHelpersEventsOff2['default'](window, 'scroll', onScroll);

          cancelCheckScroll();
        }
      }

      function listenBefore(hook) {
        checkStart();
        var unlisten = history.listenBefore(hook);

        return function () {
          unlisten();
          checkStop();
        };
      }

      function checkScrollPosition() {
        checkScrollHandle = null;

        // We can only get here if scrollTarget is set. Every code path that
        // unsets scroll target also cancels the handle to avoid calling this
        // handler. Still, check anyway just in case.
        /* istanbul ignore if: paranoid guard */
        if (!scrollTarget) {
          return;
        }

        var _scrollTarget2 = scrollTarget;
        var x = _scrollTarget2[0];
        var y = _scrollTarget2[1];

        window.scrollTo(x, y);

        ++numScrollAttempts;

        /* istanbul ignore if: paranoid guard */
        if (numScrollAttempts >= MAX_SCROLL_ATTEMPTS) {
          scrollTarget = null;
          return;
        }

        checkScrollHandle = _domHelpersUtilRequestAnimationFrame2['default'](checkScrollPosition);
      }

      var oldLocation = undefined;
      var listeners = [],
          currentLocation = undefined,
          unlisten = undefined;

      function onChange(location) {
        oldLocation = currentLocation;
        currentLocation = location;

        listeners.forEach(function (listener) {
          return listener(location);
        });

        // Whatever we were doing before isn't relevant any more.
        cancelCheckScroll();

        // useStandardScroll needs the new location even when not updating the
        // scroll position, to update the current key.
        if (updateLocation) {
          updateLocation(location);
        }

        var scrollPosition = undefined;
        if (shouldUpdateScroll) {
          scrollPosition = shouldUpdateScroll(oldLocation, currentLocation);
        } else {
          scrollPosition = true;
        }

        if (scrollPosition && !Array.isArray(scrollPosition)) {
          scrollPosition = getScrollPosition(currentLocation);
        }

        scrollTarget = scrollPosition;

        // Check the scroll position to see if we even need to scroll.
        onScroll();
        if (!scrollTarget) {
          return;
        }

        numScrollAttempts = 0;
        checkScrollPosition();
      }

      function listen(listener) {
        checkStart();

        if (listeners.length === 0) {
          unlisten = history.listen(onChange);
        }

        // Add the listener to the list afterward so we can manage calling it
        // initially with the current location.
        listeners.push(listener);
        listener(currentLocation);

        return function () {
          listeners = listeners.filter(function (item) {
            return item !== listener;
          });
          if (listeners.length === 0) {
            unlisten();
          }

          checkStop();
        };
      }

      return _extends({}, history, {
        listenBefore: listenBefore,
        listen: listen
      });
    };
  };
}

module.exports = exports['default'];