'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

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
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false,
  marks: null

  /**
   * Selection.
   *
   * @type {Selection}
   */

};
var Selection = function (_Record) {
  _inherits(Selection, _Record);

  function Selection() {
    _classCallCheck(this, Selection);

    return _possibleConstructorReturn(this, (Selection.__proto__ || Object.getPrototypeOf(Selection)).apply(this, arguments));
  }

  _createClass(Selection, [{
    key: 'hasAnchorAtStartOf',


    /**
     * Check whether anchor point of the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    value: function hasAnchorAtStartOf(node) {
      // PERF: Do a check for a `0` offset first since it's quickest.
      if (this.anchorOffset != 0) return false;
      var first = getFirst(node);
      return this.anchorKey == first.key;
    }

    /**
     * Check whether anchor point of the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorAtEndOf',
    value: function hasAnchorAtEndOf(node) {
      var last = getLast(node);
      return this.anchorKey == last.key && this.anchorOffset == last.text.length;
    }

    /**
     * Check whether the anchor edge of a selection is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorBetween',
    value: function hasAnchorBetween(node, start, end) {
      return this.anchorOffset <= end && start <= this.anchorOffset && this.hasAnchorIn(node);
    }

    /**
     * Check whether the anchor edge of a selection is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorIn',
    value: function hasAnchorIn(node) {
      return node.kind == 'text' ? node.key == this.anchorKey : this.anchorKey != null && node.hasDescendant(this.anchorKey);
    }

    /**
     * Check whether focus point of the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtEndOf',
    value: function hasFocusAtEndOf(node) {
      var last = getLast(node);
      return this.focusKey == last.key && this.focusOffset == last.text.length;
    }

    /**
     * Check whether focus point of the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtStartOf',
    value: function hasFocusAtStartOf(node) {
      if (this.focusOffset != 0) return false;
      var first = getFirst(node);
      return this.focusKey == first.key;
    }

    /**
     * Check whether the focus edge of a selection is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusBetween',
    value: function hasFocusBetween(node, start, end) {
      return start <= this.focusOffset && this.focusOffset <= end && this.hasFocusIn(node);
    }

    /**
     * Check whether the focus edge of a selection is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusIn',
    value: function hasFocusIn(node) {
      return node.kind == 'text' ? node.key == this.focusKey : this.focusKey != null && node.hasDescendant(this.focusKey);
    }

    /**
     * Check whether the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtStartOf',
    value: function isAtStartOf(node) {
      return this.isCollapsed && this.hasAnchorAtStartOf(node);
    }

    /**
     * Check whether the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtEndOf',
    value: function isAtEndOf(node) {
      return this.isCollapsed && this.hasAnchorAtEndOf(node);
    }

    /**
     * Focus the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'focus',
    value: function focus() {
      return this.merge({
        isFocused: true
      });
    }

    /**
     * Blur the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'blur',
    value: function blur() {
      return this.merge({
        isFocused: false
      });
    }

    /**
     * Unset the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'deselect',
    value: function deselect() {
      return this.merge({
        anchorKey: null,
        anchorOffset: 0,
        focusKey: null,
        focusOffset: 0,
        isFocused: false,
        isBackward: false
      });
    }

    /**
     * Flip the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'flip',
    value: function flip() {
      return this.merge({
        anchorKey: this.focusKey,
        anchorOffset: this.focusOffset,
        focusKey: this.anchorKey,
        focusOffset: this.anchorOffset,
        isBackward: this.isBackward == null ? null : !this.isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveAnchor',
    value: function moveAnchor() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      var anchorOffset = this.anchorOffset + n;
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: anchorKey == focusKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveFocus',
    value: function moveFocus() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          focusKey = this.focusKey,
          isBackward = this.isBackward;

      var focusOffset = this.focusOffset + n;
      return this.merge({
        focusOffset: focusOffset,
        isBackward: focusKey == anchorKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the selection's anchor point to a `key` and `offset`.
     *
     * @param {String} key
     * @param {Number} offset
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorTo',
    value: function moveAnchorTo(key, offset) {
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      return this.merge({
        anchorKey: key,
        anchorOffset: offset,
        isBackward: key == focusKey ? offset > focusOffset : key == anchorKey ? isBackward : null
      });
    }

    /**
     * Move the selection's focus point to a `key` and `offset`.
     *
     * @param {String} key
     * @param {Number} offset
     * @return {Selection}
     */

  }, {
    key: 'moveFocusTo',
    value: function moveFocusTo(key, offset) {
      var focusKey = this.focusKey,
          anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          isBackward = this.isBackward;

      return this.merge({
        focusKey: key,
        focusOffset: offset,
        isBackward: key == anchorKey ? anchorOffset > offset : key == focusKey ? isBackward : null
      });
    }

    /**
     * Move the selection to `anchorOffset`.
     *
     * @param {Number} anchorOffset
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorOffsetTo',
    value: function moveAnchorOffsetTo(anchorOffset) {
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: this.anchorKey == this.focusKey ? anchorOffset > this.focusOffset : this.isBackward
      });
    }

    /**
     * Move the selection to `focusOffset`.
     *
     * @param {Number} focusOffset
     * @return {Selection}
     */

  }, {
    key: 'moveFocusOffsetTo',
    value: function moveFocusOffsetTo(focusOffset) {
      return this.merge({
        focusOffset: focusOffset,
        isBackward: this.anchorKey == this.focusKey ? this.anchorOffset > focusOffset : this.isBackward
      });
    }

    /**
     * Move the selection to `anchorOffset` and `focusOffset`.
     *
     * @param {Number} anchorOffset
     * @param {Number} focusOffset (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveOffsetsTo',
    value: function moveOffsetsTo(anchorOffset) {
      var focusOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchorOffset;

      return this.moveAnchorOffsetTo(anchorOffset).moveFocusOffsetTo(focusOffset);
    }

    /**
     * Move the focus point to the anchor point.
     *
     * @return {Selection}
     */

  }, {
    key: 'moveToAnchor',
    value: function moveToAnchor() {
      return this.moveFocusTo(this.anchorKey, this.anchorOffset);
    }

    /**
     * Move the anchor point to the focus point.
     *
     * @return {Selection}
     */

  }, {
    key: 'moveToFocus',
    value: function moveToFocus() {
      return this.moveAnchorTo(this.focusKey, this.focusOffset);
    }

    /**
     * Move the selection's anchor point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorToStartOf',
    value: function moveAnchorToStartOf(node) {
      node = getFirst(node);
      return this.moveAnchorTo(node.key, 0);
    }

    /**
     * Move the selection's anchor point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorToEndOf',
    value: function moveAnchorToEndOf(node) {
      node = getLast(node);
      return this.moveAnchorTo(node.key, node.text.length);
    }

    /**
     * Move the selection's focus point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveFocusToStartOf',
    value: function moveFocusToStartOf(node) {
      node = getFirst(node);
      return this.moveFocusTo(node.key, 0);
    }

    /**
     * Move the selection's focus point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveFocusToEndOf',
    value: function moveFocusToEndOf(node) {
      node = getLast(node);
      return this.moveFocusTo(node.key, node.text.length);
    }

    /**
     * Move to the entire range of `start` and `end` nodes.
     *
     * @param {Node} start
     * @param {Node} end (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveToRangeOf',
    value: function moveToRangeOf(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;

      return this.moveAnchorToStartOf(start).moveFocusToEndOf(end);
    }

    /**
     * Normalize the selection, relative to a `node`, ensuring that the anchor
     * and focus nodes of the selection always refer to leaf text nodes.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'normalize',
    value: function normalize(node) {
      var selection = this;
      var anchorKey = selection.anchorKey,
          anchorOffset = selection.anchorOffset,
          focusKey = selection.focusKey,
          focusOffset = selection.focusOffset,
          isBackward = selection.isBackward;

      // If the selection is unset, make sure it is properly zeroed out.

      if (anchorKey == null || focusKey == null) {
        return selection.merge({
          anchorKey: null,
          anchorOffset: 0,
          focusKey: null,
          focusOffset: 0,
          isBackward: false
        });
      }

      // Get the anchor and focus nodes.
      var anchorNode = node.getDescendant(anchorKey);
      var focusNode = node.getDescendant(focusKey);

      // If the selection is malformed, warn and zero it out.
      if (!anchorNode || !focusNode) {
        _logger2.default.warn('The selection was invalid and was reset. The selection in question was:', selection);
        var first = node.getFirstText();
        return selection.merge({
          anchorKey: first ? first.key : null,
          anchorOffset: 0,
          focusKey: first ? first.key : null,
          focusOffset: 0,
          isBackward: false
        });
      }

      // If the anchor node isn't a text node, match it to one.
      if (anchorNode.kind != 'text') {
        _logger2.default.warn('The selection anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode);
        var anchorText = anchorNode.getTextAtOffset(anchorOffset);
        var offset = anchorNode.getOffset(anchorText.key);
        anchorOffset = anchorOffset - offset;
        anchorNode = anchorText;
      }

      // If the focus node isn't a text node, match it to one.
      if (focusNode.kind != 'text') {
        _logger2.default.warn('The selection focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode);
        var focusText = focusNode.getTextAtOffset(focusOffset);
        var _offset = focusNode.getOffset(focusText.key);
        focusOffset = focusOffset - _offset;
        focusNode = focusText;
      }

      // If `isBackward` is not set, derive it.
      if (isBackward == null) {
        if (anchorNode.key === focusNode.key) {
          isBackward = anchorOffset > focusOffset;
        } else {
          isBackward = !node.areDescendantsSorted(anchorNode.key, focusNode.key);
        }
      }

      // Merge in any updated properties.
      return selection.merge({
        anchorKey: anchorNode.key,
        anchorOffset: anchorOffset,
        focusKey: focusNode.key,
        focusOffset: focusOffset,
        isBackward: isBackward
      });
    }

    /**
     * Unset the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'unset',
    value: function unset() {
      _logger2.default.deprecate('0.17.0', 'The `Selection.unset` method is deprecated, please switch to using `Selection.deselect` instead.');
      return this.deselect();
    }

    /**
     * Move the selection forward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveForward',
    value: function moveForward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveForward(n)` method is deprecated, please switch to using `Selection.move(n)` instead.');
      return this.move(n);
    }

    /**
     * Move the selection backward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveBackward',
    value: function moveBackward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveBackward(n)` method is deprecated, please switch to using `Selection.move(-n)` (with a negative number) instead.');
      return this.move(0 - n);
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorOffset',
    value: function moveAnchorOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveAnchorOffset(n)` method is deprecated, please switch to using `Selection.moveAnchor(n)` instead.');
      return this.moveAnchor(n);
    }

    /**
     * Move the focus offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveFocusOffset',
    value: function moveFocusOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveFocusOffset(n)` method is deprecated, please switch to using `Selection.moveFocus(n)` instead.');
      return this.moveFocus(n);
    }

    /**
     * Move the start offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveStartOffset',
    value: function moveStartOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveStartOffset(n)` method is deprecated, please switch to using `Selection.moveStart(n)` instead.');
      return this.moveStart(n);
    }

    /**
     * Move the focus offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveEndOffset',
    value: function moveEndOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveEndOffset(n)` method is deprecated, please switch to using `Selection.moveEnd(n)` instead.');
      return this.moveEnd(n);
    }

    /**
     * Extend the focus point forward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'extendForward',
    value: function extendForward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.extendForward(n)` method is deprecated, please switch to using `Selection.extend(n)` instead.');
      return this.extend(n);
    }

    /**
     * Extend the focus point backward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'extendBackward',
    value: function extendBackward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _logger2.default.deprecate('0.17.0', 'The `Selection.extendBackward(n)` method is deprecated, please switch to using `Selection.extend(-n)` (with a negative number) instead.');
      return this.extend(0 - n);
    }

    /**
     * Move the selection to `anchorOffset` and `focusOffset`.
     *
     * @param {Number} anchorOffset
     * @param {Number} focusOffset (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveToOffsets',
    value: function moveToOffsets(anchorOffset) {
      var focusOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchorOffset;

      _logger2.default.deprecate('0.17.0', 'The `Selection.moveToOffsets` method is deprecated, please switch to using `Selection.moveOffsetsTo` instead.');
      return this.moveOffsetsTo(anchorOffset, focusOffset);
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'selection';
    }

    /**
     * Check whether the selection is blurred.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get() {
      return !this.isFocused;
    }

    /**
     * Check whether the selection is collapsed.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get() {
      return this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset;
    }

    /**
     * Check whether the selection is expanded.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get() {
      return !this.isCollapsed;
    }

    /**
     * Check whether the selection is forward.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get() {
      return this.isBackward == null ? null : !this.isBackward;
    }

    /**
     * Check whether the selection's keys are set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isSet',
    get: function get() {
      return this.anchorKey != null && this.focusKey != null;
    }

    /**
     * Check whether the selection's keys are not set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isUnset',
    get: function get() {
      return !this.isSet;
    }

    /**
     * Get the start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get() {
      return this.isBackward ? this.focusKey : this.anchorKey;
    }

    /**
     * Get the start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get() {
      return this.isBackward ? this.focusOffset : this.anchorOffset;
    }

    /**
     * Get the end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get() {
      return this.isBackward ? this.anchorKey : this.focusKey;
    }

    /**
     * Get the end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get() {
      return this.isBackward ? this.anchorOffset : this.focusOffset;
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Selection` with `attrs`.
     *
     * @param {Object|Selection} attrs
     * @return {Selection}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Selection.isSelection(attrs)) {
        return attrs;
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var selection = new Selection(attrs);
        return selection;
      }

      throw new Error('`Selection.create` only accepts objects or selections, but you passed it: ' + attrs);
    }

    /**
     * Create a dictionary of settable selection properties from `attrs`.
     *
     * @param {Object|String|Selection} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Selection.isSelection(attrs)) {
        return {
          anchorKey: attrs.anchorKey,
          anchorOffset: attrs.anchorOffset,
          focusKey: attrs.focusKey,
          focusOffset: attrs.focusOffset,
          isBackward: attrs.isBackward,
          isFocused: attrs.isFocused,
          marks: attrs.marks
        };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var props = {};
        if ('anchorKey' in attrs) props.anchorKey = attrs.anchorKey;
        if ('anchorOffset' in attrs) props.anchorOffset = attrs.anchorOffset;
        if ('focusKey' in attrs) props.focusKey = attrs.focusKey;
        if ('focusOffset' in attrs) props.focusOffset = attrs.focusOffset;
        if ('isBackward' in attrs) props.isBackward = attrs.isBackward;
        if ('isFocused' in attrs) props.isFocused = attrs.isFocused;
        if ('marks' in attrs) props.marks = attrs.marks;
        return props;
      }

      throw new Error('`Selection.createProperties` only accepts objects or selections, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `Selection`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isSelection',
    value: function isSelection(value) {
      return !!(value && value[_modelTypes2.default.SELECTION]);
    }
  }]);

  return Selection;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Selection.prototype[_modelTypes2.default.SELECTION] = true;

/**
 * Mix in some "move" convenience methods.
 */

var MOVE_METHODS = [['move', ''], ['move', 'To'], ['move', 'ToStartOf'], ['move', 'ToEndOf']];

MOVE_METHODS.forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      p = _ref2[0],
      s = _ref2[1];

  Selection.prototype['' + p + s] = function () {
    var _ref3;

    return (_ref3 = this[p + 'Anchor' + s].apply(this, arguments))[p + 'Focus' + s].apply(_ref3, arguments);
  };
});

/**
 * Mix in the "start", "end" and "edge" convenience methods.
 */

var EDGE_METHODS = [['has', 'AtStartOf', true], ['has', 'AtEndOf', true], ['has', 'Between', true], ['has', 'In', true], ['collapseTo', ''], ['move', ''], ['moveTo', ''], ['move', 'To'], ['move', 'OffsetTo']];

EDGE_METHODS.forEach(function (_ref4) {
  var _ref5 = _slicedToArray(_ref4, 3),
      p = _ref5[0],
      s = _ref5[1],
      hasEdge = _ref5[2];

  var anchor = p + 'Anchor' + s;
  var focus = p + 'Focus' + s;

  Selection.prototype[p + 'Start' + s] = function () {
    return this.isBackward ? this[focus].apply(this, arguments) : this[anchor].apply(this, arguments);
  };

  Selection.prototype[p + 'End' + s] = function () {
    return this.isBackward ? this[anchor].apply(this, arguments) : this[focus].apply(this, arguments);
  };

  if (hasEdge) {
    Selection.prototype[p + 'Edge' + s] = function () {
      return this[anchor].apply(this, arguments) || this[focus].apply(this, arguments);
    };
  }
});

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

var ALIAS_METHODS = [['collapseTo', 'moveTo'], ['collapseToAnchor', 'moveToAnchor'], ['collapseToFocus', 'moveToFocus'], ['collapseToStart', 'moveToStart'], ['collapseToEnd', 'moveToEnd'], ['collapseToStartOf', 'moveToStartOf'], ['collapseToEndOf', 'moveToEndOf'], ['extend', 'moveFocus'], ['extendTo', 'moveFocusTo'], ['extendToStartOf', 'moveFocusToStartOf'], ['extendToEndOf', 'moveFocusToEndOf']];

ALIAS_METHODS.forEach(function (_ref6) {
  var _ref7 = _slicedToArray(_ref6, 2),
      alias = _ref7[0],
      method = _ref7[1];

  Selection.prototype[alias] = function () {
    return this[method].apply(this, arguments);
  };
});

/**
 * Get the first text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getFirst(node) {
  return node.kind == 'text' ? node : node.getFirstText();
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLast(node) {
  return node.kind == 'text' ? node : node.getLastText();
}

/**
 * Export.
 *
 * @type {Selection}
 */

exports.default = Selection;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc2VsZWN0aW9uLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRTIiwiYW5jaG9yS2V5IiwiYW5jaG9yT2Zmc2V0IiwiZm9jdXNLZXkiLCJmb2N1c09mZnNldCIsImlzQmFja3dhcmQiLCJpc0ZvY3VzZWQiLCJtYXJrcyIsIlNlbGVjdGlvbiIsIm5vZGUiLCJmaXJzdCIsImdldEZpcnN0Iiwia2V5IiwibGFzdCIsImdldExhc3QiLCJ0ZXh0IiwibGVuZ3RoIiwic3RhcnQiLCJlbmQiLCJoYXNBbmNob3JJbiIsImtpbmQiLCJoYXNEZXNjZW5kYW50IiwiaGFzRm9jdXNJbiIsImlzQ29sbGFwc2VkIiwiaGFzQW5jaG9yQXRTdGFydE9mIiwiaGFzQW5jaG9yQXRFbmRPZiIsIm1lcmdlIiwibiIsIm9mZnNldCIsIm1vdmVBbmNob3JPZmZzZXRUbyIsIm1vdmVGb2N1c09mZnNldFRvIiwibW92ZUZvY3VzVG8iLCJtb3ZlQW5jaG9yVG8iLCJtb3ZlQW5jaG9yVG9TdGFydE9mIiwibW92ZUZvY3VzVG9FbmRPZiIsInNlbGVjdGlvbiIsImFuY2hvck5vZGUiLCJnZXREZXNjZW5kYW50IiwiZm9jdXNOb2RlIiwid2FybiIsImdldEZpcnN0VGV4dCIsImFuY2hvclRleHQiLCJnZXRUZXh0QXRPZmZzZXQiLCJnZXRPZmZzZXQiLCJmb2N1c1RleHQiLCJhcmVEZXNjZW5kYW50c1NvcnRlZCIsImRlcHJlY2F0ZSIsImRlc2VsZWN0IiwibW92ZSIsIm1vdmVBbmNob3IiLCJtb3ZlRm9jdXMiLCJtb3ZlU3RhcnQiLCJtb3ZlRW5kIiwiZXh0ZW5kIiwibW92ZU9mZnNldHNUbyIsImlzU2V0IiwiYXR0cnMiLCJpc1NlbGVjdGlvbiIsIkVycm9yIiwicHJvcHMiLCJ2YWx1ZSIsIlNFTEVDVElPTiIsInByb3RvdHlwZSIsIk1PVkVfTUVUSE9EUyIsImZvckVhY2giLCJwIiwicyIsIkVER0VfTUVUSE9EUyIsImhhc0VkZ2UiLCJhbmNob3IiLCJmb2N1cyIsIkFMSUFTX01FVEhPRFMiLCJhbGlhcyIsIm1ldGhvZCIsImdldExhc3RUZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsV0FBVztBQUNmQyxhQUFXLElBREk7QUFFZkMsZ0JBQWMsQ0FGQztBQUdmQyxZQUFVLElBSEs7QUFJZkMsZUFBYSxDQUpFO0FBS2ZDLGNBQVksSUFMRztBQU1mQyxhQUFXLEtBTkk7QUFPZkMsU0FBTzs7QUFHVDs7Ozs7O0FBVmlCLENBQWpCO0lBZ0JNQyxTOzs7Ozs7Ozs7Ozs7O0FBcUxKOzs7Ozs7O3VDQU9tQkMsSSxFQUFNO0FBQ3ZCO0FBQ0EsVUFBSSxLQUFLUCxZQUFMLElBQXFCLENBQXpCLEVBQTRCLE9BQU8sS0FBUDtBQUM1QixVQUFNUSxRQUFRQyxTQUFTRixJQUFULENBQWQ7QUFDQSxhQUFPLEtBQUtSLFNBQUwsSUFBa0JTLE1BQU1FLEdBQS9CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztxQ0FPaUJILEksRUFBTTtBQUNyQixVQUFNSSxPQUFPQyxRQUFRTCxJQUFSLENBQWI7QUFDQSxhQUFPLEtBQUtSLFNBQUwsSUFBa0JZLEtBQUtELEdBQXZCLElBQThCLEtBQUtWLFlBQUwsSUFBcUJXLEtBQUtFLElBQUwsQ0FBVUMsTUFBcEU7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3FDQVVpQlAsSSxFQUFNUSxLLEVBQU9DLEcsRUFBSztBQUNqQyxhQUNFLEtBQUtoQixZQUFMLElBQXFCZ0IsR0FBckIsSUFDQUQsU0FBUyxLQUFLZixZQURkLElBRUEsS0FBS2lCLFdBQUwsQ0FBaUJWLElBQWpCLENBSEY7QUFLRDs7QUFFRDs7Ozs7Ozs7O2dDQU9ZQSxJLEVBQU07QUFDaEIsYUFBT0EsS0FBS1csSUFBTCxJQUFhLE1BQWIsR0FDSFgsS0FBS0csR0FBTCxJQUFZLEtBQUtYLFNBRGQsR0FFSCxLQUFLQSxTQUFMLElBQWtCLElBQWxCLElBQTBCUSxLQUFLWSxhQUFMLENBQW1CLEtBQUtwQixTQUF4QixDQUY5QjtBQUdEOztBQUVEOzs7Ozs7Ozs7b0NBT2dCUSxJLEVBQU07QUFDcEIsVUFBTUksT0FBT0MsUUFBUUwsSUFBUixDQUFiO0FBQ0EsYUFBTyxLQUFLTixRQUFMLElBQWlCVSxLQUFLRCxHQUF0QixJQUE2QixLQUFLUixXQUFMLElBQW9CUyxLQUFLRSxJQUFMLENBQVVDLE1BQWxFO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztzQ0FPa0JQLEksRUFBTTtBQUN0QixVQUFJLEtBQUtMLFdBQUwsSUFBb0IsQ0FBeEIsRUFBMkIsT0FBTyxLQUFQO0FBQzNCLFVBQU1NLFFBQVFDLFNBQVNGLElBQVQsQ0FBZDtBQUNBLGFBQU8sS0FBS04sUUFBTCxJQUFpQk8sTUFBTUUsR0FBOUI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O29DQVVnQkgsSSxFQUFNUSxLLEVBQU9DLEcsRUFBSztBQUNoQyxhQUNFRCxTQUFTLEtBQUtiLFdBQWQsSUFDQSxLQUFLQSxXQUFMLElBQW9CYyxHQURwQixJQUVBLEtBQUtJLFVBQUwsQ0FBZ0JiLElBQWhCLENBSEY7QUFLRDs7QUFFRDs7Ozs7Ozs7OytCQU9XQSxJLEVBQU07QUFDZixhQUFPQSxLQUFLVyxJQUFMLElBQWEsTUFBYixHQUNIWCxLQUFLRyxHQUFMLElBQVksS0FBS1QsUUFEZCxHQUVILEtBQUtBLFFBQUwsSUFBaUIsSUFBakIsSUFBeUJNLEtBQUtZLGFBQUwsQ0FBbUIsS0FBS2xCLFFBQXhCLENBRjdCO0FBR0Q7O0FBRUQ7Ozs7Ozs7OztnQ0FPWU0sSSxFQUFNO0FBQ2hCLGFBQU8sS0FBS2MsV0FBTCxJQUFvQixLQUFLQyxrQkFBTCxDQUF3QmYsSUFBeEIsQ0FBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7OzhCQU9VQSxJLEVBQU07QUFDZCxhQUFPLEtBQUtjLFdBQUwsSUFBb0IsS0FBS0UsZ0JBQUwsQ0FBc0JoQixJQUF0QixDQUEzQjtBQUNEOztBQUVEOzs7Ozs7Ozs0QkFNUTtBQUNOLGFBQU8sS0FBS2lCLEtBQUwsQ0FBVztBQUNoQnBCLG1CQUFXO0FBREssT0FBWCxDQUFQO0FBR0Q7O0FBRUQ7Ozs7Ozs7OzJCQU1PO0FBQ0wsYUFBTyxLQUFLb0IsS0FBTCxDQUFXO0FBQ2hCcEIsbUJBQVc7QUFESyxPQUFYLENBQVA7QUFHRDs7QUFFRDs7Ozs7Ozs7K0JBTVc7QUFDVCxhQUFPLEtBQUtvQixLQUFMLENBQVc7QUFDaEJ6QixtQkFBVyxJQURLO0FBRWhCQyxzQkFBYyxDQUZFO0FBR2hCQyxrQkFBVSxJQUhNO0FBSWhCQyxxQkFBYSxDQUpHO0FBS2hCRSxtQkFBVyxLQUxLO0FBTWhCRCxvQkFBWTtBQU5JLE9BQVgsQ0FBUDtBQVFEOztBQUVEOzs7Ozs7OzsyQkFNTztBQUNMLGFBQU8sS0FBS3FCLEtBQUwsQ0FBVztBQUNoQnpCLG1CQUFXLEtBQUtFLFFBREE7QUFFaEJELHNCQUFjLEtBQUtFLFdBRkg7QUFHaEJELGtCQUFVLEtBQUtGLFNBSEM7QUFJaEJHLHFCQUFhLEtBQUtGLFlBSkY7QUFLaEJHLG9CQUFZLEtBQUtBLFVBQUwsSUFBbUIsSUFBbkIsR0FBMEIsSUFBMUIsR0FBaUMsQ0FBQyxLQUFLQTtBQUxuQyxPQUFYLENBQVA7QUFPRDs7QUFFRDs7Ozs7Ozs7O2lDQU9rQjtBQUFBLFVBQVBzQixDQUFPLHVFQUFILENBQUc7QUFBQSxVQUNSMUIsU0FEUSxHQUN5QyxJQUR6QyxDQUNSQSxTQURRO0FBQUEsVUFDR0UsUUFESCxHQUN5QyxJQUR6QyxDQUNHQSxRQURIO0FBQUEsVUFDYUMsV0FEYixHQUN5QyxJQUR6QyxDQUNhQSxXQURiO0FBQUEsVUFDMEJDLFVBRDFCLEdBQ3lDLElBRHpDLENBQzBCQSxVQUQxQjs7QUFFaEIsVUFBTUgsZUFBZSxLQUFLQSxZQUFMLEdBQW9CeUIsQ0FBekM7QUFDQSxhQUFPLEtBQUtELEtBQUwsQ0FBVztBQUNoQnhCLGtDQURnQjtBQUVoQkcsb0JBQVlKLGFBQWFFLFFBQWIsR0FDUkQsZUFBZUUsV0FEUCxHQUVSQztBQUpZLE9BQVgsQ0FBUDtBQU1EOztBQUVEOzs7Ozs7Ozs7Z0NBT2lCO0FBQUEsVUFBUHNCLENBQU8sdUVBQUgsQ0FBRztBQUFBLFVBQ1AxQixTQURPLEdBQzJDLElBRDNDLENBQ1BBLFNBRE87QUFBQSxVQUNJQyxZQURKLEdBQzJDLElBRDNDLENBQ0lBLFlBREo7QUFBQSxVQUNrQkMsUUFEbEIsR0FDMkMsSUFEM0MsQ0FDa0JBLFFBRGxCO0FBQUEsVUFDNEJFLFVBRDVCLEdBQzJDLElBRDNDLENBQzRCQSxVQUQ1Qjs7QUFFZixVQUFNRCxjQUFjLEtBQUtBLFdBQUwsR0FBbUJ1QixDQUF2QztBQUNBLGFBQU8sS0FBS0QsS0FBTCxDQUFXO0FBQ2hCdEIsZ0NBRGdCO0FBRWhCQyxvQkFBWUYsWUFBWUYsU0FBWixHQUNSQyxlQUFlRSxXQURQLEdBRVJDO0FBSlksT0FBWCxDQUFQO0FBTUQ7O0FBRUQ7Ozs7Ozs7Ozs7aUNBUWFPLEcsRUFBS2dCLE0sRUFBUTtBQUFBLFVBQ2hCM0IsU0FEZ0IsR0FDaUMsSUFEakMsQ0FDaEJBLFNBRGdCO0FBQUEsVUFDTEUsUUFESyxHQUNpQyxJQURqQyxDQUNMQSxRQURLO0FBQUEsVUFDS0MsV0FETCxHQUNpQyxJQURqQyxDQUNLQSxXQURMO0FBQUEsVUFDa0JDLFVBRGxCLEdBQ2lDLElBRGpDLENBQ2tCQSxVQURsQjs7QUFFeEIsYUFBTyxLQUFLcUIsS0FBTCxDQUFXO0FBQ2hCekIsbUJBQVdXLEdBREs7QUFFaEJWLHNCQUFjMEIsTUFGRTtBQUdoQnZCLG9CQUFZTyxPQUFPVCxRQUFQLEdBQ1J5QixTQUFTeEIsV0FERCxHQUVSUSxPQUFPWCxTQUFQLEdBQW1CSSxVQUFuQixHQUFnQztBQUxwQixPQUFYLENBQVA7QUFPRDs7QUFFRDs7Ozs7Ozs7OztnQ0FRWU8sRyxFQUFLZ0IsTSxFQUFRO0FBQUEsVUFDZnpCLFFBRGUsR0FDbUMsSUFEbkMsQ0FDZkEsUUFEZTtBQUFBLFVBQ0xGLFNBREssR0FDbUMsSUFEbkMsQ0FDTEEsU0FESztBQUFBLFVBQ01DLFlBRE4sR0FDbUMsSUFEbkMsQ0FDTUEsWUFETjtBQUFBLFVBQ29CRyxVQURwQixHQUNtQyxJQURuQyxDQUNvQkEsVUFEcEI7O0FBRXZCLGFBQU8sS0FBS3FCLEtBQUwsQ0FBVztBQUNoQnZCLGtCQUFVUyxHQURNO0FBRWhCUixxQkFBYXdCLE1BRkc7QUFHaEJ2QixvQkFBWU8sT0FBT1gsU0FBUCxHQUNSQyxlQUFlMEIsTUFEUCxHQUVSaEIsT0FBT1QsUUFBUCxHQUFrQkUsVUFBbEIsR0FBK0I7QUFMbkIsT0FBWCxDQUFQO0FBT0Q7O0FBRUQ7Ozs7Ozs7Ozt1Q0FPbUJILFksRUFBYztBQUMvQixhQUFPLEtBQUt3QixLQUFMLENBQVc7QUFDaEJ4QixrQ0FEZ0I7QUFFaEJHLG9CQUFZLEtBQUtKLFNBQUwsSUFBa0IsS0FBS0UsUUFBdkIsR0FDUkQsZUFBZSxLQUFLRSxXQURaLEdBRVIsS0FBS0M7QUFKTyxPQUFYLENBQVA7QUFNRDs7QUFFRDs7Ozs7Ozs7O3NDQU9rQkQsVyxFQUFhO0FBQzdCLGFBQU8sS0FBS3NCLEtBQUwsQ0FBVztBQUNoQnRCLGdDQURnQjtBQUVoQkMsb0JBQVksS0FBS0osU0FBTCxJQUFrQixLQUFLRSxRQUF2QixHQUNSLEtBQUtELFlBQUwsR0FBb0JFLFdBRFosR0FFUixLQUFLQztBQUpPLE9BQVgsQ0FBUDtBQU1EOztBQUVEOzs7Ozs7Ozs7O2tDQVFjSCxZLEVBQTBDO0FBQUEsVUFBNUJFLFdBQTRCLHVFQUFkRixZQUFjOztBQUN0RCxhQUFPLEtBQ0oyQixrQkFESSxDQUNlM0IsWUFEZixFQUVKNEIsaUJBRkksQ0FFYzFCLFdBRmQsQ0FBUDtBQUdEOztBQUVEOzs7Ozs7OzttQ0FNZTtBQUNiLGFBQU8sS0FBSzJCLFdBQUwsQ0FBaUIsS0FBSzlCLFNBQXRCLEVBQWlDLEtBQUtDLFlBQXRDLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7a0NBTWM7QUFDWixhQUFPLEtBQUs4QixZQUFMLENBQWtCLEtBQUs3QixRQUF2QixFQUFpQyxLQUFLQyxXQUF0QyxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3Q0FPb0JLLEksRUFBTTtBQUN4QkEsYUFBT0UsU0FBU0YsSUFBVCxDQUFQO0FBQ0EsYUFBTyxLQUFLdUIsWUFBTCxDQUFrQnZCLEtBQUtHLEdBQXZCLEVBQTRCLENBQTVCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3NDQU9rQkgsSSxFQUFNO0FBQ3RCQSxhQUFPSyxRQUFRTCxJQUFSLENBQVA7QUFDQSxhQUFPLEtBQUt1QixZQUFMLENBQWtCdkIsS0FBS0csR0FBdkIsRUFBNEJILEtBQUtNLElBQUwsQ0FBVUMsTUFBdEMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7dUNBT21CUCxJLEVBQU07QUFDdkJBLGFBQU9FLFNBQVNGLElBQVQsQ0FBUDtBQUNBLGFBQU8sS0FBS3NCLFdBQUwsQ0FBaUJ0QixLQUFLRyxHQUF0QixFQUEyQixDQUEzQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztxQ0FPaUJILEksRUFBTTtBQUNyQkEsYUFBT0ssUUFBUUwsSUFBUixDQUFQO0FBQ0EsYUFBTyxLQUFLc0IsV0FBTCxDQUFpQnRCLEtBQUtHLEdBQXRCLEVBQTJCSCxLQUFLTSxJQUFMLENBQVVDLE1BQXJDLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztrQ0FRY0MsSyxFQUFvQjtBQUFBLFVBQWJDLEdBQWEsdUVBQVBELEtBQU87O0FBQ2hDLGFBQU8sS0FDSmdCLG1CQURJLENBQ2dCaEIsS0FEaEIsRUFFSmlCLGdCQUZJLENBRWFoQixHQUZiLENBQVA7QUFHRDs7QUFFRDs7Ozs7Ozs7Ozs4QkFRVVQsSSxFQUFNO0FBQ2QsVUFBTTBCLFlBQVksSUFBbEI7QUFEYyxVQUVSbEMsU0FGUSxHQUV1RGtDLFNBRnZELENBRVJsQyxTQUZRO0FBQUEsVUFFR0MsWUFGSCxHQUV1RGlDLFNBRnZELENBRUdqQyxZQUZIO0FBQUEsVUFFaUJDLFFBRmpCLEdBRXVEZ0MsU0FGdkQsQ0FFaUJoQyxRQUZqQjtBQUFBLFVBRTJCQyxXQUYzQixHQUV1RCtCLFNBRnZELENBRTJCL0IsV0FGM0I7QUFBQSxVQUV3Q0MsVUFGeEMsR0FFdUQ4QixTQUZ2RCxDQUV3QzlCLFVBRnhDOztBQUlkOztBQUNBLFVBQUlKLGFBQWEsSUFBYixJQUFxQkUsWUFBWSxJQUFyQyxFQUEyQztBQUN6QyxlQUFPZ0MsVUFBVVQsS0FBVixDQUFnQjtBQUNyQnpCLHFCQUFXLElBRFU7QUFFckJDLHdCQUFjLENBRk87QUFHckJDLG9CQUFVLElBSFc7QUFJckJDLHVCQUFhLENBSlE7QUFLckJDLHNCQUFZO0FBTFMsU0FBaEIsQ0FBUDtBQU9EOztBQUVEO0FBQ0EsVUFBSStCLGFBQWEzQixLQUFLNEIsYUFBTCxDQUFtQnBDLFNBQW5CLENBQWpCO0FBQ0EsVUFBSXFDLFlBQVk3QixLQUFLNEIsYUFBTCxDQUFtQmxDLFFBQW5CLENBQWhCOztBQUVBO0FBQ0EsVUFBSSxDQUFDaUMsVUFBRCxJQUFlLENBQUNFLFNBQXBCLEVBQStCO0FBQzdCLHlCQUFPQyxJQUFQLENBQVkseUVBQVosRUFBdUZKLFNBQXZGO0FBQ0EsWUFBTXpCLFFBQVFELEtBQUsrQixZQUFMLEVBQWQ7QUFDQSxlQUFPTCxVQUFVVCxLQUFWLENBQWdCO0FBQ3JCekIscUJBQVdTLFFBQVFBLE1BQU1FLEdBQWQsR0FBb0IsSUFEVjtBQUVyQlYsd0JBQWMsQ0FGTztBQUdyQkMsb0JBQVVPLFFBQVFBLE1BQU1FLEdBQWQsR0FBb0IsSUFIVDtBQUlyQlIsdUJBQWEsQ0FKUTtBQUtyQkMsc0JBQVk7QUFMUyxTQUFoQixDQUFQO0FBT0Q7O0FBRUQ7QUFDQSxVQUFJK0IsV0FBV2hCLElBQVgsSUFBbUIsTUFBdkIsRUFBK0I7QUFDN0IseUJBQU9tQixJQUFQLENBQVksK0lBQVosRUFBNkpILFVBQTdKO0FBQ0EsWUFBTUssYUFBYUwsV0FBV00sZUFBWCxDQUEyQnhDLFlBQTNCLENBQW5CO0FBQ0EsWUFBTTBCLFNBQVNRLFdBQVdPLFNBQVgsQ0FBcUJGLFdBQVc3QixHQUFoQyxDQUFmO0FBQ0FWLHVCQUFlQSxlQUFlMEIsTUFBOUI7QUFDQVEscUJBQWFLLFVBQWI7QUFDRDs7QUFFRDtBQUNBLFVBQUlILFVBQVVsQixJQUFWLElBQWtCLE1BQXRCLEVBQThCO0FBQzVCLHlCQUFPbUIsSUFBUCxDQUFZLDhJQUFaLEVBQTRKRCxTQUE1SjtBQUNBLFlBQU1NLFlBQVlOLFVBQVVJLGVBQVYsQ0FBMEJ0QyxXQUExQixDQUFsQjtBQUNBLFlBQU13QixVQUFTVSxVQUFVSyxTQUFWLENBQW9CQyxVQUFVaEMsR0FBOUIsQ0FBZjtBQUNBUixzQkFBY0EsY0FBY3dCLE9BQTVCO0FBQ0FVLG9CQUFZTSxTQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJdkMsY0FBYyxJQUFsQixFQUF3QjtBQUN0QixZQUFJK0IsV0FBV3hCLEdBQVgsS0FBbUIwQixVQUFVMUIsR0FBakMsRUFBc0M7QUFDcENQLHVCQUFhSCxlQUFlRSxXQUE1QjtBQUNELFNBRkQsTUFFTztBQUNMQyx1QkFBYSxDQUFDSSxLQUFLb0Msb0JBQUwsQ0FBMEJULFdBQVd4QixHQUFyQyxFQUEwQzBCLFVBQVUxQixHQUFwRCxDQUFkO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGFBQU91QixVQUFVVCxLQUFWLENBQWdCO0FBQ3JCekIsbUJBQVdtQyxXQUFXeEIsR0FERDtBQUVyQlYsa0NBRnFCO0FBR3JCQyxrQkFBVW1DLFVBQVUxQixHQUhDO0FBSXJCUixnQ0FKcUI7QUFLckJDO0FBTHFCLE9BQWhCLENBQVA7QUFPRDs7QUFFRDs7Ozs7Ozs7NEJBTVE7QUFDTix1QkFBT3lDLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsa0dBQTNCO0FBQ0EsYUFBTyxLQUFLQyxRQUFMLEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O2tDQU9tQjtBQUFBLFVBQVBwQixDQUFPLHVFQUFILENBQUc7O0FBQ2pCLHVCQUFPbUIsU0FBUCxDQUFpQixRQUFqQixFQUEyQiwwR0FBM0I7QUFDQSxhQUFPLEtBQUtFLElBQUwsQ0FBVXJCLENBQVYsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7bUNBT29CO0FBQUEsVUFBUEEsQ0FBTyx1RUFBSCxDQUFHOztBQUNsQix1QkFBT21CLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIscUlBQTNCO0FBQ0EsYUFBTyxLQUFLRSxJQUFMLENBQVUsSUFBSXJCLENBQWQsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7dUNBT3dCO0FBQUEsVUFBUEEsQ0FBTyx1RUFBSCxDQUFHOztBQUN0Qix1QkFBT21CLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIscUhBQTNCO0FBQ0EsYUFBTyxLQUFLRyxVQUFMLENBQWdCdEIsQ0FBaEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7c0NBT3VCO0FBQUEsVUFBUEEsQ0FBTyx1RUFBSCxDQUFHOztBQUNyQix1QkFBT21CLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsbUhBQTNCO0FBQ0EsYUFBTyxLQUFLSSxTQUFMLENBQWV2QixDQUFmLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3NDQU91QjtBQUFBLFVBQVBBLENBQU8sdUVBQUgsQ0FBRzs7QUFDckIsdUJBQU9tQixTQUFQLENBQWlCLFFBQWpCLEVBQTJCLG1IQUEzQjtBQUNBLGFBQU8sS0FBS0ssU0FBTCxDQUFleEIsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztvQ0FPcUI7QUFBQSxVQUFQQSxDQUFPLHVFQUFILENBQUc7O0FBQ25CLHVCQUFPbUIsU0FBUCxDQUFpQixRQUFqQixFQUEyQiwrR0FBM0I7QUFDQSxhQUFPLEtBQUtNLE9BQUwsQ0FBYXpCLENBQWIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7b0NBT3FCO0FBQUEsVUFBUEEsQ0FBTyx1RUFBSCxDQUFHOztBQUNuQix1QkFBT21CLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsOEdBQTNCO0FBQ0EsYUFBTyxLQUFLTyxNQUFMLENBQVkxQixDQUFaLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3FDQU9zQjtBQUFBLFVBQVBBLENBQU8sdUVBQUgsQ0FBRzs7QUFDcEIsdUJBQU9tQixTQUFQLENBQWlCLFFBQWpCLEVBQTJCLHlJQUEzQjtBQUNBLGFBQU8sS0FBS08sTUFBTCxDQUFZLElBQUkxQixDQUFoQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7a0NBUWN6QixZLEVBQTBDO0FBQUEsVUFBNUJFLFdBQTRCLHVFQUFkRixZQUFjOztBQUN0RCx1QkFBTzRDLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsK0dBQTNCO0FBQ0EsYUFBTyxLQUFLUSxhQUFMLENBQW1CcEQsWUFBbkIsRUFBaUNFLFdBQWpDLENBQVA7QUFDRDs7Ozs7QUE5ckJEOzs7Ozs7d0JBTVc7QUFDVCxhQUFPLFdBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBTWdCO0FBQ2QsYUFBTyxDQUFDLEtBQUtFLFNBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBTWtCO0FBQ2hCLGFBQ0UsS0FBS0wsU0FBTCxJQUFrQixLQUFLRSxRQUF2QixJQUNBLEtBQUtELFlBQUwsSUFBcUIsS0FBS0UsV0FGNUI7QUFJRDs7QUFFRDs7Ozs7Ozs7d0JBTWlCO0FBQ2YsYUFBTyxDQUFDLEtBQUttQixXQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1nQjtBQUNkLGFBQU8sS0FBS2xCLFVBQUwsSUFBbUIsSUFBbkIsR0FBMEIsSUFBMUIsR0FBaUMsQ0FBQyxLQUFLQSxVQUE5QztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFNWTtBQUNWLGFBQU8sS0FBS0osU0FBTCxJQUFrQixJQUFsQixJQUEwQixLQUFLRSxRQUFMLElBQWlCLElBQWxEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1jO0FBQ1osYUFBTyxDQUFDLEtBQUtvRCxLQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1lO0FBQ2IsYUFBTyxLQUFLbEQsVUFBTCxHQUFrQixLQUFLRixRQUF2QixHQUFrQyxLQUFLRixTQUE5QztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFNa0I7QUFDaEIsYUFBTyxLQUFLSSxVQUFMLEdBQWtCLEtBQUtELFdBQXZCLEdBQXFDLEtBQUtGLFlBQWpEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1hO0FBQ1gsYUFBTyxLQUFLRyxVQUFMLEdBQWtCLEtBQUtKLFNBQXZCLEdBQW1DLEtBQUtFLFFBQS9DO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1nQjtBQUNkLGFBQU8sS0FBS0UsVUFBTCxHQUFrQixLQUFLSCxZQUF2QixHQUFzQyxLQUFLRSxXQUFsRDtBQUNEOzs7OztBQWpMRDs7Ozs7Ozs2QkFPMEI7QUFBQSxVQUFab0QsS0FBWSx1RUFBSixFQUFJOztBQUN4QixVQUFJaEQsVUFBVWlELFdBQVYsQ0FBc0JELEtBQXRCLENBQUosRUFBa0M7QUFDaEMsZUFBT0EsS0FBUDtBQUNEOztBQUVELFVBQUksNkJBQWNBLEtBQWQsQ0FBSixFQUEwQjtBQUN4QixZQUFNckIsWUFBWSxJQUFJM0IsU0FBSixDQUFjZ0QsS0FBZCxDQUFsQjtBQUNBLGVBQU9yQixTQUFQO0FBQ0Q7O0FBRUQsWUFBTSxJQUFJdUIsS0FBSixnRkFBeUZGLEtBQXpGLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7O3VDQU9vQztBQUFBLFVBQVpBLEtBQVksdUVBQUosRUFBSTs7QUFDbEMsVUFBSWhELFVBQVVpRCxXQUFWLENBQXNCRCxLQUF0QixDQUFKLEVBQWtDO0FBQ2hDLGVBQU87QUFDTHZELHFCQUFXdUQsTUFBTXZELFNBRFo7QUFFTEMsd0JBQWNzRCxNQUFNdEQsWUFGZjtBQUdMQyxvQkFBVXFELE1BQU1yRCxRQUhYO0FBSUxDLHVCQUFhb0QsTUFBTXBELFdBSmQ7QUFLTEMsc0JBQVltRCxNQUFNbkQsVUFMYjtBQU1MQyxxQkFBV2tELE1BQU1sRCxTQU5aO0FBT0xDLGlCQUFPaUQsTUFBTWpEO0FBUFIsU0FBUDtBQVNEOztBQUVELFVBQUksNkJBQWNpRCxLQUFkLENBQUosRUFBMEI7QUFDeEIsWUFBTUcsUUFBUSxFQUFkO0FBQ0EsWUFBSSxlQUFlSCxLQUFuQixFQUEwQkcsTUFBTTFELFNBQU4sR0FBa0J1RCxNQUFNdkQsU0FBeEI7QUFDMUIsWUFBSSxrQkFBa0J1RCxLQUF0QixFQUE2QkcsTUFBTXpELFlBQU4sR0FBcUJzRCxNQUFNdEQsWUFBM0I7QUFDN0IsWUFBSSxjQUFjc0QsS0FBbEIsRUFBeUJHLE1BQU14RCxRQUFOLEdBQWlCcUQsTUFBTXJELFFBQXZCO0FBQ3pCLFlBQUksaUJBQWlCcUQsS0FBckIsRUFBNEJHLE1BQU12RCxXQUFOLEdBQW9Cb0QsTUFBTXBELFdBQTFCO0FBQzVCLFlBQUksZ0JBQWdCb0QsS0FBcEIsRUFBMkJHLE1BQU10RCxVQUFOLEdBQW1CbUQsTUFBTW5ELFVBQXpCO0FBQzNCLFlBQUksZUFBZW1ELEtBQW5CLEVBQTBCRyxNQUFNckQsU0FBTixHQUFrQmtELE1BQU1sRCxTQUF4QjtBQUMxQixZQUFJLFdBQVdrRCxLQUFmLEVBQXNCRyxNQUFNcEQsS0FBTixHQUFjaUQsTUFBTWpELEtBQXBCO0FBQ3RCLGVBQU9vRCxLQUFQO0FBQ0Q7O0FBRUQsWUFBTSxJQUFJRCxLQUFKLDBGQUFtR0YsS0FBbkcsQ0FBTjtBQUNEOztBQUVEOzs7Ozs7Ozs7Z0NBT21CSSxLLEVBQU87QUFDeEIsYUFBTyxDQUFDLEVBQUVBLFNBQVNBLE1BQU0scUJBQVlDLFNBQWxCLENBQVgsQ0FBUjtBQUNEOzs7O0VBbEVxQix1QkFBTzdELFFBQVAsQzs7QUFzd0J4Qjs7OztBQUlBUSxVQUFVc0QsU0FBVixDQUFvQixxQkFBWUQsU0FBaEMsSUFBNkMsSUFBN0M7O0FBRUE7Ozs7QUFJQSxJQUFNRSxlQUFlLENBQ25CLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FEbUIsRUFFbkIsQ0FBQyxNQUFELEVBQVMsSUFBVCxDQUZtQixFQUduQixDQUFDLE1BQUQsRUFBUyxXQUFULENBSG1CLEVBSW5CLENBQUMsTUFBRCxFQUFTLFNBQVQsQ0FKbUIsQ0FBckI7O0FBT0FBLGFBQWFDLE9BQWIsQ0FBcUIsZ0JBQWM7QUFBQTtBQUFBLE1BQVhDLENBQVc7QUFBQSxNQUFSQyxDQUFROztBQUNqQzFELFlBQVVzRCxTQUFWLE1BQXVCRyxDQUF2QixHQUEyQkMsQ0FBM0IsSUFBa0MsWUFBbUI7QUFBQTs7QUFDbkQsV0FBTyxjQUNERCxDQURDLGNBQ1NDLENBRFQsMEJBRURELENBRkMsYUFFUUMsQ0FGUix5QkFBUDtBQUdELEdBSkQ7QUFLRCxDQU5EOztBQVFBOzs7O0FBSUEsSUFBTUMsZUFBZSxDQUNuQixDQUFDLEtBQUQsRUFBUSxXQUFSLEVBQXFCLElBQXJCLENBRG1CLEVBRW5CLENBQUMsS0FBRCxFQUFRLFNBQVIsRUFBbUIsSUFBbkIsQ0FGbUIsRUFHbkIsQ0FBQyxLQUFELEVBQVEsU0FBUixFQUFtQixJQUFuQixDQUhtQixFQUluQixDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsSUFBZCxDQUptQixFQUtuQixDQUFDLFlBQUQsRUFBZSxFQUFmLENBTG1CLEVBTW5CLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FObUIsRUFPbkIsQ0FBQyxRQUFELEVBQVcsRUFBWCxDQVBtQixFQVFuQixDQUFDLE1BQUQsRUFBUyxJQUFULENBUm1CLEVBU25CLENBQUMsTUFBRCxFQUFTLFVBQVQsQ0FUbUIsQ0FBckI7O0FBWUFBLGFBQWFILE9BQWIsQ0FBcUIsaUJBQXVCO0FBQUE7QUFBQSxNQUFwQkMsQ0FBb0I7QUFBQSxNQUFqQkMsQ0FBaUI7QUFBQSxNQUFkRSxPQUFjOztBQUMxQyxNQUFNQyxTQUFZSixDQUFaLGNBQXNCQyxDQUE1QjtBQUNBLE1BQU1JLFFBQVdMLENBQVgsYUFBb0JDLENBQTFCOztBQUVBMUQsWUFBVXNELFNBQVYsQ0FBdUJHLENBQXZCLGFBQWdDQyxDQUFoQyxJQUF1QyxZQUFtQjtBQUN4RCxXQUFPLEtBQUs3RCxVQUFMLEdBQ0gsS0FBS2lFLEtBQUwsd0JBREcsR0FFSCxLQUFLRCxNQUFMLHdCQUZKO0FBR0QsR0FKRDs7QUFNQTdELFlBQVVzRCxTQUFWLENBQXVCRyxDQUF2QixXQUE4QkMsQ0FBOUIsSUFBcUMsWUFBbUI7QUFDdEQsV0FBTyxLQUFLN0QsVUFBTCxHQUNILEtBQUtnRSxNQUFMLHdCQURHLEdBRUgsS0FBS0MsS0FBTCx3QkFGSjtBQUdELEdBSkQ7O0FBTUEsTUFBSUYsT0FBSixFQUFhO0FBQ1g1RCxjQUFVc0QsU0FBVixDQUF1QkcsQ0FBdkIsWUFBK0JDLENBQS9CLElBQXNDLFlBQW1CO0FBQ3ZELGFBQU8sS0FBS0csTUFBTCw0QkFBeUIsS0FBS0MsS0FBTCx3QkFBaEM7QUFDRCxLQUZEO0FBR0Q7QUFDRixDQXJCRDs7QUF1QkE7Ozs7QUFJQSxJQUFNQyxnQkFBZ0IsQ0FDcEIsQ0FBQyxZQUFELEVBQWUsUUFBZixDQURvQixFQUVwQixDQUFDLGtCQUFELEVBQXFCLGNBQXJCLENBRm9CLEVBR3BCLENBQUMsaUJBQUQsRUFBb0IsYUFBcEIsQ0FIb0IsRUFJcEIsQ0FBQyxpQkFBRCxFQUFvQixhQUFwQixDQUpvQixFQUtwQixDQUFDLGVBQUQsRUFBa0IsV0FBbEIsQ0FMb0IsRUFNcEIsQ0FBQyxtQkFBRCxFQUFzQixlQUF0QixDQU5vQixFQU9wQixDQUFDLGlCQUFELEVBQW9CLGFBQXBCLENBUG9CLEVBUXBCLENBQUMsUUFBRCxFQUFXLFdBQVgsQ0FSb0IsRUFTcEIsQ0FBQyxVQUFELEVBQWEsYUFBYixDQVRvQixFQVVwQixDQUFDLGlCQUFELEVBQW9CLG9CQUFwQixDQVZvQixFQVdwQixDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLENBWG9CLENBQXRCOztBQWNBQSxjQUFjUCxPQUFkLENBQXNCLGlCQUF1QjtBQUFBO0FBQUEsTUFBcEJRLEtBQW9CO0FBQUEsTUFBYkMsTUFBYTs7QUFDM0NqRSxZQUFVc0QsU0FBVixDQUFvQlUsS0FBcEIsSUFBNkIsWUFBbUI7QUFDOUMsV0FBTyxLQUFLQyxNQUFMLHdCQUFQO0FBQ0QsR0FGRDtBQUdELENBSkQ7O0FBTUE7Ozs7Ozs7QUFPQSxTQUFTOUQsUUFBVCxDQUFrQkYsSUFBbEIsRUFBd0I7QUFDdEIsU0FBT0EsS0FBS1csSUFBTCxJQUFhLE1BQWIsR0FBc0JYLElBQXRCLEdBQTZCQSxLQUFLK0IsWUFBTCxFQUFwQztBQUNEOztBQUVEOzs7Ozs7O0FBT0EsU0FBUzFCLE9BQVQsQ0FBaUJMLElBQWpCLEVBQXVCO0FBQ3JCLFNBQU9BLEtBQUtXLElBQUwsSUFBYSxNQUFiLEdBQXNCWCxJQUF0QixHQUE2QkEsS0FBS2lFLFdBQUwsRUFBcEM7QUFDRDs7QUFFRDs7Ozs7O2tCQU1lbEUsUyIsImZpbGUiOiJzZWxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdpcy1wbGFpbi1vYmplY3QnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcidcbmltcG9ydCB7IFJlY29yZCB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBEZWZhdWx0IHByb3BlcnRpZXMuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgYW5jaG9yS2V5OiBudWxsLFxuICBhbmNob3JPZmZzZXQ6IDAsXG4gIGZvY3VzS2V5OiBudWxsLFxuICBmb2N1c09mZnNldDogMCxcbiAgaXNCYWNrd2FyZDogbnVsbCxcbiAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgbWFya3M6IG51bGwsXG59XG5cbi8qKlxuICogU2VsZWN0aW9uLlxuICpcbiAqIEB0eXBlIHtTZWxlY3Rpb259XG4gKi9cblxuY2xhc3MgU2VsZWN0aW9uIGV4dGVuZHMgUmVjb3JkKERFRkFVTFRTKSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgU2VsZWN0aW9uYCB3aXRoIGBhdHRyc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fFNlbGVjdGlvbn0gYXR0cnNcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlKGF0dHJzID0ge30pIHtcbiAgICBpZiAoU2VsZWN0aW9uLmlzU2VsZWN0aW9uKGF0dHJzKSkge1xuICAgICAgcmV0dXJuIGF0dHJzXG4gICAgfVxuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QoYXR0cnMpKSB7XG4gICAgICBjb25zdCBzZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uKGF0dHJzKVxuICAgICAgcmV0dXJuIHNlbGVjdGlvblxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgXFxgU2VsZWN0aW9uLmNyZWF0ZVxcYCBvbmx5IGFjY2VwdHMgb2JqZWN0cyBvciBzZWxlY3Rpb25zLCBidXQgeW91IHBhc3NlZCBpdDogJHthdHRyc31gKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRpY3Rpb25hcnkgb2Ygc2V0dGFibGUgc2VsZWN0aW9uIHByb3BlcnRpZXMgZnJvbSBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd8U2VsZWN0aW9ufSBhdHRyc1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGVQcm9wZXJ0aWVzKGF0dHJzID0ge30pIHtcbiAgICBpZiAoU2VsZWN0aW9uLmlzU2VsZWN0aW9uKGF0dHJzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYW5jaG9yS2V5OiBhdHRycy5hbmNob3JLZXksXG4gICAgICAgIGFuY2hvck9mZnNldDogYXR0cnMuYW5jaG9yT2Zmc2V0LFxuICAgICAgICBmb2N1c0tleTogYXR0cnMuZm9jdXNLZXksXG4gICAgICAgIGZvY3VzT2Zmc2V0OiBhdHRycy5mb2N1c09mZnNldCxcbiAgICAgICAgaXNCYWNrd2FyZDogYXR0cnMuaXNCYWNrd2FyZCxcbiAgICAgICAgaXNGb2N1c2VkOiBhdHRycy5pc0ZvY3VzZWQsXG4gICAgICAgIG1hcmtzOiBhdHRycy5tYXJrcyxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChhdHRycykpIHtcbiAgICAgIGNvbnN0IHByb3BzID0ge31cbiAgICAgIGlmICgnYW5jaG9yS2V5JyBpbiBhdHRycykgcHJvcHMuYW5jaG9yS2V5ID0gYXR0cnMuYW5jaG9yS2V5XG4gICAgICBpZiAoJ2FuY2hvck9mZnNldCcgaW4gYXR0cnMpIHByb3BzLmFuY2hvck9mZnNldCA9IGF0dHJzLmFuY2hvck9mZnNldFxuICAgICAgaWYgKCdmb2N1c0tleScgaW4gYXR0cnMpIHByb3BzLmZvY3VzS2V5ID0gYXR0cnMuZm9jdXNLZXlcbiAgICAgIGlmICgnZm9jdXNPZmZzZXQnIGluIGF0dHJzKSBwcm9wcy5mb2N1c09mZnNldCA9IGF0dHJzLmZvY3VzT2Zmc2V0XG4gICAgICBpZiAoJ2lzQmFja3dhcmQnIGluIGF0dHJzKSBwcm9wcy5pc0JhY2t3YXJkID0gYXR0cnMuaXNCYWNrd2FyZFxuICAgICAgaWYgKCdpc0ZvY3VzZWQnIGluIGF0dHJzKSBwcm9wcy5pc0ZvY3VzZWQgPSBhdHRycy5pc0ZvY3VzZWRcbiAgICAgIGlmICgnbWFya3MnIGluIGF0dHJzKSBwcm9wcy5tYXJrcyA9IGF0dHJzLm1hcmtzXG4gICAgICByZXR1cm4gcHJvcHNcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYFNlbGVjdGlvbi5jcmVhdGVQcm9wZXJ0aWVzXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzIG9yIHNlbGVjdGlvbnMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2F0dHJzfWApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBgdmFsdWVgIGlzIGEgYFNlbGVjdGlvbmAuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNTZWxlY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbTU9ERUxfVFlQRVMuU0VMRUNUSU9OXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGtpbmQuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IGtpbmQoKSB7XG4gICAgcmV0dXJuICdzZWxlY3Rpb24nXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgc2VsZWN0aW9uIGlzIGJsdXJyZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0JsdXJyZWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRm9jdXNlZFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIHNlbGVjdGlvbiBpcyBjb2xsYXBzZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0NvbGxhcHNlZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5hbmNob3JLZXkgPT0gdGhpcy5mb2N1c0tleSAmJlxuICAgICAgdGhpcy5hbmNob3JPZmZzZXQgPT0gdGhpcy5mb2N1c09mZnNldFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBzZWxlY3Rpb24gaXMgZXhwYW5kZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0V4cGFuZGVkKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0NvbGxhcHNlZFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIHNlbGVjdGlvbiBpcyBmb3J3YXJkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaXNGb3J3YXJkKCkge1xuICAgIHJldHVybiB0aGlzLmlzQmFja3dhcmQgPT0gbnVsbCA/IG51bGwgOiAhdGhpcy5pc0JhY2t3YXJkXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgc2VsZWN0aW9uJ3Mga2V5cyBhcmUgc2V0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaXNTZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yS2V5ICE9IG51bGwgJiYgdGhpcy5mb2N1c0tleSAhPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgc2VsZWN0aW9uJ3Mga2V5cyBhcmUgbm90IHNldC5cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgZ2V0IGlzVW5zZXQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzU2V0XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzdGFydCBrZXkuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IHN0YXJ0S2V5KCkge1xuICAgIHJldHVybiB0aGlzLmlzQmFja3dhcmQgPyB0aGlzLmZvY3VzS2V5IDogdGhpcy5hbmNob3JLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHN0YXJ0IG9mZnNldC5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgc3RhcnRPZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNCYWNrd2FyZCA/IHRoaXMuZm9jdXNPZmZzZXQgOiB0aGlzLmFuY2hvck9mZnNldFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZW5kIGtleS5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgZW5kS2V5KCkge1xuICAgIHJldHVybiB0aGlzLmlzQmFja3dhcmQgPyB0aGlzLmFuY2hvcktleSA6IHRoaXMuZm9jdXNLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGVuZCBvZmZzZXQuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IGVuZE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0JhY2t3YXJkID8gdGhpcy5hbmNob3JPZmZzZXQgOiB0aGlzLmZvY3VzT2Zmc2V0XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBhbmNob3IgcG9pbnQgb2YgdGhlIHNlbGVjdGlvbiBpcyBhdCB0aGUgc3RhcnQgb2YgYSBgbm9kZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBoYXNBbmNob3JBdFN0YXJ0T2Yobm9kZSkge1xuICAgIC8vIFBFUkY6IERvIGEgY2hlY2sgZm9yIGEgYDBgIG9mZnNldCBmaXJzdCBzaW5jZSBpdCdzIHF1aWNrZXN0LlxuICAgIGlmICh0aGlzLmFuY2hvck9mZnNldCAhPSAwKSByZXR1cm4gZmFsc2VcbiAgICBjb25zdCBmaXJzdCA9IGdldEZpcnN0KG5vZGUpXG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yS2V5ID09IGZpcnN0LmtleVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYW5jaG9yIHBvaW50IG9mIHRoZSBzZWxlY3Rpb24gaXMgYXQgdGhlIGVuZCBvZiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGhhc0FuY2hvckF0RW5kT2Yobm9kZSkge1xuICAgIGNvbnN0IGxhc3QgPSBnZXRMYXN0KG5vZGUpXG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yS2V5ID09IGxhc3Qua2V5ICYmIHRoaXMuYW5jaG9yT2Zmc2V0ID09IGxhc3QudGV4dC5sZW5ndGhcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBhbmNob3IgZWRnZSBvZiBhIHNlbGVjdGlvbiBpcyBpbiBhIGBub2RlYCBhbmQgYXQgYW5cbiAgICogb2Zmc2V0IGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVuZFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBoYXNBbmNob3JCZXR3ZWVuKG5vZGUsIHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5hbmNob3JPZmZzZXQgPD0gZW5kICYmXG4gICAgICBzdGFydCA8PSB0aGlzLmFuY2hvck9mZnNldCAmJlxuICAgICAgdGhpcy5oYXNBbmNob3JJbihub2RlKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBhbmNob3IgZWRnZSBvZiBhIHNlbGVjdGlvbiBpcyBpbiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGhhc0FuY2hvckluKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5raW5kID09ICd0ZXh0J1xuICAgICAgPyBub2RlLmtleSA9PSB0aGlzLmFuY2hvcktleVxuICAgICAgOiB0aGlzLmFuY2hvcktleSAhPSBudWxsICYmIG5vZGUuaGFzRGVzY2VuZGFudCh0aGlzLmFuY2hvcktleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGZvY3VzIHBvaW50IG9mIHRoZSBzZWxlY3Rpb24gaXMgYXQgdGhlIGVuZCBvZiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGhhc0ZvY3VzQXRFbmRPZihub2RlKSB7XG4gICAgY29uc3QgbGFzdCA9IGdldExhc3Qobm9kZSlcbiAgICByZXR1cm4gdGhpcy5mb2N1c0tleSA9PSBsYXN0LmtleSAmJiB0aGlzLmZvY3VzT2Zmc2V0ID09IGxhc3QudGV4dC5sZW5ndGhcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGZvY3VzIHBvaW50IG9mIHRoZSBzZWxlY3Rpb24gaXMgYXQgdGhlIHN0YXJ0IG9mIGEgYG5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgaGFzRm9jdXNBdFN0YXJ0T2Yobm9kZSkge1xuICAgIGlmICh0aGlzLmZvY3VzT2Zmc2V0ICE9IDApIHJldHVybiBmYWxzZVxuICAgIGNvbnN0IGZpcnN0ID0gZ2V0Rmlyc3Qobm9kZSlcbiAgICByZXR1cm4gdGhpcy5mb2N1c0tleSA9PSBmaXJzdC5rZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBmb2N1cyBlZGdlIG9mIGEgc2VsZWN0aW9uIGlzIGluIGEgYG5vZGVgIGFuZCBhdCBhblxuICAgKiBvZmZzZXQgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFxuICAgKiBAcGFyYW0ge051bWJlcn0gZW5kXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGhhc0ZvY3VzQmV0d2Vlbihub2RlLCBzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHN0YXJ0IDw9IHRoaXMuZm9jdXNPZmZzZXQgJiZcbiAgICAgIHRoaXMuZm9jdXNPZmZzZXQgPD0gZW5kICYmXG4gICAgICB0aGlzLmhhc0ZvY3VzSW4obm9kZSlcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgZm9jdXMgZWRnZSBvZiBhIHNlbGVjdGlvbiBpcyBpbiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGhhc0ZvY3VzSW4obm9kZSkge1xuICAgIHJldHVybiBub2RlLmtpbmQgPT0gJ3RleHQnXG4gICAgICA/IG5vZGUua2V5ID09IHRoaXMuZm9jdXNLZXlcbiAgICAgIDogdGhpcy5mb2N1c0tleSAhPSBudWxsICYmIG5vZGUuaGFzRGVzY2VuZGFudCh0aGlzLmZvY3VzS2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIHNlbGVjdGlvbiBpcyBhdCB0aGUgc3RhcnQgb2YgYSBgbm9kZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBpc0F0U3RhcnRPZihub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb2xsYXBzZWQgJiYgdGhpcy5oYXNBbmNob3JBdFN0YXJ0T2Yobm9kZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBzZWxlY3Rpb24gaXMgYXQgdGhlIGVuZCBvZiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGlzQXRFbmRPZihub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb2xsYXBzZWQgJiYgdGhpcy5oYXNBbmNob3JBdEVuZE9mKG5vZGUpXG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIHNlbGVjdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBmb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZSh7XG4gICAgICBpc0ZvY3VzZWQ6IHRydWVcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEJsdXIgdGhlIHNlbGVjdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBibHVyKCkge1xuICAgIHJldHVybiB0aGlzLm1lcmdlKHtcbiAgICAgIGlzRm9jdXNlZDogZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVuc2V0IHRoZSBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgZGVzZWxlY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2Uoe1xuICAgICAgYW5jaG9yS2V5OiBudWxsLFxuICAgICAgYW5jaG9yT2Zmc2V0OiAwLFxuICAgICAgZm9jdXNLZXk6IG51bGwsXG4gICAgICBmb2N1c09mZnNldDogMCxcbiAgICAgIGlzRm9jdXNlZDogZmFsc2UsXG4gICAgICBpc0JhY2t3YXJkOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogRmxpcCB0aGUgc2VsZWN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIGZsaXAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2Uoe1xuICAgICAgYW5jaG9yS2V5OiB0aGlzLmZvY3VzS2V5LFxuICAgICAgYW5jaG9yT2Zmc2V0OiB0aGlzLmZvY3VzT2Zmc2V0LFxuICAgICAgZm9jdXNLZXk6IHRoaXMuYW5jaG9yS2V5LFxuICAgICAgZm9jdXNPZmZzZXQ6IHRoaXMuYW5jaG9yT2Zmc2V0LFxuICAgICAgaXNCYWNrd2FyZDogdGhpcy5pc0JhY2t3YXJkID09IG51bGwgPyBudWxsIDogIXRoaXMuaXNCYWNrd2FyZCxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIGFuY2hvciBvZmZzZXQgYG5gIGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuIChvcHRpb25hbClcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBtb3ZlQW5jaG9yKG4gPSAxKSB7XG4gICAgY29uc3QgeyBhbmNob3JLZXksIGZvY3VzS2V5LCBmb2N1c09mZnNldCwgaXNCYWNrd2FyZCB9ID0gdGhpc1xuICAgIGNvbnN0IGFuY2hvck9mZnNldCA9IHRoaXMuYW5jaG9yT2Zmc2V0ICsgblxuICAgIHJldHVybiB0aGlzLm1lcmdlKHtcbiAgICAgIGFuY2hvck9mZnNldCxcbiAgICAgIGlzQmFja3dhcmQ6IGFuY2hvcktleSA9PSBmb2N1c0tleVxuICAgICAgICA/IGFuY2hvck9mZnNldCA+IGZvY3VzT2Zmc2V0XG4gICAgICAgIDogaXNCYWNrd2FyZFxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgYW5jaG9yIG9mZnNldCBgbmAgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVGb2N1cyhuID0gMSkge1xuICAgIGNvbnN0IHsgYW5jaG9yS2V5LCBhbmNob3JPZmZzZXQsIGZvY3VzS2V5LCBpc0JhY2t3YXJkIH0gPSB0aGlzXG4gICAgY29uc3QgZm9jdXNPZmZzZXQgPSB0aGlzLmZvY3VzT2Zmc2V0ICsgblxuICAgIHJldHVybiB0aGlzLm1lcmdlKHtcbiAgICAgIGZvY3VzT2Zmc2V0LFxuICAgICAgaXNCYWNrd2FyZDogZm9jdXNLZXkgPT0gYW5jaG9yS2V5XG4gICAgICAgID8gYW5jaG9yT2Zmc2V0ID4gZm9jdXNPZmZzZXRcbiAgICAgICAgOiBpc0JhY2t3YXJkXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBzZWxlY3Rpb24ncyBhbmNob3IgcG9pbnQgdG8gYSBga2V5YCBhbmQgYG9mZnNldGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVBbmNob3JUbyhrZXksIG9mZnNldCkge1xuICAgIGNvbnN0IHsgYW5jaG9yS2V5LCBmb2N1c0tleSwgZm9jdXNPZmZzZXQsIGlzQmFja3dhcmQgfSA9IHRoaXNcbiAgICByZXR1cm4gdGhpcy5tZXJnZSh7XG4gICAgICBhbmNob3JLZXk6IGtleSxcbiAgICAgIGFuY2hvck9mZnNldDogb2Zmc2V0LFxuICAgICAgaXNCYWNrd2FyZDoga2V5ID09IGZvY3VzS2V5XG4gICAgICAgID8gb2Zmc2V0ID4gZm9jdXNPZmZzZXRcbiAgICAgICAgOiBrZXkgPT0gYW5jaG9yS2V5ID8gaXNCYWNrd2FyZCA6IG51bGxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIHNlbGVjdGlvbidzIGZvY3VzIHBvaW50IHRvIGEgYGtleWAgYW5kIGBvZmZzZXRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBtb3ZlRm9jdXNUbyhrZXksIG9mZnNldCkge1xuICAgIGNvbnN0IHsgZm9jdXNLZXksIGFuY2hvcktleSwgYW5jaG9yT2Zmc2V0LCBpc0JhY2t3YXJkIH0gPSB0aGlzXG4gICAgcmV0dXJuIHRoaXMubWVyZ2Uoe1xuICAgICAgZm9jdXNLZXk6IGtleSxcbiAgICAgIGZvY3VzT2Zmc2V0OiBvZmZzZXQsXG4gICAgICBpc0JhY2t3YXJkOiBrZXkgPT0gYW5jaG9yS2V5XG4gICAgICAgID8gYW5jaG9yT2Zmc2V0ID4gb2Zmc2V0XG4gICAgICAgIDoga2V5ID09IGZvY3VzS2V5ID8gaXNCYWNrd2FyZCA6IG51bGxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIHNlbGVjdGlvbiB0byBgYW5jaG9yT2Zmc2V0YC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuY2hvck9mZnNldFxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVBbmNob3JPZmZzZXRUbyhhbmNob3JPZmZzZXQpIHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZSh7XG4gICAgICBhbmNob3JPZmZzZXQsXG4gICAgICBpc0JhY2t3YXJkOiB0aGlzLmFuY2hvcktleSA9PSB0aGlzLmZvY3VzS2V5XG4gICAgICAgID8gYW5jaG9yT2Zmc2V0ID4gdGhpcy5mb2N1c09mZnNldFxuICAgICAgICA6IHRoaXMuaXNCYWNrd2FyZFxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgc2VsZWN0aW9uIHRvIGBmb2N1c09mZnNldGAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmb2N1c09mZnNldFxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVGb2N1c09mZnNldFRvKGZvY3VzT2Zmc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2Uoe1xuICAgICAgZm9jdXNPZmZzZXQsXG4gICAgICBpc0JhY2t3YXJkOiB0aGlzLmFuY2hvcktleSA9PSB0aGlzLmZvY3VzS2V5XG4gICAgICAgID8gdGhpcy5hbmNob3JPZmZzZXQgPiBmb2N1c09mZnNldFxuICAgICAgICA6IHRoaXMuaXNCYWNrd2FyZFxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgc2VsZWN0aW9uIHRvIGBhbmNob3JPZmZzZXRgIGFuZCBgZm9jdXNPZmZzZXRgLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYW5jaG9yT2Zmc2V0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmb2N1c09mZnNldCAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZU9mZnNldHNUbyhhbmNob3JPZmZzZXQsIGZvY3VzT2Zmc2V0ID0gYW5jaG9yT2Zmc2V0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5tb3ZlQW5jaG9yT2Zmc2V0VG8oYW5jaG9yT2Zmc2V0KVxuICAgICAgLm1vdmVGb2N1c09mZnNldFRvKGZvY3VzT2Zmc2V0KVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIGZvY3VzIHBvaW50IHRvIHRoZSBhbmNob3IgcG9pbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZVRvQW5jaG9yKCkge1xuICAgIHJldHVybiB0aGlzLm1vdmVGb2N1c1RvKHRoaXMuYW5jaG9yS2V5LCB0aGlzLmFuY2hvck9mZnNldClcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBhbmNob3IgcG9pbnQgdG8gdGhlIGZvY3VzIHBvaW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVUb0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLm1vdmVBbmNob3JUbyh0aGlzLmZvY3VzS2V5LCB0aGlzLmZvY3VzT2Zmc2V0KVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIHNlbGVjdGlvbidzIGFuY2hvciBwb2ludCB0byB0aGUgc3RhcnQgb2YgYSBgbm9kZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVBbmNob3JUb1N0YXJ0T2Yobm9kZSkge1xuICAgIG5vZGUgPSBnZXRGaXJzdChub2RlKVxuICAgIHJldHVybiB0aGlzLm1vdmVBbmNob3JUbyhub2RlLmtleSwgMClcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBzZWxlY3Rpb24ncyBhbmNob3IgcG9pbnQgdG8gdGhlIGVuZCBvZiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZUFuY2hvclRvRW5kT2Yobm9kZSkge1xuICAgIG5vZGUgPSBnZXRMYXN0KG5vZGUpXG4gICAgcmV0dXJuIHRoaXMubW92ZUFuY2hvclRvKG5vZGUua2V5LCBub2RlLnRleHQubGVuZ3RoKVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIHNlbGVjdGlvbidzIGZvY3VzIHBvaW50IHRvIHRoZSBzdGFydCBvZiBhIGBub2RlYC5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZUZvY3VzVG9TdGFydE9mKG5vZGUpIHtcbiAgICBub2RlID0gZ2V0Rmlyc3Qobm9kZSlcbiAgICByZXR1cm4gdGhpcy5tb3ZlRm9jdXNUbyhub2RlLmtleSwgMClcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBzZWxlY3Rpb24ncyBmb2N1cyBwb2ludCB0byB0aGUgZW5kIG9mIGEgYG5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBtb3ZlRm9jdXNUb0VuZE9mKG5vZGUpIHtcbiAgICBub2RlID0gZ2V0TGFzdChub2RlKVxuICAgIHJldHVybiB0aGlzLm1vdmVGb2N1c1RvKG5vZGUua2V5LCBub2RlLnRleHQubGVuZ3RoKVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdG8gdGhlIGVudGlyZSByYW5nZSBvZiBgc3RhcnRgIGFuZCBgZW5kYCBub2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICAgKiBAcGFyYW0ge05vZGV9IGVuZCAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZVRvUmFuZ2VPZihzdGFydCwgZW5kID0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgLm1vdmVBbmNob3JUb1N0YXJ0T2Yoc3RhcnQpXG4gICAgICAubW92ZUZvY3VzVG9FbmRPZihlbmQpXG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplIHRoZSBzZWxlY3Rpb24sIHJlbGF0aXZlIHRvIGEgYG5vZGVgLCBlbnN1cmluZyB0aGF0IHRoZSBhbmNob3JcbiAgICogYW5kIGZvY3VzIG5vZGVzIG9mIHRoZSBzZWxlY3Rpb24gYWx3YXlzIHJlZmVyIHRvIGxlYWYgdGV4dCBub2Rlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbm9ybWFsaXplKG5vZGUpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzXG4gICAgbGV0IHsgYW5jaG9yS2V5LCBhbmNob3JPZmZzZXQsIGZvY3VzS2V5LCBmb2N1c09mZnNldCwgaXNCYWNrd2FyZCB9ID0gc2VsZWN0aW9uXG5cbiAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGlzIHVuc2V0LCBtYWtlIHN1cmUgaXQgaXMgcHJvcGVybHkgemVyb2VkIG91dC5cbiAgICBpZiAoYW5jaG9yS2V5ID09IG51bGwgfHwgZm9jdXNLZXkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNlbGVjdGlvbi5tZXJnZSh7XG4gICAgICAgIGFuY2hvcktleTogbnVsbCxcbiAgICAgICAgYW5jaG9yT2Zmc2V0OiAwLFxuICAgICAgICBmb2N1c0tleTogbnVsbCxcbiAgICAgICAgZm9jdXNPZmZzZXQ6IDAsXG4gICAgICAgIGlzQmFja3dhcmQ6IGZhbHNlLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIGFuY2hvciBhbmQgZm9jdXMgbm9kZXMuXG4gICAgbGV0IGFuY2hvck5vZGUgPSBub2RlLmdldERlc2NlbmRhbnQoYW5jaG9yS2V5KVxuICAgIGxldCBmb2N1c05vZGUgPSBub2RlLmdldERlc2NlbmRhbnQoZm9jdXNLZXkpXG5cbiAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGlzIG1hbGZvcm1lZCwgd2FybiBhbmQgemVybyBpdCBvdXQuXG4gICAgaWYgKCFhbmNob3JOb2RlIHx8ICFmb2N1c05vZGUpIHtcbiAgICAgIGxvZ2dlci53YXJuKCdUaGUgc2VsZWN0aW9uIHdhcyBpbnZhbGlkIGFuZCB3YXMgcmVzZXQuIFRoZSBzZWxlY3Rpb24gaW4gcXVlc3Rpb24gd2FzOicsIHNlbGVjdGlvbilcbiAgICAgIGNvbnN0IGZpcnN0ID0gbm9kZS5nZXRGaXJzdFRleHQoKVxuICAgICAgcmV0dXJuIHNlbGVjdGlvbi5tZXJnZSh7XG4gICAgICAgIGFuY2hvcktleTogZmlyc3QgPyBmaXJzdC5rZXkgOiBudWxsLFxuICAgICAgICBhbmNob3JPZmZzZXQ6IDAsXG4gICAgICAgIGZvY3VzS2V5OiBmaXJzdCA/IGZpcnN0LmtleSA6IG51bGwsXG4gICAgICAgIGZvY3VzT2Zmc2V0OiAwLFxuICAgICAgICBpc0JhY2t3YXJkOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGFuY2hvciBub2RlIGlzbid0IGEgdGV4dCBub2RlLCBtYXRjaCBpdCB0byBvbmUuXG4gICAgaWYgKGFuY2hvck5vZGUua2luZCAhPSAndGV4dCcpIHtcbiAgICAgIGxvZ2dlci53YXJuKCdUaGUgc2VsZWN0aW9uIGFuY2hvciB3YXMgc2V0IHRvIGEgTm9kZSB0aGF0IGlzIG5vdCBhIFRleHQgbm9kZS4gVGhpcyBzaG91bGQgbm90IGhhcHBlbiBhbmQgY2FuIGRlZ3JhZGUgcGVyZm9ybWFuY2UuIFRoZSBub2RlIGluIHF1ZXN0aW9uIHdhczonLCBhbmNob3JOb2RlKVxuICAgICAgY29uc3QgYW5jaG9yVGV4dCA9IGFuY2hvck5vZGUuZ2V0VGV4dEF0T2Zmc2V0KGFuY2hvck9mZnNldClcbiAgICAgIGNvbnN0IG9mZnNldCA9IGFuY2hvck5vZGUuZ2V0T2Zmc2V0KGFuY2hvclRleHQua2V5KVxuICAgICAgYW5jaG9yT2Zmc2V0ID0gYW5jaG9yT2Zmc2V0IC0gb2Zmc2V0XG4gICAgICBhbmNob3JOb2RlID0gYW5jaG9yVGV4dFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBmb2N1cyBub2RlIGlzbid0IGEgdGV4dCBub2RlLCBtYXRjaCBpdCB0byBvbmUuXG4gICAgaWYgKGZvY3VzTm9kZS5raW5kICE9ICd0ZXh0Jykge1xuICAgICAgbG9nZ2VyLndhcm4oJ1RoZSBzZWxlY3Rpb24gZm9jdXMgd2FzIHNldCB0byBhIE5vZGUgdGhhdCBpcyBub3QgYSBUZXh0IG5vZGUuIFRoaXMgc2hvdWxkIG5vdCBoYXBwZW4gYW5kIGNhbiBkZWdyYWRlIHBlcmZvcm1hbmNlLiBUaGUgbm9kZSBpbiBxdWVzdGlvbiB3YXM6JywgZm9jdXNOb2RlKVxuICAgICAgY29uc3QgZm9jdXNUZXh0ID0gZm9jdXNOb2RlLmdldFRleHRBdE9mZnNldChmb2N1c09mZnNldClcbiAgICAgIGNvbnN0IG9mZnNldCA9IGZvY3VzTm9kZS5nZXRPZmZzZXQoZm9jdXNUZXh0LmtleSlcbiAgICAgIGZvY3VzT2Zmc2V0ID0gZm9jdXNPZmZzZXQgLSBvZmZzZXRcbiAgICAgIGZvY3VzTm9kZSA9IGZvY3VzVGV4dFxuICAgIH1cblxuICAgIC8vIElmIGBpc0JhY2t3YXJkYCBpcyBub3Qgc2V0LCBkZXJpdmUgaXQuXG4gICAgaWYgKGlzQmFja3dhcmQgPT0gbnVsbCkge1xuICAgICAgaWYgKGFuY2hvck5vZGUua2V5ID09PSBmb2N1c05vZGUua2V5KSB7XG4gICAgICAgIGlzQmFja3dhcmQgPSBhbmNob3JPZmZzZXQgPiBmb2N1c09mZnNldFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNCYWNrd2FyZCA9ICFub2RlLmFyZURlc2NlbmRhbnRzU29ydGVkKGFuY2hvck5vZGUua2V5LCBmb2N1c05vZGUua2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lcmdlIGluIGFueSB1cGRhdGVkIHByb3BlcnRpZXMuXG4gICAgcmV0dXJuIHNlbGVjdGlvbi5tZXJnZSh7XG4gICAgICBhbmNob3JLZXk6IGFuY2hvck5vZGUua2V5LFxuICAgICAgYW5jaG9yT2Zmc2V0LFxuICAgICAgZm9jdXNLZXk6IGZvY3VzTm9kZS5rZXksXG4gICAgICBmb2N1c09mZnNldCxcbiAgICAgIGlzQmFja3dhcmRcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVuc2V0IHRoZSBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgdW5zZXQoKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgJ1RoZSBgU2VsZWN0aW9uLnVuc2V0YCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHN3aXRjaCB0byB1c2luZyBgU2VsZWN0aW9uLmRlc2VsZWN0YCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMuZGVzZWxlY3QoKVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIHNlbGVjdGlvbiBmb3J3YXJkIGBuYCBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbiAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZUZvcndhcmQobiA9IDEpIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE3LjAnLCAnVGhlIGBTZWxlY3Rpb24ubW92ZUZvcndhcmQobilgIG1ldGhvZCBpcyBkZXByZWNhdGVkLCBwbGVhc2Ugc3dpdGNoIHRvIHVzaW5nIGBTZWxlY3Rpb24ubW92ZShuKWAgaW5zdGVhZC4nKVxuICAgIHJldHVybiB0aGlzLm1vdmUobilcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBzZWxlY3Rpb24gYmFja3dhcmQgYG5gIGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuIChvcHRpb25hbClcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBtb3ZlQmFja3dhcmQobiA9IDEpIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE3LjAnLCAnVGhlIGBTZWxlY3Rpb24ubW92ZUJhY2t3YXJkKG4pYCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHN3aXRjaCB0byB1c2luZyBgU2VsZWN0aW9uLm1vdmUoLW4pYCAod2l0aCBhIG5lZ2F0aXZlIG51bWJlcikgaW5zdGVhZC4nKVxuICAgIHJldHVybiB0aGlzLm1vdmUoMCAtIG4pXG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgYW5jaG9yIG9mZnNldCBgbmAgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVBbmNob3JPZmZzZXQobiA9IDEpIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE3LjAnLCAnVGhlIGBTZWxlY3Rpb24ubW92ZUFuY2hvck9mZnNldChuKWAgbWV0aG9kIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSBzd2l0Y2ggdG8gdXNpbmcgYFNlbGVjdGlvbi5tb3ZlQW5jaG9yKG4pYCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMubW92ZUFuY2hvcihuKVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIGZvY3VzIG9mZnNldCBgbmAgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVGb2N1c09mZnNldChuID0gMSkge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTcuMCcsICdUaGUgYFNlbGVjdGlvbi5tb3ZlRm9jdXNPZmZzZXQobilgIG1ldGhvZCBpcyBkZXByZWNhdGVkLCBwbGVhc2Ugc3dpdGNoIHRvIHVzaW5nIGBTZWxlY3Rpb24ubW92ZUZvY3VzKG4pYCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMubW92ZUZvY3VzKG4pXG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgc3RhcnQgb2Zmc2V0IGBuYCBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbiAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1NlbGVjdGlvbn1cbiAgICovXG5cbiAgbW92ZVN0YXJ0T2Zmc2V0KG4gPSAxKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgJ1RoZSBgU2VsZWN0aW9uLm1vdmVTdGFydE9mZnNldChuKWAgbWV0aG9kIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSBzd2l0Y2ggdG8gdXNpbmcgYFNlbGVjdGlvbi5tb3ZlU3RhcnQobilgIGluc3RlYWQuJylcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3RhcnQobilcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBmb2N1cyBvZmZzZXQgYG5gIGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuIChvcHRpb25hbClcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBtb3ZlRW5kT2Zmc2V0KG4gPSAxKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgJ1RoZSBgU2VsZWN0aW9uLm1vdmVFbmRPZmZzZXQobilgIG1ldGhvZCBpcyBkZXByZWNhdGVkLCBwbGVhc2Ugc3dpdGNoIHRvIHVzaW5nIGBTZWxlY3Rpb24ubW92ZUVuZChuKWAgaW5zdGVhZC4nKVxuICAgIHJldHVybiB0aGlzLm1vdmVFbmQobilcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIGZvY3VzIHBvaW50IGZvcndhcmQgYG5gIGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuIChvcHRpb25hbClcbiAgICogQHJldHVybiB7U2VsZWN0aW9ufVxuICAgKi9cblxuICBleHRlbmRGb3J3YXJkKG4gPSAxKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgJ1RoZSBgU2VsZWN0aW9uLmV4dGVuZEZvcndhcmQobilgIG1ldGhvZCBpcyBkZXByZWNhdGVkLCBwbGVhc2Ugc3dpdGNoIHRvIHVzaW5nIGBTZWxlY3Rpb24uZXh0ZW5kKG4pYCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMuZXh0ZW5kKG4pXG4gIH1cblxuICAvKipcbiAgICogRXh0ZW5kIHRoZSBmb2N1cyBwb2ludCBiYWNrd2FyZCBgbmAgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIGV4dGVuZEJhY2t3YXJkKG4gPSAxKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgJ1RoZSBgU2VsZWN0aW9uLmV4dGVuZEJhY2t3YXJkKG4pYCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHN3aXRjaCB0byB1c2luZyBgU2VsZWN0aW9uLmV4dGVuZCgtbilgICh3aXRoIGEgbmVnYXRpdmUgbnVtYmVyKSBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMuZXh0ZW5kKDAgLSBuKVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIHNlbGVjdGlvbiB0byBgYW5jaG9yT2Zmc2V0YCBhbmQgYGZvY3VzT2Zmc2V0YC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuY2hvck9mZnNldFxuICAgKiBAcGFyYW0ge051bWJlcn0gZm9jdXNPZmZzZXQgKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259XG4gICAqL1xuXG4gIG1vdmVUb09mZnNldHMoYW5jaG9yT2Zmc2V0LCBmb2N1c09mZnNldCA9IGFuY2hvck9mZnNldCkge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMTcuMCcsICdUaGUgYFNlbGVjdGlvbi5tb3ZlVG9PZmZzZXRzYCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHN3aXRjaCB0byB1c2luZyBgU2VsZWN0aW9uLm1vdmVPZmZzZXRzVG9gIGluc3RlYWQuJylcbiAgICByZXR1cm4gdGhpcy5tb3ZlT2Zmc2V0c1RvKGFuY2hvck9mZnNldCwgZm9jdXNPZmZzZXQpXG4gIH1cblxufVxuXG4vKipcbiAqIEF0dGFjaCBhIHBzZXVkby1zeW1ib2wgZm9yIHR5cGUgY2hlY2tpbmcuXG4gKi9cblxuU2VsZWN0aW9uLnByb3RvdHlwZVtNT0RFTF9UWVBFUy5TRUxFQ1RJT05dID0gdHJ1ZVxuXG4vKipcbiAqIE1peCBpbiBzb21lIFwibW92ZVwiIGNvbnZlbmllbmNlIG1ldGhvZHMuXG4gKi9cblxuY29uc3QgTU9WRV9NRVRIT0RTID0gW1xuICBbJ21vdmUnLCAnJ10sXG4gIFsnbW92ZScsICdUbyddLFxuICBbJ21vdmUnLCAnVG9TdGFydE9mJ10sXG4gIFsnbW92ZScsICdUb0VuZE9mJ10sXG5dXG5cbk1PVkVfTUVUSE9EUy5mb3JFYWNoKChbIHAsIHMgXSkgPT4ge1xuICBTZWxlY3Rpb24ucHJvdG90eXBlW2Ake3B9JHtzfWBdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgW2Ake3B9QW5jaG9yJHtzfWBdKC4uLmFyZ3MpXG4gICAgICBbYCR7cH1Gb2N1cyR7c31gXSguLi5hcmdzKVxuICB9XG59KVxuXG4vKipcbiAqIE1peCBpbiB0aGUgXCJzdGFydFwiLCBcImVuZFwiIGFuZCBcImVkZ2VcIiBjb252ZW5pZW5jZSBtZXRob2RzLlxuICovXG5cbmNvbnN0IEVER0VfTUVUSE9EUyA9IFtcbiAgWydoYXMnLCAnQXRTdGFydE9mJywgdHJ1ZV0sXG4gIFsnaGFzJywgJ0F0RW5kT2YnLCB0cnVlXSxcbiAgWydoYXMnLCAnQmV0d2VlbicsIHRydWVdLFxuICBbJ2hhcycsICdJbicsIHRydWVdLFxuICBbJ2NvbGxhcHNlVG8nLCAnJ10sXG4gIFsnbW92ZScsICcnXSxcbiAgWydtb3ZlVG8nLCAnJ10sXG4gIFsnbW92ZScsICdUbyddLFxuICBbJ21vdmUnLCAnT2Zmc2V0VG8nXSxcbl1cblxuRURHRV9NRVRIT0RTLmZvckVhY2goKFsgcCwgcywgaGFzRWRnZSBdKSA9PiB7XG4gIGNvbnN0IGFuY2hvciA9IGAke3B9QW5jaG9yJHtzfWBcbiAgY29uc3QgZm9jdXMgPSBgJHtwfUZvY3VzJHtzfWBcblxuICBTZWxlY3Rpb24ucHJvdG90eXBlW2Ake3B9U3RhcnQke3N9YF0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmlzQmFja3dhcmRcbiAgICAgID8gdGhpc1tmb2N1c10oLi4uYXJncylcbiAgICAgIDogdGhpc1thbmNob3JdKC4uLmFyZ3MpXG4gIH1cblxuICBTZWxlY3Rpb24ucHJvdG90eXBlW2Ake3B9RW5kJHtzfWBdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5pc0JhY2t3YXJkXG4gICAgICA/IHRoaXNbYW5jaG9yXSguLi5hcmdzKVxuICAgICAgOiB0aGlzW2ZvY3VzXSguLi5hcmdzKVxuICB9XG5cbiAgaWYgKGhhc0VkZ2UpIHtcbiAgICBTZWxlY3Rpb24ucHJvdG90eXBlW2Ake3B9RWRnZSR7c31gXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICByZXR1cm4gdGhpc1thbmNob3JdKC4uLmFyZ3MpIHx8IHRoaXNbZm9jdXNdKC4uLmFyZ3MpXG4gICAgfVxuICB9XG59KVxuXG4vKipcbiAqIE1peCBpbiBzb21lIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlIC8gcGFyYWxsZWxpc20gd2l0aCB0aGUgYnJvd3NlciBBUElzLlxuICovXG5cbmNvbnN0IEFMSUFTX01FVEhPRFMgPSBbXG4gIFsnY29sbGFwc2VUbycsICdtb3ZlVG8nXSxcbiAgWydjb2xsYXBzZVRvQW5jaG9yJywgJ21vdmVUb0FuY2hvciddLFxuICBbJ2NvbGxhcHNlVG9Gb2N1cycsICdtb3ZlVG9Gb2N1cyddLFxuICBbJ2NvbGxhcHNlVG9TdGFydCcsICdtb3ZlVG9TdGFydCddLFxuICBbJ2NvbGxhcHNlVG9FbmQnLCAnbW92ZVRvRW5kJ10sXG4gIFsnY29sbGFwc2VUb1N0YXJ0T2YnLCAnbW92ZVRvU3RhcnRPZiddLFxuICBbJ2NvbGxhcHNlVG9FbmRPZicsICdtb3ZlVG9FbmRPZiddLFxuICBbJ2V4dGVuZCcsICdtb3ZlRm9jdXMnXSxcbiAgWydleHRlbmRUbycsICdtb3ZlRm9jdXNUbyddLFxuICBbJ2V4dGVuZFRvU3RhcnRPZicsICdtb3ZlRm9jdXNUb1N0YXJ0T2YnXSxcbiAgWydleHRlbmRUb0VuZE9mJywgJ21vdmVGb2N1c1RvRW5kT2YnXSxcbl1cblxuQUxJQVNfTUVUSE9EUy5mb3JFYWNoKChbIGFsaWFzLCBtZXRob2QgXSkgPT4ge1xuICBTZWxlY3Rpb24ucHJvdG90eXBlW2FsaWFzXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXNbbWV0aG9kXSguLi5hcmdzKVxuICB9XG59KVxuXG4vKipcbiAqIEdldCB0aGUgZmlyc3QgdGV4dCBvZiBhIGBub2RlYC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge1RleHR9XG4gKi9cblxuZnVuY3Rpb24gZ2V0Rmlyc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5raW5kID09ICd0ZXh0JyA/IG5vZGUgOiBub2RlLmdldEZpcnN0VGV4dCgpXG59XG5cbi8qKlxuICogR2V0IHRoZSBsYXN0IHRleHQgb2YgYSBgbm9kZWAuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtUZXh0fVxuICovXG5cbmZ1bmN0aW9uIGdldExhc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5raW5kID09ICd0ZXh0JyA/IG5vZGUgOiBub2RlLmdldExhc3RUZXh0KClcbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge1NlbGVjdGlvbn1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3Rpb25cbiJdfQ==