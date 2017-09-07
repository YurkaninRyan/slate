'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _block = require('../models/block');

var _block2 = _interopRequireDefault(_block);

var _character = require('../models/character');

var _character2 = _interopRequireDefault(_character);

var _document = require('../models/document');

var _document2 = _interopRequireDefault(_document);

var _inline = require('../models/inline');

var _inline2 = _interopRequireDefault(_inline);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _node = require('../models/node');

var _node2 = _interopRequireDefault(_node);

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

var _state = require('../models/state');

var _state2 = _interopRequireDefault(_state);

var _text = require('../models/text');

var _text2 = _interopRequireDefault(_text);

var _isEmpty = require('is-empty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Raw.
 *
 * @type {Object}
 */

var Raw = {

  /**
   * Deserialize a JSON `object`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserialize: function deserialize(object, options) {
    var state = Raw.deserializeState(object, options);
    return state;
  },


  /**
   * Deserialize a JSON `object` representing a `Block`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Block}
   */

  deserializeBlock: function deserializeBlock(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.terse) object = Raw.untersifyBlock(object);

    var nodes = _node2.default.createList(object.nodes.map(function (node) {
      return Raw.deserializeNode(node, options);
    }));
    var block = _block2.default.create({
      key: object.key,
      type: object.type,
      data: object.data,
      isVoid: object.isVoid,
      nodes: nodes
    });

    return block;
  },


  /**
   * Deserialize a JSON `object` representing a `Document`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Document}
   */

  deserializeDocument: function deserializeDocument(object, options) {
    var nodes = object.nodes.map(function (node) {
      return Raw.deserializeNode(node, options);
    });
    var document = _document2.default.create({
      key: object.key,
      data: object.data,
      nodes: nodes
    });

    return document;
  },


  /**
   * Deserialize a JSON `object` representing an `Inline`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Inline}
   */

  deserializeInline: function deserializeInline(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.terse) object = Raw.untersifyInline(object);

    var nodes = object.nodes.map(function (node) {
      return Raw.deserializeNode(node, options);
    });
    var inline = _inline2.default.create({
      key: object.key,
      type: object.type,
      data: object.data,
      isVoid: object.isVoid,
      nodes: nodes
    });

    return inline;
  },


  /**
   * Deserialize a JSON `object` representing a `Mark`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Mark}
   */

  deserializeMark: function deserializeMark(object, options) {
    var mark = _mark2.default.create(object);
    return mark;
  },


  /**
   * Deserialize a JSON object representing a `Node`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Node}
   */

  deserializeNode: function deserializeNode(object, options) {
    switch (object.kind) {
      case 'block':
        return Raw.deserializeBlock(object, options);
      case 'document':
        return Raw.deserializeDocument(object, options);
      case 'inline':
        return Raw.deserializeInline(object, options);
      case 'text':
        return Raw.deserializeText(object, options);
      default:
        {
          throw new Error('Unrecognized node kind "' + object.kind + '".');
        }
    }
  },


  /**
   * Deserialize a JSON `object` representing a `Range`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {List<Character>}
   */

  deserializeRange: function deserializeRange(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.terse) object = Raw.untersifyRange(object);
    var marks = _mark2.default.createSet(object.marks.map(function (mark) {
      return Raw.deserializeMark(mark, options);
    }));
    var chars = object.text.split('');
    var characters = _character2.default.createList(chars.map(function (text) {
      return { text: text, marks: marks };
    }));
    return characters;
  },


  /**
   * Deserialize a JSON `object` representing a `Selection`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserializeSelection: function deserializeSelection(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var selection = _selection2.default.create({
      anchorKey: object.anchorKey,
      anchorOffset: object.anchorOffset,
      focusKey: object.focusKey,
      focusOffset: object.focusOffset,
      isFocused: object.isFocused
    });

    return selection;
  },


  /**
   * Deserialize a JSON `object` representing a `State`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserializeState: function deserializeState(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.terse) object = Raw.untersifyState(object);

    var document = Raw.deserializeDocument(object.document, options);
    var selection = void 0;

    if (object.selection != null) {
      selection = Raw.deserializeSelection(object.selection, options);
    }

    return _state2.default.create({ data: object.data, document: document, selection: selection }, options);
  },


  /**
   * Deserialize a JSON `object` representing a `Text`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Text}
   */

  deserializeText: function deserializeText(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.terse) object = Raw.untersifyText(object);

    var characters = object.ranges.reduce(function (list, range) {
      return list.concat(Raw.deserializeRange(range, options));
    }, _character2.default.createList());

    var text = _text2.default.create({
      key: object.key,
      characters: characters
    });

    return text;
  },


  /**
   * Serialize a `model`.
   *
   * @param {Mixed} model
   * @param {Object} options (optional)
   * @return {Object}
   */

  serialize: function serialize(model, options) {
    var raw = Raw.serializeState(model, options);
    return raw;
  },


  /**
   * Serialize a `block` node.
   *
   * @param {Block} block
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeBlock: function serializeBlock(block) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      data: block.data.toJSON(),
      key: block.key,
      kind: block.kind,
      isVoid: block.isVoid,
      type: block.type,
      nodes: block.nodes.toArray().map(function (node) {
        return Raw.serializeNode(node, options);
      })
    };

    if (!options.preserveKeys) {
      delete object.key;
    }

    return options.terse ? Raw.tersifyBlock(object) : object;
  },


  /**
   * Serialize a `document`.
   *
   * @param {Document} document
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeDocument: function serializeDocument(document) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      data: document.data.toJSON(),
      key: document.key,
      kind: document.kind,
      nodes: document.nodes.toArray().map(function (node) {
        return Raw.serializeNode(node, options);
      })
    };

    if (!options.preserveKeys) {
      delete object.key;
    }

    return options.terse ? Raw.tersifyDocument(object) : object;
  },


  /**
   * Serialize an `inline` node.
   *
   * @param {Inline} inline
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeInline: function serializeInline(inline) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      data: inline.data.toJSON(),
      key: inline.key,
      kind: inline.kind,
      isVoid: inline.isVoid,
      type: inline.type,
      nodes: inline.nodes.toArray().map(function (node) {
        return Raw.serializeNode(node, options);
      })
    };

    if (!options.preserveKeys) {
      delete object.key;
    }

    return options.terse ? Raw.tersifyInline(object) : object;
  },


  /**
   * Serialize a `mark`.
   *
   * @param {Mark} mark
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeMark: function serializeMark(mark) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      data: mark.data.toJSON(),
      kind: mark.kind,
      type: mark.type
    };

    return options.terse ? Raw.tersifyMark(object) : object;
  },


  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeNode: function serializeNode(node, options) {
    switch (node.kind) {
      case 'block':
        return Raw.serializeBlock(node, options);
      case 'document':
        return Raw.serializeDocument(node, options);
      case 'inline':
        return Raw.serializeInline(node, options);
      case 'text':
        return Raw.serializeText(node, options);
      default:
        {
          throw new Error('Unrecognized node kind "' + node.kind + '".');
        }
    }
  },


  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeRange: function serializeRange(range) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      kind: range.kind,
      text: range.text,
      marks: range.marks.toArray().map(function (mark) {
        return Raw.serializeMark(mark, options);
      })
    };

    return options.terse ? Raw.tersifyRange(object) : object;
  },


  /**
   * Serialize a `selection`.
   *
   * @param {Selection} selection
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeSelection: function serializeSelection(selection) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      kind: selection.kind,
      anchorKey: selection.anchorKey,
      anchorOffset: selection.anchorOffset,
      focusKey: selection.focusKey,
      focusOffset: selection.focusOffset,
      isBackward: selection.isBackward,
      isFocused: selection.isFocused
    };

    return options.terse ? Raw.tersifySelection(object) : object;
  },


  /**
   * Serialize a `state`.
   *
   * @param {State} state
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeState: function serializeState(state) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      document: Raw.serializeDocument(state.document, options),
      kind: state.kind
    };

    if (options.preserveSelection) {
      object.selection = Raw.serializeSelection(state.selection, options);
    }

    if (options.preserveStateData) {
      object.data = state.data.toJSON();
    }

    var ret = options.terse ? Raw.tersifyState(object) : object;

    return ret;
  },


  /**
   * Serialize a `text` node.
   *
   * @param {Text} text
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeText: function serializeText(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var object = {
      key: text.key,
      kind: text.kind,
      ranges: text.getRanges().toArray().map(function (range) {
        return Raw.serializeRange(range, options);
      })
    };

    if (!options.preserveKeys) {
      delete object.key;
    }

    return options.terse ? Raw.tersifyText(object) : object;
  },


  /**
   * Create a terse representation of a block `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyBlock: function tersifyBlock(object) {
    var ret = {};
    ret.kind = object.kind;
    ret.type = object.type;
    if (object.key) ret.key = object.key;
    if (!object.isVoid) ret.nodes = object.nodes;
    if (object.isVoid) ret.isVoid = object.isVoid;
    if (!(0, _isEmpty2.default)(object.data)) ret.data = object.data;
    return ret;
  },


  /**
   * Create a terse representation of a document `object.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyDocument: function tersifyDocument(object) {
    var ret = {};
    ret.nodes = object.nodes;
    if (object.key) ret.key = object.key;
    if (!(0, _isEmpty2.default)(object.data)) ret.data = object.data;
    return ret;
  },


  /**
   * Create a terse representation of a inline `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyInline: function tersifyInline(object) {
    var ret = {};
    ret.kind = object.kind;
    ret.type = object.type;
    if (object.key) ret.key = object.key;
    if (!object.isVoid) ret.nodes = object.nodes;
    if (object.isVoid) ret.isVoid = object.isVoid;
    if (!(0, _isEmpty2.default)(object.data)) ret.data = object.data;
    return ret;
  },


  /**
   * Create a terse representation of a mark `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyMark: function tersifyMark(object) {
    var ret = {};
    ret.type = object.type;
    if (!(0, _isEmpty2.default)(object.data)) ret.data = object.data;
    return ret;
  },


  /**
   * Create a terse representation of a range `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyRange: function tersifyRange(object) {
    var ret = {};
    ret.text = object.text;
    if (!(0, _isEmpty2.default)(object.marks)) ret.marks = object.marks;
    return ret;
  },


  /**
   * Create a terse representation of a selection `object.`
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifySelection: function tersifySelection(object) {
    return {
      anchorKey: object.anchorKey,
      anchorOffset: object.anchorOffset,
      focusKey: object.focusKey,
      focusOffset: object.focusOffset,
      isFocused: object.isFocused
    };
  },


  /**
   * Create a terse representation of a state `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyState: function tersifyState(object) {
    var data = object.data,
        document = object.document,
        selection = object.selection;

    var emptyData = (0, _isEmpty2.default)(data);

    if (!selection && emptyData) {
      return document;
    }

    var ret = { document: document };
    if (!emptyData) ret.data = data;
    if (selection) ret.selection = selection;
    return ret;
  },


  /**
   * Create a terse representation of a text `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyText: function tersifyText(object) {
    var ret = {};
    ret.kind = object.kind;
    if (object.key) ret.key = object.key;

    if (object.ranges.length == 1 && object.ranges[0].marks == null) {
      ret.text = object.ranges[0].text;
    } else {
      ret.ranges = object.ranges;
    }

    return ret;
  },


  /**
   * Convert a terse representation of a block `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyBlock: function untersifyBlock(object) {
    if (object.isVoid || !object.nodes || !object.nodes.length) {
      return {
        key: object.key,
        data: object.data,
        kind: object.kind,
        type: object.type,
        isVoid: object.isVoid,
        nodes: [{
          kind: 'text',
          text: ''
        }]
      };
    }

    return object;
  },


  /**
   * Convert a terse representation of a inline `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyInline: function untersifyInline(object) {
    if (object.isVoid || !object.nodes || !object.nodes.length) {
      return {
        key: object.key,
        data: object.data,
        kind: object.kind,
        type: object.type,
        isVoid: object.isVoid,
        nodes: [{
          kind: 'text',
          text: ''
        }]
      };
    }

    return object;
  },


  /**
   * Convert a terse representation of a range `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyRange: function untersifyRange(object) {
    return {
      kind: 'range',
      text: object.text,
      marks: object.marks || []
    };
  },


  /**
   * Convert a terse representation of a selection `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifySelection: function untersifySelection(object) {
    return {
      kind: 'selection',
      anchorKey: object.anchorKey,
      anchorOffset: object.anchorOffset,
      focusKey: object.focusKey,
      focusOffset: object.focusOffset,
      isBackward: null,
      isFocused: false
    };
  },


  /**
   * Convert a terse representation of a state `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyState: function untersifyState(object) {
    if (object.document) {
      return {
        kind: 'state',
        data: object.data,
        document: object.document,
        selection: object.selection
      };
    }

    return {
      kind: 'state',
      document: {
        data: object.data,
        key: object.key,
        kind: 'document',
        nodes: object.nodes
      }
    };
  },


  /**
   * Convert a terse representation of a text `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyText: function untersifyText(object) {
    if (object.ranges) return object;

    return {
      key: object.key,
      kind: object.kind,
      ranges: [{
        text: object.text,
        marks: object.marks || []
      }]
    };
  }
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Raw;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJpYWxpemVycy9yYXcuanMiXSwibmFtZXMiOlsiUmF3IiwiZGVzZXJpYWxpemUiLCJvYmplY3QiLCJvcHRpb25zIiwic3RhdGUiLCJkZXNlcmlhbGl6ZVN0YXRlIiwiZGVzZXJpYWxpemVCbG9jayIsInRlcnNlIiwidW50ZXJzaWZ5QmxvY2siLCJub2RlcyIsImNyZWF0ZUxpc3QiLCJtYXAiLCJkZXNlcmlhbGl6ZU5vZGUiLCJub2RlIiwiYmxvY2siLCJjcmVhdGUiLCJrZXkiLCJ0eXBlIiwiZGF0YSIsImlzVm9pZCIsImRlc2VyaWFsaXplRG9jdW1lbnQiLCJkb2N1bWVudCIsImRlc2VyaWFsaXplSW5saW5lIiwidW50ZXJzaWZ5SW5saW5lIiwiaW5saW5lIiwiZGVzZXJpYWxpemVNYXJrIiwibWFyayIsImtpbmQiLCJkZXNlcmlhbGl6ZVRleHQiLCJFcnJvciIsImRlc2VyaWFsaXplUmFuZ2UiLCJ1bnRlcnNpZnlSYW5nZSIsIm1hcmtzIiwiY3JlYXRlU2V0IiwiY2hhcnMiLCJ0ZXh0Iiwic3BsaXQiLCJjaGFyYWN0ZXJzIiwiZGVzZXJpYWxpemVTZWxlY3Rpb24iLCJzZWxlY3Rpb24iLCJhbmNob3JLZXkiLCJhbmNob3JPZmZzZXQiLCJmb2N1c0tleSIsImZvY3VzT2Zmc2V0IiwiaXNGb2N1c2VkIiwidW50ZXJzaWZ5U3RhdGUiLCJ1bnRlcnNpZnlUZXh0IiwicmFuZ2VzIiwicmVkdWNlIiwibGlzdCIsInJhbmdlIiwiY29uY2F0Iiwic2VyaWFsaXplIiwibW9kZWwiLCJyYXciLCJzZXJpYWxpemVTdGF0ZSIsInNlcmlhbGl6ZUJsb2NrIiwidG9KU09OIiwidG9BcnJheSIsInNlcmlhbGl6ZU5vZGUiLCJwcmVzZXJ2ZUtleXMiLCJ0ZXJzaWZ5QmxvY2siLCJzZXJpYWxpemVEb2N1bWVudCIsInRlcnNpZnlEb2N1bWVudCIsInNlcmlhbGl6ZUlubGluZSIsInRlcnNpZnlJbmxpbmUiLCJzZXJpYWxpemVNYXJrIiwidGVyc2lmeU1hcmsiLCJzZXJpYWxpemVUZXh0Iiwic2VyaWFsaXplUmFuZ2UiLCJ0ZXJzaWZ5UmFuZ2UiLCJzZXJpYWxpemVTZWxlY3Rpb24iLCJpc0JhY2t3YXJkIiwidGVyc2lmeVNlbGVjdGlvbiIsInByZXNlcnZlU2VsZWN0aW9uIiwicHJlc2VydmVTdGF0ZURhdGEiLCJyZXQiLCJ0ZXJzaWZ5U3RhdGUiLCJnZXRSYW5nZXMiLCJ0ZXJzaWZ5VGV4dCIsImVtcHR5RGF0YSIsImxlbmd0aCIsInVudGVyc2lmeVNlbGVjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxNQUFNOztBQUVWOzs7Ozs7OztBQVFBQyxhQVZVLHVCQVVFQyxNQVZGLEVBVVVDLE9BVlYsRUFVbUI7QUFDM0IsUUFBTUMsUUFBUUosSUFBSUssZ0JBQUosQ0FBcUJILE1BQXJCLEVBQTZCQyxPQUE3QixDQUFkO0FBQ0EsV0FBT0MsS0FBUDtBQUNELEdBYlM7OztBQWVWOzs7Ozs7OztBQVFBRSxrQkF2QlUsNEJBdUJPSixNQXZCUCxFQXVCNkI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQ3JDLFFBQUlBLFFBQVFJLEtBQVosRUFBbUJMLFNBQVNGLElBQUlRLGNBQUosQ0FBbUJOLE1BQW5CLENBQVQ7O0FBRW5CLFFBQU1PLFFBQVEsZUFBS0MsVUFBTCxDQUFnQlIsT0FBT08sS0FBUCxDQUFhRSxHQUFiLENBQWlCO0FBQUEsYUFBUVgsSUFBSVksZUFBSixDQUFvQkMsSUFBcEIsRUFBMEJWLE9BQTFCLENBQVI7QUFBQSxLQUFqQixDQUFoQixDQUFkO0FBQ0EsUUFBTVcsUUFBUSxnQkFBTUMsTUFBTixDQUFhO0FBQ3pCQyxXQUFLZCxPQUFPYyxHQURhO0FBRXpCQyxZQUFNZixPQUFPZSxJQUZZO0FBR3pCQyxZQUFNaEIsT0FBT2dCLElBSFk7QUFJekJDLGNBQVFq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Q0x5QixZQUFNLFdBREQ7QUFFTGEsaUJBQVd0QyxPQUFPc0MsU0FGYjtBQUdMQyxvQkFBY3ZDLE9BQU91QyxZQUhoQjtBQUlMQyxnQkFBVXhDLE9BQU93QyxRQUpaO0FBS0xDLG1CQUFhekMsT0FBT3lDLFdBTGY7QUFNTDZCLGtCQUFZLElBTlA7QUFPTDVCLGlCQUFXO0FBUE4sS0FBUDtBQVNELEdBanBCUzs7O0FBbXBCVjs7Ozs7OztBQU9BQyxnQkExcEJVLDBCQTBwQkszQyxNQTFwQkwsRUEwcEJhO0FBQ3JCLFFBQUlBLE9BQU9tQixRQUFYLEVBQXFCO0FBQ25CLGFBQU87QUFDTE0sY0FBTSxPQUREO0FBRUxULGNBQU1oQixPQUFPZ0IsSUFGUjtBQUdMRyxrQkFBVW5CLE9BQU9tQixRQUhaO0FBSUxrQixtQkFBV3JDLE9BQU9xQztBQUpiLE9BQVA7QUFNRDs7QUFFRCxXQUFPO0FBQ0xaLFlBQU0sT0FERDtBQUVMTixnQkFBVTtBQUNSSCxjQUFNaEIsT0FBT2dCLElBREw7QUFFUkYsYUFBS2QsT0FBT2MsR0FGSjtBQUdSVyxjQUFNLFVBSEU7QUFJUmxCLGVBQU9QLE9BQU9PO0FBSk47QUFGTCxLQUFQO0FBU0QsR0E3cUJTOzs7QUErcUJWOzs7Ozs7O0FBT0FxQyxlQXRyQlUseUJBc3JCSTVDLE1BdHJCSixFQXNyQlk7QUFDcEIsUUFBSUEsT0FBTzZDLE1BQVgsRUFBbUIsT0FBTzdDLE1BQVA7O0FBRW5CLFdBQU87QUFDTGMsV0FBS2QsT0FBT2MsR0FEUDtBQUVMVyxZQUFNekIsT0FBT3lCLElBRlI7QUFHTG9CLGNBQVEsQ0FBQztBQUNQWixjQUFNakMsT0FBT2lDLElBRE47QUFFUEgsZUFBTzlCLE9BQU84QixLQUFQLElBQWdCO0FBRmhCLE9BQUQ7QUFISCxLQUFQO0FBUUQ7QUFqc0JTLENBQVo7O0FBb3NCQTs7Ozs7O2tCQU1laEMsRyIsImZpbGUiOiJyYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCbG9jayBmcm9tICcuLi9tb2RlbHMvYmxvY2snXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4uL21vZGVscy9jaGFyYWN0ZXInXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi4vbW9kZWxzL2RvY3VtZW50J1xuaW1wb3J0IElubGluZSBmcm9tICcuLi9tb2RlbHMvaW5saW5lJ1xuaW1wb3J0IE1hcmsgZnJvbSAnLi4vbW9kZWxzL21hcmsnXG5pbXBvcnQgTm9kZSBmcm9tICcuLi9tb2RlbHMvbm9kZSdcbmltcG9ydCBTZWxlY3Rpb24gZnJvbSAnLi4vbW9kZWxzL3NlbGVjdGlvbidcbmltcG9ydCBTdGF0ZSBmcm9tICcuLi9tb2RlbHMvc3RhdGUnXG5pbXBvcnQgVGV4dCBmcm9tICcuLi9tb2RlbHMvdGV4dCdcbmltcG9ydCBpc0VtcHR5IGZyb20gJ2lzLWVtcHR5J1xuXG4vKipcbiAqIFJhdy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IFJhdyA9IHtcblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYSBKU09OIGBvYmplY3RgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplKG9iamVjdCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHN0YXRlID0gUmF3LmRlc2VyaWFsaXplU3RhdGUob2JqZWN0LCBvcHRpb25zKVxuICAgIHJldHVybiBzdGF0ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZSBhIEpTT04gYG9iamVjdGAgcmVwcmVzZW50aW5nIGEgYEJsb2NrYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge0Jsb2NrfVxuICAgKi9cblxuICBkZXNlcmlhbGl6ZUJsb2NrKG9iamVjdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMudGVyc2UpIG9iamVjdCA9IFJhdy51bnRlcnNpZnlCbG9jayhvYmplY3QpXG5cbiAgICBjb25zdCBub2RlcyA9IE5vZGUuY3JlYXRlTGlzdChvYmplY3Qubm9kZXMubWFwKG5vZGUgPT4gUmF3LmRlc2VyaWFsaXplTm9kZShub2RlLCBvcHRpb25zKSkpXG4gICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGUoe1xuICAgICAga2V5OiBvYmplY3Qua2V5LFxuICAgICAgdHlwZTogb2JqZWN0LnR5cGUsXG4gICAgICBkYXRhOiBvYmplY3QuZGF0YSxcbiAgICAgIGlzVm9pZDogb2JqZWN0LmlzVm9pZCxcbiAgICAgIG5vZGVzLFxuICAgIH0pXG5cbiAgICByZXR1cm4gYmxvY2tcbiAgfSxcblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYSBKU09OIGBvYmplY3RgIHJlcHJlc2VudGluZyBhIGBEb2N1bWVudGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtEb2N1bWVudH1cbiAgICovXG5cbiAgZGVzZXJpYWxpemVEb2N1bWVudChvYmplY3QsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBub2RlcyA9IG9iamVjdC5ub2Rlcy5tYXAobm9kZSA9PiBSYXcuZGVzZXJpYWxpemVOb2RlKG5vZGUsIG9wdGlvbnMpKVxuICAgIGNvbnN0IGRvY3VtZW50ID0gRG9jdW1lbnQuY3JlYXRlKHtcbiAgICAgIGtleTogb2JqZWN0LmtleSxcbiAgICAgIGRhdGE6IG9iamVjdC5kYXRhLFxuICAgICAgbm9kZXMsXG4gICAgfSlcblxuICAgIHJldHVybiBkb2N1bWVudFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZSBhIEpTT04gYG9iamVjdGAgcmVwcmVzZW50aW5nIGFuIGBJbmxpbmVgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7SW5saW5lfVxuICAgKi9cblxuICBkZXNlcmlhbGl6ZUlubGluZShvYmplY3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChvcHRpb25zLnRlcnNlKSBvYmplY3QgPSBSYXcudW50ZXJzaWZ5SW5saW5lKG9iamVjdClcblxuICAgIGNvbnN0IG5vZGVzID0gb2JqZWN0Lm5vZGVzLm1hcChub2RlID0+IFJhdy5kZXNlcmlhbGl6ZU5vZGUobm9kZSwgb3B0aW9ucykpXG4gICAgY29uc3QgaW5saW5lID0gSW5saW5lLmNyZWF0ZSh7XG4gICAgICBrZXk6IG9iamVjdC5rZXksXG4gICAgICB0eXBlOiBvYmplY3QudHlwZSxcbiAgICAgIGRhdGE6IG9iamVjdC5kYXRhLFxuICAgICAgaXNWb2lkOiBvYmplY3QuaXNWb2lkLFxuICAgICAgbm9kZXMsXG4gICAgfSlcblxuICAgIHJldHVybiBpbmxpbmVcbiAgfSxcblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYSBKU09OIGBvYmplY3RgIHJlcHJlc2VudGluZyBhIGBNYXJrYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge01hcmt9XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplTWFyayhvYmplY3QsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBtYXJrID0gTWFyay5jcmVhdGUob2JqZWN0KVxuICAgIHJldHVybiBtYXJrXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIGEgYE5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7Tm9kZX1cbiAgICovXG5cbiAgZGVzZXJpYWxpemVOb2RlKG9iamVjdCwgb3B0aW9ucykge1xuICAgIHN3aXRjaCAob2JqZWN0LmtpbmQpIHtcbiAgICAgIGNhc2UgJ2Jsb2NrJzogcmV0dXJuIFJhdy5kZXNlcmlhbGl6ZUJsb2NrKG9iamVjdCwgb3B0aW9ucylcbiAgICAgIGNhc2UgJ2RvY3VtZW50JzogcmV0dXJuIFJhdy5kZXNlcmlhbGl6ZURvY3VtZW50KG9iamVjdCwgb3B0aW9ucylcbiAgICAgIGNhc2UgJ2lubGluZSc6IHJldHVybiBSYXcuZGVzZXJpYWxpemVJbmxpbmUob2JqZWN0LCBvcHRpb25zKVxuICAgICAgY2FzZSAndGV4dCc6IHJldHVybiBSYXcuZGVzZXJpYWxpemVUZXh0KG9iamVjdCwgb3B0aW9ucylcbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgbm9kZSBraW5kIFwiJHtvYmplY3Qua2luZH1cIi5gKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYSBKU09OIGBvYmplY3RgIHJlcHJlc2VudGluZyBhIGBSYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtMaXN0PENoYXJhY3Rlcj59XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplUmFuZ2Uob2JqZWN0LCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAob3B0aW9ucy50ZXJzZSkgb2JqZWN0ID0gUmF3LnVudGVyc2lmeVJhbmdlKG9iamVjdClcbiAgICBjb25zdCBtYXJrcyA9IE1hcmsuY3JlYXRlU2V0KG9iamVjdC5tYXJrcy5tYXAobWFyayA9PiBSYXcuZGVzZXJpYWxpemVNYXJrKG1hcmssIG9wdGlvbnMpKSlcbiAgICBjb25zdCBjaGFycyA9IG9iamVjdC50ZXh0LnNwbGl0KCcnKVxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBDaGFyYWN0ZXIuY3JlYXRlTGlzdChjaGFycy5tYXAodGV4dCA9PiAoeyB0ZXh0LCBtYXJrcyB9KSkpXG4gICAgcmV0dXJuIGNoYXJhY3RlcnNcbiAgfSxcblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYSBKU09OIGBvYmplY3RgIHJlcHJlc2VudGluZyBhIGBTZWxlY3Rpb25gLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplU2VsZWN0aW9uKG9iamVjdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uLmNyZWF0ZSh7XG4gICAgICBhbmNob3JLZXk6IG9iamVjdC5hbmNob3JLZXksXG4gICAgICBhbmNob3JPZmZzZXQ6IG9iamVjdC5hbmNob3JPZmZzZXQsXG4gICAgICBmb2N1c0tleTogb2JqZWN0LmZvY3VzS2V5LFxuICAgICAgZm9jdXNPZmZzZXQ6IG9iamVjdC5mb2N1c09mZnNldCxcbiAgICAgIGlzRm9jdXNlZDogb2JqZWN0LmlzRm9jdXNlZCxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHNlbGVjdGlvblxuICB9LFxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZSBhIEpTT04gYG9iamVjdGAgcmVwcmVzZW50aW5nIGEgYFN0YXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1N0YXRlfVxuICAgKi9cblxuICBkZXNlcmlhbGl6ZVN0YXRlKG9iamVjdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMudGVyc2UpIG9iamVjdCA9IFJhdy51bnRlcnNpZnlTdGF0ZShvYmplY3QpXG5cbiAgICBjb25zdCBkb2N1bWVudCA9IFJhdy5kZXNlcmlhbGl6ZURvY3VtZW50KG9iamVjdC5kb2N1bWVudCwgb3B0aW9ucylcbiAgICBsZXQgc2VsZWN0aW9uXG5cbiAgICBpZiAob2JqZWN0LnNlbGVjdGlvbiAhPSBudWxsKSB7XG4gICAgICBzZWxlY3Rpb24gPSBSYXcuZGVzZXJpYWxpemVTZWxlY3Rpb24ob2JqZWN0LnNlbGVjdGlvbiwgb3B0aW9ucylcbiAgICB9XG5cbiAgICByZXR1cm4gU3RhdGUuY3JlYXRlKHsgZGF0YTogb2JqZWN0LmRhdGEsIGRvY3VtZW50LCBzZWxlY3Rpb24gfSwgb3B0aW9ucylcbiAgfSxcblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYSBKU09OIGBvYmplY3RgIHJlcHJlc2VudGluZyBhIGBUZXh0YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1RleHR9XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplVGV4dChvYmplY3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChvcHRpb25zLnRlcnNlKSBvYmplY3QgPSBSYXcudW50ZXJzaWZ5VGV4dChvYmplY3QpXG5cbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gb2JqZWN0LnJhbmdlcy5yZWR1Y2UoKGxpc3QsIHJhbmdlKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdC5jb25jYXQoUmF3LmRlc2VyaWFsaXplUmFuZ2UocmFuZ2UsIG9wdGlvbnMpKVxuICAgIH0sIENoYXJhY3Rlci5jcmVhdGVMaXN0KCkpXG5cbiAgICBjb25zdCB0ZXh0ID0gVGV4dC5jcmVhdGUoe1xuICAgICAga2V5OiBvYmplY3Qua2V5LFxuICAgICAgY2hhcmFjdGVycyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRleHRcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplIGEgYG1vZGVsYC5cbiAgICpcbiAgICogQHBhcmFtIHtNaXhlZH0gbW9kZWxcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHNlcmlhbGl6ZShtb2RlbCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJhdyA9IFJhdy5zZXJpYWxpemVTdGF0ZShtb2RlbCwgb3B0aW9ucylcbiAgICByZXR1cm4gcmF3XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZSBhIGBibG9ja2Agbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtCbG9ja30gYmxvY2tcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHNlcmlhbGl6ZUJsb2NrKGJsb2NrLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvYmplY3QgPSB7XG4gICAgICBkYXRhOiBibG9jay5kYXRhLnRvSlNPTigpLFxuICAgICAga2V5OiBibG9jay5rZXksXG4gICAgICBraW5kOiBibG9jay5raW5kLFxuICAgICAgaXNWb2lkOiBibG9jay5pc1ZvaWQsXG4gICAgICB0eXBlOiBibG9jay50eXBlLFxuICAgICAgbm9kZXM6IGJsb2NrLm5vZGVzXG4gICAgICAgIC50b0FycmF5KClcbiAgICAgICAgLm1hcChub2RlID0+IFJhdy5zZXJpYWxpemVOb2RlKG5vZGUsIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5wcmVzZXJ2ZUtleXMpIHtcbiAgICAgIGRlbGV0ZSBvYmplY3Qua2V5XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMudGVyc2VcbiAgICAgID8gUmF3LnRlcnNpZnlCbG9jayhvYmplY3QpXG4gICAgICA6IG9iamVjdFxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgYSBgZG9jdW1lbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50fSBkb2N1bWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgc2VyaWFsaXplRG9jdW1lbnQoZG9jdW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgIGRhdGE6IGRvY3VtZW50LmRhdGEudG9KU09OKCksXG4gICAgICBrZXk6IGRvY3VtZW50LmtleSxcbiAgICAgIGtpbmQ6IGRvY3VtZW50LmtpbmQsXG4gICAgICBub2RlczogZG9jdW1lbnQubm9kZXNcbiAgICAgICAgLnRvQXJyYXkoKVxuICAgICAgICAubWFwKG5vZGUgPT4gUmF3LnNlcmlhbGl6ZU5vZGUobm9kZSwgb3B0aW9ucykpXG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnByZXNlcnZlS2V5cykge1xuICAgICAgZGVsZXRlIG9iamVjdC5rZXlcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy50ZXJzZVxuICAgICAgPyBSYXcudGVyc2lmeURvY3VtZW50KG9iamVjdClcbiAgICAgIDogb2JqZWN0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZSBhbiBgaW5saW5lYCBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0lubGluZX0gaW5saW5lXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICBzZXJpYWxpemVJbmxpbmUoaW5saW5lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvYmplY3QgPSB7XG4gICAgICBkYXRhOiBpbmxpbmUuZGF0YS50b0pTT04oKSxcbiAgICAgIGtleTogaW5saW5lLmtleSxcbiAgICAgIGtpbmQ6IGlubGluZS5raW5kLFxuICAgICAgaXNWb2lkOiBpbmxpbmUuaXNWb2lkLFxuICAgICAgdHlwZTogaW5saW5lLnR5cGUsXG4gICAgICBub2RlczogaW5saW5lLm5vZGVzXG4gICAgICAgIC50b0FycmF5KClcbiAgICAgICAgLm1hcChub2RlID0+IFJhdy5zZXJpYWxpemVOb2RlKG5vZGUsIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5wcmVzZXJ2ZUtleXMpIHtcbiAgICAgIGRlbGV0ZSBvYmplY3Qua2V5XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMudGVyc2VcbiAgICAgID8gUmF3LnRlcnNpZnlJbmxpbmUob2JqZWN0KVxuICAgICAgOiBvYmplY3RcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplIGEgYG1hcmtgLlxuICAgKlxuICAgKiBAcGFyYW0ge01hcmt9IG1hcmtcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHNlcmlhbGl6ZU1hcmsobWFyaywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgb2JqZWN0ID0ge1xuICAgICAgZGF0YTogbWFyay5kYXRhLnRvSlNPTigpLFxuICAgICAga2luZDogbWFyay5raW5kLFxuICAgICAgdHlwZTogbWFyay50eXBlXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMudGVyc2VcbiAgICAgID8gUmF3LnRlcnNpZnlNYXJrKG9iamVjdClcbiAgICAgIDogb2JqZWN0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZSBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICBzZXJpYWxpemVOb2RlKG5vZGUsIG9wdGlvbnMpIHtcbiAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgY2FzZSAnYmxvY2snOiByZXR1cm4gUmF3LnNlcmlhbGl6ZUJsb2NrKG5vZGUsIG9wdGlvbnMpXG4gICAgICBjYXNlICdkb2N1bWVudCc6IHJldHVybiBSYXcuc2VyaWFsaXplRG9jdW1lbnQobm9kZSwgb3B0aW9ucylcbiAgICAgIGNhc2UgJ2lubGluZSc6IHJldHVybiBSYXcuc2VyaWFsaXplSW5saW5lKG5vZGUsIG9wdGlvbnMpXG4gICAgICBjYXNlICd0ZXh0JzogcmV0dXJuIFJhdy5zZXJpYWxpemVUZXh0KG5vZGUsIG9wdGlvbnMpXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIG5vZGUga2luZCBcIiR7bm9kZS5raW5kfVwiLmApXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgYSBgcmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgc2VyaWFsaXplUmFuZ2UocmFuZ2UsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgIGtpbmQ6IHJhbmdlLmtpbmQsXG4gICAgICB0ZXh0OiByYW5nZS50ZXh0LFxuICAgICAgbWFya3M6IHJhbmdlLm1hcmtzXG4gICAgICAgIC50b0FycmF5KClcbiAgICAgICAgLm1hcChtYXJrID0+IFJhdy5zZXJpYWxpemVNYXJrKG1hcmssIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zLnRlcnNlXG4gICAgICA/IFJhdy50ZXJzaWZ5UmFuZ2Uob2JqZWN0KVxuICAgICAgOiBvYmplY3RcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplIGEgYHNlbGVjdGlvbmAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2VsZWN0aW9ufSBzZWxlY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHNlcmlhbGl6ZVNlbGVjdGlvbihzZWxlY3Rpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgIGtpbmQ6IHNlbGVjdGlvbi5raW5kLFxuICAgICAgYW5jaG9yS2V5OiBzZWxlY3Rpb24uYW5jaG9yS2V5LFxuICAgICAgYW5jaG9yT2Zmc2V0OiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0LFxuICAgICAgZm9jdXNLZXk6IHNlbGVjdGlvbi5mb2N1c0tleSxcbiAgICAgIGZvY3VzT2Zmc2V0OiBzZWxlY3Rpb24uZm9jdXNPZmZzZXQsXG4gICAgICBpc0JhY2t3YXJkOiBzZWxlY3Rpb24uaXNCYWNrd2FyZCxcbiAgICAgIGlzRm9jdXNlZDogc2VsZWN0aW9uLmlzRm9jdXNlZCxcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy50ZXJzZVxuICAgICAgPyBSYXcudGVyc2lmeVNlbGVjdGlvbihvYmplY3QpXG4gICAgICA6IG9iamVjdFxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgYSBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgc2VyaWFsaXplU3RhdGUoc3RhdGUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgIGRvY3VtZW50OiBSYXcuc2VyaWFsaXplRG9jdW1lbnQoc3RhdGUuZG9jdW1lbnQsIG9wdGlvbnMpLFxuICAgICAga2luZDogc3RhdGUua2luZFxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnByZXNlcnZlU2VsZWN0aW9uKSB7XG4gICAgICBvYmplY3Quc2VsZWN0aW9uID0gUmF3LnNlcmlhbGl6ZVNlbGVjdGlvbihzdGF0ZS5zZWxlY3Rpb24sIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucHJlc2VydmVTdGF0ZURhdGEpIHtcbiAgICAgIG9iamVjdC5kYXRhID0gc3RhdGUuZGF0YS50b0pTT04oKVxuICAgIH1cblxuICAgIGNvbnN0IHJldCA9IG9wdGlvbnMudGVyc2VcbiAgICAgID8gUmF3LnRlcnNpZnlTdGF0ZShvYmplY3QpXG4gICAgICA6IG9iamVjdFxuXG4gICAgcmV0dXJuIHJldFxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgYSBgdGV4dGAgbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICBzZXJpYWxpemVUZXh0KHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgIGtleTogdGV4dC5rZXksXG4gICAgICBraW5kOiB0ZXh0LmtpbmQsXG4gICAgICByYW5nZXM6IHRleHRcbiAgICAgICAgLmdldFJhbmdlcygpXG4gICAgICAgIC50b0FycmF5KClcbiAgICAgICAgLm1hcChyYW5nZSA9PiBSYXcuc2VyaWFsaXplUmFuZ2UocmFuZ2UsIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5wcmVzZXJ2ZUtleXMpIHtcbiAgICAgIGRlbGV0ZSBvYmplY3Qua2V5XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMudGVyc2VcbiAgICAgID8gUmF3LnRlcnNpZnlUZXh0KG9iamVjdClcbiAgICAgIDogb2JqZWN0XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHRlcnNlIHJlcHJlc2VudGF0aW9uIG9mIGEgYmxvY2sgYG9iamVjdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB0ZXJzaWZ5QmxvY2sob2JqZWN0KSB7XG4gICAgY29uc3QgcmV0ID0ge31cbiAgICByZXQua2luZCA9IG9iamVjdC5raW5kXG4gICAgcmV0LnR5cGUgPSBvYmplY3QudHlwZVxuICAgIGlmIChvYmplY3Qua2V5KSByZXQua2V5ID0gb2JqZWN0LmtleVxuICAgIGlmICghb2JqZWN0LmlzVm9pZCkgcmV0Lm5vZGVzID0gb2JqZWN0Lm5vZGVzXG4gICAgaWYgKG9iamVjdC5pc1ZvaWQpIHJldC5pc1ZvaWQgPSBvYmplY3QuaXNWb2lkXG4gICAgaWYgKCFpc0VtcHR5KG9iamVjdC5kYXRhKSkgcmV0LmRhdGEgPSBvYmplY3QuZGF0YVxuICAgIHJldHVybiByZXRcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIGEgdGVyc2UgcmVwcmVzZW50YXRpb24gb2YgYSBkb2N1bWVudCBgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgdGVyc2lmeURvY3VtZW50KG9iamVjdCkge1xuICAgIGNvbnN0IHJldCA9IHt9XG4gICAgcmV0Lm5vZGVzID0gb2JqZWN0Lm5vZGVzXG4gICAgaWYgKG9iamVjdC5rZXkpIHJldC5rZXkgPSBvYmplY3Qua2V5XG4gICAgaWYgKCFpc0VtcHR5KG9iamVjdC5kYXRhKSkgcmV0LmRhdGEgPSBvYmplY3QuZGF0YVxuICAgIHJldHVybiByZXRcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIGEgdGVyc2UgcmVwcmVzZW50YXRpb24gb2YgYSBpbmxpbmUgYG9iamVjdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB0ZXJzaWZ5SW5saW5lKG9iamVjdCkge1xuICAgIGNvbnN0IHJldCA9IHt9XG4gICAgcmV0LmtpbmQgPSBvYmplY3Qua2luZFxuICAgIHJldC50eXBlID0gb2JqZWN0LnR5cGVcbiAgICBpZiAob2JqZWN0LmtleSkgcmV0LmtleSA9IG9iamVjdC5rZXlcbiAgICBpZiAoIW9iamVjdC5pc1ZvaWQpIHJldC5ub2RlcyA9IG9iamVjdC5ub2Rlc1xuICAgIGlmIChvYmplY3QuaXNWb2lkKSByZXQuaXNWb2lkID0gb2JqZWN0LmlzVm9pZFxuICAgIGlmICghaXNFbXB0eShvYmplY3QuZGF0YSkpIHJldC5kYXRhID0gb2JqZWN0LmRhdGFcbiAgICByZXR1cm4gcmV0XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHRlcnNlIHJlcHJlc2VudGF0aW9uIG9mIGEgbWFyayBgb2JqZWN0YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHRlcnNpZnlNYXJrKG9iamVjdCkge1xuICAgIGNvbnN0IHJldCA9IHt9XG4gICAgcmV0LnR5cGUgPSBvYmplY3QudHlwZVxuICAgIGlmICghaXNFbXB0eShvYmplY3QuZGF0YSkpIHJldC5kYXRhID0gb2JqZWN0LmRhdGFcbiAgICByZXR1cm4gcmV0XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHRlcnNlIHJlcHJlc2VudGF0aW9uIG9mIGEgcmFuZ2UgYG9iamVjdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB0ZXJzaWZ5UmFuZ2Uob2JqZWN0KSB7XG4gICAgY29uc3QgcmV0ID0ge31cbiAgICByZXQudGV4dCA9IG9iamVjdC50ZXh0XG4gICAgaWYgKCFpc0VtcHR5KG9iamVjdC5tYXJrcykpIHJldC5tYXJrcyA9IG9iamVjdC5tYXJrc1xuICAgIHJldHVybiByZXRcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIGEgdGVyc2UgcmVwcmVzZW50YXRpb24gb2YgYSBzZWxlY3Rpb24gYG9iamVjdC5gXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB0ZXJzaWZ5U2VsZWN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB7XG4gICAgICBhbmNob3JLZXk6IG9iamVjdC5hbmNob3JLZXksXG4gICAgICBhbmNob3JPZmZzZXQ6IG9iamVjdC5hbmNob3JPZmZzZXQsXG4gICAgICBmb2N1c0tleTogb2JqZWN0LmZvY3VzS2V5LFxuICAgICAgZm9jdXNPZmZzZXQ6IG9iamVjdC5mb2N1c09mZnNldCxcbiAgICAgIGlzRm9jdXNlZDogb2JqZWN0LmlzRm9jdXNlZCxcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHRlcnNlIHJlcHJlc2VudGF0aW9uIG9mIGEgc3RhdGUgYG9iamVjdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB0ZXJzaWZ5U3RhdGUob2JqZWN0KSB7XG4gICAgY29uc3QgeyBkYXRhLCBkb2N1bWVudCwgc2VsZWN0aW9uIH0gPSBvYmplY3RcbiAgICBjb25zdCBlbXB0eURhdGEgPSBpc0VtcHR5KGRhdGEpXG5cbiAgICBpZiAoIXNlbGVjdGlvbiAmJiBlbXB0eURhdGEpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudFxuICAgIH1cblxuICAgIGNvbnN0IHJldCA9IHsgZG9jdW1lbnQgfVxuICAgIGlmICghZW1wdHlEYXRhKSByZXQuZGF0YSA9IGRhdGFcbiAgICBpZiAoc2VsZWN0aW9uKSByZXQuc2VsZWN0aW9uID0gc2VsZWN0aW9uXG4gICAgcmV0dXJuIHJldFxuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSB0ZXJzZSByZXByZXNlbnRhdGlvbiBvZiBhIHRleHQgYG9iamVjdGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB0ZXJzaWZ5VGV4dChvYmplY3QpIHtcbiAgICBjb25zdCByZXQgPSB7fVxuICAgIHJldC5raW5kID0gb2JqZWN0LmtpbmRcbiAgICBpZiAob2JqZWN0LmtleSkgcmV0LmtleSA9IG9iamVjdC5rZXlcblxuICAgIGlmIChvYmplY3QucmFuZ2VzLmxlbmd0aCA9PSAxICYmIG9iamVjdC5yYW5nZXNbMF0ubWFya3MgPT0gbnVsbCkge1xuICAgICAgcmV0LnRleHQgPSBvYmplY3QucmFuZ2VzWzBdLnRleHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0LnJhbmdlcyA9IG9iamVjdC5yYW5nZXNcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSB0ZXJzZSByZXByZXNlbnRhdGlvbiBvZiBhIGJsb2NrIGBvYmplY3RgIGludG8gYSBub24tdGVyc2Ugb25lLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgdW50ZXJzaWZ5QmxvY2sob2JqZWN0KSB7XG4gICAgaWYgKG9iamVjdC5pc1ZvaWQgfHwgIW9iamVjdC5ub2RlcyB8fCAhb2JqZWN0Lm5vZGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBvYmplY3Qua2V5LFxuICAgICAgICBkYXRhOiBvYmplY3QuZGF0YSxcbiAgICAgICAga2luZDogb2JqZWN0LmtpbmQsXG4gICAgICAgIHR5cGU6IG9iamVjdC50eXBlLFxuICAgICAgICBpc1ZvaWQ6IG9iamVjdC5pc1ZvaWQsXG4gICAgICAgIG5vZGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAga2luZDogJ3RleHQnLFxuICAgICAgICAgICAgdGV4dDogJydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSB0ZXJzZSByZXByZXNlbnRhdGlvbiBvZiBhIGlubGluZSBgb2JqZWN0YCBpbnRvIGEgbm9uLXRlcnNlIG9uZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHVudGVyc2lmeUlubGluZShvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0LmlzVm9pZCB8fCAhb2JqZWN0Lm5vZGVzIHx8ICFvYmplY3Qubm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IG9iamVjdC5rZXksXG4gICAgICAgIGRhdGE6IG9iamVjdC5kYXRhLFxuICAgICAgICBraW5kOiBvYmplY3Qua2luZCxcbiAgICAgICAgdHlwZTogb2JqZWN0LnR5cGUsXG4gICAgICAgIGlzVm9pZDogb2JqZWN0LmlzVm9pZCxcbiAgICAgICAgbm9kZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBraW5kOiAndGV4dCcsXG4gICAgICAgICAgICB0ZXh0OiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RcbiAgfSxcblxuICAvKipcbiAgICogQ29udmVydCBhIHRlcnNlIHJlcHJlc2VudGF0aW9uIG9mIGEgcmFuZ2UgYG9iamVjdGAgaW50byBhIG5vbi10ZXJzZSBvbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB1bnRlcnNpZnlSYW5nZShvYmplY3QpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2luZDogJ3JhbmdlJyxcbiAgICAgIHRleHQ6IG9iamVjdC50ZXh0LFxuICAgICAgbWFya3M6IG9iamVjdC5tYXJrcyB8fCBbXVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ29udmVydCBhIHRlcnNlIHJlcHJlc2VudGF0aW9uIG9mIGEgc2VsZWN0aW9uIGBvYmplY3RgIGludG8gYSBub24tdGVyc2Ugb25lLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgdW50ZXJzaWZ5U2VsZWN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB7XG4gICAgICBraW5kOiAnc2VsZWN0aW9uJyxcbiAgICAgIGFuY2hvcktleTogb2JqZWN0LmFuY2hvcktleSxcbiAgICAgIGFuY2hvck9mZnNldDogb2JqZWN0LmFuY2hvck9mZnNldCxcbiAgICAgIGZvY3VzS2V5OiBvYmplY3QuZm9jdXNLZXksXG4gICAgICBmb2N1c09mZnNldDogb2JqZWN0LmZvY3VzT2Zmc2V0LFxuICAgICAgaXNCYWNrd2FyZDogbnVsbCxcbiAgICAgIGlzRm9jdXNlZDogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSB0ZXJzZSByZXByZXNlbnRhdGlvbiBvZiBhIHN0YXRlIGBvYmplY3RgIGludG8gYSBub24tdGVyc2Ugb25lLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgdW50ZXJzaWZ5U3RhdGUob2JqZWN0KSB7XG4gICAgaWYgKG9iamVjdC5kb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2luZDogJ3N0YXRlJyxcbiAgICAgICAgZGF0YTogb2JqZWN0LmRhdGEsXG4gICAgICAgIGRvY3VtZW50OiBvYmplY3QuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdGlvbjogb2JqZWN0LnNlbGVjdGlvbixcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAga2luZDogJ3N0YXRlJyxcbiAgICAgIGRvY3VtZW50OiB7XG4gICAgICAgIGRhdGE6IG9iamVjdC5kYXRhLFxuICAgICAgICBrZXk6IG9iamVjdC5rZXksXG4gICAgICAgIGtpbmQ6ICdkb2N1bWVudCcsXG4gICAgICAgIG5vZGVzOiBvYmplY3Qubm9kZXNcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSB0ZXJzZSByZXByZXNlbnRhdGlvbiBvZiBhIHRleHQgYG9iamVjdGAgaW50byBhIG5vbi10ZXJzZSBvbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB1bnRlcnNpZnlUZXh0KG9iamVjdCkge1xuICAgIGlmIChvYmplY3QucmFuZ2VzKSByZXR1cm4gb2JqZWN0XG5cbiAgICByZXR1cm4ge1xuICAgICAga2V5OiBvYmplY3Qua2V5LFxuICAgICAga2luZDogb2JqZWN0LmtpbmQsXG4gICAgICByYW5nZXM6IFt7XG4gICAgICAgIHRleHQ6IG9iamVjdC50ZXh0LFxuICAgICAgICBtYXJrczogb2JqZWN0Lm1hcmtzIHx8IFtdXG4gICAgICB9XVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IFJhd1xuIl19