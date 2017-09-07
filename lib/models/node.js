'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _block = require('./block');

var _block2 = _interopRequireDefault(_block);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _inline = require('./inline');

var _inline2 = _interopRequireDefault(_inline);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _direction = require('direction');

var _direction2 = _interopRequireDefault(_direction);

var _generateKey = require('../utils/generate-key');

var _generateKey2 = _interopRequireDefault(_generateKey);

var _isInRange = require('../utils/is-in-range');

var _isInRange2 = _interopRequireDefault(_isInRange);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _memoize = require('../utils/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Node}
 */

var Node = function () {
  function Node() {
    _classCallCheck(this, Node);
  }

  _createClass(Node, [{
    key: 'areDescendantsSorted',


    /**
     * True if the node has both descendants in that order, false otherwise. The
     * order is depth-first, post-order.
     *
     * @param {String} first
     * @param {String} second
     * @return {Boolean}
     */

    value: function areDescendantsSorted(first, second) {
      first = normalizeKey(first);
      second = normalizeKey(second);

      var sorted = void 0;

      this.forEachDescendant(function (n) {
        if (n.key === first) {
          sorted = true;
          return false;
        } else if (n.key === second) {
          sorted = false;
          return false;
        }
      });

      return sorted;
    }

    /**
     * Assert that a node has a child by `key` and return it.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'assertChild',
    value: function assertChild(key) {
      var child = this.getChild(key);

      if (!child) {
        key = normalizeKey(key);
        throw new Error('Could not find a child node with key "' + key + '".');
      }

      return child;
    }

    /**
     * Assert that a node has a descendant by `key` and return it.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'assertDescendant',
    value: function assertDescendant(key) {
      var descendant = this.getDescendant(key);

      if (!descendant) {
        key = normalizeKey(key);
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      return descendant;
    }

    /**
     * Assert that a node's tree has a node by `key` and return it.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'assertNode',
    value: function assertNode(key) {
      var node = this.getNode(key);

      if (!node) {
        key = normalizeKey(key);
        throw new Error('Could not find a node with key "' + key + '".');
      }

      return node;
    }

    /**
     * Assert that a node exists at `path` and return it.
     *
     * @param {Array} path
     * @return {Node}
     */

  }, {
    key: 'assertPath',
    value: function assertPath(path) {
      var descendant = this.getDescendantAtPath(path);

      if (!descendant) {
        throw new Error('Could not find a descendant at path "' + path + '".');
      }

      return descendant;
    }

    /**
     * Recursively filter all descendant nodes with `iterator`.
     *
     * @param {Function} iterator
     * @return {List<Node>}
     */

  }, {
    key: 'filterDescendants',
    value: function filterDescendants(iterator) {
      var matches = [];

      this.forEachDescendant(function (node, i, nodes) {
        if (iterator(node, i, nodes)) matches.push(node);
      });

      return (0, _immutable.List)(matches);
    }

    /**
     * Recursively find all descendant nodes by `iterator`.
     *
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'findDescendant',
    value: function findDescendant(iterator) {
      var found = null;

      this.forEachDescendant(function (node, i, nodes) {
        if (iterator(node, i, nodes)) {
          found = node;
          return false;
        }
      });

      return found;
    }

    /**
     * Recursively iterate over all descendant nodes with `iterator`. If the
     * iterator returns false it will break the loop.
     *
     * @param {Function} iterator
     */

  }, {
    key: 'forEachDescendant',
    value: function forEachDescendant(iterator) {
      var ret = void 0;

      this.nodes.forEach(function (child, i, nodes) {
        if (iterator(child, i, nodes) === false) {
          ret = false;
          return false;
        }

        if (child.kind != 'text') {
          ret = child.forEachDescendant(iterator);
          return ret;
        }
      });

      return ret;
    }

    /**
     * Get the path of ancestors of a descendant node by `key`.
     *
     * @param {String|Node} key
     * @return {List<Node>|Null}
     */

  }, {
    key: 'getAncestors',
    value: function getAncestors(key) {
      key = normalizeKey(key);

      if (key == this.key) return (0, _immutable.List)();
      if (this.hasChild(key)) return (0, _immutable.List)([this]);

      var ancestors = void 0;
      this.nodes.find(function (node) {
        if (node.kind == 'text') return false;
        ancestors = node.getAncestors(key);
        return ancestors;
      });

      if (ancestors) {
        return ancestors.unshift(this);
      } else {
        return null;
      }
    }

    /**
     * Get the leaf block descendants of the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocks',
    value: function getBlocks() {
      var array = this.getBlocksAsArray();
      return new _immutable.List(array);
    }

    /**
     * Get the leaf block descendants of the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksAsArray',
    value: function getBlocksAsArray() {
      return this.nodes.reduce(function (array, child) {
        if (child.kind != 'block') return array;
        if (!child.isLeafBlock()) return array.concat(child.getBlocksAsArray());
        array.push(child);
        return array;
      }, []);
    }

    /**
     * Get the leaf block descendants in a `range`.
     *
     * @param {Selection} range
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksAtRange',
    value: function getBlocksAtRange(range) {
      var array = this.getBlocksAtRangeAsArray(range);
      // Eliminate duplicates by converting to an `OrderedSet` first.
      return new _immutable.List(new _immutable.OrderedSet(array));
    }

    /**
     * Get the leaf block descendants in a `range` as an array
     *
     * @param {Selection} range
     * @return {Array}
     */

  }, {
    key: 'getBlocksAtRangeAsArray',
    value: function getBlocksAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      var _range = range,
          startKey = _range.startKey,
          endKey = _range.endKey;

      var startBlock = this.getClosestBlock(startKey);

      // PERF: the most common case is when the range is in a single block node,
      // where we can avoid a lot of iterating of the tree.
      if (startKey == endKey) return [startBlock];

      var endBlock = this.getClosestBlock(endKey);
      var blocks = this.getBlocksAsArray();
      var start = blocks.indexOf(startBlock);
      var end = blocks.indexOf(endBlock);
      return blocks.slice(start, end + 1);
    }

    /**
     * Get all of the leaf blocks that match a `type`.
     *
     * @param {String} type
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksByType',
    value: function getBlocksByType(type) {
      var array = this.getBlocksByTypeAsArray(type);
      return new _immutable.List(array);
    }

    /**
     * Get all of the leaf blocks that match a `type` as an array
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getBlocksByTypeAsArray',
    value: function getBlocksByTypeAsArray(type) {
      return this.nodes.reduce(function (array, node) {
        if (node.kind != 'block') {
          return array;
        } else if (node.isLeafBlock() && node.type == type) {
          array.push(node);
          return array;
        } else {
          return array.concat(node.getBlocksByTypeAsArray(type));
        }
      }, []);
    }

    /**
     * Get all of the characters for every text node.
     *
     * @return {List<Character>}
     */

  }, {
    key: 'getCharacters',
    value: function getCharacters() {
      var array = this.getCharactersAsArray();
      return new _immutable.List(array);
    }

    /**
     * Get all of the characters for every text node as an array
     *
     * @return {Array}
     */

  }, {
    key: 'getCharactersAsArray',
    value: function getCharactersAsArray() {
      return this.nodes.reduce(function (arr, node) {
        return node.kind == 'text' ? arr.concat(node.characters.toArray()) : arr.concat(node.getCharactersAsArray());
      }, []);
    }

    /**
     * Get a list of the characters in a `range`.
     *
     * @param {Selection} range
     * @return {List<Character>}
     */

  }, {
    key: 'getCharactersAtRange',
    value: function getCharactersAtRange(range) {
      var array = this.getCharactersAtRangeAsArray(range);
      return new _immutable.List(array);
    }

    /**
     * Get a list of the characters in a `range` as an array.
     *
     * @param {Selection} range
     * @return {Array}
     */

  }, {
    key: 'getCharactersAtRangeAsArray',
    value: function getCharactersAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      return this.getTextsAtRange(range).reduce(function (arr, text) {
        var chars = text.characters.filter(function (char, i) {
          return (0, _isInRange2.default)(i, text, range);
        }).toArray();

        return arr.concat(chars);
      }, []);
    }

    /**
     * Get a child node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getChild',
    value: function getChild(key) {
      key = normalizeKey(key);
      return this.nodes.find(function (node) {
        return node.key == key;
      });
    }

    /**
     * Get closest parent of node by `key` that matches `iterator`.
     *
     * @param {String} key
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'getClosest',
    value: function getClosest(key, iterator) {
      key = normalizeKey(key);
      var ancestors = this.getAncestors(key);
      if (!ancestors) {
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      // Exclude this node itself.
      return ancestors.rest().findLast(iterator);
    }

    /**
     * Get the closest block parent of a `node`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestBlock',
    value: function getClosestBlock(key) {
      return this.getClosest(key, function (parent) {
        return parent.kind == 'block';
      });
    }

    /**
     * Get the closest inline parent of a `node`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestInline',
    value: function getClosestInline(key) {
      return this.getClosest(key, function (parent) {
        return parent.kind == 'inline';
      });
    }

    /**
     * Get the closest void parent of a `node`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestVoid',
    value: function getClosestVoid(key) {
      return this.getClosest(key, function (parent) {
        return parent.isVoid;
      });
    }

    /**
     * Get the common ancestor of nodes `one` and `two` by keys.
     *
     * @param {String} one
     * @param {String} two
     * @return {Node}
     */

  }, {
    key: 'getCommonAncestor',
    value: function getCommonAncestor(one, two) {
      one = normalizeKey(one);
      two = normalizeKey(two);

      if (one == this.key) return this;
      if (two == this.key) return this;

      this.assertDescendant(one);
      this.assertDescendant(two);
      var ancestors = new _immutable.List();
      var oneParent = this.getParent(one);
      var twoParent = this.getParent(two);

      while (oneParent) {
        ancestors = ancestors.push(oneParent);
        oneParent = this.getParent(oneParent.key);
      }

      while (twoParent) {
        if (ancestors.includes(twoParent)) return twoParent;
        twoParent = this.getParent(twoParent.key);
      }
    }

    /**
     * Get the component for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Component|Void}
     */

  }, {
    key: 'getComponent',
    value: function getComponent(schema) {
      return schema.__getComponent(this);
    }

    /**
     * Get the decorations for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Array}
     */

  }, {
    key: 'getDecorators',
    value: function getDecorators(schema) {
      return schema.__getDecorators(this);
    }

    /**
     * Get the depth of a child node by `key`, with optional `startAt`.
     *
     * @param {String} key
     * @param {Number} startAt (optional)
     * @return {Number} depth
     */

  }, {
    key: 'getDepth',
    value: function getDepth(key) {
      var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.assertDescendant(key);
      if (this.hasChild(key)) return startAt;
      return this.getFurthestAncestor(key).getDepth(key, startAt + 1);
    }

    /**
     * Get a descendant node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getDescendant',
    value: function getDescendant(key) {
      key = normalizeKey(key);
      var descendantFound = null;

      var found = this.nodes.find(function (node) {
        if (node.key === key) {
          return node;
        } else if (node.kind !== 'text') {
          descendantFound = node.getDescendant(key);
          return descendantFound;
        } else {
          return false;
        }
      });

      return descendantFound || found;
    }

    /**
     * Get a descendant by `path`.
     *
     * @param {Array} path
     * @return {Node|Null}
     */

  }, {
    key: 'getDescendantAtPath',
    value: function getDescendantAtPath(path) {
      var descendant = this;

      for (var i = 0; i < path.length; i++) {
        var index = path[i];
        if (!descendant) return;
        if (!descendant.nodes) return;
        descendant = descendant.nodes.get(index);
      }

      return descendant;
    }

    /**
     * Get the decorators for a descendant by `key` given a `schema`.
     *
     * @param {String} key
     * @param {Schema} schema
     * @return {Array}
     */

  }, {
    key: 'getDescendantDecorators',
    value: function getDescendantDecorators(key, schema) {
      if (!schema.hasDecorators) {
        return [];
      }

      var descendant = this.assertDescendant(key);
      var child = this.getFurthestAncestor(key);
      var decorators = [];

      while (child != descendant) {
        decorators = decorators.concat(child.getDecorators(schema));
        child = child.getFurthestAncestor(key);
      }

      decorators = decorators.concat(descendant.getDecorators(schema));
      return decorators;
    }

    /**
     * Get the first child text node.
     *
     * @return {Node|Null}
     */

  }, {
    key: 'getFirstText',
    value: function getFirstText() {
      var descendantFound = null;

      var found = this.nodes.find(function (node) {
        if (node.kind == 'text') return true;
        descendantFound = node.getFirstText();
        return descendantFound;
      });

      return descendantFound || found;
    }

    /**
     * Get a fragment of the node at a `range`.
     *
     * @param {Selection} range
     * @return {Document}
     */

  }, {
    key: 'getFragmentAtRange',
    value: function getFragmentAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return _document2.default.create();

      var node = this;

      // Make sure the children exist.
      var _range2 = range,
          startKey = _range2.startKey,
          startOffset = _range2.startOffset,
          endKey = _range2.endKey,
          endOffset = _range2.endOffset;

      var startText = node.assertDescendant(startKey);
      var endText = node.assertDescendant(endKey);

      // Split at the start and end.
      var child = startText;
      var previous = void 0;
      var parent = void 0;

      while (parent = node.getParent(child.key)) {
        var index = parent.nodes.indexOf(child);
        var position = child.kind == 'text' ? startOffset : child.nodes.indexOf(previous);
        parent = parent.splitNode(index, position);
        node = node.updateNode(parent);
        previous = parent.nodes.get(index + 1);
        child = parent;
      }

      child = endText;

      while (parent = node.getParent(child.key)) {
        var _index = parent.nodes.indexOf(child);
        var _position = child.kind == 'text' ? endOffset : child.nodes.indexOf(previous);
        parent = parent.splitNode(_index, _position);
        node = node.updateNode(parent);
        previous = parent.nodes.get(_index + 1);
        child = parent;
      }

      // Get the start and end nodes.
      var next = node.getNextText(startKey);
      var startNode = node.getNextSibling(node.getFurthestAncestor(startKey).key);
      var endNode = startKey == endKey ? node.getFurthestAncestor(next.key) : node.getFurthestAncestor(endKey);

      // Get children range of nodes from start to end nodes
      var startIndex = node.nodes.indexOf(startNode);
      var endIndex = node.nodes.indexOf(endNode);
      var nodes = node.nodes.slice(startIndex, endIndex + 1);

      // Return a new document fragment.
      return _document2.default.create({ nodes: nodes });
    }

    /**
     * Get the furthest parent of a node by `key` that matches an `iterator`.
     *
     * @param {String} key
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthest',
    value: function getFurthest(key, iterator) {
      var ancestors = this.getAncestors(key);
      if (!ancestors) {
        key = normalizeKey(key);
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      // Exclude this node itself
      return ancestors.rest().find(iterator);
    }

    /**
     * Get the furthest block parent of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestBlock',
    value: function getFurthestBlock(key) {
      return this.getFurthest(key, function (node) {
        return node.kind == 'block';
      });
    }

    /**
     * Get the furthest inline parent of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestInline',
    value: function getFurthestInline(key) {
      return this.getFurthest(key, function (node) {
        return node.kind == 'inline';
      });
    }

    /**
     * Get the furthest ancestor of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestAncestor',
    value: function getFurthestAncestor(key) {
      key = normalizeKey(key);
      return this.nodes.find(function (node) {
        if (node.key == key) return true;
        if (node.kind == 'text') return false;
        return node.hasDescendant(key);
      });
    }

    /**
     * Get the furthest ancestor of a node by `key` that has only one child.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestOnlyChildAncestor',
    value: function getFurthestOnlyChildAncestor(key) {
      var ancestors = this.getAncestors(key);

      if (!ancestors) {
        key = normalizeKey(key);
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      return ancestors
      // Skip this node...
      .skipLast()
      // Take parents until there are more than one child...
      .reverse().takeUntil(function (p) {
        return p.nodes.size > 1;
      })
      // And pick the highest.
      .last();
    }

    /**
     * Get the closest inline nodes for each text node in the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getInlines',
    value: function getInlines() {
      var array = this.getInlinesAsArray();
      return new _immutable.List(array);
    }

    /**
     * Get the closest inline nodes for each text node in the node, as an array.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesAsArray',
    value: function getInlinesAsArray() {
      var array = [];

      this.nodes.forEach(function (child) {
        if (child.kind == 'text') return;
        if (child.isLeafInline()) {
          array.push(child);
        } else {
          array = array.concat(child.getInlinesAsArray());
        }
      });

      return array;
    }

    /**
     * Get the closest inline nodes for each text node in a `range`.
     *
     * @param {Selection} range
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesAtRange',
    value: function getInlinesAtRange(range) {
      var array = this.getInlinesAtRangeAsArray(range);
      // Remove duplicates by converting it to an `OrderedSet` first.
      return new _immutable.List(new _immutable.OrderedSet(array));
    }

    /**
     * Get the closest inline nodes for each text node in a `range` as an array.
     *
     * @param {Selection} range
     * @return {Array}
     */

  }, {
    key: 'getInlinesAtRangeAsArray',
    value: function getInlinesAtRangeAsArray(range) {
      var _this = this;

      range = range.normalize(this);
      if (range.isUnset) return [];

      return this.getTextsAtRangeAsArray(range).map(function (text) {
        return _this.getClosestInline(text.key);
      }).filter(function (exists) {
        return exists;
      });
    }

    /**
     * Get all of the leaf inline nodes that match a `type`.
     *
     * @param {String} type
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesByType',
    value: function getInlinesByType(type) {
      var array = this.getInlinesByTypeAsArray(type);
      return new _immutable.List(array);
    }

    /**
     * Get all of the leaf inline nodes that match a `type` as an array.
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getInlinesByTypeAsArray',
    value: function getInlinesByTypeAsArray(type) {
      return this.nodes.reduce(function (inlines, node) {
        if (node.kind == 'text') {
          return inlines;
        } else if (node.isLeafInline() && node.type == type) {
          inlines.push(node);
          return inlines;
        } else {
          return inlines.concat(node.getInlinesByTypeAsArray(type));
        }
      }, []);
    }

    /**
     * Return a set of all keys in the node.
     *
     * @return {Set<String>}
     */

  }, {
    key: 'getKeys',
    value: function getKeys() {
      var keys = [];

      this.forEachDescendant(function (desc) {
        keys.push(desc.key);
      });

      return new _immutable.Set(keys);
    }

    /**
     * Get the last child text node.
     *
     * @return {Node|Null}
     */

  }, {
    key: 'getLastText',
    value: function getLastText() {
      var descendantFound = null;

      var found = this.nodes.findLast(function (node) {
        if (node.kind == 'text') return true;
        descendantFound = node.getLastText();
        return descendantFound;
      });

      return descendantFound || found;
    }

    /**
     * Get all of the marks for all of the characters of every text node.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarks',
    value: function getMarks() {
      var array = this.getMarksAsArray();
      return new _immutable.Set(array);
    }

    /**
     * Get all of the marks for all of the characters of every text node.
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarks',
    value: function getOrderedMarks() {
      var array = this.getMarksAsArray();
      return new _immutable.OrderedSet(array);
    }

    /**
     * Get all of the marks as an array.
     *
     * @return {Array}
     */

  }, {
    key: 'getMarksAsArray',
    value: function getMarksAsArray() {
      return this.nodes.reduce(function (marks, node) {
        return marks.concat(node.getMarksAsArray());
      }, []);
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Selection} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtRange',
    value: function getMarksAtRange(range) {
      var array = this.getMarksAtRangeAsArray(range);
      return new _immutable.Set(array);
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Selection} range
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksAtRange',
    value: function getOrderedMarksAtRange(range) {
      var array = this.getMarksAtRangeAsArray(range);
      return new _immutable.OrderedSet(array);
    }

    /**
     * Get a set of the active marks in a `range`.
     *
     * @param {Selection} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarksAtRange',
    value: function getActiveMarksAtRange(range) {
      var array = this.getActiveMarksAtRangeAsArray(range);
      return new _immutable.Set(array);
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Selection} range
     * @return {Array}
     */

  }, {
    key: 'getMarksAtRangeAsArray',
    value: function getMarksAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      var _range3 = range,
          startKey = _range3.startKey,
          startOffset = _range3.startOffset;

      // If the range is collapsed at the start of the node, check the previous.

      if (range.isCollapsed && startOffset == 0) {
        var previous = this.getPreviousText(startKey);
        if (!previous || previous.text.length == 0) return [];
        var char = previous.characters.get(previous.text.length - 1);
        return char.marks.toArray();
      }

      // If the range is collapsed, check the character before the start.
      if (range.isCollapsed) {
        var text = this.getDescendant(startKey);
        var _char = text.characters.get(range.startOffset - 1);
        return _char.marks.toArray();
      }

      // Otherwise, get a set of the marks for each character in the range.
      return this.getCharactersAtRange(range).reduce(function (memo, char) {
        char.marks.toArray().forEach(function (c) {
          return memo.push(c);
        });
        return memo;
      }, []);
    }
  }, {
    key: 'getActiveMarksAtRangeAsArray',
    value: function getActiveMarksAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      var _range4 = range,
          startKey = _range4.startKey,
          startOffset = _range4.startOffset;

      // If the range is collapsed at the start of the node, check the previous.

      if (range.isCollapsed && startOffset == 0) {
        var previous = this.getPreviousText(startKey);
        if (!previous || !previous.length) return [];
        var char = previous.characters.get(previous.length - 1);
        return char.marks.toArray();
      }

      // If the range is collapsed, check the character before the start.
      if (range.isCollapsed) {
        var text = this.getDescendant(startKey);
        var _char2 = text.characters.get(range.startOffset - 1);
        return _char2.marks.toArray();
      }

      // Otherwise, get a set of the marks for each character in the range.
      var chars = this.getCharactersAtRange(range);
      var first = chars.first();
      var memo = first.marks;
      chars.slice(1).forEach(function (char) {
        memo = memo.intersect(char.marks);
        return memo.size != 0;
      });
      return memo.toArray();
    }

    /**
     * Get all of the marks that match a `type`.
     *
     * @param {String} type
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksByType',
    value: function getMarksByType(type) {
      var array = this.getMarksByTypeAsArray(type);
      return new _immutable.Set(array);
    }

    /**
     * Get all of the marks that match a `type`.
     *
     * @param {String} type
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksByType',
    value: function getOrderedMarksByType(type) {
      var array = this.getMarksByTypeAsArray(type);
      return new _immutable.OrderedSet(array);
    }

    /**
     * Get all of the marks that match a `type` as an array.
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getMarksByTypeAsArray',
    value: function getMarksByTypeAsArray(type) {
      return this.nodes.reduce(function (array, node) {
        return node.kind == 'text' ? array.concat(node.getMarksAsArray().filter(function (m) {
          return m.type == type;
        })) : array.concat(node.getMarksByTypeAsArray(type));
      }, []);
    }

    /**
     * Get the block node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextBlock',
    value: function getNextBlock(key) {
      var child = this.assertDescendant(key);
      var last = void 0;

      if (child.kind == 'block') {
        last = child.getLastText();
      } else {
        var block = this.getClosestBlock(key);
        last = block.getLastText();
      }

      var next = this.getNextText(last.key);
      if (!next) return null;

      return this.getClosestBlock(next.key);
    }

    /**
     * Get the node after a descendant by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextSibling',
    value: function getNextSibling(key) {
      key = normalizeKey(key);

      var parent = this.getParent(key);
      var after = parent.nodes.skipUntil(function (child) {
        return child.key == key;
      });

      if (after.size == 0) {
        throw new Error('Could not find a child node with key "' + key + '".');
      }
      return after.get(1);
    }

    /**
     * Get the text node after a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextText',
    value: function getNextText(key) {
      key = normalizeKey(key);
      return this.getTexts().skipUntil(function (text) {
        return text.key == key;
      }).get(1);
    }

    /**
     * Get a node in the tree by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(key) {
      key = normalizeKey(key);
      return this.key == key ? this : this.getDescendant(key);
    }

    /**
     * Get a node in the tree by `path`.
     *
     * @param {Array} path
     * @return {Node|Null}
     */

  }, {
    key: 'getNodeAtPath',
    value: function getNodeAtPath(path) {
      return path.length ? this.getDescendantAtPath(path) : this;
    }

    /**
     * Get the offset for a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Number}
     */

  }, {
    key: 'getOffset',
    value: function getOffset(key) {
      this.assertDescendant(key);

      // Calculate the offset of the nodes before the highest child.
      var child = this.getFurthestAncestor(key);
      var offset = this.nodes.takeUntil(function (n) {
        return n == child;
      }).reduce(function (memo, n) {
        return memo + n.text.length;
      }, 0);

      // Recurse if need be.
      return this.hasChild(key) ? offset : offset + child.getOffset(key);
    }

    /**
     * Get the offset from a `range`.
     *
     * @param {Selection} range
     * @return {Number}
     */

  }, {
    key: 'getOffsetAtRange',
    value: function getOffsetAtRange(range) {
      range = range.normalize(this);

      if (range.isUnset) {
        throw new Error('The range cannot be unset to calculcate its offset.');
      }

      if (range.isExpanded) {
        throw new Error('The range must be collapsed to calculcate its offset.');
      }

      var _range5 = range,
          startKey = _range5.startKey,
          startOffset = _range5.startOffset;

      return this.getOffset(startKey) + startOffset;
    }

    /**
     * Get the parent of a child node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getParent',
    value: function getParent(key) {
      if (this.hasChild(key)) return this;

      var node = null;

      this.nodes.find(function (child) {
        if (child.kind == 'text') {
          return false;
        } else {
          node = child.getParent(key);
          return node;
        }
      });

      return node;
    }

    /**
     * Get the path of a descendant node by `key`.
     *
     * @param {String|Node} key
     * @return {Array}
     */

  }, {
    key: 'getPath',
    value: function getPath(key) {
      var child = this.assertNode(key);
      var ancestors = this.getAncestors(key);
      var path = [];

      ancestors.reverse().forEach(function (ancestor) {
        var index = ancestor.nodes.indexOf(child);
        path.unshift(index);
        child = ancestor;
      });

      return path;
    }

    /**
     * Get the block node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousBlock',
    value: function getPreviousBlock(key) {
      var child = this.assertDescendant(key);
      var first = void 0;

      if (child.kind == 'block') {
        first = child.getFirstText();
      } else {
        var block = this.getClosestBlock(key);
        first = block.getFirstText();
      }

      var previous = this.getPreviousText(first.key);
      if (!previous) return null;

      return this.getClosestBlock(previous.key);
    }

    /**
     * Get the node before a descendant node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousSibling',
    value: function getPreviousSibling(key) {
      key = normalizeKey(key);
      var parent = this.getParent(key);
      var before = parent.nodes.takeUntil(function (child) {
        return child.key == key;
      });

      if (before.size == parent.nodes.size) {
        throw new Error('Could not find a child node with key "' + key + '".');
      }

      return before.last();
    }

    /**
     * Get the text node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousText',
    value: function getPreviousText(key) {
      key = normalizeKey(key);
      return this.getTexts().takeUntil(function (text) {
        return text.key == key;
      }).last();
    }

    /**
     * Get the concatenated text string of all child nodes.
     *
     * @return {String}
     */

  }, {
    key: 'getText',
    value: function getText() {
      return this.nodes.reduce(function (string, node) {
        return string + node.text;
      }, '');
    }

    /**
     * Get the descendent text node at an `offset`.
     *
     * @param {String} offset
     * @return {Node|Null}
     */

  }, {
    key: 'getTextAtOffset',
    value: function getTextAtOffset(offset) {
      // PERF: Add a few shortcuts for the obvious cases.
      if (offset == 0) return this.getFirstText();
      if (offset == this.text.length) return this.getLastText();
      if (offset < 0 || offset > this.text.length) return null;

      var length = 0;

      return this.getTexts().find(function (node, i, nodes) {
        length += node.text.length;
        return length > offset;
      });
    }

    /**
     * Get the direction of the node's text.
     *
     * @return {String}
     */

  }, {
    key: 'getTextDirection',
    value: function getTextDirection() {
      var dir = (0, _direction2.default)(this.text);
      return dir == 'neutral' ? undefined : dir;
    }

    /**
     * Recursively get all of the child text nodes in order of appearance.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getTexts',
    value: function getTexts() {
      var array = this.getTextsAsArray();
      return new _immutable.List(array);
    }

    /**
     * Recursively get all the leaf text nodes in order of appearance, as array.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getTextsAsArray',
    value: function getTextsAsArray() {
      var array = [];

      this.nodes.forEach(function (node) {
        if (node.kind == 'text') {
          array.push(node);
        } else {
          array = array.concat(node.getTextsAsArray());
        }
      });

      return array;
    }

    /**
     * Get all of the text nodes in a `range`.
     *
     * @param {Selection} range
     * @return {List<Node>}
     */

  }, {
    key: 'getTextsAtRange',
    value: function getTextsAtRange(range) {
      var array = this.getTextsAtRangeAsArray(range);
      return new _immutable.List(array);
    }

    /**
     * Get all of the text nodes in a `range` as an array.
     *
     * @param {Selection} range
     * @return {Array}
     */

  }, {
    key: 'getTextsAtRangeAsArray',
    value: function getTextsAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      var _range6 = range,
          startKey = _range6.startKey,
          endKey = _range6.endKey;

      var startText = this.getDescendant(startKey);

      // PERF: the most common case is when the range is in a single text node,
      // where we can avoid a lot of iterating of the tree.
      if (startKey == endKey) return [startText];

      var endText = this.getDescendant(endKey);
      var texts = this.getTextsAsArray();
      var start = texts.indexOf(startText);
      var end = texts.indexOf(endText);
      return texts.slice(start, end + 1);
    }

    /**
     * Check if a child node exists by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasChild',
    value: function hasChild(key) {
      return !!this.getChild(key);
    }

    /**
     * Recursively check if a child node exists by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasDescendant',
    value: function hasDescendant(key) {
      return !!this.getDescendant(key);
    }

    /**
     * Recursively check if a node exists by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasNode',
    value: function hasNode(key) {
      return !!this.getNode(key);
    }

    /**
     * Check if a node has a void parent by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasVoidParent',
    value: function hasVoidParent(key) {
      return !!this.getClosest(key, function (parent) {
        return parent.isVoid;
      });
    }

    /**
     * Insert a `node` at `index`.
     *
     * @param {Number} index
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: 'insertNode',
    value: function insertNode(index, node) {
      var keys = this.getKeys();

      if (keys.contains(node.key)) {
        node = node.regenerateKey();
      }

      if (node.kind != 'text') {
        node = node.mapDescendants(function (desc) {
          return keys.contains(desc.key) ? desc.regenerateKey() : desc;
        });
      }

      var nodes = this.nodes.insert(index, node);
      return this.set('nodes', nodes);
    }

    /**
     * Check whether the node is a leaf block.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isLeafBlock',
    value: function isLeafBlock() {
      return this.kind == 'block' && this.nodes.every(function (n) {
        return n.kind != 'block';
      });
    }

    /**
     * Check whether the node is a leaf inline.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isLeafInline',
    value: function isLeafInline() {
      return this.kind == 'inline' && this.nodes.every(function (n) {
        return n.kind != 'inline';
      });
    }

    /**
     * Merge a children node `first` with another children node `second`.
     * `first` and `second` will be concatenated in that order.
     * `first` and `second` must be two Nodes or two Text.
     *
     * @param {Node} first
     * @param {Node} second
     * @return {Node}
     */

  }, {
    key: 'mergeNode',
    value: function mergeNode(withIndex, index) {
      var node = this;
      var one = node.nodes.get(withIndex);
      var two = node.nodes.get(index);

      if (one.kind != two.kind) {
        throw new Error('Tried to merge two nodes of different kinds: "' + one.kind + '" and "' + two.kind + '".');
      }

      // If the nodes are text nodes, concatenate their characters together.
      if (one.kind == 'text') {
        var characters = one.characters.concat(two.characters);
        one = one.set('characters', characters);
      }

      // Otherwise, concatenate their child nodes together.
      else {
          var nodes = one.nodes.concat(two.nodes);
          one = one.set('nodes', nodes);
        }

      node = node.removeNode(index);
      node = node.removeNode(withIndex);
      node = node.insertNode(withIndex, one);
      return node;
    }

    /**
     * Map all child nodes, updating them in their parents. This method is
     * optimized to not return a new node if no changes are made.
     *
     * @param {Function} iterator
     * @return {Node}
     */

  }, {
    key: 'mapChildren',
    value: function mapChildren(iterator) {
      var _this2 = this;

      var nodes = this.nodes;


      nodes.forEach(function (node, i) {
        var ret = iterator(node, i, _this2.nodes);
        if (ret != node) nodes = nodes.set(ret.key, ret);
      });

      return this.set('nodes', nodes);
    }

    /**
     * Map all descendant nodes, updating them in their parents. This method is
     * optimized to not return a new node if no changes are made.
     *
     * @param {Function} iterator
     * @return {Node}
     */

  }, {
    key: 'mapDescendants',
    value: function mapDescendants(iterator) {
      var _this3 = this;

      var nodes = this.nodes;


      nodes.forEach(function (node, i) {
        var ret = node;
        if (ret.kind != 'text') ret = ret.mapDescendants(iterator);
        ret = iterator(ret, i, _this3.nodes);
        if (ret == node) return;

        var index = nodes.indexOf(node);
        nodes = nodes.set(index, ret);
      });

      return this.set('nodes', nodes);
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Node}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      var key = (0, _generateKey2.default)();
      return this.set('key', key);
    }

    /**
     * Remove a `node` from the children node map.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'removeDescendant',
    value: function removeDescendant(key) {
      key = normalizeKey(key);

      var node = this;
      var parent = node.getParent(key);
      if (!parent) throw new Error('Could not find a descendant node with key "' + key + '".');

      var index = parent.nodes.findIndex(function (n) {
        return n.key === key;
      });
      var nodes = parent.nodes.splice(index, 1);

      parent = parent.set('nodes', nodes);
      node = node.updateNode(parent);
      return node;
    }

    /**
     * Remove a node at `index`.
     *
     * @param {Number} index
     * @return {Node}
     */

  }, {
    key: 'removeNode',
    value: function removeNode(index) {
      var nodes = this.nodes.splice(index, 1);
      return this.set('nodes', nodes);
    }

    /**
     * Split a child node by `index` at `position`.
     *
     * @param {Number} index
     * @param {Number} position
     * @return {Node}
     */

  }, {
    key: 'splitNode',
    value: function splitNode(index, position) {
      var node = this;
      var child = node.nodes.get(index);
      var one = void 0;
      var two = void 0;

      // If the child is a text node, the `position` refers to the text offset at
      // which to split it.
      if (child.kind == 'text') {
        var befores = child.characters.take(position);
        var afters = child.characters.skip(position);
        one = child.set('characters', befores);
        two = child.set('characters', afters).regenerateKey();
      }

      // Otherwise, if the child is not a text node, the `position` refers to the
      // index at which to split its children.
      else {
          var _befores = child.nodes.take(position);
          var _afters = child.nodes.skip(position);
          one = child.set('nodes', _befores);
          two = child.set('nodes', _afters).regenerateKey();
        }

      // Remove the old node and insert the newly split children.
      node = node.removeNode(index);
      node = node.insertNode(index, two);
      node = node.insertNode(index, one);
      return node;
    }

    /**
     * Set a new value for a child node by `key`.
     *
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: 'updateNode',
    value: function updateNode(node) {
      if (node.key == this.key) {
        return node;
      }

      var child = this.assertDescendant(node.key);
      var ancestors = this.getAncestors(node.key);

      ancestors.reverse().forEach(function (parent) {
        var _parent = parent,
            nodes = _parent.nodes;

        var index = nodes.indexOf(child);
        child = parent;
        nodes = nodes.set(index, node);
        parent = parent.set('nodes', nodes);
        node = parent;
      });

      return node;
    }

    /**
     * Validate the node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Object|Null}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.__validate(this);
    }

    /**
     * True if the node has both descendants in that order, false otherwise. The
     * order is depth-first, post-order.
     *
     * @param {String} first
     * @param {String} second
     * @return {Boolean}
     */

  }, {
    key: 'areDescendantSorted',
    value: function areDescendantSorted(first, second) {
      _logger2.default.deprecate('0.19.0', 'The Node.areDescendantSorted(first, second) method is deprecated, please use `Node.areDescendantsSorted(first, second) instead.');
      return this.areDescendantsSorted(first, second);
    }

    /**
     * Concat children `nodes` on to the end of the node.
     *
     * @param {List<Node>} nodes
     * @return {Node}
     */

  }, {
    key: 'concatChildren',
    value: function concatChildren(nodes) {
      _logger2.default.deprecate('0.19.0', 'The `Node.concatChildren(nodes)` method is deprecated.');
      nodes = this.nodes.concat(nodes);
      return this.set('nodes', nodes);
    }

    /**
     * Decorate all of the text nodes with a `decorator` function.
     *
     * @param {Function} decorator
     * @return {Node}
     */

  }, {
    key: 'decorateTexts',
    value: function decorateTexts(decorator) {
      _logger2.default.deprecate('0.19.0', 'The `Node.decorateTexts(decorator) method is deprecated.');
      return this.mapDescendants(function (child) {
        return child.kind == 'text' ? child.decorateCharacters(decorator) : child;
      });
    }

    /**
     * Recursively filter all descendant nodes with `iterator`, depth-first.
     * It is different from `filterDescendants` in regard of the order of results.
     *
     * @param {Function} iterator
     * @return {List<Node>}
     */

  }, {
    key: 'filterDescendantsDeep',
    value: function filterDescendantsDeep(iterator) {
      _logger2.default.deprecate('0.19.0', 'The Node.filterDescendantsDeep(iterator) method is deprecated.');
      return this.nodes.reduce(function (matches, child, i, nodes) {
        if (child.kind != 'text') matches = matches.concat(child.filterDescendantsDeep(iterator));
        if (iterator(child, i, nodes)) matches = matches.push(child);
        return matches;
      }, new _immutable.List());
    }

    /**
     * Recursively find all descendant nodes by `iterator`. Depth first.
     *
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'findDescendantDeep',
    value: function findDescendantDeep(iterator) {
      _logger2.default.deprecate('0.19.0', 'The Node.findDescendantDeep(iterator) method is deprecated.');
      var found = void 0;

      this.forEachDescendant(function (node) {
        if (iterator(node)) {
          found = node;
          return false;
        }
      });

      return found;
    }

    /**
     * Get children between two child keys.
     *
     * @param {String} start
     * @param {String} end
     * @return {Node}
     */

  }, {
    key: 'getChildrenBetween',
    value: function getChildrenBetween(start, end) {
      _logger2.default.deprecate('0.19.0', 'The `Node.getChildrenBetween(start, end)` method is deprecated.');
      start = this.assertChild(start);
      start = this.nodes.indexOf(start);
      end = this.assertChild(end);
      end = this.nodes.indexOf(end);
      return this.nodes.slice(start + 1, end);
    }

    /**
     * Get children between two child keys, including the two children.
     *
     * @param {String} start
     * @param {String} end
     * @return {Node}
     */

  }, {
    key: 'getChildrenBetweenIncluding',
    value: function getChildrenBetweenIncluding(start, end) {
      _logger2.default.deprecate('0.19.0', 'The `Node.getChildrenBetweenIncluding(start, end)` method is deprecated.');
      start = this.assertChild(start);
      start = this.nodes.indexOf(start);
      end = this.assertChild(end);
      end = this.nodes.indexOf(end);
      return this.nodes.slice(start, end + 1);
    }

    /**
     * Get the highest child ancestor of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getHighestChild',
    value: function getHighestChild(key) {
      _logger2.default.deprecate('0.19.0', 'The `Node.getHighestChild(key) method is deprecated, please use `Node.getFurthestAncestor(key) instead.');
      return this.getFurthestAncestor(key);
    }

    /**
     * Get the highest parent of a node by `key` which has an only child.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getHighestOnlyChildParent',
    value: function getHighestOnlyChildParent(key) {
      _logger2.default.deprecate('0.19.0', 'The `Node.getHighestOnlyChildParent(key)` method is deprecated, please use `Node.getFurthestOnlyChildAncestor` instead.');
      return this.getFurthestOnlyChildAncestor(key);
    }

    /**
     * Check if the inline nodes are split at a `range`.
     *
     * @param {Selection} range
     * @return {Boolean}
     */

  }, {
    key: 'isInlineSplitAtRange',
    value: function isInlineSplitAtRange(range) {
      _logger2.default.deprecate('0.19.0', 'The `Node.isInlineSplitAtRange(range)` method is deprecated.');
      range = range.normalize(this);
      if (range.isExpanded) throw new Error();

      var _range7 = range,
          startKey = _range7.startKey;

      var start = this.getFurthestInline(startKey) || this.getDescendant(startKey);
      return range.isAtStartOf(start) || range.isAtEndOf(start);
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Node` with `attrs`.
     *
     * @param {Object|Node} attrs
     * @return {Node}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Node.isNode(attrs)) {
        return attrs;
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        switch (attrs.kind) {
          case 'block':
            return _block2.default.create(attrs);
          case 'document':
            return _document2.default.create(attrs);
          case 'inline':
            return _inline2.default.create(attrs);
          case 'text':
            return _text2.default.create(attrs);
          default:
            {
              throw new Error('`Node.create` requires a `kind` string.');
            }
        }
      }

      throw new Error('`Node.create` only accepts objects or nodes but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Nodes` from an array.
     *
     * @param {Array<Object|Node>} elements
     * @return {List<Node>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new _immutable.List(elements.map(Node.create));
        return list;
      }

      throw new Error('`Node.createList` only accepts lists or arrays, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable node properties from `attrs`.
     *
     * @param {Object|String|Node} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (_block2.default.isBlock(attrs) || _inline2.default.isInline(attrs)) {
        return {
          data: attrs.data,
          isVoid: attrs.isVoid,
          type: attrs.type
        };
      }

      if (typeof attrs == 'string') {
        return { type: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var props = {};
        if ('type' in attrs) props.type = attrs.type;
        if ('data' in attrs) props.data = _data2.default.create(attrs.data);
        if ('isVoid' in attrs) props.isVoid = attrs.isVoid;
        return props;
      }

      throw new Error('`Node.createProperties` only accepts objects, strings, blocks or inlines, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `Node`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isNode',
    value: function isNode(value) {
      return _block2.default.isBlock(value) || _document2.default.isDocument(value) || _inline2.default.isInline(value) || _text2.default.isText(value);
    }

    /**
     * Check if a `value` is a list of nodes.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isNodeList',
    value: function isNodeList(value) {
      return _immutable.List.isList(value) && value.every(function (item) {
        return Node.isNode(item);
      });
    }
  }]);

  return Node;
}();

/**
 * Normalize a key argument `value`.
 *
 * @param {String|Node} value
 * @return {String}
 */

function normalizeKey(value) {
  if (typeof value == 'string') return value;

  _logger2.default.deprecate('0.14.0', 'An object was passed to a Node method instead of a `key` string. This was previously supported, but is being deprecated because it can have a negative impact on performance. The object in question was:', value);

  if (Node.isNode(value)) {
    return value.key;
  }

  throw new Error('Invalid `key` argument! It must be either a block, an inline, a text, or a string. You passed: ' + value);
}

/**
 * Memoize read methods.
 */

(0, _memoize2.default)(Node.prototype, ['getBlocks', 'getBlocksAsArray', 'getCharacters', 'getCharactersAsArray', 'getFirstText', 'getInlines', 'getInlinesAsArray', 'getKeys', 'getLastText', 'getMarks', 'getOrderedMarks', 'getMarksAsArray', 'getText', 'getTextDirection', 'getTexts', 'getTextsAsArray', 'isLeafBlock', 'isLeafInline'], {
  takesArguments: false
});

(0, _memoize2.default)(Node.prototype, ['areDescendantsSorted', 'getActiveMarksAtRange', 'getActiveMarksAtRangeAsArray', 'getAncestors', 'getBlocksAtRange', 'getBlocksAtRangeAsArray', 'getBlocksByType', 'getBlocksByTypeAsArray', 'getCharactersAtRange', 'getCharactersAtRangeAsArray', 'getChild', 'getChildrenBetween', 'getChildrenBetweenIncluding', 'getClosestBlock', 'getClosestInline', 'getClosestVoid', 'getCommonAncestor', 'getComponent', 'getDecorators', 'getDepth', 'getDescendant', 'getDescendantAtPath', 'getDescendantDecorators', 'getFragmentAtRange', 'getFurthestBlock', 'getFurthestInline', 'getFurthestAncestor', 'getFurthestOnlyChildAncestor', 'getInlinesAtRange', 'getInlinesAtRangeAsArray', 'getInlinesByType', 'getInlinesByTypeAsArray', 'getMarksAtRange', 'getOrderedMarksAtRange', 'getMarksAtRangeAsArray', 'getMarksByType', 'getOrderedMarksByType', 'getMarksByTypeAsArray', 'getNextBlock', 'getNextSibling', 'getNextText', 'getNode', 'getNodeAtPath', 'getOffset', 'getOffsetAtRange', 'getParent', 'getPath', 'getPreviousBlock', 'getPreviousSibling', 'getPreviousText', 'getTextAtOffset', 'getTextsAtRange', 'getTextsAtRangeAsArray', 'hasChild', 'hasDescendant', 'hasNode', 'hasVoidParent', 'isInlineSplitAtRange', 'validate'], {
  takesArguments: true
});

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvbm9kZS5qcyJdLCJuYW1lcyI6WyJOb2RlIiwiZmlyc3QiLCJzZWNvbmQiLCJub3JtYWxpemVLZXkiLCJzb3J0ZWQiLCJmb3JFYWNoRGVzY2VuZGFudCIsIm4iLCJrZXkiLCJjaGlsZCIsImdldENoaWxkIiwiRXJyb3IiLCJkZXNjZW5kYW50IiwiZ2V0RGVzY2VuZGFudCIsIm5vZGUiLCJnZXROb2RlIiwicGF0aCIsImdldERlc2NlbmRhbnRBdFBhdGgiLCJpdGVyYXRvciIsIm1hdGNoZXMiLCJpIiwibm9kZXMiLCJwdXNoIiwiZm91bmQiLCJyZXQiLCJmb3JFYWNoIiwia2luZCIsImhhc0NoaWxkIiwiYW5jZXN0b3JzIiwiZmluZCIsImdldEFuY2VzdG9ycyIsInVuc2hpZnQiLCJhcnJheSIsImdldEJsb2Nrc0FzQXJyYXkiLCJyZWR1Y2UiLCJpc0xlYWZCbG9jayIsImNvbmNhdCIsInJhbmdlIiwiZ2V0QmxvY2tzQXRSYW5nZUFzQXJyYXkiLCJub3JtYWxpemUiLCJpc1Vuc2V0Iiwic3RhcnRLZXkiLCJlbmRLZXkiLCJzdGFydEJsb2NrIiwiZ2V0Q2xvc2VzdEJsb2NrIiwiZW5kQmxvY2siLCJibG9ja3MiLCJzdGFydCIsImluZGV4T2YiLCJlbmQiLCJzbGljZSIsInR5cGUiLCJnZXRCbG9ja3NCeVR5cGVBc0FycmF5IiwiZ2V0Q2hhcmFjdGVyc0FzQXJyYXkiLCJhcnIiLCJjaGFyYWN0ZXJzIiwidG9BcnJheSIsImdldENoYXJhY3RlcnNBdFJhbmdlQXNBcnJheSIsImdldFRleHRzQXRSYW5nZSIsInRleHQiLCJjaGFycyIsImZpbHRlciIsImNoYXIiLCJyZXN0IiwiZmluZExhc3QiLCJnZXRDbG9zZXN0IiwicGFyZW50IiwiaXNWb2lkIiwib25lIiwidHdvIiwiYXNzZXJ0RGVzY2VuZGFudCIsIm9uZVBhcmVudCIsImdldFBhcmVudCIsInR3b1BhcmVudCIsImluY2x1ZGVzIiwic2NoZW1hIiwiX19nZXRDb21wb25lbnQiLCJfX2dldERlY29yYXRvcnMiLCJzdGFydEF0IiwiZ2V0RnVydGhlc3RBbmNlc3RvciIsImdldERlcHRoIiwiZGVzY2VuZGFudEZvdW5kIiwibGVuZ3RoIiwiaW5kZXgiLCJnZXQiLCJoYXNEZWNvcmF0b3JzIiwiZGVjb3JhdG9ycyIsImdldERlY29yYXRvcnMiLCJnZXRGaXJzdFRleHQiLCJjcmVhdGUiLCJzdGFydE9mZnNldCIsImVuZE9mZnNldCIsInN0YXJ0VGV4dCIsImVuZFRleHQiLCJwcmV2aW91cyIsInBvc2l0aW9uIiwic3BsaXROb2RlIiwidXBkYXRlTm9kZSIsIm5leHQiLCJnZXROZXh0VGV4dCIsInN0YXJ0Tm9kZSIsImdldE5leHRTaWJsaW5nIiwiZW5kTm9kZSIsInN0YXJ0SW5kZXgiLCJlbmRJbmRleCIsImdldEZ1cnRoZXN0IiwiaGFzRGVzY2VuZGFudCIsInNraXBMYXN0IiwicmV2ZXJzZSIsInRha2VVbnRpbCIsInAiLCJzaXplIiwibGFzdCIsImdldElubGluZXNBc0FycmF5IiwiaXNMZWFmSW5saW5lIiwiZ2V0SW5saW5lc0F0UmFuZ2VBc0FycmF5IiwiZ2V0VGV4dHNBdFJhbmdlQXNBcnJheSIsIm1hcCIsImdldENsb3Nlc3RJbmxpbmUiLCJleGlzdHMiLCJnZXRJbmxpbmVzQnlUeXBlQXNBcnJheSIsImlubGluZXMiLCJrZXlzIiwiZGVzYyIsImdldExhc3RUZXh0IiwiZ2V0TWFya3NBc0FycmF5IiwibWFya3MiLCJnZXRNYXJrc0F0UmFuZ2VBc0FycmF5IiwiZ2V0QWN0aXZlTWFya3NBdFJhbmdlQXNBcnJheSIsImlzQ29sbGFwc2VkIiwiZ2V0UHJldmlvdXNUZXh0IiwiZ2V0Q2hhcmFjdGVyc0F0UmFuZ2UiLCJtZW1vIiwiYyIsImludGVyc2VjdCIsImdldE1hcmtzQnlUeXBlQXNBcnJheSIsIm0iLCJibG9jayIsImFmdGVyIiwic2tpcFVudGlsIiwiZ2V0VGV4dHMiLCJvZmZzZXQiLCJnZXRPZmZzZXQiLCJpc0V4cGFuZGVkIiwiYXNzZXJ0Tm9kZSIsImFuY2VzdG9yIiwiYmVmb3JlIiwic3RyaW5nIiwiZGlyIiwidW5kZWZpbmVkIiwiZ2V0VGV4dHNBc0FycmF5IiwidGV4dHMiLCJnZXRLZXlzIiwiY29udGFpbnMiLCJyZWdlbmVyYXRlS2V5IiwibWFwRGVzY2VuZGFudHMiLCJpbnNlcnQiLCJzZXQiLCJldmVyeSIsIndpdGhJbmRleCIsInJlbW92ZU5vZGUiLCJpbnNlcnROb2RlIiwiZmluZEluZGV4Iiwic3BsaWNlIiwiYmVmb3JlcyIsInRha2UiLCJhZnRlcnMiLCJza2lwIiwiX192YWxpZGF0ZSIsImRlcHJlY2F0ZSIsImFyZURlc2NlbmRhbnRzU29ydGVkIiwiZGVjb3JhdG9yIiwiZGVjb3JhdGVDaGFyYWN0ZXJzIiwiZmlsdGVyRGVzY2VuZGFudHNEZWVwIiwiYXNzZXJ0Q2hpbGQiLCJnZXRGdXJ0aGVzdE9ubHlDaGlsZEFuY2VzdG9yIiwiZ2V0RnVydGhlc3RJbmxpbmUiLCJpc0F0U3RhcnRPZiIsImlzQXRFbmRPZiIsImF0dHJzIiwiaXNOb2RlIiwiZWxlbWVudHMiLCJpc0xpc3QiLCJBcnJheSIsImlzQXJyYXkiLCJsaXN0IiwiaXNCbG9jayIsImlzSW5saW5lIiwiZGF0YSIsInByb3BzIiwidmFsdWUiLCJpc0RvY3VtZW50IiwiaXNUZXh0IiwiaXRlbSIsInByb3RvdHlwZSIsInRha2VzQXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7OztJQVNNQSxJOzs7Ozs7Ozs7QUF1R0o7Ozs7Ozs7Ozt5Q0FTcUJDLEssRUFBT0MsTSxFQUFRO0FBQ2xDRCxjQUFRRSxhQUFhRixLQUFiLENBQVI7QUFDQUMsZUFBU0MsYUFBYUQsTUFBYixDQUFUOztBQUVBLFVBQUlFLGVBQUo7O0FBRUEsV0FBS0MsaUJBQUwsQ0FBdUIsVUFBQ0MsQ0FBRCxFQUFPO0FBQzVCLFlB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Q3RCLGtCQTdDc0IsRUE4Q3RCLFdBOUNzQixFQStDdEIsU0EvQ3NCLEVBZ0R0QixrQkFoRHNCLEVBaUR0QixvQkFqRHNCLEVBa0R0QixpQkFsRHNCLEVBbUR0QixpQkFuRHNCLEVBb0R0QixpQkFwRHNCLEVBcUR0Qix3QkFyRHNCLEVBc0R0QixVQXREc0IsRUF1RHRCLGVBdkRzQixFQXdEdEIsU0F4RHNCLEVBeUR0QixlQXpEc0IsRUEwRHRCLHNCQTFEc0IsRUEyRHRCLFVBM0RzQixDQUF4QixFQTRERztBQUNEQyxrQkFBZ0I7QUFEZixDQTVESDs7QUFnRUE7Ozs7OztrQkFNZWxNLEkiLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IEJsb2NrIGZyb20gJy4vYmxvY2snXG5pbXBvcnQgRGF0YSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi9kb2N1bWVudCdcbmltcG9ydCBJbmxpbmUgZnJvbSAnLi9pbmxpbmUnXG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnXG5pbXBvcnQgZGlyZWN0aW9uIGZyb20gJ2RpcmVjdGlvbidcbmltcG9ydCBnZW5lcmF0ZUtleSBmcm9tICcuLi91dGlscy9nZW5lcmF0ZS1rZXknXG5pbXBvcnQgaXNJblJhbmdlIGZyb20gJy4uL3V0aWxzL2lzLWluLXJhbmdlJ1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnaXMtcGxhaW4tb2JqZWN0J1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInXG5pbXBvcnQgbWVtb2l6ZSBmcm9tICcuLi91dGlscy9tZW1vaXplJ1xuaW1wb3J0IHsgTGlzdCwgT3JkZXJlZFNldCwgU2V0IH0gZnJvbSAnaW1tdXRhYmxlJ1xuXG4vKipcbiAqIE5vZGUuXG4gKlxuICogQW5kIGludGVyZmFjZSB0aGF0IGBEb2N1bWVudGAsIGBCbG9ja2AgYW5kIGBJbmxpbmVgIGFsbCBpbXBsZW1lbnQsIHRvIG1ha2VcbiAqIHdvcmtpbmcgd2l0aCB0aGUgcmVjdXJzaXZlIG5vZGUgdHJlZSBlYXNpZXIuXG4gKlxuICogQHR5cGUge05vZGV9XG4gKi9cblxuY2xhc3MgTm9kZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgTm9kZWAgd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxOb2RlfSBhdHRyc1xuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlKGF0dHJzID0ge30pIHtcbiAgICBpZiAoTm9kZS5pc05vZGUoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChhdHRycykpIHtcbiAgICAgIHN3aXRjaCAoYXR0cnMua2luZCkge1xuICAgICAgICBjYXNlICdibG9jayc6IHJldHVybiBCbG9jay5jcmVhdGUoYXR0cnMpXG4gICAgICAgIGNhc2UgJ2RvY3VtZW50JzogcmV0dXJuIERvY3VtZW50LmNyZWF0ZShhdHRycylcbiAgICAgICAgY2FzZSAnaW5saW5lJzogcmV0dXJuIElubGluZS5jcmVhdGUoYXR0cnMpXG4gICAgICAgIGNhc2UgJ3RleHQnOiByZXR1cm4gVGV4dC5jcmVhdGUoYXR0cnMpXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BOb2RlLmNyZWF0ZWAgcmVxdWlyZXMgYSBga2luZGAgc3RyaW5nLicpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYE5vZGUuY3JlYXRlXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzIG9yIG5vZGVzIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2F0dHJzfWApXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbGlzdCBvZiBgTm9kZXNgIGZyb20gYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0fE5vZGU+fSBlbGVtZW50c1xuICAgKiBAcmV0dXJuIHtMaXN0PE5vZGU+fVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlTGlzdChlbGVtZW50cyA9IFtdKSB7XG4gICAgaWYgKExpc3QuaXNMaXN0KGVsZW1lbnRzKSB8fCBBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgICAgY29uc3QgbGlzdCA9IG5ldyBMaXN0KGVsZW1lbnRzLm1hcChOb2RlLmNyZWF0ZSkpXG4gICAgICByZXR1cm4gbGlzdFxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgXFxgTm9kZS5jcmVhdGVMaXN0XFxgIG9ubHkgYWNjZXB0cyBsaXN0cyBvciBhcnJheXMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2VsZW1lbnRzfWApXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGljdGlvbmFyeSBvZiBzZXR0YWJsZSBub2RlIHByb3BlcnRpZXMgZnJvbSBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd8Tm9kZX0gYXR0cnNcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlUHJvcGVydGllcyhhdHRycyA9IHt9KSB7XG4gICAgaWYgKEJsb2NrLmlzQmxvY2soYXR0cnMpIHx8IElubGluZS5pc0lubGluZShhdHRycykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGE6IGF0dHJzLmRhdGEsXG4gICAgICAgIGlzVm9pZDogYXR0cnMuaXNWb2lkLFxuICAgICAgICB0eXBlOiBhdHRycy50eXBlLFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYXR0cnMgPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IGF0dHJzIH1cbiAgICB9XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChhdHRycykpIHtcbiAgICAgIGNvbnN0IHByb3BzID0ge31cbiAgICAgIGlmICgndHlwZScgaW4gYXR0cnMpIHByb3BzLnR5cGUgPSBhdHRycy50eXBlXG4gICAgICBpZiAoJ2RhdGEnIGluIGF0dHJzKSBwcm9wcy5kYXRhID0gRGF0YS5jcmVhdGUoYXR0cnMuZGF0YSlcbiAgICAgIGlmICgnaXNWb2lkJyBpbiBhdHRycykgcHJvcHMuaXNWb2lkID0gYXR0cnMuaXNWb2lkXG4gICAgICByZXR1cm4gcHJvcHNcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYE5vZGUuY3JlYXRlUHJvcGVydGllc1xcYCBvbmx5IGFjY2VwdHMgb2JqZWN0cywgc3RyaW5ncywgYmxvY2tzIG9yIGlubGluZXMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2F0dHJzfWApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBgdmFsdWVgIGlzIGEgYE5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzTm9kZSh2YWx1ZSkge1xuICAgIHJldHVybiAoXG4gICAgICBCbG9jay5pc0Jsb2NrKHZhbHVlKSB8fFxuICAgICAgRG9jdW1lbnQuaXNEb2N1bWVudCh2YWx1ZSkgfHxcbiAgICAgIElubGluZS5pc0lubGluZSh2YWx1ZSkgfHxcbiAgICAgIFRleHQuaXNUZXh0KHZhbHVlKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBsaXN0IG9mIG5vZGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzTm9kZUxpc3QodmFsdWUpIHtcbiAgICByZXR1cm4gTGlzdC5pc0xpc3QodmFsdWUpICYmIHZhbHVlLmV2ZXJ5KGl0ZW0gPT4gTm9kZS5pc05vZGUoaXRlbSkpXG4gIH1cblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgbm9kZSBoYXMgYm90aCBkZXNjZW5kYW50cyBpbiB0aGF0IG9yZGVyLCBmYWxzZSBvdGhlcndpc2UuIFRoZVxuICAgKiBvcmRlciBpcyBkZXB0aC1maXJzdCwgcG9zdC1vcmRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWNvbmRcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgYXJlRGVzY2VuZGFudHNTb3J0ZWQoZmlyc3QsIHNlY29uZCkge1xuICAgIGZpcnN0ID0gbm9ybWFsaXplS2V5KGZpcnN0KVxuICAgIHNlY29uZCA9IG5vcm1hbGl6ZUtleShzZWNvbmQpXG5cbiAgICBsZXQgc29ydGVkXG5cbiAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50KChuKSA9PiB7XG4gICAgICBpZiAobi5rZXkgPT09IGZpcnN0KSB7XG4gICAgICAgIHNvcnRlZCA9IHRydWVcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2UgaWYgKG4ua2V5ID09PSBzZWNvbmQpIHtcbiAgICAgICAgc29ydGVkID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzb3J0ZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhIG5vZGUgaGFzIGEgY2hpbGQgYnkgYGtleWAgYW5kIHJldHVybiBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICBhc3NlcnRDaGlsZChrZXkpIHtcbiAgICBjb25zdCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQoa2V5KVxuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAga2V5ID0gbm9ybWFsaXplS2V5KGtleSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYSBjaGlsZCBub2RlIHdpdGgga2V5IFwiJHtrZXl9XCIuYClcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhIG5vZGUgaGFzIGEgZGVzY2VuZGFudCBieSBga2V5YCBhbmQgcmV0dXJuIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIGFzc2VydERlc2NlbmRhbnQoa2V5KSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IHRoaXMuZ2V0RGVzY2VuZGFudChrZXkpXG5cbiAgICBpZiAoIWRlc2NlbmRhbnQpIHtcbiAgICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgZGVzY2VuZGFudCBub2RlIHdpdGgga2V5IFwiJHtrZXl9XCIuYClcbiAgICB9XG5cbiAgICByZXR1cm4gZGVzY2VuZGFudFxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGEgbm9kZSdzIHRyZWUgaGFzIGEgbm9kZSBieSBga2V5YCBhbmQgcmV0dXJuIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIGFzc2VydE5vZGUoa2V5KSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0Tm9kZShrZXkpXG5cbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgbm9kZSB3aXRoIGtleSBcIiR7a2V5fVwiLmApXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhIG5vZGUgZXhpc3RzIGF0IGBwYXRoYCBhbmQgcmV0dXJuIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXRoXG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIGFzc2VydFBhdGgocGF0aCkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSB0aGlzLmdldERlc2NlbmRhbnRBdFBhdGgocGF0aClcblxuICAgIGlmICghZGVzY2VuZGFudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhIGRlc2NlbmRhbnQgYXQgcGF0aCBcIiR7cGF0aH1cIi5gKVxuICAgIH1cblxuICAgIHJldHVybiBkZXNjZW5kYW50XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgZmlsdGVyIGFsbCBkZXNjZW5kYW50IG5vZGVzIHdpdGggYGl0ZXJhdG9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0b3JcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZmlsdGVyRGVzY2VuZGFudHMoaXRlcmF0b3IpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gW11cblxuICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnQoKG5vZGUsIGksIG5vZGVzKSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3Iobm9kZSwgaSwgbm9kZXMpKSBtYXRjaGVzLnB1c2gobm9kZSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIExpc3QobWF0Y2hlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBmaW5kIGFsbCBkZXNjZW5kYW50IG5vZGVzIGJ5IGBpdGVyYXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZmluZERlc2NlbmRhbnQoaXRlcmF0b3IpIHtcbiAgICBsZXQgZm91bmQgPSBudWxsXG5cbiAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50KChub2RlLCBpLCBub2RlcykgPT4ge1xuICAgICAgaWYgKGl0ZXJhdG9yKG5vZGUsIGksIG5vZGVzKSkge1xuICAgICAgICBmb3VuZCA9IG5vZGVcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGl0ZXJhdGUgb3ZlciBhbGwgZGVzY2VuZGFudCBub2RlcyB3aXRoIGBpdGVyYXRvcmAuIElmIHRoZVxuICAgKiBpdGVyYXRvciByZXR1cm5zIGZhbHNlIGl0IHdpbGwgYnJlYWsgdGhlIGxvb3AuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gICAqL1xuXG4gIGZvckVhY2hEZXNjZW5kYW50KGl0ZXJhdG9yKSB7XG4gICAgbGV0IHJldFxuXG4gICAgdGhpcy5ub2Rlcy5mb3JFYWNoKChjaGlsZCwgaSwgbm9kZXMpID0+IHtcbiAgICAgIGlmIChpdGVyYXRvcihjaGlsZCwgaSwgbm9kZXMpID09PSBmYWxzZSkge1xuICAgICAgICByZXQgPSBmYWxzZVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLmtpbmQgIT0gJ3RleHQnKSB7XG4gICAgICAgIHJldCA9IGNoaWxkLmZvckVhY2hEZXNjZW5kYW50KGl0ZXJhdG9yKVxuICAgICAgICByZXR1cm4gcmV0XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiByZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHBhdGggb2YgYW5jZXN0b3JzIG9mIGEgZGVzY2VuZGFudCBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOb2RlfSBrZXlcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPnxOdWxsfVxuICAgKi9cblxuICBnZXRBbmNlc3RvcnMoa2V5KSB7XG4gICAga2V5ID0gbm9ybWFsaXplS2V5KGtleSlcblxuICAgIGlmIChrZXkgPT0gdGhpcy5rZXkpIHJldHVybiBMaXN0KClcbiAgICBpZiAodGhpcy5oYXNDaGlsZChrZXkpKSByZXR1cm4gTGlzdChbdGhpc10pXG5cbiAgICBsZXQgYW5jZXN0b3JzXG4gICAgdGhpcy5ub2Rlcy5maW5kKChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5raW5kID09ICd0ZXh0JykgcmV0dXJuIGZhbHNlXG4gICAgICBhbmNlc3RvcnMgPSBub2RlLmdldEFuY2VzdG9ycyhrZXkpXG4gICAgICByZXR1cm4gYW5jZXN0b3JzXG4gICAgfSlcblxuICAgIGlmIChhbmNlc3RvcnMpIHtcbiAgICAgIHJldHVybiBhbmNlc3RvcnMudW5zaGlmdCh0aGlzKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGxlYWYgYmxvY2sgZGVzY2VuZGFudHMgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge0xpc3Q8Tm9kZT59XG4gICAqL1xuXG4gIGdldEJsb2NrcygpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuZ2V0QmxvY2tzQXNBcnJheSgpXG4gICAgcmV0dXJuIG5ldyBMaXN0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbGVhZiBibG9jayBkZXNjZW5kYW50cyBvZiB0aGUgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0QmxvY2tzQXNBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5yZWR1Y2UoKGFycmF5LCBjaGlsZCkgPT4ge1xuICAgICAgaWYgKGNoaWxkLmtpbmQgIT0gJ2Jsb2NrJykgcmV0dXJuIGFycmF5XG4gICAgICBpZiAoIWNoaWxkLmlzTGVhZkJsb2NrKCkpIHJldHVybiBhcnJheS5jb25jYXQoY2hpbGQuZ2V0QmxvY2tzQXNBcnJheSgpKVxuICAgICAgYXJyYXkucHVzaChjaGlsZClcbiAgICAgIHJldHVybiBhcnJheVxuICAgIH0sIFtdKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbGVhZiBibG9jayBkZXNjZW5kYW50cyBpbiBhIGByYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICAgKiBAcmV0dXJuIHtMaXN0PE5vZGU+fVxuICAgKi9cblxuICBnZXRCbG9ja3NBdFJhbmdlKHJhbmdlKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldEJsb2Nrc0F0UmFuZ2VBc0FycmF5KHJhbmdlKVxuICAgIC8vIEVsaW1pbmF0ZSBkdXBsaWNhdGVzIGJ5IGNvbnZlcnRpbmcgdG8gYW4gYE9yZGVyZWRTZXRgIGZpcnN0LlxuICAgIHJldHVybiBuZXcgTGlzdChuZXcgT3JkZXJlZFNldChhcnJheSkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsZWFmIGJsb2NrIGRlc2NlbmRhbnRzIGluIGEgYHJhbmdlYCBhcyBhbiBhcnJheVxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldEJsb2Nrc0F0UmFuZ2VBc0FycmF5KHJhbmdlKSB7XG4gICAgcmFuZ2UgPSByYW5nZS5ub3JtYWxpemUodGhpcylcbiAgICBpZiAocmFuZ2UuaXNVbnNldCkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCB7IHN0YXJ0S2V5LCBlbmRLZXkgfSA9IHJhbmdlXG4gICAgY29uc3Qgc3RhcnRCbG9jayA9IHRoaXMuZ2V0Q2xvc2VzdEJsb2NrKHN0YXJ0S2V5KVxuXG4gICAgLy8gUEVSRjogdGhlIG1vc3QgY29tbW9uIGNhc2UgaXMgd2hlbiB0aGUgcmFuZ2UgaXMgaW4gYSBzaW5nbGUgYmxvY2sgbm9kZSxcbiAgICAvLyB3aGVyZSB3ZSBjYW4gYXZvaWQgYSBsb3Qgb2YgaXRlcmF0aW5nIG9mIHRoZSB0cmVlLlxuICAgIGlmIChzdGFydEtleSA9PSBlbmRLZXkpIHJldHVybiBbc3RhcnRCbG9ja11cblxuICAgIGNvbnN0IGVuZEJsb2NrID0gdGhpcy5nZXRDbG9zZXN0QmxvY2soZW5kS2V5KVxuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzQXNBcnJheSgpXG4gICAgY29uc3Qgc3RhcnQgPSBibG9ja3MuaW5kZXhPZihzdGFydEJsb2NrKVxuICAgIGNvbnN0IGVuZCA9IGJsb2Nrcy5pbmRleE9mKGVuZEJsb2NrKVxuICAgIHJldHVybiBibG9ja3Muc2xpY2Uoc3RhcnQsIGVuZCArIDEpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBvZiB0aGUgbGVhZiBibG9ja3MgdGhhdCBtYXRjaCBhIGB0eXBlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0QmxvY2tzQnlUeXBlKHR5cGUpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuZ2V0QmxvY2tzQnlUeXBlQXNBcnJheSh0eXBlKVxuICAgIHJldHVybiBuZXcgTGlzdChhcnJheSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIG9mIHRoZSBsZWFmIGJsb2NrcyB0aGF0IG1hdGNoIGEgYHR5cGVgIGFzIGFuIGFycmF5XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBnZXRCbG9ja3NCeVR5cGVBc0FycmF5KHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5yZWR1Y2UoKGFycmF5LCBub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5raW5kICE9ICdibG9jaycpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuaXNMZWFmQmxvY2soKSAmJiBub2RlLnR5cGUgPT0gdHlwZSkge1xuICAgICAgICBhcnJheS5wdXNoKG5vZGUpXG4gICAgICAgIHJldHVybiBhcnJheVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFycmF5LmNvbmNhdChub2RlLmdldEJsb2Nrc0J5VHlwZUFzQXJyYXkodHlwZSkpXG4gICAgICB9XG4gICAgfSwgW10pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBvZiB0aGUgY2hhcmFjdGVycyBmb3IgZXZlcnkgdGV4dCBub2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtMaXN0PENoYXJhY3Rlcj59XG4gICAqL1xuXG4gIGdldENoYXJhY3RlcnMoKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldENoYXJhY3RlcnNBc0FycmF5KClcbiAgICByZXR1cm4gbmV3IExpc3QoYXJyYXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBvZiB0aGUgY2hhcmFjdGVycyBmb3IgZXZlcnkgdGV4dCBub2RlIGFzIGFuIGFycmF5XG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBnZXRDaGFyYWN0ZXJzQXNBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5yZWR1Y2UoKGFyciwgbm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGUua2luZCA9PSAndGV4dCdcbiAgICAgICAgPyBhcnIuY29uY2F0KG5vZGUuY2hhcmFjdGVycy50b0FycmF5KCkpXG4gICAgICAgIDogYXJyLmNvbmNhdChub2RlLmdldENoYXJhY3RlcnNBc0FycmF5KCkpXG4gICAgfSwgW10pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiB0aGUgY2hhcmFjdGVycyBpbiBhIGByYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICAgKiBAcmV0dXJuIHtMaXN0PENoYXJhY3Rlcj59XG4gICAqL1xuXG4gIGdldENoYXJhY3RlcnNBdFJhbmdlKHJhbmdlKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldENoYXJhY3RlcnNBdFJhbmdlQXNBcnJheShyYW5nZSlcbiAgICByZXR1cm4gbmV3IExpc3QoYXJyYXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiB0aGUgY2hhcmFjdGVycyBpbiBhIGByYW5nZWAgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG5cbiAgZ2V0Q2hhcmFjdGVyc0F0UmFuZ2VBc0FycmF5KHJhbmdlKSB7XG4gICAgcmFuZ2UgPSByYW5nZS5ub3JtYWxpemUodGhpcylcbiAgICBpZiAocmFuZ2UuaXNVbnNldCkgcmV0dXJuIFtdXG5cbiAgICByZXR1cm4gdGhpc1xuICAgICAgLmdldFRleHRzQXRSYW5nZShyYW5nZSlcbiAgICAgIC5yZWR1Y2UoKGFyciwgdGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBjaGFycyA9IHRleHQuY2hhcmFjdGVyc1xuICAgICAgICAgIC5maWx0ZXIoKGNoYXIsIGkpID0+IGlzSW5SYW5nZShpLCB0ZXh0LCByYW5nZSkpXG4gICAgICAgICAgLnRvQXJyYXkoKVxuXG4gICAgICAgIHJldHVybiBhcnIuY29uY2F0KGNoYXJzKVxuICAgICAgfSwgW10pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgY2hpbGQgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldENoaWxkKGtleSkge1xuICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgcmV0dXJuIHRoaXMubm9kZXMuZmluZChub2RlID0+IG5vZGUua2V5ID09IGtleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY2xvc2VzdCBwYXJlbnQgb2Ygbm9kZSBieSBga2V5YCB0aGF0IG1hdGNoZXMgYGl0ZXJhdG9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRvclxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldENsb3Nlc3Qoa2V5LCBpdGVyYXRvcikge1xuICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgY29uc3QgYW5jZXN0b3JzID0gdGhpcy5nZXRBbmNlc3RvcnMoa2V5KVxuICAgIGlmICghYW5jZXN0b3JzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgZGVzY2VuZGFudCBub2RlIHdpdGgga2V5IFwiJHtrZXl9XCIuYClcbiAgICB9XG5cbiAgICAvLyBFeGNsdWRlIHRoaXMgbm9kZSBpdHNlbGYuXG4gICAgcmV0dXJuIGFuY2VzdG9ycy5yZXN0KCkuZmluZExhc3QoaXRlcmF0b3IpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IGJsb2NrIHBhcmVudCBvZiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldENsb3Nlc3RCbG9jayhrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDbG9zZXN0KGtleSwgcGFyZW50ID0+IHBhcmVudC5raW5kID09ICdibG9jaycpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IGlubGluZSBwYXJlbnQgb2YgYSBgbm9kZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXRDbG9zZXN0SW5saW5lKGtleSkge1xuICAgIHJldHVybiB0aGlzLmdldENsb3Nlc3Qoa2V5LCBwYXJlbnQgPT4gcGFyZW50LmtpbmQgPT0gJ2lubGluZScpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IHZvaWQgcGFyZW50IG9mIGEgYG5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0Q2xvc2VzdFZvaWQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2xvc2VzdChrZXksIHBhcmVudCA9PiBwYXJlbnQuaXNWb2lkKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29tbW9uIGFuY2VzdG9yIG9mIG5vZGVzIGBvbmVgIGFuZCBgdHdvYCBieSBrZXlzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb25lXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0d29cbiAgICogQHJldHVybiB7Tm9kZX1cbiAgICovXG5cbiAgZ2V0Q29tbW9uQW5jZXN0b3Iob25lLCB0d28pIHtcbiAgICBvbmUgPSBub3JtYWxpemVLZXkob25lKVxuICAgIHR3byA9IG5vcm1hbGl6ZUtleSh0d28pXG5cbiAgICBpZiAob25lID09IHRoaXMua2V5KSByZXR1cm4gdGhpc1xuICAgIGlmICh0d28gPT0gdGhpcy5rZXkpIHJldHVybiB0aGlzXG5cbiAgICB0aGlzLmFzc2VydERlc2NlbmRhbnQob25lKVxuICAgIHRoaXMuYXNzZXJ0RGVzY2VuZGFudCh0d28pXG4gICAgbGV0IGFuY2VzdG9ycyA9IG5ldyBMaXN0KClcbiAgICBsZXQgb25lUGFyZW50ID0gdGhpcy5nZXRQYXJlbnQob25lKVxuICAgIGxldCB0d29QYXJlbnQgPSB0aGlzLmdldFBhcmVudCh0d28pXG5cbiAgICB3aGlsZSAob25lUGFyZW50KSB7XG4gICAgICBhbmNlc3RvcnMgPSBhbmNlc3RvcnMucHVzaChvbmVQYXJlbnQpXG4gICAgICBvbmVQYXJlbnQgPSB0aGlzLmdldFBhcmVudChvbmVQYXJlbnQua2V5KVxuICAgIH1cblxuICAgIHdoaWxlICh0d29QYXJlbnQpIHtcbiAgICAgIGlmIChhbmNlc3RvcnMuaW5jbHVkZXModHdvUGFyZW50KSkgcmV0dXJuIHR3b1BhcmVudFxuICAgICAgdHdvUGFyZW50ID0gdGhpcy5nZXRQYXJlbnQodHdvUGFyZW50LmtleSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb21wb25lbnQgZm9yIHRoZSBub2RlIGZyb20gYSBgc2NoZW1hYC5cbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICAgKiBAcmV0dXJuIHtDb21wb25lbnR8Vm9pZH1cbiAgICovXG5cbiAgZ2V0Q29tcG9uZW50KHNjaGVtYSkge1xuICAgIHJldHVybiBzY2hlbWEuX19nZXRDb21wb25lbnQodGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlY29yYXRpb25zIGZvciB0aGUgbm9kZSBmcm9tIGEgYHNjaGVtYWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hfSBzY2hlbWFcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldERlY29yYXRvcnMoc2NoZW1hKSB7XG4gICAgcmV0dXJuIHNjaGVtYS5fX2dldERlY29yYXRvcnModGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlcHRoIG9mIGEgY2hpbGQgbm9kZSBieSBga2V5YCwgd2l0aCBvcHRpb25hbCBgc3RhcnRBdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0QXQgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGRlcHRoXG4gICAqL1xuXG4gIGdldERlcHRoKGtleSwgc3RhcnRBdCA9IDEpIHtcbiAgICB0aGlzLmFzc2VydERlc2NlbmRhbnQoa2V5KVxuICAgIGlmICh0aGlzLmhhc0NoaWxkKGtleSkpIHJldHVybiBzdGFydEF0XG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5nZXRGdXJ0aGVzdEFuY2VzdG9yKGtleSlcbiAgICAgIC5nZXREZXB0aChrZXksIHN0YXJ0QXQgKyAxKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGRlc2NlbmRhbnQgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldERlc2NlbmRhbnQoa2V5KSB7XG4gICAga2V5ID0gbm9ybWFsaXplS2V5KGtleSlcbiAgICBsZXQgZGVzY2VuZGFudEZvdW5kID0gbnVsbFxuXG4gICAgY29uc3QgZm91bmQgPSB0aGlzLm5vZGVzLmZpbmQoKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlLmtleSA9PT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBub2RlXG4gICAgICB9IGVsc2UgaWYgKG5vZGUua2luZCAhPT0gJ3RleHQnKSB7XG4gICAgICAgIGRlc2NlbmRhbnRGb3VuZCA9IG5vZGUuZ2V0RGVzY2VuZGFudChrZXkpXG4gICAgICAgIHJldHVybiBkZXNjZW5kYW50Rm91bmRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gZGVzY2VuZGFudEZvdW5kIHx8IGZvdW5kXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgZGVzY2VuZGFudCBieSBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBhdGhcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXREZXNjZW5kYW50QXRQYXRoKHBhdGgpIHtcbiAgICBsZXQgZGVzY2VuZGFudCA9IHRoaXNcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5kZXggPSBwYXRoW2ldXG4gICAgICBpZiAoIWRlc2NlbmRhbnQpIHJldHVyblxuICAgICAgaWYgKCFkZXNjZW5kYW50Lm5vZGVzKSByZXR1cm5cbiAgICAgIGRlc2NlbmRhbnQgPSBkZXNjZW5kYW50Lm5vZGVzLmdldChpbmRleClcbiAgICB9XG5cbiAgICByZXR1cm4gZGVzY2VuZGFudFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZGVjb3JhdG9ycyBmb3IgYSBkZXNjZW5kYW50IGJ5IGBrZXlgIGdpdmVuIGEgYHNjaGVtYWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG5cbiAgZ2V0RGVzY2VuZGFudERlY29yYXRvcnMoa2V5LCBzY2hlbWEpIHtcbiAgICBpZiAoIXNjaGVtYS5oYXNEZWNvcmF0b3JzKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBkZXNjZW5kYW50ID0gdGhpcy5hc3NlcnREZXNjZW5kYW50KGtleSlcbiAgICBsZXQgY2hpbGQgPSB0aGlzLmdldEZ1cnRoZXN0QW5jZXN0b3Ioa2V5KVxuICAgIGxldCBkZWNvcmF0b3JzID0gW11cblxuICAgIHdoaWxlIChjaGlsZCAhPSBkZXNjZW5kYW50KSB7XG4gICAgICBkZWNvcmF0b3JzID0gZGVjb3JhdG9ycy5jb25jYXQoY2hpbGQuZ2V0RGVjb3JhdG9ycyhzY2hlbWEpKVxuICAgICAgY2hpbGQgPSBjaGlsZC5nZXRGdXJ0aGVzdEFuY2VzdG9yKGtleSlcbiAgICB9XG5cbiAgICBkZWNvcmF0b3JzID0gZGVjb3JhdG9ycy5jb25jYXQoZGVzY2VuZGFudC5nZXREZWNvcmF0b3JzKHNjaGVtYSkpXG4gICAgcmV0dXJuIGRlY29yYXRvcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZpcnN0IGNoaWxkIHRleHQgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXRGaXJzdFRleHQoKSB7XG4gICAgbGV0IGRlc2NlbmRhbnRGb3VuZCA9IG51bGxcblxuICAgIGNvbnN0IGZvdW5kID0gdGhpcy5ub2Rlcy5maW5kKChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5raW5kID09ICd0ZXh0JykgcmV0dXJuIHRydWVcbiAgICAgIGRlc2NlbmRhbnRGb3VuZCA9IG5vZGUuZ2V0Rmlyc3RUZXh0KClcbiAgICAgIHJldHVybiBkZXNjZW5kYW50Rm91bmRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGRlc2NlbmRhbnRGb3VuZCB8fCBmb3VuZFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGZyYWdtZW50IG9mIHRoZSBub2RlIGF0IGEgYHJhbmdlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTZWxlY3Rpb259IHJhbmdlXG4gICAqIEByZXR1cm4ge0RvY3VtZW50fVxuICAgKi9cblxuICBnZXRGcmFnbWVudEF0UmFuZ2UocmFuZ2UpIHtcbiAgICByYW5nZSA9IHJhbmdlLm5vcm1hbGl6ZSh0aGlzKVxuICAgIGlmIChyYW5nZS5pc1Vuc2V0KSByZXR1cm4gRG9jdW1lbnQuY3JlYXRlKClcblxuICAgIGxldCBub2RlID0gdGhpc1xuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBjaGlsZHJlbiBleGlzdC5cbiAgICBjb25zdCB7IHN0YXJ0S2V5LCBzdGFydE9mZnNldCwgZW5kS2V5LCBlbmRPZmZzZXQgfSA9IHJhbmdlXG4gICAgY29uc3Qgc3RhcnRUZXh0ID0gbm9kZS5hc3NlcnREZXNjZW5kYW50KHN0YXJ0S2V5KVxuICAgIGNvbnN0IGVuZFRleHQgPSBub2RlLmFzc2VydERlc2NlbmRhbnQoZW5kS2V5KVxuXG4gICAgLy8gU3BsaXQgYXQgdGhlIHN0YXJ0IGFuZCBlbmQuXG4gICAgbGV0IGNoaWxkID0gc3RhcnRUZXh0XG4gICAgbGV0IHByZXZpb3VzXG4gICAgbGV0IHBhcmVudFxuXG4gICAgd2hpbGUgKHBhcmVudCA9IG5vZGUuZ2V0UGFyZW50KGNoaWxkLmtleSkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2YoY2hpbGQpXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGNoaWxkLmtpbmQgPT0gJ3RleHQnID8gc3RhcnRPZmZzZXQgOiBjaGlsZC5ub2Rlcy5pbmRleE9mKHByZXZpb3VzKVxuICAgICAgcGFyZW50ID0gcGFyZW50LnNwbGl0Tm9kZShpbmRleCwgcG9zaXRpb24pXG4gICAgICBub2RlID0gbm9kZS51cGRhdGVOb2RlKHBhcmVudClcbiAgICAgIHByZXZpb3VzID0gcGFyZW50Lm5vZGVzLmdldChpbmRleCArIDEpXG4gICAgICBjaGlsZCA9IHBhcmVudFxuICAgIH1cblxuICAgIGNoaWxkID0gZW5kVGV4dFxuXG4gICAgd2hpbGUgKHBhcmVudCA9IG5vZGUuZ2V0UGFyZW50KGNoaWxkLmtleSkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2YoY2hpbGQpXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGNoaWxkLmtpbmQgPT0gJ3RleHQnID8gZW5kT2Zmc2V0IDogY2hpbGQubm9kZXMuaW5kZXhPZihwcmV2aW91cylcbiAgICAgIHBhcmVudCA9IHBhcmVudC5zcGxpdE5vZGUoaW5kZXgsIHBvc2l0aW9uKVxuICAgICAgbm9kZSA9IG5vZGUudXBkYXRlTm9kZShwYXJlbnQpXG4gICAgICBwcmV2aW91cyA9IHBhcmVudC5ub2Rlcy5nZXQoaW5kZXggKyAxKVxuICAgICAgY2hpbGQgPSBwYXJlbnRcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIHN0YXJ0IGFuZCBlbmQgbm9kZXMuXG4gICAgY29uc3QgbmV4dCA9IG5vZGUuZ2V0TmV4dFRleHQoc3RhcnRLZXkpXG4gICAgY29uc3Qgc3RhcnROb2RlID0gbm9kZS5nZXROZXh0U2libGluZyhub2RlLmdldEZ1cnRoZXN0QW5jZXN0b3Ioc3RhcnRLZXkpLmtleSlcbiAgICBjb25zdCBlbmROb2RlID0gc3RhcnRLZXkgPT0gZW5kS2V5XG4gICAgICA/IG5vZGUuZ2V0RnVydGhlc3RBbmNlc3RvcihuZXh0LmtleSlcbiAgICAgIDogbm9kZS5nZXRGdXJ0aGVzdEFuY2VzdG9yKGVuZEtleSlcblxuICAgIC8vIEdldCBjaGlsZHJlbiByYW5nZSBvZiBub2RlcyBmcm9tIHN0YXJ0IHRvIGVuZCBub2Rlc1xuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBub2RlLm5vZGVzLmluZGV4T2Yoc3RhcnROb2RlKVxuICAgIGNvbnN0IGVuZEluZGV4ID0gbm9kZS5ub2Rlcy5pbmRleE9mKGVuZE5vZGUpXG4gICAgY29uc3Qgbm9kZXMgPSBub2RlLm5vZGVzLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4ICsgMSlcblxuICAgIC8vIFJldHVybiBhIG5ldyBkb2N1bWVudCBmcmFnbWVudC5cbiAgICByZXR1cm4gRG9jdW1lbnQuY3JlYXRlKHsgbm9kZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZ1cnRoZXN0IHBhcmVudCBvZiBhIG5vZGUgYnkgYGtleWAgdGhhdCBtYXRjaGVzIGFuIGBpdGVyYXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0b3JcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXRGdXJ0aGVzdChrZXksIGl0ZXJhdG9yKSB7XG4gICAgY29uc3QgYW5jZXN0b3JzID0gdGhpcy5nZXRBbmNlc3RvcnMoa2V5KVxuICAgIGlmICghYW5jZXN0b3JzKSB7XG4gICAgICBrZXkgPSBub3JtYWxpemVLZXkoa2V5KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhIGRlc2NlbmRhbnQgbm9kZSB3aXRoIGtleSBcIiR7a2V5fVwiLmApXG4gICAgfVxuXG4gICAgLy8gRXhjbHVkZSB0aGlzIG5vZGUgaXRzZWxmXG4gICAgcmV0dXJuIGFuY2VzdG9ycy5yZXN0KCkuZmluZChpdGVyYXRvcilcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZ1cnRoZXN0IGJsb2NrIHBhcmVudCBvZiBhIG5vZGUgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXRGdXJ0aGVzdEJsb2NrKGtleSkge1xuICAgIHJldHVybiB0aGlzLmdldEZ1cnRoZXN0KGtleSwgbm9kZSA9PiBub2RlLmtpbmQgPT0gJ2Jsb2NrJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZ1cnRoZXN0IGlubGluZSBwYXJlbnQgb2YgYSBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0RnVydGhlc3RJbmxpbmUoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVydGhlc3Qoa2V5LCBub2RlID0+IG5vZGUua2luZCA9PSAnaW5saW5lJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZ1cnRoZXN0IGFuY2VzdG9yIG9mIGEgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldEZ1cnRoZXN0QW5jZXN0b3Ioa2V5KSB7XG4gICAga2V5ID0gbm9ybWFsaXplS2V5KGtleSlcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5maW5kKChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5rZXkgPT0ga2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgaWYgKG5vZGUua2luZCA9PSAndGV4dCcpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIG5vZGUuaGFzRGVzY2VuZGFudChrZXkpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZ1cnRoZXN0IGFuY2VzdG9yIG9mIGEgbm9kZSBieSBga2V5YCB0aGF0IGhhcyBvbmx5IG9uZSBjaGlsZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldEZ1cnRoZXN0T25seUNoaWxkQW5jZXN0b3Ioa2V5KSB7XG4gICAgY29uc3QgYW5jZXN0b3JzID0gdGhpcy5nZXRBbmNlc3RvcnMoa2V5KVxuXG4gICAgaWYgKCFhbmNlc3RvcnMpIHtcbiAgICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgZGVzY2VuZGFudCBub2RlIHdpdGgga2V5IFwiJHtrZXl9XCIuYClcbiAgICB9XG5cbiAgICByZXR1cm4gYW5jZXN0b3JzXG4gICAgICAvLyBTa2lwIHRoaXMgbm9kZS4uLlxuICAgICAgLnNraXBMYXN0KClcbiAgICAgIC8vIFRha2UgcGFyZW50cyB1bnRpbCB0aGVyZSBhcmUgbW9yZSB0aGFuIG9uZSBjaGlsZC4uLlxuICAgICAgLnJldmVyc2UoKS50YWtlVW50aWwocCA9PiBwLm5vZGVzLnNpemUgPiAxKVxuICAgICAgLy8gQW5kIHBpY2sgdGhlIGhpZ2hlc3QuXG4gICAgICAubGFzdCgpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IGlubGluZSBub2RlcyBmb3IgZWFjaCB0ZXh0IG5vZGUgaW4gdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge0xpc3Q8Tm9kZT59XG4gICAqL1xuXG4gIGdldElubGluZXMoKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldElubGluZXNBc0FycmF5KClcbiAgICByZXR1cm4gbmV3IExpc3QoYXJyYXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IGlubGluZSBub2RlcyBmb3IgZWFjaCB0ZXh0IG5vZGUgaW4gdGhlIG5vZGUsIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtMaXN0PE5vZGU+fVxuICAgKi9cblxuICBnZXRJbmxpbmVzQXNBcnJheSgpIHtcbiAgICBsZXQgYXJyYXkgPSBbXVxuXG4gICAgdGhpcy5ub2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgaWYgKGNoaWxkLmtpbmQgPT0gJ3RleHQnKSByZXR1cm5cbiAgICAgIGlmIChjaGlsZC5pc0xlYWZJbmxpbmUoKSkge1xuICAgICAgICBhcnJheS5wdXNoKGNoaWxkKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXkgPSBhcnJheS5jb25jYXQoY2hpbGQuZ2V0SW5saW5lc0FzQXJyYXkoKSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFycmF5XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IGlubGluZSBub2RlcyBmb3IgZWFjaCB0ZXh0IG5vZGUgaW4gYSBgcmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0SW5saW5lc0F0UmFuZ2UocmFuZ2UpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuZ2V0SW5saW5lc0F0UmFuZ2VBc0FycmF5KHJhbmdlKVxuICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGJ5IGNvbnZlcnRpbmcgaXQgdG8gYW4gYE9yZGVyZWRTZXRgIGZpcnN0LlxuICAgIHJldHVybiBuZXcgTGlzdChuZXcgT3JkZXJlZFNldChhcnJheSkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjbG9zZXN0IGlubGluZSBub2RlcyBmb3IgZWFjaCB0ZXh0IG5vZGUgaW4gYSBgcmFuZ2VgIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldElubGluZXNBdFJhbmdlQXNBcnJheShyYW5nZSkge1xuICAgIHJhbmdlID0gcmFuZ2Uubm9ybWFsaXplKHRoaXMpXG4gICAgaWYgKHJhbmdlLmlzVW5zZXQpIHJldHVybiBbXVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5nZXRUZXh0c0F0UmFuZ2VBc0FycmF5KHJhbmdlKVxuICAgICAgLm1hcCh0ZXh0ID0+IHRoaXMuZ2V0Q2xvc2VzdElubGluZSh0ZXh0LmtleSkpXG4gICAgICAuZmlsdGVyKGV4aXN0cyA9PiBleGlzdHMpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBvZiB0aGUgbGVhZiBpbmxpbmUgbm9kZXMgdGhhdCBtYXRjaCBhIGB0eXBlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0SW5saW5lc0J5VHlwZSh0eXBlKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldElubGluZXNCeVR5cGVBc0FycmF5KHR5cGUpXG4gICAgcmV0dXJuIG5ldyBMaXN0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgb2YgdGhlIGxlYWYgaW5saW5lIG5vZGVzIHRoYXQgbWF0Y2ggYSBgdHlwZWAgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBnZXRJbmxpbmVzQnlUeXBlQXNBcnJheSh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXMucmVkdWNlKChpbmxpbmVzLCBub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5raW5kID09ICd0ZXh0Jykge1xuICAgICAgICByZXR1cm4gaW5saW5lc1xuICAgICAgfSBlbHNlIGlmIChub2RlLmlzTGVhZklubGluZSgpICYmIG5vZGUudHlwZSA9PSB0eXBlKSB7XG4gICAgICAgIGlubGluZXMucHVzaChub2RlKVxuICAgICAgICByZXR1cm4gaW5saW5lc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlubGluZXMuY29uY2F0KG5vZGUuZ2V0SW5saW5lc0J5VHlwZUFzQXJyYXkodHlwZSkpXG4gICAgICB9XG4gICAgfSwgW10pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgc2V0IG9mIGFsbCBrZXlzIGluIHRoZSBub2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTZXQ8U3RyaW5nPn1cbiAgICovXG5cbiAgZ2V0S2V5cygpIHtcbiAgICBjb25zdCBrZXlzID0gW11cblxuICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnQoKGRlc2MpID0+IHtcbiAgICAgIGtleXMucHVzaChkZXNjLmtleSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIG5ldyBTZXQoa2V5cylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGxhc3QgY2hpbGQgdGV4dCBub2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldExhc3RUZXh0KCkge1xuICAgIGxldCBkZXNjZW5kYW50Rm91bmQgPSBudWxsXG5cbiAgICBjb25zdCBmb3VuZCA9IHRoaXMubm9kZXMuZmluZExhc3QoKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlLmtpbmQgPT0gJ3RleHQnKSByZXR1cm4gdHJ1ZVxuICAgICAgZGVzY2VuZGFudEZvdW5kID0gbm9kZS5nZXRMYXN0VGV4dCgpXG4gICAgICByZXR1cm4gZGVzY2VuZGFudEZvdW5kXG4gICAgfSlcblxuICAgIHJldHVybiBkZXNjZW5kYW50Rm91bmQgfHwgZm91bmRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIG9mIHRoZSBtYXJrcyBmb3IgYWxsIG9mIHRoZSBjaGFyYWN0ZXJzIG9mIGV2ZXJ5IHRleHQgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7U2V0PE1hcms+fVxuICAgKi9cblxuICBnZXRNYXJrcygpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuZ2V0TWFya3NBc0FycmF5KClcbiAgICByZXR1cm4gbmV3IFNldChhcnJheSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIG9mIHRoZSBtYXJrcyBmb3IgYWxsIG9mIHRoZSBjaGFyYWN0ZXJzIG9mIGV2ZXJ5IHRleHQgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7T3JkZXJlZFNldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0T3JkZXJlZE1hcmtzKCkge1xuICAgIGNvbnN0IGFycmF5ID0gdGhpcy5nZXRNYXJrc0FzQXJyYXkoKVxuICAgIHJldHVybiBuZXcgT3JkZXJlZFNldChhcnJheSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIG9mIHRoZSBtYXJrcyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldE1hcmtzQXNBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5yZWR1Y2UoKG1hcmtzLCBub2RlKSA9PiB7XG4gICAgICByZXR1cm4gbWFya3MuY29uY2F0KG5vZGUuZ2V0TWFya3NBc0FycmF5KCkpXG4gICAgfSwgW10pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgc2V0IG9mIHRoZSBtYXJrcyBpbiBhIGByYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICAgKiBAcmV0dXJuIHtTZXQ8TWFyaz59XG4gICAqL1xuXG4gIGdldE1hcmtzQXRSYW5nZShyYW5nZSkge1xuICAgIGNvbnN0IGFycmF5ID0gdGhpcy5nZXRNYXJrc0F0UmFuZ2VBc0FycmF5KHJhbmdlKVxuICAgIHJldHVybiBuZXcgU2V0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHNldCBvZiB0aGUgbWFya3MgaW4gYSBgcmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7T3JkZXJlZFNldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0T3JkZXJlZE1hcmtzQXRSYW5nZShyYW5nZSkge1xuICAgIGNvbnN0IGFycmF5ID0gdGhpcy5nZXRNYXJrc0F0UmFuZ2VBc0FycmF5KHJhbmdlKVxuICAgIHJldHVybiBuZXcgT3JkZXJlZFNldChhcnJheSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzZXQgb2YgdGhlIGFjdGl2ZSBtYXJrcyBpbiBhIGByYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICAgKiBAcmV0dXJuIHtTZXQ8TWFyaz59XG4gICAqL1xuXG4gIGdldEFjdGl2ZU1hcmtzQXRSYW5nZShyYW5nZSkge1xuICAgIGNvbnN0IGFycmF5ID0gdGhpcy5nZXRBY3RpdmVNYXJrc0F0UmFuZ2VBc0FycmF5KHJhbmdlKVxuICAgIHJldHVybiBuZXcgU2V0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHNldCBvZiB0aGUgbWFya3MgaW4gYSBgcmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldE1hcmtzQXRSYW5nZUFzQXJyYXkocmFuZ2UpIHtcbiAgICByYW5nZSA9IHJhbmdlLm5vcm1hbGl6ZSh0aGlzKVxuICAgIGlmIChyYW5nZS5pc1Vuc2V0KSByZXR1cm4gW11cblxuICAgIGNvbnN0IHsgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0IH0gPSByYW5nZVxuXG4gICAgLy8gSWYgdGhlIHJhbmdlIGlzIGNvbGxhcHNlZCBhdCB0aGUgc3RhcnQgb2YgdGhlIG5vZGUsIGNoZWNrIHRoZSBwcmV2aW91cy5cbiAgICBpZiAocmFuZ2UuaXNDb2xsYXBzZWQgJiYgc3RhcnRPZmZzZXQgPT0gMCkge1xuICAgICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLmdldFByZXZpb3VzVGV4dChzdGFydEtleSlcbiAgICAgIGlmICghcHJldmlvdXMgfHwgcHJldmlvdXMudGV4dC5sZW5ndGggPT0gMCkgcmV0dXJuIFtdXG4gICAgICBjb25zdCBjaGFyID0gcHJldmlvdXMuY2hhcmFjdGVycy5nZXQocHJldmlvdXMudGV4dC5sZW5ndGggLSAxKVxuICAgICAgcmV0dXJuIGNoYXIubWFya3MudG9BcnJheSgpXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHJhbmdlIGlzIGNvbGxhcHNlZCwgY2hlY2sgdGhlIGNoYXJhY3RlciBiZWZvcmUgdGhlIHN0YXJ0LlxuICAgIGlmIChyYW5nZS5pc0NvbGxhcHNlZCkge1xuICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZ2V0RGVzY2VuZGFudChzdGFydEtleSlcbiAgICAgIGNvbnN0IGNoYXIgPSB0ZXh0LmNoYXJhY3RlcnMuZ2V0KHJhbmdlLnN0YXJ0T2Zmc2V0IC0gMSlcbiAgICAgIHJldHVybiBjaGFyLm1hcmtzLnRvQXJyYXkoKVxuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgZ2V0IGEgc2V0IG9mIHRoZSBtYXJrcyBmb3IgZWFjaCBjaGFyYWN0ZXIgaW4gdGhlIHJhbmdlLlxuICAgIHJldHVybiB0aGlzXG4gICAgICAuZ2V0Q2hhcmFjdGVyc0F0UmFuZ2UocmFuZ2UpXG4gICAgICAucmVkdWNlKChtZW1vLCBjaGFyKSA9PiB7XG4gICAgICAgIGNoYXIubWFya3MudG9BcnJheSgpLmZvckVhY2goYyA9PiBtZW1vLnB1c2goYykpXG4gICAgICAgIHJldHVybiBtZW1vXG4gICAgICB9LCBbXSlcbiAgfVxuXG4gIGdldEFjdGl2ZU1hcmtzQXRSYW5nZUFzQXJyYXkocmFuZ2UpIHtcbiAgICByYW5nZSA9IHJhbmdlLm5vcm1hbGl6ZSh0aGlzKVxuICAgIGlmIChyYW5nZS5pc1Vuc2V0KSByZXR1cm4gW11cblxuICAgIGNvbnN0IHsgc3RhcnRLZXksIHN0YXJ0T2Zmc2V0IH0gPSByYW5nZVxuXG4gICAgLy8gSWYgdGhlIHJhbmdlIGlzIGNvbGxhcHNlZCBhdCB0aGUgc3RhcnQgb2YgdGhlIG5vZGUsIGNoZWNrIHRoZSBwcmV2aW91cy5cbiAgICBpZiAocmFuZ2UuaXNDb2xsYXBzZWQgJiYgc3RhcnRPZmZzZXQgPT0gMCkge1xuICAgICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLmdldFByZXZpb3VzVGV4dChzdGFydEtleSlcbiAgICAgIGlmICghcHJldmlvdXMgfHwgIXByZXZpb3VzLmxlbmd0aCkgcmV0dXJuIFtdXG4gICAgICBjb25zdCBjaGFyID0gcHJldmlvdXMuY2hhcmFjdGVycy5nZXQocHJldmlvdXMubGVuZ3RoIC0gMSlcbiAgICAgIHJldHVybiBjaGFyLm1hcmtzLnRvQXJyYXkoKVxuICAgIH1cblxuICAgIC8vIElmIHRoZSByYW5nZSBpcyBjb2xsYXBzZWQsIGNoZWNrIHRoZSBjaGFyYWN0ZXIgYmVmb3JlIHRoZSBzdGFydC5cbiAgICBpZiAocmFuZ2UuaXNDb2xsYXBzZWQpIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmdldERlc2NlbmRhbnQoc3RhcnRLZXkpXG4gICAgICBjb25zdCBjaGFyID0gdGV4dC5jaGFyYWN0ZXJzLmdldChyYW5nZS5zdGFydE9mZnNldCAtIDEpXG4gICAgICByZXR1cm4gY2hhci5tYXJrcy50b0FycmF5KClcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGdldCBhIHNldCBvZiB0aGUgbWFya3MgZm9yIGVhY2ggY2hhcmFjdGVyIGluIHRoZSByYW5nZS5cbiAgICBjb25zdCBjaGFycyA9IHRoaXMuZ2V0Q2hhcmFjdGVyc0F0UmFuZ2UocmFuZ2UpXG4gICAgY29uc3QgZmlyc3QgPSBjaGFycy5maXJzdCgpXG4gICAgbGV0IG1lbW8gPSBmaXJzdC5tYXJrc1xuICAgIGNoYXJzLnNsaWNlKDEpLmZvckVhY2goKGNoYXIpID0+IHtcbiAgICAgIG1lbW8gPSBtZW1vLmludGVyc2VjdChjaGFyLm1hcmtzKVxuICAgICAgcmV0dXJuIG1lbW8uc2l6ZSAhPSAwXG4gICAgfSlcbiAgICByZXR1cm4gbWVtby50b0FycmF5KClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIG9mIHRoZSBtYXJrcyB0aGF0IG1hdGNoIGEgYHR5cGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICAgKiBAcmV0dXJuIHtTZXQ8TWFyaz59XG4gICAqL1xuXG4gIGdldE1hcmtzQnlUeXBlKHR5cGUpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuZ2V0TWFya3NCeVR5cGVBc0FycmF5KHR5cGUpXG4gICAgcmV0dXJuIG5ldyBTZXQoYXJyYXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBvZiB0aGUgbWFya3MgdGhhdCBtYXRjaCBhIGB0eXBlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAgICogQHJldHVybiB7T3JkZXJlZFNldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0T3JkZXJlZE1hcmtzQnlUeXBlKHR5cGUpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuZ2V0TWFya3NCeVR5cGVBc0FycmF5KHR5cGUpXG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkU2V0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgb2YgdGhlIG1hcmtzIHRoYXQgbWF0Y2ggYSBgdHlwZWAgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBnZXRNYXJrc0J5VHlwZUFzQXJyYXkodHlwZSkge1xuICAgIHJldHVybiB0aGlzLm5vZGVzLnJlZHVjZSgoYXJyYXksIG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBub2RlLmtpbmQgPT0gJ3RleHQnXG4gICAgICAgID8gYXJyYXkuY29uY2F0KG5vZGUuZ2V0TWFya3NBc0FycmF5KCkuZmlsdGVyKG0gPT4gbS50eXBlID09IHR5cGUpKVxuICAgICAgICA6IGFycmF5LmNvbmNhdChub2RlLmdldE1hcmtzQnlUeXBlQXNBcnJheSh0eXBlKSlcbiAgICB9LCBbXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJsb2NrIG5vZGUgYmVmb3JlIGEgZGVzY2VuZGFudCB0ZXh0IG5vZGUgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXROZXh0QmxvY2soa2V5KSB7XG4gICAgY29uc3QgY2hpbGQgPSB0aGlzLmFzc2VydERlc2NlbmRhbnQoa2V5KVxuICAgIGxldCBsYXN0XG5cbiAgICBpZiAoY2hpbGQua2luZCA9PSAnYmxvY2snKSB7XG4gICAgICBsYXN0ID0gY2hpbGQuZ2V0TGFzdFRleHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBibG9jayA9IHRoaXMuZ2V0Q2xvc2VzdEJsb2NrKGtleSlcbiAgICAgIGxhc3QgPSBibG9jay5nZXRMYXN0VGV4dCgpXG4gICAgfVxuXG4gICAgY29uc3QgbmV4dCA9IHRoaXMuZ2V0TmV4dFRleHQobGFzdC5rZXkpXG4gICAgaWYgKCFuZXh0KSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2xvc2VzdEJsb2NrKG5leHQua2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbm9kZSBhZnRlciBhIGRlc2NlbmRhbnQgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXROZXh0U2libGluZyhrZXkpIHtcbiAgICBrZXkgPSBub3JtYWxpemVLZXkoa2V5KVxuXG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoa2V5KVxuICAgIGNvbnN0IGFmdGVyID0gcGFyZW50Lm5vZGVzXG4gICAgICAuc2tpcFVudGlsKGNoaWxkID0+IGNoaWxkLmtleSA9PSBrZXkpXG5cbiAgICBpZiAoYWZ0ZXIuc2l6ZSA9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgY2hpbGQgbm9kZSB3aXRoIGtleSBcIiR7a2V5fVwiLmApXG4gICAgfVxuICAgIHJldHVybiBhZnRlci5nZXQoMSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRleHQgbm9kZSBhZnRlciBhIGRlc2NlbmRhbnQgdGV4dCBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0TmV4dFRleHQoa2V5KSB7XG4gICAga2V5ID0gbm9ybWFsaXplS2V5KGtleSlcbiAgICByZXR1cm4gdGhpcy5nZXRUZXh0cygpXG4gICAgICAuc2tpcFVudGlsKHRleHQgPT4gdGV4dC5rZXkgPT0ga2V5KVxuICAgICAgLmdldCgxKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5vZGUgaW4gdGhlIHRyZWUgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXROb2RlKGtleSkge1xuICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgcmV0dXJuIHRoaXMua2V5ID09IGtleSA/IHRoaXMgOiB0aGlzLmdldERlc2NlbmRhbnQoa2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5vZGUgaW4gdGhlIHRyZWUgYnkgYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXRoXG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0Tm9kZUF0UGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGgubGVuZ3RoID8gdGhpcy5nZXREZXNjZW5kYW50QXRQYXRoKHBhdGgpIDogdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgb2Zmc2V0IGZvciBhIGRlc2NlbmRhbnQgdGV4dCBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG5cbiAgZ2V0T2Zmc2V0KGtleSkge1xuICAgIHRoaXMuYXNzZXJ0RGVzY2VuZGFudChrZXkpXG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIG9mZnNldCBvZiB0aGUgbm9kZXMgYmVmb3JlIHRoZSBoaWdoZXN0IGNoaWxkLlxuICAgIGNvbnN0IGNoaWxkID0gdGhpcy5nZXRGdXJ0aGVzdEFuY2VzdG9yKGtleSlcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLm5vZGVzXG4gICAgICAudGFrZVVudGlsKG4gPT4gbiA9PSBjaGlsZClcbiAgICAgIC5yZWR1Y2UoKG1lbW8sIG4pID0+IG1lbW8gKyBuLnRleHQubGVuZ3RoLCAwKVxuXG4gICAgLy8gUmVjdXJzZSBpZiBuZWVkIGJlLlxuICAgIHJldHVybiB0aGlzLmhhc0NoaWxkKGtleSlcbiAgICAgID8gb2Zmc2V0XG4gICAgICA6IG9mZnNldCArIGNoaWxkLmdldE9mZnNldChrZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBvZmZzZXQgZnJvbSBhIGByYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSByYW5nZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuXG4gIGdldE9mZnNldEF0UmFuZ2UocmFuZ2UpIHtcbiAgICByYW5nZSA9IHJhbmdlLm5vcm1hbGl6ZSh0aGlzKVxuXG4gICAgaWYgKHJhbmdlLmlzVW5zZXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHJhbmdlIGNhbm5vdCBiZSB1bnNldCB0byBjYWxjdWxjYXRlIGl0cyBvZmZzZXQuJylcbiAgICB9XG5cbiAgICBpZiAocmFuZ2UuaXNFeHBhbmRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcmFuZ2UgbXVzdCBiZSBjb2xsYXBzZWQgdG8gY2FsY3VsY2F0ZSBpdHMgb2Zmc2V0LicpXG4gICAgfVxuXG4gICAgY29uc3QgeyBzdGFydEtleSwgc3RhcnRPZmZzZXQgfSA9IHJhbmdlXG4gICAgcmV0dXJuIHRoaXMuZ2V0T2Zmc2V0KHN0YXJ0S2V5KSArIHN0YXJ0T2Zmc2V0XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwYXJlbnQgb2YgYSBjaGlsZCBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0UGFyZW50KGtleSkge1xuICAgIGlmICh0aGlzLmhhc0NoaWxkKGtleSkpIHJldHVybiB0aGlzXG5cbiAgICBsZXQgbm9kZSA9IG51bGxcblxuICAgIHRoaXMubm9kZXMuZmluZCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZC5raW5kID09ICd0ZXh0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUgPSBjaGlsZC5nZXRQYXJlbnQoa2V5KVxuICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcGF0aCBvZiBhIGRlc2NlbmRhbnQgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8Tm9kZX0ga2V5XG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBnZXRQYXRoKGtleSkge1xuICAgIGxldCBjaGlsZCA9IHRoaXMuYXNzZXJ0Tm9kZShrZXkpXG4gICAgY29uc3QgYW5jZXN0b3JzID0gdGhpcy5nZXRBbmNlc3RvcnMoa2V5KVxuICAgIGNvbnN0IHBhdGggPSBbXVxuXG4gICAgYW5jZXN0b3JzLnJldmVyc2UoKS5mb3JFYWNoKChhbmNlc3RvcikgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBhbmNlc3Rvci5ub2Rlcy5pbmRleE9mKGNoaWxkKVxuICAgICAgcGF0aC51bnNoaWZ0KGluZGV4KVxuICAgICAgY2hpbGQgPSBhbmNlc3RvclxuICAgIH0pXG5cbiAgICByZXR1cm4gcGF0aFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYmxvY2sgbm9kZSBiZWZvcmUgYSBkZXNjZW5kYW50IHRleHQgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldFByZXZpb3VzQmxvY2soa2V5KSB7XG4gICAgY29uc3QgY2hpbGQgPSB0aGlzLmFzc2VydERlc2NlbmRhbnQoa2V5KVxuICAgIGxldCBmaXJzdFxuXG4gICAgaWYgKGNoaWxkLmtpbmQgPT0gJ2Jsb2NrJykge1xuICAgICAgZmlyc3QgPSBjaGlsZC5nZXRGaXJzdFRleHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBibG9jayA9IHRoaXMuZ2V0Q2xvc2VzdEJsb2NrKGtleSlcbiAgICAgIGZpcnN0ID0gYmxvY2suZ2V0Rmlyc3RUZXh0KClcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuZ2V0UHJldmlvdXNUZXh0KGZpcnN0LmtleSlcbiAgICBpZiAoIXByZXZpb3VzKSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2xvc2VzdEJsb2NrKHByZXZpb3VzLmtleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5vZGUgYmVmb3JlIGEgZGVzY2VuZGFudCBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0UHJldmlvdXNTaWJsaW5nKGtleSkge1xuICAgIGtleSA9IG5vcm1hbGl6ZUtleShrZXkpXG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoa2V5KVxuICAgIGNvbnN0IGJlZm9yZSA9IHBhcmVudC5ub2Rlc1xuICAgICAgLnRha2VVbnRpbChjaGlsZCA9PiBjaGlsZC5rZXkgPT0ga2V5KVxuXG4gICAgaWYgKGJlZm9yZS5zaXplID09IHBhcmVudC5ub2Rlcy5zaXplKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGEgY2hpbGQgbm9kZSB3aXRoIGtleSBcIiR7a2V5fVwiLmApXG4gICAgfVxuXG4gICAgcmV0dXJuIGJlZm9yZS5sYXN0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRleHQgbm9kZSBiZWZvcmUgYSBkZXNjZW5kYW50IHRleHQgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldFByZXZpb3VzVGV4dChrZXkpIHtcbiAgICBrZXkgPSBub3JtYWxpemVLZXkoa2V5KVxuICAgIHJldHVybiB0aGlzLmdldFRleHRzKClcbiAgICAgIC50YWtlVW50aWwodGV4dCA9PiB0ZXh0LmtleSA9PSBrZXkpXG4gICAgICAubGFzdCgpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb25jYXRlbmF0ZWQgdGV4dCBzdHJpbmcgb2YgYWxsIGNoaWxkIG5vZGVzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldFRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXMucmVkdWNlKChzdHJpbmcsIG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBzdHJpbmcgKyBub2RlLnRleHRcbiAgICB9LCAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlc2NlbmRlbnQgdGV4dCBub2RlIGF0IGFuIGBvZmZzZXRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb2Zmc2V0XG4gICAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAgICovXG5cbiAgZ2V0VGV4dEF0T2Zmc2V0KG9mZnNldCkge1xuICAgIC8vIFBFUkY6IEFkZCBhIGZldyBzaG9ydGN1dHMgZm9yIHRoZSBvYnZpb3VzIGNhc2VzLlxuICAgIGlmIChvZmZzZXQgPT0gMCkgcmV0dXJuIHRoaXMuZ2V0Rmlyc3RUZXh0KClcbiAgICBpZiAob2Zmc2V0ID09IHRoaXMudGV4dC5sZW5ndGgpIHJldHVybiB0aGlzLmdldExhc3RUZXh0KClcbiAgICBpZiAob2Zmc2V0IDwgMCB8fCBvZmZzZXQgPiB0aGlzLnRleHQubGVuZ3RoKSByZXR1cm4gbnVsbFxuXG4gICAgbGV0IGxlbmd0aCA9IDBcblxuICAgIHJldHVybiB0aGlzXG4gICAgICAuZ2V0VGV4dHMoKVxuICAgICAgLmZpbmQoKG5vZGUsIGksIG5vZGVzKSA9PiB7XG4gICAgICAgIGxlbmd0aCArPSBub2RlLnRleHQubGVuZ3RoXG4gICAgICAgIHJldHVybiBsZW5ndGggPiBvZmZzZXRcbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBkaXJlY3Rpb24gb2YgdGhlIG5vZGUncyB0ZXh0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldFRleHREaXJlY3Rpb24oKSB7XG4gICAgY29uc3QgZGlyID0gZGlyZWN0aW9uKHRoaXMudGV4dClcbiAgICByZXR1cm4gZGlyID09ICduZXV0cmFsJyA/IHVuZGVmaW5lZCA6IGRpclxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGdldCBhbGwgb2YgdGhlIGNoaWxkIHRleHQgbm9kZXMgaW4gb3JkZXIgb2YgYXBwZWFyYW5jZS5cbiAgICpcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0VGV4dHMoKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldFRleHRzQXNBcnJheSgpXG4gICAgcmV0dXJuIG5ldyBMaXN0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGdldCBhbGwgdGhlIGxlYWYgdGV4dCBub2RlcyBpbiBvcmRlciBvZiBhcHBlYXJhbmNlLCBhcyBhcnJheS5cbiAgICpcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0VGV4dHNBc0FycmF5KCkge1xuICAgIGxldCBhcnJheSA9IFtdXG5cbiAgICB0aGlzLm5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlLmtpbmQgPT0gJ3RleHQnKSB7XG4gICAgICAgIGFycmF5LnB1c2gobm9kZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5ID0gYXJyYXkuY29uY2F0KG5vZGUuZ2V0VGV4dHNBc0FycmF5KCkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcnJheVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgb2YgdGhlIHRleHQgbm9kZXMgaW4gYSBgcmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7TGlzdDxOb2RlPn1cbiAgICovXG5cbiAgZ2V0VGV4dHNBdFJhbmdlKHJhbmdlKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldFRleHRzQXRSYW5nZUFzQXJyYXkocmFuZ2UpXG4gICAgcmV0dXJuIG5ldyBMaXN0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgb2YgdGhlIHRleHQgbm9kZXMgaW4gYSBgcmFuZ2VgIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldFRleHRzQXRSYW5nZUFzQXJyYXkocmFuZ2UpIHtcbiAgICByYW5nZSA9IHJhbmdlLm5vcm1hbGl6ZSh0aGlzKVxuICAgIGlmIChyYW5nZS5pc1Vuc2V0KSByZXR1cm4gW11cblxuICAgIGNvbnN0IHsgc3RhcnRLZXksIGVuZEtleSB9ID0gcmFuZ2VcbiAgICBjb25zdCBzdGFydFRleHQgPSB0aGlzLmdldERlc2NlbmRhbnQoc3RhcnRLZXkpXG5cbiAgICAvLyBQRVJGOiB0aGUgbW9zdCBjb21tb24gY2FzZSBpcyB3aGVuIHRoZSByYW5nZSBpcyBpbiBhIHNpbmdsZSB0ZXh0IG5vZGUsXG4gICAgLy8gd2hlcmUgd2UgY2FuIGF2b2lkIGEgbG90IG9mIGl0ZXJhdGluZyBvZiB0aGUgdHJlZS5cbiAgICBpZiAoc3RhcnRLZXkgPT0gZW5kS2V5KSByZXR1cm4gW3N0YXJ0VGV4dF1cblxuICAgIGNvbnN0IGVuZFRleHQgPSB0aGlzLmdldERlc2NlbmRhbnQoZW5kS2V5KVxuICAgIGNvbnN0IHRleHRzID0gdGhpcy5nZXRUZXh0c0FzQXJyYXkoKVxuICAgIGNvbnN0IHN0YXJ0ID0gdGV4dHMuaW5kZXhPZihzdGFydFRleHQpXG4gICAgY29uc3QgZW5kID0gdGV4dHMuaW5kZXhPZihlbmRUZXh0KVxuICAgIHJldHVybiB0ZXh0cy5zbGljZShzdGFydCwgZW5kICsgMSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGNoaWxkIG5vZGUgZXhpc3RzIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGhhc0NoaWxkKGtleSkge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0Q2hpbGQoa2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGNoZWNrIGlmIGEgY2hpbGQgbm9kZSBleGlzdHMgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgaGFzRGVzY2VuZGFudChrZXkpIHtcbiAgICByZXR1cm4gISF0aGlzLmdldERlc2NlbmRhbnQoa2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGNoZWNrIGlmIGEgbm9kZSBleGlzdHMgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgaGFzTm9kZShrZXkpIHtcbiAgICByZXR1cm4gISF0aGlzLmdldE5vZGUoa2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgbm9kZSBoYXMgYSB2b2lkIHBhcmVudCBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBoYXNWb2lkUGFyZW50KGtleSkge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0Q2xvc2VzdChrZXksIHBhcmVudCA9PiBwYXJlbnQuaXNWb2lkKVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIGBub2RlYCBhdCBgaW5kZXhgLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIGluc2VydE5vZGUoaW5kZXgsIG5vZGUpIHtcbiAgICBjb25zdCBrZXlzID0gdGhpcy5nZXRLZXlzKClcblxuICAgIGlmIChrZXlzLmNvbnRhaW5zKG5vZGUua2V5KSkge1xuICAgICAgbm9kZSA9IG5vZGUucmVnZW5lcmF0ZUtleSgpXG4gICAgfVxuXG4gICAgaWYgKG5vZGUua2luZCAhPSAndGV4dCcpIHtcbiAgICAgIG5vZGUgPSBub2RlLm1hcERlc2NlbmRhbnRzKChkZXNjKSA9PiB7XG4gICAgICAgIHJldHVybiBrZXlzLmNvbnRhaW5zKGRlc2Mua2V5KVxuICAgICAgICAgID8gZGVzYy5yZWdlbmVyYXRlS2V5KClcbiAgICAgICAgICA6IGRlc2NcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLm5vZGVzLmluc2VydChpbmRleCwgbm9kZSlcbiAgICByZXR1cm4gdGhpcy5zZXQoJ25vZGVzJywgbm9kZXMpXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgbm9kZSBpcyBhIGxlYWYgYmxvY2suXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGlzTGVhZkJsb2NrKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmtpbmQgPT0gJ2Jsb2NrJyAmJlxuICAgICAgdGhpcy5ub2Rlcy5ldmVyeShuID0+IG4ua2luZCAhPSAnYmxvY2snKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBub2RlIGlzIGEgbGVhZiBpbmxpbmUuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGlzTGVhZklubGluZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5raW5kID09ICdpbmxpbmUnICYmXG4gICAgICB0aGlzLm5vZGVzLmV2ZXJ5KG4gPT4gbi5raW5kICE9ICdpbmxpbmUnKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSBhIGNoaWxkcmVuIG5vZGUgYGZpcnN0YCB3aXRoIGFub3RoZXIgY2hpbGRyZW4gbm9kZSBgc2Vjb25kYC5cbiAgICogYGZpcnN0YCBhbmQgYHNlY29uZGAgd2lsbCBiZSBjb25jYXRlbmF0ZWQgaW4gdGhhdCBvcmRlci5cbiAgICogYGZpcnN0YCBhbmQgYHNlY29uZGAgbXVzdCBiZSB0d28gTm9kZXMgb3IgdHdvIFRleHQuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZmlyc3RcbiAgICogQHBhcmFtIHtOb2RlfSBzZWNvbmRcbiAgICogQHJldHVybiB7Tm9kZX1cbiAgICovXG5cbiAgbWVyZ2VOb2RlKHdpdGhJbmRleCwgaW5kZXgpIHtcbiAgICBsZXQgbm9kZSA9IHRoaXNcbiAgICBsZXQgb25lID0gbm9kZS5ub2Rlcy5nZXQod2l0aEluZGV4KVxuICAgIGNvbnN0IHR3byA9IG5vZGUubm9kZXMuZ2V0KGluZGV4KVxuXG4gICAgaWYgKG9uZS5raW5kICE9IHR3by5raW5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyaWVkIHRvIG1lcmdlIHR3byBub2RlcyBvZiBkaWZmZXJlbnQga2luZHM6IFwiJHtvbmUua2luZH1cIiBhbmQgXCIke3R3by5raW5kfVwiLmApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG5vZGVzIGFyZSB0ZXh0IG5vZGVzLCBjb25jYXRlbmF0ZSB0aGVpciBjaGFyYWN0ZXJzIHRvZ2V0aGVyLlxuICAgIGlmIChvbmUua2luZCA9PSAndGV4dCcpIHtcbiAgICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBvbmUuY2hhcmFjdGVycy5jb25jYXQodHdvLmNoYXJhY3RlcnMpXG4gICAgICBvbmUgPSBvbmUuc2V0KCdjaGFyYWN0ZXJzJywgY2hhcmFjdGVycylcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGNvbmNhdGVuYXRlIHRoZWlyIGNoaWxkIG5vZGVzIHRvZ2V0aGVyLlxuICAgIGVsc2Uge1xuICAgICAgY29uc3Qgbm9kZXMgPSBvbmUubm9kZXMuY29uY2F0KHR3by5ub2RlcylcbiAgICAgIG9uZSA9IG9uZS5zZXQoJ25vZGVzJywgbm9kZXMpXG4gICAgfVxuXG4gICAgbm9kZSA9IG5vZGUucmVtb3ZlTm9kZShpbmRleClcbiAgICBub2RlID0gbm9kZS5yZW1vdmVOb2RlKHdpdGhJbmRleClcbiAgICBub2RlID0gbm9kZS5pbnNlcnROb2RlKHdpdGhJbmRleCwgb25lKVxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICAvKipcbiAgICogTWFwIGFsbCBjaGlsZCBub2RlcywgdXBkYXRpbmcgdGhlbSBpbiB0aGVpciBwYXJlbnRzLiBUaGlzIG1ldGhvZCBpc1xuICAgKiBvcHRpbWl6ZWQgdG8gbm90IHJldHVybiBhIG5ldyBub2RlIGlmIG5vIGNoYW5nZXMgYXJlIG1hZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIG1hcENoaWxkcmVuKGl0ZXJhdG9yKSB7XG4gICAgbGV0IHsgbm9kZXMgfSA9IHRoaXNcblxuICAgIG5vZGVzLmZvckVhY2goKG5vZGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IHJldCA9IGl0ZXJhdG9yKG5vZGUsIGksIHRoaXMubm9kZXMpXG4gICAgICBpZiAocmV0ICE9IG5vZGUpIG5vZGVzID0gbm9kZXMuc2V0KHJldC5rZXksIHJldClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMuc2V0KCdub2RlcycsIG5vZGVzKVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcCBhbGwgZGVzY2VuZGFudCBub2RlcywgdXBkYXRpbmcgdGhlbSBpbiB0aGVpciBwYXJlbnRzLiBUaGlzIG1ldGhvZCBpc1xuICAgKiBvcHRpbWl6ZWQgdG8gbm90IHJldHVybiBhIG5ldyBub2RlIGlmIG5vIGNoYW5nZXMgYXJlIG1hZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIG1hcERlc2NlbmRhbnRzKGl0ZXJhdG9yKSB7XG4gICAgbGV0IHsgbm9kZXMgfSA9IHRoaXNcblxuICAgIG5vZGVzLmZvckVhY2goKG5vZGUsIGkpID0+IHtcbiAgICAgIGxldCByZXQgPSBub2RlXG4gICAgICBpZiAocmV0LmtpbmQgIT0gJ3RleHQnKSByZXQgPSByZXQubWFwRGVzY2VuZGFudHMoaXRlcmF0b3IpXG4gICAgICByZXQgPSBpdGVyYXRvcihyZXQsIGksIHRoaXMubm9kZXMpXG4gICAgICBpZiAocmV0ID09IG5vZGUpIHJldHVyblxuXG4gICAgICBjb25zdCBpbmRleCA9IG5vZGVzLmluZGV4T2Yobm9kZSlcbiAgICAgIG5vZGVzID0gbm9kZXMuc2V0KGluZGV4LCByZXQpXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLnNldCgnbm9kZXMnLCBub2RlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdlbmVyYXRlIHRoZSBub2RlJ3Mga2V5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICByZWdlbmVyYXRlS2V5KCkge1xuICAgIGNvbnN0IGtleSA9IGdlbmVyYXRlS2V5KClcbiAgICByZXR1cm4gdGhpcy5zZXQoJ2tleScsIGtleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBgbm9kZWAgZnJvbSB0aGUgY2hpbGRyZW4gbm9kZSBtYXAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZX1cbiAgICovXG5cbiAgcmVtb3ZlRGVzY2VuZGFudChrZXkpIHtcbiAgICBrZXkgPSBub3JtYWxpemVLZXkoa2V5KVxuXG4gICAgbGV0IG5vZGUgPSB0aGlzXG4gICAgbGV0IHBhcmVudCA9IG5vZGUuZ2V0UGFyZW50KGtleSlcbiAgICBpZiAoIXBhcmVudCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhIGRlc2NlbmRhbnQgbm9kZSB3aXRoIGtleSBcIiR7a2V5fVwiLmApXG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5ub2Rlcy5maW5kSW5kZXgobiA9PiBuLmtleSA9PT0ga2V5KVxuICAgIGNvbnN0IG5vZGVzID0gcGFyZW50Lm5vZGVzLnNwbGljZShpbmRleCwgMSlcblxuICAgIHBhcmVudCA9IHBhcmVudC5zZXQoJ25vZGVzJywgbm9kZXMpXG4gICAgbm9kZSA9IG5vZGUudXBkYXRlTm9kZShwYXJlbnQpXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBub2RlIGF0IGBpbmRleGAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICByZW1vdmVOb2RlKGluZGV4KSB7XG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSlcbiAgICByZXR1cm4gdGhpcy5zZXQoJ25vZGVzJywgbm9kZXMpXG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgYSBjaGlsZCBub2RlIGJ5IGBpbmRleGAgYXQgYHBvc2l0aW9uYC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvblxuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICBzcGxpdE5vZGUoaW5kZXgsIHBvc2l0aW9uKSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzXG4gICAgY29uc3QgY2hpbGQgPSBub2RlLm5vZGVzLmdldChpbmRleClcbiAgICBsZXQgb25lXG4gICAgbGV0IHR3b1xuXG4gICAgLy8gSWYgdGhlIGNoaWxkIGlzIGEgdGV4dCBub2RlLCB0aGUgYHBvc2l0aW9uYCByZWZlcnMgdG8gdGhlIHRleHQgb2Zmc2V0IGF0XG4gICAgLy8gd2hpY2ggdG8gc3BsaXQgaXQuXG4gICAgaWYgKGNoaWxkLmtpbmQgPT0gJ3RleHQnKSB7XG4gICAgICBjb25zdCBiZWZvcmVzID0gY2hpbGQuY2hhcmFjdGVycy50YWtlKHBvc2l0aW9uKVxuICAgICAgY29uc3QgYWZ0ZXJzID0gY2hpbGQuY2hhcmFjdGVycy5za2lwKHBvc2l0aW9uKVxuICAgICAgb25lID0gY2hpbGQuc2V0KCdjaGFyYWN0ZXJzJywgYmVmb3JlcylcbiAgICAgIHR3byA9IGNoaWxkLnNldCgnY2hhcmFjdGVycycsIGFmdGVycykucmVnZW5lcmF0ZUtleSgpXG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgY2hpbGQgaXMgbm90IGEgdGV4dCBub2RlLCB0aGUgYHBvc2l0aW9uYCByZWZlcnMgdG8gdGhlXG4gICAgLy8gaW5kZXggYXQgd2hpY2ggdG8gc3BsaXQgaXRzIGNoaWxkcmVuLlxuICAgIGVsc2Uge1xuICAgICAgY29uc3QgYmVmb3JlcyA9IGNoaWxkLm5vZGVzLnRha2UocG9zaXRpb24pXG4gICAgICBjb25zdCBhZnRlcnMgPSBjaGlsZC5ub2Rlcy5za2lwKHBvc2l0aW9uKVxuICAgICAgb25lID0gY2hpbGQuc2V0KCdub2RlcycsIGJlZm9yZXMpXG4gICAgICB0d28gPSBjaGlsZC5zZXQoJ25vZGVzJywgYWZ0ZXJzKS5yZWdlbmVyYXRlS2V5KClcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIG9sZCBub2RlIGFuZCBpbnNlcnQgdGhlIG5ld2x5IHNwbGl0IGNoaWxkcmVuLlxuICAgIG5vZGUgPSBub2RlLnJlbW92ZU5vZGUoaW5kZXgpXG4gICAgbm9kZSA9IG5vZGUuaW5zZXJ0Tm9kZShpbmRleCwgdHdvKVxuICAgIG5vZGUgPSBub2RlLmluc2VydE5vZGUoaW5kZXgsIG9uZSlcbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhIG5ldyB2YWx1ZSBmb3IgYSBjaGlsZCBub2RlIGJ5IGBrZXlgLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICogQHJldHVybiB7Tm9kZX1cbiAgICovXG5cbiAgdXBkYXRlTm9kZShub2RlKSB7XG4gICAgaWYgKG5vZGUua2V5ID09IHRoaXMua2V5KSB7XG4gICAgICByZXR1cm4gbm9kZVxuICAgIH1cblxuICAgIGxldCBjaGlsZCA9IHRoaXMuYXNzZXJ0RGVzY2VuZGFudChub2RlLmtleSlcbiAgICBjb25zdCBhbmNlc3RvcnMgPSB0aGlzLmdldEFuY2VzdG9ycyhub2RlLmtleSlcblxuICAgIGFuY2VzdG9ycy5yZXZlcnNlKCkuZm9yRWFjaCgocGFyZW50KSA9PiB7XG4gICAgICBsZXQgeyBub2RlcyB9ID0gcGFyZW50XG4gICAgICBjb25zdCBpbmRleCA9IG5vZGVzLmluZGV4T2YoY2hpbGQpXG4gICAgICBjaGlsZCA9IHBhcmVudFxuICAgICAgbm9kZXMgPSBub2Rlcy5zZXQoaW5kZXgsIG5vZGUpXG4gICAgICBwYXJlbnQgPSBwYXJlbnQuc2V0KCdub2RlcycsIG5vZGVzKVxuICAgICAgbm9kZSA9IHBhcmVudFxuICAgIH0pXG5cbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBub2RlIGFnYWluc3QgYSBgc2NoZW1hYC5cbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICAgKiBAcmV0dXJuIHtPYmplY3R8TnVsbH1cbiAgICovXG5cbiAgdmFsaWRhdGUoc2NoZW1hKSB7XG4gICAgcmV0dXJuIHNjaGVtYS5fX3ZhbGlkYXRlKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgbm9kZSBoYXMgYm90aCBkZXNjZW5kYW50cyBpbiB0aGF0IG9yZGVyLCBmYWxzZSBvdGhlcndpc2UuIFRoZVxuICAgKiBvcmRlciBpcyBkZXB0aC1maXJzdCwgcG9zdC1vcmRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpcnN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWNvbmRcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgYXJlRGVzY2VuZGFudFNvcnRlZChmaXJzdCwgc2Vjb25kKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xOS4wJywgJ1RoZSBOb2RlLmFyZURlc2NlbmRhbnRTb3J0ZWQoZmlyc3QsIHNlY29uZCkgbWV0aG9kIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYE5vZGUuYXJlRGVzY2VuZGFudHNTb3J0ZWQoZmlyc3QsIHNlY29uZCkgaW5zdGVhZC4nKVxuICAgIHJldHVybiB0aGlzLmFyZURlc2NlbmRhbnRzU29ydGVkKGZpcnN0LCBzZWNvbmQpXG4gIH1cblxuICAvKipcbiAgICogQ29uY2F0IGNoaWxkcmVuIGBub2Rlc2Agb24gdG8gdGhlIGVuZCBvZiB0aGUgbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtMaXN0PE5vZGU+fSBub2Rlc1xuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICBjb25jYXRDaGlsZHJlbihub2Rlcykge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTkuMCcsICdUaGUgYE5vZGUuY29uY2F0Q2hpbGRyZW4obm9kZXMpYCBtZXRob2QgaXMgZGVwcmVjYXRlZC4nKVxuICAgIG5vZGVzID0gdGhpcy5ub2Rlcy5jb25jYXQobm9kZXMpXG4gICAgcmV0dXJuIHRoaXMuc2V0KCdub2RlcycsIG5vZGVzKVxuICB9XG5cbiAgLyoqXG4gICAqIERlY29yYXRlIGFsbCBvZiB0aGUgdGV4dCBub2RlcyB3aXRoIGEgYGRlY29yYXRvcmAgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGRlY29yYXRvclxuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cblxuICBkZWNvcmF0ZVRleHRzKGRlY29yYXRvcikge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTkuMCcsICdUaGUgYE5vZGUuZGVjb3JhdGVUZXh0cyhkZWNvcmF0b3IpIG1ldGhvZCBpcyBkZXByZWNhdGVkLicpXG4gICAgcmV0dXJuIHRoaXMubWFwRGVzY2VuZGFudHMoKGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGQua2luZCA9PSAndGV4dCdcbiAgICAgICAgPyBjaGlsZC5kZWNvcmF0ZUNoYXJhY3RlcnMoZGVjb3JhdG9yKVxuICAgICAgICA6IGNoaWxkXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBmaWx0ZXIgYWxsIGRlc2NlbmRhbnQgbm9kZXMgd2l0aCBgaXRlcmF0b3JgLCBkZXB0aC1maXJzdC5cbiAgICogSXQgaXMgZGlmZmVyZW50IGZyb20gYGZpbHRlckRlc2NlbmRhbnRzYCBpbiByZWdhcmQgb2YgdGhlIG9yZGVyIG9mIHJlc3VsdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gICAqIEByZXR1cm4ge0xpc3Q8Tm9kZT59XG4gICAqL1xuXG4gIGZpbHRlckRlc2NlbmRhbnRzRGVlcChpdGVyYXRvcikge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTkuMCcsICdUaGUgTm9kZS5maWx0ZXJEZXNjZW5kYW50c0RlZXAoaXRlcmF0b3IpIG1ldGhvZCBpcyBkZXByZWNhdGVkLicpXG4gICAgcmV0dXJuIHRoaXMubm9kZXMucmVkdWNlKChtYXRjaGVzLCBjaGlsZCwgaSwgbm9kZXMpID0+IHtcbiAgICAgIGlmIChjaGlsZC5raW5kICE9ICd0ZXh0JykgbWF0Y2hlcyA9IG1hdGNoZXMuY29uY2F0KGNoaWxkLmZpbHRlckRlc2NlbmRhbnRzRGVlcChpdGVyYXRvcikpXG4gICAgICBpZiAoaXRlcmF0b3IoY2hpbGQsIGksIG5vZGVzKSkgbWF0Y2hlcyA9IG1hdGNoZXMucHVzaChjaGlsZClcbiAgICAgIHJldHVybiBtYXRjaGVzXG4gICAgfSwgbmV3IExpc3QoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBmaW5kIGFsbCBkZXNjZW5kYW50IG5vZGVzIGJ5IGBpdGVyYXRvcmAuIERlcHRoIGZpcnN0LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRvclxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGZpbmREZXNjZW5kYW50RGVlcChpdGVyYXRvcikge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTkuMCcsICdUaGUgTm9kZS5maW5kRGVzY2VuZGFudERlZXAoaXRlcmF0b3IpIG1ldGhvZCBpcyBkZXByZWNhdGVkLicpXG4gICAgbGV0IGZvdW5kXG5cbiAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50KChub2RlKSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3Iobm9kZSkpIHtcbiAgICAgICAgZm91bmQgPSBub2RlXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY2hpbGRyZW4gYmV0d2VlbiB0d28gY2hpbGQga2V5cy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXJ0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbmRcbiAgICogQHJldHVybiB7Tm9kZX1cbiAgICovXG5cbiAgZ2V0Q2hpbGRyZW5CZXR3ZWVuKHN0YXJ0LCBlbmQpIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE5LjAnLCAnVGhlIGBOb2RlLmdldENoaWxkcmVuQmV0d2VlbihzdGFydCwgZW5kKWAgbWV0aG9kIGlzIGRlcHJlY2F0ZWQuJylcbiAgICBzdGFydCA9IHRoaXMuYXNzZXJ0Q2hpbGQoc3RhcnQpXG4gICAgc3RhcnQgPSB0aGlzLm5vZGVzLmluZGV4T2Yoc3RhcnQpXG4gICAgZW5kID0gdGhpcy5hc3NlcnRDaGlsZChlbmQpXG4gICAgZW5kID0gdGhpcy5ub2Rlcy5pbmRleE9mKGVuZClcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5zbGljZShzdGFydCArIDEsIGVuZClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY2hpbGRyZW4gYmV0d2VlbiB0d28gY2hpbGQga2V5cywgaW5jbHVkaW5nIHRoZSB0d28gY2hpbGRyZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdGFydFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW5kXG4gICAqIEByZXR1cm4ge05vZGV9XG4gICAqL1xuXG4gIGdldENoaWxkcmVuQmV0d2VlbkluY2x1ZGluZyhzdGFydCwgZW5kKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xOS4wJywgJ1RoZSBgTm9kZS5nZXRDaGlsZHJlbkJldHdlZW5JbmNsdWRpbmcoc3RhcnQsIGVuZClgIG1ldGhvZCBpcyBkZXByZWNhdGVkLicpXG4gICAgc3RhcnQgPSB0aGlzLmFzc2VydENoaWxkKHN0YXJ0KVxuICAgIHN0YXJ0ID0gdGhpcy5ub2Rlcy5pbmRleE9mKHN0YXJ0KVxuICAgIGVuZCA9IHRoaXMuYXNzZXJ0Q2hpbGQoZW5kKVxuICAgIGVuZCA9IHRoaXMubm9kZXMuaW5kZXhPZihlbmQpXG4gICAgcmV0dXJuIHRoaXMubm9kZXMuc2xpY2Uoc3RhcnQsIGVuZCArIDEpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBoaWdoZXN0IGNoaWxkIGFuY2VzdG9yIG9mIGEgbm9kZSBieSBga2V5YC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldEhpZ2hlc3RDaGlsZChrZXkpIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE5LjAnLCAnVGhlIGBOb2RlLmdldEhpZ2hlc3RDaGlsZChrZXkpIG1ldGhvZCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBOb2RlLmdldEZ1cnRoZXN0QW5jZXN0b3Ioa2V5KSBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVydGhlc3RBbmNlc3RvcihrZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBoaWdoZXN0IHBhcmVudCBvZiBhIG5vZGUgYnkgYGtleWAgd2hpY2ggaGFzIGFuIG9ubHkgY2hpbGQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICAgKi9cblxuICBnZXRIaWdoZXN0T25seUNoaWxkUGFyZW50KGtleSkge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTkuMCcsICdUaGUgYE5vZGUuZ2V0SGlnaGVzdE9ubHlDaGlsZFBhcmVudChrZXkpYCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgTm9kZS5nZXRGdXJ0aGVzdE9ubHlDaGlsZEFuY2VzdG9yYCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVydGhlc3RPbmx5Q2hpbGRBbmNlc3RvcihrZXkpXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGlubGluZSBub2RlcyBhcmUgc3BsaXQgYXQgYSBgcmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gcmFuZ2VcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgaXNJbmxpbmVTcGxpdEF0UmFuZ2UocmFuZ2UpIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE5LjAnLCAnVGhlIGBOb2RlLmlzSW5saW5lU3BsaXRBdFJhbmdlKHJhbmdlKWAgbWV0aG9kIGlzIGRlcHJlY2F0ZWQuJylcbiAgICByYW5nZSA9IHJhbmdlLm5vcm1hbGl6ZSh0aGlzKVxuICAgIGlmIChyYW5nZS5pc0V4cGFuZGVkKSB0aHJvdyBuZXcgRXJyb3IoKVxuXG4gICAgY29uc3QgeyBzdGFydEtleSB9ID0gcmFuZ2VcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuZ2V0RnVydGhlc3RJbmxpbmUoc3RhcnRLZXkpIHx8IHRoaXMuZ2V0RGVzY2VuZGFudChzdGFydEtleSlcbiAgICByZXR1cm4gcmFuZ2UuaXNBdFN0YXJ0T2Yoc3RhcnQpIHx8IHJhbmdlLmlzQXRFbmRPZihzdGFydClcbiAgfVxuXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEga2V5IGFyZ3VtZW50IGB2YWx1ZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZX0gdmFsdWVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVLZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykgcmV0dXJuIHZhbHVlXG5cbiAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNC4wJywgJ0FuIG9iamVjdCB3YXMgcGFzc2VkIHRvIGEgTm9kZSBtZXRob2QgaW5zdGVhZCBvZiBhIGBrZXlgIHN0cmluZy4gVGhpcyB3YXMgcHJldmlvdXNseSBzdXBwb3J0ZWQsIGJ1dCBpcyBiZWluZyBkZXByZWNhdGVkIGJlY2F1c2UgaXQgY2FuIGhhdmUgYSBuZWdhdGl2ZSBpbXBhY3Qgb24gcGVyZm9ybWFuY2UuIFRoZSBvYmplY3QgaW4gcXVlc3Rpb24gd2FzOicsIHZhbHVlKVxuXG4gIGlmIChOb2RlLmlzTm9kZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUua2V5XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgXFxga2V5XFxgIGFyZ3VtZW50ISBJdCBtdXN0IGJlIGVpdGhlciBhIGJsb2NrLCBhbiBpbmxpbmUsIGEgdGV4dCwgb3IgYSBzdHJpbmcuIFlvdSBwYXNzZWQ6ICR7dmFsdWV9YClcbn1cblxuLyoqXG4gKiBNZW1vaXplIHJlYWQgbWV0aG9kcy5cbiAqL1xuXG5tZW1vaXplKE5vZGUucHJvdG90eXBlLCBbXG4gICdnZXRCbG9ja3MnLFxuICAnZ2V0QmxvY2tzQXNBcnJheScsXG4gICdnZXRDaGFyYWN0ZXJzJyxcbiAgJ2dldENoYXJhY3RlcnNBc0FycmF5JyxcbiAgJ2dldEZpcnN0VGV4dCcsXG4gICdnZXRJbmxpbmVzJyxcbiAgJ2dldElubGluZXNBc0FycmF5JyxcbiAgJ2dldEtleXMnLFxuICAnZ2V0TGFzdFRleHQnLFxuICAnZ2V0TWFya3MnLFxuICAnZ2V0T3JkZXJlZE1hcmtzJyxcbiAgJ2dldE1hcmtzQXNBcnJheScsXG4gICdnZXRUZXh0JyxcbiAgJ2dldFRleHREaXJlY3Rpb24nLFxuICAnZ2V0VGV4dHMnLFxuICAnZ2V0VGV4dHNBc0FycmF5JyxcbiAgJ2lzTGVhZkJsb2NrJyxcbiAgJ2lzTGVhZklubGluZScsXG5dLCB7XG4gIHRha2VzQXJndW1lbnRzOiBmYWxzZVxufSlcblxubWVtb2l6ZShOb2RlLnByb3RvdHlwZSwgW1xuICAnYXJlRGVzY2VuZGFudHNTb3J0ZWQnLFxuICAnZ2V0QWN0aXZlTWFya3NBdFJhbmdlJyxcbiAgJ2dldEFjdGl2ZU1hcmtzQXRSYW5nZUFzQXJyYXknLFxuICAnZ2V0QW5jZXN0b3JzJyxcbiAgJ2dldEJsb2Nrc0F0UmFuZ2UnLFxuICAnZ2V0QmxvY2tzQXRSYW5nZUFzQXJyYXknLFxuICAnZ2V0QmxvY2tzQnlUeXBlJyxcbiAgJ2dldEJsb2Nrc0J5VHlwZUFzQXJyYXknLFxuICAnZ2V0Q2hhcmFjdGVyc0F0UmFuZ2UnLFxuICAnZ2V0Q2hhcmFjdGVyc0F0UmFuZ2VBc0FycmF5JyxcbiAgJ2dldENoaWxkJyxcbiAgJ2dldENoaWxkcmVuQmV0d2VlbicsXG4gICdnZXRDaGlsZHJlbkJldHdlZW5JbmNsdWRpbmcnLFxuICAnZ2V0Q2xvc2VzdEJsb2NrJyxcbiAgJ2dldENsb3Nlc3RJbmxpbmUnLFxuICAnZ2V0Q2xvc2VzdFZvaWQnLFxuICAnZ2V0Q29tbW9uQW5jZXN0b3InLFxuICAnZ2V0Q29tcG9uZW50JyxcbiAgJ2dldERlY29yYXRvcnMnLFxuICAnZ2V0RGVwdGgnLFxuICAnZ2V0RGVzY2VuZGFudCcsXG4gICdnZXREZXNjZW5kYW50QXRQYXRoJyxcbiAgJ2dldERlc2NlbmRhbnREZWNvcmF0b3JzJyxcbiAgJ2dldEZyYWdtZW50QXRSYW5nZScsXG4gICdnZXRGdXJ0aGVzdEJsb2NrJyxcbiAgJ2dldEZ1cnRoZXN0SW5saW5lJyxcbiAgJ2dldEZ1cnRoZXN0QW5jZXN0b3InLFxuICAnZ2V0RnVydGhlc3RPbmx5Q2hpbGRBbmNlc3RvcicsXG4gICdnZXRJbmxpbmVzQXRSYW5nZScsXG4gICdnZXRJbmxpbmVzQXRSYW5nZUFzQXJyYXknLFxuICAnZ2V0SW5saW5lc0J5VHlwZScsXG4gICdnZXRJbmxpbmVzQnlUeXBlQXNBcnJheScsXG4gICdnZXRNYXJrc0F0UmFuZ2UnLFxuICAnZ2V0T3JkZXJlZE1hcmtzQXRSYW5nZScsXG4gICdnZXRNYXJrc0F0UmFuZ2VBc0FycmF5JyxcbiAgJ2dldE1hcmtzQnlUeXBlJyxcbiAgJ2dldE9yZGVyZWRNYXJrc0J5VHlwZScsXG4gICdnZXRNYXJrc0J5VHlwZUFzQXJyYXknLFxuICAnZ2V0TmV4dEJsb2NrJyxcbiAgJ2dldE5leHRTaWJsaW5nJyxcbiAgJ2dldE5leHRUZXh0JyxcbiAgJ2dldE5vZGUnLFxuICAnZ2V0Tm9kZUF0UGF0aCcsXG4gICdnZXRPZmZzZXQnLFxuICAnZ2V0T2Zmc2V0QXRSYW5nZScsXG4gICdnZXRQYXJlbnQnLFxuICAnZ2V0UGF0aCcsXG4gICdnZXRQcmV2aW91c0Jsb2NrJyxcbiAgJ2dldFByZXZpb3VzU2libGluZycsXG4gICdnZXRQcmV2aW91c1RleHQnLFxuICAnZ2V0VGV4dEF0T2Zmc2V0JyxcbiAgJ2dldFRleHRzQXRSYW5nZScsXG4gICdnZXRUZXh0c0F0UmFuZ2VBc0FycmF5JyxcbiAgJ2hhc0NoaWxkJyxcbiAgJ2hhc0Rlc2NlbmRhbnQnLFxuICAnaGFzTm9kZScsXG4gICdoYXNWb2lkUGFyZW50JyxcbiAgJ2lzSW5saW5lU3BsaXRBdFJhbmdlJyxcbiAgJ3ZhbGlkYXRlJyxcbl0sIHtcbiAgdGFrZXNBcmd1bWVudHM6IHRydWVcbn0pXG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVxuIl19