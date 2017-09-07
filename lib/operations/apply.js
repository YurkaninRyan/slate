'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _node = require('../models/node');

var _node2 = _interopRequireDefault(_node);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:operation:apply');

/**
 * Applying functions.
 *
 * @type {Object}
 */

var APPLIERS = {

  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  add_mark: function add_mark(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length;

    var mark = _mark2.default.create(operation.mark);
    var _state = state,
        document = _state.document;

    var node = document.assertPath(path);
    node = node.addMark(offset, length, mark);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Insert a `node` at `index` in a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  insert_node: function insert_node(state, operation) {
    var path = operation.path;

    var node = _node2.default.create(operation.node);
    var index = path[path.length - 1];
    var rest = path.slice(0, -1);
    var _state2 = state,
        document = _state2.document;

    var parent = document.assertPath(rest);
    parent = parent.insertNode(index, node);
    document = document.updateNode(parent);
    state = state.set('document', document);
    return state;
  },


  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  insert_text: function insert_text(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        text = operation.text;
    var marks = operation.marks;

    if (Array.isArray(marks)) marks = _mark2.default.createSet(marks);

    var _state3 = state,
        document = _state3.document,
        selection = _state3.selection;
    var _selection = selection,
        anchorKey = _selection.anchorKey,
        focusKey = _selection.focusKey,
        anchorOffset = _selection.anchorOffset,
        focusOffset = _selection.focusOffset;

    var node = document.assertPath(path);

    // Update the document
    node = node.insertText(offset, text, marks);
    document = document.updateNode(node);

    // Update the selection
    if (anchorKey == node.key && anchorOffset >= offset) {
      selection = selection.moveAnchor(text.length);
    }
    if (focusKey == node.key && focusOffset >= offset) {
      selection = selection.moveFocus(text.length);
    }

    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Merge a node at `path` with the previous node.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  merge_node: function merge_node(state, operation) {
    var path = operation.path;

    var withPath = path.slice(0, path.length - 1).concat([path[path.length - 1] - 1]);
    var _state4 = state,
        document = _state4.document,
        selection = _state4.selection;

    var one = document.assertPath(withPath);
    var two = document.assertPath(path);
    var parent = document.getParent(one.key);
    var oneIndex = parent.nodes.indexOf(one);
    var twoIndex = parent.nodes.indexOf(two);

    // Perform the merge in the document.
    parent = parent.mergeNode(oneIndex, twoIndex);
    document = document.updateNode(parent);

    // If the nodes are text nodes and the selection is inside the second node
    // update it to refer to the first node instead.
    if (one.kind == 'text') {
      var _selection2 = selection,
          anchorKey = _selection2.anchorKey,
          anchorOffset = _selection2.anchorOffset,
          focusKey = _selection2.focusKey,
          focusOffset = _selection2.focusOffset;

      var normalize = false;

      if (anchorKey == two.key) {
        selection = selection.moveAnchorTo(one.key, one.text.length + anchorOffset);
        normalize = true;
      }

      if (focusKey == two.key) {
        selection = selection.moveFocusTo(one.key, one.text.length + focusOffset);
        normalize = true;
      }

      if (normalize) {
        selection = selection.normalize(document);
      }
    }

    // Update the document and selection.
    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Move a node by `path` to `newPath`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  move_node: function move_node(state, operation) {
    var path = operation.path,
        newPath = operation.newPath;

    var newIndex = newPath[newPath.length - 1];
    var newParentPath = newPath.slice(0, -1);
    var oldParentPath = path.slice(0, -1);
    var oldIndex = path[path.length - 1];
    var _state5 = state,
        document = _state5.document;

    var node = document.assertPath(path);

    // Remove the node from its current parent.
    var parent = document.getParent(node.key);
    parent = parent.removeNode(oldIndex);
    document = document.updateNode(parent);

    // Find the new target...
    var target = void 0;

    // If the old path and the rest of the new path are the same, then the new
    // target is the old parent.
    if (oldParentPath.every(function (x, i) {
      return x === newParentPath[i];
    }) && oldParentPath.length === newParentPath.length) {
      target = parent;
    }

    // Otherwise, if the old path removal resulted in the new path being no longer
    // correct, we need to decrement the new path at the old path's last index.
    else if (oldParentPath.every(function (x, i) {
        return x === newParentPath[i];
      }) && oldIndex < newParentPath[oldParentPath.length]) {
        newParentPath[oldParentPath.length]--;
        target = document.assertPath(newParentPath);
      }

      // Otherwise, we can just grab the target normally...
      else {
          target = document.assertPath(newParentPath);
        }

    // Insert the new node to its new parent.
    target = target.insertNode(newIndex, node);
    document = document.updateNode(target);
    state = state.set('document', document);
    return state;
  },


  /**
   * Remove mark from text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_mark: function remove_mark(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length;

    var mark = _mark2.default.create(operation.mark);
    var _state6 = state,
        document = _state6.document;

    var node = document.assertPath(path);
    node = node.removeMark(offset, length, mark);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Remove a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_node: function remove_node(state, operation) {
    var path = operation.path;
    var _state7 = state,
        document = _state7.document,
        selection = _state7.selection;
    var _selection3 = selection,
        startKey = _selection3.startKey,
        endKey = _selection3.endKey;

    var node = document.assertPath(path);

    // If the selection is set, check to see if it needs to be updated.
    if (selection.isSet) {
      var hasStartNode = node.hasNode(startKey);
      var hasEndNode = node.hasNode(endKey);
      var normalize = false;

      // If one of the selection's nodes is being removed, we need to update it.
      if (hasStartNode) {
        var prev = document.getPreviousText(startKey);
        var next = document.getNextText(startKey);

        if (prev) {
          selection = selection.moveStartTo(prev.key, prev.text.length);
          normalize = true;
        } else if (next) {
          selection = selection.moveStartTo(next.key, 0);
          normalize = true;
        } else {
          selection = selection.deselect();
        }
      }

      if (hasEndNode) {
        var _prev = document.getPreviousText(endKey);
        var _next = document.getNextText(endKey);

        if (_prev) {
          selection = selection.moveEndTo(_prev.key, _prev.text.length);
          normalize = true;
        } else if (_next) {
          selection = selection.moveEndTo(_next.key, 0);
          normalize = true;
        } else {
          selection = selection.deselect();
        }
      }

      if (normalize) {
        selection = selection.normalize(document);
      }
    }

    // Remove the node from the document.
    var parent = document.getParent(node.key);
    var index = parent.nodes.indexOf(node);
    parent = parent.removeNode(index);
    document = document.updateNode(parent);

    // Update the document and selection.
    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_text: function remove_text(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        text = operation.text;
    var length = text.length;

    var rangeOffset = offset + length;
    var _state8 = state,
        document = _state8.document,
        selection = _state8.selection;
    var _selection4 = selection,
        anchorKey = _selection4.anchorKey,
        focusKey = _selection4.focusKey,
        anchorOffset = _selection4.anchorOffset,
        focusOffset = _selection4.focusOffset;

    var node = document.assertPath(path);

    // Update the selection.
    if (anchorKey == node.key && anchorOffset >= rangeOffset) {
      selection = selection.moveAnchor(-length);
    }

    if (focusKey == node.key && focusOffset >= rangeOffset) {
      selection = selection.moveFocus(-length);
    }

    node = node.removeText(offset, length);
    document = document.updateNode(node);
    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Set `data` on `state`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_data: function set_data(state, operation) {
    var properties = operation.properties;
    var _state9 = state,
        data = _state9.data;


    data = data.merge(properties);
    state = state.set('data', data);
    return state;
  },


  /**
   * Set `properties` on mark on text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_mark: function set_mark(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length,
        properties = operation.properties;

    var mark = _mark2.default.create(operation.mark);
    var _state10 = state,
        document = _state10.document;

    var node = document.assertPath(path);
    node = node.updateMark(offset, length, mark, properties);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Set `properties` on a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_node: function set_node(state, operation) {
    var path = operation.path,
        properties = operation.properties;
    var _state11 = state,
        document = _state11.document;

    var node = document.assertPath(path);

    // Warn when trying to overwite a node's children.
    if (properties.nodes && properties.nodes != node.nodes) {
      _logger2.default.warn('Updating a Node\'s `nodes` property via `setNode()` is not allowed. Use the appropriate insertion and removal operations instead. The opeartion in question was:', operation);
      delete properties.nodes;
    }

    // Warn when trying to change a node's key.
    if (properties.key && properties.key != node.key) {
      _logger2.default.warn('Updating a Node\'s `key` property via `setNode()` is not allowed. There should be no reason to do this. The opeartion in question was:', operation);
      delete properties.key;
    }

    node = node.merge(properties);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Set `properties` on the selection.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_selection: function set_selection(state, operation) {
    var properties = _extends({}, operation.properties);
    var _state12 = state,
        document = _state12.document,
        selection = _state12.selection;


    if (properties.marks != null) {
      properties.marks = _mark2.default.createSet(properties.marks);
    }

    if (properties.anchorPath !== undefined) {
      properties.anchorKey = properties.anchorPath === null ? null : document.assertPath(properties.anchorPath).key;
      delete properties.anchorPath;
    }

    if (properties.focusPath !== undefined) {
      properties.focusKey = properties.focusPath === null ? null : document.assertPath(properties.focusPath).key;
      delete properties.focusPath;
    }

    selection = selection.merge(properties);
    selection = selection.normalize(document);
    state = state.set('selection', selection);
    return state;
  },


  /**
   * Split a node by `path` at `offset`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  split_node: function split_node(state, operation) {
    var path = operation.path,
        position = operation.position;
    var _state13 = state,
        document = _state13.document,
        selection = _state13.selection;

    // Calculate a few things...

    var node = document.assertPath(path);
    var parent = document.getParent(node.key);
    var index = parent.nodes.indexOf(node);

    // Split the node by its parent.
    parent = parent.splitNode(index, position);
    document = document.updateNode(parent);

    // Determine whether we need to update the selection...
    var _selection5 = selection,
        startKey = _selection5.startKey,
        endKey = _selection5.endKey,
        startOffset = _selection5.startOffset,
        endOffset = _selection5.endOffset;

    var next = document.getNextText(node.key);
    var normalize = false;

    // If the start point is after or equal to the split, update it.
    if (node.key == startKey && position <= startOffset) {
      selection = selection.moveStartTo(next.key, startOffset - position);
      normalize = true;
    }

    // If the end point is after or equal to the split, update it.
    if (node.key == endKey && position <= endOffset) {
      selection = selection.moveEndTo(next.key, endOffset - position);
      normalize = true;
    }

    // Normalize the selection if we changed it, since the methods we use might
    // leave it in a non-normalized state.
    if (normalize) {
      selection = selection.normalize(document);
    }

    // Return the updated state.
    state = state.set('document', document).set('selection', selection);
    return state;
  }
};

/**
 * Apply an `operation` to a `state`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State} state
 */

function applyOperation(state, operation) {
  var type = operation.type;

  var apply = APPLIERS[type];

  if (!apply) {
    throw new Error('Unknown operation type: "' + type + '".');
  }

  debug(type, operation);
  state = apply(state, operation);
  return state;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = applyOperation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vcGVyYXRpb25zL2FwcGx5LmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiQVBQTElFUlMiLCJhZGRfbWFyayIsInN0YXRlIiwib3BlcmF0aW9uIiwicGF0aCIsIm9mZnNldCIsImxlbmd0aCIsIm1hcmsiLCJjcmVhdGUiLCJkb2N1bWVudCIsIm5vZGUiLCJhc3NlcnRQYXRoIiwiYWRkTWFyayIsInVwZGF0ZU5vZGUiLCJzZXQiLCJpbnNlcnRfbm9kZSIsImluZGV4IiwicmVzdCIsInNsaWNlIiwicGFyZW50IiwiaW5zZXJ0Tm9kZSIsImluc2VydF90ZXh0IiwidGV4dCIsIm1hcmtzIiwiQXJyYXkiLCJpc0FycmF5IiwiY3JlYXRlU2V0Iiwic2VsZWN0aW9uIiwiYW5jaG9yS2V5IiwiZm9jdXNLZXkiLCJhbmNob3JPZmZzZXQiLCJmb2N1c09mZnNldCIsImluc2VydFRleHQiLCJrZXkiLCJtb3ZlQW5jaG9yIiwibW92ZUZvY3VzIiwibWVyZ2Vfbm9kZSIsIndpdGhQYXRoIiwiY29uY2F0Iiwib25lIiwidHdvIiwiZ2V0UGFyZW50Iiwib25lSW5kZXgiLCJub2RlcyIsImluZGV4T2YiLCJ0d29JbmRleCIsIm1lcmdlTm9kZSIsImtpbmQiLCJub3JtYWxpemUiLCJtb3ZlQW5jaG9yVG8iLCJtb3ZlRm9jdXNUbyIsIm1vdmVfbm9kZSIsIm5ld1BhdGgiLCJuZXdJbmRleCIsIm5ld1BhcmVudFBhdGgiLCJvbGRQYXJlbnRQYXRoIiwib2xkSW5kZXgiLCJyZW1vdmVOb2RlIiwidGFyZ2V0IiwiZXZlcnkiLCJ4IiwiaSIsInJlbW92ZV9tYXJrIiwicmVtb3ZlTWFyayIsInJlbW92ZV9ub2RlIiwic3RhcnRLZXkiLCJlbmRLZXkiLCJpc1NldCIsImhhc1N0YXJ0Tm9kZSIsImhhc05vZGUiLCJoYXNFbmROb2RlIiwicHJldiIsImdldFByZXZpb3VzVGV4dCIsIm5leHQiLCJnZXROZXh0VGV4dCIsIm1vdmVTdGFydFRvIiwiZGVzZWxlY3QiLCJtb3ZlRW5kVG8iLCJyZW1vdmVfdGV4dCIsInJhbmdlT2Zmc2V0IiwicmVtb3ZlVGV4dCIsInNldF9kYXRhIiwicHJvcGVydGllcyIsImRhdGEiLCJtZXJnZSIsInNldF9tYXJrIiwidXBkYXRlTWFyayIsInNldF9ub2RlIiwid2FybiIsInNldF9zZWxlY3Rpb24iLCJhbmNob3JQYXRoIiwidW5kZWZpbmVkIiwiZm9jdXNQYXRoIiwic3BsaXRfbm9kZSIsInBvc2l0aW9uIiwic3BsaXROb2RlIiwic3RhcnRPZmZzZXQiLCJlbmRPZmZzZXQiLCJhcHBseU9wZXJhdGlvbiIsInR5cGUiLCJhcHBseSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsUUFBUSxxQkFBTSx1QkFBTixDQUFkOztBQUVBOzs7Ozs7QUFNQSxJQUFNQyxXQUFXOztBQUVmOzs7Ozs7OztBQVFBQyxVQVZlLG9CQVVOQyxLQVZNLEVBVUNDLFNBVkQsRUFVWTtBQUFBLFFBQ2pCQyxJQURpQixHQUNRRCxTQURSLENBQ2pCQyxJQURpQjtBQUFBLFFBQ1hDLE1BRFcsR0FDUUYsU0FEUixDQUNYRSxNQURXO0FBQUEsUUFDSEMsTUFERyxHQUNRSCxTQURSLENBQ0hHLE1BREc7O0FBRXpCLFFBQU1DLE9BQU8sZUFBS0MsTUFBTCxDQUFZTCxVQUFVSSxJQUF0QixDQUFiO0FBRnlCLGlCQUdOTCxLQUhNO0FBQUEsUUFHbkJPLFFBSG1CLFVBR25CQSxRQUhtQjs7QUFJekIsUUFBSUMsT0FBT0QsU0FBU0UsVUFBVCxDQUFvQlAsSUFBcEIsQ0FBWDtBQUNBTSxXQUFPQSxLQUFLRSxPQUFMLENBQWFQLE1BQWIsRUFBcUJDLE1BQXJCLEVBQTZCQyxJQUE3QixDQUFQO0FBQ0FFLGVBQVdBLFNBQVNJLFVBQVQsQ0FBb0JILElBQXBCLENBQVg7QUFDQVIsWUFBUUEsTUFBTVksR0FBTixDQUFVLFVBQVYsRUFBc0JMLFFBQXRCLENBQVI7QUFDQSxXQUFPUCxLQUFQO0FB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QixHQUFMLElBQVlpQyxNQUFaLElBQXNCNEIsWUFBWUcsU0FBdEMsRUFBaUQ7QUFDL0N0RSxrQkFBWUEsVUFBVWtELFNBQVYsQ0FBb0JKLEtBQUt4QyxHQUF6QixFQUE4QmdFLFlBQVlILFFBQTFDLENBQVo7QUFDQTlDLGtCQUFZLElBQVo7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsUUFBSUEsU0FBSixFQUFlO0FBQ2JyQixrQkFBWUEsVUFBVXFCLFNBQVYsQ0FBb0J2QyxRQUFwQixDQUFaO0FBQ0Q7O0FBRUQ7QUFDQVAsWUFBUUEsTUFBTVksR0FBTixDQUFVLFVBQVYsRUFBc0JMLFFBQXRCLEVBQWdDSyxHQUFoQyxDQUFvQyxXQUFwQyxFQUFpRGEsU0FBakQsQ0FBUjtBQUNBLFdBQU96QixLQUFQO0FBQ0Q7QUEvYmMsQ0FBakI7O0FBbWNBOzs7Ozs7OztBQVFBLFNBQVNnRyxjQUFULENBQXdCaEcsS0FBeEIsRUFBK0JDLFNBQS9CLEVBQTBDO0FBQUEsTUFDaENnRyxJQURnQyxHQUN2QmhHLFNBRHVCLENBQ2hDZ0csSUFEZ0M7O0FBRXhDLE1BQU1DLFFBQVFwRyxTQUFTbUcsSUFBVCxDQUFkOztBQUVBLE1BQUksQ0FBQ0MsS0FBTCxFQUFZO0FBQ1YsVUFBTSxJQUFJQyxLQUFKLCtCQUFzQ0YsSUFBdEMsUUFBTjtBQUNEOztBQUVEcEcsUUFBTW9HLElBQU4sRUFBWWhHLFNBQVo7QUFDQUQsVUFBUWtHLE1BQU1sRyxLQUFOLEVBQWFDLFNBQWIsQ0FBUjtBQUNBLFNBQU9ELEtBQVA7QUFDRDs7QUFFRDs7Ozs7O2tCQU1lZ0csYyIsImZpbGUiOiJhcHBseS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IE5vZGUgZnJvbSAnLi4vbW9kZWxzL25vZGUnXG5pbXBvcnQgTWFyayBmcm9tICcuLi9tb2RlbHMvbWFyaydcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJ1xuXG4vKipcbiAqIERlYnVnLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdzbGF0ZTpvcGVyYXRpb246YXBwbHknKVxuXG4vKipcbiAqIEFwcGx5aW5nIGZ1bmN0aW9ucy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IEFQUExJRVJTID0ge1xuXG4gIC8qKlxuICAgKiBBZGQgbWFyayB0byB0ZXh0IGF0IGBvZmZzZXRgIGFuZCBgbGVuZ3RoYCBpbiBub2RlIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgYWRkX21hcmsoc3RhdGUsIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHsgcGF0aCwgb2Zmc2V0LCBsZW5ndGggfSA9IG9wZXJhdGlvblxuICAgIGNvbnN0IG1hcmsgPSBNYXJrLmNyZWF0ZShvcGVyYXRpb24ubWFyaylcbiAgICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmFzc2VydFBhdGgocGF0aClcbiAgICBub2RlID0gbm9kZS5hZGRNYXJrKG9mZnNldCwgbGVuZ3RoLCBtYXJrKVxuICAgIGRvY3VtZW50ID0gZG9jdW1lbnQudXBkYXRlTm9kZShub2RlKVxuICAgIHN0YXRlID0gc3RhdGUuc2V0KCdkb2N1bWVudCcsIGRvY3VtZW50KVxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBgbm9kZWAgYXQgYGluZGV4YCBpbiBhIG5vZGUgYnkgYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3BlcmF0aW9uXG4gICAqIEByZXR1cm4ge1N0YXRlfVxuICAgKi9cblxuICBpbnNlcnRfbm9kZShzdGF0ZSwgb3BlcmF0aW9uKSB7XG4gICAgY29uc3QgeyBwYXRoIH0gPSBvcGVyYXRpb25cbiAgICBjb25zdCBub2RlID0gTm9kZS5jcmVhdGUob3BlcmF0aW9uLm5vZGUpXG4gICAgY29uc3QgaW5kZXggPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cbiAgICBjb25zdCByZXN0ID0gcGF0aC5zbGljZSgwLCAtMSlcbiAgICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuYXNzZXJ0UGF0aChyZXN0KVxuICAgIHBhcmVudCA9IHBhcmVudC5pbnNlcnROb2RlKGluZGV4LCBub2RlKVxuICAgIGRvY3VtZW50ID0gZG9jdW1lbnQudXBkYXRlTm9kZShwYXJlbnQpXG4gICAgc3RhdGUgPSBzdGF0ZS5zZXQoJ2RvY3VtZW50JywgZG9jdW1lbnQpXG4gICAgcmV0dXJuIHN0YXRlXG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc2VydCBgdGV4dGAgYXQgYG9mZnNldGAgaW4gbm9kZSBieSBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcGVyYXRpb25cbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIGluc2VydF90ZXh0KHN0YXRlLCBvcGVyYXRpb24pIHtcbiAgICBjb25zdCB7IHBhdGgsIG9mZnNldCwgdGV4dCB9ID0gb3BlcmF0aW9uXG5cbiAgICBsZXQgeyBtYXJrcyB9ID0gb3BlcmF0aW9uXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWFya3MpKSBtYXJrcyA9IE1hcmsuY3JlYXRlU2V0KG1hcmtzKVxuXG4gICAgbGV0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiB9ID0gc3RhdGVcbiAgICBjb25zdCB7IGFuY2hvcktleSwgZm9jdXNLZXksIGFuY2hvck9mZnNldCwgZm9jdXNPZmZzZXQgfSA9IHNlbGVjdGlvblxuICAgIGxldCBub2RlID0gZG9jdW1lbnQuYXNzZXJ0UGF0aChwYXRoKVxuXG4gICAgLy8gVXBkYXRlIHRoZSBkb2N1bWVudFxuICAgIG5vZGUgPSBub2RlLmluc2VydFRleHQob2Zmc2V0LCB0ZXh0LCBtYXJrcylcbiAgICBkb2N1bWVudCA9IGRvY3VtZW50LnVwZGF0ZU5vZGUobm9kZSlcblxuICAgIC8vIFVwZGF0ZSB0aGUgc2VsZWN0aW9uXG4gICAgaWYgKGFuY2hvcktleSA9PSBub2RlLmtleSAmJiBhbmNob3JPZmZzZXQgPj0gb2Zmc2V0KSB7XG4gICAgICBzZWxlY3Rpb24gPSBzZWxlY3Rpb24ubW92ZUFuY2hvcih0ZXh0Lmxlbmd0aClcbiAgICB9XG4gICAgaWYgKGZvY3VzS2V5ID09IG5vZGUua2V5ICYmIGZvY3VzT2Zmc2V0ID49IG9mZnNldCkge1xuICAgICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLm1vdmVGb2N1cyh0ZXh0Lmxlbmd0aClcbiAgICB9XG5cbiAgICBzdGF0ZSA9IHN0YXRlLnNldCgnZG9jdW1lbnQnLCBkb2N1bWVudCkuc2V0KCdzZWxlY3Rpb24nLCBzZWxlY3Rpb24pXG4gICAgcmV0dXJuIHN0YXRlXG4gIH0sXG5cbiAgLyoqXG4gICAqIE1lcmdlIGEgbm9kZSBhdCBgcGF0aGAgd2l0aCB0aGUgcHJldmlvdXMgbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgbWVyZ2Vfbm9kZShzdGF0ZSwgb3BlcmF0aW9uKSB7XG4gICAgY29uc3QgeyBwYXRoIH0gPSBvcGVyYXRpb25cbiAgICBjb25zdCB3aXRoUGF0aCA9IHBhdGguc2xpY2UoMCwgcGF0aC5sZW5ndGggLSAxKS5jb25jYXQoW3BhdGhbcGF0aC5sZW5ndGggLSAxXSAtIDFdKVxuICAgIGxldCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gICAgY29uc3Qgb25lID0gZG9jdW1lbnQuYXNzZXJ0UGF0aCh3aXRoUGF0aClcbiAgICBjb25zdCB0d28gPSBkb2N1bWVudC5hc3NlcnRQYXRoKHBhdGgpXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChvbmUua2V5KVxuICAgIGNvbnN0IG9uZUluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yob25lKVxuICAgIGNvbnN0IHR3b0luZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2YodHdvKVxuXG4gICAgLy8gUGVyZm9ybSB0aGUgbWVyZ2UgaW4gdGhlIGRvY3VtZW50LlxuICAgIHBhcmVudCA9IHBhcmVudC5tZXJnZU5vZGUob25lSW5kZXgsIHR3b0luZGV4KVxuICAgIGRvY3VtZW50ID0gZG9jdW1lbnQudXBkYXRlTm9kZShwYXJlbnQpXG5cbiAgICAvLyBJZiB0aGUgbm9kZXMgYXJlIHRleHQgbm9kZXMgYW5kIHRoZSBzZWxlY3Rpb24gaXMgaW5zaWRlIHRoZSBzZWNvbmQgbm9kZVxuICAgIC8vIHVwZGF0ZSBpdCB0byByZWZlciB0byB0aGUgZmlyc3Qgbm9kZSBpbnN0ZWFkLlxuICAgIGlmIChvbmUua2luZCA9PSAndGV4dCcpIHtcbiAgICAgIGNvbnN0IHsgYW5jaG9yS2V5LCBhbmNob3JPZmZzZXQsIGZvY3VzS2V5LCBmb2N1c09mZnNldCB9ID0gc2VsZWN0aW9uXG4gICAgICBsZXQgbm9ybWFsaXplID0gZmFsc2VcblxuICAgICAgaWYgKGFuY2hvcktleSA9PSB0d28ua2V5KSB7XG4gICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5tb3ZlQW5jaG9yVG8ob25lLmtleSwgb25lLnRleHQubGVuZ3RoICsgYW5jaG9yT2Zmc2V0KVxuICAgICAgICBub3JtYWxpemUgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChmb2N1c0tleSA9PSB0d28ua2V5KSB7XG4gICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5tb3ZlRm9jdXNUbyhvbmUua2V5LCBvbmUudGV4dC5sZW5ndGggKyBmb2N1c09mZnNldClcbiAgICAgICAgbm9ybWFsaXplID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAobm9ybWFsaXplKSB7XG4gICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5ub3JtYWxpemUoZG9jdW1lbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBkb2N1bWVudCBhbmQgc2VsZWN0aW9uLlxuICAgIHN0YXRlID0gc3RhdGUuc2V0KCdkb2N1bWVudCcsIGRvY3VtZW50KS5zZXQoJ3NlbGVjdGlvbicsIHNlbGVjdGlvbilcbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICAvKipcbiAgICogTW92ZSBhIG5vZGUgYnkgYHBhdGhgIHRvIGBuZXdQYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgbW92ZV9ub2RlKHN0YXRlLCBvcGVyYXRpb24pIHtcbiAgICBjb25zdCB7IHBhdGgsIG5ld1BhdGggfSA9IG9wZXJhdGlvblxuICAgIGNvbnN0IG5ld0luZGV4ID0gbmV3UGF0aFtuZXdQYXRoLmxlbmd0aCAtIDFdXG4gICAgY29uc3QgbmV3UGFyZW50UGF0aCA9IG5ld1BhdGguc2xpY2UoMCwgLTEpXG4gICAgY29uc3Qgb2xkUGFyZW50UGF0aCA9IHBhdGguc2xpY2UoMCwgLTEpXG4gICAgY29uc3Qgb2xkSW5kZXggPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cbiAgICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuYXNzZXJ0UGF0aChwYXRoKVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBub2RlIGZyb20gaXRzIGN1cnJlbnQgcGFyZW50LlxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQobm9kZS5rZXkpXG4gICAgcGFyZW50ID0gcGFyZW50LnJlbW92ZU5vZGUob2xkSW5kZXgpXG4gICAgZG9jdW1lbnQgPSBkb2N1bWVudC51cGRhdGVOb2RlKHBhcmVudClcblxuICAgIC8vIEZpbmQgdGhlIG5ldyB0YXJnZXQuLi5cbiAgICBsZXQgdGFyZ2V0XG5cbiAgICAvLyBJZiB0aGUgb2xkIHBhdGggYW5kIHRoZSByZXN0IG9mIHRoZSBuZXcgcGF0aCBhcmUgdGhlIHNhbWUsIHRoZW4gdGhlIG5ld1xuICAgIC8vIHRhcmdldCBpcyB0aGUgb2xkIHBhcmVudC5cbiAgICBpZiAoXG4gICAgICAob2xkUGFyZW50UGF0aC5ldmVyeSgoeCwgaSkgPT4geCA9PT0gbmV3UGFyZW50UGF0aFtpXSkpICYmXG4gICAgICAob2xkUGFyZW50UGF0aC5sZW5ndGggPT09IG5ld1BhcmVudFBhdGgubGVuZ3RoKVxuICAgICkge1xuICAgICAgdGFyZ2V0ID0gcGFyZW50XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgb2xkIHBhdGggcmVtb3ZhbCByZXN1bHRlZCBpbiB0aGUgbmV3IHBhdGggYmVpbmcgbm8gbG9uZ2VyXG4gICAgLy8gY29ycmVjdCwgd2UgbmVlZCB0byBkZWNyZW1lbnQgdGhlIG5ldyBwYXRoIGF0IHRoZSBvbGQgcGF0aCdzIGxhc3QgaW5kZXguXG4gICAgZWxzZSBpZiAoXG4gICAgICAob2xkUGFyZW50UGF0aC5ldmVyeSgoeCwgaSkgPT4geCA9PT0gbmV3UGFyZW50UGF0aFtpXSkpICYmXG4gICAgICAob2xkSW5kZXggPCBuZXdQYXJlbnRQYXRoW29sZFBhcmVudFBhdGgubGVuZ3RoXSlcbiAgICApIHtcbiAgICAgIG5ld1BhcmVudFBhdGhbb2xkUGFyZW50UGF0aC5sZW5ndGhdLS1cbiAgICAgIHRhcmdldCA9IGRvY3VtZW50LmFzc2VydFBhdGgobmV3UGFyZW50UGF0aClcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHdlIGNhbiBqdXN0IGdyYWIgdGhlIHRhcmdldCBub3JtYWxseS4uLlxuICAgIGVsc2Uge1xuICAgICAgdGFyZ2V0ID0gZG9jdW1lbnQuYXNzZXJ0UGF0aChuZXdQYXJlbnRQYXRoKVxuICAgIH1cblxuICAgIC8vIEluc2VydCB0aGUgbmV3IG5vZGUgdG8gaXRzIG5ldyBwYXJlbnQuXG4gICAgdGFyZ2V0ID0gdGFyZ2V0Lmluc2VydE5vZGUobmV3SW5kZXgsIG5vZGUpXG4gICAgZG9jdW1lbnQgPSBkb2N1bWVudC51cGRhdGVOb2RlKHRhcmdldClcbiAgICBzdGF0ZSA9IHN0YXRlLnNldCgnZG9jdW1lbnQnLCBkb2N1bWVudClcbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIG1hcmsgZnJvbSB0ZXh0IGF0IGBvZmZzZXRgIGFuZCBgbGVuZ3RoYCBpbiBub2RlIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgcmVtb3ZlX21hcmsoc3RhdGUsIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHsgcGF0aCwgb2Zmc2V0LCBsZW5ndGggfSA9IG9wZXJhdGlvblxuICAgIGNvbnN0IG1hcmsgPSBNYXJrLmNyZWF0ZShvcGVyYXRpb24ubWFyaylcbiAgICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmFzc2VydFBhdGgocGF0aClcbiAgICBub2RlID0gbm9kZS5yZW1vdmVNYXJrKG9mZnNldCwgbGVuZ3RoLCBtYXJrKVxuICAgIGRvY3VtZW50ID0gZG9jdW1lbnQudXBkYXRlTm9kZShub2RlKVxuICAgIHN0YXRlID0gc3RhdGUuc2V0KCdkb2N1bWVudCcsIGRvY3VtZW50KVxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBub2RlIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgcmVtb3ZlX25vZGUoc3RhdGUsIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHsgcGF0aCB9ID0gb3BlcmF0aW9uXG4gICAgbGV0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiB9ID0gc3RhdGVcbiAgICBjb25zdCB7IHN0YXJ0S2V5LCBlbmRLZXkgfSA9IHNlbGVjdGlvblxuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5hc3NlcnRQYXRoKHBhdGgpXG5cbiAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGlzIHNldCwgY2hlY2sgdG8gc2VlIGlmIGl0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuXG4gICAgaWYgKHNlbGVjdGlvbi5pc1NldCkge1xuICAgICAgY29uc3QgaGFzU3RhcnROb2RlID0gbm9kZS5oYXNOb2RlKHN0YXJ0S2V5KVxuICAgICAgY29uc3QgaGFzRW5kTm9kZSA9IG5vZGUuaGFzTm9kZShlbmRLZXkpXG4gICAgICBsZXQgbm9ybWFsaXplID0gZmFsc2VcblxuICAgICAgLy8gSWYgb25lIG9mIHRoZSBzZWxlY3Rpb24ncyBub2RlcyBpcyBiZWluZyByZW1vdmVkLCB3ZSBuZWVkIHRvIHVwZGF0ZSBpdC5cbiAgICAgIGlmIChoYXNTdGFydE5vZGUpIHtcbiAgICAgICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmdldFByZXZpb3VzVGV4dChzdGFydEtleSlcbiAgICAgICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmdldE5leHRUZXh0KHN0YXJ0S2V5KVxuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLm1vdmVTdGFydFRvKHByZXYua2V5LCBwcmV2LnRleHQubGVuZ3RoKVxuICAgICAgICAgIG5vcm1hbGl6ZSA9IHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLm1vdmVTdGFydFRvKG5leHQua2V5LCAwKVxuICAgICAgICAgIG5vcm1hbGl6ZSA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxlY3Rpb24gPSBzZWxlY3Rpb24uZGVzZWxlY3QoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNFbmROb2RlKSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSBkb2N1bWVudC5nZXRQcmV2aW91c1RleHQoZW5kS2V5KVxuICAgICAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuZ2V0TmV4dFRleHQoZW5kS2V5KVxuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLm1vdmVFbmRUbyhwcmV2LmtleSwgcHJldi50ZXh0Lmxlbmd0aClcbiAgICAgICAgICBub3JtYWxpemUgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAobmV4dCkge1xuICAgICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5tb3ZlRW5kVG8obmV4dC5rZXksIDApXG4gICAgICAgICAgbm9ybWFsaXplID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5kZXNlbGVjdCgpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5vcm1hbGl6ZSkge1xuICAgICAgICBzZWxlY3Rpb24gPSBzZWxlY3Rpb24ubm9ybWFsaXplKGRvY3VtZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgbm9kZSBmcm9tIHRoZSBkb2N1bWVudC5cbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0UGFyZW50KG5vZGUua2V5KVxuICAgIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yobm9kZSlcbiAgICBwYXJlbnQgPSBwYXJlbnQucmVtb3ZlTm9kZShpbmRleClcbiAgICBkb2N1bWVudCA9IGRvY3VtZW50LnVwZGF0ZU5vZGUocGFyZW50KVxuXG4gICAgLy8gVXBkYXRlIHRoZSBkb2N1bWVudCBhbmQgc2VsZWN0aW9uLlxuICAgIHN0YXRlID0gc3RhdGUuc2V0KCdkb2N1bWVudCcsIGRvY3VtZW50KS5zZXQoJ3NlbGVjdGlvbicsIHNlbGVjdGlvbilcbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGB0ZXh0YCBhdCBgb2Zmc2V0YCBpbiBub2RlIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgcmVtb3ZlX3RleHQoc3RhdGUsIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHsgcGF0aCwgb2Zmc2V0LCB0ZXh0IH0gPSBvcGVyYXRpb25cbiAgICBjb25zdCB7IGxlbmd0aCB9ID0gdGV4dFxuICAgIGNvbnN0IHJhbmdlT2Zmc2V0ID0gb2Zmc2V0ICsgbGVuZ3RoXG4gICAgbGV0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiB9ID0gc3RhdGVcbiAgICBjb25zdCB7IGFuY2hvcktleSwgZm9jdXNLZXksIGFuY2hvck9mZnNldCwgZm9jdXNPZmZzZXQgfSA9IHNlbGVjdGlvblxuICAgIGxldCBub2RlID0gZG9jdW1lbnQuYXNzZXJ0UGF0aChwYXRoKVxuXG4gICAgLy8gVXBkYXRlIHRoZSBzZWxlY3Rpb24uXG4gICAgaWYgKGFuY2hvcktleSA9PSBub2RlLmtleSAmJiBhbmNob3JPZmZzZXQgPj0gcmFuZ2VPZmZzZXQpIHtcbiAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5tb3ZlQW5jaG9yKC1sZW5ndGgpXG4gICAgfVxuXG4gICAgaWYgKGZvY3VzS2V5ID09IG5vZGUua2V5ICYmIGZvY3VzT2Zmc2V0ID49IHJhbmdlT2Zmc2V0KSB7XG4gICAgICBzZWxlY3Rpb24gPSBzZWxlY3Rpb24ubW92ZUZvY3VzKC1sZW5ndGgpXG4gICAgfVxuXG4gICAgbm9kZSA9IG5vZGUucmVtb3ZlVGV4dChvZmZzZXQsIGxlbmd0aClcbiAgICBkb2N1bWVudCA9IGRvY3VtZW50LnVwZGF0ZU5vZGUobm9kZSlcbiAgICBzdGF0ZSA9IHN0YXRlLnNldCgnZG9jdW1lbnQnLCBkb2N1bWVudCkuc2V0KCdzZWxlY3Rpb24nLCBzZWxlY3Rpb24pXG4gICAgcmV0dXJuIHN0YXRlXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldCBgZGF0YWAgb24gYHN0YXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgc2V0X2RhdGEoc3RhdGUsIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHsgcHJvcGVydGllcyB9ID0gb3BlcmF0aW9uXG4gICAgbGV0IHsgZGF0YSB9ID0gc3RhdGVcblxuICAgIGRhdGEgPSBkYXRhLm1lcmdlKHByb3BlcnRpZXMpXG4gICAgc3RhdGUgPSBzdGF0ZS5zZXQoJ2RhdGEnLCBkYXRhKVxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgYHByb3BlcnRpZXNgIG9uIG1hcmsgb24gdGV4dCBhdCBgb2Zmc2V0YCBhbmQgYGxlbmd0aGAgaW4gbm9kZSBieSBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcGVyYXRpb25cbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIHNldF9tYXJrKHN0YXRlLCBvcGVyYXRpb24pIHtcbiAgICBjb25zdCB7IHBhdGgsIG9mZnNldCwgbGVuZ3RoLCBwcm9wZXJ0aWVzIH0gPSBvcGVyYXRpb25cbiAgICBjb25zdCBtYXJrID0gTWFyay5jcmVhdGUob3BlcmF0aW9uLm1hcmspXG4gICAgbGV0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5hc3NlcnRQYXRoKHBhdGgpXG4gICAgbm9kZSA9IG5vZGUudXBkYXRlTWFyayhvZmZzZXQsIGxlbmd0aCwgbWFyaywgcHJvcGVydGllcylcbiAgICBkb2N1bWVudCA9IGRvY3VtZW50LnVwZGF0ZU5vZGUobm9kZSlcbiAgICBzdGF0ZSA9IHN0YXRlLnNldCgnZG9jdW1lbnQnLCBkb2N1bWVudClcbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICAvKipcbiAgICogU2V0IGBwcm9wZXJ0aWVzYCBvbiBhIG5vZGUgYnkgYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3BlcmF0aW9uXG4gICAqIEByZXR1cm4ge1N0YXRlfVxuICAgKi9cblxuICBzZXRfbm9kZShzdGF0ZSwgb3BlcmF0aW9uKSB7XG4gICAgY29uc3QgeyBwYXRoLCBwcm9wZXJ0aWVzIH0gPSBvcGVyYXRpb25cbiAgICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmFzc2VydFBhdGgocGF0aClcblxuICAgIC8vIFdhcm4gd2hlbiB0cnlpbmcgdG8gb3ZlcndpdGUgYSBub2RlJ3MgY2hpbGRyZW4uXG4gICAgaWYgKHByb3BlcnRpZXMubm9kZXMgJiYgcHJvcGVydGllcy5ub2RlcyAhPSBub2RlLm5vZGVzKSB7XG4gICAgICBsb2dnZXIud2FybignVXBkYXRpbmcgYSBOb2RlXFwncyBgbm9kZXNgIHByb3BlcnR5IHZpYSBgc2V0Tm9kZSgpYCBpcyBub3QgYWxsb3dlZC4gVXNlIHRoZSBhcHByb3ByaWF0ZSBpbnNlcnRpb24gYW5kIHJlbW92YWwgb3BlcmF0aW9ucyBpbnN0ZWFkLiBUaGUgb3BlYXJ0aW9uIGluIHF1ZXN0aW9uIHdhczonLCBvcGVyYXRpb24pXG4gICAgICBkZWxldGUgcHJvcGVydGllcy5ub2Rlc1xuICAgIH1cblxuICAgIC8vIFdhcm4gd2hlbiB0cnlpbmcgdG8gY2hhbmdlIGEgbm9kZSdzIGtleS5cbiAgICBpZiAocHJvcGVydGllcy5rZXkgJiYgcHJvcGVydGllcy5rZXkgIT0gbm9kZS5rZXkpIHtcbiAgICAgIGxvZ2dlci53YXJuKCdVcGRhdGluZyBhIE5vZGVcXCdzIGBrZXlgIHByb3BlcnR5IHZpYSBgc2V0Tm9kZSgpYCBpcyBub3QgYWxsb3dlZC4gVGhlcmUgc2hvdWxkIGJlIG5vIHJlYXNvbiB0byBkbyB0aGlzLiBUaGUgb3BlYXJ0aW9uIGluIHF1ZXN0aW9uIHdhczonLCBvcGVyYXRpb24pXG4gICAgICBkZWxldGUgcHJvcGVydGllcy5rZXlcbiAgICB9XG5cbiAgICBub2RlID0gbm9kZS5tZXJnZShwcm9wZXJ0aWVzKVxuICAgIGRvY3VtZW50ID0gZG9jdW1lbnQudXBkYXRlTm9kZShub2RlKVxuICAgIHN0YXRlID0gc3RhdGUuc2V0KCdkb2N1bWVudCcsIGRvY3VtZW50KVxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgYHByb3BlcnRpZXNgIG9uIHRoZSBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcGVyYXRpb25cbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIHNldF9zZWxlY3Rpb24oc3RhdGUsIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7IC4uLm9wZXJhdGlvbi5wcm9wZXJ0aWVzIH1cbiAgICBsZXQgeyBkb2N1bWVudCwgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuXG4gICAgaWYgKHByb3BlcnRpZXMubWFya3MgIT0gbnVsbCkge1xuICAgICAgcHJvcGVydGllcy5tYXJrcyA9IE1hcmsuY3JlYXRlU2V0KHByb3BlcnRpZXMubWFya3MpXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuYW5jaG9yUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm9wZXJ0aWVzLmFuY2hvcktleSA9IHByb3BlcnRpZXMuYW5jaG9yUGF0aCA9PT0gbnVsbFxuICAgICAgICA/IG51bGxcbiAgICAgICAgOiBkb2N1bWVudC5hc3NlcnRQYXRoKHByb3BlcnRpZXMuYW5jaG9yUGF0aCkua2V5XG4gICAgICBkZWxldGUgcHJvcGVydGllcy5hbmNob3JQYXRoXG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuZm9jdXNQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHByb3BlcnRpZXMuZm9jdXNLZXkgPSBwcm9wZXJ0aWVzLmZvY3VzUGF0aCA9PT0gbnVsbFxuICAgICAgICA/IG51bGxcbiAgICAgICAgOiBkb2N1bWVudC5hc3NlcnRQYXRoKHByb3BlcnRpZXMuZm9jdXNQYXRoKS5rZXlcbiAgICAgIGRlbGV0ZSBwcm9wZXJ0aWVzLmZvY3VzUGF0aFxuICAgIH1cblxuICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5tZXJnZShwcm9wZXJ0aWVzKVxuICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5ub3JtYWxpemUoZG9jdW1lbnQpXG4gICAgc3RhdGUgPSBzdGF0ZS5zZXQoJ3NlbGVjdGlvbicsIHNlbGVjdGlvbilcbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICAvKipcbiAgICogU3BsaXQgYSBub2RlIGJ5IGBwYXRoYCBhdCBgb2Zmc2V0YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIHtTdGF0ZX1cbiAgICovXG5cbiAgc3BsaXRfbm9kZShzdGF0ZSwgb3BlcmF0aW9uKSB7XG4gICAgY29uc3QgeyBwYXRoLCBwb3NpdGlvbiB9ID0gb3BlcmF0aW9uXG4gICAgbGV0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiB9ID0gc3RhdGVcblxuICAgIC8vIENhbGN1bGF0ZSBhIGZldyB0aGluZ3MuLi5cbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuYXNzZXJ0UGF0aChwYXRoKVxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQobm9kZS5rZXkpXG4gICAgY29uc3QgaW5kZXggPSBwYXJlbnQubm9kZXMuaW5kZXhPZihub2RlKVxuXG4gICAgLy8gU3BsaXQgdGhlIG5vZGUgYnkgaXRzIHBhcmVudC5cbiAgICBwYXJlbnQgPSBwYXJlbnQuc3BsaXROb2RlKGluZGV4LCBwb3NpdGlvbilcbiAgICBkb2N1bWVudCA9IGRvY3VtZW50LnVwZGF0ZU5vZGUocGFyZW50KVxuXG4gICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgd2UgbmVlZCB0byB1cGRhdGUgdGhlIHNlbGVjdGlvbi4uLlxuICAgIGNvbnN0IHsgc3RhcnRLZXksIGVuZEtleSwgc3RhcnRPZmZzZXQsIGVuZE9mZnNldCB9ID0gc2VsZWN0aW9uXG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmdldE5leHRUZXh0KG5vZGUua2V5KVxuICAgIGxldCBub3JtYWxpemUgPSBmYWxzZVxuXG4gICAgLy8gSWYgdGhlIHN0YXJ0IHBvaW50IGlzIGFmdGVyIG9yIGVxdWFsIHRvIHRoZSBzcGxpdCwgdXBkYXRlIGl0LlxuICAgIGlmIChub2RlLmtleSA9PSBzdGFydEtleSAmJiBwb3NpdGlvbiA8PSBzdGFydE9mZnNldCkge1xuICAgICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLm1vdmVTdGFydFRvKG5leHQua2V5LCBzdGFydE9mZnNldCAtIHBvc2l0aW9uKVxuICAgICAgbm9ybWFsaXplID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIElmIHRoZSBlbmQgcG9pbnQgaXMgYWZ0ZXIgb3IgZXF1YWwgdG8gdGhlIHNwbGl0LCB1cGRhdGUgaXQuXG4gICAgaWYgKG5vZGUua2V5ID09IGVuZEtleSAmJiBwb3NpdGlvbiA8PSBlbmRPZmZzZXQpIHtcbiAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5tb3ZlRW5kVG8obmV4dC5rZXksIGVuZE9mZnNldCAtIHBvc2l0aW9uKVxuICAgICAgbm9ybWFsaXplID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgc2VsZWN0aW9uIGlmIHdlIGNoYW5nZWQgaXQsIHNpbmNlIHRoZSBtZXRob2RzIHdlIHVzZSBtaWdodFxuICAgIC8vIGxlYXZlIGl0IGluIGEgbm9uLW5vcm1hbGl6ZWQgc3RhdGUuXG4gICAgaWYgKG5vcm1hbGl6ZSkge1xuICAgICAgc2VsZWN0aW9uID0gc2VsZWN0aW9uLm5vcm1hbGl6ZShkb2N1bWVudClcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdGhlIHVwZGF0ZWQgc3RhdGUuXG4gICAgc3RhdGUgPSBzdGF0ZS5zZXQoJ2RvY3VtZW50JywgZG9jdW1lbnQpLnNldCgnc2VsZWN0aW9uJywgc2VsZWN0aW9uKVxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG59XG5cbi8qKlxuICogQXBwbHkgYW4gYG9wZXJhdGlvbmAgdG8gYSBgc3RhdGVgLlxuICpcbiAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb3BlcmF0aW9uXG4gKiBAcmV0dXJuIHtTdGF0ZX0gc3RhdGVcbiAqL1xuXG5mdW5jdGlvbiBhcHBseU9wZXJhdGlvbihzdGF0ZSwgb3BlcmF0aW9uKSB7XG4gIGNvbnN0IHsgdHlwZSB9ID0gb3BlcmF0aW9uXG4gIGNvbnN0IGFwcGx5ID0gQVBQTElFUlNbdHlwZV1cblxuICBpZiAoIWFwcGx5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG9wZXJhdGlvbiB0eXBlOiBcIiR7dHlwZX1cIi5gKVxuICB9XG5cbiAgZGVidWcodHlwZSwgb3BlcmF0aW9uKVxuICBzdGF0ZSA9IGFwcGx5KHN0YXRlLCBvcGVyYXRpb24pXG4gIHJldHVybiBzdGF0ZVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgYXBwbHlPcGVyYXRpb25cbiJdfQ==