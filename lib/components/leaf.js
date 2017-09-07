'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _offsetKey = require('../utils/offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _findDeepestNode = require('../utils/find-deepest-node');

var _findDeepestNode2 = _interopRequireDefault(_findDeepestNode);

var _environment = require('../constants/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debugger.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:leaf');

/**
 * Leaf.
 *
 * @type {Component}
 */

var Leaf = function (_React$Component) {
  _inherits(Leaf, _React$Component);

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  function Leaf(props) {
    _classCallCheck(this, Leaf);

    var _this = _possibleConstructorReturn(this, (Leaf.__proto__ || Object.getPrototypeOf(Leaf)).call(this, props));

    _this.debug = function (message) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      debug.apply(undefined, [message, _this.props.node.key + '-' + _this.props.index].concat(args));
    };

    _this.tmp = {};
    _this.tmp.renders = 0;
    return _this;
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  _createClass(Leaf, [{
    key: 'shouldComponentUpdate',


    /**
     * Should component update?
     *
     * @param {Object} props
     * @return {Boolean}
     */

    value: function shouldComponentUpdate(props) {
      // If any of the regular properties have changed, re-render.
      if (props.index != this.props.index || props.marks != this.props.marks || props.schema != this.props.schema || props.text != this.props.text) {
        return true;
      }

      // If the DOM text does not equal the `text` property, re-render, this can
      // happen because React gets out of sync when previously natively rendered.
      var el = (0, _findDeepestNode2.default)(_reactDom2.default.findDOMNode(this));
      var text = this.renderText(props);
      if (el.textContent != text) return true;

      // Otherwise, don't update.
      return false;
    }

    /**
     * Render the leaf.
     *
     * @return {Element}
     */

  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var node = props.node,
          index = props.index;

      var offsetKey = _offsetKey2.default.stringify({
        key: node.key,
        index: index
      });

      // Increment the renders key, which forces a re-render whenever this
      // component is told it should update. This is required because "native"
      // renders where we don't update the leaves cause React's internal state to
      // get out of sync, causing it to not realize the DOM needs updating.
      this.tmp.renders++;

      this.debug('render', { props: props });

      return _react2.default.createElement(
        'span',
        { key: this.tmp.renders, 'data-offset-key': offsetKey },
        this.renderMarks(props)
      );
    }

    /**
     * Render the text content of the leaf, accounting for browsers.
     *
     * @param {Object} props
     * @return {Element}
     */

  }, {
    key: 'renderText',
    value: function renderText(props) {
      var block = props.block,
          node = props.node,
          parent = props.parent,
          text = props.text,
          index = props.index,
          ranges = props.ranges;

      // COMPAT: If the text is empty and it's the only child, we need to render a
      // <br/> to get the block to have the proper height.

      if (text == '' && parent.kind == 'block' && parent.text == '') return _react2.default.createElement('br', null);

      // COMPAT: If the text is empty otherwise, it's because it's on the edge of
      // an inline void node, so we render a zero-width space so that the
      // selection can be inserted next to it still.
      if (text == '') {
        // COMPAT: In Chrome, zero-width space produces graphics glitches, so use
        // hair space in place of it. (2017/02/12)
        var space = _environment.IS_FIREFOX ? '\u200B' : '\u200A';
        return _react2.default.createElement(
          'span',
          { 'data-slate-zero-width': true },
          space
        );
      }

      // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
      // so we need to add an extra trailing new lines to prevent that.
      var lastText = block.getLastText();
      var lastChar = text.charAt(text.length - 1);
      var isLastText = node == lastText;
      var isLastRange = index == ranges.size - 1;
      if (isLastText && isLastRange && lastChar == '\n') return text + '\n';

      // Otherwise, just return the text.
      return text;
    }

    /**
     * Render all of the leaf's mark components.
     *
     * @param {Object} props
     * @return {Element}
     */

  }, {
    key: 'renderMarks',
    value: function renderMarks(props) {
      var marks = props.marks,
          schema = props.schema,
          node = props.node,
          offset = props.offset,
          text = props.text,
          state = props.state,
          editor = props.editor;

      var children = this.renderText(props);

      return marks.reduce(function (memo, mark) {
        var Component = mark.getComponent(schema);
        if (!Component) return memo;
        return _react2.default.createElement(
          Component,
          {
            editor: editor,
            mark: mark,
            marks: marks,
            node: node,
            offset: offset,
            schema: schema,
            state: state,
            text: text
          },
          memo
        );
      }, children);
    }
  }]);

  return Leaf;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Leaf.propTypes = {
  block: _propTypes4.default.block.isRequired,
  editor: _propTypes2.default.object.isRequired,
  index: _propTypes2.default.number.isRequired,
  marks: _propTypes4.default.marks.isRequired,
  node: _propTypes4.default.node.isRequired,
  offset: _propTypes2.default.number.isRequired,
  parent: _propTypes4.default.node.isRequired,
  ranges: _propTypes4.default.ranges.isRequired,
  schema: _propTypes4.default.schema.isRequired,
  state: _propTypes4.default.state.isRequired,
  text: _propTypes2.default.string.isRequired };
