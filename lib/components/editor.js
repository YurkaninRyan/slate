'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _reactPortal = require('react-portal');

var _reactPortal2 = _interopRequireDefault(_reactPortal);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _stack = require('../models/stack');

var _stack2 = _interopRequireDefault(_stack);

var _state = require('../models/state');

var _state2 = _interopRequireDefault(_state);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _noop = require('../utils/noop');

var _noop2 = _interopRequireDefault(_noop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:editor');

/**
 * Event handlers to mix in to the editor.
 *
 * @type {Array}
 */

var EVENT_HANDLERS = ['onBeforeInput', 'onBlur', 'onFocus', 'onCopy', 'onCut', 'onDrop', 'onKeyDown', 'onKeyUp', 'onPaste', 'onSelect'];

/**
 * Plugin-related properties of the editor.
 *
 * @type {Array}
 */

var PLUGINS_PROPS = [].concat(EVENT_HANDLERS, ['placeholder', 'placeholderClassName', 'placeholderStyle', 'plugins', 'schema']);

/**
 * Editor.
 *
 * @type {Component}
 */

var Editor = function (_React$Component) {
  _inherits(Editor, _React$Component);

  /**
   * When constructed, create a new `Stack` and run `onBeforeChange`.
   *
   * @param {Object} props
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  function Editor(props) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

    _initialiseProps.call(_this);

    _this.tmp = {};
    _this.state = {};

    // Create a new `Stack`, omitting the `onChange` property since that has
    // special significance on the editor itself.

    var state = props.state,
        onChange = props.onChange,
        rest = _objectWithoutProperties(props, ['state', 'onChange']); // eslint-disable-line no-unused-vars


    var stack = _stack2.default.create(rest);
    _this.state.stack = stack;

    // Cache and set the state.
    _this.cacheState(state);
    _this.state.state = state;

    // Create a bound event handler for each event.

    var _loop = function _loop(i) {
      var method = EVENT_HANDLERS[i];
      _this[method] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var stk = _this.state.stack;
        var change = _this.state.state.change();
        stk[method].apply(stk, [change, _this].concat(args));
        stk.onBeforeChange(change, _this);
        stk.onChange(change, _this);
        _this.onChange(change);
      };
    };

    for (var i = 0; i < EVENT_HANDLERS.length; i++) {
      _loop(i);
    }
    return _this;
  }

  /**
   * When the `props` are updated, create a new `Stack` if necessary.
   *
   * @param {Object} props
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * Cache a `state` in memory to be able to compare against it later, for
   * things like `onDocumentChange`.
   *
   * @param {State} state
   */

  /**
   * Programmatically blur the editor.
   */

  /**
   * Programmatically focus the editor.
   */

  /**
   * Get the editor's current schema.
   *
   * @return {Schema}
   */

  /**
   * Get the editor's current state.
   *
   * @return {State}
   */

  /**
   * Perform a change `fn` on the editor's current state.
   *
   * @param {Function} fn
   */

  /**
   * On change.
   *
   * @param {Change} change
   */

  _createClass(Editor, [{
    key: 'render',


    /**
     * Render the editor.
     *
     * @return {Element}
     */

    value: function render() {
      var props = this.props,
          state = this.state;
      var stack = state.stack;

      var children = stack.renderPortal(state.state, this).map(function (child, i) {
        return _react2.default.createElement(
          _reactPortal2.default,
          { key: i, isOpened: true },
          child
        );
      });

      debug('render', { props: props, state: state });

      var tree = stack.render(state.state, this, _extends({}, props, { children: children }));
      return tree;
    }
  }]);

  return Editor;
}(_react2.default.Component);

/**
 * Mix in the property types for the event handlers.
 */

Editor.propTypes = {
  autoCorrect: _propTypes2.default.bool,
  autoFocus: _propTypes2.default.bool,
  className: _propTypes2.default.string,
  onBeforeChange: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onDocumentChange: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  placeholder: _propTypes2.default.any,
  placeholderClassName: _propTypes2.default.string,
  placeholderStyle: _propTypes2.default.object,
  plugins: _propTypes2.default.array,
  readOnly: _propTypes2.default.bool,
  role: _propTypes2.default.string,
  schema: _propTypes2.default.object,
  spellCheck: _propTypes2.default.bool,
  state: _propTypes4.default.state.isRequired,
  style: _propTypes2.default.object,
  tabIndex: _propTypes2.default.number };
Editor.defaultProps = {
  autoFocus: false,
  autoCorrect: true,
  onChange: _noop2.default,
  onDocumentChange: _noop2.default,
  onSelectionChange: _noop2.default,
  plugins: [],
  readOnly: false,
  schema: {},
  spellCheck: true };

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentWillReceiveProps = function (props) {
    var state = props.state;

    // If any plugin-related properties will change, create a new `Stack`.

    for (var _i = 0; _i < PLUGINS_PROPS.length; _i++) {
      var prop = PLUGINS_PROPS[_i];
      if (props[prop] == _this2.props[prop]) continue;

      var onChange = props.onChange,
          rest = _objectWithoutProperties(props, ['onChange']); // eslint-disable-line no-unused-vars


      var stack = _stack2.default.create(rest);
      _this2.setState({ stack: stack });
    }

    // Cache and save the state.
    _this2.cacheState(state);
    _this2.setState({ state: state });
  };

  this.cacheState = function (state) {
    _this2.tmp.document = state.document;
    _this2.tmp.selection = state.selection;
  };

  this.blur = function () {
    _this2.change(function (t) {
      return t.blur();
    });
  };

  this.focus = function () {
    _this2.change(function (t) {
      return t.focus();
    });
  };

  this.getSchema = function () {
    return _this2.state.stack.schema;
  };

  this.getState = function () {
    return _this2.state.state;
  };

  this.change = function (fn) {
    var change = _this2.state.state.change();
    fn(change);
    _this2.onChange(change);
  };

  this.onChange = function (change) {
    if (_state2.default.isState(change)) {
      throw new Error('As of slate@0.22.0 the `editor.onChange` method must be passed a `Change` object not a `State` object.');
    }

    var _props = _this2.props,
        onChange = _props.onChange,
        onDocumentChange = _props.onDocumentChange,
        onSelectionChange = _props.onSelectionChange;
    var _tmp = _this2.tmp,
        document = _tmp.document,
        selection = _tmp.selection;
    var state = change.state;

    if (state == _this2.state.state) return;

    onChange(change);
    if (state.document != document) onDocumentChange(state.document, change);
    if (state.selection != selection) onSelectionChange(state.selection, change);
  };
};

