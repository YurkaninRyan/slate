'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _leaf = require('./leaf');

var _leaf2 = _interopRequireDefault(_leaf);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _offsetKey = require('../utils/offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _environment = require('../constants/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:void');

/**
 * Void.
 *
 * @type {Component}
 */

var Void = function (_React$Component) {
  _inherits(Void, _React$Component);

  function Void() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Void);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Void.__proto__ || Object.getPrototypeOf(Void)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Property types.
   *
   * @type {Object}
   */

  /**
   * State
   *
   * @type {Object}
   */

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  /**
   * When one of the wrapper elements it clicked, select the void node.
   *
   * @param {Event} event
   */

  /**
   * Increment counter, and temporarily switch node to editable to allow drop events
   * Counter required as onDragLeave fires when hovering over child elements
   *
   * @param {Event} event
   */

  /**
   * Decrement counter, and if counter 0, then no longer dragging over node
   * and thus switch back to non-editable
   *
   * @param {Event} event
   */

  /**
   * If dropped item onto node, then reset state
   *
   * @param {Event} event
   */

  _createClass(Void, [{
    key: 'render',


    /**
     * Render.
     *
     * @return {Element}
     */

    value: function render() {
      var props = this.props;
      var children = props.children,
          node = props.node;

      var Tag = void 0,
          style = void 0;

      // Make the outer wrapper relative, so the spacer can overlay it.
      if (node.kind === 'block') {
        Tag = 'div';
        style = { position: 'relative' };
      } else {
        Tag = 'span';
      }

      this.debug('render', { props: props });

      return _react2.default.createElement(
        Tag,
        {
          'data-slate-void': true,
          style: style,
          onClick: this.onClick,
          onDragEnter: this.onDragEnter,
          onDragLeave: this.onDragLeave,
          onDrop: this.onDrop
        },
        this.renderSpacer(),
        _react2.default.createElement(
          Tag,
          { contentEditable: this.state.editable },
          children
        )
      );
    }

    /**
     * Render a fake spacer leaf, which will catch the cursor when it the void
     * node is navigated to with the arrow keys. Having this spacer there means
     * the browser continues to manage the selection natively, so it keeps track
     * of the right offset when moving across the block.
     *
     * @return {Element}
     */

    /**
     * Render a fake leaf.
     *
     * @return {Element}
     */

  }]);

  return Void;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Void.propTypes = {
  block: _propTypes4.default.block,
  children: _propTypes2.default.any.isRequired,
  editor: _propTypes2.default.object.isRequired,
  node: _propTypes4.default.node.isRequired,
  parent: _propTypes4.default.node.isRequired,
  readOnly: _propTypes2.default.bool.isRequired,
  schema: _propTypes4.default.schema.isRequired,
  state: _propTypes4.default.state.isRequired };

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.state = {
    dragCounter: 0,
    editable: false };

  this.debug = function (message) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var node = _this2.props.node;
    var key = node.key,
        type = node.type;

    var id = key + ' (' + type + ')';
    debug.apply(undefined, [message, '' + id].concat(args));
  };

  this.onClick = function (event) {
    if (_this2.props.readOnly) return;

    _this2.debug('onClick', { event: event });

    var _props = _this2.props,
        node = _props.node,
        editor = _props.editor;


    editor.change(function (change) {
      change
      // COMPAT: In Chrome & Safari, selections that are at the zero offset of
      // an inline node will be automatically replaced to be at the last
      // offset of a previous inline node, which screws us up, so we always
      // want to set it to the end of the node. (2016/11/29)
      .collapseToEndOf(node).focus();
    });
  };

  this.onDragEnter = function () {
    _this2.setState(function (prevState) {
      var dragCounter = prevState.dragCounter + 1;
      return { dragCounter: dragCounter, editable: undefined };
    });
  };

  this.onDragLeave = function () {
    _this2.setState(function (prevState) {
      var dragCounter = prevState.dragCounter - 1;
      var editable = dragCounter === 0 ? false : undefined;
      return { dragCounter: dragCounter, editable: editable };
    });
  };

  this.onDrop = function () {
    _this2.setState({ dragCounter: 0, editable: false });
  };

  this.renderSpacer = function () {
    var node = _this2.props.node;

    var style = void 0;

    if (node.kind == 'block') {
      style = _environment.IS_FIREFOX ? {
        pointerEvents: 'none',
        width: '0px',
        height: '0px',
        lineHeight: '0px',
        visibility: 'hidden'
      } : {
        position: 'absolute',
        top: '0px',
        left: '-9999px',
        textIndent: '-9999px'
      };
    } else {
      style = {
        color: 'transparent'
      };
    }

    return _react2.default.createElement(
      'span',
      { style: style },
      _this2.renderLeaf()
    );
  };

  this.renderLeaf = function () {
    var _props2 = _this2.props,
        block = _props2.block,
        node = _props2.node,
        schema = _props2.schema,
        state = _props2.state,
        editor = _props2.editor;

    var child = node.getFirstText();
    var ranges = child.getRanges();
    var text = '';
    var offset = 0;
    var marks = _mark2.default.createSet();
    var index = 0;
    var offsetKey = _offsetKey2.default.stringify({
      key: child.key,
      index: index
    });

    return _react2.default.createElement(_leaf2.default, {
      key: offsetKey,
      block: node.kind == 'block' ? node : block,
      editor: editor,
      index: index,
      marks: marks,
      node: child,
      offset: offset,
      parent: node,
      ranges: ranges,
      schema: schema,
      state: state,
      text: text
    });
  };
};

exports.default = Void;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3ZvaWQuanMiXSwibmFtZXMiOlsiZGVidWciLCJWb2lkIiwicHJvcHMiLCJjaGlsZHJlbiIsIm5vZGUiLCJUYWciLCJzdHlsZSIsImtpbmQiLCJwb3NpdGlvbiIsIm9uQ2xpY2siLCJvbkRyYWdFbnRlciIsIm9uRHJhZ0xlYXZlIiwib25Ecm9wIiwicmVuZGVyU3BhY2VyIiwic3RhdGUiLCJlZGl0YWJsZSIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImJsb2NrIiwiYW55IiwiaXNSZXF1aXJlZCIsImVkaXRvciIsIm9iamVjdCIsInBhcmVudCIsInJlYWRPbmx5IiwiYm9vbCIsInNjaGVtYSIsImRyYWdDb3VudGVyIiwibWVzc2FnZSIsImFyZ3MiLCJrZXkiLCJ0eXBlIiwiaWQiLCJldmVudCIsImNoYW5nZSIsImNvbGxhcHNlVG9FbmRPZiIsImZvY3VzIiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJ1bmRlZmluZWQiLCJwb2ludGVyRXZlbnRzIiwid2lkdGgiLCJoZWlnaHQiLCJsaW5lSGVpZ2h0IiwidmlzaWJpbGl0eSIsInRvcCIsImxlZnQiLCJ0ZXh0SW5kZW50IiwiY29sb3IiLCJyZW5kZXJMZWFmIiwiY2hpbGQiLCJnZXRGaXJzdFRleHQiLCJyYW5nZXMiLCJnZXRSYW5nZXMiLCJ0ZXh0Iiwib2Zmc2V0IiwibWFya3MiLCJjcmVhdGVTZXQiLCJpbmRleCIsIm9mZnNldEtleSIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BLElBQU1BLFFBQVEscUJBQU0sWUFBTixDQUFkOztBQUVBOzs7Ozs7SUFNTUMsSTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSjs7Ozs7O0FBaUJBOzs7Ozs7QUFXQTs7Ozs7OztBQWNBOzs7Ozs7QUF3QkE7Ozs7Ozs7QUFjQTs7Ozs7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O0FBQUEsUUFDbUJPLE1BRG5CLFdBQ21CQSxNQURuQjs7QUFFakIsUUFBTTZCLFFBQVE5QyxLQUFLK0MsWUFBTCxFQUFkO0FBQ0EsUUFBTUMsU0FBU0YsTUFBTUcsU0FBTixFQUFmO0FBQ0EsUUFBTUMsT0FBTyxFQUFiO0FBQ0EsUUFBTUMsU0FBUyxDQUFmO0FBQ0EsUUFBTUMsUUFBUSxlQUFLQyxTQUFMLEVBQWQ7QUFDQSxRQUFNQyxRQUFRLENBQWQ7QUFDQSxRQUFNQyxZQUFZLG9CQUFVQyxTQUFWLENBQW9CO0FBQ3BDOUIsV0FBS29CLE1BQU1wQixHQUR5QjtBQUVwQzRCO0FBRm9DLEtBQXBCLENBQWxCOztBQUtBLFdBQ0U7QUFDRSxXQUFLQyxTQURQO0FBRUUsYUFBT3ZELEtBQUtHLElBQUwsSUFBYSxPQUFiLEdBQXVCSCxJQUF2QixHQUE4QmMsS0FGdkM7QUFHRSxjQUFRRyxNQUhWO0FBSUUsYUFBT3FDLEtBSlQ7QUFLRSxhQUFPRixLQUxUO0FBTUUsWUFBTU4sS0FOUjtBQU9FLGNBQVFLLE1BUFY7QUFRRSxjQUFRbkQsSUFSVjtBQVNFLGNBQVFnRCxNQVRWO0FBVUUsY0FBUTFCLE1BVlY7QUFXRSxhQUFPWixLQVhUO0FBWUUsWUFBTXdDO0FBWlIsTUFERjtBQWdCRCxHOzs7a0JBVVlyRCxJIiwiZmlsZSI6InZvaWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuXG5pbXBvcnQgTGVhZiBmcm9tICcuL2xlYWYnXG5pbXBvcnQgTWFyayBmcm9tICcuLi9tb2RlbHMvbWFyaydcbmltcG9ydCBPZmZzZXRLZXkgZnJvbSAnLi4vdXRpbHMvb2Zmc2V0LWtleSdcbmltcG9ydCBTbGF0ZVR5cGVzIGZyb20gJy4uL3V0aWxzL3Byb3AtdHlwZXMnXG5pbXBvcnQgeyBJU19GSVJFRk9YIH0gZnJvbSAnLi4vY29uc3RhbnRzL2Vudmlyb25tZW50J1xuXG4vKipcbiAqIERlYnVnLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdzbGF0ZTp2b2lkJylcblxuLyoqXG4gKiBWb2lkLlxuICpcbiAqIEB0eXBlIHtDb21wb25lbnR9XG4gKi9cblxuY2xhc3MgVm9pZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgLyoqXG4gICAqIFByb3BlcnR5IHR5cGVzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJsb2NrOiBTbGF0ZVR5cGVzLmJsb2NrLFxuICAgIGNoaWxkcmVuOiBUeXBlcy5hbnkuaXNSZXF1aXJlZCxcbiAgICBlZGl0b3I6IFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vZGU6IFNsYXRlVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuICAgIHBhcmVudDogU2xhdGVUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgcmVhZE9ubHk6IFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzY2hlbWE6IFNsYXRlVHlwZXMuc2NoZW1hLmlzUmVxdWlyZWQsXG4gICAgc3RhdGU6IFNsYXRlVHlwZXMuc3RhdGUuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGF0ZVxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0ZSA9IHtcbiAgICBkcmFnQ291bnRlcjogMCxcbiAgICBlZGl0YWJsZTogZmFsc2UsXG4gIH1cblxuICAvKipcbiAgICogRGVidWcuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7TWl4ZWR9IC4uLmFyZ3NcbiAgICovXG5cbiAgZGVidWcgPSAobWVzc2FnZSwgLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IHsgbm9kZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsga2V5LCB0eXBlIH0gPSBub2RlXG4gICAgY29uc3QgaWQgPSBgJHtrZXl9ICgke3R5cGV9KWBcbiAgICBkZWJ1ZyhtZXNzYWdlLCBgJHtpZH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gb25lIG9mIHRoZSB3cmFwcGVyIGVsZW1lbnRzIGl0IGNsaWNrZWQsIHNlbGVjdCB0aGUgdm9pZCBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVhZE9ubHkpIHJldHVyblxuXG4gICAgdGhpcy5kZWJ1Zygnb25DbGljaycsIHsgZXZlbnQgfSlcblxuICAgIGNvbnN0IHsgbm9kZSwgZWRpdG9yIH0gPSB0aGlzLnByb3BzXG5cbiAgICBlZGl0b3IuY2hhbmdlKChjaGFuZ2UpID0+IHtcbiAgICAgIGNoYW5nZVxuICAgICAgICAvLyBDT01QQVQ6IEluIENocm9tZSAmIFNhZmFyaSwgc2VsZWN0aW9ucyB0aGF0IGFyZSBhdCB0aGUgemVybyBvZmZzZXQgb2ZcbiAgICAgICAgLy8gYW4gaW5saW5lIG5vZGUgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHJlcGxhY2VkIHRvIGJlIGF0IHRoZSBsYXN0XG4gICAgICAgIC8vIG9mZnNldCBvZiBhIHByZXZpb3VzIGlubGluZSBub2RlLCB3aGljaCBzY3Jld3MgdXMgdXAsIHNvIHdlIGFsd2F5c1xuICAgICAgICAvLyB3YW50IHRvIHNldCBpdCB0byB0aGUgZW5kIG9mIHRoZSBub2RlLiAoMjAxNi8xMS8yOSlcbiAgICAgICAgLmNvbGxhcHNlVG9FbmRPZihub2RlKVxuICAgICAgICAuZm9jdXMoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSW5jcmVtZW50IGNvdW50ZXIsIGFuZCB0ZW1wb3JhcmlseSBzd2l0Y2ggbm9kZSB0byBlZGl0YWJsZSB0byBhbGxvdyBkcm9wIGV2ZW50c1xuICAgKiBDb3VudGVyIHJlcXVpcmVkIGFzIG9uRHJhZ0xlYXZlIGZpcmVzIHdoZW4gaG92ZXJpbmcgb3ZlciBjaGlsZCBlbGVtZW50c1xuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkRyYWdFbnRlciA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKChwcmV2U3RhdGUpID0+IHtcbiAgICAgIGNvbnN0IGRyYWdDb3VudGVyID0gcHJldlN0YXRlLmRyYWdDb3VudGVyICsgMVxuICAgICAgcmV0dXJuIHsgZHJhZ0NvdW50ZXIsIGVkaXRhYmxlOiB1bmRlZmluZWQgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogRGVjcmVtZW50IGNvdW50ZXIsIGFuZCBpZiBjb3VudGVyIDAsIHRoZW4gbm8gbG9uZ2VyIGRyYWdnaW5nIG92ZXIgbm9kZVxuICAgKiBhbmQgdGh1cyBzd2l0Y2ggYmFjayB0byBub24tZWRpdGFibGVcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25EcmFnTGVhdmUgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSgocHJldlN0YXRlKSA9PiB7XG4gICAgICBjb25zdCBkcmFnQ291bnRlciA9IHByZXZTdGF0ZS5kcmFnQ291bnRlciAtIDFcbiAgICAgIGNvbnN0IGVkaXRhYmxlID0gZHJhZ0NvdW50ZXIgPT09IDAgPyBmYWxzZSA6IHVuZGVmaW5lZFxuICAgICAgcmV0dXJuIHsgZHJhZ0NvdW50ZXIsIGVkaXRhYmxlIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIElmIGRyb3BwZWQgaXRlbSBvbnRvIG5vZGUsIHRoZW4gcmVzZXQgc3RhdGVcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25Ecm9wID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBkcmFnQ291bnRlcjogMCwgZWRpdGFibGU6IGZhbHNlIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyLlxuICAgKlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBwcm9wcyB9ID0gdGhpc1xuICAgIGNvbnN0IHsgY2hpbGRyZW4sIG5vZGUgfSA9IHByb3BzXG4gICAgbGV0IFRhZywgc3R5bGVcblxuICAgIC8vIE1ha2UgdGhlIG91dGVyIHdyYXBwZXIgcmVsYXRpdmUsIHNvIHRoZSBzcGFjZXIgY2FuIG92ZXJsYXkgaXQuXG4gICAgaWYgKG5vZGUua2luZCA9PT0gJ2Jsb2NrJykge1xuICAgICAgVGFnID0gJ2RpdidcbiAgICAgIHN0eWxlID0geyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFRhZyA9ICdzcGFuJ1xuICAgIH1cblxuICAgIHRoaXMuZGVidWcoJ3JlbmRlcicsIHsgcHJvcHMgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8VGFnXG4gICAgICAgIGRhdGEtc2xhdGUtdm9pZFxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGlja31cbiAgICAgICAgb25EcmFnRW50ZXI9e3RoaXMub25EcmFnRW50ZXJ9XG4gICAgICAgIG9uRHJhZ0xlYXZlPXt0aGlzLm9uRHJhZ0xlYXZlfVxuICAgICAgICBvbkRyb3A9e3RoaXMub25Ecm9wfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5yZW5kZXJTcGFjZXIoKX1cbiAgICAgICAgPFRhZyBjb250ZW50RWRpdGFibGU9e3RoaXMuc3RhdGUuZWRpdGFibGV9PlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9UYWc+XG4gICAgICA8L1RhZz5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGEgZmFrZSBzcGFjZXIgbGVhZiwgd2hpY2ggd2lsbCBjYXRjaCB0aGUgY3Vyc29yIHdoZW4gaXQgdGhlIHZvaWRcbiAgICogbm9kZSBpcyBuYXZpZ2F0ZWQgdG8gd2l0aCB0aGUgYXJyb3cga2V5cy4gSGF2aW5nIHRoaXMgc3BhY2VyIHRoZXJlIG1lYW5zXG4gICAqIHRoZSBicm93c2VyIGNvbnRpbnVlcyB0byBtYW5hZ2UgdGhlIHNlbGVjdGlvbiBuYXRpdmVseSwgc28gaXQga2VlcHMgdHJhY2tcbiAgICogb2YgdGhlIHJpZ2h0IG9mZnNldCB3aGVuIG1vdmluZyBhY3Jvc3MgdGhlIGJsb2NrLlxuICAgKlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cblxuICByZW5kZXJTcGFjZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBub2RlIH0gPSB0aGlzLnByb3BzXG4gICAgbGV0IHN0eWxlXG5cbiAgICBpZiAobm9kZS5raW5kID09ICdibG9jaycpIHtcbiAgICAgIHN0eWxlID0gSVNfRklSRUZPWFxuICAgICAgICA/IHtcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgd2lkdGg6ICcwcHgnLFxuICAgICAgICAgIGhlaWdodDogJzBweCcsXG4gICAgICAgICAgbGluZUhlaWdodDogJzBweCcsXG4gICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbidcbiAgICAgICAgfVxuICAgICAgICA6IHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgIGxlZnQ6ICctOTk5OXB4JyxcbiAgICAgICAgICB0ZXh0SW5kZW50OiAnLTk5OTlweCdcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZSA9IHtcbiAgICAgICAgY29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gc3R5bGU9e3N0eWxlfT57dGhpcy5yZW5kZXJMZWFmKCl9PC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYSBmYWtlIGxlYWYuXG4gICAqXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlckxlYWYgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBibG9jaywgbm9kZSwgc2NoZW1hLCBzdGF0ZSwgZWRpdG9yIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgY2hpbGQgPSBub2RlLmdldEZpcnN0VGV4dCgpXG4gICAgY29uc3QgcmFuZ2VzID0gY2hpbGQuZ2V0UmFuZ2VzKClcbiAgICBjb25zdCB0ZXh0ID0gJydcbiAgICBjb25zdCBvZmZzZXQgPSAwXG4gICAgY29uc3QgbWFya3MgPSBNYXJrLmNyZWF0ZVNldCgpXG4gICAgY29uc3QgaW5kZXggPSAwXG4gICAgY29uc3Qgb2Zmc2V0S2V5ID0gT2Zmc2V0S2V5LnN0cmluZ2lmeSh7XG4gICAgICBrZXk6IGNoaWxkLmtleSxcbiAgICAgIGluZGV4XG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8TGVhZlxuICAgICAgICBrZXk9e29mZnNldEtleX1cbiAgICAgICAgYmxvY2s9e25vZGUua2luZCA9PSAnYmxvY2snID8gbm9kZSA6IGJsb2NrfVxuICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICBtYXJrcz17bWFya3N9XG4gICAgICAgIG5vZGU9e2NoaWxkfVxuICAgICAgICBvZmZzZXQ9e29mZnNldH1cbiAgICAgICAgcGFyZW50PXtub2RlfVxuICAgICAgICByYW5nZXM9e3Jhbmdlc31cbiAgICAgICAgc2NoZW1hPXtzY2hlbWF9XG4gICAgICAgIHN0YXRlPXtzdGF0ZX1cbiAgICAgICAgdGV4dD17dGV4dH1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0NvbXBvbmVudH1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBWb2lkXG4iXX0=