exports.default = Leaf;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2xlYWYuanMiXSwibmFtZXMiOlsiZGVidWciLCJMZWFmIiwicHJvcHMiLCJtZXNzYWdlIiwiYXJncyIsIm5vZGUiLCJrZXkiLCJpbmRleCIsInRtcCIsInJlbmRlcnMiLCJtYXJrcyIsInNjaGVtYSIsInRleHQiLCJlbCIsImZpbmRET01Ob2RlIiwicmVuZGVyVGV4dCIsInRleHRDb250ZW50Iiwib2Zmc2V0S2V5Iiwic3RyaW5naWZ5IiwicmVuZGVyTWFya3MiLCJibG9jayIsInBhcmVudCIsInJhbmdlcyIsImtpbmQiLCJzcGFjZSIsImxhc3RUZXh0IiwiZ2V0TGFzdFRleHQiLCJsYXN0Q2hhciIsImNoYXJBdCIsImxlbmd0aCIsImlzTGFzdFRleHQiLCJpc0xhc3RSYW5nZSIsInNpemUiLCJvZmZzZXQiLCJzdGF0ZSIsImVkaXRvciIsImNoaWxkcmVuIiwicmVkdWNlIiwibWVtbyIsIm1hcmsiLCJDb21wb25lbnQiLCJnZXRDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwibnVtYmVyIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsUUFBUSxxQkFBTSxZQUFOLENBQWQ7O0FBRUE7Ozs7OztJQU1NQyxJOzs7QUFzQko7Ozs7OztBQU1BLGdCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNEdBQ1hBLEtBRFc7O0FBQUEsVUFhbkJGLEtBYm1CLEdBYVgsVUFBQ0csT0FBRCxFQUFzQjtBQUFBLHdDQUFUQyxJQUFTO0FBQVRBLFlBQVM7QUFBQTs7QUFDNUJKLDhCQUFNRyxPQUFOLEVBQWtCLE1BQUtELEtBQUwsQ0FBV0csSUFBWCxDQUFnQkMsR0FBbEMsU0FBeUMsTUFBS0osS0FBTCxDQUFXSyxLQUFwRCxTQUFnRUgs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LE1BQU4sQ0FBYUYsVUFISDtBQUlqQmpDLFNBQU8sb0JBQVdBLEtBQVgsQ0FBaUJpQyxVQUpQO0FBS2pCdEMsUUFBTSxvQkFBV0EsSUFBWCxDQUFnQnNDLFVBTEw7QUFNakJWLFVBQVEsb0JBQU1ZLE1BQU4sQ0FBYUYsVUFOSjtBQU9qQnRCLFVBQVEsb0JBQVdoQixJQUFYLENBQWdCc0MsVUFQUDtBQVFqQnJCLFVBQVEsb0JBQVdBLE1BQVgsQ0FBa0JxQixVQVJUO0FBU2pCaEMsVUFBUSxvQkFBV0EsTUFBWCxDQUFrQmdDLFVBVFQ7QUFVakJULFNBQU8sb0JBQVdBLEtBQVgsQ0FBaUJTLFVBVlA7QUFXakIvQixRQUFNLG9CQUFNa0MsTUFBTixDQUFhSCxVQVhGLEU7a0JBeUtOMUMsSSIsImZpbGUiOiJsZWFmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5cbmltcG9ydCBPZmZzZXRLZXkgZnJvbSAnLi4vdXRpbHMvb2Zmc2V0LWtleSdcbmltcG9ydCBTbGF0ZVR5cGVzIGZyb20gJy4uL3V0aWxzL3Byb3AtdHlwZXMnXG5pbXBvcnQgZmluZERlZXBlc3ROb2RlIGZyb20gJy4uL3V0aWxzL2ZpbmQtZGVlcGVzdC1ub2RlJ1xuaW1wb3J0IHsgSVNfRklSRUZPWCB9IGZyb20gJy4uL2NvbnN0YW50cy9lbnZpcm9ubWVudCdcblxuLyoqXG4gKiBEZWJ1Z2dlci5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuY29uc3QgZGVidWcgPSBEZWJ1Zygnc2xhdGU6bGVhZicpXG5cbi8qKlxuICogTGVhZi5cbiAqXG4gKiBAdHlwZSB7Q29tcG9uZW50fVxuICovXG5cbmNsYXNzIExlYWYgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIC8qKlxuICAgKiBQcm9wZXJ0eSB0eXBlcy5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBibG9jazogU2xhdGVUeXBlcy5ibG9jay5pc1JlcXVpcmVkLFxuICAgIGVkaXRvcjogVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaW5kZXg6IFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG1hcmtzOiBTbGF0ZVR5cGVzLm1hcmtzLmlzUmVxdWlyZWQsXG4gICAgbm9kZTogU2xhdGVUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgb2Zmc2V0OiBUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBwYXJlbnQ6IFNsYXRlVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuICAgIHJhbmdlczogU2xhdGVUeXBlcy5yYW5nZXMuaXNSZXF1aXJlZCxcbiAgICBzY2hlbWE6IFNsYXRlVHlwZXMuc2NoZW1hLmlzUmVxdWlyZWQsXG4gICAgc3RhdGU6IFNsYXRlVHlwZXMuc3RhdGUuaXNSZXF1aXJlZCxcbiAgICB0ZXh0OiBUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAqL1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy50bXAgPSB7fVxuICAgIHRoaXMudG1wLnJlbmRlcnMgPSAwXG4gIH1cblxuICAvKipcbiAgICogRGVidWcuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7TWl4ZWR9IC4uLmFyZ3NcbiAgICovXG5cbiAgZGVidWcgPSAobWVzc2FnZSwgLi4uYXJncykgPT4ge1xuICAgIGRlYnVnKG1lc3NhZ2UsIGAke3RoaXMucHJvcHMubm9kZS5rZXl9LSR7dGhpcy5wcm9wcy5pbmRleH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBjb21wb25lbnQgdXBkYXRlP1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSB7XG4gICAgLy8gSWYgYW55IG9mIHRoZSByZWd1bGFyIHByb3BlcnRpZXMgaGF2ZSBjaGFuZ2VkLCByZS1yZW5kZXIuXG4gICAgaWYgKFxuICAgICAgcHJvcHMuaW5kZXggIT0gdGhpcy5wcm9wcy5pbmRleCB8fFxuICAgICAgcHJvcHMubWFya3MgIT0gdGhpcy5wcm9wcy5tYXJrcyB8fFxuICAgICAgcHJvcHMuc2NoZW1hICE9IHRoaXMucHJvcHMuc2NoZW1hIHx8XG4gICAgICBwcm9wcy50ZXh0ICE9IHRoaXMucHJvcHMudGV4dFxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgRE9NIHRleHQgZG9lcyBub3QgZXF1YWwgdGhlIGB0ZXh0YCBwcm9wZXJ0eSwgcmUtcmVuZGVyLCB0aGlzIGNhblxuICAgIC8vIGhhcHBlbiBiZWNhdXNlIFJlYWN0IGdldHMgb3V0IG9mIHN5bmMgd2hlbiBwcmV2aW91c2x5IG5hdGl2ZWx5IHJlbmRlcmVkLlxuICAgIGNvbnN0IGVsID0gZmluZERlZXBlc3ROb2RlKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKVxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnJlbmRlclRleHQocHJvcHMpXG4gICAgaWYgKGVsLnRleHRDb250ZW50ICE9IHRleHQpIHJldHVybiB0cnVlXG5cbiAgICAvLyBPdGhlcndpc2UsIGRvbid0IHVwZGF0ZS5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGxlYWYuXG4gICAqXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzIH0gPSB0aGlzXG4gICAgY29uc3QgeyBub2RlLCBpbmRleCB9ID0gcHJvcHNcbiAgICBjb25zdCBvZmZzZXRLZXkgPSBPZmZzZXRLZXkuc3RyaW5naWZ5KHtcbiAgICAgIGtleTogbm9kZS5rZXksXG4gICAgICBpbmRleFxuICAgIH0pXG5cbiAgICAvLyBJbmNyZW1lbnQgdGhlIHJlbmRlcnMga2V5LCB3aGljaCBmb3JjZXMgYSByZS1yZW5kZXIgd2hlbmV2ZXIgdGhpc1xuICAgIC8vIGNvbXBvbmVudCBpcyB0b2xkIGl0IHNob3VsZCB1cGRhdGUuIFRoaXMgaXMgcmVxdWlyZWQgYmVjYXVzZSBcIm5hdGl2ZVwiXG4gICAgLy8gcmVuZGVycyB3aGVyZSB3ZSBkb24ndCB1cGRhdGUgdGhlIGxlYXZlcyBjYXVzZSBSZWFjdCdzIGludGVybmFsIHN0YXRlIHRvXG4gICAgLy8gZ2V0IG91dCBvZiBzeW5jLCBjYXVzaW5nIGl0IHRvIG5vdCByZWFsaXplIHRoZSBET00gbmVlZHMgdXBkYXRpbmcuXG4gICAgdGhpcy50bXAucmVuZGVycysrXG5cbiAgICB0aGlzLmRlYnVnKCdyZW5kZXInLCB7IHByb3BzIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4ga2V5PXt0aGlzLnRtcC5yZW5kZXJzfSBkYXRhLW9mZnNldC1rZXk9e29mZnNldEtleX0+XG4gICAgICAgIHt0aGlzLnJlbmRlck1hcmtzKHByb3BzKX1cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIGxlYWYsIGFjY291bnRpbmcgZm9yIGJyb3dzZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICovXG5cbiAgcmVuZGVyVGV4dChwcm9wcykge1xuICAgIGNvbnN0IHsgYmxvY2ssIG5vZGUsIHBhcmVudCwgdGV4dCwgaW5kZXgsIHJhbmdlcyB9ID0gcHJvcHNcblxuICAgIC8vIENPTVBBVDogSWYgdGhlIHRleHQgaXMgZW1wdHkgYW5kIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHdlIG5lZWQgdG8gcmVuZGVyIGFcbiAgICAvLyA8YnIvPiB0byBnZXQgdGhlIGJsb2NrIHRvIGhhdmUgdGhlIHByb3BlciBoZWlnaHQuXG4gICAgaWYgKHRleHQgPT0gJycgJiYgcGFyZW50LmtpbmQgPT0gJ2Jsb2NrJyAmJiBwYXJlbnQudGV4dCA9PSAnJykgcmV0dXJuIDxiciAvPlxuXG4gICAgLy8gQ09NUEFUOiBJZiB0aGUgdGV4dCBpcyBlbXB0eSBvdGhlcndpc2UsIGl0J3MgYmVjYXVzZSBpdCdzIG9uIHRoZSBlZGdlIG9mXG4gICAgLy8gYW4gaW5saW5lIHZvaWQgbm9kZSwgc28gd2UgcmVuZGVyIGEgemVyby13aWR0aCBzcGFjZSBzbyB0aGF0IHRoZVxuICAgIC8vIHNlbGVjdGlvbiBjYW4gYmUgaW5zZXJ0ZWQgbmV4dCB0byBpdCBzdGlsbC5cbiAgICBpZiAodGV4dCA9PSAnJykge1xuICAgICAgLy8gQ09NUEFUOiBJbiBDaHJvbWUsIHplcm8td2lkdGggc3BhY2UgcHJvZHVjZXMgZ3JhcGhpY3MgZ2xpdGNoZXMsIHNvIHVzZVxuICAgICAgLy8gaGFpciBzcGFjZSBpbiBwbGFjZSBvZiBpdC4gKDIwMTcvMDIvMTIpXG4gICAgICBjb25zdCBzcGFjZSA9IElTX0ZJUkVGT1ggPyAnXFx1MjAwQicgOiAnXFx1MjAwQSdcbiAgICAgIHJldHVybiA8c3BhbiBkYXRhLXNsYXRlLXplcm8td2lkdGg+e3NwYWNlfTwvc3Bhbj5cbiAgICB9XG5cbiAgICAvLyBDT01QQVQ6IEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgdHJhaWxpbmcgbmV3IGxpbmVzIGF0IHRoZSBlbmQgb2YgYmxvY2tzLFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gYWRkIGFuIGV4dHJhIHRyYWlsaW5nIG5ldyBsaW5lcyB0byBwcmV2ZW50IHRoYXQuXG4gICAgY29uc3QgbGFzdFRleHQgPSBibG9jay5nZXRMYXN0VGV4dCgpXG4gICAgY29uc3QgbGFzdENoYXIgPSB0ZXh0LmNoYXJBdCh0ZXh0Lmxlbmd0aCAtIDEpXG4gICAgY29uc3QgaXNMYXN0VGV4dCA9IG5vZGUgPT0gbGFzdFRleHRcbiAgICBjb25zdCBpc0xhc3RSYW5nZSA9IGluZGV4ID09IHJhbmdlcy5zaXplIC0gMVxuICAgIGlmIChpc0xhc3RUZXh0ICYmIGlzTGFzdFJhbmdlICYmIGxhc3RDaGFyID09ICdcXG4nKSByZXR1cm4gYCR7dGV4dH1cXG5gXG5cbiAgICAvLyBPdGhlcndpc2UsIGp1c3QgcmV0dXJuIHRoZSB0ZXh0LlxuICAgIHJldHVybiB0ZXh0XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGFsbCBvZiB0aGUgbGVhZidzIG1hcmsgY29tcG9uZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlck1hcmtzKHByb3BzKSB7XG4gICAgY29uc3QgeyBtYXJrcywgc2NoZW1hLCBub2RlLCBvZmZzZXQsIHRleHQsIHN0YXRlLCBlZGl0b3IgfSA9IHByb3BzXG4gICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLnJlbmRlclRleHQocHJvcHMpXG5cbiAgICByZXR1cm4gbWFya3MucmVkdWNlKChtZW1vLCBtYXJrKSA9PiB7XG4gICAgICBjb25zdCBDb21wb25lbnQgPSBtYXJrLmdldENvbXBvbmVudChzY2hlbWEpXG4gICAgICBpZiAoIUNvbXBvbmVudCkgcmV0dXJuIG1lbW9cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnRcbiAgICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgICBtYXJrPXttYXJrfVxuICAgICAgICAgIG1hcmtzPXttYXJrc31cbiAgICAgICAgICBub2RlPXtub2RlfVxuICAgICAgICAgIG9mZnNldD17b2Zmc2V0fVxuICAgICAgICAgIHNjaGVtYT17c2NoZW1hfVxuICAgICAgICAgIHN0YXRlPXtzdGF0ZX1cbiAgICAgICAgICB0ZXh0PXt0ZXh0fVxuICAgICAgICA+XG4gICAgICAgICAge21lbW99XG4gICAgICAgIDwvQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH0sIGNoaWxkcmVuKVxuICB9XG5cbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0NvbXBvbmVudH1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBMZWFmXG4iXX0=