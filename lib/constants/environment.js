'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_WINDOWS = exports.IS_MAC = exports.IS_IE = exports.IS_SAFARI = exports.IS_FIREFOX = exports.IS_CHROME = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Browser matching rules.
 *
 * @type {Array}
 */

var BROWSER_RULES = [['edge', /Edge\/([0-9\._]+)/], ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/], ['opera', /Opera\/([0-9\.]+)(?:\s|$)/], ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/], ['ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/], ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/], ['ie', /MSIE\s(7\.0)/], ['android', /Android\s([0-9\.]+)/], ['safari', /Version\/([0-9\._]+).*Safari/]];

/**
 * Operating system matching rules.
 *
 * @type {Array}
 */

var OS_RULES = [['macos', /mac os x/i], ['ios', /os ([\.\_\d]+) like mac os/i], ['android', /android/i], ['firefoxos', /mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/i], ['windows', /windows\s*(?:nt)?\s*([\.\_\d]+)/i]];

/**
 * Define variables to store the result.
 */

var BROWSER = void 0;
var OS = void 0;

/**
 * Run the matchers when in browser.
 */

if (_isInBrowser2.default) {
  var userAgent = window.navigator.userAgent;


  for (var i = 0; i < BROWSER_RULES.length; i++) {
    var _BROWSER_RULES$i = _slicedToArray(BROWSER_RULES[i], 2),
        name = _BROWSER_RULES$i[0],
        regexp = _BROWSER_RULES$i[1];

    if (regexp.test(userAgent)) {
      BROWSER = name;
      break;
    }
  }

  for (var _i = 0; _i < OS_RULES.length; _i++) {
    var _OS_RULES$_i = _slicedToArray(OS_RULES[_i], 2),
        name = _OS_RULES$_i[0],
        regexp = _OS_RULES$_i[1];

    if (regexp.test(userAgent)) {
      OS = name;
      break;
    }
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

var IS_CHROME = exports.IS_CHROME = BROWSER === 'chrome';
var IS_FIREFOX = exports.IS_FIREFOX = BROWSER === 'firefox';
var IS_SAFARI = exports.IS_SAFARI = BROWSER === 'safari';
var IS_IE = exports.IS_IE = BROWSER === 'ie';

var IS_MAC = exports.IS_MAC = OS === 'macos';
var IS_WINDOWS = exports.IS_WINDOWS = OS === 'windows';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvZW52aXJvbm1lbnQuanMiXSwibmFtZXMiOlsiQlJPV1NFUl9SVUxFUyIsIk9TX1JVTEVTIiwiQlJPV1NFUiIsIk9TIiwidXNlckFnZW50Iiwid2luZG93IiwibmF2aWdhdG9yIiwiaSIsImxlbmd0aCIsIm5hbWUiLCJyZWdleHAiLCJ0ZXN0IiwiSVNfQ0hST01FIiwiSVNfRklSRUZPWCIsIklTX1NBRkFSSSIsIklTX0lFIiwiSVNfTUFDIiwiSVNfV0lORE9XUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxnQkFBZ0IsQ0FDcEIsQ0FBQyxNQUFELEVBQVMsbUJBQVQsQ0FEb0IsRUFFcEIsQ0FBQyxRQUFELEVBQVcsa0RBQVgsQ0FGb0IsRUFHcEIsQ0FBQyxTQUFELEVBQVksNkJBQVosQ0FIb0IsRUFJcEIsQ0FBQyxPQUFELEVBQVUsMkJBQVYsQ0FKb0IsRUFLcEIsQ0FBQyxPQUFELEVBQVUsMEJBQVYsQ0FMb0IsRUFNcEIsQ0FBQyxJQUFELEVBQU8seUNBQVAsQ0FOb0IsRUFPcEIsQ0FBQyxJQUFELEVBQU8scUNBQVAsQ0FQb0IsRUFRcEIsQ0FBQyxJQUFELEVBQU8sY0FBUCxDQVJvQixFQVNwQixDQUFDLFNBQUQsRUFBWSxxQkFBWixDQVRvQixFQVVwQixDQUFDLFFBQUQsRUFBVyw4QkFBWCxDQVZvQixDQUF0Qjs7QUFhQTs7Ozs7O0FBTUEsSUFBTUMsV0FBVyxDQUNmLENBQUMsT0FBRCxFQUFVLFdBQVYsQ0FEZSxFQUVmLENBQUMsS0FBRCxFQUFRLDZCQUFSLENBRmUsRUFHZixDQUFDLFNBQUQsRUFBWSxVQUFaLENBSGUsRUFJZixDQUFDLFdBQUQsRUFBYyxnREFBZCxDQUplLEVBS2YsQ0FBQyxTQUFELEVBQVksa0NBQVosQ0FMZSxDQUFqQjs7QUFRQTs7OztBQUlBLElBQUlDLGdCQUFKO0FBQ0EsSUFBSUMsV0FBSjs7QUFFQTs7OztBQUlBLDJCQUFhO0FBQUEsTUFDSEMsU0FERyxHQUNXQyxPQUFPQyxTQURsQixDQUNIRixTQURHOzs7QUFHWCxPQUFLLElBQUlHLElBQUksQ0FBYixFQUFnQkEsSUFBSVAsY0FBY1EsTUFBbEMsRUFBMENELEdBQTFDLEVBQStDO0FBQUEsMENBQ3BCUCxjQUFjTyxDQUFkLENBRG9CO0FBQUEsUUFDckNFLElBRHFDO0FBQUEsUUFDL0JDLE1BRCtCOztBQUU3QyxRQUFJQSxPQUFPQyxJQUFQLENBQVlQLFNBQVosQ0FBSixFQUE0QjtBQUMxQkYsZ0JBQVVPLElBQVY7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQsT0FBSyxJQUFJRixLQUFJLENBQWIsRUFBZ0JBLEtBQUlOLFNBQVNPLE1BQTdCLEVBQXFDRCxJQUFyQyxFQUEwQztBQUFBLHNDQUNmTixTQUFTTSxFQUFULENBRGU7QUFBQSxRQUNoQ0UsSUFEZ0M7QUFBQSxRQUMxQkMsTUFEMEI7O0FBRXhDLFFBQUlBLE9BQU9DLElBQVAsQ0FBWVAsU0FBWixDQUFKLEVBQTRCO0FBQzFCRCxXQUFLTSxJQUFMO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7Ozs7OztBQU1PLElBQU1HLGdDQUFZVixZQUFZLFFBQTlCO0FBQ0EsSUFBTVcsa0NBQWFYLFlBQVksU0FBL0I7QUFDQSxJQUFNWSxnQ0FBWVosWUFBWSxRQUE5QjtBQUNBLElBQU1hLHdCQUFRYixZQUFZLElBQTFCOztBQUVBLElBQU1jLDBCQUFTYixPQUFPLE9BQXRCO0FBQ0EsSUFBTWMsa0NBQWFkLE9BQU8sU0FBMUIiLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBicm93c2VyIGZyb20gJ2lzLWluLWJyb3dzZXInXG5cbi8qKlxuICogQnJvd3NlciBtYXRjaGluZyBydWxlcy5cbiAqXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cblxuY29uc3QgQlJPV1NFUl9SVUxFUyA9IFtcbiAgWydlZGdlJywgL0VkZ2VcXC8oWzAtOVxcLl9dKykvXSxcbiAgWydjaHJvbWUnLCAvKD8hQ2hyb20uKk9QUilDaHJvbSg/OmV8aXVtKVxcLyhbMC05XFwuXSspKDo/XFxzfCQpL10sXG4gIFsnZmlyZWZveCcsIC9GaXJlZm94XFwvKFswLTlcXC5dKykoPzpcXHN8JCkvXSxcbiAgWydvcGVyYScsIC9PcGVyYVxcLyhbMC05XFwuXSspKD86XFxzfCQpL10sXG4gIFsnb3BlcmEnLCAvT1BSXFwvKFswLTlcXC5dKykoOj9cXHN8JCkkL10sXG4gIFsnaWUnLCAvVHJpZGVudFxcLzdcXC4wLipydlxcOihbMC05XFwuXSspXFwpLipHZWNrbyQvXSxcbiAgWydpZScsIC9NU0lFXFxzKFswLTlcXC5dKyk7LipUcmlkZW50XFwvWzQtN10uMC9dLFxuICBbJ2llJywgL01TSUVcXHMoN1xcLjApL10sXG4gIFsnYW5kcm9pZCcsIC9BbmRyb2lkXFxzKFswLTlcXC5dKykvXSxcbiAgWydzYWZhcmknLCAvVmVyc2lvblxcLyhbMC05XFwuX10rKS4qU2FmYXJpL10sXG5dXG5cbi8qKlxuICogT3BlcmF0aW5nIHN5c3RlbSBtYXRjaGluZyBydWxlcy5cbiAqXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cblxuY29uc3QgT1NfUlVMRVMgPSBbXG4gIFsnbWFjb3MnLCAvbWFjIG9zIHgvaV0sXG4gIFsnaW9zJywgL29zIChbXFwuXFxfXFxkXSspIGxpa2UgbWFjIG9zL2ldLFxuICBbJ2FuZHJvaWQnLCAvYW5kcm9pZC9pXSxcbiAgWydmaXJlZm94b3MnLCAvbW96aWxsYVxcL1thLXpcXC5cXF9cXGRdKyBcXCgoPzptb2JpbGUpfCg/OnRhYmxldCkvaV0sXG4gIFsnd2luZG93cycsIC93aW5kb3dzXFxzKig/Om50KT9cXHMqKFtcXC5cXF9cXGRdKykvaV0sXG5dXG5cbi8qKlxuICogRGVmaW5lIHZhcmlhYmxlcyB0byBzdG9yZSB0aGUgcmVzdWx0LlxuICovXG5cbmxldCBCUk9XU0VSXG5sZXQgT1NcblxuLyoqXG4gKiBSdW4gdGhlIG1hdGNoZXJzIHdoZW4gaW4gYnJvd3Nlci5cbiAqL1xuXG5pZiAoYnJvd3Nlcikge1xuICBjb25zdCB7IHVzZXJBZ2VudCB9ID0gd2luZG93Lm5hdmlnYXRvclxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgQlJPV1NFUl9SVUxFUy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IFsgbmFtZSwgcmVnZXhwIF0gPSBCUk9XU0VSX1JVTEVTW2ldXG4gICAgaWYgKHJlZ2V4cC50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIEJST1dTRVIgPSBuYW1lXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgT1NfUlVMRVMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBbIG5hbWUsIHJlZ2V4cCBdID0gT1NfUlVMRVNbaV1cbiAgICBpZiAocmVnZXhwLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgT1MgPSBuYW1lXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmV4cG9ydCBjb25zdCBJU19DSFJPTUUgPSBCUk9XU0VSID09PSAnY2hyb21lJ1xuZXhwb3J0IGNvbnN0IElTX0ZJUkVGT1ggPSBCUk9XU0VSID09PSAnZmlyZWZveCdcbmV4cG9ydCBjb25zdCBJU19TQUZBUkkgPSBCUk9XU0VSID09PSAnc2FmYXJpJ1xuZXhwb3J0IGNvbnN0IElTX0lFID0gQlJPV1NFUiA9PT0gJ2llJ1xuXG5leHBvcnQgY29uc3QgSVNfTUFDID0gT1MgPT09ICdtYWNvcydcbmV4cG9ydCBjb25zdCBJU19XSU5ET1dTID0gT1MgPT09ICd3aW5kb3dzJ1xuIl19