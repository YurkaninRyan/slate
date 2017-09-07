'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Find the closest ancestor of a DOM `element` that matches a given selector.
 *
 * COMPAT: In IE11, the `Node.closest` method doesn't exist natively, so we
 * have to polyfill it. (2017/09/06)
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 *
 * @param {Element} node
 * @param {String} selector
 * @return {Element}
 */

function findClosestNode(node, selector) {
  if (typeof node.closest === 'function') return node.closest(selector);

  var matches = (node.document || node.ownerDocument).querySelectorAll(selector);
  var parentNode = node;
  var i = void 0;

  do {
    i = matches.length;
    while (--i >= 0 && matches.item(i) !== parentNode) {}
  } while (i < 0 && (parentNode = parentNode.parentElement));

  return parentNode;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = findClosestNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maW5kLWNsb3Nlc3Qtbm9kZS5qcyJdLCJuYW1lcyI6WyJmaW5kQ2xvc2VzdE5vZGUiLCJub2RlIiwic2VsZWN0b3IiLCJjbG9zZXN0IiwibWF0Y2hlcyIsImRvY3VtZW50Iiwib3duZXJEb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwYXJlbnROb2RlIiwiaSIsImxlbmd0aCIsIml0ZW0iLCJwYXJlbnRFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVNBLGVBQVQsQ0FBeUJDLElBQXpCLEVBQStCQyxRQUEvQixFQUF5QztBQUN2QyxNQUFJLE9BQU9ELEtBQUtFLE9BQVosS0FBd0IsVUFBNUIsRUFBd0MsT0FBT0YsS0FBS0UsT0FBTCxDQUFhRCxRQUFiLENBQVA7O0FBRXhDLE1BQU1FLFVBQVUsQ0FBQ0gsS0FBS0ksUUFBTCxJQUFpQkosS0FBS0ssYUFBdkIsRUFBc0NDLGdCQUF0QyxDQUF1REwsUUFBdkQsQ0FBaEI7QUFDQSxNQUFJTSxhQUFhUCxJQUFqQjtBQUNBLE1BQUlRLFVBQUo7O0FBRUEsS0FBRztBQUNEQSxRQUFJTCxRQUFRTSxNQUFaO0FBQ0EsV0FBTyxFQUFFRCxDQUFGLElBQU8sQ0FBUCxJQUFZTCxRQUFRTyxJQUFSLENBQWFGLENBQWIsTUFBb0JELFVBQXZDO0FBQ0QsR0FIRCxRQUlRQyxJQUFJLENBQUwsS0FBWUQsYUFBYUEsV0FBV0ksYUFBcEMsQ0FKUDs7QUFNQSxTQUFPSixVQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztrQkFNZVIsZSIsImZpbGUiOiJmaW5kLWNsb3Nlc3Qtbm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBGaW5kIHRoZSBjbG9zZXN0IGFuY2VzdG9yIG9mIGEgRE9NIGBlbGVtZW50YCB0aGF0IG1hdGNoZXMgYSBnaXZlbiBzZWxlY3Rvci5cbiAqXG4gKiBDT01QQVQ6IEluIElFMTEsIHRoZSBgTm9kZS5jbG9zZXN0YCBtZXRob2QgZG9lc24ndCBleGlzdCBuYXRpdmVseSwgc28gd2VcbiAqIGhhdmUgdG8gcG9seWZpbGwgaXQuICgyMDE3LzA5LzA2KVxuICpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2Nsb3Nlc3QjUG9seWZpbGxcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBmaW5kQ2xvc2VzdE5vZGUobm9kZSwgc2VsZWN0b3IpIHtcbiAgaWYgKHR5cGVvZiBub2RlLmNsb3Nlc3QgPT09ICdmdW5jdGlvbicpIHJldHVybiBub2RlLmNsb3Nlc3Qoc2VsZWN0b3IpXG5cbiAgY29uc3QgbWF0Y2hlcyA9IChub2RlLmRvY3VtZW50IHx8IG5vZGUub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiAgbGV0IHBhcmVudE5vZGUgPSBub2RlXG4gIGxldCBpXG5cbiAgZG8ge1xuICAgIGkgPSBtYXRjaGVzLmxlbmd0aFxuICAgIHdoaWxlICgtLWkgPj0gMCAmJiBtYXRjaGVzLml0ZW0oaSkgIT09IHBhcmVudE5vZGUpO1xuICB9XG4gIHdoaWxlICgoaSA8IDApICYmIChwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnRFbGVtZW50KSlcblxuICByZXR1cm4gcGFyZW50Tm9kZVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZmluZENsb3Nlc3ROb2RlXG4iXX0=