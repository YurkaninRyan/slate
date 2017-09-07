'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _block = require('../models/block');

var _block2 = _interopRequireDefault(_block);

var _inline = require('../models/inline');

var _inline2 = _interopRequireDefault(_inline);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _node = require('../models/node');

var _node2 = _interopRequireDefault(_node);

var _core = require('../schemas/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.addMarkByKey = function (change, key, offset, length, mark) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  mark = _mark2.default.create(mark);
  var _options$normalize = options.normalize,
      normalize = _options$normalize === undefined ? true : _options$normalize;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  var ranges = node.getRanges();

  var operations = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  ranges.forEach(function (range) {
    var ax = o;
    var ay = ax + range.text.length;

    o += range.text.length;

    // If the range doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return;

    // If the range already has the mark, continue on.
    if (range.marks.has(mark)) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);

    operations.push({
      type: 'add_mark',
      path: path,
      offset: start,
      length: end - start,
      mark: mark
    });
  });

  change.applyOperations(operations);

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Insert a `fragment` at `index` in a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} index
 * @param {Fragment} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertFragmentByKey = function (change, key, index, fragment) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize2 = options.normalize,
      normalize = _options$normalize2 === undefined ? true : _options$normalize2;


  fragment.nodes.forEach(function (node, i) {
    change.insertNodeByKey(key, index + i, node);
  });

  if (normalize) {
    change.normalizeNodeByKey(key, _core2.default);
  }
};

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertNodeByKey = function (change, key, index, node) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize3 = options.normalize,
      normalize = _options$normalize3 === undefined ? true : _options$normalize3;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);

  change.applyOperation({
    type: 'insert_node',
    path: [].concat(_toConsumableArray(path), [index]),
    node: node
  });

  if (normalize) {
    change.normalizeNodeByKey(key, _core2.default);
  }
};

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertTextByKey = function (change, key, offset, text, marks) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var _options$normalize4 = options.normalize,
      normalize = _options$normalize4 === undefined ? true : _options$normalize4;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  marks = marks || node.getMarksAtIndex(offset);

  change.applyOperation({
    type: 'insert_text',
    path: path,
    offset: offset,
    text: text,
    marks: marks
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Merge a node by `key` with the previous node.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.mergeNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$normalize5 = options.normalize,
      normalize = _options$normalize5 === undefined ? true : _options$normalize5;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var previous = document.getPreviousSibling(key);

  if (!previous) {
    throw new Error('Unable to merge node with key "' + key + '", no previous key.');
  }

  var position = previous.kind == 'text' ? previous.text.length : previous.nodes.size;

  change.applyOperation({
    type: 'merge_node',
    path: path,
    position: position
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Move a node by `key` to a new parent by `newKey` and `index`.
 * `newKey` is the key of the container (it can be the document itself)
 *
 * @param {Change} change
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.moveNodeByKey = function (change, key, newKey, newIndex) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize6 = options.normalize,
      normalize = _options$normalize6 === undefined ? true : _options$normalize6;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var newPath = document.getPath(newKey);

  change.applyOperation({
    type: 'move_node',
    path: path,
    newPath: [].concat(_toConsumableArray(newPath), [newIndex])
  });

  if (normalize) {
    var parent = document.getCommonAncestor(key, newKey);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeMarkByKey = function (change, key, offset, length, mark) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  mark = _mark2.default.create(mark);
  var _options$normalize7 = options.normalize,
      normalize = _options$normalize7 === undefined ? true : _options$normalize7;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  var ranges = node.getRanges();

  var operations = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  ranges.forEach(function (range) {
    var ax = o;
    var ay = ax + range.text.length;

    o += range.text.length;

    // If the range doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return;

    // If the range already has the mark, continue on.
    if (!range.marks.has(mark)) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);

    operations.push({
      type: 'remove_mark',
      path: path,
      offset: start,
      length: end - start,
      mark: mark
    });
  });

  change.applyOperations(operations);

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Remove a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$normalize8 = options.normalize,
      normalize = _options$normalize8 === undefined ? true : _options$normalize8;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var node = document.getNode(key);

  change.applyOperation({
    type: 'remove_node',
    path: path,
    node: node
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeTextByKey = function (change, key, offset, length) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize9 = options.normalize,
      normalize = _options$normalize9 === undefined ? true : _options$normalize9;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  var ranges = node.getRanges();
  var text = node.text;


  var removals = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  ranges.forEach(function (range) {
    var ax = o;
    var ay = ax + range.text.length;

    o += range.text.length;

    // If the range doesn't overlap with the removal, continue on.
    if (ay < bx || by < ax) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);
    var string = text.slice(start, end);

    removals.push({
      type: 'remove_text',
      path: path,
      offset: start,
      text: string,
      marks: range.marks
    });
  });

  // Apply in reverse order, so subsequent removals don't impact previous ones.
  change.applyOperations(removals.reverse());

  if (normalize) {
    var block = document.getClosestBlock(key);
    change.normalizeNodeByKey(block.key, _core2.default);
  }
};

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setMarkByKey = function (change, key, offset, length, mark, properties) {
  var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  mark = _mark2.default.create(mark);
  properties = _mark2.default.createProperties(properties);
  var _options$normalize10 = options.normalize,
      normalize = _options$normalize10 === undefined ? true : _options$normalize10;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);

  change.applyOperation({
    type: 'set_mark',
    path: path,
    offset: offset,
    length: length,
    mark: mark,
    properties: properties
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setNodeByKey = function (change, key, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = _node2.default.createProperties(properties);
  var _options$normalize11 = options.normalize,
      normalize = _options$normalize11 === undefined ? true : _options$normalize11;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);
  var node = document.getNode(key);

  change.applyOperation({
    type: 'set_node',
    path: path,
    node: node,
    properties: properties
  });

  if (normalize) {
    change.normalizeNodeByKey(node.key, _core2.default);
  }
};

/**
 * Split a node by `key` at `position`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} position
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitNodeByKey = function (change, key, position) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize12 = options.normalize,
      normalize = _options$normalize12 === undefined ? true : _options$normalize12;
  var state = change.state;
  var document = state.document;

  var path = document.getPath(key);

  change.applyOperation({
    type: 'split_node',
    path: path,
    position: position
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Split a node deeply down the tree by `key`, `textKey` and `textOffset`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} position
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitDescendantsByKey = function (change, key, textKey, textOffset) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  if (key == textKey) {
    change.splitNodeByKey(textKey, textOffset, options);
    return;
  }

  var _options$normalize13 = options.normalize,
      normalize = _options$normalize13 === undefined ? true : _options$normalize13;
  var state = change.state;
  var document = state.document;


  var text = document.getNode(textKey);
  var ancestors = document.getAncestors(textKey);
  var nodes = ancestors.skipUntil(function (a) {
    return a.key == key;
  }).reverse().unshift(text);
  var previous = void 0;

  nodes.forEach(function (node) {
    var index = previous ? node.nodes.indexOf(previous) + 1 : textOffset;
    previous = node;
    change.splitNodeByKey(node.key, index, { normalize: false });
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapInlineByKey = function (change, key, properties, options) {
  var state = change.state;
  var document = state.document,
      selection = state.selection;

  var node = document.assertDescendant(key);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  change.unwrapInlineAtRange(range, properties, options);
};

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapBlockByKey = function (change, key, properties, options) {
  var state = change.state;
  var document = state.document,
      selection = state.selection;

  var node = document.assertDescendant(key);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  change.unwrapBlockAtRange(range, properties, options);
};

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$normalize14 = options.normalize,
      normalize = _options$normalize14 === undefined ? true : _options$normalize14;
  var state = change.state;
  var document = state.document;

  var parent = document.getParent(key);
  var node = parent.getChild(key);

  var index = parent.nodes.indexOf(node);
  var isFirst = index === 0;
  var isLast = index === parent.nodes.size - 1;

  var parentParent = document.getParent(parent.key);
  var parentIndex = parentParent.nodes.indexOf(parent);

  if (parent.nodes.size === 1) {
    change.moveNodeByKey(key, parentParent.key, parentIndex, { normalize: false });
    change.removeNodeByKey(parent.key, options);
  } else if (isFirst) {
    // Just move the node before its parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex, options);
  } else if (isLast) {
    // Just move the node after its parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex + 1, options);
  } else {
    // Split the parent.
    change.splitNodeByKey(parent.key, index, { normalize: false });

    // Extract the node in between the splitted parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex + 1, { normalize: false });

    if (normalize) {
      change.normalizeNodeByKey(parentParent.key, _core2.default);
    }
  }
};

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Change} change
 * @param {String} key The node to wrap
 * @param {Block|Object|String} inline The wrapping inline (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapInlineByKey = function (change, key, inline, options) {
  inline = _inline2.default.create(inline);
  inline = inline.set('nodes', inline.nodes.clear());

  var document = change.state.document;

  var node = document.assertDescendant(key);
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);

  change.insertNodeByKey(parent.key, index, inline, { normalize: false });
  change.moveNodeByKey(node.key, inline.key, 0, options);
};

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Change} change
 * @param {String} key The node to wrap
 * @param {Block|Object|String} block The wrapping block (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapBlockByKey = function (change, key, block, options) {
  block = _block2.default.create(block);
  block = block.set('nodes', block.nodes.clear());

  var document = change.state.document;

  var node = document.assertDescendant(key);
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);

  change.insertNodeByKey(parent.key, index, block, { normalize: false });
  change.moveNodeByKey(node.key, block.key, 0, options);
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFuZ2VzL2J5LWtleS5qcyJdLCJuYW1lcyI6WyJDaGFuZ2VzIiwiYWRkTWFya0J5S2V5IiwiY2hhbmdlIiwia2V5Iiwib2Zmc2V0IiwibGVuZ3RoIiwibWFyayIsIm9wdGlvbnMiLCJjcmVhdGUiLCJub3JtYWxpemUiLCJzdGF0ZSIsImRvY3VtZW50IiwicGF0aCIsImdldFBhdGgiLCJub2RlIiwiZ2V0Tm9kZSIsInJhbmdlcyIsImdldFJhbmdlcyIsIm9wZXJhdGlvbnMiLCJieCIsImJ5IiwibyIsImZvckVhY2giLCJyYW5nZSIsImF4IiwiYXkiLCJ0ZXh0IiwibWFya3MiLCJoYXMiLCJzdGFydCIsIk1hdGgiLCJtYXgiLCJlbmQiLCJtaW4iLCJwdXNoIiwidHlwZSIsImFwcGx5T3BlcmF0aW9ucyIsInBhcmVudCIsImdldFBhcmVudCIsIm5vcm1hbGl6ZU5vZGVCeUtleSIsImluc2VydEZyYWdtZW50QnlLZXkiLCJpbmRleCIsImZyYWdtZW50Iiwibm9kZXMiLCJpIiwiaW5zZXJ0Tm9kZUJ5S2V5IiwiYXBwbHlPcGVyYXRpb24iLCJpbnNlcnRUZXh0QnlLZXkiLCJnZXRNYXJrc0F0SW5kZXgiLCJtZXJnZU5vZGVCeUtleSIsInByZXZpb3VzIiwiZ2V0UHJldmlvdXNTaWJsaW5nIiwiRXJyb3IiLCJwb3NpdGlvbiIsImtpbmQiLCJzaXplIiwibW92ZU5vZGVCeUtleSIsIm5ld0tleSIsIm5ld0luZGV4IiwibmV3UGF0aCIsImdldENvbW1vbkFuY2VzdG9yIiwicmVtb3ZlTWFya0J5S2V5IiwicmVtb3ZlTm9kZUJ5S2V5IiwicmVtb3ZlVGV4dEJ5S2V5IiwicmVtb3ZhbHMiLCJzdHJpbmciLCJzbGljZSIsInJldmVyc2UiLCJibG9jayIsImdldENsb3Nlc3RCbG9jayIsInNldE1hcmtCeUtleSIsInByb3BlcnRpZXMiLCJjcmVhdGVQcm9wZXJ0aWVzIiwic2V0Tm9kZUJ5S2V5Iiwic3BsaXROb2RlQnlLZXkiLCJzcGxpdERlc2NlbmRhbnRzQnlLZXkiLCJ0ZXh0S2V5IiwidGV4dE9mZnNldCIsImFuY2VzdG9ycyIsImdldEFuY2VzdG9ycyIsInNraXBVbnRpbCIsImEiLCJ1bnNoaWZ0IiwiaW5kZXhPZiIsInVud3JhcElubGluZUJ5S2V5Iiwic2VsZWN0aW9uIiwiYXNzZXJ0RGVzY2VuZGFudCIsImZpcnN0IiwiZ2V0Rmlyc3RUZXh0IiwibGFzdCIsImdldExhc3RUZXh0IiwibW92ZVRvUmFuZ2VPZiIsInVud3JhcElubGluZUF0UmFuZ2UiLCJ1bndyYXBCbG9ja0J5S2V5IiwidW53cmFwQmxvY2tBdFJhbmdlIiwidW53cmFwTm9kZUJ5S2V5IiwiZ2V0Q2hpbGQiLCJpc0ZpcnN0IiwiaXNMYXN0IiwicGFyZW50UGFyZW50IiwicGFyZW50SW5kZXgiLCJ3cmFwSW5saW5lQnlLZXkiLCJpbmxpbmUiLCJzZXQiLCJjbGVhciIsIndyYXBCbG9ja0J5S2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxVQUFVLEVBQWhCOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZQUEsUUFBUUMsWUFBUixHQUF1QixVQUFDQyxNQUFELEVBQVNDLEdBQVQsRUFBY0MsTUFBZCxFQUFzQkMsTUFBdEIsRUFBOEJDLElBQTlCLEVBQXFEO0FBQUEsTUFBakJDLE9BQWlCLHVFQUFQLEVBQU87O0FBQzFFRCxTQUFPLGVBQUtFLE1BQUwsQ0FBWUYsSUFBWixDQUFQO0FBRDBFLDJCQUU3Q0MsT0FGNkMsQ0FFbEVFLFNBRmtFO0FBQUEsTUFFbEVBLFNBRmtFLHNDQUV0RCxJQUZzRDtBQUFBLE1BR2xFQyxLQUhrRSxHQUd4RFIsTUFId0QsQ0FHbEVRLEtBSGtFO0FBQUEsTUFJbEVDLFFBSmtFLEdBSXJERCxLQUpxRCxDQUlsRUMsUUFKa0U7O0FBSzFFLE1BQU1DLE9BQU9ELFNBQVNFLE9BQVQsQ0FBaUJWLEdBQWpCLENBQWI7QUFDQSxNQUFNVyxPQUFPSCxTQUFTSSxPQUFU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QSxVQUFRQSxNQUFNbUMsR0FBTixDQUFVLE9BQVYsRUFBbUJuQyxNQUFNekIsS0FBTixDQUFZNkQsS0FBWixFQUFuQixDQUFSOztBQUZ3RCxNQUloRDdGLFFBSmdELEdBSW5DVCxPQUFPUSxLQUo0QixDQUloREMsUUFKZ0Q7O0FBS3hELE1BQU1HLE9BQU9ILFNBQVMyRSxnQkFBVCxDQUEwQm5GLEdBQTFCLENBQWI7QUFDQSxNQUFNa0MsU0FBUzFCLFNBQVMyQixTQUFULENBQW1CeEIsS0FBS1gsR0FBeEIsQ0FBZjtBQUNBLE1BQU1zQyxRQUFRSixPQUFPTSxLQUFQLENBQWF3QyxPQUFiLENBQXFCckUsSUFBckIsQ0FBZDs7QUFFQVosU0FBTzJDLGVBQVAsQ0FBdUJSLE9BQU9sQyxHQUE5QixFQUFtQ3NDLEtBQW5DLEVBQTBDMkIsS0FBMUMsRUFBaUQsRUFBRTNELFdBQVcsS0FBYixFQUFqRDtBQUNBUCxTQUFPc0QsYUFBUCxDQUFxQjFDLEtBQUtYLEdBQTFCLEVBQStCaUUsTUFBTWpFLEdBQXJDLEVBQTBDLENBQTFDLEVBQTZDSSxPQUE3QztBQUNELENBWEQ7O0FBYUE7Ozs7OztrQkFNZVAsTyIsImZpbGUiOiJieS1rZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCbG9jayBmcm9tICcuLi9tb2RlbHMvYmxvY2snXG5pbXBvcnQgSW5saW5lIGZyb20gJy4uL21vZGVscy9pbmxpbmUnXG5pbXBvcnQgTWFyayBmcm9tICcuLi9tb2RlbHMvbWFyaydcbmltcG9ydCBOb2RlIGZyb20gJy4uL21vZGVscy9ub2RlJ1xuaW1wb3J0IFNDSEVNQSBmcm9tICcuLi9zY2hlbWFzL2NvcmUnXG5cbi8qKlxuICogQ2hhbmdlcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IENoYW5nZXMgPSB7fVxuXG4vKipcbiAqIEFkZCBtYXJrIHRvIHRleHQgYXQgYG9mZnNldGAgYW5kIGBsZW5ndGhgIGluIG5vZGUgYnkgYGtleWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICogQHBhcmFtIHtNaXhlZH0gbWFya1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLmFkZE1hcmtCeUtleSA9IChjaGFuZ2UsIGtleSwgb2Zmc2V0LCBsZW5ndGgsIG1hcmssIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBtYXJrID0gTWFyay5jcmVhdGUobWFyaylcbiAgY29uc3QgeyBub3JtYWxpemUgPSB0cnVlIH0gPSBvcHRpb25zXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCBwYXRoID0gZG9jdW1lbnQuZ2V0UGF0aChrZXkpXG4gIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5nZXROb2RlKGtleSlcbiAgY29uc3QgcmFuZ2VzID0gbm9kZS5nZXRSYW5nZXMoKVxuXG4gIGNvbnN0IG9wZXJhdGlvbnMgPSBbXVxuICBjb25zdCBieCA9IG9mZnNldFxuICBjb25zdCBieSA9IG9mZnNldCArIGxlbmd0aFxuICBsZXQgbyA9IDBcblxuICByYW5nZXMuZm9yRWFjaCgocmFuZ2UpID0+IHtcbiAgICBjb25zdCBheCA9IG9cbiAgICBjb25zdCBheSA9IGF4ICsgcmFuZ2UudGV4dC5sZW5ndGhcblxuICAgIG8gKz0gcmFuZ2UudGV4dC5sZW5ndGhcblxuICAgIC8vIElmIHRoZSByYW5nZSBkb2Vzbid0IG92ZXJsYXAgd2l0aCB0aGUgb3BlcmF0aW9uLCBjb250aW51ZSBvbi5cbiAgICBpZiAoYXkgPCBieCB8fCBieSA8IGF4KSByZXR1cm5cblxuICAgIC8vIElmIHRoZSByYW5nZSBhbHJlYWR5IGhhcyB0aGUgbWFyaywgY29udGludWUgb24uXG4gICAgaWYgKHJhbmdlLm1hcmtzLmhhcyhtYXJrKSkgcmV0dXJuXG5cbiAgICAvLyBPdGhlcndpc2UsIGRldGVybWluZSB3aGljaCBvZmZzZXQgYW5kIGNoYXJhY3RlcnMgb3ZlcmxhcC5cbiAgICBjb25zdCBzdGFydCA9IE1hdGgubWF4KGF4LCBieClcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihheSwgYnkpXG5cbiAgICBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgdHlwZTogJ2FkZF9tYXJrJyxcbiAgICAgIHBhdGgsXG4gICAgICBvZmZzZXQ6IHN0YXJ0LFxuICAgICAgbGVuZ3RoOiBlbmQgLSBzdGFydCxcbiAgICAgIG1hcmssXG4gICAgfSlcbiAgfSlcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb25zKG9wZXJhdGlvbnMpXG5cbiAgaWYgKG5vcm1hbGl6ZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChrZXkpXG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBgZnJhZ21lbnRgIGF0IGBpbmRleGAgaW4gYSBub2RlIGJ5IGBrZXlgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHtGcmFnbWVudH0gZnJhZ21lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5pbnNlcnRGcmFnbWVudEJ5S2V5ID0gKGNoYW5nZSwga2V5LCBpbmRleCwgZnJhZ21lbnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcblxuICBmcmFnbWVudC5ub2Rlcy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG4gICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShrZXksIGluZGV4ICsgaSwgbm9kZSlcbiAgfSlcblxuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShrZXksIFNDSEVNQSlcbiAgfVxufVxuXG4vKipcbiAqIEluc2VydCBhIGBub2RlYCBhdCBgaW5kZXhgIGluIGEgbm9kZSBieSBga2V5YC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLmluc2VydE5vZGVCeUtleSA9IChjaGFuZ2UsIGtleSwgaW5kZXgsIG5vZGUsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHBhdGggPSBkb2N1bWVudC5nZXRQYXRoKGtleSlcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb24oe1xuICAgIHR5cGU6ICdpbnNlcnRfbm9kZScsXG4gICAgcGF0aDogWy4uLnBhdGgsIGluZGV4XSxcbiAgICBub2RlLFxuICB9KVxuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjaGFuZ2Uubm9ybWFsaXplTm9kZUJ5S2V5KGtleSwgU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogSW5zZXJ0IGB0ZXh0YCBhdCBgb2Zmc2V0YCBpbiBub2RlIGJ5IGBrZXlgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcGFyYW0ge1NldDxNYXJrPn0gbWFya3MgKG9wdGlvbmFsKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLmluc2VydFRleHRCeUtleSA9IChjaGFuZ2UsIGtleSwgb2Zmc2V0LCB0ZXh0LCBtYXJrcywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmdldFBhdGgoa2V5KVxuICBjb25zdCBub2RlID0gZG9jdW1lbnQuZ2V0Tm9kZShrZXkpXG4gIG1hcmtzID0gbWFya3MgfHwgbm9kZS5nZXRNYXJrc0F0SW5kZXgob2Zmc2V0KVxuXG4gIGNoYW5nZS5hcHBseU9wZXJhdGlvbih7XG4gICAgdHlwZTogJ2luc2VydF90ZXh0JyxcbiAgICBwYXRoLFxuICAgIG9mZnNldCxcbiAgICB0ZXh0LFxuICAgIG1hcmtzLFxuICB9KVxuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoa2V5KVxuICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkocGFyZW50LmtleSwgU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgYSBub2RlIGJ5IGBrZXlgIHdpdGggdGhlIHByZXZpb3VzIG5vZGUuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLm1lcmdlTm9kZUJ5S2V5ID0gKGNoYW5nZSwga2V5LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgeyBub3JtYWxpemUgPSB0cnVlIH0gPSBvcHRpb25zXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCBwYXRoID0gZG9jdW1lbnQuZ2V0UGF0aChrZXkpXG4gIGNvbnN0IHByZXZpb3VzID0gZG9jdW1lbnQuZ2V0UHJldmlvdXNTaWJsaW5nKGtleSlcblxuICBpZiAoIXByZXZpb3VzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gbWVyZ2Ugbm9kZSB3aXRoIGtleSBcIiR7a2V5fVwiLCBubyBwcmV2aW91cyBrZXkuYClcbiAgfVxuXG4gIGNvbnN0IHBvc2l0aW9uID0gcHJldmlvdXMua2luZCA9PSAndGV4dCcgPyBwcmV2aW91cy50ZXh0Lmxlbmd0aCA6IHByZXZpb3VzLm5vZGVzLnNpemVcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb24oe1xuICAgIHR5cGU6ICdtZXJnZV9ub2RlJyxcbiAgICBwYXRoLFxuICAgIHBvc2l0aW9uLFxuICB9KVxuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoa2V5KVxuICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkocGFyZW50LmtleSwgU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogTW92ZSBhIG5vZGUgYnkgYGtleWAgdG8gYSBuZXcgcGFyZW50IGJ5IGBuZXdLZXlgIGFuZCBgaW5kZXhgLlxuICogYG5ld0tleWAgaXMgdGhlIGtleSBvZiB0aGUgY29udGFpbmVyIChpdCBjYW4gYmUgdGhlIGRvY3VtZW50IGl0c2VsZilcbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gbmV3S2V5XG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5tb3ZlTm9kZUJ5S2V5ID0gKGNoYW5nZSwga2V5LCBuZXdLZXksIG5ld0luZGV4LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgeyBub3JtYWxpemUgPSB0cnVlIH0gPSBvcHRpb25zXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCBwYXRoID0gZG9jdW1lbnQuZ2V0UGF0aChrZXkpXG4gIGNvbnN0IG5ld1BhdGggPSBkb2N1bWVudC5nZXRQYXRoKG5ld0tleSlcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb24oe1xuICAgIHR5cGU6ICdtb3ZlX25vZGUnLFxuICAgIHBhdGgsXG4gICAgbmV3UGF0aDogWy4uLm5ld1BhdGgsIG5ld0luZGV4XSxcbiAgfSlcblxuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuZ2V0Q29tbW9uQW5jZXN0b3Ioa2V5LCBuZXdLZXkpXG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgbWFyayBmcm9tIHRleHQgYXQgYG9mZnNldGAgYW5kIGBsZW5ndGhgIGluIG5vZGUgYnkgYGtleWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICogQHBhcmFtIHtNYXJrfSBtYXJrXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMucmVtb3ZlTWFya0J5S2V5ID0gKGNoYW5nZSwga2V5LCBvZmZzZXQsIGxlbmd0aCwgbWFyaywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIG1hcmsgPSBNYXJrLmNyZWF0ZShtYXJrKVxuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHBhdGggPSBkb2N1bWVudC5nZXRQYXRoKGtleSlcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldE5vZGUoa2V5KVxuICBjb25zdCByYW5nZXMgPSBub2RlLmdldFJhbmdlcygpXG5cbiAgY29uc3Qgb3BlcmF0aW9ucyA9IFtdXG4gIGNvbnN0IGJ4ID0gb2Zmc2V0XG4gIGNvbnN0IGJ5ID0gb2Zmc2V0ICsgbGVuZ3RoXG4gIGxldCBvID0gMFxuXG4gIHJhbmdlcy5mb3JFYWNoKChyYW5nZSkgPT4ge1xuICAgIGNvbnN0IGF4ID0gb1xuICAgIGNvbnN0IGF5ID0gYXggKyByYW5nZS50ZXh0Lmxlbmd0aFxuXG4gICAgbyArPSByYW5nZS50ZXh0Lmxlbmd0aFxuXG4gICAgLy8gSWYgdGhlIHJhbmdlIGRvZXNuJ3Qgb3ZlcmxhcCB3aXRoIHRoZSBvcGVyYXRpb24sIGNvbnRpbnVlIG9uLlxuICAgIGlmIChheSA8IGJ4IHx8IGJ5IDwgYXgpIHJldHVyblxuXG4gICAgLy8gSWYgdGhlIHJhbmdlIGFscmVhZHkgaGFzIHRoZSBtYXJrLCBjb250aW51ZSBvbi5cbiAgICBpZiAoIXJhbmdlLm1hcmtzLmhhcyhtYXJrKSkgcmV0dXJuXG5cbiAgICAvLyBPdGhlcndpc2UsIGRldGVybWluZSB3aGljaCBvZmZzZXQgYW5kIGNoYXJhY3RlcnMgb3ZlcmxhcC5cbiAgICBjb25zdCBzdGFydCA9IE1hdGgubWF4KGF4LCBieClcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihheSwgYnkpXG5cbiAgICBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgdHlwZTogJ3JlbW92ZV9tYXJrJyxcbiAgICAgIHBhdGgsXG4gICAgICBvZmZzZXQ6IHN0YXJ0LFxuICAgICAgbGVuZ3RoOiBlbmQgLSBzdGFydCxcbiAgICAgIG1hcmssXG4gICAgfSlcbiAgfSlcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb25zKG9wZXJhdGlvbnMpXG5cbiAgaWYgKG5vcm1hbGl6ZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChrZXkpXG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBub2RlIGJ5IGBrZXlgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5yZW1vdmVOb2RlQnlLZXkgPSAoY2hhbmdlLCBrZXksIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHBhdGggPSBkb2N1bWVudC5nZXRQYXRoKGtleSlcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldE5vZGUoa2V5KVxuXG4gIGNoYW5nZS5hcHBseU9wZXJhdGlvbih7XG4gICAgdHlwZTogJ3JlbW92ZV9ub2RlJyxcbiAgICBwYXRoLFxuICAgIG5vZGUsXG4gIH0pXG5cbiAgaWYgKG5vcm1hbGl6ZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChrZXkpXG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgdGV4dCBhdCBgb2Zmc2V0YCBhbmQgYGxlbmd0aGAgaW4gbm9kZSBieSBga2V5YC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0XG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMucmVtb3ZlVGV4dEJ5S2V5ID0gKGNoYW5nZSwga2V5LCBvZmZzZXQsIGxlbmd0aCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmdldFBhdGgoa2V5KVxuICBjb25zdCBub2RlID0gZG9jdW1lbnQuZ2V0Tm9kZShrZXkpXG4gIGNvbnN0IHJhbmdlcyA9IG5vZGUuZ2V0UmFuZ2VzKClcbiAgY29uc3QgeyB0ZXh0IH0gPSBub2RlXG5cbiAgY29uc3QgcmVtb3ZhbHMgPSBbXVxuICBjb25zdCBieCA9IG9mZnNldFxuICBjb25zdCBieSA9IG9mZnNldCArIGxlbmd0aFxuICBsZXQgbyA9IDBcblxuICByYW5nZXMuZm9yRWFjaCgocmFuZ2UpID0+IHtcbiAgICBjb25zdCBheCA9IG9cbiAgICBjb25zdCBheSA9IGF4ICsgcmFuZ2UudGV4dC5sZW5ndGhcblxuICAgIG8gKz0gcmFuZ2UudGV4dC5sZW5ndGhcblxuICAgIC8vIElmIHRoZSByYW5nZSBkb2Vzbid0IG92ZXJsYXAgd2l0aCB0aGUgcmVtb3ZhbCwgY29udGludWUgb24uXG4gICAgaWYgKGF5IDwgYnggfHwgYnkgPCBheCkgcmV0dXJuXG5cbiAgICAvLyBPdGhlcndpc2UsIGRldGVybWluZSB3aGljaCBvZmZzZXQgYW5kIGNoYXJhY3RlcnMgb3ZlcmxhcC5cbiAgICBjb25zdCBzdGFydCA9IE1hdGgubWF4KGF4LCBieClcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihheSwgYnkpXG4gICAgY29uc3Qgc3RyaW5nID0gdGV4dC5zbGljZShzdGFydCwgZW5kKVxuXG4gICAgcmVtb3ZhbHMucHVzaCh7XG4gICAgICB0eXBlOiAncmVtb3ZlX3RleHQnLFxuICAgICAgcGF0aCxcbiAgICAgIG9mZnNldDogc3RhcnQsXG4gICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICBtYXJrczogcmFuZ2UubWFya3MsXG4gICAgfSlcbiAgfSlcblxuICAvLyBBcHBseSBpbiByZXZlcnNlIG9yZGVyLCBzbyBzdWJzZXF1ZW50IHJlbW92YWxzIGRvbid0IGltcGFjdCBwcmV2aW91cyBvbmVzLlxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb25zKHJlbW92YWxzLnJldmVyc2UoKSlcblxuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soa2V5KVxuICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkoYmxvY2sua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgYHByb3BlcnRpZXNgIG9uIG1hcmsgb24gdGV4dCBhdCBgb2Zmc2V0YCBhbmQgYGxlbmd0aGAgaW4gbm9kZSBieSBga2V5YC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0XG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gKiBAcGFyYW0ge01hcmt9IG1hcmtcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5zZXRNYXJrQnlLZXkgPSAoY2hhbmdlLCBrZXksIG9mZnNldCwgbGVuZ3RoLCBtYXJrLCBwcm9wZXJ0aWVzLCBvcHRpb25zID0ge30pID0+IHtcbiAgbWFyayA9IE1hcmsuY3JlYXRlKG1hcmspXG4gIHByb3BlcnRpZXMgPSBNYXJrLmNyZWF0ZVByb3BlcnRpZXMocHJvcGVydGllcylcbiAgY29uc3QgeyBub3JtYWxpemUgPSB0cnVlIH0gPSBvcHRpb25zXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCBwYXRoID0gZG9jdW1lbnQuZ2V0UGF0aChrZXkpXG5cbiAgY2hhbmdlLmFwcGx5T3BlcmF0aW9uKHtcbiAgICB0eXBlOiAnc2V0X21hcmsnLFxuICAgIHBhdGgsXG4gICAgb2Zmc2V0LFxuICAgIGxlbmd0aCxcbiAgICBtYXJrLFxuICAgIHByb3BlcnRpZXMsXG4gIH0pXG5cbiAgaWYgKG5vcm1hbGl6ZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChrZXkpXG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgYHByb3BlcnRpZXNgIG9uIGEgbm9kZSBieSBga2V5YC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHByb3BlcnRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5zZXROb2RlQnlLZXkgPSAoY2hhbmdlLCBrZXksIHByb3BlcnRpZXMsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBwcm9wZXJ0aWVzID0gTm9kZS5jcmVhdGVQcm9wZXJ0aWVzKHByb3BlcnRpZXMpXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmdldFBhdGgoa2V5KVxuICBjb25zdCBub2RlID0gZG9jdW1lbnQuZ2V0Tm9kZShrZXkpXG5cbiAgY2hhbmdlLmFwcGx5T3BlcmF0aW9uKHtcbiAgICB0eXBlOiAnc2V0X25vZGUnLFxuICAgIHBhdGgsXG4gICAgbm9kZSxcbiAgICBwcm9wZXJ0aWVzLFxuICB9KVxuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjaGFuZ2Uubm9ybWFsaXplTm9kZUJ5S2V5KG5vZGUua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBTcGxpdCBhIG5vZGUgYnkgYGtleWAgYXQgYHBvc2l0aW9uYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5zcGxpdE5vZGVCeUtleSA9IChjaGFuZ2UsIGtleSwgcG9zaXRpb24sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHBhdGggPSBkb2N1bWVudC5nZXRQYXRoKGtleSlcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb24oe1xuICAgIHR5cGU6ICdzcGxpdF9ub2RlJyxcbiAgICBwYXRoLFxuICAgIHBvc2l0aW9uLFxuICB9KVxuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoa2V5KVxuICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkocGFyZW50LmtleSwgU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogU3BsaXQgYSBub2RlIGRlZXBseSBkb3duIHRoZSB0cmVlIGJ5IGBrZXlgLCBgdGV4dEtleWAgYW5kIGB0ZXh0T2Zmc2V0YC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5zcGxpdERlc2NlbmRhbnRzQnlLZXkgPSAoY2hhbmdlLCBrZXksIHRleHRLZXksIHRleHRPZmZzZXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoa2V5ID09IHRleHRLZXkpIHtcbiAgICBjaGFuZ2Uuc3BsaXROb2RlQnlLZXkodGV4dEtleSwgdGV4dE9mZnNldCwgb3B0aW9ucylcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcblxuICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0Tm9kZSh0ZXh0S2V5KVxuICBjb25zdCBhbmNlc3RvcnMgPSBkb2N1bWVudC5nZXRBbmNlc3RvcnModGV4dEtleSlcbiAgY29uc3Qgbm9kZXMgPSBhbmNlc3RvcnMuc2tpcFVudGlsKGEgPT4gYS5rZXkgPT0ga2V5KS5yZXZlcnNlKCkudW5zaGlmdCh0ZXh0KVxuICBsZXQgcHJldmlvdXNcblxuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBwcmV2aW91cyA/IG5vZGUubm9kZXMuaW5kZXhPZihwcmV2aW91cykgKyAxIDogdGV4dE9mZnNldFxuICAgIHByZXZpb3VzID0gbm9kZVxuICAgIGNoYW5nZS5zcGxpdE5vZGVCeUtleShub2RlLmtleSwgaW5kZXgsIHsgbm9ybWFsaXplOiBmYWxzZSB9KVxuICB9KVxuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoa2V5KVxuICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkocGFyZW50LmtleSwgU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogVW53cmFwIGNvbnRlbnQgZnJvbSBhbiBpbmxpbmUgcGFyZW50IHdpdGggYHByb3BlcnRpZXNgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLnVud3JhcElubGluZUJ5S2V5ID0gKGNoYW5nZSwga2V5LCBwcm9wZXJ0aWVzLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5hc3NlcnREZXNjZW5kYW50KGtleSlcbiAgY29uc3QgZmlyc3QgPSBub2RlLmdldEZpcnN0VGV4dCgpXG4gIGNvbnN0IGxhc3QgPSBub2RlLmdldExhc3RUZXh0KClcbiAgY29uc3QgcmFuZ2UgPSBzZWxlY3Rpb24ubW92ZVRvUmFuZ2VPZihmaXJzdCwgbGFzdClcbiAgY2hhbmdlLnVud3JhcElubGluZUF0UmFuZ2UocmFuZ2UsIHByb3BlcnRpZXMsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogVW53cmFwIGNvbnRlbnQgZnJvbSBhIGJsb2NrIHBhcmVudCB3aXRoIGBwcm9wZXJ0aWVzYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHByb3BlcnRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy51bndyYXBCbG9ja0J5S2V5ID0gKGNoYW5nZSwga2V5LCBwcm9wZXJ0aWVzLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5hc3NlcnREZXNjZW5kYW50KGtleSlcbiAgY29uc3QgZmlyc3QgPSBub2RlLmdldEZpcnN0VGV4dCgpXG4gIGNvbnN0IGxhc3QgPSBub2RlLmdldExhc3RUZXh0KClcbiAgY29uc3QgcmFuZ2UgPSBzZWxlY3Rpb24ubW92ZVRvUmFuZ2VPZihmaXJzdCwgbGFzdClcbiAgY2hhbmdlLnVud3JhcEJsb2NrQXRSYW5nZShyYW5nZSwgcHJvcGVydGllcywgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBVbndyYXAgYSBzaW5nbGUgbm9kZSBmcm9tIGl0cyBwYXJlbnQuXG4gKlxuICogSWYgdGhlIG5vZGUgaXMgc3Vycm91bmRlZCB3aXRoIHNpYmxpbmdzLCBpdHMgcGFyZW50IHdpbGwgYmVcbiAqIHNwbGl0LiBJZiB0aGUgbm9kZSBpcyB0aGUgb25seSBjaGlsZCwgdGhlIHBhcmVudCBpcyByZW1vdmVkLCBhbmRcbiAqIHNpbXBseSByZXBsYWNlZCBieSB0aGUgbm9kZSBpdHNlbGYuICBDYW5ub3QgdW53cmFwIGEgcm9vdCBub2RlLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy51bndyYXBOb2RlQnlLZXkgPSAoY2hhbmdlLCBrZXksIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChrZXkpXG4gIGNvbnN0IG5vZGUgPSBwYXJlbnQuZ2V0Q2hpbGQoa2V5KVxuXG4gIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yobm9kZSlcbiAgY29uc3QgaXNGaXJzdCA9IGluZGV4ID09PSAwXG4gIGNvbnN0IGlzTGFzdCA9IGluZGV4ID09PSBwYXJlbnQubm9kZXMuc2l6ZSAtIDFcblxuICBjb25zdCBwYXJlbnRQYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQocGFyZW50LmtleSlcbiAgY29uc3QgcGFyZW50SW5kZXggPSBwYXJlbnRQYXJlbnQubm9kZXMuaW5kZXhPZihwYXJlbnQpXG5cbiAgaWYgKHBhcmVudC5ub2Rlcy5zaXplID09PSAxKSB7XG4gICAgY2hhbmdlLm1vdmVOb2RlQnlLZXkoa2V5LCBwYXJlbnRQYXJlbnQua2V5LCBwYXJlbnRJbmRleCwgeyBub3JtYWxpemU6IGZhbHNlIH0pXG4gICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShwYXJlbnQua2V5LCBvcHRpb25zKVxuICB9XG5cbiAgZWxzZSBpZiAoaXNGaXJzdCkge1xuICAgIC8vIEp1c3QgbW92ZSB0aGUgbm9kZSBiZWZvcmUgaXRzIHBhcmVudC5cbiAgICBjaGFuZ2UubW92ZU5vZGVCeUtleShrZXksIHBhcmVudFBhcmVudC5rZXksIHBhcmVudEluZGV4LCBvcHRpb25zKVxuICB9XG5cbiAgZWxzZSBpZiAoaXNMYXN0KSB7XG4gICAgLy8gSnVzdCBtb3ZlIHRoZSBub2RlIGFmdGVyIGl0cyBwYXJlbnQuXG4gICAgY2hhbmdlLm1vdmVOb2RlQnlLZXkoa2V5LCBwYXJlbnRQYXJlbnQua2V5LCBwYXJlbnRJbmRleCArIDEsIG9wdGlvbnMpXG4gIH1cblxuICBlbHNlIHtcbiAgICAvLyBTcGxpdCB0aGUgcGFyZW50LlxuICAgIGNoYW5nZS5zcGxpdE5vZGVCeUtleShwYXJlbnQua2V5LCBpbmRleCwgeyBub3JtYWxpemU6IGZhbHNlIH0pXG5cbiAgICAvLyBFeHRyYWN0IHRoZSBub2RlIGluIGJldHdlZW4gdGhlIHNwbGl0dGVkIHBhcmVudC5cbiAgICBjaGFuZ2UubW92ZU5vZGVCeUtleShrZXksIHBhcmVudFBhcmVudC5rZXksIHBhcmVudEluZGV4ICsgMSwgeyBub3JtYWxpemU6IGZhbHNlIH0pXG5cbiAgICBpZiAobm9ybWFsaXplKSB7XG4gICAgICBjaGFuZ2Uubm9ybWFsaXplTm9kZUJ5S2V5KHBhcmVudFBhcmVudC5rZXksIFNDSEVNQSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwIGEgbm9kZSBpbiBhbiBpbmxpbmUgd2l0aCBgcHJvcGVydGllc2AuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgbm9kZSB0byB3cmFwXG4gKiBAcGFyYW0ge0Jsb2NrfE9iamVjdHxTdHJpbmd9IGlubGluZSBUaGUgd3JhcHBpbmcgaW5saW5lIChpdHMgY2hpbGRyZW4gYXJlIGRpc2NhcmRlZClcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy53cmFwSW5saW5lQnlLZXkgPSAoY2hhbmdlLCBrZXksIGlubGluZSwgb3B0aW9ucykgPT4ge1xuICBpbmxpbmUgPSBJbmxpbmUuY3JlYXRlKGlubGluZSlcbiAgaW5saW5lID0gaW5saW5lLnNldCgnbm9kZXMnLCBpbmxpbmUubm9kZXMuY2xlYXIoKSlcblxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBjaGFuZ2Uuc3RhdGVcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmFzc2VydERlc2NlbmRhbnQoa2V5KVxuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQobm9kZS5rZXkpXG4gIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yobm9kZSlcblxuICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4LCBpbmxpbmUsIHsgbm9ybWFsaXplOiBmYWxzZSB9KVxuICBjaGFuZ2UubW92ZU5vZGVCeUtleShub2RlLmtleSwgaW5saW5lLmtleSwgMCwgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBXcmFwIGEgbm9kZSBpbiBhIGJsb2NrIHdpdGggYHByb3BlcnRpZXNgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIG5vZGUgdG8gd3JhcFxuICogQHBhcmFtIHtCbG9ja3xPYmplY3R8U3RyaW5nfSBibG9jayBUaGUgd3JhcHBpbmcgYmxvY2sgKGl0cyBjaGlsZHJlbiBhcmUgZGlzY2FyZGVkKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLndyYXBCbG9ja0J5S2V5ID0gKGNoYW5nZSwga2V5LCBibG9jaywgb3B0aW9ucykgPT4ge1xuICBibG9jayA9IEJsb2NrLmNyZWF0ZShibG9jaylcbiAgYmxvY2sgPSBibG9jay5zZXQoJ25vZGVzJywgYmxvY2subm9kZXMuY2xlYXIoKSlcblxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBjaGFuZ2Uuc3RhdGVcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmFzc2VydERlc2NlbmRhbnQoa2V5KVxuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQobm9kZS5rZXkpXG4gIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yobm9kZSlcblxuICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4LCBibG9jaywgeyBub3JtYWxpemU6IGZhbHNlIH0pXG4gIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KG5vZGUua2V5LCBibG9jay5rZXksIDAsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgQ2hhbmdlc1xuIl19