for (var i = 0; i < EVENT_HANDLERS.length; i++) {
  var property = EVENT_HANDLERS[i];
  Editor.propTypes[property] = _propTypes2.default.func;
}

/**
 * Export.
 *
 * @type {Component}
 */

exports.default = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2VkaXRvci5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIkVWRU5UX0hBTkRMRVJTIiwiUExVR0lOU19QUk9QUyIsIkVkaXRvciIsInByb3BzIiwidG1wIiwic3RhdGUiLCJvbkNoYW5nZSIsInJlc3QiLCJzdGFjayIsImNyZWF0ZSIsImNhY2hlU3RhdGUiLCJpIiwibWV0aG9kIiwiYXJncyIsInN0ayIsImNoYW5nZSIsIm9uQmVmb3JlQ2hhbmdlIiwibGVuZ3RoIiwiY2hpbGRyZW4iLCJyZW5kZXJQb3J0YWwiLCJtYXAiLCJjaGlsZCIsInRyZWUiLCJyZW5kZXIiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJhdXRvQ29ycmVjdCIsImJvb2wiLCJhdXRvRm9jdXMiLCJjbGFzc05hbWUiLCJzdHJpbmciLCJmdW5jIiwib25Eb2N1bWVudENoYW5nZSIsIm9uU2VsZWN0aW9uQ2hhbmdlIiwicGxhY2Vob2xkZXIiLCJhbnkiLCJwbGFjZWhvbGRlckNsYXNzTmFtZSIsInBsYWNlaG9sZGVyU3R5bGUiLCJvYmplY3QiLCJwbHVnaW5zIiwiYXJyYXkiLCJyZWFkT25seSIsInJvbGUiLCJzY2hlbWEiLCJzcGVsbENoZWNrIiwiaXNSZXF1aXJlZCIsInN0eWxlIiwidGFiSW5kZXgiLCJudW1iZXIiLCJkZWZhdWx0UHJvcHMiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwicHJvcCIsInNldFN0YXRlIiwiZG9jdW1lbnQiLCJzZWxlY3Rpb24iLCJibHVyIiwidCIsImZvY3VzIiwiZ2V0U2NoZW1hIiwiZ2V0U3RhdGUiLCJmbiIsImlzU3RhdGUiLCJFcnJvciIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsUUFBUSxxQkFBTSxjQUFOLENBQWQ7O0FB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LFlBQU0sSUFBSStDLEtBQUosQ0FBVSx3R0FBVixDQUFOO0FBQ0Q7O0FBSG9CLGlCQUtxQyxPQUFLM0QsS0FMMUM7QUFBQSxRQUtiRyxRQUxhLFVBS2JBLFFBTGE7QUFBQSxRQUtIMEIsZ0JBTEcsVUFLSEEsZ0JBTEc7QUFBQSxRQUtlQyxpQkFMZixVQUtlQSxpQkFMZjtBQUFBLGVBTVcsT0FBSzdCLEdBTmhCO0FBQUEsUUFNYmlELFFBTmEsUUFNYkEsUUFOYTtBQUFBLFFBTUhDLFNBTkcsUUFNSEEsU0FORztBQUFBLFFBT2JqRCxLQVBhLEdBT0hVLE1BUEcsQ0FPYlYsS0FQYTs7QUFRckIsUUFBSUEsU0FBUyxPQUFLQSxLQUFMLENBQVdBLEtBQXhCLEVBQStCOztBQUUvQkMsYUFBU1MsTUFBVDtBQUNBLFFBQUlWLE1BQU1nRCxRQUFOLElBQWtCQSxRQUF0QixFQUFnQ3JCLGlCQUFpQjNCLE1BQU1nRCxRQUF2QixFQUFpQ3RDLE1BQWpDO0FBQ2hDLFFBQUlWLE1BQU1pRCxTQUFOLElBQW1CQSxTQUF2QixFQUFrQ3JCLGtCQUFrQjVCLE1BQU1pRCxTQUF4QixFQUFtQ3ZDLE1BQW5DO0FBQ25DLEc7OztBQTJCSCxLQUFLLElBQUlKLElBQUksQ0FBYixFQUFnQkEsSUFBSVgsZUFBZWlCLE1BQW5DLEVBQTJDTixHQUEzQyxFQUFnRDtBQUM5QyxNQUFNb0QsV0FBVy9ELGVBQWVXLENBQWYsQ0FBakI7QUFDQVQsU0FBT3VCLFNBQVAsQ0FBaUJzQyxRQUFqQixJQUE2QixvQkFBTWhDLElBQW5DO0FBQ0Q7O0FBRUQ7Ozs7OztrQkFNZTdCLE0iLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgUG9ydGFsIGZyb20gJ3JlYWN0LXBvcnRhbCdcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuXG5pbXBvcnQgU3RhY2sgZnJvbSAnLi4vbW9kZWxzL3N0YWNrJ1xuaW1wb3J0IFN0YXRlIGZyb20gJy4uL21vZGVscy9zdGF0ZSdcbmltcG9ydCBTbGF0ZVR5cGVzIGZyb20gJy4uL3V0aWxzL3Byb3AtdHlwZXMnXG5pbXBvcnQgbm9vcCBmcm9tICcuLi91dGlscy9ub29wJ1xuXG4vKipcbiAqIERlYnVnLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdzbGF0ZTplZGl0b3InKVxuXG4vKipcbiAqIEV2ZW50IGhhbmRsZXJzIHRvIG1peCBpbiB0byB0aGUgZWRpdG9yLlxuICpcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuXG5jb25zdCBFVkVOVF9IQU5ETEVSUyA9IFtcbiAgJ29uQmVmb3JlSW5wdXQnLFxuICAnb25CbHVyJyxcbiAgJ29uRm9jdXMnLFxuICAnb25Db3B5JyxcbiAgJ29uQ3V0JyxcbiAgJ29uRHJvcCcsXG4gICdvbktleURvd24nLFxuICAnb25LZXlVcCcsXG4gICdvblBhc3RlJyxcbiAgJ29uU2VsZWN0Jyxcbl1cblxuLyoqXG4gKiBQbHVnaW4tcmVsYXRlZCBwcm9wZXJ0aWVzIG9mIHRoZSBlZGl0b3IuXG4gKlxuICogQHR5cGUge0FycmF5fVxuICovXG5cbmNvbnN0IFBMVUdJTlNfUFJPUFMgPSBbXG4gIC4uLkVWRU5UX0hBTkRMRVJTLFxuICAncGxhY2Vob2xkZXInLFxuICAncGxhY2Vob2xkZXJDbGFzc05hbWUnLFxuICAncGxhY2Vob2xkZXJTdHlsZScsXG4gICdwbHVnaW5zJyxcbiAgJ3NjaGVtYScsXG5dXG5cbi8qKlxuICogRWRpdG9yLlxuICpcbiAqIEB0eXBlIHtDb21wb25lbnR9XG4gKi9cblxuY2xhc3MgRWRpdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAvKipcbiAgICogUHJvcGVydHkgdHlwZXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYXV0b0NvcnJlY3Q6IFR5cGVzLmJvb2wsXG4gICAgYXV0b0ZvY3VzOiBUeXBlcy5ib29sLFxuICAgIGNsYXNzTmFtZTogVHlwZXMuc3RyaW5nLFxuICAgIG9uQmVmb3JlQ2hhbmdlOiBUeXBlcy5mdW5jLFxuICAgIG9uQ2hhbmdlOiBUeXBlcy5mdW5jLFxuICAgIG9uRG9jdW1lbnRDaGFuZ2U6IFR5cGVzLmZ1bmMsXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFR5cGVzLmZ1bmMsXG4gICAgcGxhY2Vob2xkZXI6IFR5cGVzLmFueSxcbiAgICBwbGFjZWhvbGRlckNsYXNzTmFtZTogVHlwZXMuc3RyaW5nLFxuICAgIHBsYWNlaG9sZGVyU3R5bGU6IFR5cGVzLm9iamVjdCxcbiAgICBwbHVnaW5zOiBUeXBlcy5hcnJheSxcbiAgICByZWFkT25seTogVHlwZXMuYm9vbCxcbiAgICByb2xlOiBUeXBlcy5zdHJpbmcsXG4gICAgc2NoZW1hOiBUeXBlcy5vYmplY3QsXG4gICAgc3BlbGxDaGVjazogVHlwZXMuYm9vbCxcbiAgICBzdGF0ZTogU2xhdGVUeXBlcy5zdGF0ZS5pc1JlcXVpcmVkLFxuICAgIHN0eWxlOiBUeXBlcy5vYmplY3QsXG4gICAgdGFiSW5kZXg6IFR5cGVzLm51bWJlcixcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgYXV0b0ZvY3VzOiBmYWxzZSxcbiAgICBhdXRvQ29ycmVjdDogdHJ1ZSxcbiAgICBvbkNoYW5nZTogbm9vcCxcbiAgICBvbkRvY3VtZW50Q2hhbmdlOiBub29wLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBub29wLFxuICAgIHBsdWdpbnM6IFtdLFxuICAgIHJlYWRPbmx5OiBmYWxzZSxcbiAgICBzY2hlbWE6IHt9LFxuICAgIHNwZWxsQ2hlY2s6IHRydWUsXG4gIH1cblxuICAvKipcbiAgICogV2hlbiBjb25zdHJ1Y3RlZCwgY3JlYXRlIGEgbmV3IGBTdGFja2AgYW5kIHJ1biBgb25CZWZvcmVDaGFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICovXG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnRtcCA9IHt9XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG5cbiAgICAvLyBDcmVhdGUgYSBuZXcgYFN0YWNrYCwgb21pdHRpbmcgdGhlIGBvbkNoYW5nZWAgcHJvcGVydHkgc2luY2UgdGhhdCBoYXNcbiAgICAvLyBzcGVjaWFsIHNpZ25pZmljYW5jZSBvbiB0aGUgZWRpdG9yIGl0c2VsZi5cbiAgICBjb25zdCB7IHN0YXRlLCBvbkNoYW5nZSwgLi4ucmVzdCB9ID0gcHJvcHMgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2suY3JlYXRlKHJlc3QpXG4gICAgdGhpcy5zdGF0ZS5zdGFjayA9IHN0YWNrXG5cbiAgICAvLyBDYWNoZSBhbmQgc2V0IHRoZSBzdGF0ZS5cbiAgICB0aGlzLmNhY2hlU3RhdGUoc3RhdGUpXG4gICAgdGhpcy5zdGF0ZS5zdGF0ZSA9IHN0YXRlXG5cbiAgICAvLyBDcmVhdGUgYSBib3VuZCBldmVudCBoYW5kbGVyIGZvciBlYWNoIGV2ZW50LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRVZFTlRfSEFORExFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IEVWRU5UX0hBTkRMRVJTW2ldXG4gICAgICB0aGlzW21ldGhvZF0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zdCBzdGsgPSB0aGlzLnN0YXRlLnN0YWNrXG4gICAgICAgIGNvbnN0IGNoYW5nZSA9IHRoaXMuc3RhdGUuc3RhdGUuY2hhbmdlKClcbiAgICAgICAgc3RrW21ldGhvZF0oY2hhbmdlLCB0aGlzLCAuLi5hcmdzKVxuICAgICAgICBzdGsub25CZWZvcmVDaGFuZ2UoY2hhbmdlLCB0aGlzKVxuICAgICAgICBzdGsub25DaGFuZ2UoY2hhbmdlLCB0aGlzKVxuICAgICAgICB0aGlzLm9uQ2hhbmdlKGNoYW5nZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgYHByb3BzYCBhcmUgdXBkYXRlZCwgY3JlYXRlIGEgbmV3IGBTdGFja2AgaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICovXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IHByb3BzXG5cbiAgICAvLyBJZiBhbnkgcGx1Z2luLXJlbGF0ZWQgcHJvcGVydGllcyB3aWxsIGNoYW5nZSwgY3JlYXRlIGEgbmV3IGBTdGFja2AuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBQTFVHSU5TX1BST1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwcm9wID0gUExVR0lOU19QUk9QU1tpXVxuICAgICAgaWYgKHByb3BzW3Byb3BdID09IHRoaXMucHJvcHNbcHJvcF0pIGNvbnRpbnVlXG4gICAgICBjb25zdCB7IG9uQ2hhbmdlLCAuLi5yZXN0IH0gPSBwcm9wcyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrLmNyZWF0ZShyZXN0KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN0YWNrIH0pXG4gICAgfVxuXG4gICAgLy8gQ2FjaGUgYW5kIHNhdmUgdGhlIHN0YXRlLlxuICAgIHRoaXMuY2FjaGVTdGF0ZShzdGF0ZSlcbiAgICB0aGlzLnNldFN0YXRlKHsgc3RhdGUgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSBhIGBzdGF0ZWAgaW4gbWVtb3J5IHRvIGJlIGFibGUgdG8gY29tcGFyZSBhZ2FpbnN0IGl0IGxhdGVyLCBmb3JcbiAgICogdGhpbmdzIGxpa2UgYG9uRG9jdW1lbnRDaGFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKi9cblxuICBjYWNoZVN0YXRlID0gKHN0YXRlKSA9PiB7XG4gICAgdGhpcy50bXAuZG9jdW1lbnQgPSBzdGF0ZS5kb2N1bWVudFxuICAgIHRoaXMudG1wLnNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvblxuICB9XG5cbiAgLyoqXG4gICAqIFByb2dyYW1tYXRpY2FsbHkgYmx1ciB0aGUgZWRpdG9yLlxuICAgKi9cblxuICBibHVyID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhbmdlKHQgPT4gdC5ibHVyKCkpXG4gIH1cblxuICAvKipcbiAgICogUHJvZ3JhbW1hdGljYWxseSBmb2N1cyB0aGUgZWRpdG9yLlxuICAgKi9cblxuICBmb2N1cyA9ICgpID0+IHtcbiAgICB0aGlzLmNoYW5nZSh0ID0+IHQuZm9jdXMoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGVkaXRvcidzIGN1cnJlbnQgc2NoZW1hLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTY2hlbWF9XG4gICAqL1xuXG4gIGdldFNjaGVtYSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zdGFjay5zY2hlbWFcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGVkaXRvcidzIGN1cnJlbnQgc3RhdGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0YXRlfVxuICAgKi9cblxuICBnZXRTdGF0ZSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gYSBjaGFuZ2UgYGZuYCBvbiB0aGUgZWRpdG9yJ3MgY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICovXG5cbiAgY2hhbmdlID0gKGZuKSA9PiB7XG4gICAgY29uc3QgY2hhbmdlID0gdGhpcy5zdGF0ZS5zdGF0ZS5jaGFuZ2UoKVxuICAgIGZuKGNoYW5nZSlcbiAgICB0aGlzLm9uQ2hhbmdlKGNoYW5nZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBjaGFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICovXG5cbiAgb25DaGFuZ2UgPSAoY2hhbmdlKSA9PiB7XG4gICAgaWYgKFN0YXRlLmlzU3RhdGUoY2hhbmdlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcyBvZiBzbGF0ZUAwLjIyLjAgdGhlIGBlZGl0b3Iub25DaGFuZ2VgIG1ldGhvZCBtdXN0IGJlIHBhc3NlZCBhIGBDaGFuZ2VgIG9iamVjdCBub3QgYSBgU3RhdGVgIG9iamVjdC4nKVxuICAgIH1cblxuICAgIGNvbnN0IHsgb25DaGFuZ2UsIG9uRG9jdW1lbnRDaGFuZ2UsIG9uU2VsZWN0aW9uQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBkb2N1bWVudCwgc2VsZWN0aW9uIH0gPSB0aGlzLnRtcFxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGlmIChzdGF0ZSA9PSB0aGlzLnN0YXRlLnN0YXRlKSByZXR1cm5cblxuICAgIG9uQ2hhbmdlKGNoYW5nZSlcbiAgICBpZiAoc3RhdGUuZG9jdW1lbnQgIT0gZG9jdW1lbnQpIG9uRG9jdW1lbnRDaGFuZ2Uoc3RhdGUuZG9jdW1lbnQsIGNoYW5nZSlcbiAgICBpZiAoc3RhdGUuc2VsZWN0aW9uICE9IHNlbGVjdGlvbikgb25TZWxlY3Rpb25DaGFuZ2Uoc3RhdGUuc2VsZWN0aW9uLCBjaGFuZ2UpXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBlZGl0b3IuXG4gICAqXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzLCBzdGF0ZSB9ID0gdGhpc1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHN0YXRlXG4gICAgY29uc3QgY2hpbGRyZW4gPSBzdGFja1xuICAgICAgLnJlbmRlclBvcnRhbChzdGF0ZS5zdGF0ZSwgdGhpcylcbiAgICAgIC5tYXAoKGNoaWxkLCBpKSA9PiA8UG9ydGFsIGtleT17aX0gaXNPcGVuZWQ+e2NoaWxkfTwvUG9ydGFsPilcblxuICAgIGRlYnVnKCdyZW5kZXInLCB7IHByb3BzLCBzdGF0ZSB9KVxuXG4gICAgY29uc3QgdHJlZSA9IHN0YWNrLnJlbmRlcihzdGF0ZS5zdGF0ZSwgdGhpcywgeyAuLi5wcm9wcywgY2hpbGRyZW4gfSlcbiAgICByZXR1cm4gdHJlZVxuICB9XG5cbn1cblxuLyoqXG4gKiBNaXggaW4gdGhlIHByb3BlcnR5IHR5cGVzIGZvciB0aGUgZXZlbnQgaGFuZGxlcnMuXG4gKi9cblxuZm9yIChsZXQgaSA9IDA7IGkgPCBFVkVOVF9IQU5ETEVSUy5sZW5ndGg7IGkrKykge1xuICBjb25zdCBwcm9wZXJ0eSA9IEVWRU5UX0hBTkRMRVJTW2ldXG4gIEVkaXRvci5wcm9wVHlwZXNbcHJvcGVydHldID0gVHlwZXMuZnVuY1xufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7Q29tcG9uZW50fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRvclxuIl19