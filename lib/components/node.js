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

var _transferTypes = require('../constants/transfer-types');

var _transferTypes2 = _interopRequireDefault(_transferTypes);

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _leaf = require('./leaf');

var _leaf2 = _interopRequireDefault(_leaf);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _text = require('../models/text');

var _text2 = _interopRequireDefault(_text);

var _void = require('./void');

var _void2 = _interopRequireDefault(_void);

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _scrollToSelection = require('../utils/scroll-to-selection');

var _scrollToSelection2 = _interopRequireDefault(_scrollToSelection);

var _setTransferData = require('../utils/set-transfer-data');

var _setTransferData2 = _interopRequireDefault(_setTransferData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:node');

/**
 * Node.
 *
 * @type {Component}
 */

var Node = function (_React$Component) {
  _inherits(Node, _React$Component);

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  function Node(props) {
    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this, props));

    _initialiseProps.call(_this);

    var node = props.node,
        schema = props.schema;

    _this.state = {};
    _this.state.Component = node.kind == 'text' ? null : node.getComponent(schema);
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

  /**
   * On receiving new props, update the `Component` renderer.
   *
   * @param {Object} props
   */

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} state
   * @return {Boolean}
   */

  /**
   * On mount, update the scroll position.
   */

  /**
   * After update, update the scroll position if the node's content changed.
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */

  /**
   * There is a corner case, that some nodes are unmounted right after they update
   * Then, when the timer execute, it will throw the error
   * `findDOMNode was called on an unmounted component`
   * We should clear the timer from updateScroll here
   */

  /**
   * Update the scroll position after a change as occured if this is a leaf
   * block and it has the selection's ending edge. This ensures that scrolling
   * matches native `contenteditable` behavior even for cases where the edit is
   * not applied natively, like when enter is pressed.
   */

  /**
   * On drag start, add a serialized representation of the node to the data.
   *
   * @param {Event} e
   */

  _createClass(Node, [{
    key: 'render',


    /**
     * Render.
     *
     * @return {Element}
     */

    value: function render() {
      var props = this.props;
      var node = this.props.node;


      this.debug('render', { props: props });

      return node.kind == 'text' ? this.renderText() : this.renderElement();
    }

    /**
     * Render a `child` node.
     *
     * @param {Node} child
     * @return {Element}
     */

    /**
     * Render an element `node`.
     *
     * @return {Element}
     */

    /**
     * Render a text node.
     *
     * @return {Element}
     */

    /**
     * Render a single leaf node given a `range` and `offset`.
     *
     * @param {List<Range>} ranges
     * @param {Range} range
     * @param {Number} index
     * @param {Number} offset
     * @return {Element} leaf
     */

  }]);

  return Node;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Node.propTypes = {
  block: _propTypes4.default.block,
  editor: _propTypes2.default.object.isRequired,
  node: _propTypes4.default.node.isRequired,
  parent: _propTypes4.default.node.isRequired,
  readOnly: _propTypes2.default.bool.isRequired,
  schema: _propTypes4.default.schema.isRequired,
  state: _propTypes4.default.state.isRequired };

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.debug = function (message) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var node = _this2.props.node;
    var key = node.key,
        kind = node.kind,
        type = node.type;

    var id = kind == 'text' ? key + ' (' + kind + ')' : key + ' (' + type + ')';
    debug.apply(undefined, [message, '' + id].concat(args));
  };

  this.componentWillReceiveProps = function (props) {
    if (props.node.kind == 'text') return;
    if (props.node == _this2.props.node) return;
    var Component = props.node.getComponent(props.schema);
    _this2.setState({ Component: Component });
  };

  this.shouldComponentUpdate = function (nextProps) {
    var props = _this2.props;
    var Component = _this2.state.Component;

    // If the `Component` has enabled suppression of update checking, always
    // return true so that it can deal with update checking itself.

    if (Component && Component.suppressShouldComponentUpdate) return true;

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (nextProps.readOnly != props.readOnly) return true;

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (nextProps.node != props.node) return true;

    // If the Node has children that aren't just Text's then allow them to decide
    // If they should update it or not.
    if (nextProps.node.kind != 'text' && _text2.default.isTextList(nextProps.node.nodes) == false) return true;

    // If the node is a block or inline, which can have custom renderers, we
    // include an extra check to re-render if the node either becomes part of,
    // or leaves, a selection. This is to make it simple for users to show a
    // node's "selected" state.
    if (nextProps.node.kind != 'text') {
      var nodes = props.node.kind + 's';
      var isInSelection = props.state[nodes].includes(props.node);
      var nextIsInSelection = nextProps.state[nodes].includes(nextProps.node);
      var hasFocus = props.state.isFocused;
      var nextHasFocus = nextProps.state.isFocused;
      var selectionChanged = isInSelection != nextIsInSelection;
      var focusChanged = hasFocus != nextHasFocus;
      if (selectionChanged || focusChanged) return true;
    }

    // If the node is a text node, re-render if the current decorations have
    // changed, even if the content of the text node itself hasn't.
    if (nextProps.node.kind == 'text' && nextProps.schema.hasDecorators) {
      var nextDecorators = nextProps.state.document.getDescendantDecorators(nextProps.node.key, nextProps.schema);
      var decorators = props.state.document.getDescendantDecorators(props.node.key, props.schema);
      var nextRanges = nextProps.node.getRanges(nextDecorators);
      var ranges = props.node.getRanges(decorators);
      if (!nextRanges.equals(ranges)) return true;
    }

    // If the node is a text node, and its parent is a block node, and it was
    // the last child of the block, re-render to cleanup extra `<br/>` or `\n`.
    if (nextProps.node.kind == 'text' && nextProps.parent.kind == 'block') {
      var last = props.parent.nodes.last();
      var nextLast = nextProps.parent.nodes.last();
      if (props.node == last && nextProps.node != nextLast) return true;
    }

    // Otherwise, don't update.
    return false;
  };

  this.componentDidMount = function () {
    _this2.updateScroll();
  };

  this.componentDidUpdate = function (prevProps, prevState) {
    if (_this2.props.node != prevProps.node) _this2.updateScroll();
  };

  this.componentWillUnmount = function () {
    clearTimeout(_this2.scrollTimer);
  };

  this.updateScroll = function () {
    var _props = _this2.props,
        node = _props.node,
        state = _props.state;
    var selection = state.selection;

    // If this isn't a block, or it's a wrapping block, abort.

    if (node.kind != 'block') return;
    if (node.nodes.first().kind == 'block') return;

    // If the selection is blurred, or this block doesn't contain it, abort.
    if (selection.isBlurred) return;
    if (!selection.hasEndIn(node)) return;

    // The native selection will be updated after componentDidMount or componentDidUpdate.
    // Use setTimeout to queue scrolling to the last when the native selection has been updated to the correct value.
    _this2.scrollTimer = setTimeout(function () {
      var el = _reactDom2.default.findDOMNode(_this2);
      var window = (0, _getWindow2.default)(el);
      var native = window.getSelection();
      (0, _scrollToSelection2.default)(native);

      _this2.debug('updateScroll', el);
    });
  };

  this.onDragStart = function (e) {
    var node = _this2.props.node;

    // Only void node are draggable

    if (!node.isVoid) {
      return;
    }

    var encoded = _base2.default.serializeNode(node, { preserveKeys: true });
    var dataTransfer = e.nativeEvent.dataTransfer;


    (0, _setTransferData2.default)(dataTransfer, _transferTypes2.default.NODE, encoded);

    _this2.debug('onDragStart', e);
  };

  this.renderNode = function (child) {
    var _props2 = _this2.props,
        block = _props2.block,
        editor = _props2.editor,
        node = _props2.node,
        readOnly = _props2.readOnly,
        schema = _props2.schema,
        state = _props2.state;

    return _react2.default.createElement(Node, {
      key: child.key,
      node: child,
      block: node.kind == 'block' ? node : block,
      parent: node,
      editor: editor,
      readOnly: readOnly,
      schema: schema,
      state: state
    });
  };

  this.renderElement = function () {
    var _props3 = _this2.props,
        editor = _props3.editor,
        node = _props3.node,
        parent = _props3.parent,
        readOnly = _props3.readOnly,
        state = _props3.state;
    var Component = _this2.state.Component;

    var children = node.nodes.map(_this2.renderNode).toArray();

    // Attributes that the developer must to mix into the element in their
    // custom node renderer component.
    var attributes = {
      'data-key': node.key,
      'onDragStart': _this2.onDragStart

      // If it's a block node with inline children, add the proper `dir` attribute
      // for text direction.
    };if (node.kind == 'block' && node.nodes.first().kind != 'block') {
      var direction = node.getTextDirection();
      if (direction == 'rtl') attributes.dir = 'rtl';
    }

    var element = _react2.default.createElement(
      Component,
      {
        attributes: attributes,
        key: node.key,
        editor: editor,
        parent: parent,
        node: node,
        readOnly: readOnly,
        state: state
      },
      children
    );

    return node.isVoid ? _react2.default.createElement(
      _void2.default,
      _this2.props,
      element
    ) : element;
  };

  this.renderText = function () {
    var _props4 = _this2.props,
        node = _props4.node,
        schema = _props4.schema,
        state = _props4.state;
    var document = state.document;

    var decorators = schema.hasDecorators ? document.getDescendantDecorators(node.key, schema) : [];
    var ranges = node.getRanges(decorators);
    var offset = 0;

    var leaves = ranges.map(function (range, i) {
      var leaf = _this2.renderLeaf(ranges, range, i, offset);
      offset += range.text.length;
      return leaf;
    });

    return _react2.default.createElement(
      'span',
      { 'data-key': node.key },
      leaves
    );
  };

  this.renderLeaf = function (ranges, range, index, offset) {
    var _props5 = _this2.props,
        block = _props5.block,
        node = _props5.node,
        parent = _props5.parent,
        schema = _props5.schema,
        state = _props5.state,
        editor = _props5.editor;
    var text = range.text,
        marks = range.marks;


    return _react2.default.createElement(_leaf2.default, {
      key: node.key + '-' + index,
      block: block,
      editor: editor,
      index: index,
      marks: marks,
      node: node,
      offset: offset,
      parent: parent,
      ranges: ranges,
      schema: schema,
      state: state,
      text: text
    });
  };
};

exports.default = Node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL25vZGUuanMiXSwibmFtZXMiOlsiZGVidWciLCJOb2RlIiwicHJvcHMiLCJub2RlIiwic2NoZW1hIiwic3RhdGUiLCJDb21wb25lbnQiLCJraW5kIiwiZ2V0Q29tcG9uZW50IiwicmVuZGVyVGV4dCIsInJlbmRlckVsZW1lbnQiLCJwcm9wVHlwZXMiLCJibG9jayIsImVkaXRvciIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJwYXJlbnQiLCJyZWFkT25seSIsImJvb2wiLCJtZXNzYWdlIiwiYXJncyIsImtleSIsInR5cGUiLCJpZCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJzZXRTdGF0ZSIsInNob3VsZENvbXBvbmVudFVwZGF0ZSIsIm5leHRQcm9wcyIsInN1cHByZXNzU2hvdWxkQ29tcG9uZW50VXBkYXRlIiwiaXNUZXh0TGlzdCIsIm5vZGVzIiwiaXNJblNlbGVjdGlvbiIsImluY2x1ZGVzIiwibmV4dElzSW5TZWxlY3Rpb24iLCJoYXNGb2N1cyIsImlzRm9jdXNlZCIsIm5leHRIYXNGb2N1cyIsInNlbGVjdGlvbkNoYW5nZWQiLCJmb2N1c0NoYW5nZWQiLCJoYXNEZWNvcmF0b3JzIiwibmV4dERlY29yYXRvcnMiLCJkb2N1bWVudCIsImdldERlc2NlbmRhbnREZWNvcmF0b3JzIiwiZGVjb3JhdG9ycyIsIm5leHRSYW5nZXMiLCJnZXRSYW5nZXMiLCJyYW5nZXMiLCJlcXVhbHMiLCJsYXN0IiwibmV4dExhc3QiLCJjb21wb25lbnREaWRNb3VudCIsInVwZGF0ZVNjcm9sbCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiY2xlYXJUaW1lb3V0Iiwic2Nyb2xsVGltZXIiLCJzZWxlY3Rpb24iLCJmaXJzdCIsImlzQmx1cnJlZCIsImhhc0VuZEluIiwic2V0VGltZW91dCIsImVsIiwiZmluZERPTU5vZGUiLCJ3aW5kb3ciLCJuYXRpdmUiLCJnZXRTZWxlY3Rpb24iLCJvbkRyYWdTdGFydCIsImUiLCJpc1ZvaWQiLCJlbmNvZGVkIiwic2VyaWFsaXplTm9kZSIsInByZXNlcnZlS2V5cyIsImRhdGFUcmFuc2ZlciIsIm5hdGl2ZUV2ZW50IiwiTk9ERSIsInJlbmRlck5vZGUiLCJjaGlsZCIsImNoaWxkcmVuIiwibWFwIiwidG9BcnJheSIsImF0dHJpYnV0ZXMiLCJkaXJlY3Rpb24iLCJnZXRUZXh0RGlyZWN0aW9uIiwiZGlyIiwiZWxlbWVudCIsIm9mZnNldCIsImxlYXZlcyIsInJhbmdlIiwiaSIsImxlYWYiLCJyZW5kZXJMZWFmIiwidGV4dCIsImxlbmd0aCIsImluZGV4IiwibWFya3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxRQUFRLHFCQUFNLFlBQU4sQ0FBZDs7QUFFQTs7Ozs7O0lBTU1DLEk7OztBQWtCSjs7Ozs7O0FBTUEsZ0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0R0FDWEEsS0FEVzs7QUFBQTs7QUFBQSxRQUVUQyxJQUZTLEdBRVFELEtBRlIsQ0FFVEMsSUFGUztBQUFBLFFBRUhDLE1BRkcsR0FFUUYsS0FGUixDQUVIRSxNQUZHOztBQUdqQixVQUFLQyxLQUFMLEdBQWEsRUFBYjtBQUNBLFVBQUtBLEtBQUwsQ0FBV0MsU0FBWCxHQUF1QkgsS0FBS0ksSUFBTCxJQUFhLE1BQWIsR0FBc0IsSUFBdEIsR0FBNkJKLEtBQUtLLFlBQUwsQ0FBa0JKLE1BQWxCLENBQXBEO0FBSmlCO0FBS2xCOztBQUVEOzs7Ozs7O0FBN0JBOzs7Ozs7QUEyQ0E7Ozs7OztBQWFBOzs7Ozs7OztBQW1FQTs7OztBQVFBOzs7Ozs7O0FBV0E7Ozs7Ozs7QUFXQTs7Ozs7OztBQStCQTs7Ozs7Ozs7OztBQXNC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QURnQjtBQUFBLFFBQ1JDLEtBRFEsV0FDUkEsS0FEUTtBQUFBLFFBQ0RRLE1BREMsV0FDREEsTUFEQztBQUFBLFFBRXJDZ0YsSUFGcUMsR0FFckJKLEtBRnFCLENBRXJDSSxJQUZxQztBQUFBLFFBRS9CRyxLQUYrQixHQUVyQlAsS0FGcUIsQ0FFL0JPLEtBRitCOzs7QUFJN0MsV0FDRTtBQUNFLFdBQVE3RixLQUFLa0IsR0FBYixTQUFvQjBFLEtBRHRCO0FBRUUsYUFBT25GLEtBRlQ7QUFHRSxjQUFRQyxNQUhWO0FBSUUsYUFBT2tGLEtBSlQ7QUFLRSxhQUFPQyxLQUxUO0FBTUUsWUFBTTdGLElBTlI7QUFPRSxjQUFRb0YsTUFQVjtBQVFFLGNBQVF2RSxNQVJWO0FBU0UsY0FBUThCLE1BVFY7QUFVRSxjQUFRMUMsTUFWVjtBQVdFLGFBQU9DLEtBWFQ7QUFZRSxZQUFNd0Y7QUFaUixNQURGO0FBZ0JELEc7OztrQkFVWTVGLEkiLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCBUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuXG5pbXBvcnQgVFJBTlNGRVJfVFlQRVMgZnJvbSAnLi4vY29uc3RhbnRzL3RyYW5zZmVyLXR5cGVzJ1xuaW1wb3J0IEJhc2U2NCBmcm9tICcuLi9zZXJpYWxpemVycy9iYXNlLTY0J1xuaW1wb3J0IExlYWYgZnJvbSAnLi9sZWFmJ1xuaW1wb3J0IFNsYXRlVHlwZXMgZnJvbSAnLi4vdXRpbHMvcHJvcC10eXBlcydcbmltcG9ydCBUZXh0IGZyb20gJy4uL21vZGVscy90ZXh0J1xuaW1wb3J0IFZvaWQgZnJvbSAnLi92b2lkJ1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tICdnZXQtd2luZG93J1xuaW1wb3J0IHNjcm9sbFRvU2VsZWN0aW9uIGZyb20gJy4uL3V0aWxzL3Njcm9sbC10by1zZWxlY3Rpb24nXG5pbXBvcnQgc2V0VHJhbnNmZXJEYXRhIGZyb20gJy4uL3V0aWxzL3NldC10cmFuc2Zlci1kYXRhJ1xuXG4vKipcbiAqIERlYnVnLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdzbGF0ZTpub2RlJylcblxuLyoqXG4gKiBOb2RlLlxuICpcbiAqIEB0eXBlIHtDb21wb25lbnR9XG4gKi9cblxuY2xhc3MgTm9kZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgLyoqXG4gICAqIFByb3BlcnR5IHR5cGVzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJsb2NrOiBTbGF0ZVR5cGVzLmJsb2NrLFxuICAgIGVkaXRvcjogVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm9kZTogU2xhdGVUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgcGFyZW50OiBTbGF0ZVR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcbiAgICByZWFkT25seTogVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHNjaGVtYTogU2xhdGVUeXBlcy5zY2hlbWEuaXNSZXF1aXJlZCxcbiAgICBzdGF0ZTogU2xhdGVUeXBlcy5zdGF0ZS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICovXG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICBjb25zdCB7IG5vZGUsIHNjaGVtYSB9ID0gcHJvcHNcbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLnN0YXRlLkNvbXBvbmVudCA9IG5vZGUua2luZCA9PSAndGV4dCcgPyBudWxsIDogbm9kZS5nZXRDb21wb25lbnQoc2NoZW1hKVxuICB9XG5cbiAgLyoqXG4gICAqIERlYnVnLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgKiBAcGFyYW0ge01peGVkfSAuLi5hcmdzXG4gICAqL1xuXG4gIGRlYnVnID0gKG1lc3NhZ2UsIC4uLmFyZ3MpID0+IHtcbiAgICBjb25zdCB7IG5vZGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IGtleSwga2luZCwgdHlwZSB9ID0gbm9kZVxuICAgIGNvbnN0IGlkID0ga2luZCA9PSAndGV4dCcgPyBgJHtrZXl9ICgke2tpbmR9KWAgOiBgJHtrZXl9ICgke3R5cGV9KWBcbiAgICBkZWJ1ZyhtZXNzYWdlLCBgJHtpZH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIHJlY2VpdmluZyBuZXcgcHJvcHMsIHVwZGF0ZSB0aGUgYENvbXBvbmVudGAgcmVuZGVyZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgKi9cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzID0gKHByb3BzKSA9PiB7XG4gICAgaWYgKHByb3BzLm5vZGUua2luZCA9PSAndGV4dCcpIHJldHVyblxuICAgIGlmIChwcm9wcy5ub2RlID09IHRoaXMucHJvcHMubm9kZSkgcmV0dXJuXG4gICAgY29uc3QgQ29tcG9uZW50ID0gcHJvcHMubm9kZS5nZXRDb21wb25lbnQocHJvcHMuc2NoZW1hKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBDb21wb25lbnQgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgdGhlIG5vZGUgdXBkYXRlP1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV4dFByb3BzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUgPSAobmV4dFByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBwcm9wcyB9ID0gdGhpc1xuICAgIGNvbnN0IHsgQ29tcG9uZW50IH0gPSB0aGlzLnN0YXRlXG5cbiAgICAvLyBJZiB0aGUgYENvbXBvbmVudGAgaGFzIGVuYWJsZWQgc3VwcHJlc3Npb24gb2YgdXBkYXRlIGNoZWNraW5nLCBhbHdheXNcbiAgICAvLyByZXR1cm4gdHJ1ZSBzbyB0aGF0IGl0IGNhbiBkZWFsIHdpdGggdXBkYXRlIGNoZWNraW5nIGl0c2VsZi5cbiAgICBpZiAoQ29tcG9uZW50ICYmIENvbXBvbmVudC5zdXBwcmVzc1Nob3VsZENvbXBvbmVudFVwZGF0ZSkgcmV0dXJuIHRydWVcblxuICAgIC8vIElmIHRoZSBgcmVhZE9ubHlgIHN0YXR1cyBoYXMgY2hhbmdlZCwgcmUtcmVuZGVyIGluIGNhc2UgdGhlcmUgaXMgYW55XG4gICAgLy8gdXNlci1sYW5kIGxvZ2ljIHRoYXQgZGVwZW5kcyBvbiBpdCwgbGlrZSBuZXN0ZWQgZWRpdGFibGUgY29udGVudHMuXG4gICAgaWYgKG5leHRQcm9wcy5yZWFkT25seSAhPSBwcm9wcy5yZWFkT25seSkgcmV0dXJuIHRydWVcblxuICAgIC8vIElmIHRoZSBub2RlIGhhcyBjaGFuZ2VkLCB1cGRhdGUuIFBFUkY6IFRoZXJlIGFyZSBjYXNlcyB3aGVyZSBpdCB3aWxsIGhhdmVcbiAgICAvLyBjaGFuZ2VkLCBidXQgaXQncyBwcm9wZXJ0aWVzIHdpbGwgYmUgZXhhY3RseSB0aGUgc2FtZSAoZWcuIGNvcHktcGFzdGUpXG4gICAgLy8gd2hpY2ggdGhpcyB3b24ndCBjYXRjaC4gQnV0IHRoYXQncyByYXJlIGFuZCBub3QgYSBkcmFnIG9uIHBlcmZvcm1hbmNlLCBzb1xuICAgIC8vIGZvciBzaW1wbGljaXR5IHdlIGp1c3QgbGV0IHRoZW0gdGhyb3VnaC5cbiAgICBpZiAobmV4dFByb3BzLm5vZGUgIT0gcHJvcHMubm9kZSkgcmV0dXJuIHRydWVcblxuICAgIC8vIElmIHRoZSBOb2RlIGhhcyBjaGlsZHJlbiB0aGF0IGFyZW4ndCBqdXN0IFRleHQncyB0aGVuIGFsbG93IHRoZW0gdG8gZGVjaWRlXG4gICAgLy8gSWYgdGhleSBzaG91bGQgdXBkYXRlIGl0IG9yIG5vdC5cbiAgICBpZiAobmV4dFByb3BzLm5vZGUua2luZCAhPSAndGV4dCcgJiYgVGV4dC5pc1RleHRMaXN0KG5leHRQcm9wcy5ub2RlLm5vZGVzKSA9PSBmYWxzZSkgcmV0dXJuIHRydWVcblxuICAgIC8vIElmIHRoZSBub2RlIGlzIGEgYmxvY2sgb3IgaW5saW5lLCB3aGljaCBjYW4gaGF2ZSBjdXN0b20gcmVuZGVyZXJzLCB3ZVxuICAgIC8vIGluY2x1ZGUgYW4gZXh0cmEgY2hlY2sgdG8gcmUtcmVuZGVyIGlmIHRoZSBub2RlIGVpdGhlciBiZWNvbWVzIHBhcnQgb2YsXG4gICAgLy8gb3IgbGVhdmVzLCBhIHNlbGVjdGlvbi4gVGhpcyBpcyB0byBtYWtlIGl0IHNpbXBsZSBmb3IgdXNlcnMgdG8gc2hvdyBhXG4gICAgLy8gbm9kZSdzIFwic2VsZWN0ZWRcIiBzdGF0ZS5cbiAgICBpZiAobmV4dFByb3BzLm5vZGUua2luZCAhPSAndGV4dCcpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gYCR7cHJvcHMubm9kZS5raW5kfXNgXG4gICAgICBjb25zdCBpc0luU2VsZWN0aW9uID0gcHJvcHMuc3RhdGVbbm9kZXNdLmluY2x1ZGVzKHByb3BzLm5vZGUpXG4gICAgICBjb25zdCBuZXh0SXNJblNlbGVjdGlvbiA9IG5leHRQcm9wcy5zdGF0ZVtub2Rlc10uaW5jbHVkZXMobmV4dFByb3BzLm5vZGUpXG4gICAgICBjb25zdCBoYXNGb2N1cyA9IHByb3BzLnN0YXRlLmlzRm9jdXNlZFxuICAgICAgY29uc3QgbmV4dEhhc0ZvY3VzID0gbmV4dFByb3BzLnN0YXRlLmlzRm9jdXNlZFxuICAgICAgY29uc3Qgc2VsZWN0aW9uQ2hhbmdlZCA9IGlzSW5TZWxlY3Rpb24gIT0gbmV4dElzSW5TZWxlY3Rpb25cbiAgICAgIGNvbnN0IGZvY3VzQ2hhbmdlZCA9IGhhc0ZvY3VzICE9IG5leHRIYXNGb2N1c1xuICAgICAgaWYgKHNlbGVjdGlvbkNoYW5nZWQgfHwgZm9jdXNDaGFuZ2VkKSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIC8vIElmIHRoZSBub2RlIGlzIGEgdGV4dCBub2RlLCByZS1yZW5kZXIgaWYgdGhlIGN1cnJlbnQgZGVjb3JhdGlvbnMgaGF2ZVxuICAgIC8vIGNoYW5nZWQsIGV2ZW4gaWYgdGhlIGNvbnRlbnQgb2YgdGhlIHRleHQgbm9kZSBpdHNlbGYgaGFzbid0LlxuICAgIGlmIChuZXh0UHJvcHMubm9kZS5raW5kID09ICd0ZXh0JyAmJiBuZXh0UHJvcHMuc2NoZW1hLmhhc0RlY29yYXRvcnMpIHtcbiAgICAgIGNvbnN0IG5leHREZWNvcmF0b3JzID0gbmV4dFByb3BzLnN0YXRlLmRvY3VtZW50LmdldERlc2NlbmRhbnREZWNvcmF0b3JzKG5leHRQcm9wcy5ub2RlLmtleSwgbmV4dFByb3BzLnNjaGVtYSlcbiAgICAgIGNvbnN0IGRlY29yYXRvcnMgPSBwcm9wcy5zdGF0ZS5kb2N1bWVudC5nZXREZXNjZW5kYW50RGVjb3JhdG9ycyhwcm9wcy5ub2RlLmtleSwgcHJvcHMuc2NoZW1hKVxuICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IG5leHRQcm9wcy5ub2RlLmdldFJhbmdlcyhuZXh0RGVjb3JhdG9ycylcbiAgICAgIGNvbnN0IHJhbmdlcyA9IHByb3BzLm5vZGUuZ2V0UmFuZ2VzKGRlY29yYXRvcnMpXG4gICAgICBpZiAoIW5leHRSYW5nZXMuZXF1YWxzKHJhbmdlcykpIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG5vZGUgaXMgYSB0ZXh0IG5vZGUsIGFuZCBpdHMgcGFyZW50IGlzIGEgYmxvY2sgbm9kZSwgYW5kIGl0IHdhc1xuICAgIC8vIHRoZSBsYXN0IGNoaWxkIG9mIHRoZSBibG9jaywgcmUtcmVuZGVyIHRvIGNsZWFudXAgZXh0cmEgYDxici8+YCBvciBgXFxuYC5cbiAgICBpZiAobmV4dFByb3BzLm5vZGUua2luZCA9PSAndGV4dCcgJiYgbmV4dFByb3BzLnBhcmVudC5raW5kID09ICdibG9jaycpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSBwcm9wcy5wYXJlbnQubm9kZXMubGFzdCgpXG4gICAgICBjb25zdCBuZXh0TGFzdCA9IG5leHRQcm9wcy5wYXJlbnQubm9kZXMubGFzdCgpXG4gICAgICBpZiAocHJvcHMubm9kZSA9PSBsYXN0ICYmIG5leHRQcm9wcy5ub2RlICE9IG5leHRMYXN0KSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgZG9uJ3QgdXBkYXRlLlxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIG1vdW50LCB1cGRhdGUgdGhlIHNjcm9sbCBwb3NpdGlvbi5cbiAgICovXG5cbiAgY29tcG9uZW50RGlkTW91bnQgPSAoKSA9PiB7XG4gICAgdGhpcy51cGRhdGVTY3JvbGwoKVxuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIHVwZGF0ZSwgdXBkYXRlIHRoZSBzY3JvbGwgcG9zaXRpb24gaWYgdGhlIG5vZGUncyBjb250ZW50IGNoYW5nZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2UHJvcHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdGF0ZVxuICAgKi9cblxuICBjb21wb25lbnREaWRVcGRhdGUgPSAocHJldlByb3BzLCBwcmV2U3RhdGUpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5ub2RlICE9IHByZXZQcm9wcy5ub2RlKSB0aGlzLnVwZGF0ZVNjcm9sbCgpXG4gIH1cblxuICAvKipcbiAgICogVGhlcmUgaXMgYSBjb3JuZXIgY2FzZSwgdGhhdCBzb21lIG5vZGVzIGFyZSB1bm1vdW50ZWQgcmlnaHQgYWZ0ZXIgdGhleSB1cGRhdGVcbiAgICogVGhlbiwgd2hlbiB0aGUgdGltZXIgZXhlY3V0ZSwgaXQgd2lsbCB0aHJvdyB0aGUgZXJyb3JcbiAgICogYGZpbmRET01Ob2RlIHdhcyBjYWxsZWQgb24gYW4gdW5tb3VudGVkIGNvbXBvbmVudGBcbiAgICogV2Ugc2hvdWxkIGNsZWFyIHRoZSB0aW1lciBmcm9tIHVwZGF0ZVNjcm9sbCBoZXJlXG4gICAqL1xuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ID0gKCkgPT4ge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVyKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFmdGVyIGEgY2hhbmdlIGFzIG9jY3VyZWQgaWYgdGhpcyBpcyBhIGxlYWZcbiAgICogYmxvY2sgYW5kIGl0IGhhcyB0aGUgc2VsZWN0aW9uJ3MgZW5kaW5nIGVkZ2UuIFRoaXMgZW5zdXJlcyB0aGF0IHNjcm9sbGluZ1xuICAgKiBtYXRjaGVzIG5hdGl2ZSBgY29udGVudGVkaXRhYmxlYCBiZWhhdmlvciBldmVuIGZvciBjYXNlcyB3aGVyZSB0aGUgZWRpdCBpc1xuICAgKiBub3QgYXBwbGllZCBuYXRpdmVseSwgbGlrZSB3aGVuIGVudGVyIGlzIHByZXNzZWQuXG4gICAqL1xuXG4gIHVwZGF0ZVNjcm9sbCA9ICgpID0+IHtcbiAgICBjb25zdCB7IG5vZGUsIHN0YXRlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBzZWxlY3Rpb24gfSA9IHN0YXRlXG5cbiAgICAvLyBJZiB0aGlzIGlzbid0IGEgYmxvY2ssIG9yIGl0J3MgYSB3cmFwcGluZyBibG9jaywgYWJvcnQuXG4gICAgaWYgKG5vZGUua2luZCAhPSAnYmxvY2snKSByZXR1cm5cbiAgICBpZiAobm9kZS5ub2Rlcy5maXJzdCgpLmtpbmQgPT0gJ2Jsb2NrJykgcmV0dXJuXG5cbiAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGlzIGJsdXJyZWQsIG9yIHRoaXMgYmxvY2sgZG9lc24ndCBjb250YWluIGl0LCBhYm9ydC5cbiAgICBpZiAoc2VsZWN0aW9uLmlzQmx1cnJlZCkgcmV0dXJuXG4gICAgaWYgKCFzZWxlY3Rpb24uaGFzRW5kSW4obm9kZSkpIHJldHVyblxuXG4gICAgLy8gVGhlIG5hdGl2ZSBzZWxlY3Rpb24gd2lsbCBiZSB1cGRhdGVkIGFmdGVyIGNvbXBvbmVudERpZE1vdW50IG9yIGNvbXBvbmVudERpZFVwZGF0ZS5cbiAgICAvLyBVc2Ugc2V0VGltZW91dCB0byBxdWV1ZSBzY3JvbGxpbmcgdG8gdGhlIGxhc3Qgd2hlbiB0aGUgbmF0aXZlIHNlbGVjdGlvbiBoYXMgYmVlbiB1cGRhdGVkIHRvIHRoZSBjb3JyZWN0IHZhbHVlLlxuICAgIHRoaXMuc2Nyb2xsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGVsID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcylcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdyhlbClcbiAgICAgIGNvbnN0IG5hdGl2ZSA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgc2Nyb2xsVG9TZWxlY3Rpb24obmF0aXZlKVxuXG4gICAgICB0aGlzLmRlYnVnKCd1cGRhdGVTY3JvbGwnLCBlbClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGRyYWcgc3RhcnQsIGFkZCBhIHNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGUgdG8gdGhlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICovXG5cbiAgb25EcmFnU3RhcnQgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHsgbm9kZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgLy8gT25seSB2b2lkIG5vZGUgYXJlIGRyYWdnYWJsZVxuICAgIGlmICghbm9kZS5pc1ZvaWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGVuY29kZWQgPSBCYXNlNjQuc2VyaWFsaXplTm9kZShub2RlLCB7IHByZXNlcnZlS2V5czogdHJ1ZSB9KVxuICAgIGNvbnN0IHsgZGF0YVRyYW5zZmVyIH0gPSBlLm5hdGl2ZUV2ZW50XG5cbiAgICBzZXRUcmFuc2ZlckRhdGEoZGF0YVRyYW5zZmVyLCBUUkFOU0ZFUl9UWVBFUy5OT0RFLCBlbmNvZGVkKVxuXG4gICAgdGhpcy5kZWJ1Zygnb25EcmFnU3RhcnQnLCBlKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlci5cbiAgICpcbiAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICovXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgcHJvcHMgfSA9IHRoaXNcbiAgICBjb25zdCB7IG5vZGUgfSA9IHRoaXMucHJvcHNcblxuICAgIHRoaXMuZGVidWcoJ3JlbmRlcicsIHsgcHJvcHMgfSlcblxuICAgIHJldHVybiBub2RlLmtpbmQgPT0gJ3RleHQnXG4gICAgICA/IHRoaXMucmVuZGVyVGV4dCgpXG4gICAgICA6IHRoaXMucmVuZGVyRWxlbWVudCgpXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGEgYGNoaWxkYCBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IGNoaWxkXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlck5vZGUgPSAoY2hpbGQpID0+IHtcbiAgICBjb25zdCB7IGJsb2NrLCBlZGl0b3IsIG5vZGUsIHJlYWRPbmx5LCBzY2hlbWEsIHN0YXRlIH0gPSB0aGlzLnByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxOb2RlXG4gICAgICAgIGtleT17Y2hpbGQua2V5fVxuICAgICAgICBub2RlPXtjaGlsZH1cbiAgICAgICAgYmxvY2s9e25vZGUua2luZCA9PSAnYmxvY2snID8gbm9kZSA6IGJsb2NrfVxuICAgICAgICBwYXJlbnQ9e25vZGV9XG4gICAgICAgIGVkaXRvcj17ZWRpdG9yfVxuICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgIHNjaGVtYT17c2NoZW1hfVxuICAgICAgICBzdGF0ZT17c3RhdGV9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYW4gZWxlbWVudCBgbm9kZWAuXG4gICAqXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlckVsZW1lbnQgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBlZGl0b3IsIG5vZGUsIHBhcmVudCwgcmVhZE9ubHksIHN0YXRlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBDb21wb25lbnQgfSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUubm9kZXMubWFwKHRoaXMucmVuZGVyTm9kZSkudG9BcnJheSgpXG5cbiAgICAvLyBBdHRyaWJ1dGVzIHRoYXQgdGhlIGRldmVsb3BlciBtdXN0IHRvIG1peCBpbnRvIHRoZSBlbGVtZW50IGluIHRoZWlyXG4gICAgLy8gY3VzdG9tIG5vZGUgcmVuZGVyZXIgY29tcG9uZW50LlxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB7XG4gICAgICAnZGF0YS1rZXknOiBub2RlLmtleSxcbiAgICAgICdvbkRyYWdTdGFydCc6IHRoaXMub25EcmFnU3RhcnRcbiAgICB9XG5cbiAgICAvLyBJZiBpdCdzIGEgYmxvY2sgbm9kZSB3aXRoIGlubGluZSBjaGlsZHJlbiwgYWRkIHRoZSBwcm9wZXIgYGRpcmAgYXR0cmlidXRlXG4gICAgLy8gZm9yIHRleHQgZGlyZWN0aW9uLlxuICAgIGlmIChub2RlLmtpbmQgPT0gJ2Jsb2NrJyAmJiBub2RlLm5vZGVzLmZpcnN0KCkua2luZCAhPSAnYmxvY2snKSB7XG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSBub2RlLmdldFRleHREaXJlY3Rpb24oKVxuICAgICAgaWYgKGRpcmVjdGlvbiA9PSAncnRsJykgYXR0cmlidXRlcy5kaXIgPSAncnRsJ1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSAoXG4gICAgICA8Q29tcG9uZW50XG4gICAgICAgIGF0dHJpYnV0ZXM9e2F0dHJpYnV0ZXN9XG4gICAgICAgIGtleT17bm9kZS5rZXl9XG4gICAgICAgIGVkaXRvcj17ZWRpdG9yfVxuICAgICAgICBwYXJlbnQ9e3BhcmVudH1cbiAgICAgICAgbm9kZT17bm9kZX1cbiAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICBzdGF0ZT17c3RhdGV9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvQ29tcG9uZW50PlxuICAgIClcblxuICAgIHJldHVybiBub2RlLmlzVm9pZFxuICAgICAgPyA8Vm9pZCB7Li4udGhpcy5wcm9wc30+e2VsZW1lbnR9PC9Wb2lkPlxuICAgICAgOiBlbGVtZW50XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGEgdGV4dCBub2RlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cblxuICByZW5kZXJUZXh0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgbm9kZSwgc2NoZW1hLCBzdGF0ZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gICAgY29uc3QgZGVjb3JhdG9ycyA9IHNjaGVtYS5oYXNEZWNvcmF0b3JzID8gZG9jdW1lbnQuZ2V0RGVzY2VuZGFudERlY29yYXRvcnMobm9kZS5rZXksIHNjaGVtYSkgOiBbXVxuICAgIGNvbnN0IHJhbmdlcyA9IG5vZGUuZ2V0UmFuZ2VzKGRlY29yYXRvcnMpXG4gICAgbGV0IG9mZnNldCA9IDBcblxuICAgIGNvbnN0IGxlYXZlcyA9IHJhbmdlcy5tYXAoKHJhbmdlLCBpKSA9PiB7XG4gICAgICBjb25zdCBsZWFmID0gdGhpcy5yZW5kZXJMZWFmKHJhbmdlcywgcmFuZ2UsIGksIG9mZnNldClcbiAgICAgIG9mZnNldCArPSByYW5nZS50ZXh0Lmxlbmd0aFxuICAgICAgcmV0dXJuIGxlYWZcbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGRhdGEta2V5PXtub2RlLmtleX0+XG4gICAgICAgIHtsZWF2ZXN9XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhIHNpbmdsZSBsZWFmIG5vZGUgZ2l2ZW4gYSBgcmFuZ2VgIGFuZCBgb2Zmc2V0YC5cbiAgICpcbiAgICogQHBhcmFtIHtMaXN0PFJhbmdlPn0gcmFuZ2VzXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0XG4gICAqIEByZXR1cm4ge0VsZW1lbnR9IGxlYWZcbiAgICovXG5cbiAgcmVuZGVyTGVhZiA9IChyYW5nZXMsIHJhbmdlLCBpbmRleCwgb2Zmc2V0KSA9PiB7XG4gICAgY29uc3QgeyBibG9jaywgbm9kZSwgcGFyZW50LCBzY2hlbWEsIHN0YXRlLCBlZGl0b3IgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IHRleHQsIG1hcmtzIH0gPSByYW5nZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxMZWFmXG4gICAgICAgIGtleT17YCR7bm9kZS5rZXl9LSR7aW5kZXh9YH1cbiAgICAgICAgYmxvY2s9e2Jsb2NrfVxuICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICBtYXJrcz17bWFya3N9XG4gICAgICAgIG5vZGU9e25vZGV9XG4gICAgICAgIG9mZnNldD17b2Zmc2V0fVxuICAgICAgICBwYXJlbnQ9e3BhcmVudH1cbiAgICAgICAgcmFuZ2VzPXtyYW5nZXN9XG4gICAgICAgIHNjaGVtYT17c2NoZW1hfVxuICAgICAgICBzdGF0ZT17c3RhdGV9XG4gICAgICAgIHRleHQ9e3RleHR9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtDb21wb25lbnR9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVxuIl19