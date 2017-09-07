'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _core = require('../schemas/core');

var _core2 = _interopRequireDefault(_core);

var _change = require('./change');

var _change2 = _interopRequireDefault(_change);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _history = require('./history');

var _history2 = _interopRequireDefault(_history);

var _selection = require('./selection');

var _selection2 = _interopRequireDefault(_selection);

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
  document: _document2.default.create(),
  selection: _selection2.default.create(),
  history: _history2.default.create(),
  data: new _immutable.Map(),
  isNative: false

  /**
   * State.
   *
   * @type {State}
   */

};
var State = function (_Record) {
  _inherits(State, _Record);

  function State() {
    _classCallCheck(this, State);

    return _possibleConstructorReturn(this, (State.__proto__ || Object.getPrototypeOf(State)).apply(this, arguments));
  }

  _createClass(State, [{
    key: 'change',


    /**
     * Create a new `Change` with the current state as a starting point.
     *
     * @param {Object} attrs
     * @return {Change}
     */

    value: function change() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new _change2.default(_extends({}, attrs, { state: this }));
    }

    /**
     * Deprecated.
     *
     * @return {Change}
     */

  }, {
    key: 'transform',
    value: function transform() {
      _logger2.default.deprecate('0.22.0', 'The `state.transform()` method has been deprecated in favor of `state.change()`.');
      return this.change.apply(this, arguments);
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'state';
    }

    /**
     * Are there undoable events?
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasUndos',
    get: function get() {
      return this.history.undos.size > 0;
    }

    /**
     * Are there redoable events?
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasRedos',
    get: function get() {
      return this.history.redos.size > 0;
    }

    /**
     * Is the current selection blurred?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get() {
      return this.selection.isBlurred;
    }

    /**
     * Is the current selection focused?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isFocused',
    get: function get() {
      return this.selection.isFocused;
    }

    /**
     * Is the current selection collapsed?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get() {
      return this.selection.isCollapsed;
    }

    /**
     * Is the current selection expanded?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get() {
      return this.selection.isExpanded;
    }

    /**
     * Is the current selection backward?
     *
     * @return {Boolean} isBackward
     */

  }, {
    key: 'isBackward',
    get: function get() {
      return this.selection.isBackward;
    }

    /**
     * Is the current selection forward?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get() {
      return this.selection.isForward;
    }

    /**
     * Get the current start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get() {
      return this.selection.startKey;
    }

    /**
     * Get the current end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get() {
      return this.selection.endKey;
    }

    /**
     * Get the current start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get() {
      return this.selection.startOffset;
    }

    /**
     * Get the current end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get() {
      return this.selection.endOffset;
    }

    /**
     * Get the current anchor key.
     *
     * @return {String}
     */

  }, {
    key: 'anchorKey',
    get: function get() {
      return this.selection.anchorKey;
    }

    /**
     * Get the current focus key.
     *
     * @return {String}
     */

  }, {
    key: 'focusKey',
    get: function get() {
      return this.selection.focusKey;
    }

    /**
     * Get the current anchor offset.
     *
     * @return {String}
     */

  }, {
    key: 'anchorOffset',
    get: function get() {
      return this.selection.anchorOffset;
    }

    /**
     * Get the current focus offset.
     *
     * @return {String}
     */

  }, {
    key: 'focusOffset',
    get: function get() {
      return this.selection.focusOffset;
    }

    /**
     * Get the current start text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'startBlock',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestBlock(this.selection.startKey);
    }

    /**
     * Get the current end text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'endBlock',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestBlock(this.selection.endKey);
    }

    /**
     * Get the current anchor text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'anchorBlock',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestBlock(this.selection.anchorKey);
    }

    /**
     * Get the current focus text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'focusBlock',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestBlock(this.selection.focusKey);
    }

    /**
     * Get the current start text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'startInline',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestInline(this.selection.startKey);
    }

    /**
     * Get the current end text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'endInline',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestInline(this.selection.endKey);
    }

    /**
     * Get the current anchor text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'anchorInline',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestInline(this.selection.anchorKey);
    }

    /**
     * Get the current focus text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'focusInline',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getClosestInline(this.selection.focusKey);
    }

    /**
     * Get the current start text node.
     *
     * @return {Text}
     */

  }, {
    key: 'startText',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getDescendant(this.selection.startKey);
    }

    /**
     * Get the current end node.
     *
     * @return {Text}
     */

  }, {
    key: 'endText',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getDescendant(this.selection.endKey);
    }

    /**
     * Get the current anchor node.
     *
     * @return {Text}
     */

  }, {
    key: 'anchorText',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getDescendant(this.selection.anchorKey);
    }

    /**
     * Get the current focus node.
     *
     * @return {Text}
     */

  }, {
    key: 'focusText',
    get: function get() {
      return this.selection.isUnset ? null : this.document.getDescendant(this.selection.focusKey);
    }

    /**
     * Get the characters in the current selection.
     *
     * @return {List<Character>}
     */

  }, {
    key: 'characters',
    get: function get() {
      return this.selection.isUnset ? new _immutable.List() : this.document.getCharactersAtRange(this.selection);
    }

    /**
     * Get the marks of the current selection.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'marks',
    get: function get() {
      return this.selection.isUnset ? new _immutable.Set() : this.selection.marks || this.document.getMarksAtRange(this.selection);
    }

    /**
     * Get the active marks of the current selection.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'activeMarks',
    get: function get() {
      return this.selection.isUnset ? new _immutable.Set() : this.selection.marks || this.document.getActiveMarksAtRange(this.selection);
    }

    /**
     * Get the block nodes in the current selection.
     *
     * @return {List<Block>}
     */

  }, {
    key: 'blocks',
    get: function get() {
      return this.selection.isUnset ? new _immutable.List() : this.document.getBlocksAtRange(this.selection);
    }

    /**
     * Get the fragment of the current selection.
     *
     * @return {Document}
     */

  }, {
    key: 'fragment',
    get: function get() {
      return this.selection.isUnset ? _document2.default.create() : this.document.getFragmentAtRange(this.selection);
    }

    /**
     * Get the inline nodes in the current selection.
     *
     * @return {List<Inline>}
     */

  }, {
    key: 'inlines',
    get: function get() {
      return this.selection.isUnset ? new _immutable.List() : this.document.getInlinesAtRange(this.selection);
    }

    /**
     * Get the text nodes in the current selection.
     *
     * @return {List<Text>}
     */

  }, {
    key: 'texts',
    get: function get() {
      return this.selection.isUnset ? new _immutable.List() : this.document.getTextsAtRange(this.selection);
    }

    /**
     * Check whether the selection is empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get() {
      var startOffset = this.startOffset,
          endOffset = this.endOffset;


      if (this.isCollapsed) {
        return true;
      }

      if (endOffset != 0 && startOffset != 0) {
        return false;
      }

      return this.fragment.text.length == 0;
    }
  }], [{
    key: 'create',


    /**
     * Create a new `State` with `attrs`.
     *
     * @param {Object|State} attrs
     * @param {Object} options
     *   @property {Boolean} normalize
     * @return {State}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (State.isState(attrs)) {
        return attrs;
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var document = _document2.default.create(attrs.document);
        var selection = _selection2.default.create(attrs.selection);
        var data = new _immutable.Map();

        if (selection.isUnset) {
          var text = document.getFirstText();
          if (text) selection = selection.collapseToStartOf(text);
        }

        // Set default value for `data`.
        if (options.plugins) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = options.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var plugin = _step.value;

              if (plugin.data) data = data.merge(plugin.data);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        // Then add data provided in `attrs`.
        if (attrs.data) data = data.merge(attrs.data);

        var state = new State({ document: document, selection: selection, data: data });

        if (options.normalize !== false) {
          state = state.change({ save: false }).normalize(_core2.default).state;
        }

        return state;
      }

      throw new Error('`State.create` only accepts objects or states, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `State`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isState',
    value: function isState(value) {
      return !!(value && value[_modelTypes2.default.STATE]);
    }
  }]);

  return State;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

State.prototype[_modelTypes2.default.STATE] = true;

/**
 * Export.
 */

exports.default = State;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc3RhdGUuanMiXSwibmFtZXMiOlsiREVGQVVMVFMiLCJkb2N1bWVudCIsImNyZWF0ZSIsInNlbGVjdGlvbiIsImhpc3RvcnkiLCJkYXRhIiwiaXNOYXRpdmUiLCJTdGF0ZSIsImF0dHJzIiwic3RhdGUiLCJkZXByZWNhdGUiLCJjaGFuZ2UiLCJ1bmRvcyIsInNpemUiLCJyZWRvcyIsImlzQmx1cnJlZCIsImlzRm9jdXNlZCIsImlzQ29sbGFwc2VkIiwiaXNFeHBhbmRlZCIsImlzQmFja3dhcmQiLCJpc0ZvcndhcmQiLCJzdGFydEtleSIsImVuZEtleSIsInN0YXJ0T2Zmc2V0IiwiZW5kT2Zmc2V0IiwiYW5jaG9yS2V5IiwiZm9jdXNLZXkiLCJhbmNob3JPZmZzZXQiLCJmb2N1c09mZnNldCIsImlzVW5zZXQiLCJnZXRDbG9zZXN0QmxvY2siLCJnZXRDbG9zZXN0SW5saW5lIiwiZ2V0RGVzY2VuZGFudCIsImdldENoYXJhY3RlcnNBdFJhbmdlIiwibWFya3MiLCJnZXRNYXJrc0F0UmFuZ2UiLCJnZXRBY3RpdmVNYXJrc0F0UmFuZ2UiLCJnZXRCbG9ja3NBdFJhbmdlIiwiZ2V0RnJhZ21lbnRBdFJhbmdlIiwiZ2V0SW5saW5lc0F0UmFuZ2UiLCJnZXRUZXh0c0F0UmFuZ2UiLCJmcmFnbWVudCIsInRleHQiLCJsZW5ndGgiLCJvcHRpb25zIiwiaXNTdGF0ZSIsImdldEZpcnN0VGV4dCIsImNvbGxhcHNlVG9TdGFydE9mIiwicGx1Z2lucyIsInBsdWdpbiIsIm1lcmdlIiwibm9ybWFsaXplIiwic2F2ZSIsIkVycm9yIiwidmFsdWUiLCJTVEFURSIsInByb3RvdHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxXQUFXO0FBQ2ZDLFlBQVUsbUJBQVNDLE1B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QWdCLHFCQUFZRCxLQUE1QixJQUFxQyxJQUFyQzs7QUFFQTs7OztrQkFJZWhELEsiLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgU0NIRU1BIGZyb20gJy4uL3NjaGVtYXMvY29yZSdcbmltcG9ydCBDaGFuZ2UgZnJvbSAnLi9jaGFuZ2UnXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi9kb2N1bWVudCdcbmltcG9ydCBIaXN0b3J5IGZyb20gJy4vaGlzdG9yeSdcbmltcG9ydCBTZWxlY3Rpb24gZnJvbSAnLi9zZWxlY3Rpb24nXG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdpcy1wbGFpbi1vYmplY3QnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcidcbmltcG9ydCB7IFJlY29yZCwgU2V0LCBMaXN0LCBNYXAgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogRGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuY29uc3QgREVGQVVMVFMgPSB7XG4gIGRvY3VtZW50OiBEb2N1bWVudC5jcmVhdGUoKSxcbiAgc2VsZWN0aW9uOiBTZWxlY3Rpb24uY3JlYXRlKCksXG4gIGhpc3Rvcnk6IEhpc3RvcnkuY3JlYXRlKCksXG4gIGRhdGE6IG5ldyBNYXAoKSxcbiAgaXNOYXRpdmU6IGZhbHNlLFxufVxuXG4vKipcbiAqIFN0YXRlLlxuICpcbiAqIEB0eXBlIHtTdGF0ZX1cbiAqL1xuXG5jbGFzcyBTdGF0ZSBleHRlbmRzIFJlY29yZChERUZBVUxUUykge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYFN0YXRlYCB3aXRoIGBhdHRyc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fFN0YXRlfSBhdHRyc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbm9ybWFsaXplXG4gICAqIEByZXR1cm4ge1N0YXRlfVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlKGF0dHJzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChTdGF0ZS5pc1N0YXRlKGF0dHJzKSkge1xuICAgICAgcmV0dXJuIGF0dHJzXG4gICAgfVxuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QoYXR0cnMpKSB7XG4gICAgICBjb25zdCBkb2N1bWVudCA9IERvY3VtZW50LmNyZWF0ZShhdHRycy5kb2N1bWVudClcbiAgICAgIGxldCBzZWxlY3Rpb24gPSBTZWxlY3Rpb24uY3JlYXRlKGF0dHJzLnNlbGVjdGlvbilcbiAgICAgIGxldCBkYXRhID0gbmV3IE1hcCgpXG5cbiAgICAgIGlmIChzZWxlY3Rpb24uaXNVbnNldCkge1xuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0Rmlyc3RUZXh0KClcbiAgICAgICAgaWYgKHRleHQpIHNlbGVjdGlvbiA9IHNlbGVjdGlvbi5jb2xsYXBzZVRvU3RhcnRPZih0ZXh0KVxuICAgICAgfVxuXG4gICAgICAvLyBTZXQgZGVmYXVsdCB2YWx1ZSBmb3IgYGRhdGFgLlxuICAgICAgaWYgKG9wdGlvbnMucGx1Z2lucykge1xuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBvcHRpb25zLnBsdWdpbnMpIHtcbiAgICAgICAgICBpZiAocGx1Z2luLmRhdGEpIGRhdGEgPSBkYXRhLm1lcmdlKHBsdWdpbi5kYXRhKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZW4gYWRkIGRhdGEgcHJvdmlkZWQgaW4gYGF0dHJzYC5cbiAgICAgIGlmIChhdHRycy5kYXRhKSBkYXRhID0gZGF0YS5tZXJnZShhdHRycy5kYXRhKVxuXG4gICAgICBsZXQgc3RhdGUgPSBuZXcgU3RhdGUoeyBkb2N1bWVudCwgc2VsZWN0aW9uLCBkYXRhIH0pXG5cbiAgICAgIGlmIChvcHRpb25zLm5vcm1hbGl6ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgc3RhdGUgPSBzdGF0ZVxuICAgICAgICAgIC5jaGFuZ2UoeyBzYXZlOiBmYWxzZSB9KVxuICAgICAgICAgIC5ub3JtYWxpemUoU0NIRU1BKVxuICAgICAgICAgIC5zdGF0ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYFN0YXRlLmNyZWF0ZVxcYCBvbmx5IGFjY2VwdHMgb2JqZWN0cyBvciBzdGF0ZXMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2F0dHJzfWApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBgdmFsdWVgIGlzIGEgYFN0YXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHN0YXRpYyBpc1N0YXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlW01PREVMX1RZUEVTLlNUQVRFXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGtpbmQuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IGtpbmQoKSB7XG4gICAgcmV0dXJuICdzdGF0ZSdcbiAgfVxuXG4gIC8qKlxuICAgKiBBcmUgdGhlcmUgdW5kb2FibGUgZXZlbnRzP1xuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaGFzVW5kb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS51bmRvcy5zaXplID4gMFxuICB9XG5cbiAgLyoqXG4gICAqIEFyZSB0aGVyZSByZWRvYWJsZSBldmVudHM/XG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBoYXNSZWRvcygpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5LnJlZG9zLnNpemUgPiAwXG4gIH1cblxuICAvKipcbiAgICogSXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGJsdXJyZWQ/XG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0JsdXJyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzQmx1cnJlZFxuICB9XG5cbiAgLyoqXG4gICAqIElzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBmb2N1c2VkP1xuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaXNGb2N1c2VkKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc0ZvY3VzZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBJcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gY29sbGFwc2VkP1xuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaXNDb2xsYXBzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzQ29sbGFwc2VkXG4gIH1cblxuICAvKipcbiAgICogSXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGV4cGFuZGVkP1xuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaXNFeHBhbmRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNFeHBhbmRlZFxuICB9XG5cbiAgLyoqXG4gICAqIElzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBiYWNrd2FyZD9cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gaXNCYWNrd2FyZFxuICAgKi9cblxuICBnZXQgaXNCYWNrd2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNCYWNrd2FyZFxuICB9XG5cbiAgLyoqXG4gICAqIElzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBmb3J3YXJkP1xuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaXNGb3J3YXJkKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc0ZvcndhcmRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgc3RhcnQga2V5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBzdGFydEtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uc3RhcnRLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgZW5kIGtleS5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgZW5kS2V5KCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5lbmRLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgc3RhcnQgb2Zmc2V0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBzdGFydE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uc3RhcnRPZmZzZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgZW5kIG9mZnNldC5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgZW5kT2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5lbmRPZmZzZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYW5jaG9yIGtleS5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgYW5jaG9yS2V5KCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5hbmNob3JLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgZm9jdXMga2V5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBmb2N1c0tleSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uZm9jdXNLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYW5jaG9yIG9mZnNldC5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgYW5jaG9yT2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5hbmNob3JPZmZzZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgZm9jdXMgb2Zmc2V0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBmb2N1c09mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uZm9jdXNPZmZzZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgc3RhcnQgdGV4dCBub2RlJ3MgY2xvc2VzdCBibG9jayBwYXJlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jsb2NrfVxuICAgKi9cblxuICBnZXQgc3RhcnRCbG9jaygpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNVbnNldFxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMuZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHRoaXMuc2VsZWN0aW9uLnN0YXJ0S2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBlbmQgdGV4dCBub2RlJ3MgY2xvc2VzdCBibG9jayBwYXJlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jsb2NrfVxuICAgKi9cblxuICBnZXQgZW5kQmxvY2soKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbnVsbFxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldENsb3Nlc3RCbG9jayh0aGlzLnNlbGVjdGlvbi5lbmRLZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGFuY2hvciB0ZXh0IG5vZGUncyBjbG9zZXN0IGJsb2NrIHBhcmVudC5cbiAgICpcbiAgICogQHJldHVybiB7QmxvY2t9XG4gICAqL1xuXG4gIGdldCBhbmNob3JCbG9jaygpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNVbnNldFxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMuZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHRoaXMuc2VsZWN0aW9uLmFuY2hvcktleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgZm9jdXMgdGV4dCBub2RlJ3MgY2xvc2VzdCBibG9jayBwYXJlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jsb2NrfVxuICAgKi9cblxuICBnZXQgZm9jdXNCbG9jaygpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNVbnNldFxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMuZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKHRoaXMuc2VsZWN0aW9uLmZvY3VzS2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBzdGFydCB0ZXh0IG5vZGUncyBjbG9zZXN0IGlubGluZSBwYXJlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0lubGluZX1cbiAgICovXG5cbiAgZ2V0IHN0YXJ0SW5saW5lKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1Vuc2V0XG4gICAgICA/IG51bGxcbiAgICAgIDogdGhpcy5kb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKHRoaXMuc2VsZWN0aW9uLnN0YXJ0S2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBlbmQgdGV4dCBub2RlJ3MgY2xvc2VzdCBpbmxpbmUgcGFyZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtJbmxpbmV9XG4gICAqL1xuXG4gIGdldCBlbmRJbmxpbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbnVsbFxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldENsb3Nlc3RJbmxpbmUodGhpcy5zZWxlY3Rpb24uZW5kS2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBhbmNob3IgdGV4dCBub2RlJ3MgY2xvc2VzdCBpbmxpbmUgcGFyZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtJbmxpbmV9XG4gICAqL1xuXG4gIGdldCBhbmNob3JJbmxpbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbnVsbFxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldENsb3Nlc3RJbmxpbmUodGhpcy5zZWxlY3Rpb24uYW5jaG9yS2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBmb2N1cyB0ZXh0IG5vZGUncyBjbG9zZXN0IGlubGluZSBwYXJlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0lubGluZX1cbiAgICovXG5cbiAgZ2V0IGZvY3VzSW5saW5lKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1Vuc2V0XG4gICAgICA/IG51bGxcbiAgICAgIDogdGhpcy5kb2N1bWVudC5nZXRDbG9zZXN0SW5saW5lKHRoaXMuc2VsZWN0aW9uLmZvY3VzS2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBzdGFydCB0ZXh0IG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1RleHR9XG4gICAqL1xuXG4gIGdldCBzdGFydFRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbnVsbFxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldERlc2NlbmRhbnQodGhpcy5zZWxlY3Rpb24uc3RhcnRLZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGVuZCBub2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0fVxuICAgKi9cblxuICBnZXQgZW5kVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNVbnNldFxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMuZG9jdW1lbnQuZ2V0RGVzY2VuZGFudCh0aGlzLnNlbGVjdGlvbi5lbmRLZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGFuY2hvciBub2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0fVxuICAgKi9cblxuICBnZXQgYW5jaG9yVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNVbnNldFxuICAgICAgPyBudWxsXG4gICAgICA6IHRoaXMuZG9jdW1lbnQuZ2V0RGVzY2VuZGFudCh0aGlzLnNlbGVjdGlvbi5hbmNob3JLZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGZvY3VzIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1RleHR9XG4gICAqL1xuXG4gIGdldCBmb2N1c1RleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbnVsbFxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldERlc2NlbmRhbnQodGhpcy5zZWxlY3Rpb24uZm9jdXNLZXkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjaGFyYWN0ZXJzIGluIHRoZSBjdXJyZW50IHNlbGVjdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7TGlzdDxDaGFyYWN0ZXI+fVxuICAgKi9cblxuICBnZXQgY2hhcmFjdGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNVbnNldFxuICAgICAgPyBuZXcgTGlzdCgpXG4gICAgICA6IHRoaXMuZG9jdW1lbnQuZ2V0Q2hhcmFjdGVyc0F0UmFuZ2UodGhpcy5zZWxlY3Rpb24pXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtYXJrcyBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge1NldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0IG1hcmtzKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1Vuc2V0XG4gICAgICA/IG5ldyBTZXQoKVxuICAgICAgOiB0aGlzLnNlbGVjdGlvbi5tYXJrcyB8fCB0aGlzLmRvY3VtZW50LmdldE1hcmtzQXRSYW5nZSh0aGlzLnNlbGVjdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGFjdGl2ZSBtYXJrcyBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge1NldDxNYXJrPn1cbiAgICovXG5cbiAgZ2V0IGFjdGl2ZU1hcmtzKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1Vuc2V0XG4gICAgICA/IG5ldyBTZXQoKVxuICAgICAgOiB0aGlzLnNlbGVjdGlvbi5tYXJrcyB8fCB0aGlzLmRvY3VtZW50LmdldEFjdGl2ZU1hcmtzQXRSYW5nZSh0aGlzLnNlbGVjdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJsb2NrIG5vZGVzIGluIHRoZSBjdXJyZW50IHNlbGVjdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7TGlzdDxCbG9jaz59XG4gICAqL1xuXG4gIGdldCBibG9ja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbmV3IExpc3QoKVxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldEJsb2Nrc0F0UmFuZ2UodGhpcy5zZWxlY3Rpb24pXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBmcmFnbWVudCBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge0RvY3VtZW50fVxuICAgKi9cblxuICBnZXQgZnJhZ21lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gRG9jdW1lbnQuY3JlYXRlKClcbiAgICAgIDogdGhpcy5kb2N1bWVudC5nZXRGcmFnbWVudEF0UmFuZ2UodGhpcy5zZWxlY3Rpb24pXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBpbmxpbmUgbm9kZXMgaW4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtMaXN0PElubGluZT59XG4gICAqL1xuXG4gIGdldCBpbmxpbmVzKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1Vuc2V0XG4gICAgICA/IG5ldyBMaXN0KClcbiAgICAgIDogdGhpcy5kb2N1bWVudC5nZXRJbmxpbmVzQXRSYW5nZSh0aGlzLnNlbGVjdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRleHQgbm9kZXMgaW4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtMaXN0PFRleHQ+fVxuICAgKi9cblxuICBnZXQgdGV4dHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzVW5zZXRcbiAgICAgID8gbmV3IExpc3QoKVxuICAgICAgOiB0aGlzLmRvY3VtZW50LmdldFRleHRzQXRSYW5nZSh0aGlzLnNlbGVjdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHkuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0VtcHR5KCkge1xuICAgIGNvbnN0IHsgc3RhcnRPZmZzZXQsIGVuZE9mZnNldCB9ID0gdGhpc1xuXG4gICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGVuZE9mZnNldCAhPSAwICYmIHN0YXJ0T2Zmc2V0ICE9IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZyYWdtZW50LnRleHQubGVuZ3RoID09IDBcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYENoYW5nZWAgd2l0aCB0aGUgY3VycmVudCBzdGF0ZSBhcyBhIHN0YXJ0aW5nIHBvaW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cnNcbiAgICogQHJldHVybiB7Q2hhbmdlfVxuICAgKi9cblxuICBjaGFuZ2UoYXR0cnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ2hhbmdlKHsgLi4uYXR0cnMsIHN0YXRlOiB0aGlzIH0pXG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZC5cbiAgICpcbiAgICogQHJldHVybiB7Q2hhbmdlfVxuICAgKi9cblxuICB0cmFuc2Zvcm0oLi4uYXJncykge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMjIuMCcsICdUaGUgYHN0YXRlLnRyYW5zZm9ybSgpYCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBgc3RhdGUuY2hhbmdlKClgLicpXG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlKC4uLmFyZ3MpXG4gIH1cblxufVxuXG4vKipcbiAqIEF0dGFjaCBhIHBzZXVkby1zeW1ib2wgZm9yIHR5cGUgY2hlY2tpbmcuXG4gKi9cblxuU3RhdGUucHJvdG90eXBlW01PREVMX1RZUEVTLlNUQVRFXSA9IHRydWVcblxuLyoqXG4gKiBFeHBvcnQuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgU3RhdGVcbiJdfQ==