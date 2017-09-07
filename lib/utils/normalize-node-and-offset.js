'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * From a DOM selection's `node` and `offset`, normalize so that it always
 * refers to a text node.
 *
 * @param {Element} node
 * @param {Number} offset
 * @return {Object}
 */

function normalizeNodeAndOffset(node, offset) {
  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (node.nodeType == 1 && node.childNodes.length) {
    var isLast = offset == node.childNodes.length;
    var direction = isLast ? 'backward' : 'forward';
    var index = isLast ? offset - 1 : offset;
    node = getEditableChild(node, index, direction);

    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (node.nodeType == 1 && node.childNodes.length) {
      var i = isLast ? node.childNodes.length - 1 : 0;
      node = getEditableChild(node, i, direction);
    }

    // Determine the new offset inside the text node.
    offset = isLast ? node.textContent.length : 0;
  }

  // Return the node and offset.
  return { node: node, offset: offset };
}

/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 *
 * @param {Element} parent
 * @param {Number} index
 * @param {String} direction ('forward' or 'backward')
 * @return {Element|Null}
 */

function getEditableChild(parent, index, direction) {
  var childNodes = parent.childNodes;

  var child = childNodes[index];
  var i = index;
  var triedForward = false;
  var triedBackward = false;

  // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.
  while (child.nodeType == 8 || child.nodeType == 1 && child.childNodes.length == 0 || child.nodeType == 1 && child.getAttribute('contenteditable') == 'false') {
    if (triedForward && triedBackward) break;

    if (i >= childNodes.length) {
      triedForward = true;
      i = index - 1;
      direction = 'backward';
      continue;
    }

    if (i < 0) {
      triedBackward = true;
      i = index + 1;
      direction = 'forward';
      continue;
    }

    child = childNodes[i];
    if (direction == 'forward') i++;
    if (direction == 'backward') i--;
  }

  return child || null;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = normalizeNodeAndOffset;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9ub3JtYWxpemUtbm9kZS1hbmQtb2Zmc2V0LmpzIl0sIm5hbWVzIjpbIm5vcm1hbGl6ZU5vZGVBbmRPZmZzZXQiLCJub2RlIiwib2Zmc2V0Iiwibm9kZVR5cGUiLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwiaXNMYXN0IiwiZGlyZWN0aW9uIiwiaW5kZXgiLCJnZXRFZGl0YWJsZUNoaWxkIiwiaSIsInRleHRDb250ZW50IiwicGFyZW50IiwiY2hpbGQiLCJ0cmllZEZvcndhcmQiLCJ0cmllZEJhY2t3YXJkIiwiZ2V0QXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7Ozs7Ozs7O0FBU0EsU0FBU0Esc0JBQVQsQ0FBZ0NDLElBQWhDLEVBQXNDQyxNQUF0QyxFQUE4QztBQUM1QztBQUNBO0FBQ0EsTUFBSUQsS0FBS0UsUUFBTCxJQUFpQixDQUFqQixJQUFzQkYsS0FBS0csVUFBTCxDQUFnQkMsTUFBMUMsRUFBa0Q7QUFDaEQsUUFBTUMsU0FBU0osVUFBVUQsS0FBS0csVUFBTCxDQUFnQkMsTUFBekM7QUFDQSxRQUFNRSxZQUFZRCxTQUFTLFVBQVQsR0FBc0IsU0FBeEM7QUFDQSxRQUFNRSxRQUFRRixTQUFTSixTQUFTLENBQWxCLEdBQXNCQSxNQUFwQztBQUNBRCxXQUFPUSxpQkFBaUJSLElBQWpCLEVBQXVCTyxLQUF2QixFQUE4QkQsU0FBOUIsQ0FBUDs7QUFFQTtBQUNBO0FBQ0EsV0FBT04sS0FBS0UsUUFBTCxJQUFpQixDQUFqQixJQUFzQkYsS0FBS0csVUFBTCxDQUFnQkMsTUFBN0MsRUFBcUQ7QUFDbkQsVUFBTUssSUFBSUosU0FBU0wsS0FBS0csVUFBTCxDQUFnQkMsTUFBaEIsR0FBeUIsQ0FBbEMsR0FBc0MsQ0FBaEQ7QUFDQUosYUFBT1EsaUJBQWlCUixJQUFqQixFQUF1QlMsQ0FBdkIsRUFBMEJILFNBQTFCLENBQVA7QUFDRDs7QUFFRDtBQUNBTCxhQUFTSSxTQUFTTCxLQUFLVSxXQUFMLENBQWlCTixNQUExQixHQUFtQyxDQUE1QztBQUNEOztBQUVEO0FBQ0EsU0FBTyxFQUFFSixVQUFGLEVBQVFDLGNBQVIsRUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBVUEsU0FBU08sZ0JBQVQsQ0FBMEJHLE1BQTFCLEVBQWtDSixLQUFsQyxFQUF5Q0QsU0FBekMsRUFBb0Q7QUFBQSxNQUMxQ0gsVUFEMEMsR0FDM0JRLE1BRDJCLENBQzFDUixVQUQwQzs7QUFFbEQsTUFBSVMsUUFBUVQsV0FBV0ksS0FBWCxDQUFaO0FBQ0EsTUFBSUUsSUFBSUYsS0FBUjtBQUNBLE1BQUlNLGVBQWUsS0FBbkI7QUFDQSxNQUFJQyxnQkFBZ0IsS0FBcEI7O0FBRUE7QUFDQTtBQUNBLFNBQ0dGLE1BQU1WLFFBQU4sSUFBa0IsQ0FBbkIsSUFDQ1UsTUFBTVYsUUFBTixJQUFrQixDQUFsQixJQUF1QlUsTUFBTVQsVUFBTixDQUFpQkMsTUFBakIsSUFBMkIsQ0FEbkQsSUFFQ1EsTUFBTVYsUUFBTixJQUFrQixDQUFsQixJQUF1QlUsTUFBTUcsWUFBTixDQUFtQixpQkFBbkIsS0FBeUMsT0FIbkUsRUFJRTtBQUNBLFFBQUlGLGdCQUFnQkMsYUFBcEIsRUFBbUM7O0FBRW5DLFFBQUlMLEtBQUtOLFdBQVdDLE1BQXBCLEVBQTRCO0FBQzFCUyxxQkFBZSxJQUFmO0FBQ0FKLFVBQUlGLFFBQVEsQ0FBWjtBQUNBRCxrQkFBWSxVQUFaO0FBQ0E7QUFDRDs7QUFFRCxRQUFJRyxJQUFJLENBQVIsRUFBVztBQUNUSyxzQkFBZ0IsSUFBaEI7QUFDQUwsVUFBSUYsUUFBUSxDQUFaO0FBQ0FELGtCQUFZLFNBQVo7QUFDQTtBQUNEOztBQUVETSxZQUFRVCxXQUFXTSxDQUFYLENBQVI7QUFDQSxRQUFJSCxhQUFhLFNBQWpCLEVBQTRCRztBQUM1QixRQUFJSCxhQUFhLFVBQWpCLEVBQTZCRztBQUM5Qjs7QUFFRCxTQUFPRyxTQUFTLElBQWhCO0FBQ0Q7O0FBRUQ7Ozs7OztrQkFNZWIsc0IiLCJmaWxlIjoibm9ybWFsaXplLW5vZGUtYW5kLW9mZnNldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBGcm9tIGEgRE9NIHNlbGVjdGlvbidzIGBub2RlYCBhbmQgYG9mZnNldGAsIG5vcm1hbGl6ZSBzbyB0aGF0IGl0IGFsd2F5c1xuICogcmVmZXJzIHRvIGEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5vZGVBbmRPZmZzZXQobm9kZSwgb2Zmc2V0KSB7XG4gIC8vIElmIGl0J3MgYW4gZWxlbWVudCBub2RlLCBpdHMgb2Zmc2V0IHJlZmVycyB0byB0aGUgaW5kZXggb2YgaXRzIGNoaWxkcmVuXG4gIC8vIGluY2x1ZGluZyBjb21tZW50IG5vZGVzLCBzbyB0cnkgdG8gZmluZCB0aGUgcmlnaHQgdGV4dCBjaGlsZCBub2RlLlxuICBpZiAobm9kZS5ub2RlVHlwZSA9PSAxICYmIG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICBjb25zdCBpc0xhc3QgPSBvZmZzZXQgPT0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aFxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGlzTGFzdCA/ICdiYWNrd2FyZCcgOiAnZm9yd2FyZCdcbiAgICBjb25zdCBpbmRleCA9IGlzTGFzdCA/IG9mZnNldCAtIDEgOiBvZmZzZXRcbiAgICBub2RlID0gZ2V0RWRpdGFibGVDaGlsZChub2RlLCBpbmRleCwgZGlyZWN0aW9uKVxuXG4gICAgLy8gSWYgdGhlIG5vZGUgaGFzIGNoaWxkcmVuLCB0cmF2ZXJzZSB1bnRpbCB3ZSBoYXZlIGEgbGVhZiBub2RlLiBMZWFmIG5vZGVzXG4gICAgLy8gY2FuIGJlIGVpdGhlciB0ZXh0IG5vZGVzLCBvciBvdGhlciB2b2lkIERPTSBub2Rlcy5cbiAgICB3aGlsZSAobm9kZS5ub2RlVHlwZSA9PSAxICYmIG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGkgPSBpc0xhc3QgPyBub2RlLmNoaWxkTm9kZXMubGVuZ3RoIC0gMSA6IDBcbiAgICAgIG5vZGUgPSBnZXRFZGl0YWJsZUNoaWxkKG5vZGUsIGksIGRpcmVjdGlvbilcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIG5ldyBvZmZzZXQgaW5zaWRlIHRoZSB0ZXh0IG5vZGUuXG4gICAgb2Zmc2V0ID0gaXNMYXN0ID8gbm9kZS50ZXh0Q29udGVudC5sZW5ndGggOiAwXG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIG5vZGUgYW5kIG9mZnNldC5cbiAgcmV0dXJuIHsgbm9kZSwgb2Zmc2V0IH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIG5lYXJlc3QgZWRpdGFibGUgY2hpbGQgYXQgYGluZGV4YCBpbiBhIGBwYXJlbnRgLCBwcmVmZXJyaW5nXG4gKiBgZGlyZWN0aW9uYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyZWN0aW9uICgnZm9yd2FyZCcgb3IgJ2JhY2t3YXJkJylcbiAqIEByZXR1cm4ge0VsZW1lbnR8TnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBnZXRFZGl0YWJsZUNoaWxkKHBhcmVudCwgaW5kZXgsIGRpcmVjdGlvbikge1xuICBjb25zdCB7IGNoaWxkTm9kZXMgfSA9IHBhcmVudFxuICBsZXQgY2hpbGQgPSBjaGlsZE5vZGVzW2luZGV4XVxuICBsZXQgaSA9IGluZGV4XG4gIGxldCB0cmllZEZvcndhcmQgPSBmYWxzZVxuICBsZXQgdHJpZWRCYWNrd2FyZCA9IGZhbHNlXG5cbiAgLy8gV2hpbGUgdGhlIGNoaWxkIGlzIGEgY29tbWVudCBub2RlLCBvciBhbiBlbGVtZW50IG5vZGUgd2l0aCBubyBjaGlsZHJlbixcbiAgLy8ga2VlcCBpdGVyYXRpbmcgdG8gZmluZCBhIHNpYmxpbmcgbm9uLXZvaWQsIG5vbi1jb21tZW50IG5vZGUuXG4gIHdoaWxlIChcbiAgICAoY2hpbGQubm9kZVR5cGUgPT0gOCkgfHxcbiAgICAoY2hpbGQubm9kZVR5cGUgPT0gMSAmJiBjaGlsZC5jaGlsZE5vZGVzLmxlbmd0aCA9PSAwKSB8fFxuICAgIChjaGlsZC5ub2RlVHlwZSA9PSAxICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykgPT0gJ2ZhbHNlJylcbiAgKSB7XG4gICAgaWYgKHRyaWVkRm9yd2FyZCAmJiB0cmllZEJhY2t3YXJkKSBicmVha1xuXG4gICAgaWYgKGkgPj0gY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIHRyaWVkRm9yd2FyZCA9IHRydWVcbiAgICAgIGkgPSBpbmRleCAtIDFcbiAgICAgIGRpcmVjdGlvbiA9ICdiYWNrd2FyZCdcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICB0cmllZEJhY2t3YXJkID0gdHJ1ZVxuICAgICAgaSA9IGluZGV4ICsgMVxuICAgICAgZGlyZWN0aW9uID0gJ2ZvcndhcmQnXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGNoaWxkID0gY2hpbGROb2Rlc1tpXVxuICAgIGlmIChkaXJlY3Rpb24gPT0gJ2ZvcndhcmQnKSBpKytcbiAgICBpZiAoZGlyZWN0aW9uID09ICdiYWNrd2FyZCcpIGktLVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkIHx8IG51bGxcbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IG5vcm1hbGl6ZU5vZGVBbmRPZmZzZXRcbiJdfQ==