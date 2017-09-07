'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _generateKey = require('../utils/generate-key');

var _generateKey2 = _interopRequireDefault(_generateKey);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _memoize = require('../utils/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  characters: new _immutable.List(),
  key: undefined

  /**
   * Text.
   *
   * @type {Text}
   */

};
var Text = function (_Record) {
  _inherits(Text, _Record);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
  }

  _createClass(Text, [{
    key: 'addMark',


    /**
     * Add a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

    value: function addMark(index, length, mark) {
      var characters = this.characters.map(function (char, i) {
        if (i < index) return char;
        if (i >= index + length) return char;
        var _char = char,
            marks = _char.marks;

        marks = marks.add(mark);
        char = char.set('marks', marks);
        return char;
      });

      return this.set('characters', characters);
    }

    /**
     * Derive a set of decorated characters with `decorators`.
     *
     * @param {Array} decorators
     * @return {List<Character>}
     */

  }, {
    key: 'getDecorations',
    value: function getDecorations(decorators) {
      var node = this;
      var characters = node.characters;

      if (characters.size == 0) return characters;

      for (var i = 0; i < decorators.length; i++) {
        var decorator = decorators[i];
        var decorateds = decorator(node);
        characters = characters.merge(decorateds);
      }

      return characters;
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
     * Get all of the marks on the text.
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getMarks',
    value: function getMarks() {
      var array = this.getMarksAsArray();
      return new _immutable.OrderedSet(array);
    }

    /**
     * Get all of the marks on the text as an array
     *
     * @return {Array}
     */

  }, {
    key: 'getMarksAsArray',
    value: function getMarksAsArray() {
      return this.characters.reduce(function (array, char) {
        return array.concat(char.marks.toArray());
      }, []);
    }

    /**
     * Get the marks on the text at `index`.
     *
     * @param {Number} index
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtIndex',
    value: function getMarksAtIndex(index) {
      if (index == 0) return _mark2.default.createSet();
      var characters = this.characters;

      var char = characters.get(index - 1);
      if (!char) return _mark2.default.createSet();
      return char.marks;
    }

    /**
     * Get a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(key) {
      return this.key == key ? this : null;
    }

    /**
     * Derive the ranges for a list of `characters`.
     *
     * @param {Array|Void} decorators (optional)
     * @return {List<Range>}
     */

  }, {
    key: 'getRanges',
    value: function getRanges() {
      var decorators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var characters = this.getDecorations(decorators);
      var ranges = [];

      // PERF: cache previous values for faster lookup.
      var prevChar = void 0;
      var prevRange = void 0;

      // If there are no characters, return one empty range.
      if (characters.size == 0) {
        ranges.push({});
      }

      // Otherwise, loop the characters and build the ranges...
      else {
          characters.forEach(function (char, i) {
            var marks = char.marks,
                text = char.text;

            // The first one can always just be created.

            if (i == 0) {
              prevChar = char;
              prevRange = { text: text, marks: marks };
              ranges.push(prevRange);
              return;
            }

            // Otherwise, compare the current and previous marks.
            var prevMarks = prevChar.marks;
            var isSame = (0, _immutable.is)(marks, prevMarks);

            // If the marks are the same, add the text to the previous range.
            if (isSame) {
              prevChar = char;
              prevRange.text += text;
              return;
            }

            // Otherwise, create a new range.
            prevChar = char;
            prevRange = { text: text, marks: marks };
            ranges.push(prevRange);
          }, []);
        }

      // PERF: convert the ranges to immutable objects after iterating.
      ranges = new _immutable.List(ranges.map(function (object) {
        return new _range2.default(object);
      }));

      // Return the ranges.
      return ranges;
    }

    /**
     * Check if the node has a node by `key`, to parallel other nodes.
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
     * Insert `text` at `index`.
     *
     * @param {Numbder} index
     * @param {String} text
     * @param {String} marks (optional)
     * @return {Text}
     */

  }, {
    key: 'insertText',
    value: function insertText(index, text, marks) {
      var characters = this.characters;

      var chars = _character2.default.createList(text.split('').map(function (char) {
        return { text: char, marks: marks };
      }));

      characters = characters.slice(0, index).concat(chars).concat(characters.slice(index));

      return this.set('characters', characters);
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Text}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      var key = (0, _generateKey2.default)();
      return this.set('key', key);
    }

    /**
     * Remove a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(index, length, mark) {
      var characters = this.characters.map(function (char, i) {
        if (i < index) return char;
        if (i >= index + length) return char;
        var _char2 = char,
            marks = _char2.marks;

        marks = marks.remove(mark);
        char = char.set('marks', marks);
        return char;
      });

      return this.set('characters', characters);
    }

    /**
     * Remove text from the text node at `index` for `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @return {Text}
     */

  }, {
    key: 'removeText',
    value: function removeText(index, length) {
      var characters = this.characters;

      var start = index;
      var end = index + length;
      characters = characters.filterNot(function (char, i) {
        return start <= i && i < end;
      });
      return this.set('characters', characters);
    }

    /**
     * Update a `mark` at `index` and `length` with `properties`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @param {Object} properties
     * @return {Text}
     */

  }, {
    key: 'updateMark',
    value: function updateMark(index, length, mark, properties) {
      var newMark = mark.merge(properties);

      var characters = this.characters.map(function (char, i) {
        if (i < index) return char;
        if (i >= index + length) return char;
        var _char3 = char,
            marks = _char3.marks;

        if (!marks.has(mark)) return char;
        marks = marks.remove(mark);
        marks = marks.add(newMark);
        char = char.set('marks', marks);
        return char;
      });

      return this.set('characters', characters);
    }

    /**
     * Validate the text node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Object|Void}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.__validate(this);
    }
  }, {
    key: 'kind',


    /**
     * Get the node's kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'text';
    }

    /**
     * Is the node empty?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get() {
      return this.text == '';
    }

    /**
     * Get the concatenated text of the node.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get() {
      return this.characters.reduce(function (string, char) {
        return string + char.text;
      }, '');
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Text` with `attrs`.
     *
     * @param {Object|Array|List|String|Text} attrs
     * @return {Text}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Text.isText(attrs)) {
        return attrs;
      }

      if (_immutable.List.isList(attrs) || Array.isArray(attrs)) {
        attrs = { ranges: attrs };
      }

      if (typeof attrs == 'string') {
        attrs = { ranges: [{ text: attrs }] };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var _attrs = attrs,
            characters = _attrs.characters,
            ranges = _attrs.ranges,
            key = _attrs.key;

        var chars = ranges ? ranges.map(_range2.default.create).reduce(function (l, r) {
          return l.concat(r.getCharacters());
        }, _character2.default.createList()) : _character2.default.createList(characters);

        var text = new Text({
          characters: chars,
          key: key || (0, _generateKey2.default)()
        });

        return text;
      }

      throw new Error('`Text.create` only accepts objects, arrays, strings or texts, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Texts` from an array.
     *
     * @param {Array} elements
     * @return {List<Text>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.List.isList(elements)) {
        return elements;
      }

      var list = new _immutable.List(elements.map(Text.create));
      return list;
    }

    /**
     * Check if a `value` is a `Text`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isText',
    value: function isText(value) {
      return !!(value && value[_modelTypes2.default.TEXT]);
    }

    /**
     * Check if a `value` is a list of texts.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isTextList',
    value: function isTextList(value) {
      return _immutable.List.isList(value) && value.every(function (item) {
        return Text.isText(item);
      });
    }

    /**
     * Deprecated.
     */

  }, {
    key: 'createFromString',
    value: function createFromString(string) {
      _logger2.default.deprecate('0.22.0', 'The `Text.createFromString(string)` method is deprecated, use `Text.create(string)` instead.');
      return Text.create(string);
    }

    /**
     * Deprecated.
     */

  }, {
    key: 'createFromRanges',
    value: function createFromRanges(ranges) {
      _logger2.default.deprecate('0.22.0', 'The `Text.createFromRanges(ranges)` method is deprecated, use `Text.create(ranges)` instead.');
      return Text.create(ranges);
    }
  }]);

  return Text;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Text.prototype[_modelTypes2.default.TEXT] = true;

/**
 * Memoize read methods.
 */

(0, _memoize2.default)(Text.prototype, ['getMarks', 'getMarksAsArray'], {
  takesArguments: false
});

(0, _memoize2.default)(Text.prototype, ['getDecorations', 'getDecorators', 'getMarksAtIndex', 'getRanges', 'validate'], {
  takesArguments: true
});

/**
 * Export.
 *
 * @type {Text}
 */

exports.default = Text;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdGV4dC5qcyJdLCJuYW1lcyI6WyJERUZBVUxUUyIsImNoYXJhY3RlcnMiLCJrZXkiLCJ1bmRlZmluZWQiLCJUZXh0IiwiaW5kZXgiLCJsZW5ndGgiLCJtYXJrIiwibWFwIiwiY2hhciIsImkiLCJtYXJrcyIsImFkZCIsInNldCIsImRlY29yYXRvcnMiLCJub2RlIiwic2l6ZSIsImRlY29yYXRvciIsImRlY29yYXRlZHMiLCJtZXJnZSIsInNjaGVtYSIsIl9fZ2V0RGVjb3JhdG9ycyIsImFycmF5IiwiZ2V0TWFya3NBc0FycmF5IiwicmVkdWNlIiwiY29uY2F0IiwidG9BcnJheSIsImNyZWF0ZVNldCIsImdldCIsImdldERlY29yYXRpb25zIiwicmFuZ2VzIiwicHJldkNoYXIiLCJwcmV2UmFuZ2UiLCJwdXNoIiwiZm9yRWFjaCIsInRleHQiLCJwcmV2TWFya3MiLCJpc1NhbWUiLCJvYmplY3QiLCJnZXROb2RlIiwiY2hhcnMiLCJjcmVhdGVMaXN0Iiwic3BsaXQiLCJzbGljZSIsInJlbW92ZSIsInN0YXJ0IiwiZW5kIiwiZmlsdGVyTm90IiwicHJvcGVydGllcyIsIm5ld01hcmsiLCJoYXMiLCJfX3ZhbGlkYXRlIiwic3RyaW5nIiwiYXR0cnMiLCJpc1RleHQiLCJpc0xpc3QiLCJBcnJheSIsImlzQXJyYXkiLCJjcmVhdGUiLCJsIiwiciIsImdldENoYXJhY3RlcnMiLCJFcnJvciIsImVsZW1lbnRzIiwibGlzdCIsInZhbHVlIiwiVEVYVCIsImV2ZXJ5IiwiaXRlbSIsImRlcHJlY2F0ZSIsInByb3RvdHlwZSIsInRha2VzQXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxXQUFXO0FBQ2ZDLGNBQVkscUJBREc7QUFFZkMsT0FBS0M7O0FBR1A7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a0UsU0FBTCxDQUFlLHFCQUFZSixJQUEzQixJQUFtQyxJQUFuQzs7QUFFQTs7OztBQUlBLHVCQUFROUQsS0FBS2tFLFNBQWIsRUFBd0IsQ0FDdEIsVUFEc0IsRUFFdEIsaUJBRnNCLENBQXhCLEVBR0c7QUFDREMsa0JBQWdCO0FBRGYsQ0FISDs7QUFPQSx1QkFBUW5FLEtBQUtrRSxTQUFiLEVBQXdCLENBQ3RCLGdCQURzQixFQUV0QixlQUZzQixFQUd0QixpQkFIc0IsRUFJdEIsV0FKc0IsRUFLdEIsVUFMc0IsQ0FBeEIsRUFNRztBQUNEQyxrQkFBZ0I7QUFEZixDQU5IOztBQVVBOzs7Ozs7a0JBTWVuRSxJIiwiZmlsZSI6InRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9jaGFyYWN0ZXInXG5pbXBvcnQgTWFyayBmcm9tICcuL21hcmsnXG5pbXBvcnQgUmFuZ2UgZnJvbSAnLi9yYW5nZSdcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgZ2VuZXJhdGVLZXkgZnJvbSAnLi4vdXRpbHMvZ2VuZXJhdGUta2V5J1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnaXMtcGxhaW4tb2JqZWN0J1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInXG5pbXBvcnQgbWVtb2l6ZSBmcm9tICcuLi91dGlscy9tZW1vaXplJ1xuaW1wb3J0IHsgTGlzdCwgUmVjb3JkLCBPcmRlcmVkU2V0LCBpcyB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBEZWZhdWx0IHByb3BlcnRpZXMuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgY2hhcmFjdGVyczogbmV3IExpc3QoKSxcbiAga2V5OiB1bmRlZmluZWQsXG59XG5cbi8qKlxuICogVGV4dC5cbiAqXG4gKiBAdHlwZSB7VGV4dH1cbiAqL1xuXG5jbGFzcyBUZXh0IGV4dGVuZHMgUmVjb3JkKERFRkFVTFRTKSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgVGV4dGAgd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheXxMaXN0fFN0cmluZ3xUZXh0fSBhdHRyc1xuICAgKiBAcmV0dXJuIHtUZXh0fVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlKGF0dHJzID0ge30pIHtcbiAgICBpZiAoVGV4dC5pc1RleHQoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAoTGlzdC5pc0xpc3QoYXR0cnMpIHx8IEFycmF5LmlzQXJyYXkoYXR0cnMpKSB7XG4gICAgICBhdHRycyA9IHsgcmFuZ2VzOiBhdHRycyB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhdHRycyA9PSAnc3RyaW5nJykge1xuICAgICAgYXR0cnMgPSB7IHJhbmdlczogW3sgdGV4dDogYXR0cnMgfV0gfVxuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3QgeyBjaGFyYWN0ZXJzLCByYW5nZXMsIGtleSB9ID0gYXR0cnNcbiAgICAgIGNvbnN0IGNoYXJzID0gcmFuZ2VzXG4gICAgICAgID8gcmFuZ2VzXG4gICAgICAgICAgICAubWFwKFJhbmdlLmNyZWF0ZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGwsIHIpID0+IGwuY29uY2F0KHIuZ2V0Q2hhcmFjdGVycygpKSwgQ2hhcmFjdGVyLmNyZWF0ZUxpc3QoKSlcbiAgICAgICAgOiBDaGFyYWN0ZXIuY3JlYXRlTGlzdChjaGFyYWN0ZXJzKVxuXG4gICAgICBjb25zdCB0ZXh0ID0gbmV3IFRleHQoe1xuICAgICAgICBjaGFyYWN0ZXJzOiBjaGFycyxcbiAgICAgICAga2V5OiBrZXkgfHwgZ2VuZXJhdGVLZXkoKSxcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBUZXh0LmNyZWF0ZVxcYCBvbmx5IGFjY2VwdHMgb2JqZWN0cywgYXJyYXlzLCBzdHJpbmdzIG9yIHRleHRzLCBidXQgeW91IHBhc3NlZCBpdDogJHthdHRyc31gKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGxpc3Qgb2YgYFRleHRzYCBmcm9tIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBlbGVtZW50c1xuICAgKiBAcmV0dXJuIHtMaXN0PFRleHQ+fVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlTGlzdChlbGVtZW50cyA9IFtdKSB7XG4gICAgaWYgKExpc3QuaXNMaXN0KGVsZW1lbnRzKSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRzXG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IG5ldyBMaXN0KGVsZW1lbnRzLm1hcChUZXh0LmNyZWF0ZSkpXG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBgVGV4dGAuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNUZXh0KHZhbHVlKSB7XG4gICAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlW01PREVMX1RZUEVTLlRFWFRdKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgYHZhbHVlYCBpcyBhIGxpc3TCoG9mIHRleHRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzVGV4dExpc3QodmFsdWUpIHtcbiAgICByZXR1cm4gTGlzdC5pc0xpc3QodmFsdWUpICYmIHZhbHVlLmV2ZXJ5KGl0ZW0gPT4gVGV4dC5pc1RleHQoaXRlbSkpXG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZC5cbiAgICovXG5cbiAgc3RhdGljIGNyZWF0ZUZyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4yMi4wJywgJ1RoZSBgVGV4dC5jcmVhdGVGcm9tU3RyaW5nKHN0cmluZylgIG1ldGhvZCBpcyBkZXByZWNhdGVkLCB1c2UgYFRleHQuY3JlYXRlKHN0cmluZylgIGluc3RlYWQuJylcbiAgICByZXR1cm4gVGV4dC5jcmVhdGUoc3RyaW5nKVxuICB9XG5cbiAgLyoqXG4gICAqIERlcHJlY2F0ZWQuXG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGVGcm9tUmFuZ2VzKHJhbmdlcykge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMjIuMCcsICdUaGUgYFRleHQuY3JlYXRlRnJvbVJhbmdlcyhyYW5nZXMpYCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgdXNlIGBUZXh0LmNyZWF0ZShyYW5nZXMpYCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIFRleHQuY3JlYXRlKHJhbmdlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5vZGUncyBraW5kLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBraW5kKCkge1xuICAgIHJldHVybiAndGV4dCdcbiAgfVxuXG4gIC8qKlxuICAgKiBJcyB0aGUgbm9kZSBlbXB0eT9cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgZ2V0IGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCA9PSAnJ1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29uY2F0ZW5hdGVkIHRleHQgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVycy5yZWR1Y2UoKHN0cmluZywgY2hhcikgPT4gc3RyaW5nICsgY2hhci50ZXh0LCAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgbWFya2AgYXQgYGluZGV4YCBhbmQgYGxlbmd0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gICAqIEBwYXJhbSB7TWFya30gbWFya1xuICAgKiBAcmV0dXJuIHtUZXh0fVxuICAgKi9cblxuICBhZGRNYXJrKGluZGV4LCBsZW5ndGgsIG1hcmspIHtcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gdGhpcy5jaGFyYWN0ZXJzLm1hcCgoY2hhciwgaSkgPT4ge1xuICAgICAgaWYgKGkgPCBpbmRleCkgcmV0dXJuIGNoYXJcbiAgICAgIGlmIChpID49IGluZGV4ICsgbGVuZ3RoKSByZXR1cm4gY2hhclxuICAgICAgbGV0IHsgbWFya3MgfSA9IGNoYXJcbiAgICAgIG1hcmtzID0gbWFya3MuYWRkKG1hcmspXG4gICAgICBjaGFyID0gY2hhci5zZXQoJ21hcmtzJywgbWFya3MpXG4gICAgICByZXR1cm4gY2hhclxuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpcy5zZXQoJ2NoYXJhY3RlcnMnLCBjaGFyYWN0ZXJzKVxuICB9XG5cbiAgLyoqXG4gICAqIERlcml2ZSBhIHNldCBvZiBkZWNvcmF0ZWQgY2hhcmFjdGVycyB3aXRoIGBkZWNvcmF0b3JzYC5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gZGVjb3JhdG9yc1xuICAgKiBAcmV0dXJuIHtMaXN0PENoYXJhY3Rlcj59XG4gICAqL1xuXG4gIGdldERlY29yYXRpb25zKGRlY29yYXRvcnMpIHtcbiAgICBjb25zdCBub2RlID0gdGhpc1xuICAgIGxldCB7IGNoYXJhY3RlcnMgfSA9IG5vZGVcbiAgICBpZiAoY2hhcmFjdGVycy5zaXplID09IDApIHJldHVybiBjaGFyYWN0ZXJzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY29yYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRlY29yYXRvciA9IGRlY29yYXRvcnNbaV1cbiAgICAgIGNvbnN0IGRlY29yYXRlZHMgPSBkZWNvcmF0b3Iobm9kZSlcbiAgICAgIGNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJzLm1lcmdlKGRlY29yYXRlZHMpXG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJhY3RlcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlY29yYXRpb25zIGZvciB0aGUgbm9kZSBmcm9tIGEgYHNjaGVtYWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hfSBzY2hlbWFcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGdldERlY29yYXRvcnMoc2NoZW1hKSB7XG4gICAgcmV0dXJuIHNjaGVtYS5fX2dldERlY29yYXRvcnModGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIG9mIHRoZSBtYXJrcyBvbiB0aGUgdGV4dC5cbiAgICpcbiAgICogQHJldHVybiB7T3JkZXJlZFNldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0TWFya3MoKSB7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmdldE1hcmtzQXNBcnJheSgpXG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkU2V0KGFycmF5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgb2YgdGhlIG1hcmtzIG9uIHRoZSB0ZXh0IGFzIGFuIGFycmF5XG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBnZXRNYXJrc0FzQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVycy5yZWR1Y2UoKGFycmF5LCBjaGFyKSA9PiB7XG4gICAgICByZXR1cm4gYXJyYXkuY29uY2F0KGNoYXIubWFya3MudG9BcnJheSgpKVxuICAgIH0sIFtdKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbWFya3Mgb24gdGhlIHRleHQgYXQgYGluZGV4YC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEByZXR1cm4ge1NldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0TWFya3NBdEluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID09IDApIHJldHVybiBNYXJrLmNyZWF0ZVNldCgpXG4gICAgY29uc3QgeyBjaGFyYWN0ZXJzIH0gPSB0aGlzXG4gICAgY29uc3QgY2hhciA9IGNoYXJhY3RlcnMuZ2V0KGluZGV4IC0gMSlcbiAgICBpZiAoIWNoYXIpIHJldHVybiBNYXJrLmNyZWF0ZVNldCgpXG4gICAgcmV0dXJuIGNoYXIubWFya3NcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBub2RlIGJ5IGBrZXlgLCB0byBwYXJhbGxlbCBvdGhlciBub2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gICAqL1xuXG4gIGdldE5vZGUoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMua2V5ID09IGtleVxuICAgICAgPyB0aGlzXG4gICAgICA6IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXJpdmUgdGhlIHJhbmdlcyBmb3IgYSBsaXN0IG9mIGBjaGFyYWN0ZXJzYC5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxWb2lkfSBkZWNvcmF0b3JzIChvcHRpb25hbClcbiAgICogQHJldHVybiB7TGlzdDxSYW5nZT59XG4gICAqL1xuXG4gIGdldFJhbmdlcyhkZWNvcmF0b3JzID0gW10pIHtcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gdGhpcy5nZXREZWNvcmF0aW9ucyhkZWNvcmF0b3JzKVxuICAgIGxldCByYW5nZXMgPSBbXVxuXG4gICAgLy8gUEVSRjogY2FjaGUgcHJldmlvdXMgdmFsdWVzIGZvciBmYXN0ZXIgbG9va3VwLlxuICAgIGxldCBwcmV2Q2hhclxuICAgIGxldCBwcmV2UmFuZ2VcblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBjaGFyYWN0ZXJzLCByZXR1cm4gb25lIGVtcHR5IHJhbmdlLlxuICAgIGlmIChjaGFyYWN0ZXJzLnNpemUgPT0gMCkge1xuICAgICAgcmFuZ2VzLnB1c2goe30pXG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBsb29wIHRoZSBjaGFyYWN0ZXJzIGFuZCBidWlsZCB0aGUgcmFuZ2VzLi4uXG4gICAgZWxzZSB7XG4gICAgICBjaGFyYWN0ZXJzLmZvckVhY2goKGNoYXIsIGkpID0+IHtcbiAgICAgICAgY29uc3QgeyBtYXJrcywgdGV4dCB9ID0gY2hhclxuXG4gICAgICAgIC8vIFRoZSBmaXJzdCBvbmUgY2FuIGFsd2F5cyBqdXN0IGJlIGNyZWF0ZWQuXG4gICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICBwcmV2Q2hhciA9IGNoYXJcbiAgICAgICAgICBwcmV2UmFuZ2UgPSB7IHRleHQsIG1hcmtzIH1cbiAgICAgICAgICByYW5nZXMucHVzaChwcmV2UmFuZ2UpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UsIGNvbXBhcmUgdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIG1hcmtzLlxuICAgICAgICBjb25zdCBwcmV2TWFya3MgPSBwcmV2Q2hhci5tYXJrc1xuICAgICAgICBjb25zdCBpc1NhbWUgPSBpcyhtYXJrcywgcHJldk1hcmtzKVxuXG4gICAgICAgIC8vIElmIHRoZSBtYXJrcyBhcmUgdGhlIHNhbWUsIGFkZCB0aGUgdGV4dCB0byB0aGUgcHJldmlvdXMgcmFuZ2UuXG4gICAgICAgIGlmIChpc1NhbWUpIHtcbiAgICAgICAgICBwcmV2Q2hhciA9IGNoYXJcbiAgICAgICAgICBwcmV2UmFuZ2UudGV4dCArPSB0ZXh0XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIG5ldyByYW5nZS5cbiAgICAgICAgcHJldkNoYXIgPSBjaGFyXG4gICAgICAgIHByZXZSYW5nZSA9IHsgdGV4dCwgbWFya3MgfVxuICAgICAgICByYW5nZXMucHVzaChwcmV2UmFuZ2UpXG4gICAgICB9LCBbXSlcbiAgICB9XG5cbiAgICAvLyBQRVJGOiBjb252ZXJ0IHRoZSByYW5nZXMgdG8gaW1tdXRhYmxlIG9iamVjdHMgYWZ0ZXIgaXRlcmF0aW5nLlxuICAgIHJhbmdlcyA9IG5ldyBMaXN0KHJhbmdlcy5tYXAob2JqZWN0ID0+IG5ldyBSYW5nZShvYmplY3QpKSlcblxuICAgIC8vIFJldHVybiB0aGUgcmFuZ2VzLlxuICAgIHJldHVybiByYW5nZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgbm9kZSBoYXMgYSBub2RlIGJ5IGBrZXlgLCB0byBwYXJhbGxlbCBvdGhlciBub2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBoYXNOb2RlKGtleSkge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0Tm9kZShrZXkpXG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGB0ZXh0YCBhdCBgaW5kZXhgLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJkZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtYXJrcyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1RleHR9XG4gICAqL1xuXG4gIGluc2VydFRleHQoaW5kZXgsIHRleHQsIG1hcmtzKSB7XG4gICAgbGV0IHsgY2hhcmFjdGVycyB9ID0gdGhpc1xuICAgIGNvbnN0IGNoYXJzID0gQ2hhcmFjdGVyLmNyZWF0ZUxpc3QodGV4dC5zcGxpdCgnJykubWFwKGNoYXIgPT4gKHsgdGV4dDogY2hhciwgbWFya3MgfSkpKVxuXG4gICAgY2hhcmFjdGVycyA9IGNoYXJhY3RlcnMuc2xpY2UoMCwgaW5kZXgpXG4gICAgICAuY29uY2F0KGNoYXJzKVxuICAgICAgLmNvbmNhdChjaGFyYWN0ZXJzLnNsaWNlKGluZGV4KSlcblxuICAgIHJldHVybiB0aGlzLnNldCgnY2hhcmFjdGVycycsIGNoYXJhY3RlcnMpXG4gIH1cblxuICAvKipcbiAgICogUmVnZW5lcmF0ZSB0aGUgbm9kZSdzIGtleS5cbiAgICpcbiAgICogQHJldHVybiB7VGV4dH1cbiAgICovXG5cbiAgcmVnZW5lcmF0ZUtleSgpIHtcbiAgICBjb25zdCBrZXkgPSBnZW5lcmF0ZUtleSgpXG4gICAgcmV0dXJuIHRoaXMuc2V0KCdrZXknLCBrZXkpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgYG1hcmtgIGF0IGBpbmRleGAgYW5kIGBsZW5ndGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICAgKiBAcGFyYW0ge01hcmt9IG1hcmtcbiAgICogQHJldHVybiB7VGV4dH1cbiAgICovXG5cbiAgcmVtb3ZlTWFyayhpbmRleCwgbGVuZ3RoLCBtYXJrKSB7XG4gICAgY29uc3QgY2hhcmFjdGVycyA9IHRoaXMuY2hhcmFjdGVycy5tYXAoKGNoYXIsIGkpID0+IHtcbiAgICAgIGlmIChpIDwgaW5kZXgpIHJldHVybiBjaGFyXG4gICAgICBpZiAoaSA+PSBpbmRleCArIGxlbmd0aCkgcmV0dXJuIGNoYXJcbiAgICAgIGxldCB7IG1hcmtzIH0gPSBjaGFyXG4gICAgICBtYXJrcyA9IG1hcmtzLnJlbW92ZShtYXJrKVxuICAgICAgY2hhciA9IGNoYXIuc2V0KCdtYXJrcycsIG1hcmtzKVxuICAgICAgcmV0dXJuIGNoYXJcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMuc2V0KCdjaGFyYWN0ZXJzJywgY2hhcmFjdGVycylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGV4dCBmcm9tIHRoZSB0ZXh0IG5vZGUgYXQgYGluZGV4YCBmb3IgYGxlbmd0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gICAqIEByZXR1cm4ge1RleHR9XG4gICAqL1xuXG4gIHJlbW92ZVRleHQoaW5kZXgsIGxlbmd0aCkge1xuICAgIGxldCB7IGNoYXJhY3RlcnMgfSA9IHRoaXNcbiAgICBjb25zdCBzdGFydCA9IGluZGV4XG4gICAgY29uc3QgZW5kID0gaW5kZXggKyBsZW5ndGhcbiAgICBjaGFyYWN0ZXJzID0gY2hhcmFjdGVycy5maWx0ZXJOb3QoKGNoYXIsIGkpID0+IHN0YXJ0IDw9IGkgJiYgaSA8IGVuZClcbiAgICByZXR1cm4gdGhpcy5zZXQoJ2NoYXJhY3RlcnMnLCBjaGFyYWN0ZXJzKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIGBtYXJrYCBhdCBgaW5kZXhgIGFuZCBgbGVuZ3RoYCB3aXRoIGBwcm9wZXJ0aWVzYC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGhcbiAgICogQHBhcmFtIHtNYXJrfSBtYXJrXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gICAqIEByZXR1cm4ge1RleHR9XG4gICAqL1xuXG4gIHVwZGF0ZU1hcmsoaW5kZXgsIGxlbmd0aCwgbWFyaywgcHJvcGVydGllcykge1xuICAgIGNvbnN0IG5ld01hcmsgPSBtYXJrLm1lcmdlKHByb3BlcnRpZXMpXG5cbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gdGhpcy5jaGFyYWN0ZXJzLm1hcCgoY2hhciwgaSkgPT4ge1xuICAgICAgaWYgKGkgPCBpbmRleCkgcmV0dXJuIGNoYXJcbiAgICAgIGlmIChpID49IGluZGV4ICsgbGVuZ3RoKSByZXR1cm4gY2hhclxuICAgICAgbGV0IHsgbWFya3MgfSA9IGNoYXJcbiAgICAgIGlmICghbWFya3MuaGFzKG1hcmspKSByZXR1cm4gY2hhclxuICAgICAgbWFya3MgPSBtYXJrcy5yZW1vdmUobWFyaylcbiAgICAgIG1hcmtzID0gbWFya3MuYWRkKG5ld01hcmspXG4gICAgICBjaGFyID0gY2hhci5zZXQoJ21hcmtzJywgbWFya3MpXG4gICAgICByZXR1cm4gY2hhclxuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpcy5zZXQoJ2NoYXJhY3RlcnMnLCBjaGFyYWN0ZXJzKVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSB0ZXh0IG5vZGUgYWdhaW5zdCBhIGBzY2hlbWFgLlxuICAgKlxuICAgKiBAcGFyYW0ge1NjaGVtYX0gc2NoZW1hXG4gICAqIEByZXR1cm4ge09iamVjdHxWb2lkfVxuICAgKi9cblxuICB2YWxpZGF0ZShzY2hlbWEpIHtcbiAgICByZXR1cm4gc2NoZW1hLl9fdmFsaWRhdGUodGhpcylcbiAgfVxuXG59XG5cbi8qKlxuICogQXR0YWNoIGEgcHNldWRvLXN5bWJvbCBmb3IgdHlwZSBjaGVja2luZy5cbiAqL1xuXG5UZXh0LnByb3RvdHlwZVtNT0RFTF9UWVBFUy5URVhUXSA9IHRydWVcblxuLyoqXG4gKiBNZW1vaXplIHJlYWQgbWV0aG9kcy5cbiAqL1xuXG5tZW1vaXplKFRleHQucHJvdG90eXBlLCBbXG4gICdnZXRNYXJrcycsXG4gICdnZXRNYXJrc0FzQXJyYXknLFxuXSwge1xuICB0YWtlc0FyZ3VtZW50czogZmFsc2UsXG59KVxuXG5tZW1vaXplKFRleHQucHJvdG90eXBlLCBbXG4gICdnZXREZWNvcmF0aW9ucycsXG4gICdnZXREZWNvcmF0b3JzJyxcbiAgJ2dldE1hcmtzQXRJbmRleCcsXG4gICdnZXRSYW5nZXMnLFxuICAndmFsaWRhdGUnXG5dLCB7XG4gIHRha2VzQXJndW1lbnRzOiB0cnVlLFxufSlcblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge1RleHR9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgVGV4dFxuIl19