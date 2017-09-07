"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Find the DOM node for a `node`.
 *
 * @param {Node} node
 * @return {Element}
 */

function findDOMNode(node) {
  var el = window.document.querySelector("[data-key=\"" + node.key + "\"]");

  if (!el) {
    throw new Error("Unable to find a DOM node for \"" + node.key + "\". This is often because of forgetting to add `props.attributes` to a component returned from `renderNode`.");
  }

  return el;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = findDOMNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maW5kLWRvbS1ub2RlLmpzIl0sIm5hbWVzIjpbImZpbmRET01Ob2RlIiwibm9kZSIsImVsIiwid2luZG93IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwia2V5IiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7Ozs7O0FBT0EsU0FBU0EsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDekIsTUFBTUMsS0FBS0MsT0FBT0MsUUFBUCxDQUFnQkMsYUFBaEIsa0JBQTRDSixLQUFLSyxHQUFqRCxTQUFYOztBQUVBLE1BQUksQ0FBQ0osRUFBTCxFQUFTO0FBQ1AsVUFBTSxJQUFJSyxLQUFKLHNDQUE0Q04sS0FBS0ssR0FBakQsa0hBQU47QUFDRDs7QUFFRCxTQUFPSixFQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztrQkFNZUYsVyIsImZpbGUiOiJmaW5kLWRvbS1ub2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEZpbmQgdGhlIERPTSBub2RlIGZvciBhIGBub2RlYC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cblxuZnVuY3Rpb24gZmluZERPTU5vZGUobm9kZSkge1xuICBjb25zdCBlbCA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1rZXk9XCIke25vZGUua2V5fVwiXWApXG5cbiAgaWYgKCFlbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgYSBET00gbm9kZSBmb3IgXCIke25vZGUua2V5fVwiLiBUaGlzIGlzIG9mdGVuIGJlY2F1c2Ugb2YgZm9yZ2V0dGluZyB0byBhZGQgXFxgcHJvcHMuYXR0cmlidXRlc1xcYCB0byBhIGNvbXBvbmVudCByZXR1cm5lZCBmcm9tIFxcYHJlbmRlck5vZGVcXGAuYClcbiAgfVxuXG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZmluZERPTU5vZGVcbiJdfQ==