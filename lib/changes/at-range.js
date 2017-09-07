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

var _string = require('../utils/string');

var _string2 = _interopRequireDefault(_string);

var _core = require('../schemas/core');

var _core2 = _interopRequireDefault(_core);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * An options object with normalize set to `false`.
 *
 * @type {Object}
 */

var OPTS = {
  normalize: false

  /**
   * Add a new `mark` to the characters at `range`.
   *
   * @param {Change} change
   * @param {Selection} range
   * @param {Mixed} mark
   * @param {Object} options
   *   @property {Boolean} normalize
   */

};Changes.addMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var _options$normalize = options.normalize,
      normalize = _options$normalize === undefined ? true : _options$normalize;
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;

  var texts = document.getTextsAtRange(range);

  texts.forEach(function (node) {
    var key = node.key;

    var index = 0;
    var length = node.text.length;

    if (key == startKey) index = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    change.addMarkByKey(key, index, length, mark, { normalize: normalize });
  });
};

/**
 * Delete everything in a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteAtRange = function (change, range) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (range.isCollapsed) return;

  change.snapshotSelection();

  var _options$normalize2 = options.normalize,
      normalize = _options$normalize2 === undefined ? true : _options$normalize2;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;

  // Split at the range edges within a common ancestor, without normalizing.

  var state = change.state;
  var _state = state,
      document = _state.document;

  var ancestor = document.getCommonAncestor(startKey, endKey);
  var startChild = ancestor.getFurthestAncestor(startKey);
  var endChild = ancestor.getFurthestAncestor(endKey);

  // If the start child is a void node, and the range begins or
  // ends (when range is backward) at the start of it, remove it
  // and set nextSibling as startChild until there is no startChild
  // that is a void node and included in the selection range
  var startChildIncludesVoid = startChild.isVoid && (range.anchorOffset === 0 && !range.isBackward || range.focusOffset === 0 && range.isBackward);

  while (startChildIncludesVoid) {
    var nextSibling = document.getNextSibling(startChild.key);
    change.removeNodeByKey(startChild.key, OPTS);
    // Abort if no nextSibling or we are about to process the endChild which is aslo a void node
    if (!nextSibling || endChild.key === nextSibling.key && nextSibling.isVoid) {
      startChildIncludesVoid = false;
      return;
    }
    // Process the next void
    if (nextSibling.isVoid) {
      startChild = nextSibling;
    }
    // Set the startChild, startKey and startOffset in the beginning of the next non void sibling
    if (!nextSibling.isVoid) {
      startChild = nextSibling;
      if (startChild.getTexts) {
        startKey = startChild.getTexts().first().key;
      } else {
        startKey = startChild.key;
      }
      startOffset = 0;
      startChildIncludesVoid = false;
    }
  }

  // If the start child is a void node, and the range ends or
  // begins (when range is backward) at the end of it move to nextSibling
  var startChildEndOfVoid = startChild.isVoid && (range.anchorOffset === 1 && !range.isBackward || range.focusOffset === 1 && range.isBackward);

  if (startChildEndOfVoid) {
    var _nextSibling = document.getNextSibling(startChild.key);
    if (_nextSibling) {
      startChild = _nextSibling;
      if (startChild.getTexts) {
        startKey = startChild.getTexts().first().key;
      } else {
        startKey = startChild.key;
      }
      startOffset = 0;
    }
  }

  // If the start and end key are the same, we can just remove it.
  if (startKey == endKey) {
    // If it is a void node, remove the whole node
    if (ancestor.isVoid) {
      // Deselect if this is the only node left in document
      if (document.nodes.size === 1) {
        change.deselect();
      }
      change.removeNodeByKey(ancestor.key, OPTS);
      return;
    }
    // Remove the text
    var index = startOffset;
    var length = endOffset - startOffset;
    change.removeTextByKey(startKey, index, length, { normalize: normalize });
    return;
  }

  // Split at the range edges within a common ancestor, without normalizing.
  state = change.state;
  document = state.document;
  ancestor = document.getCommonAncestor(startKey, endKey);
  startChild = ancestor.getFurthestAncestor(startKey);
  endChild = ancestor.getFurthestAncestor(endKey);

  if (startChild.kind == 'text') {
    change.splitNodeByKey(startChild.key, startOffset, OPTS);
  } else {
    change.splitDescendantsByKey(startChild.key, startKey, startOffset, OPTS);
  }

  if (endChild.kind == 'text') {
    change.splitNodeByKey(endChild.key, endOffset, OPTS);
  } else {
    change.splitDescendantsByKey(endChild.key, endKey, endOffset, OPTS);
  }

  // Refresh variables.
  state = change.state;
  document = state.document;
  ancestor = document.getCommonAncestor(startKey, endKey);
  startChild = ancestor.getFurthestAncestor(startKey);
  endChild = ancestor.getFurthestAncestor(endKey);
  var startIndex = ancestor.nodes.indexOf(startChild);
  var endIndex = ancestor.nodes.indexOf(endChild);
  var middles = ancestor.nodes.slice(startIndex + 1, endIndex + 1);
  var next = document.getNextText(endKey);

  // Remove all of the middle nodes, between the splits.
  if (middles.size) {
    middles.forEach(function (child) {
      change.removeNodeByKey(child.key, OPTS);
    });
  }

  // If the start and end block are different, move all of the nodes from the
  // end block into the start block.
  state = change.state;
  document = state.document;
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(next.key);

  // If the endBlock is void, just remove the startBlock
  if (endBlock.isVoid) {
    change.removeNodeByKey(startBlock.key);
    return;
  }

  // If the start and end block are different, move all of the nodes from the
  // end block into the start block
  if (startBlock.key !== endBlock.key) {
    endBlock.nodes.forEach(function (child, i) {
      var newKey = startBlock.key;
      var newIndex = startBlock.nodes.size + i;
      change.moveNodeByKey(child.key, newKey, newIndex, OPTS);
    });

    // Remove parents of endBlock as long as they have a single child
    var lonely = document.getFurthestOnlyChildAncestor(endBlock.key) || endBlock;
    change.removeNodeByKey(lonely.key, OPTS);
  }

  if (normalize) {
    change.normalizeNodeByKey(ancestor.key, _core2.default);
  }
};

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteCharBackwardAtRange = function (change, range, options) {
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = _string2.default.getCharOffsetBackward(text, o);
  change.deleteBackwardAtRange(range, n, options);
};

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteLineBackwardAtRange = function (change, range, options) {
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  change.deleteBackwardAtRange(range, o, options);
};

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteWordBackwardAtRange = function (change, range, options) {
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = _string2.default.getWordOffsetBackward(text, o);
  change.deleteBackwardAtRange(range, n, options);
};

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteBackwardAtRange = function (change, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize3 = options.normalize,
      normalize = _options$normalize3 === undefined ? true : _options$normalize3;
  var state = change.state;
  var document = state.document;
  var _range = range,
      startKey = _range.startKey,
      focusOffset = _range.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);
  // If the closest block is void, delete it.
  if (block && block.isVoid) {
    change.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }
  // If the closest is not void, but empty, remove it
  if (block && !block.isVoid && block.isEmpty && document.nodes.size !== 1) {
    change.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }

  // If the closest inline is void, delete it.
  var inline = document.getClosestInline(startKey);
  if (inline && inline.isVoid) {
    change.removeNodeByKey(inline.key, { normalize: normalize });
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtStartOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);
  if (range.isAtStartOf(text)) {
    var prev = document.getPreviousText(text.key);
    var prevBlock = document.getClosestBlock(prev.key);
    var prevInline = document.getClosestInline(prev.key);

    // If the previous block is void, remove it.
    if (prevBlock && prevBlock.isVoid) {
      change.removeNodeByKey(prevBlock.key, { normalize: normalize });
      return;
    }

    // If the previous inline is void, remove it.
    if (prevInline && prevInline.isVoid) {
      change.removeNodeByKey(prevInline.key, { normalize: normalize });
      return;
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && prevBlock != block) {
      range = range.merge({
        anchorKey: prev.key,
        anchorOffset: prev.text.length
      });

      change.deleteAtRange(range, { normalize: normalize });
      return;
    }
  }

  // If the focus offset is farther than the number of characters to delete,
  // just remove the characters backwards inside the current node.
  if (n < focusOffset) {
    range = range.merge({
      focusOffset: focusOffset - n,
      isBackward: true
    });

    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, we need to see how many nodes backwards to go.
  var node = text;
  var offset = 0;
  var traversed = focusOffset;

  while (n > traversed) {
    node = document.getPreviousText(node.key);
    var next = traversed + node.text.length;
    if (n <= next) {
      offset = next - n;
      break;
    } else {
      traversed = next;
    }
  }

  // If the focus node is inside a void, go up until right after it.
  if (document.hasVoidParent(node.key)) {
    var parent = document.getClosestVoid(node.key);
    node = document.getNextText(parent.key);
    offset = 0;
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset,
    isBackward: true
  });

  change.deleteAtRange(range, { normalize: normalize });
};

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteCharForwardAtRange = function (change, range, options) {
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = _string2.default.getCharOffsetForward(text, o);
  change.deleteForwardAtRange(range, n, options);
};

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteLineForwardAtRange = function (change, range, options) {
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  change.deleteForwardAtRange(range, o, options);
};

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteWordForwardAtRange = function (change, range, options) {
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = _string2.default.getWordOffsetForward(text, o);
  change.deleteForwardAtRange(range, n, options);
};

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.deleteForwardAtRange = function (change, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize4 = options.normalize,
      normalize = _options$normalize4 === undefined ? true : _options$normalize4;
  var state = change.state;
  var document = state.document;
  var _range2 = range,
      startKey = _range2.startKey,
      focusOffset = _range2.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);
  // If the closest block is void, delete it.
  if (block && block.isVoid) {
    change.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }
  // If the closest is not void, but empty, remove it
  if (block && !block.isVoid && block.isEmpty && document.nodes.size !== 1) {
    change.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }

  // If the closest inline is void, delete it.
  var inline = document.getClosestInline(startKey);
  if (inline && inline.isVoid) {
    change.removeNodeByKey(inline.key, { normalize: normalize });
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtEndOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);
  if (range.isAtEndOf(text)) {
    var next = document.getNextText(text.key);
    var nextBlock = document.getClosestBlock(next.key);
    var nextInline = document.getClosestInline(next.key);

    // If the previous block is void, remove it.
    if (nextBlock && nextBlock.isVoid) {
      change.removeNodeByKey(nextBlock.key, { normalize: normalize });
      return;
    }

    // If the previous inline is void, remove it.
    if (nextInline && nextInline.isVoid) {
      change.removeNodeByKey(nextInline.key, { normalize: normalize });
      return;
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && nextBlock != block) {
      range = range.merge({
        focusKey: next.key,
        focusOffset: 0
      });

      change.deleteAtRange(range, { normalize: normalize });
      return;
    }
  }

  // If the remaining characters to the end of the node is greater than or equal
  // to the number of characters to delete, just remove the characters forwards
  // inside the current node.
  if (n <= text.text.length - focusOffset) {
    range = range.merge({
      focusOffset: focusOffset + n
    });

    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, we need to see how many nodes forwards to go.
  var node = text;
  var offset = focusOffset;
  var traversed = text.text.length - focusOffset;

  while (n > traversed) {
    node = document.getNextText(node.key);
    var _next = traversed + node.text.length;
    if (n <= _next) {
      offset = n - traversed;
      break;
    } else {
      traversed = _next;
    }
  }

  // If the focus node is inside a void, go up until right before it.
  if (document.hasVoidParent(node.key)) {
    var parent = document.getClosestVoid(node.key);
    node = document.getPreviousText(parent.key);
    offset = node.text.length;
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset
  });

  change.deleteAtRange(range, { normalize: normalize });
};

/**
 * Insert a `block` node at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Block|String|Object} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertBlockAtRange = function (change, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = _block2.default.create(block);
  var _options$normalize5 = options.normalize,
      normalize = _options$normalize5 === undefined ? true : _options$normalize5;


  if (range.isExpanded) {
    change.deleteAtRange(range);
    range = range.collapseToStart();
  }

  var state = change.state;
  var document = state.document;
  var _range3 = range,
      startKey = _range3.startKey,
      startOffset = _range3.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var parent = document.getParent(startBlock.key);
  var index = parent.nodes.indexOf(startBlock);

  if (startBlock.isVoid) {
    var extra = range.isAtEndOf(startBlock) ? 1 : 0;
    change.insertNodeByKey(parent.key, index + extra, block, { normalize: normalize });
  } else if (startBlock.isEmpty) {
    change.removeNodeByKey(startBlock.key);
    change.insertNodeByKey(parent.key, index, block, { normalize: normalize });
  } else if (range.isAtStartOf(startBlock)) {
    change.insertNodeByKey(parent.key, index, block, { normalize: normalize });
  } else if (range.isAtEndOf(startBlock)) {
    change.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  } else {
    change.splitDescendantsByKey(startBlock.key, startKey, startOffset, OPTS);
    change.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  }

  if (normalize) {
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Document} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertFragmentAtRange = function (change, range, fragment) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize6 = options.normalize,
      normalize = _options$normalize6 === undefined ? true : _options$normalize6;

  // If the range is expanded, delete it first.

  if (range.isExpanded) {
    change.deleteAtRange(range, OPTS);
    range = range.collapseToStart();
  }

  // If the fragment is empty, there's nothing to do after deleting.
  if (!fragment.nodes.size) return;

  // Regenerate the keys for all of the fragments nodes, so that they're
  // guaranteed not to collide with the existing keys in the document. Otherwise
  // they will be rengerated automatically and we won't have an easy way to
  // reference them.
  fragment = fragment.mapDescendants(function (child) {
    return child.regenerateKey();
  });

  // Calculate a few things...
  var _range4 = range,
      startKey = _range4.startKey,
      startOffset = _range4.startOffset;
  var state = change.state;
  var _state2 = state,
      document = _state2.document;

  var startText = document.getDescendant(startKey);
  var startBlock = document.getClosestBlock(startText.key);
  var startChild = startBlock.getFurthestAncestor(startText.key);
  var isAtStart = range.isAtStartOf(startBlock);
  var parent = document.getParent(startBlock.key);
  var index = parent.nodes.indexOf(startBlock);
  var blocks = fragment.getBlocks();
  var firstBlock = blocks.first();
  var lastBlock = blocks.last();

  // If the fragment only contains a void block, use `insertBlock` instead.
  if (firstBlock == lastBlock && firstBlock.isVoid) {
    change.insertBlockAtRange(range, firstBlock, options);
    return;
  }

  // If the first and last block aren't the same, we need to insert all of the
  // nodes after the fragment's first block at the index.
  if (firstBlock != lastBlock) {
    var lonelyParent = fragment.getFurthest(firstBlock.key, function (p) {
      return p.nodes.size == 1;
    });
    var lonelyChild = lonelyParent || firstBlock;
    var startIndex = parent.nodes.indexOf(startBlock);
    fragment = fragment.removeDescendant(lonelyChild.key);

    fragment.nodes.forEach(function (node, i) {
      var newIndex = startIndex + i + 1;
      change.insertNodeByKey(parent.key, newIndex, node, OPTS);
    });
  }

  // Check if we need to split the node.
  if (startOffset != 0) {
    change.splitDescendantsByKey(startChild.key, startKey, startOffset, OPTS);
  }

  // Update our variables with the new state.
  state = change.state;
  document = state.document;
  startText = document.getDescendant(startKey);
  startBlock = document.getClosestBlock(startKey);
  startChild = startBlock.getFurthestAncestor(startText.key);

  // If the first and last block aren't the same, we need to move any of the
  // starting block's children after the split into the last block of the
  // fragment, which has already been inserted.
  if (firstBlock != lastBlock) {
    var nextChild = isAtStart ? startChild : startBlock.getNextSibling(startChild.key);
    var nextNodes = nextChild ? startBlock.nodes.skipUntil(function (n) {
      return n.key == nextChild.key;
    }) : (0, _immutable.List)();
    var lastIndex = lastBlock.nodes.size;

    nextNodes.forEach(function (node, i) {
      var newIndex = lastIndex + i;
      change.moveNodeByKey(node.key, lastBlock.key, newIndex, OPTS);
    });
  }

  // If the starting block is empty, we replace it entirely with the first block
  // of the fragment, since this leads to a more expected behavior for the user.
  if (startBlock.isEmpty) {
    change.removeNodeByKey(startBlock.key, OPTS);
    change.insertNodeByKey(parent.key, index, firstBlock, OPTS);
  }

  // Otherwise, we maintain the starting block, and insert all of the first
  // block's inline nodes into it at the split point.
  else {
      var inlineChild = startBlock.getFurthestAncestor(startText.key);
      var inlineIndex = startBlock.nodes.indexOf(inlineChild);

      firstBlock.nodes.forEach(function (inline, i) {
        var o = startOffset == 0 ? 0 : 1;
        var newIndex = inlineIndex + i + o;
        change.insertNodeByKey(startBlock.key, newIndex, inline, OPTS);
      });
    }

  // Normalize if requested.
  if (normalize) {
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Inline|String|Object} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertInlineAtRange = function (change, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize7 = options.normalize,
      normalize = _options$normalize7 === undefined ? true : _options$normalize7;

  inline = _inline2.default.create(inline);

  if (range.isExpanded) {
    change.deleteAtRange(range, OPTS);
    range = range.collapseToStart();
  }

  var state = change.state;
  var document = state.document;
  var _range5 = range,
      startKey = _range5.startKey,
      startOffset = _range5.startOffset;

  var parent = document.getParent(startKey);
  var startText = document.assertDescendant(startKey);
  var index = parent.nodes.indexOf(startText);

  if (parent.isVoid) return;

  change.splitNodeByKey(startKey, startOffset, OPTS);
  change.insertNodeByKey(parent.key, index + 1, inline, OPTS);

  if (normalize) {
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.insertTextAtRange = function (change, range, text, marks) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var normalize = options.normalize;
  var state = change.state;
  var document = state.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var parent = document.getParent(startKey);

  if (parent.isVoid) return;

  if (range.isExpanded) {
    change.deleteAtRange(range, OPTS);
  }

  // PERF: Unless specified, don't normalize if only inserting text.
  if (normalize !== undefined) {
    normalize = range.isExpanded;
  }

  change.insertTextByKey(startKey, startOffset, text, marks, { normalize: normalize });
};

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Mark|String} mark (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.removeMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var _options$normalize8 = options.normalize,
      normalize = _options$normalize8 === undefined ? true : _options$normalize8;
  var state = change.state;
  var document = state.document;

  var texts = document.getTextsAtRange(range);
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  texts.forEach(function (node) {
    var key = node.key;

    var index = 0;
    var length = node.text.length;

    if (key == startKey) index = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    change.removeMarkByKey(key, index, length, mark, { normalize: normalize });
  });
};

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setBlockAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize9 = options.normalize,
      normalize = _options$normalize9 === undefined ? true : _options$normalize9;
  var state = change.state;
  var document = state.document;

  var blocks = document.getBlocksAtRange(range);

  blocks.forEach(function (block) {
    change.setNodeByKey(block.key, properties, { normalize: normalize });
  });
};

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.setInlineAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize10 = options.normalize,
      normalize = _options$normalize10 === undefined ? true : _options$normalize10;
  var state = change.state;
  var document = state.document;

  var inlines = document.getInlinesAtRange(range);

  inlines.forEach(function (inline) {
    change.setNodeByKey(inline.key, properties, { normalize: normalize });
  });
};

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitBlockAtRange = function (change, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize11 = options.normalize,
      normalize = _options$normalize11 === undefined ? true : _options$normalize11;


  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    range = range.collapseToStart();
  }

  var _range6 = range,
      startKey = _range6.startKey,
      startOffset = _range6.startOffset;
  var state = change.state;
  var document = state.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestBlock(node.key);
  var h = 0;

  while (parent && parent.kind == 'block' && h < height) {
    node = parent;
    parent = document.getClosestBlock(parent.key);
    h++;
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, { normalize: normalize });
};

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.splitInlineAtRange = function (change, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize12 = options.normalize,
      normalize = _options$normalize12 === undefined ? true : _options$normalize12;


  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    range = range.collapseToStart();
  }

  var _range7 = range,
      startKey = _range7.startKey,
      startOffset = _range7.startOffset;
  var state = change.state;
  var document = state.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestInline(node.key);
  var h = 0;

  while (parent && parent.kind == 'inline' && h < height) {
    node = parent;
    parent = document.getClosestInline(parent.key);
    h++;
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, { normalize: normalize });
};

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.toggleMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  mark = _mark2.default.create(mark);

  var _options$normalize13 = options.normalize,
      normalize = _options$normalize13 === undefined ? true : _options$normalize13;
  var state = change.state;
  var document = state.document;

  var marks = document.getActiveMarksAtRange(range);
  var exists = marks.some(function (m) {
    return m.equals(mark);
  });

  if (exists) {
    change.removeMarkAtRange(range, mark, { normalize: normalize });
  } else {
    change.addMarkAtRange(range, mark, { normalize: normalize });
  }
};

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapBlockAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = _node2.default.createProperties(properties);

  var _options$normalize14 = options.normalize,
      normalize = _options$normalize14 === undefined ? true : _options$normalize14;
  var state = change.state;
  var _state3 = state,
      document = _state3.document;

  var blocks = document.getBlocksAtRange(range);
  var wrappers = blocks.map(function (block) {
    return document.getClosest(block.key, function (parent) {
      if (parent.kind != 'block') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  wrappers.forEach(function (block) {
    var first = block.nodes.first();
    var last = block.nodes.last();
    var parent = document.getParent(block.key);
    var index = parent.nodes.indexOf(block);

    var children = block.nodes.filter(function (child) {
      return blocks.some(function (b) {
        return child == b || child.hasDescendant(b.key);
      });
    });

    var firstMatch = children.first();
    var lastMatch = children.last();

    if (first == firstMatch && last == lastMatch) {
      block.nodes.forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index + i, OPTS);
      });

      change.removeNodeByKey(block.key, OPTS);
    } else if (last == lastMatch) {
      block.nodes.skipUntil(function (n) {
        return n == firstMatch;
      }).forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index + 1 + i, OPTS);
      });
    } else if (first == firstMatch) {
      block.nodes.takeUntil(function (n) {
        return n == lastMatch;
      }).push(lastMatch).forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index + i, OPTS);
      });
    } else {
      var firstText = firstMatch.getFirstText();
      change.splitDescendantsByKey(block.key, firstText.key, 0, OPTS);
      state = change.state;
      document = state.document;

      children.forEach(function (child, i) {
        if (i == 0) {
          var extra = child;
          child = document.getNextBlock(child.key);
          change.removeNodeByKey(extra.key, OPTS);
        }

        change.moveNodeByKey(child.key, parent.key, index + 1 + i, OPTS);
      });
    }
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument(_core2.default);
  }
};

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.unwrapInlineAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = _node2.default.createProperties(properties);

  var _options$normalize15 = options.normalize,
      normalize = _options$normalize15 === undefined ? true : _options$normalize15;
  var state = change.state;
  var document = state.document;

  var texts = document.getTextsAtRange(range);
  var inlines = texts.map(function (text) {
    return document.getClosest(text.key, function (parent) {
      if (parent.kind != 'inline') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  inlines.forEach(function (inline) {
    var parent = change.state.document.getParent(inline.key);
    var index = parent.nodes.indexOf(inline);

    inline.nodes.forEach(function (child, i) {
      change.moveNodeByKey(child.key, parent.key, index + i, OPTS);
    });
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument(_core2.default);
  }
};

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Block|Object|String} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapBlockAtRange = function (change, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = _block2.default.create(block);
  block = block.set('nodes', block.nodes.clear());

  var _options$normalize16 = options.normalize,
      normalize = _options$normalize16 === undefined ? true : _options$normalize16;
  var state = change.state;
  var document = state.document;


  var blocks = document.getBlocksAtRange(range);
  var firstblock = blocks.first();
  var lastblock = blocks.last();
  var parent = void 0,
      siblings = void 0,
      index = void 0;

  // If there is only one block in the selection then we know the parent and
  // siblings.
  if (blocks.length === 1) {
    parent = document.getParent(firstblock.key);
    siblings = blocks;
  }

  // Determine closest shared parent to all blocks in selection.
  else {
      parent = document.getClosest(firstblock.key, function (p1) {
        return !!document.getClosest(lastblock.key, function (p2) {
          return p1 == p2;
        });
      });
    }

  // If no shared parent could be found then the parent is the document.
  if (parent == null) parent = document;

  // Create a list of direct children siblings of parent that fall in the
  // selection.
  if (siblings == null) {
    var indexes = parent.nodes.reduce(function (ind, node, i) {
      if (node == firstblock || node.hasDescendant(firstblock.key)) ind[0] = i;
      if (node == lastblock || node.hasDescendant(lastblock.key)) ind[1] = i;
      return ind;
    }, []);

    index = indexes[0];
    siblings = parent.nodes.slice(indexes[0], indexes[1] + 1);
  }

  // Get the index to place the new wrapped node at.
  if (index == null) {
    index = parent.nodes.indexOf(siblings.first());
  }

  // Inject the new block node into the parent.
  change.insertNodeByKey(parent.key, index, block, OPTS);

  // Move the sibling nodes into the new block node.
  siblings.forEach(function (node, i) {
    change.moveNodeByKey(node.key, block.key, i, OPTS);
  });

  if (normalize) {
    change.normalizeNodeByKey(parent.key, _core2.default);
  }
};

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {Inline|Object|String} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapInlineAtRange = function (change, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var state = change.state;
  var _state4 = state,
      document = _state4.document;
  var _options$normalize17 = options.normalize,
      normalize = _options$normalize17 === undefined ? true : _options$normalize17;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  if (range.isCollapsed) {
    // Wrapping an inline void
    var inlineParent = document.getClosestInline(startKey);
    if (!inlineParent.isVoid) {
      return;
    }

    return change.wrapInlineByKey(inlineParent.key, inline, options);
  }

  inline = _inline2.default.create(inline);
  inline = inline.set('nodes', inline.nodes.clear());

  var blocks = document.getBlocksAtRange(range);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);
  var startChild = startBlock.getFurthestAncestor(startKey);
  var endChild = endBlock.getFurthestAncestor(endKey);

  change.splitDescendantsByKey(endChild.key, endKey, endOffset, OPTS);
  change.splitDescendantsByKey(startChild.key, startKey, startOffset, OPTS);

  state = change.state;
  document = state.document;
  startBlock = document.getDescendant(startBlock.key);
  endBlock = document.getDescendant(endBlock.key);
  startChild = startBlock.getFurthestAncestor(startKey);
  endChild = endBlock.getFurthestAncestor(endKey);
  var startIndex = startBlock.nodes.indexOf(startChild);
  var endIndex = endBlock.nodes.indexOf(endChild);

  if (startBlock == endBlock) {
    state = change.state;
    document = state.document;
    startBlock = document.getClosestBlock(startKey);
    startChild = startBlock.getFurthestAncestor(startKey);

    var startInner = document.getNextSibling(startChild.key);
    var startInnerIndex = startBlock.nodes.indexOf(startInner);
    var endInner = startKey == endKey ? startInner : startBlock.getFurthestAncestor(endKey);
    var inlines = startBlock.nodes.skipUntil(function (n) {
      return n == startInner;
    }).takeUntil(function (n) {
      return n == endInner;
    }).push(endInner);

    var node = inline.regenerateKey();

    change.insertNodeByKey(startBlock.key, startInnerIndex, node, OPTS);

    inlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, node.key, i, OPTS);
    });

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key, _core2.default);
    }
  } else {
    var startInlines = startBlock.nodes.slice(startIndex + 1);
    var endInlines = endBlock.nodes.slice(0, endIndex + 1);
    var startNode = inline.regenerateKey();
    var endNode = inline.regenerateKey();

    change.insertNodeByKey(startBlock.key, startIndex - 1, startNode, OPTS);
    change.insertNodeByKey(endBlock.key, endIndex, endNode, OPTS);

    startInlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, startNode.key, i, OPTS);
    });

    endInlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, endNode.key, i, OPTS);
    });

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key, _core2.default).normalizeNodeByKey(endBlock.key, _core2.default);
    }

    blocks.slice(1, -1).forEach(function (block) {
      var node = inline.regenerateKey();
      change.insertNodeByKey(block.key, 0, node, OPTS);

      block.nodes.forEach(function (child, i) {
        change.moveNodeByKey(child.key, node.key, i, OPTS);
      });

      if (normalize) {
        change.normalizeNodeByKey(block.key, _core2.default);
      }
    });
  }
};

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Change} change
 * @param {Selection} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes.wrapTextAtRange = function (change, range, prefix) {
  var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : prefix;
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$normalize18 = options.normalize,
      normalize = _options$normalize18 === undefined ? true : _options$normalize18;
  var startKey = range.startKey,
      endKey = range.endKey;

  var start = range.collapseToStart();
  var end = range.collapseToEnd();

  if (startKey == endKey) {
    end = end.move(prefix.length);
  }

  change.insertTextAtRange(start, prefix, [], { normalize: normalize });
  change.insertTextAtRange(end, suffix, [], { normalize: normalize });
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFuZ2VzL2F0LXJhbmdlLmpzIl0sIm5hbWVzIjpbIkNoYW5nZXMiLCJPUFRTIiwibm9ybWFsaXplIiwiYWRkTWFya0F0UmFuZ2UiLCJjaGFuZ2UiLCJyYW5nZSIsIm1hcmsiLCJvcHRpb25zIiwiaXNDb2xsYXBzZWQiLCJzdGF0ZSIsImRvY3VtZW50Iiwic3RhcnRLZXkiLCJzdGFydE9mZnNldCIsImVuZEtleSIsImVuZE9mZnNldCIsInRleHRzIiwiZ2V0VGV4dHNBdFJhbmdlIiwiZm9yRWFjaCIsIm5vZGUiLCJrZXkiLCJpbmRleCIsImxlbmd0aCIsInRleHQiLCJhZGRNYXJrQnlLZXkiLCJkZWxldGVBdFJhbmdlIiwic25hcHNob3RTZWxlY3Rpb24iLCJhbmNlc3RvciIsImdldENvbW1vbkFuY2VzdG9yIiwic3RhcnRDaGlsZCIsImdldEZ1cnRoZXN0QW5jZXN0b3IiLCJlbmRDaGlsZCIsInN0YXJ0Q2hpbGRJbmNsdWRlc1ZvaWQiLCJpc1ZvaWQiLCJhbmNob3JPZmZzZXQiLCJpc0JhY2t3YXJkIiwiZm9jdXNPZmZzZXQiLCJuZXh0U2libGluZyIsImdldE5leHRTaWJsaW5nIiwicmVtb3ZlTm9kZUJ5S2V5IiwiZ2V0VGV4dHMiLCJmaXJzdCIsInN0YXJ0Q2hpbGRFbmRPZlZvaWQiLCJub2RlcyIsInNpemUiLCJkZXNlbGVjdCIsInJlbW92ZVRleHRCeUtleSIsImtpbmQiLCJzcGxpdE5vZGVCeUtleSIsInNwbGl0RGVzY2VuZGFudHNCeUtleSIsInN0YXJ0SW5kZXgiLCJpbmRleE9mIiwiZW5kSW5kZXgiLCJtaWRkbGVzIiwic2xpY2UiLCJuZXh0IiwiZ2V0TmV4dFRleHQiLCJjaGlsZCIsInN0YXJ0QmxvY2siLCJnZXRDbG9zZXN0QmxvY2siLCJlbmRCbG9jayIsImkiLCJuZXdLZXkiLCJuZXdJbmRleCIsIm1vdmVOb2RlQnlLZXkiLCJsb25lbHkiLCJnZXRGdXJ0aGVzdE9ubHlDaGlsZEFuY2VzdG9yIiwibm9ybWFsaXplTm9kZUJ5S2V5IiwiZGVsZXRlQ2hhckJhY2t3YXJkQXRSYW5nZSIsIm9mZnNldCIsImdldE9mZnNldCIsIm8iLCJuIiwiZ2V0Q2hhck9mZnNldEJhY2t3YXJkIiwiZGVsZXRlQmFja3dhcmRBdFJhbmdlIiwiZGVsZXRlTGluZUJhY2t3YXJkQXRSYW5nZSIsImRlbGV0ZVdvcmRCYWNrd2FyZEF0UmFuZ2UiLCJnZXRXb3JkT2Zmc2V0QmFja3dhcmQiLCJpc0V4cGFuZGVkIiwiYmxvY2siLCJpc0VtcHR5IiwiaW5saW5lIiwiZ2V0Q2xvc2VzdElubGluZSIsImlzQXRTdGFydE9mIiwiZ2V0RGVzY2VuZGFudCIsInByZXYiLCJnZXRQcmV2aW91c1RleHQiLCJwcmV2QmxvY2siLCJwcmV2SW5saW5lIiwibWVyZ2UiLCJhbmNob3JLZXkiLCJ0cmF2ZXJzZWQiLCJoYXNWb2lkUGFyZW50IiwicGFyZW50IiwiZ2V0Q2xvc2VzdFZvaWQiLCJmb2N1c0tleSIsImRlbGV0ZUNoYXJGb3J3YXJkQXRSYW5nZSIsImdldENoYXJPZmZzZXRGb3J3YXJkIiwiZGVsZXRlRm9yd2FyZEF0UmFuZ2UiLCJkZWxldGVMaW5lRm9yd2FyZEF0UmFuZ2UiLCJkZWxldGVXb3JkRm9yd2FyZEF0UmFuZ2UiLCJnZXRXb3JkT2Zmc2V0Rm9yd2FyZCIsImlzQXRFbmRPZiIsIm5leHRCbG9jayIsIm5leHRJbmxpbmUiLCJpbnNlcnRCbG9ja0F0UmFuZ2UiLCJjcmVhdGUiLCJjb2xsYXBzZVRvU3RhcnQiLCJnZXRQYXJlbnQiLCJleHRyYSIsImluc2VydE5vZGVCeUtleSIsImluc2VydEZyYWdtZW50QXRSYW5nZSIsImZyYWdtZW50IiwibWFwRGVzY2VuZGFudHMiLCJyZWdlbmVyYXRlS2V5Iiwic3RhcnRUZXh0IiwiaXNBdFN0YXJ0IiwiYmxvY2tzIiwiZ2V0QmxvY2tzIiwiZmlyc3RCbG9jayIsImxhc3RCbG9jayIsImxhc3QiLCJsb25lbHlQYXJlbnQiLCJnZXRGdXJ0aGVzdCIsInAiLCJsb25lbHlDaGlsZCIsInJlbW92ZURlc2NlbmRhbnQiLCJuZXh0Q2hpbGQiLCJuZXh0Tm9kZXMiLCJza2lwVW50aWwiLCJsYXN0SW5kZXgiLCJpbmxpbmVDaGlsZCIsImlubGluZUluZGV4IiwiaW5zZXJ0SW5saW5lQXRSYW5nZSIsImFzc2VydERlc2NlbmRhbnQiLCJpbnNlcnRUZXh0QXRSYW5nZSIsIm1hcmtzIiwidW5kZWZpbmVkIiwiaW5zZXJ0VGV4dEJ5S2V5IiwicmVtb3ZlTWFya0F0UmFuZ2UiLCJyZW1vdmVNYXJrQnlLZXkiLCJzZXRCbG9ja0F0UmFuZ2UiLCJwcm9wZXJ0aWVzIiwiZ2V0QmxvY2tzQXRSYW5nZSIsInNldE5vZGVCeUtleSIsInNldElubGluZUF0UmFuZ2UiLCJpbmxpbmVzIiwiZ2V0SW5saW5lc0F0UmFuZ2UiLCJzcGxpdEJsb2NrQXRSYW5nZSIsImhlaWdodCIsImgiLCJzcGxpdElubGluZUF0UmFuZ2UiLCJJbmZpbml0eSIsInRvZ2dsZU1hcmtBdFJhbmdlIiwiZ2V0QWN0aXZlTWFya3NBdFJhbmdlIiwiZXhpc3RzIiwic29tZSIsIm0iLCJlcXVhbHMiLCJ1bndyYXBCbG9ja0F0UmFuZ2UiLCJjcmVhdGVQcm9wZXJ0aWVzIiwid3JhcHBlcnMiLCJtYXAiLCJnZXRDbG9zZXN0IiwidHlwZSIsImRhdGEiLCJpc1N1cGVyc2V0IiwiZmlsdGVyIiwidG9PcmRlcmVkU2V0IiwidG9MaXN0IiwiY2hpbGRyZW4iLCJiIiwiaGFzRGVzY2VuZGFudCIsImZpcnN0TWF0Y2giLCJsYXN0TWF0Y2giLCJ0YWtlVW50aWwiLCJwdXNoIiwiZmlyc3RUZXh0IiwiZ2V0Rmlyc3RUZXh0IiwiZ2V0TmV4dEJsb2NrIiwibm9ybWFsaXplRG9jdW1lbnQiLCJ1bndyYXBJbmxpbmVBdFJhbmdlIiwid3JhcEJsb2NrQXRSYW5nZSIsInNldCIsImNsZWFyIiwiZmlyc3RibG9jayIsImxhc3RibG9jayIsInNpYmxpbmdzIiwicDEiLCJwMiIsImluZGV4ZXMiLCJyZWR1Y2UiLCJpbmQiLCJ3cmFwSW5saW5lQXRSYW5nZSIsImlubGluZVBhcmVudCIsIndyYXBJbmxpbmVCeUtleSIsInN0YXJ0SW5uZXIiLCJzdGFydElubmVySW5kZXgiLCJlbmRJbm5lciIsInN0YXJ0SW5saW5lcyIsImVuZElubGluZXMiLCJzdGFydE5vZGUiLCJlbmROb2RlIiwid3JhcFRleHRBdFJhbmdlIiwicHJlZml4Iiwic3VmZml4Iiwic3RhcnQiLCJlbmQiLCJjb2xsYXBzZVRvRW5kIiwibW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsVUFBVSxFQUFoQjs7QUFFQTs7Ozs7O0FBTUEsSUFBTUMsT0FBTztBQUNYQyxhQUFXOztBQUdiOzs7Ozs7Ozs7O0FBSmEsQ0FBYixDQWNBRixRQUFRRyxjQUFSLEdBQXlCLFVBQUNDLE1BQUQsRUFBU0MsS0FBVCxFQUFnQkMsSUFBaEIsRUFBdUM7QUFBQSxNQUFqQkMsT0FBaUIsdUVBQVAsRUFBTzs7QUFDOUQsTUFBSUYsTUFBTUcsV0FBVixFQUF1Qjs7QUFEdUMsMkJBR2pDRCxPQUhpQyxDQUd0REwsU0FIc0Q7QUFBQSxNQUd0REEsU0FIc0Qsc0NBRzFDLElBSDBDO0FBQUEsTUFJdERPLEtBSnNELEdBSTVDTCxNQUo0QyxDQUl0REssS0FKc0Q7QUFBQSxNQUt0REMsUUFMc0QsR0FLekNELEtBTHlDLENBS3REQyxRQUxzRDtBQUFBLE1BTXREQyxRQU5zRCxHQU1UTixLQU5TLENBTXRETSxRQU5zRDtBQUFBLE1BTTVDQyxXQU40QyxHQU1UUCxLQU5TLENBTTVDTyxXQU40QztBQUFBLE1BTS9CQyxNQU4rQixHQU1UUixLQU5TLENBTS9CUSxNQU4rQjtBQUFBLE1BTXZCQyxTQU51QixHQU1UVCxLQU5TLENBTXZCUyxTQU51Qjs7QUFPOUQsTUFBTUMsUUFBUUwsU0FBU00sZUFBVCxDQUF5QlgsS0FBekIsQ0FBZDs7QUFFQVUsUUFBTUUsT0FBTixDQUFjLFVBQUNDLElBQUQsRUFBVTtBQUFBLFFBQ2RDLEdBRGMsR0FDTkQs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QTVDO0FBQ0FFLFNBQU9rSSxpQkFBUCxDQUF5QndFLEdBQXpCLEVBQThCRixNQUE5QixFQUFzQyxFQUF0QyxFQUEwQyxFQUFFMU0sb0JBQUYsRUFBMUM7QUFDRCxDQVpEOztBQWNBOzs7Ozs7a0JBTWVGLE8iLCJmaWxlIjoiYXQtcmFuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCbG9jayBmcm9tICcuLi9tb2RlbHMvYmxvY2snXG5pbXBvcnQgSW5saW5lIGZyb20gJy4uL21vZGVscy9pbmxpbmUnXG5pbXBvcnQgTWFyayBmcm9tICcuLi9tb2RlbHMvbWFyaydcbmltcG9ydCBOb2RlIGZyb20gJy4uL21vZGVscy9ub2RlJ1xuaW1wb3J0IFN0cmluZyBmcm9tICcuLi91dGlscy9zdHJpbmcnXG5pbXBvcnQgU0NIRU1BIGZyb20gJy4uL3NjaGVtYXMvY29yZSdcbmltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogQ2hhbmdlcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IENoYW5nZXMgPSB7fVxuXG4vKipcbiAqIEFuIG9wdGlvbnMgb2JqZWN0IHdpdGggbm9ybWFsaXplIHNldCB0byBgZmFsc2VgLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuY29uc3QgT1BUUyA9IHtcbiAgbm9ybWFsaXplOiBmYWxzZVxufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBgbWFya2AgdG8gdGhlIGNoYXJhY3RlcnMgYXQgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7TWl4ZWR9IG1hcmtcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5hZGRNYXJrQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBtYXJrLCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKHJhbmdlLmlzQ29sbGFwc2VkKSByZXR1cm5cblxuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHsgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0LCBlbmRLZXksIGVuZE9mZnNldCB9ID0gcmFuZ2VcbiAgY29uc3QgdGV4dHMgPSBkb2N1bWVudC5nZXRUZXh0c0F0UmFuZ2UocmFuZ2UpXG5cbiAgdGV4dHMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGNvbnN0IHsga2V5IH0gPSBub2RlXG4gICAgbGV0IGluZGV4ID0gMFxuICAgIGxldCBsZW5ndGggPSBub2RlLnRleHQubGVuZ3RoXG5cbiAgICBpZiAoa2V5ID09IHN0YXJ0S2V5KSBpbmRleCA9IHN0YXJ0T2Zmc2V0XG4gICAgaWYgKGtleSA9PSBlbmRLZXkpIGxlbmd0aCA9IGVuZE9mZnNldFxuICAgIGlmIChrZXkgPT0gc3RhcnRLZXkgJiYga2V5ID09IGVuZEtleSkgbGVuZ3RoID0gZW5kT2Zmc2V0IC0gc3RhcnRPZmZzZXRcblxuICAgIGNoYW5nZS5hZGRNYXJrQnlLZXkoa2V5LCBpbmRleCwgbGVuZ3RoLCBtYXJrLCB7IG5vcm1hbGl6ZSB9KVxuICB9KVxufVxuXG4vKipcbiAqIERlbGV0ZSBldmVyeXRoaW5nIGluIGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5kZWxldGVBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAocmFuZ2UuaXNDb2xsYXBzZWQpIHJldHVyblxuXG4gIGNoYW5nZS5zbmFwc2hvdFNlbGVjdGlvbigpXG5cbiAgY29uc3QgeyBub3JtYWxpemUgPSB0cnVlIH0gPSBvcHRpb25zXG4gIGxldCB7IHN0YXJ0S2V5LCBzdGFydE9mZnNldCwgZW5kS2V5LCBlbmRPZmZzZXQgfSA9IHJhbmdlXG5cbiAgLy8gU3BsaXQgYXQgdGhlIHJhbmdlIGVkZ2VzIHdpdGhpbiBhIGNvbW1vbiBhbmNlc3Rvciwgd2l0aG91dCBub3JtYWxpemluZy5cbiAgbGV0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgbGV0IGFuY2VzdG9yID0gZG9jdW1lbnQuZ2V0Q29tbW9uQW5jZXN0b3Ioc3RhcnRLZXksIGVuZEtleSlcbiAgbGV0IHN0YXJ0Q2hpbGQgPSBhbmNlc3Rvci5nZXRGdXJ0aGVzdEFuY2VzdG9yKHN0YXJ0S2V5KVxuICBsZXQgZW5kQ2hpbGQgPSBhbmNlc3Rvci5nZXRGdXJ0aGVzdEFuY2VzdG9yKGVuZEtleSlcblxuICAvLyBJZiB0aGUgc3RhcnQgY2hpbGQgaXMgYSB2b2lkIG5vZGUsIGFuZCB0aGUgcmFuZ2UgYmVnaW5zIG9yXG4gIC8vIGVuZHMgKHdoZW4gcmFuZ2UgaXMgYmFja3dhcmQpIGF0IHRoZSBzdGFydCBvZiBpdCwgcmVtb3ZlIGl0XG4gIC8vIGFuZCBzZXQgbmV4dFNpYmxpbmcgYXMgc3RhcnRDaGlsZCB1bnRpbCB0aGVyZSBpcyBubyBzdGFydENoaWxkXG4gIC8vIHRoYXQgaXMgYSB2b2lkIG5vZGUgYW5kIGluY2x1ZGVkIGluIHRoZSBzZWxlY3Rpb24gcmFuZ2VcbiAgbGV0IHN0YXJ0Q2hpbGRJbmNsdWRlc1ZvaWQgPSBzdGFydENoaWxkLmlzVm9pZCAmJiAoXG4gICAgcmFuZ2UuYW5jaG9yT2Zmc2V0ID09PSAwICYmICFyYW5nZS5pc0JhY2t3YXJkIHx8XG4gICAgcmFuZ2UuZm9jdXNPZmZzZXQgPT09IDAgJiYgcmFuZ2UuaXNCYWNrd2FyZFxuICApXG5cbiAgd2hpbGUgKHN0YXJ0Q2hpbGRJbmNsdWRlc1ZvaWQpIHtcbiAgICBjb25zdCBuZXh0U2libGluZyA9IGRvY3VtZW50LmdldE5leHRTaWJsaW5nKHN0YXJ0Q2hpbGQua2V5KVxuICAgIGNoYW5nZS5yZW1vdmVOb2RlQnlLZXkoc3RhcnRDaGlsZC5rZXksIE9QVFMpXG4gICAgLy8gQWJvcnQgaWYgbm8gbmV4dFNpYmxpbmcgb3Igd2UgYXJlIGFib3V0IHRvIHByb2Nlc3MgdGhlIGVuZENoaWxkIHdoaWNoIGlzIGFzbG8gYSB2b2lkIG5vZGVcbiAgICBpZiAoIW5leHRTaWJsaW5nIHx8IGVuZENoaWxkLmtleSA9PT0gbmV4dFNpYmxpbmcua2V5ICYmIG5leHRTaWJsaW5nLmlzVm9pZCkge1xuICAgICAgc3RhcnRDaGlsZEluY2x1ZGVzVm9pZCA9IGZhbHNlXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gUHJvY2VzcyB0aGUgbmV4dCB2b2lkXG4gICAgaWYgKG5leHRTaWJsaW5nLmlzVm9pZCkge1xuICAgICAgc3RhcnRDaGlsZCA9IG5leHRTaWJsaW5nXG4gICAgfVxuICAgIC8vIFNldCB0aGUgc3RhcnRDaGlsZCwgc3RhcnRLZXkgYW5kIHN0YXJ0T2Zmc2V0IGluIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG5leHQgbm9uIHZvaWQgc2libGluZ1xuICAgIGlmICghbmV4dFNpYmxpbmcuaXNWb2lkKSB7XG4gICAgICBzdGFydENoaWxkID0gbmV4dFNpYmxpbmdcbiAgICAgIGlmIChzdGFydENoaWxkLmdldFRleHRzKSB7XG4gICAgICAgIHN0YXJ0S2V5ID0gc3RhcnRDaGlsZC5nZXRUZXh0cygpLmZpcnN0KCkua2V5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydEtleSA9IHN0YXJ0Q2hpbGQua2V5XG4gICAgICB9XG4gICAgICBzdGFydE9mZnNldCA9IDBcbiAgICAgIHN0YXJ0Q2hpbGRJbmNsdWRlc1ZvaWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZSBzdGFydCBjaGlsZCBpcyBhIHZvaWQgbm9kZSwgYW5kIHRoZSByYW5nZSBlbmRzIG9yXG4gIC8vIGJlZ2lucyAod2hlbiByYW5nZSBpcyBiYWNrd2FyZCkgYXQgdGhlIGVuZCBvZiBpdCBtb3ZlIHRvIG5leHRTaWJsaW5nXG4gIGNvbnN0IHN0YXJ0Q2hpbGRFbmRPZlZvaWQgPSBzdGFydENoaWxkLmlzVm9pZCAmJiAoXG4gICAgcmFuZ2UuYW5jaG9yT2Zmc2V0ID09PSAxICYmICFyYW5nZS5pc0JhY2t3YXJkIHx8XG4gICAgcmFuZ2UuZm9jdXNPZmZzZXQgPT09IDEgJiYgcmFuZ2UuaXNCYWNrd2FyZFxuICApXG5cbiAgaWYgKHN0YXJ0Q2hpbGRFbmRPZlZvaWQpIHtcbiAgICBjb25zdCBuZXh0U2libGluZyA9IGRvY3VtZW50LmdldE5leHRTaWJsaW5nKHN0YXJ0Q2hpbGQua2V5KVxuICAgIGlmIChuZXh0U2libGluZykge1xuICAgICAgc3RhcnRDaGlsZCA9IG5leHRTaWJsaW5nXG4gICAgICBpZiAoc3RhcnRDaGlsZC5nZXRUZXh0cykge1xuICAgICAgICBzdGFydEtleSA9IHN0YXJ0Q2hpbGQuZ2V0VGV4dHMoKS5maXJzdCgpLmtleVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRLZXkgPSBzdGFydENoaWxkLmtleVxuICAgICAgfVxuICAgICAgc3RhcnRPZmZzZXQgPSAwXG4gICAgfVxuICB9XG5cbiAgLy8gSWYgdGhlIHN0YXJ0IGFuZCBlbmQga2V5IGFyZSB0aGUgc2FtZSwgd2UgY2FuIGp1c3QgcmVtb3ZlIGl0LlxuICBpZiAoc3RhcnRLZXkgPT0gZW5kS2V5KSB7XG4gICAgLy8gSWYgaXQgaXMgYSB2b2lkIG5vZGUsIHJlbW92ZSB0aGUgd2hvbGUgbm9kZVxuICAgIGlmIChhbmNlc3Rvci5pc1ZvaWQpIHtcbiAgICAgIC8vIERlc2VsZWN0IGlmIHRoaXMgaXMgdGhlIG9ubHkgbm9kZSBsZWZ0IGluIGRvY3VtZW50XG4gICAgICBpZiAoZG9jdW1lbnQubm9kZXMuc2l6ZSA9PT0gMSkge1xuICAgICAgICBjaGFuZ2UuZGVzZWxlY3QoKVxuICAgICAgfVxuICAgICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShhbmNlc3Rvci5rZXksIE9QVFMpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSB0ZXh0XG4gICAgY29uc3QgaW5kZXggPSBzdGFydE9mZnNldFxuICAgIGNvbnN0IGxlbmd0aCA9IGVuZE9mZnNldCAtIHN0YXJ0T2Zmc2V0XG4gICAgY2hhbmdlLnJlbW92ZVRleHRCeUtleShzdGFydEtleSwgaW5kZXgsIGxlbmd0aCwgeyBub3JtYWxpemUgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIFNwbGl0IGF0IHRoZSByYW5nZSBlZGdlcyB3aXRoaW4gYSBjb21tb24gYW5jZXN0b3IsIHdpdGhvdXQgbm9ybWFsaXppbmcuXG4gIHN0YXRlID0gY2hhbmdlLnN0YXRlXG4gIGRvY3VtZW50ID0gc3RhdGUuZG9jdW1lbnRcbiAgYW5jZXN0b3IgPSBkb2N1bWVudC5nZXRDb21tb25BbmNlc3RvcihzdGFydEtleSwgZW5kS2V5KVxuICBzdGFydENoaWxkID0gYW5jZXN0b3IuZ2V0RnVydGhlc3RBbmNlc3RvcihzdGFydEtleSlcbiAgZW5kQ2hpbGQgPSBhbmNlc3Rvci5nZXRGdXJ0aGVzdEFuY2VzdG9yKGVuZEtleSlcblxuICBpZiAoc3RhcnRDaGlsZC5raW5kID09ICd0ZXh0Jykge1xuICAgIGNoYW5nZS5zcGxpdE5vZGVCeUtleShzdGFydENoaWxkLmtleSwgc3RhcnRPZmZzZXQsIE9QVFMpXG4gIH0gZWxzZSB7XG4gICAgY2hhbmdlLnNwbGl0RGVzY2VuZGFudHNCeUtleShzdGFydENoaWxkLmtleSwgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0LCBPUFRTKVxuICB9XG5cbiAgaWYgKGVuZENoaWxkLmtpbmQgPT0gJ3RleHQnKSB7XG4gICAgY2hhbmdlLnNwbGl0Tm9kZUJ5S2V5KGVuZENoaWxkLmtleSwgZW5kT2Zmc2V0LCBPUFRTKVxuICB9IGVsc2Uge1xuICAgIGNoYW5nZS5zcGxpdERlc2NlbmRhbnRzQnlLZXkoZW5kQ2hpbGQua2V5LCBlbmRLZXksIGVuZE9mZnNldCwgT1BUUylcbiAgfVxuXG4gIC8vIFJlZnJlc2ggdmFyaWFibGVzLlxuICBzdGF0ZSA9IGNoYW5nZS5zdGF0ZVxuICBkb2N1bWVudCA9IHN0YXRlLmRvY3VtZW50XG4gIGFuY2VzdG9yID0gZG9jdW1lbnQuZ2V0Q29tbW9uQW5jZXN0b3Ioc3RhcnRLZXksIGVuZEtleSlcbiAgc3RhcnRDaGlsZCA9IGFuY2VzdG9yLmdldEZ1cnRoZXN0QW5jZXN0b3Ioc3RhcnRLZXkpXG4gIGVuZENoaWxkID0gYW5jZXN0b3IuZ2V0RnVydGhlc3RBbmNlc3RvcihlbmRLZXkpXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBhbmNlc3Rvci5ub2Rlcy5pbmRleE9mKHN0YXJ0Q2hpbGQpXG4gIGNvbnN0IGVuZEluZGV4ID0gYW5jZXN0b3Iubm9kZXMuaW5kZXhPZihlbmRDaGlsZClcbiAgY29uc3QgbWlkZGxlcyA9IGFuY2VzdG9yLm5vZGVzLnNsaWNlKHN0YXJ0SW5kZXggKyAxLCBlbmRJbmRleCArIDEpXG4gIGNvbnN0IG5leHQgPSBkb2N1bWVudC5nZXROZXh0VGV4dChlbmRLZXkpXG5cbiAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgbWlkZGxlIG5vZGVzLCBiZXR3ZWVuIHRoZSBzcGxpdHMuXG4gIGlmIChtaWRkbGVzLnNpemUpIHtcbiAgICBtaWRkbGVzLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGNoaWxkLmtleSwgT1BUUylcbiAgICB9KVxuICB9XG5cbiAgLy8gSWYgdGhlIHN0YXJ0IGFuZCBlbmQgYmxvY2sgYXJlIGRpZmZlcmVudCwgbW92ZSBhbGwgb2YgdGhlIG5vZGVzIGZyb20gdGhlXG4gIC8vIGVuZCBibG9jayBpbnRvIHRoZSBzdGFydCBibG9jay5cbiAgc3RhdGUgPSBjaGFuZ2Uuc3RhdGVcbiAgZG9jdW1lbnQgPSBzdGF0ZS5kb2N1bWVudFxuICBjb25zdCBzdGFydEJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHN0YXJ0S2V5KVxuICBjb25zdCBlbmRCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhuZXh0LmtleSlcblxuICAvLyBJZiB0aGUgZW5kQmxvY2sgaXMgdm9pZCwganVzdCByZW1vdmUgdGhlIHN0YXJ0QmxvY2tcbiAgaWYgKGVuZEJsb2NrLmlzVm9pZCkge1xuICAgIGNoYW5nZS5yZW1vdmVOb2RlQnlLZXkoc3RhcnRCbG9jay5rZXkpXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgc3RhcnQgYW5kIGVuZCBibG9jayBhcmUgZGlmZmVyZW50LCBtb3ZlIGFsbCBvZiB0aGUgbm9kZXMgZnJvbSB0aGVcbiAgLy8gZW5kIGJsb2NrIGludG8gdGhlIHN0YXJ0IGJsb2NrXG4gIGlmIChzdGFydEJsb2NrLmtleSAhPT0gZW5kQmxvY2sua2V5KSB7XG4gICAgZW5kQmxvY2subm9kZXMuZm9yRWFjaCgoY2hpbGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IG5ld0tleSA9IHN0YXJ0QmxvY2sua2V5XG4gICAgICBjb25zdCBuZXdJbmRleCA9IHN0YXJ0QmxvY2subm9kZXMuc2l6ZSArIGlcbiAgICAgIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KGNoaWxkLmtleSwgbmV3S2V5LCBuZXdJbmRleCwgT1BUUylcbiAgICB9KVxuXG4gICAgLy8gUmVtb3ZlIHBhcmVudHMgb2YgZW5kQmxvY2sgYXMgbG9uZyBhcyB0aGV5IGhhdmUgYSBzaW5nbGUgY2hpbGRcbiAgICBjb25zdCBsb25lbHkgPSBkb2N1bWVudC5nZXRGdXJ0aGVzdE9ubHlDaGlsZEFuY2VzdG9yKGVuZEJsb2NrLmtleSkgfHwgZW5kQmxvY2tcbiAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGxvbmVseS5rZXksIE9QVFMpXG4gIH1cblxuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShhbmNlc3Rvci5rZXksIFNDSEVNQSlcbiAgfVxufVxuXG4vKipcbiAqIERlbGV0ZSBiYWNrd2FyZCB1bnRpbCB0aGUgY2hhcmFjdGVyIGJvdW5kYXJ5IGF0IGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5kZWxldGVDaGFyQmFja3dhcmRBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIG9wdGlvbnMpID0+IHtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHsgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0IH0gPSByYW5nZVxuICBjb25zdCBzdGFydEJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHN0YXJ0S2V5KVxuICBjb25zdCBvZmZzZXQgPSBzdGFydEJsb2NrLmdldE9mZnNldChzdGFydEtleSlcbiAgY29uc3QgbyA9IG9mZnNldCArIHN0YXJ0T2Zmc2V0XG4gIGNvbnN0IHsgdGV4dCB9ID0gc3RhcnRCbG9ja1xuICBjb25zdCBuID0gU3RyaW5nLmdldENoYXJPZmZzZXRCYWNrd2FyZCh0ZXh0LCBvKVxuICBjaGFuZ2UuZGVsZXRlQmFja3dhcmRBdFJhbmdlKHJhbmdlLCBuLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIERlbGV0ZSBiYWNrd2FyZCB1bnRpbCB0aGUgbGluZSBib3VuZGFyeSBhdCBhIGByYW5nZWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMuZGVsZXRlTGluZUJhY2t3YXJkQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCB7IHN0YXJ0S2V5LCBzdGFydE9mZnNldCB9ID0gcmFuZ2VcbiAgY29uc3Qgc3RhcnRCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhzdGFydEtleSlcbiAgY29uc3Qgb2Zmc2V0ID0gc3RhcnRCbG9jay5nZXRPZmZzZXQoc3RhcnRLZXkpXG4gIGNvbnN0IG8gPSBvZmZzZXQgKyBzdGFydE9mZnNldFxuICBjaGFuZ2UuZGVsZXRlQmFja3dhcmRBdFJhbmdlKHJhbmdlLCBvLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIERlbGV0ZSBiYWNrd2FyZCB1bnRpbCB0aGUgd29yZCBib3VuZGFyeSBhdCBhIGByYW5nZWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMuZGVsZXRlV29yZEJhY2t3YXJkQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCB7IHN0YXJ0S2V5LCBzdGFydE9mZnNldCB9ID0gcmFuZ2VcbiAgY29uc3Qgc3RhcnRCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhzdGFydEtleSlcbiAgY29uc3Qgb2Zmc2V0ID0gc3RhcnRCbG9jay5nZXRPZmZzZXQoc3RhcnRLZXkpXG4gIGNvbnN0IG8gPSBvZmZzZXQgKyBzdGFydE9mZnNldFxuICBjb25zdCB7IHRleHQgfSA9IHN0YXJ0QmxvY2tcbiAgY29uc3QgbiA9IFN0cmluZy5nZXRXb3JkT2Zmc2V0QmFja3dhcmQodGV4dCwgbylcbiAgY2hhbmdlLmRlbGV0ZUJhY2t3YXJkQXRSYW5nZShyYW5nZSwgbiwgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBEZWxldGUgYmFja3dhcmQgYG5gIGNoYXJhY3RlcnMgYXQgYSBgcmFuZ2VgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICogQHBhcmFtIHtOdW1iZXJ9IG4gKG9wdGlvbmFsKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLmRlbGV0ZUJhY2t3YXJkQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBuID0gMSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgeyBzdGFydEtleSwgZm9jdXNPZmZzZXQgfSA9IHJhbmdlXG5cbiAgLy8gSWYgdGhlIHJhbmdlIGlzIGV4cGFuZGVkLCBwZXJmb3JtIGEgcmVndWxhciBkZWxldGUgaW5zdGVhZC5cbiAgaWYgKHJhbmdlLmlzRXhwYW5kZWQpIHtcbiAgICBjaGFuZ2UuZGVsZXRlQXRSYW5nZShyYW5nZSwgeyBub3JtYWxpemUgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHN0YXJ0S2V5KVxuICAvLyBJZiB0aGUgY2xvc2VzdCBibG9jayBpcyB2b2lkLCBkZWxldGUgaXQuXG4gIGlmIChibG9jayAmJiBibG9jay5pc1ZvaWQpIHtcbiAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGJsb2NrLmtleSwgeyBub3JtYWxpemUgfSlcbiAgICByZXR1cm5cbiAgfVxuICAvLyBJZiB0aGUgY2xvc2VzdCBpcyBub3Qgdm9pZCwgYnV0IGVtcHR5LCByZW1vdmUgaXRcbiAgaWYgKGJsb2NrICYmICFibG9jay5pc1ZvaWQgJiYgYmxvY2suaXNFbXB0eSAmJiBkb2N1bWVudC5ub2Rlcy5zaXplICE9PSAxKSB7XG4gICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShibG9jay5rZXksIHsgbm9ybWFsaXplIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgY2xvc2VzdCBpbmxpbmUgaXMgdm9pZCwgZGVsZXRlIGl0LlxuICBjb25zdCBpbmxpbmUgPSBkb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKHN0YXJ0S2V5KVxuICBpZiAoaW5saW5lICYmIGlubGluZS5pc1ZvaWQpIHtcbiAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGlubGluZS5rZXksIHsgbm9ybWFsaXplIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgcmFuZ2UgaXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBkb2N1bWVudCwgYWJvcnQuXG4gIGlmIChyYW5nZS5pc0F0U3RhcnRPZihkb2N1bWVudCkpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIElmIHRoZSByYW5nZSBpcyBhdCB0aGUgc3RhcnQgb2YgdGhlIHRleHQgbm9kZSwgd2UgbmVlZCB0byBmaWd1cmUgb3V0IHdoYXRcbiAgLy8gaXMgYmVoaW5kIGl0IHRvIGtub3cgaG93IHRvIGRlbGV0ZS4uLlxuICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RGVzY2VuZGFudChzdGFydEtleSlcbiAgaWYgKHJhbmdlLmlzQXRTdGFydE9mKHRleHQpKSB7XG4gICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmdldFByZXZpb3VzVGV4dCh0ZXh0LmtleSlcbiAgICBjb25zdCBwcmV2QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2socHJldi5rZXkpXG4gICAgY29uc3QgcHJldklubGluZSA9IGRvY3VtZW50LmdldENsb3Nlc3RJbmxpbmUocHJldi5rZXkpXG5cbiAgICAvLyBJZiB0aGUgcHJldmlvdXMgYmxvY2sgaXMgdm9pZCwgcmVtb3ZlIGl0LlxuICAgIGlmIChwcmV2QmxvY2sgJiYgcHJldkJsb2NrLmlzVm9pZCkge1xuICAgICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShwcmV2QmxvY2sua2V5LCB7IG5vcm1hbGl6ZSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHByZXZpb3VzIGlubGluZSBpcyB2b2lkLCByZW1vdmUgaXQuXG4gICAgaWYgKHByZXZJbmxpbmUgJiYgcHJldklubGluZS5pc1ZvaWQpIHtcbiAgICAgIGNoYW5nZS5yZW1vdmVOb2RlQnlLZXkocHJldklubGluZS5rZXksIHsgbm9ybWFsaXplIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSdyZSBkZWxldGluZyBieSBvbmUgY2hhcmFjdGVyIGFuZCB0aGUgcHJldmlvdXMgdGV4dCBub2RlIGlzIG5vdFxuICAgIC8vIGluc2lkZSB0aGUgY3VycmVudCBibG9jaywgd2UgbmVlZCB0byBtZXJnZSB0aGUgdHdvIGJsb2NrcyB0b2dldGhlci5cbiAgICBpZiAobiA9PSAxICYmIHByZXZCbG9jayAhPSBibG9jaykge1xuICAgICAgcmFuZ2UgPSByYW5nZS5tZXJnZSh7XG4gICAgICAgIGFuY2hvcktleTogcHJldi5rZXksXG4gICAgICAgIGFuY2hvck9mZnNldDogcHJldi50ZXh0Lmxlbmd0aCxcbiAgICAgIH0pXG5cbiAgICAgIGNoYW5nZS5kZWxldGVBdFJhbmdlKHJhbmdlLCB7IG5vcm1hbGl6ZSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICB9XG5cbiAgLy8gSWYgdGhlIGZvY3VzIG9mZnNldCBpcyBmYXJ0aGVyIHRoYW4gdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIGRlbGV0ZSxcbiAgLy8ganVzdCByZW1vdmUgdGhlIGNoYXJhY3RlcnMgYmFja3dhcmRzIGluc2lkZSB0aGUgY3VycmVudCBub2RlLlxuICBpZiAobiA8IGZvY3VzT2Zmc2V0KSB7XG4gICAgcmFuZ2UgPSByYW5nZS5tZXJnZSh7XG4gICAgICBmb2N1c09mZnNldDogZm9jdXNPZmZzZXQgLSBuLFxuICAgICAgaXNCYWNrd2FyZDogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY2hhbmdlLmRlbGV0ZUF0UmFuZ2UocmFuZ2UsIHsgbm9ybWFsaXplIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBPdGhlcndpc2UsIHdlIG5lZWQgdG8gc2VlIGhvdyBtYW55IG5vZGVzIGJhY2t3YXJkcyB0byBnby5cbiAgbGV0IG5vZGUgPSB0ZXh0XG4gIGxldCBvZmZzZXQgPSAwXG4gIGxldCB0cmF2ZXJzZWQgPSBmb2N1c09mZnNldFxuXG4gIHdoaWxlIChuID4gdHJhdmVyc2VkKSB7XG4gICAgbm9kZSA9IGRvY3VtZW50LmdldFByZXZpb3VzVGV4dChub2RlLmtleSlcbiAgICBjb25zdCBuZXh0ID0gdHJhdmVyc2VkICsgbm9kZS50ZXh0Lmxlbmd0aFxuICAgIGlmIChuIDw9IG5leHQpIHtcbiAgICAgIG9mZnNldCA9IG5leHQgLSBuXG4gICAgICBicmVha1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmF2ZXJzZWQgPSBuZXh0XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgdGhlIGZvY3VzIG5vZGUgaXMgaW5zaWRlIGEgdm9pZCwgZ28gdXAgdW50aWwgcmlnaHQgYWZ0ZXIgaXQuXG4gIGlmIChkb2N1bWVudC5oYXNWb2lkUGFyZW50KG5vZGUua2V5KSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldENsb3Nlc3RWb2lkKG5vZGUua2V5KVxuICAgIG5vZGUgPSBkb2N1bWVudC5nZXROZXh0VGV4dChwYXJlbnQua2V5KVxuICAgIG9mZnNldCA9IDBcbiAgfVxuXG4gIHJhbmdlID0gcmFuZ2UubWVyZ2Uoe1xuICAgIGZvY3VzS2V5OiBub2RlLmtleSxcbiAgICBmb2N1c09mZnNldDogb2Zmc2V0LFxuICAgIGlzQmFja3dhcmQ6IHRydWVcbiAgfSlcblxuICBjaGFuZ2UuZGVsZXRlQXRSYW5nZShyYW5nZSwgeyBub3JtYWxpemUgfSlcbn1cblxuLyoqXG4gKiBEZWxldGUgZm9yd2FyZCB1bnRpbCB0aGUgY2hhcmFjdGVyIGJvdW5kYXJ5IGF0IGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5kZWxldGVDaGFyRm9yd2FyZEF0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgb3B0aW9ucykgPT4ge1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGNvbnN0IHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soc3RhcnRLZXkpXG4gIGNvbnN0IG9mZnNldCA9IHN0YXJ0QmxvY2suZ2V0T2Zmc2V0KHN0YXJ0S2V5KVxuICBjb25zdCBvID0gb2Zmc2V0ICsgc3RhcnRPZmZzZXRcbiAgY29uc3QgeyB0ZXh0IH0gPSBzdGFydEJsb2NrXG4gIGNvbnN0IG4gPSBTdHJpbmcuZ2V0Q2hhck9mZnNldEZvcndhcmQodGV4dCwgbylcbiAgY2hhbmdlLmRlbGV0ZUZvcndhcmRBdFJhbmdlKHJhbmdlLCBuLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIERlbGV0ZSBmb3J3YXJkIHVudGlsIHRoZSBsaW5lIGJvdW5kYXJ5IGF0IGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5kZWxldGVMaW5lRm9yd2FyZEF0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgb3B0aW9ucykgPT4ge1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGNvbnN0IHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soc3RhcnRLZXkpXG4gIGNvbnN0IG9mZnNldCA9IHN0YXJ0QmxvY2suZ2V0T2Zmc2V0KHN0YXJ0S2V5KVxuICBjb25zdCBvID0gb2Zmc2V0ICsgc3RhcnRPZmZzZXRcbiAgY2hhbmdlLmRlbGV0ZUZvcndhcmRBdFJhbmdlKHJhbmdlLCBvLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIERlbGV0ZSBmb3J3YXJkIHVudGlsIHRoZSB3b3JkIGJvdW5kYXJ5IGF0IGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5kZWxldGVXb3JkRm9yd2FyZEF0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgb3B0aW9ucykgPT4ge1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGNvbnN0IHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soc3RhcnRLZXkpXG4gIGNvbnN0IG9mZnNldCA9IHN0YXJ0QmxvY2suZ2V0T2Zmc2V0KHN0YXJ0S2V5KVxuICBjb25zdCBvID0gb2Zmc2V0ICsgc3RhcnRPZmZzZXRcbiAgY29uc3QgeyB0ZXh0IH0gPSBzdGFydEJsb2NrXG4gIGNvbnN0IG4gPSBTdHJpbmcuZ2V0V29yZE9mZnNldEZvcndhcmQodGV4dCwgbylcbiAgY2hhbmdlLmRlbGV0ZUZvcndhcmRBdFJhbmdlKHJhbmdlLCBuLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIERlbGV0ZSBmb3J3YXJkIGBuYCBjaGFyYWN0ZXJzIGF0IGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBuIChvcHRpb25hbClcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5kZWxldGVGb3J3YXJkQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBuID0gMSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgeyBzdGFydEtleSwgZm9jdXNPZmZzZXQgfSA9IHJhbmdlXG5cbiAgLy8gSWYgdGhlIHJhbmdlIGlzIGV4cGFuZGVkLCBwZXJmb3JtIGEgcmVndWxhciBkZWxldGUgaW5zdGVhZC5cbiAgaWYgKHJhbmdlLmlzRXhwYW5kZWQpIHtcbiAgICBjaGFuZ2UuZGVsZXRlQXRSYW5nZShyYW5nZSwgeyBub3JtYWxpemUgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHN0YXJ0S2V5KVxuICAvLyBJZiB0aGUgY2xvc2VzdCBibG9jayBpcyB2b2lkLCBkZWxldGUgaXQuXG4gIGlmIChibG9jayAmJiBibG9jay5pc1ZvaWQpIHtcbiAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGJsb2NrLmtleSwgeyBub3JtYWxpemUgfSlcbiAgICByZXR1cm5cbiAgfVxuICAvLyBJZiB0aGUgY2xvc2VzdCBpcyBub3Qgdm9pZCwgYnV0IGVtcHR5LCByZW1vdmUgaXRcbiAgaWYgKGJsb2NrICYmICFibG9jay5pc1ZvaWQgJiYgYmxvY2suaXNFbXB0eSAmJiBkb2N1bWVudC5ub2Rlcy5zaXplICE9PSAxKSB7XG4gICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShibG9jay5rZXksIHsgbm9ybWFsaXplIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgY2xvc2VzdCBpbmxpbmUgaXMgdm9pZCwgZGVsZXRlIGl0LlxuICBjb25zdCBpbmxpbmUgPSBkb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKHN0YXJ0S2V5KVxuICBpZiAoaW5saW5lICYmIGlubGluZS5pc1ZvaWQpIHtcbiAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGlubGluZS5rZXksIHsgbm9ybWFsaXplIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgcmFuZ2UgaXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBkb2N1bWVudCwgYWJvcnQuXG4gIGlmIChyYW5nZS5pc0F0RW5kT2YoZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgcmFuZ2UgaXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSB0ZXh0IG5vZGUsIHdlIG5lZWQgdG8gZmlndXJlIG91dCB3aGF0XG4gIC8vIGlzIGJlaGluZCBpdCB0byBrbm93IGhvdyB0byBkZWxldGUuLi5cbiAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmdldERlc2NlbmRhbnQoc3RhcnRLZXkpXG4gIGlmIChyYW5nZS5pc0F0RW5kT2YodGV4dCkpIHtcbiAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuZ2V0TmV4dFRleHQodGV4dC5rZXkpXG4gICAgY29uc3QgbmV4dEJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKG5leHQua2V5KVxuICAgIGNvbnN0IG5leHRJbmxpbmUgPSBkb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKG5leHQua2V5KVxuXG4gICAgLy8gSWYgdGhlIHByZXZpb3VzIGJsb2NrIGlzIHZvaWQsIHJlbW92ZSBpdC5cbiAgICBpZiAobmV4dEJsb2NrICYmIG5leHRCbG9jay5pc1ZvaWQpIHtcbiAgICAgIGNoYW5nZS5yZW1vdmVOb2RlQnlLZXkobmV4dEJsb2NrLmtleSwgeyBub3JtYWxpemUgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIElmIHRoZSBwcmV2aW91cyBpbmxpbmUgaXMgdm9pZCwgcmVtb3ZlIGl0LlxuICAgIGlmIChuZXh0SW5saW5lICYmIG5leHRJbmxpbmUuaXNWb2lkKSB7XG4gICAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KG5leHRJbmxpbmUua2V5LCB7IG5vcm1hbGl6ZSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgd2UncmUgZGVsZXRpbmcgYnkgb25lIGNoYXJhY3RlciBhbmQgdGhlIHByZXZpb3VzIHRleHQgbm9kZSBpcyBub3RcbiAgICAvLyBpbnNpZGUgdGhlIGN1cnJlbnQgYmxvY2ssIHdlIG5lZWQgdG8gbWVyZ2UgdGhlIHR3byBibG9ja3MgdG9nZXRoZXIuXG4gICAgaWYgKG4gPT0gMSAmJiBuZXh0QmxvY2sgIT0gYmxvY2spIHtcbiAgICAgIHJhbmdlID0gcmFuZ2UubWVyZ2Uoe1xuICAgICAgICBmb2N1c0tleTogbmV4dC5rZXksXG4gICAgICAgIGZvY3VzT2Zmc2V0OiAwXG4gICAgICB9KVxuXG4gICAgICBjaGFuZ2UuZGVsZXRlQXRSYW5nZShyYW5nZSwgeyBub3JtYWxpemUgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZSByZW1haW5pbmcgY2hhcmFjdGVycyB0byB0aGUgZW5kIG9mIHRoZSBub2RlIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbFxuICAvLyB0byB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgdG8gZGVsZXRlLCBqdXN0IHJlbW92ZSB0aGUgY2hhcmFjdGVycyBmb3J3YXJkc1xuICAvLyBpbnNpZGUgdGhlIGN1cnJlbnQgbm9kZS5cbiAgaWYgKG4gPD0gKHRleHQudGV4dC5sZW5ndGggLSBmb2N1c09mZnNldCkpIHtcbiAgICByYW5nZSA9IHJhbmdlLm1lcmdlKHtcbiAgICAgIGZvY3VzT2Zmc2V0OiBmb2N1c09mZnNldCArIG5cbiAgICB9KVxuXG4gICAgY2hhbmdlLmRlbGV0ZUF0UmFuZ2UocmFuZ2UsIHsgbm9ybWFsaXplIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBPdGhlcndpc2UsIHdlIG5lZWQgdG8gc2VlIGhvdyBtYW55IG5vZGVzIGZvcndhcmRzIHRvIGdvLlxuICBsZXQgbm9kZSA9IHRleHRcbiAgbGV0IG9mZnNldCA9IGZvY3VzT2Zmc2V0XG4gIGxldCB0cmF2ZXJzZWQgPSB0ZXh0LnRleHQubGVuZ3RoIC0gZm9jdXNPZmZzZXRcblxuICB3aGlsZSAobiA+IHRyYXZlcnNlZCkge1xuICAgIG5vZGUgPSBkb2N1bWVudC5nZXROZXh0VGV4dChub2RlLmtleSlcbiAgICBjb25zdCBuZXh0ID0gdHJhdmVyc2VkICsgbm9kZS50ZXh0Lmxlbmd0aFxuICAgIGlmIChuIDw9IG5leHQpIHtcbiAgICAgIG9mZnNldCA9IG4gLSB0cmF2ZXJzZWRcbiAgICAgIGJyZWFrXG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYXZlcnNlZCA9IG5leHRcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGUgZm9jdXMgbm9kZSBpcyBpbnNpZGUgYSB2b2lkLCBnbyB1cCB1bnRpbCByaWdodCBiZWZvcmUgaXQuXG4gIGlmIChkb2N1bWVudC5oYXNWb2lkUGFyZW50KG5vZGUua2V5KSkge1xuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldENsb3Nlc3RWb2lkKG5vZGUua2V5KVxuICAgIG5vZGUgPSBkb2N1bWVudC5nZXRQcmV2aW91c1RleHQocGFyZW50LmtleSlcbiAgICBvZmZzZXQgPSBub2RlLnRleHQubGVuZ3RoXG4gIH1cblxuICByYW5nZSA9IHJhbmdlLm1lcmdlKHtcbiAgICBmb2N1c0tleTogbm9kZS5rZXksXG4gICAgZm9jdXNPZmZzZXQ6IG9mZnNldCxcbiAgfSlcblxuICBjaGFuZ2UuZGVsZXRlQXRSYW5nZShyYW5nZSwgeyBub3JtYWxpemUgfSlcbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBgYmxvY2tgIG5vZGUgYXQgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7QmxvY2t8U3RyaW5nfE9iamVjdH0gYmxvY2tcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5pbnNlcnRCbG9ja0F0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgYmxvY2ssIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBibG9jayA9IEJsb2NrLmNyZWF0ZShibG9jaylcbiAgY29uc3QgeyBub3JtYWxpemUgPSB0cnVlIH0gPSBvcHRpb25zXG5cbiAgaWYgKHJhbmdlLmlzRXhwYW5kZWQpIHtcbiAgICBjaGFuZ2UuZGVsZXRlQXRSYW5nZShyYW5nZSlcbiAgICByYW5nZSA9IHJhbmdlLmNvbGxhcHNlVG9TdGFydCgpXG4gIH1cblxuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGNvbnN0IHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soc3RhcnRLZXkpXG4gIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChzdGFydEJsb2NrLmtleSlcbiAgY29uc3QgaW5kZXggPSBwYXJlbnQubm9kZXMuaW5kZXhPZihzdGFydEJsb2NrKVxuXG4gIGlmIChzdGFydEJsb2NrLmlzVm9pZCkge1xuICAgIGNvbnN0IGV4dHJhID0gcmFuZ2UuaXNBdEVuZE9mKHN0YXJ0QmxvY2spID8gMSA6IDBcbiAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4ICsgZXh0cmEsIGJsb2NrLCB7IG5vcm1hbGl6ZSB9KVxuICB9XG5cbiAgZWxzZSBpZiAoc3RhcnRCbG9jay5pc0VtcHR5KSB7XG4gICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShzdGFydEJsb2NrLmtleSlcbiAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4LCBibG9jaywgeyBub3JtYWxpemUgfSlcbiAgfVxuXG4gIGVsc2UgaWYgKHJhbmdlLmlzQXRTdGFydE9mKHN0YXJ0QmxvY2spKSB7XG4gICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShwYXJlbnQua2V5LCBpbmRleCwgYmxvY2ssIHsgbm9ybWFsaXplIH0pXG4gIH1cblxuICBlbHNlIGlmIChyYW5nZS5pc0F0RW5kT2Yoc3RhcnRCbG9jaykpIHtcbiAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4ICsgMSwgYmxvY2ssIHsgbm9ybWFsaXplIH0pXG4gIH1cblxuICBlbHNlIHtcbiAgICBjaGFuZ2Uuc3BsaXREZXNjZW5kYW50c0J5S2V5KHN0YXJ0QmxvY2sua2V5LCBzdGFydEtleSwgc3RhcnRPZmZzZXQsIE9QVFMpXG4gICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShwYXJlbnQua2V5LCBpbmRleCArIDEsIGJsb2NrLCB7IG5vcm1hbGl6ZSB9KVxuICB9XG5cbiAgaWYgKG5vcm1hbGl6ZSkge1xuICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkocGFyZW50LmtleSwgU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogSW5zZXJ0IGEgYGZyYWdtZW50YCBhdCBhIGByYW5nZWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gKiBAcGFyYW0ge0RvY3VtZW50fSBmcmFnbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLmluc2VydEZyYWdtZW50QXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBmcmFnbWVudCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuXG4gIC8vIElmIHRoZSByYW5nZSBpcyBleHBhbmRlZCwgZGVsZXRlIGl0IGZpcnN0LlxuICBpZiAocmFuZ2UuaXNFeHBhbmRlZCkge1xuICAgIGNoYW5nZS5kZWxldGVBdFJhbmdlKHJhbmdlLCBPUFRTKVxuICAgIHJhbmdlID0gcmFuZ2UuY29sbGFwc2VUb1N0YXJ0KClcbiAgfVxuXG4gIC8vIElmIHRoZSBmcmFnbWVudCBpcyBlbXB0eSwgdGhlcmUncyBub3RoaW5nIHRvIGRvIGFmdGVyIGRlbGV0aW5nLlxuICBpZiAoIWZyYWdtZW50Lm5vZGVzLnNpemUpIHJldHVyblxuXG4gIC8vIFJlZ2VuZXJhdGUgdGhlIGtleXMgZm9yIGFsbCBvZiB0aGUgZnJhZ21lbnRzIG5vZGVzLCBzbyB0aGF0IHRoZXkncmVcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gY29sbGlkZSB3aXRoIHRoZSBleGlzdGluZyBrZXlzIGluIHRoZSBkb2N1bWVudC4gT3RoZXJ3aXNlXG4gIC8vIHRoZXkgd2lsbCBiZSByZW5nZXJhdGVkIGF1dG9tYXRpY2FsbHkgYW5kIHdlIHdvbid0IGhhdmUgYW4gZWFzeSB3YXkgdG9cbiAgLy8gcmVmZXJlbmNlIHRoZW0uXG4gIGZyYWdtZW50ID0gZnJhZ21lbnQubWFwRGVzY2VuZGFudHMoY2hpbGQgPT4gY2hpbGQucmVnZW5lcmF0ZUtleSgpKVxuXG4gIC8vIENhbGN1bGF0ZSBhIGZldyB0aGluZ3MuLi5cbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGxldCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgbGV0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGxldCBzdGFydFRleHQgPSBkb2N1bWVudC5nZXREZXNjZW5kYW50KHN0YXJ0S2V5KVxuICBsZXQgc3RhcnRCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhzdGFydFRleHQua2V5KVxuICBsZXQgc3RhcnRDaGlsZCA9IHN0YXJ0QmxvY2suZ2V0RnVydGhlc3RBbmNlc3RvcihzdGFydFRleHQua2V5KVxuICBjb25zdCBpc0F0U3RhcnQgPSByYW5nZS5pc0F0U3RhcnRPZihzdGFydEJsb2NrKVxuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoc3RhcnRCbG9jay5rZXkpXG4gIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yoc3RhcnRCbG9jaylcbiAgY29uc3QgYmxvY2tzID0gZnJhZ21lbnQuZ2V0QmxvY2tzKClcbiAgY29uc3QgZmlyc3RCbG9jayA9IGJsb2Nrcy5maXJzdCgpXG4gIGNvbnN0IGxhc3RCbG9jayA9IGJsb2Nrcy5sYXN0KClcblxuICAvLyBJZiB0aGUgZnJhZ21lbnQgb25seSBjb250YWlucyBhIHZvaWQgYmxvY2ssIHVzZSBgaW5zZXJ0QmxvY2tgIGluc3RlYWQuXG4gIGlmIChmaXJzdEJsb2NrID09IGxhc3RCbG9jayAmJiBmaXJzdEJsb2NrLmlzVm9pZCkge1xuICAgIGNoYW5nZS5pbnNlcnRCbG9ja0F0UmFuZ2UocmFuZ2UsIGZpcnN0QmxvY2ssIG9wdGlvbnMpXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBJZiB0aGUgZmlyc3QgYW5kIGxhc3QgYmxvY2sgYXJlbid0IHRoZSBzYW1lLCB3ZSBuZWVkIHRvIGluc2VydCBhbGwgb2YgdGhlXG4gIC8vIG5vZGVzIGFmdGVyIHRoZSBmcmFnbWVudCdzIGZpcnN0IGJsb2NrIGF0IHRoZSBpbmRleC5cbiAgaWYgKGZpcnN0QmxvY2sgIT0gbGFzdEJsb2NrKSB7XG4gICAgY29uc3QgbG9uZWx5UGFyZW50ID0gZnJhZ21lbnQuZ2V0RnVydGhlc3QoZmlyc3RCbG9jay5rZXksIHAgPT4gcC5ub2Rlcy5zaXplID09IDEpXG4gICAgY29uc3QgbG9uZWx5Q2hpbGQgPSBsb25lbHlQYXJlbnQgfHwgZmlyc3RCbG9ja1xuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBwYXJlbnQubm9kZXMuaW5kZXhPZihzdGFydEJsb2NrKVxuICAgIGZyYWdtZW50ID0gZnJhZ21lbnQucmVtb3ZlRGVzY2VuZGFudChsb25lbHlDaGlsZC5rZXkpXG5cbiAgICBmcmFnbWVudC5ub2Rlcy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG4gICAgICBjb25zdCBuZXdJbmRleCA9IHN0YXJ0SW5kZXggKyBpICsgMVxuICAgICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShwYXJlbnQua2V5LCBuZXdJbmRleCwgbm9kZSwgT1BUUylcbiAgICB9KVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBzcGxpdCB0aGUgbm9kZS5cbiAgaWYgKHN0YXJ0T2Zmc2V0ICE9IDApIHtcbiAgICBjaGFuZ2Uuc3BsaXREZXNjZW5kYW50c0J5S2V5KHN0YXJ0Q2hpbGQua2V5LCBzdGFydEtleSwgc3RhcnRPZmZzZXQsIE9QVFMpXG4gIH1cblxuICAvLyBVcGRhdGUgb3VyIHZhcmlhYmxlcyB3aXRoIHRoZSBuZXcgc3RhdGUuXG4gIHN0YXRlID0gY2hhbmdlLnN0YXRlXG4gIGRvY3VtZW50ID0gc3RhdGUuZG9jdW1lbnRcbiAgc3RhcnRUZXh0ID0gZG9jdW1lbnQuZ2V0RGVzY2VuZGFudChzdGFydEtleSlcbiAgc3RhcnRCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhzdGFydEtleSlcbiAgc3RhcnRDaGlsZCA9IHN0YXJ0QmxvY2suZ2V0RnVydGhlc3RBbmNlc3RvcihzdGFydFRleHQua2V5KVxuXG4gIC8vIElmIHRoZSBmaXJzdCBhbmQgbGFzdCBibG9jayBhcmVuJ3QgdGhlIHNhbWUsIHdlIG5lZWQgdG8gbW92ZSBhbnkgb2YgdGhlXG4gIC8vIHN0YXJ0aW5nIGJsb2NrJ3MgY2hpbGRyZW4gYWZ0ZXIgdGhlIHNwbGl0IGludG8gdGhlIGxhc3QgYmxvY2sgb2YgdGhlXG4gIC8vIGZyYWdtZW50LCB3aGljaCBoYXMgYWxyZWFkeSBiZWVuIGluc2VydGVkLlxuICBpZiAoZmlyc3RCbG9jayAhPSBsYXN0QmxvY2spIHtcbiAgICBjb25zdCBuZXh0Q2hpbGQgPSBpc0F0U3RhcnQgPyBzdGFydENoaWxkIDogc3RhcnRCbG9jay5nZXROZXh0U2libGluZyhzdGFydENoaWxkLmtleSlcbiAgICBjb25zdCBuZXh0Tm9kZXMgPSBuZXh0Q2hpbGQgPyBzdGFydEJsb2NrLm5vZGVzLnNraXBVbnRpbChuID0+IG4ua2V5ID09IG5leHRDaGlsZC5rZXkpIDogTGlzdCgpXG4gICAgY29uc3QgbGFzdEluZGV4ID0gbGFzdEJsb2NrLm5vZGVzLnNpemVcblxuICAgIG5leHROb2Rlcy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG4gICAgICBjb25zdCBuZXdJbmRleCA9IGxhc3RJbmRleCArIGlcbiAgICAgIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KG5vZGUua2V5LCBsYXN0QmxvY2sua2V5LCBuZXdJbmRleCwgT1BUUylcbiAgICB9KVxuICB9XG5cbiAgLy8gSWYgdGhlIHN0YXJ0aW5nIGJsb2NrIGlzIGVtcHR5LCB3ZSByZXBsYWNlIGl0IGVudGlyZWx5IHdpdGggdGhlIGZpcnN0IGJsb2NrXG4gIC8vIG9mIHRoZSBmcmFnbWVudCwgc2luY2UgdGhpcyBsZWFkcyB0byBhIG1vcmUgZXhwZWN0ZWQgYmVoYXZpb3IgZm9yIHRoZSB1c2VyLlxuICBpZiAoc3RhcnRCbG9jay5pc0VtcHR5KSB7XG4gICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShzdGFydEJsb2NrLmtleSwgT1BUUylcbiAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4LCBmaXJzdEJsb2NrLCBPUFRTKVxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCB3ZSBtYWludGFpbiB0aGUgc3RhcnRpbmcgYmxvY2ssIGFuZCBpbnNlcnQgYWxsIG9mIHRoZSBmaXJzdFxuICAvLyBibG9jaydzIGlubGluZSBub2RlcyBpbnRvIGl0IGF0IHRoZSBzcGxpdCBwb2ludC5cbiAgZWxzZSB7XG4gICAgY29uc3QgaW5saW5lQ2hpbGQgPSBzdGFydEJsb2NrLmdldEZ1cnRoZXN0QW5jZXN0b3Ioc3RhcnRUZXh0LmtleSlcbiAgICBjb25zdCBpbmxpbmVJbmRleCA9IHN0YXJ0QmxvY2subm9kZXMuaW5kZXhPZihpbmxpbmVDaGlsZClcblxuICAgIGZpcnN0QmxvY2subm9kZXMuZm9yRWFjaCgoaW5saW5lLCBpKSA9PiB7XG4gICAgICBjb25zdCBvID0gc3RhcnRPZmZzZXQgPT0gMCA/IDAgOiAxXG4gICAgICBjb25zdCBuZXdJbmRleCA9IGlubGluZUluZGV4ICsgaSArIG9cbiAgICAgIGNoYW5nZS5pbnNlcnROb2RlQnlLZXkoc3RhcnRCbG9jay5rZXksIG5ld0luZGV4LCBpbmxpbmUsIE9QVFMpXG4gICAgfSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBpZiByZXF1ZXN0ZWQuXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjaGFuZ2Uubm9ybWFsaXplTm9kZUJ5S2V5KHBhcmVudC5rZXksIFNDSEVNQSlcbiAgfVxufVxuXG4vKipcbiAqIEluc2VydCBhbiBgaW5saW5lYCBub2RlIGF0IGByYW5nZWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gKiBAcGFyYW0ge0lubGluZXxTdHJpbmd8T2JqZWN0fSBpbmxpbmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy5pbnNlcnRJbmxpbmVBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIGlubGluZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBpbmxpbmUgPSBJbmxpbmUuY3JlYXRlKGlubGluZSlcblxuICBpZiAocmFuZ2UuaXNFeHBhbmRlZCkge1xuICAgIGNoYW5nZS5kZWxldGVBdFJhbmdlKHJhbmdlLCBPUFRTKVxuICAgIHJhbmdlID0gcmFuZ2UuY29sbGFwc2VUb1N0YXJ0KClcbiAgfVxuXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBjb25zdCB7IHN0YXJ0S2V5LCBzdGFydE9mZnNldCB9ID0gcmFuZ2VcbiAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuZ2V0UGFyZW50KHN0YXJ0S2V5KVxuICBjb25zdCBzdGFydFRleHQgPSBkb2N1bWVudC5hc3NlcnREZXNjZW5kYW50KHN0YXJ0S2V5KVxuICBjb25zdCBpbmRleCA9IHBhcmVudC5ub2Rlcy5pbmRleE9mKHN0YXJ0VGV4dClcblxuICBpZiAocGFyZW50LmlzVm9pZCkgcmV0dXJuXG5cbiAgY2hhbmdlLnNwbGl0Tm9kZUJ5S2V5KHN0YXJ0S2V5LCBzdGFydE9mZnNldCwgT1BUUylcbiAgY2hhbmdlLmluc2VydE5vZGVCeUtleShwYXJlbnQua2V5LCBpbmRleCArIDEsIGlubGluZSwgT1BUUylcblxuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBJbnNlcnQgYHRleHRgIGF0IGEgYHJhbmdlYCwgd2l0aCBvcHRpb25hbCBgbWFya3NgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEBwYXJhbSB7U2V0PE1hcms+fSBtYXJrcyAob3B0aW9uYWwpXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMuaW5zZXJ0VGV4dEF0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgdGV4dCwgbWFya3MsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgeyBub3JtYWxpemUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHsgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0IH0gPSByYW5nZVxuICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoc3RhcnRLZXkpXG5cbiAgaWYgKHBhcmVudC5pc1ZvaWQpIHJldHVyblxuXG4gIGlmIChyYW5nZS5pc0V4cGFuZGVkKSB7XG4gICAgY2hhbmdlLmRlbGV0ZUF0UmFuZ2UocmFuZ2UsIE9QVFMpXG4gIH1cblxuICAvLyBQRVJGOiBVbmxlc3Mgc3BlY2lmaWVkLCBkb24ndCBub3JtYWxpemUgaWYgb25seSBpbnNlcnRpbmcgdGV4dC5cbiAgaWYgKG5vcm1hbGl6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbm9ybWFsaXplID0gcmFuZ2UuaXNFeHBhbmRlZFxuICB9XG5cbiAgY2hhbmdlLmluc2VydFRleHRCeUtleShzdGFydEtleSwgc3RhcnRPZmZzZXQsIHRleHQsIG1hcmtzLCB7IG5vcm1hbGl6ZSB9KVxufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBleGlzdGluZyBgbWFya2AgdG8gdGhlIGNoYXJhY3RlcnMgYXQgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7TWFya3xTdHJpbmd9IG1hcmsgKG9wdGlvbmFsKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLnJlbW92ZU1hcmtBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIG1hcmssIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAocmFuZ2UuaXNDb2xsYXBzZWQpIHJldHVyblxuXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgdGV4dHMgPSBkb2N1bWVudC5nZXRUZXh0c0F0UmFuZ2UocmFuZ2UpXG4gIGNvbnN0IHsgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0LCBlbmRLZXksIGVuZE9mZnNldCB9ID0gcmFuZ2VcblxuICB0ZXh0cy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgY29uc3QgeyBrZXkgfSA9IG5vZGVcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgbGV0IGxlbmd0aCA9IG5vZGUudGV4dC5sZW5ndGhcblxuICAgIGlmIChrZXkgPT0gc3RhcnRLZXkpIGluZGV4ID0gc3RhcnRPZmZzZXRcbiAgICBpZiAoa2V5ID09IGVuZEtleSkgbGVuZ3RoID0gZW5kT2Zmc2V0XG4gICAgaWYgKGtleSA9PSBzdGFydEtleSAmJiBrZXkgPT0gZW5kS2V5KSBsZW5ndGggPSBlbmRPZmZzZXQgLSBzdGFydE9mZnNldFxuXG4gICAgY2hhbmdlLnJlbW92ZU1hcmtCeUtleShrZXksIGluZGV4LCBsZW5ndGgsIG1hcmssIHsgbm9ybWFsaXplIH0pXG4gIH0pXG59XG5cbi8qKlxuICogU2V0IHRoZSBgcHJvcGVydGllc2Agb2YgYmxvY2sgbm9kZXMgaW4gYSBgcmFuZ2VgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMuc2V0QmxvY2tBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIHByb3BlcnRpZXMsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IGJsb2NrcyA9IGRvY3VtZW50LmdldEJsb2Nrc0F0UmFuZ2UocmFuZ2UpXG5cbiAgYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgY2hhbmdlLnNldE5vZGVCeUtleShibG9jay5rZXksIHByb3BlcnRpZXMsIHsgbm9ybWFsaXplIH0pXG4gIH0pXG59XG5cbi8qKlxuICogU2V0IHRoZSBgcHJvcGVydGllc2Agb2YgaW5saW5lIG5vZGVzIGluIGEgYHJhbmdlYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLnNldElubGluZUF0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgcHJvcGVydGllcywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgaW5saW5lcyA9IGRvY3VtZW50LmdldElubGluZXNBdFJhbmdlKHJhbmdlKVxuXG4gIGlubGluZXMuZm9yRWFjaCgoaW5saW5lKSA9PiB7XG4gICAgY2hhbmdlLnNldE5vZGVCeUtleShpbmxpbmUua2V5LCBwcm9wZXJ0aWVzLCB7IG5vcm1hbGl6ZSB9KVxuICB9KVxufVxuXG4vKipcbiAqIFNwbGl0IHRoZSBibG9jayBub2RlcyBhdCBhIGByYW5nZWAsIHRvIG9wdGlvbmFsIGBoZWlnaHRgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAob3B0aW9uYWwpXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMuc3BsaXRCbG9ja0F0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgaGVpZ2h0ID0gMSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuXG4gIGlmIChyYW5nZS5pc0V4cGFuZGVkKSB7XG4gICAgY2hhbmdlLmRlbGV0ZUF0UmFuZ2UocmFuZ2UsIHsgbm9ybWFsaXplIH0pXG4gICAgcmFuZ2UgPSByYW5nZS5jb2xsYXBzZVRvU3RhcnQoKVxuICB9XG5cbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBsZXQgbm9kZSA9IGRvY3VtZW50LmFzc2VydERlc2NlbmRhbnQoc3RhcnRLZXkpXG4gIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2sobm9kZS5rZXkpXG4gIGxldCBoID0gMFxuXG4gIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50LmtpbmQgPT0gJ2Jsb2NrJyAmJiBoIDwgaGVpZ2h0KSB7XG4gICAgbm9kZSA9IHBhcmVudFxuICAgIHBhcmVudCA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhwYXJlbnQua2V5KVxuICAgIGgrK1xuICB9XG5cbiAgY2hhbmdlLnNwbGl0RGVzY2VuZGFudHNCeUtleShub2RlLmtleSwgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0LCB7IG5vcm1hbGl6ZSB9KVxufVxuXG4vKipcbiAqIFNwbGl0IHRoZSBpbmxpbmUgbm9kZXMgYXQgYSBgcmFuZ2VgLCB0byBvcHRpb25hbCBgaGVpZ2h0YC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgKG9wdGlvbmFsKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLnNwbGl0SW5saW5lQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBoZWlnaHQgPSBJbmZpbml0eSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuXG4gIGlmIChyYW5nZS5pc0V4cGFuZGVkKSB7XG4gICAgY2hhbmdlLmRlbGV0ZUF0UmFuZ2UocmFuZ2UsIHsgbm9ybWFsaXplIH0pXG4gICAgcmFuZ2UgPSByYW5nZS5jb2xsYXBzZVRvU3RhcnQoKVxuICB9XG5cbiAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICBsZXQgbm9kZSA9IGRvY3VtZW50LmFzc2VydERlc2NlbmRhbnQoc3RhcnRLZXkpXG4gIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKG5vZGUua2V5KVxuICBsZXQgaCA9IDBcblxuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudC5raW5kID09ICdpbmxpbmUnICYmIGggPCBoZWlnaHQpIHtcbiAgICBub2RlID0gcGFyZW50XG4gICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdElubGluZShwYXJlbnQua2V5KVxuICAgIGgrK1xuICB9XG5cbiAgY2hhbmdlLnNwbGl0RGVzY2VuZGFudHNCeUtleShub2RlLmtleSwgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0LCB7IG5vcm1hbGl6ZSB9KVxufVxuXG4vKipcbiAqIEFkZCBvciByZW1vdmUgYSBgbWFya2AgZnJvbSB0aGUgY2hhcmFjdGVycyBhdCBgcmFuZ2VgLCBkZXBlbmRpbmcgb24gd2hldGhlclxuICogaXQncyBhbHJlYWR5IHRoZXJlLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICogQHBhcmFtIHtNaXhlZH0gbWFya1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLnRvZ2dsZU1hcmtBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIG1hcmssIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAocmFuZ2UuaXNDb2xsYXBzZWQpIHJldHVyblxuXG4gIG1hcmsgPSBNYXJrLmNyZWF0ZShtYXJrKVxuXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgbWFya3MgPSBkb2N1bWVudC5nZXRBY3RpdmVNYXJrc0F0UmFuZ2UocmFuZ2UpXG4gIGNvbnN0IGV4aXN0cyA9IG1hcmtzLnNvbWUobSA9PiBtLmVxdWFscyhtYXJrKSlcblxuICBpZiAoZXhpc3RzKSB7XG4gICAgY2hhbmdlLnJlbW92ZU1hcmtBdFJhbmdlKHJhbmdlLCBtYXJrLCB7IG5vcm1hbGl6ZSB9KVxuICB9IGVsc2Uge1xuICAgIGNoYW5nZS5hZGRNYXJrQXRSYW5nZShyYW5nZSwgbWFyaywgeyBub3JtYWxpemUgfSlcbiAgfVxufVxuXG4vKipcbiAqIFVud3JhcCBhbGwgb2YgdGhlIGJsb2NrIG5vZGVzIGluIGEgYHJhbmdlYCBmcm9tIGEgYmxvY2sgd2l0aCBgcHJvcGVydGllc2AuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IHByb3BlcnRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gKi9cblxuQ2hhbmdlcy51bndyYXBCbG9ja0F0UmFuZ2UgPSAoY2hhbmdlLCByYW5nZSwgcHJvcGVydGllcywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIHByb3BlcnRpZXMgPSBOb2RlLmNyZWF0ZVByb3BlcnRpZXMocHJvcGVydGllcylcblxuICBjb25zdCB7IG5vcm1hbGl6ZSA9IHRydWUgfSA9IG9wdGlvbnNcbiAgbGV0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBsZXQgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgYmxvY2tzID0gZG9jdW1lbnQuZ2V0QmxvY2tzQXRSYW5nZShyYW5nZSlcbiAgY29uc3Qgd3JhcHBlcnMgPSBibG9ja3NcbiAgICAubWFwKChibG9jaykgPT4ge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmdldENsb3Nlc3QoYmxvY2sua2V5LCAocGFyZW50KSA9PiB7XG4gICAgICAgIGlmIChwYXJlbnQua2luZCAhPSAnYmxvY2snKSByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgKHByb3BlcnRpZXMudHlwZSAhPSBudWxsICYmIHBhcmVudC50eXBlICE9IHByb3BlcnRpZXMudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmlzVm9pZCAhPSBudWxsICYmIHBhcmVudC5pc1ZvaWQgIT0gcHJvcGVydGllcy5pc1ZvaWQpIHJldHVybiBmYWxzZVxuICAgICAgICBpZiAocHJvcGVydGllcy5kYXRhICE9IG51bGwgJiYgIXBhcmVudC5kYXRhLmlzU3VwZXJzZXQocHJvcGVydGllcy5kYXRhKSkgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH0pXG4gICAgLmZpbHRlcihleGlzdHMgPT4gZXhpc3RzKVxuICAgIC50b09yZGVyZWRTZXQoKVxuICAgIC50b0xpc3QoKVxuXG4gIHdyYXBwZXJzLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgY29uc3QgZmlyc3QgPSBibG9jay5ub2Rlcy5maXJzdCgpXG4gICAgY29uc3QgbGFzdCA9IGJsb2NrLm5vZGVzLmxhc3QoKVxuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmdldFBhcmVudChibG9jay5rZXkpXG4gICAgY29uc3QgaW5kZXggPSBwYXJlbnQubm9kZXMuaW5kZXhPZihibG9jaylcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gYmxvY2subm9kZXMuZmlsdGVyKChjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIGJsb2Nrcy5zb21lKGIgPT4gY2hpbGQgPT0gYiB8fCBjaGlsZC5oYXNEZXNjZW5kYW50KGIua2V5KSlcbiAgICB9KVxuXG4gICAgY29uc3QgZmlyc3RNYXRjaCA9IGNoaWxkcmVuLmZpcnN0KClcbiAgICBjb25zdCBsYXN0TWF0Y2ggPSBjaGlsZHJlbi5sYXN0KClcblxuICAgIGlmIChmaXJzdCA9PSBmaXJzdE1hdGNoICYmIGxhc3QgPT0gbGFzdE1hdGNoKSB7XG4gICAgICBibG9jay5ub2Rlcy5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBjaGFuZ2UubW92ZU5vZGVCeUtleShjaGlsZC5rZXksIHBhcmVudC5rZXksIGluZGV4ICsgaSwgT1BUUylcbiAgICAgIH0pXG5cbiAgICAgIGNoYW5nZS5yZW1vdmVOb2RlQnlLZXkoYmxvY2sua2V5LCBPUFRTKVxuICAgIH1cblxuICAgIGVsc2UgaWYgKGxhc3QgPT0gbGFzdE1hdGNoKSB7XG4gICAgICBibG9jay5ub2Rlc1xuICAgICAgICAuc2tpcFVudGlsKG4gPT4gbiA9PSBmaXJzdE1hdGNoKVxuICAgICAgICAuZm9yRWFjaCgoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICBjaGFuZ2UubW92ZU5vZGVCeUtleShjaGlsZC5rZXksIHBhcmVudC5rZXksIGluZGV4ICsgMSArIGksIE9QVFMpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZWxzZSBpZiAoZmlyc3QgPT0gZmlyc3RNYXRjaCkge1xuICAgICAgYmxvY2subm9kZXNcbiAgICAgICAgLnRha2VVbnRpbChuID0+IG4gPT0gbGFzdE1hdGNoKVxuICAgICAgICAucHVzaChsYXN0TWF0Y2gpXG4gICAgICAgIC5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KGNoaWxkLmtleSwgcGFyZW50LmtleSwgaW5kZXggKyBpLCBPUFRTKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgY29uc3QgZmlyc3RUZXh0ID0gZmlyc3RNYXRjaC5nZXRGaXJzdFRleHQoKVxuICAgICAgY2hhbmdlLnNwbGl0RGVzY2VuZGFudHNCeUtleShibG9jay5rZXksIGZpcnN0VGV4dC5rZXksIDAsIE9QVFMpXG4gICAgICBzdGF0ZSA9IGNoYW5nZS5zdGF0ZVxuICAgICAgZG9jdW1lbnQgPSBzdGF0ZS5kb2N1bWVudFxuXG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgY29uc3QgZXh0cmEgPSBjaGlsZFxuICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuZ2V0TmV4dEJsb2NrKGNoaWxkLmtleSlcbiAgICAgICAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KGV4dHJhLmtleSwgT1BUUylcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KGNoaWxkLmtleSwgcGFyZW50LmtleSwgaW5kZXggKyAxICsgaSwgT1BUUylcbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG4gIC8vIFRPRE86IG9wdG1pemUgdG8gb25seSBub3JtYWxpemUgdGhlIHJpZ2h0IGJsb2NrXG4gIGlmIChub3JtYWxpemUpIHtcbiAgICBjaGFuZ2Uubm9ybWFsaXplRG9jdW1lbnQoU0NIRU1BKVxuICB9XG59XG5cbi8qKlxuICogVW53cmFwIHRoZSBpbmxpbmUgbm9kZXMgaW4gYSBgcmFuZ2VgIGZyb20gYW4gaW5saW5lIHdpdGggYHByb3BlcnRpZXNgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMudW53cmFwSW5saW5lQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBwcm9wZXJ0aWVzLCBvcHRpb25zID0ge30pID0+IHtcbiAgcHJvcGVydGllcyA9IE5vZGUuY3JlYXRlUHJvcGVydGllcyhwcm9wZXJ0aWVzKVxuXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3QgdGV4dHMgPSBkb2N1bWVudC5nZXRUZXh0c0F0UmFuZ2UocmFuZ2UpXG4gIGNvbnN0IGlubGluZXMgPSB0ZXh0c1xuICAgIC5tYXAoKHRleHQpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5nZXRDbG9zZXN0KHRleHQua2V5LCAocGFyZW50KSA9PiB7XG4gICAgICAgIGlmIChwYXJlbnQua2luZCAhPSAnaW5saW5lJykgcmV0dXJuIGZhbHNlXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLnR5cGUgIT0gbnVsbCAmJiBwYXJlbnQudHlwZSAhPSBwcm9wZXJ0aWVzLnR5cGUpIHJldHVybiBmYWxzZVxuICAgICAgICBpZiAocHJvcGVydGllcy5pc1ZvaWQgIT0gbnVsbCAmJiBwYXJlbnQuaXNWb2lkICE9IHByb3BlcnRpZXMuaXNWb2lkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuZGF0YSAhPSBudWxsICYmICFwYXJlbnQuZGF0YS5pc1N1cGVyc2V0KHByb3BlcnRpZXMuZGF0YSkpIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuICAgIC5maWx0ZXIoZXhpc3RzID0+IGV4aXN0cylcbiAgICAudG9PcmRlcmVkU2V0KClcbiAgICAudG9MaXN0KClcblxuICBpbmxpbmVzLmZvckVhY2goKGlubGluZSkgPT4ge1xuICAgIGNvbnN0IHBhcmVudCA9IGNoYW5nZS5zdGF0ZS5kb2N1bWVudC5nZXRQYXJlbnQoaW5saW5lLmtleSlcbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5ub2Rlcy5pbmRleE9mKGlubGluZSlcblxuICAgIGlubGluZS5ub2Rlcy5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xuICAgICAgY2hhbmdlLm1vdmVOb2RlQnlLZXkoY2hpbGQua2V5LCBwYXJlbnQua2V5LCBpbmRleCArIGksIE9QVFMpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUT0RPOiBvcHRtaXplIHRvIG9ubHkgbm9ybWFsaXplIHRoZSByaWdodCBibG9ja1xuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY2hhbmdlLm5vcm1hbGl6ZURvY3VtZW50KFNDSEVNQSlcbiAgfVxufVxuXG4vKipcbiAqIFdyYXAgYWxsIG9mIHRoZSBibG9ja3MgaW4gYSBgcmFuZ2VgIGluIGEgbmV3IGBibG9ja2AuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gKiBAcGFyYW0ge0Jsb2NrfE9iamVjdHxTdHJpbmd9IGJsb2NrXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IG5vcm1hbGl6ZVxuICovXG5cbkNoYW5nZXMud3JhcEJsb2NrQXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBibG9jaywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGJsb2NrID0gQmxvY2suY3JlYXRlKGJsb2NrKVxuICBibG9jayA9IGJsb2NrLnNldCgnbm9kZXMnLCBibG9jay5ub2Rlcy5jbGVhcigpKVxuXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcblxuICBjb25zdCBibG9ja3MgPSBkb2N1bWVudC5nZXRCbG9ja3NBdFJhbmdlKHJhbmdlKVxuICBjb25zdCBmaXJzdGJsb2NrID0gYmxvY2tzLmZpcnN0KClcbiAgY29uc3QgbGFzdGJsb2NrID0gYmxvY2tzLmxhc3QoKVxuICBsZXQgcGFyZW50LCBzaWJsaW5ncywgaW5kZXhcblxuICAvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBibG9jayBpbiB0aGUgc2VsZWN0aW9uIHRoZW4gd2Uga25vdyB0aGUgcGFyZW50IGFuZFxuICAvLyBzaWJsaW5ncy5cbiAgaWYgKGJsb2Nrcy5sZW5ndGggPT09IDEpIHtcbiAgICBwYXJlbnQgPSBkb2N1bWVudC5nZXRQYXJlbnQoZmlyc3RibG9jay5rZXkpXG4gICAgc2libGluZ3MgPSBibG9ja3NcbiAgfVxuXG4gIC8vIERldGVybWluZSBjbG9zZXN0IHNoYXJlZCBwYXJlbnQgdG8gYWxsIGJsb2NrcyBpbiBzZWxlY3Rpb24uXG4gIGVsc2Uge1xuICAgIHBhcmVudCA9IGRvY3VtZW50LmdldENsb3Nlc3QoZmlyc3RibG9jay5rZXksIChwMSkgPT4ge1xuICAgICAgcmV0dXJuICEhZG9jdW1lbnQuZ2V0Q2xvc2VzdChsYXN0YmxvY2sua2V5LCBwMiA9PiBwMSA9PSBwMilcbiAgICB9KVxuICB9XG5cbiAgLy8gSWYgbm8gc2hhcmVkIHBhcmVudCBjb3VsZCBiZSBmb3VuZCB0aGVuIHRoZSBwYXJlbnQgaXMgdGhlIGRvY3VtZW50LlxuICBpZiAocGFyZW50ID09IG51bGwpIHBhcmVudCA9IGRvY3VtZW50XG5cbiAgLy8gQ3JlYXRlIGEgbGlzdCBvZiBkaXJlY3QgY2hpbGRyZW4gc2libGluZ3Mgb2YgcGFyZW50IHRoYXQgZmFsbCBpbiB0aGVcbiAgLy8gc2VsZWN0aW9uLlxuICBpZiAoc2libGluZ3MgPT0gbnVsbCkge1xuICAgIGNvbnN0IGluZGV4ZXMgPSBwYXJlbnQubm9kZXMucmVkdWNlKChpbmQsIG5vZGUsIGkpID0+IHtcbiAgICAgIGlmIChub2RlID09IGZpcnN0YmxvY2sgfHwgbm9kZS5oYXNEZXNjZW5kYW50KGZpcnN0YmxvY2sua2V5KSkgaW5kWzBdID0gaVxuICAgICAgaWYgKG5vZGUgPT0gbGFzdGJsb2NrIHx8IG5vZGUuaGFzRGVzY2VuZGFudChsYXN0YmxvY2sua2V5KSkgaW5kWzFdID0gaVxuICAgICAgcmV0dXJuIGluZFxuICAgIH0sIFtdKVxuXG4gICAgaW5kZXggPSBpbmRleGVzWzBdXG4gICAgc2libGluZ3MgPSBwYXJlbnQubm9kZXMuc2xpY2UoaW5kZXhlc1swXSwgaW5kZXhlc1sxXSArIDEpXG4gIH1cblxuICAvLyBHZXQgdGhlIGluZGV4IHRvIHBsYWNlIHRoZSBuZXcgd3JhcHBlZCBub2RlIGF0LlxuICBpZiAoaW5kZXggPT0gbnVsbCkge1xuICAgIGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2Yoc2libGluZ3MuZmlyc3QoKSlcbiAgfVxuXG4gIC8vIEluamVjdCB0aGUgbmV3IGJsb2NrIG5vZGUgaW50byB0aGUgcGFyZW50LlxuICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHBhcmVudC5rZXksIGluZGV4LCBibG9jaywgT1BUUylcblxuICAvLyBNb3ZlIHRoZSBzaWJsaW5nIG5vZGVzIGludG8gdGhlIG5ldyBibG9jayBub2RlLlxuICBzaWJsaW5ncy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG4gICAgY2hhbmdlLm1vdmVOb2RlQnlLZXkobm9kZS5rZXksIGJsb2NrLmtleSwgaSwgT1BUUylcbiAgfSlcblxuICBpZiAobm9ybWFsaXplKSB7XG4gICAgY2hhbmdlLm5vcm1hbGl6ZU5vZGVCeUtleShwYXJlbnQua2V5LCBTQ0hFTUEpXG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwIHRoZSB0ZXh0IGFuZCBpbmxpbmVzIGluIGEgYHJhbmdlYCBpbiBhIG5ldyBgaW5saW5lYC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7SW5saW5lfE9iamVjdHxTdHJpbmd9IGlubGluZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLndyYXBJbmxpbmVBdFJhbmdlID0gKGNoYW5nZSwgcmFuZ2UsIGlubGluZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgbGV0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXJ0S2V5LCBzdGFydE9mZnNldCwgZW5kS2V5LCBlbmRPZmZzZXQgfSA9IHJhbmdlXG5cbiAgaWYgKHJhbmdlLmlzQ29sbGFwc2VkKSB7XG4gICAgLy8gV3JhcHBpbmcgYW4gaW5saW5lIHZvaWRcbiAgICBjb25zdCBpbmxpbmVQYXJlbnQgPSBkb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKHN0YXJ0S2V5KVxuICAgIGlmICghaW5saW5lUGFyZW50LmlzVm9pZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZS53cmFwSW5saW5lQnlLZXkoaW5saW5lUGFyZW50LmtleSwgaW5saW5lLCBvcHRpb25zKVxuICB9XG5cbiAgaW5saW5lID0gSW5saW5lLmNyZWF0ZShpbmxpbmUpXG4gIGlubGluZSA9IGlubGluZS5zZXQoJ25vZGVzJywgaW5saW5lLm5vZGVzLmNsZWFyKCkpXG5cbiAgY29uc3QgYmxvY2tzID0gZG9jdW1lbnQuZ2V0QmxvY2tzQXRSYW5nZShyYW5nZSlcbiAgbGV0IHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soc3RhcnRLZXkpXG4gIGxldCBlbmRCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhlbmRLZXkpXG4gIGxldCBzdGFydENoaWxkID0gc3RhcnRCbG9jay5nZXRGdXJ0aGVzdEFuY2VzdG9yKHN0YXJ0S2V5KVxuICBsZXQgZW5kQ2hpbGQgPSBlbmRCbG9jay5nZXRGdXJ0aGVzdEFuY2VzdG9yKGVuZEtleSlcblxuICBjaGFuZ2Uuc3BsaXREZXNjZW5kYW50c0J5S2V5KGVuZENoaWxkLmtleSwgZW5kS2V5LCBlbmRPZmZzZXQsIE9QVFMpXG4gIGNoYW5nZS5zcGxpdERlc2NlbmRhbnRzQnlLZXkoc3RhcnRDaGlsZC5rZXksIHN0YXJ0S2V5LCBzdGFydE9mZnNldCwgT1BUUylcblxuICBzdGF0ZSA9IGNoYW5nZS5zdGF0ZVxuICBkb2N1bWVudCA9IHN0YXRlLmRvY3VtZW50XG4gIHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXREZXNjZW5kYW50KHN0YXJ0QmxvY2sua2V5KVxuICBlbmRCbG9jayA9IGRvY3VtZW50LmdldERlc2NlbmRhbnQoZW5kQmxvY2sua2V5KVxuICBzdGFydENoaWxkID0gc3RhcnRCbG9jay5nZXRGdXJ0aGVzdEFuY2VzdG9yKHN0YXJ0S2V5KVxuICBlbmRDaGlsZCA9IGVuZEJsb2NrLmdldEZ1cnRoZXN0QW5jZXN0b3IoZW5kS2V5KVxuICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRCbG9jay5ub2Rlcy5pbmRleE9mKHN0YXJ0Q2hpbGQpXG4gIGNvbnN0IGVuZEluZGV4ID0gZW5kQmxvY2subm9kZXMuaW5kZXhPZihlbmRDaGlsZClcblxuICBpZiAoc3RhcnRCbG9jayA9PSBlbmRCbG9jaykge1xuICAgIHN0YXRlID0gY2hhbmdlLnN0YXRlXG4gICAgZG9jdW1lbnQgPSBzdGF0ZS5kb2N1bWVudFxuICAgIHN0YXJ0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2soc3RhcnRLZXkpXG4gICAgc3RhcnRDaGlsZCA9IHN0YXJ0QmxvY2suZ2V0RnVydGhlc3RBbmNlc3RvcihzdGFydEtleSlcblxuICAgIGNvbnN0IHN0YXJ0SW5uZXIgPSBkb2N1bWVudC5nZXROZXh0U2libGluZyhzdGFydENoaWxkLmtleSlcbiAgICBjb25zdCBzdGFydElubmVySW5kZXggPSBzdGFydEJsb2NrLm5vZGVzLmluZGV4T2Yoc3RhcnRJbm5lcilcbiAgICBjb25zdCBlbmRJbm5lciA9IHN0YXJ0S2V5ID09IGVuZEtleSA/IHN0YXJ0SW5uZXIgOiBzdGFydEJsb2NrLmdldEZ1cnRoZXN0QW5jZXN0b3IoZW5kS2V5KVxuICAgIGNvbnN0IGlubGluZXMgPSBzdGFydEJsb2NrLm5vZGVzXG4gICAgICAuc2tpcFVudGlsKG4gPT4gbiA9PSBzdGFydElubmVyKVxuICAgICAgLnRha2VVbnRpbChuID0+IG4gPT0gZW5kSW5uZXIpXG4gICAgICAucHVzaChlbmRJbm5lcilcblxuICAgIGNvbnN0IG5vZGUgPSBpbmxpbmUucmVnZW5lcmF0ZUtleSgpXG5cbiAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KHN0YXJ0QmxvY2sua2V5LCBzdGFydElubmVySW5kZXgsIG5vZGUsIE9QVFMpXG5cbiAgICBpbmxpbmVzLmZvckVhY2goKGNoaWxkLCBpKSA9PiB7XG4gICAgICBjaGFuZ2UubW92ZU5vZGVCeUtleShjaGlsZC5rZXksIG5vZGUua2V5LCBpLCBPUFRTKVxuICAgIH0pXG5cbiAgICBpZiAobm9ybWFsaXplKSB7XG4gICAgICBjaGFuZ2Uubm9ybWFsaXplTm9kZUJ5S2V5KHN0YXJ0QmxvY2sua2V5LCBTQ0hFTUEpXG4gICAgfVxuICB9XG5cbiAgZWxzZSB7XG4gICAgY29uc3Qgc3RhcnRJbmxpbmVzID0gc3RhcnRCbG9jay5ub2Rlcy5zbGljZShzdGFydEluZGV4ICsgMSlcbiAgICBjb25zdCBlbmRJbmxpbmVzID0gZW5kQmxvY2subm9kZXMuc2xpY2UoMCwgZW5kSW5kZXggKyAxKVxuICAgIGNvbnN0IHN0YXJ0Tm9kZSA9IGlubGluZS5yZWdlbmVyYXRlS2V5KClcbiAgICBjb25zdCBlbmROb2RlID0gaW5saW5lLnJlZ2VuZXJhdGVLZXkoKVxuXG4gICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShzdGFydEJsb2NrLmtleSwgc3RhcnRJbmRleCAtIDEsIHN0YXJ0Tm9kZSwgT1BUUylcbiAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KGVuZEJsb2NrLmtleSwgZW5kSW5kZXgsIGVuZE5vZGUsIE9QVFMpXG5cbiAgICBzdGFydElubGluZXMuZm9yRWFjaCgoY2hpbGQsIGkpID0+IHtcbiAgICAgIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KGNoaWxkLmtleSwgc3RhcnROb2RlLmtleSwgaSwgT1BUUylcbiAgICB9KVxuXG4gICAgZW5kSW5saW5lcy5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xuICAgICAgY2hhbmdlLm1vdmVOb2RlQnlLZXkoY2hpbGQua2V5LCBlbmROb2RlLmtleSwgaSwgT1BUUylcbiAgICB9KVxuXG4gICAgaWYgKG5vcm1hbGl6ZSkge1xuICAgICAgY2hhbmdlXG4gICAgICAgIC5ub3JtYWxpemVOb2RlQnlLZXkoc3RhcnRCbG9jay5rZXksIFNDSEVNQSlcbiAgICAgICAgLm5vcm1hbGl6ZU5vZGVCeUtleShlbmRCbG9jay5rZXksIFNDSEVNQSlcbiAgICB9XG5cbiAgICBibG9ja3Muc2xpY2UoMSwgLTEpLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gaW5saW5lLnJlZ2VuZXJhdGVLZXkoKVxuICAgICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShibG9jay5rZXksIDAsIG5vZGUsIE9QVFMpXG5cbiAgICAgIGJsb2NrLm5vZGVzLmZvckVhY2goKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgIGNoYW5nZS5tb3ZlTm9kZUJ5S2V5KGNoaWxkLmtleSwgbm9kZS5rZXksIGksIE9QVFMpXG4gICAgICB9KVxuXG4gICAgICBpZiAobm9ybWFsaXplKSB7XG4gICAgICAgIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkoYmxvY2sua2V5LCBTQ0hFTUEpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIFdyYXAgdGhlIHRleHQgaW4gYSBgcmFuZ2VgIGluIGEgcHJlZml4L3N1ZmZpeC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXggKG9wdGlvbmFsKVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtCb29sZWFufSBub3JtYWxpemVcbiAqL1xuXG5DaGFuZ2VzLndyYXBUZXh0QXRSYW5nZSA9IChjaGFuZ2UsIHJhbmdlLCBwcmVmaXgsIHN1ZmZpeCA9IHByZWZpeCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgbm9ybWFsaXplID0gdHJ1ZSB9ID0gb3B0aW9uc1xuICBjb25zdCB7IHN0YXJ0S2V5LCBlbmRLZXkgfSA9IHJhbmdlXG4gIGNvbnN0IHN0YXJ0ID0gcmFuZ2UuY29sbGFwc2VUb1N0YXJ0KClcbiAgbGV0IGVuZCA9IHJhbmdlLmNvbGxhcHNlVG9FbmQoKVxuXG4gIGlmIChzdGFydEtleSA9PSBlbmRLZXkpIHtcbiAgICBlbmQgPSBlbmQubW92ZShwcmVmaXgubGVuZ3RoKVxuICB9XG5cbiAgY2hhbmdlLmluc2VydFRleHRBdFJhbmdlKHN0YXJ0LCBwcmVmaXgsIFtdLCB7IG5vcm1hbGl6ZSB9KVxuICBjaGFuZ2UuaW5zZXJ0VGV4dEF0UmFuZ2UoZW5kLCBzdWZmaXgsIFtdLCB7IG5vcm1hbGl6ZSB9KVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZXNcbiJdfQ==