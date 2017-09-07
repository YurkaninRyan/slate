'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

var _transferTypes = require('../constants/transfer-types');

var _transferTypes2 = _interopRequireDefault(_transferTypes);

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _extendSelection = require('../utils/extend-selection');

var _extendSelection2 = _interopRequireDefault(_extendSelection);

var _findClosestNode = require('../utils/find-closest-node');

var _findClosestNode2 = _interopRequireDefault(_findClosestNode);

var _findDeepestNode = require('../utils/find-deepest-node');

var _findDeepestNode2 = _interopRequireDefault(_findDeepestNode);

var _getHtmlFromNativePaste = require('../utils/get-html-from-native-paste');

var _getHtmlFromNativePaste2 = _interopRequireDefault(_getHtmlFromNativePaste);

var _getPoint = require('../utils/get-point');

var _getPoint2 = _interopRequireDefault(_getPoint);

var _getTransferData = require('../utils/get-transfer-data');

var _getTransferData2 = _interopRequireDefault(_getTransferData);

var _setTransferData = require('../utils/set-transfer-data');

var _setTransferData2 = _interopRequireDefault(_setTransferData);

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

var debug = (0, _debug2.default)('slate:content');

/**
 * Content.
 *
 * @type {Component}
 */

var Content = function (_React$Component) {
  _inherits(Content, _React$Component);

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  function Content(props) {
    _classCallCheck(this, Content);

    var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

    _initialiseProps.call(_this);

    _this.tmp = {};
    _this.tmp.compositions = 0;
    _this.tmp.forces = 0;
    return _this;
  }

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * When the editor first mounts in the DOM we need to:
   *
   *   - Update the selection, in case it starts focused.
   *   - Focus the editor if `autoFocus` is set.
   */

  /**
   * On update, update the selection.
   */

  /**
   * Update the native DOM selection to reflect the internal model.
   */

  /**
   * The React ref method to set the root content element locally.
   *
   * @param {Element} n
   */

  /**
   * Check if an event `target` is fired from within the contenteditable
   * element. This should be false for edits happening in non-contenteditable
   * children, such as void nodes and other nested Slate editors.
   *
   * @param {Element} target
   * @return {Boolean}
   */

  /**
   * On before input, bubble up.
   *
   * @param {Event} event
   */

  /**
   * On blur, update the selection to be not focused.
   *
   * @param {Event} event
   */

  /**
   * On focus, update the selection to be focused.
   *
   * @param {Event} event
   */

  /**
   * On composition start, set the `isComposing` flag.
   *
   * @param {Event} event
   */

  /**
   * On composition end, remove the `isComposing` flag on the next tick. Also
   * increment the `forces` key, which will force the contenteditable element
   * to completely re-render, since IME puts React in an unreconcilable state.
   *
   * @param {Event} event
   */

  /**
   * On copy, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} event
   */

  /**
   * On cut, defer to `onCutCopy`, then bubble up.
   *
   * @param {Event} event
   */

  /**
   * On drag end, unset the `isDragging` flag.
   *
   * @param {Event} event
   */

  /**
   * On drag over, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} event
   */

  /**
   * On drag start, set the `isDragging` flag and the `isInternalDrag` flag.
   *
   * @param {Event} event
   */

  /**
   * On drop.
   *
   * @param {Event} event
   */

  /**
   * On input, handle spellcheck and other similar edits that don't go trigger
   * the `onBeforeInput` and instead update the DOM directly.
   *
   * @param {Event} event
   */

  /**
   * On key down, prevent the default behavior of certain commands that will
   * leave the editor in an out-of-sync state, then bubble up.
   *
   * @param {Event} event
   */

  /**
   * On key up, unset the `isShifting` flag.
   *
   * @param {Event} event
   */

  /**
   * On paste, determine the type and bubble up.
   *
   * @param {Event} event
   */

  /**
   * On select, update the current state's selection.
   *
   * @param {Event} event
   */

  _createClass(Content, [{
    key: 'render',


    /**
     * Render the editor content.
     *
     * @return {Element}
     */

    value: function render() {
      var _this2 = this;

      var props = this.props;
      var className = props.className,
          readOnly = props.readOnly,
          state = props.state,
          tabIndex = props.tabIndex,
          role = props.role,
          tagName = props.tagName;

      var Container = tagName;
      var document = state.document;

      var children = document.nodes.map(function (node) {
        return _this2.renderNode(node);
      }).toArray();

      var style = _extends({
        // Prevent the default outline styles.
        outline: 'none',
        // Preserve adjacent whitespace and new lines.
        whiteSpace: 'pre-wrap',
        // Allow words to break if they are too long.
        wordWrap: 'break-word'
      }, readOnly ? {} : { WebkitUserModify: 'read-write-plaintext-only' }, props.style);

      // COMPAT: In Firefox, spellchecking can remove entire wrapping elements
      // including inline ones like `<a>`, which is jarring for the user but also
      // causes the DOM to get into an irreconcilable state. (2016/09/01)
      var spellCheck = _environment.IS_FIREFOX ? false : props.spellCheck;

      debug('render', { props: props });

      return _react2.default.createElement(
        Container,
        {
          'data-slate-editor': true,
          key: this.tmp.forces,
          ref: this.ref,
          'data-key': document.key,
          contentEditable: !readOnly,
          suppressContentEditableWarning: true,
          className: className,
          onBeforeInput: this.onBeforeInput,
          onBlur: this.onBlur,
          onFocus: this.onFocus,
          onCompositionEnd: this.onCompositionEnd,
          onCompositionStart: this.onCompositionStart,
          onCopy: this.onCopy,
          onCut: this.onCut,
          onDragEnd: this.onDragEnd,
          onDragOver: this.onDragOver,
          onDragStart: this.onDragStart,
          onDrop: this.onDrop,
          onInput: this.onInput,
          onKeyDown: this.onKeyDown,
          onKeyUp: this.onKeyUp,
          onPaste: this.onPaste,
          onSelect: this.onSelect,
          autoCorrect: props.autoCorrect,
          spellCheck: spellCheck,
          style: style,
          role: readOnly ? null : role || 'textbox',
          tabIndex: tabIndex
          // COMPAT: The Grammarly Chrome extension works by changing the DOM out
          // from under `contenteditable` elements, which leads to weird behaviors
          // so we have to disable it like this. (2017/04/24)
          , 'data-gramm': false
        },
        children,
        this.props.children
      );
    }

    /**
     * Render a `node`.
     *
     * @param {Node} node
     * @return {Element}
     */

  }]);

  return Content;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Content.propTypes = {
  autoCorrect: _propTypes2.default.bool.isRequired,
  autoFocus: _propTypes2.default.bool.isRequired,
  children: _propTypes2.default.array.isRequired,
  className: _propTypes2.default.string,
  editor: _propTypes2.default.object.isRequired,
  onBeforeInput: _propTypes2.default.func.isRequired,
  onBlur: _propTypes2.default.func.isRequired,
  onCopy: _propTypes2.default.func.isRequired,
  onCut: _propTypes2.default.func.isRequired,
  onDrop: _propTypes2.default.func.isRequired,
  onFocus: _propTypes2.default.func.isRequired,
  onKeyDown: _propTypes2.default.func.isRequired,
  onKeyUp: _propTypes2.default.func.isRequired,
  onPaste: _propTypes2.default.func.isRequired,
  onSelect: _propTypes2.default.func.isRequired,
  readOnly: _propTypes2.default.bool.isRequired,
  role: _propTypes2.default.string,
  schema: _propTypes4.default.schema.isRequired,
  spellCheck: _propTypes2.default.bool.isRequired,
  state: _propTypes4.default.state.isRequired,
  style: _propTypes2.default.object,
  tabIndex: _propTypes2.default.number,
  tagName: _propTypes2.default.string };
Content.defaultProps = {
  style: {},
  tagName: 'div' };

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.shouldComponentUpdate = function (props, state) {
    // If the readOnly state has changed, we need to re-render so that
    // the cursor will be added or removed again.
    if (props.readOnly != _this3.props.readOnly) return true;

    // If the state has been changed natively, never re-render, or else we'll
    // end up duplicating content.
    if (props.state.isNative) return false;

    return props.className != _this3.props.className || props.schema != _this3.props.schema || props.autoCorrect != _this3.props.autoCorrect || props.spellCheck != _this3.props.spellCheck || props.state != _this3.props.state || props.style != _this3.props.style;
  };

  this.componentDidMount = function () {
    _this3.updateSelection();

    if (_this3.props.autoFocus) {
      _this3.element.focus();
    }
  };

  this.componentDidUpdate = function () {
    _this3.updateSelection();
  };

  this.updateSelection = function () {
    var _props = _this3.props,
        editor = _props.editor,
        state = _props.state;
    var document = state.document,
        selection = state.selection;

    var window = (0, _getWindow2.default)(_this3.element);
    var native = window.getSelection();

    // If both selections are blurred, do nothing.
    if (!native.rangeCount && selection.isBlurred) return;

    // If the selection has been blurred, but is still inside the editor in the
    // DOM, blur it manually.
    if (selection.isBlurred) {
      if (!_this3.isInEditor(native.anchorNode)) return;
      native.removeAllRanges();
      _this3.element.blur();
      debug('updateSelection', { selection: selection, native: native });
      return;
    }

    // Otherwise, figure out which DOM nodes should be selected...
    var anchorText = state.anchorText,
        focusText = state.focusText;
    var anchorKey = selection.anchorKey,
        anchorOffset = selection.anchorOffset,
        focusKey = selection.focusKey,
        focusOffset = selection.focusOffset;

    var schema = editor.getSchema();
    var anchorDecorators = document.getDescendantDecorators(anchorKey, schema);
    var focusDecorators = document.getDescendantDecorators(focusKey, schema);
    var anchorRanges = anchorText.getRanges(anchorDecorators);
    var focusRanges = focusText.getRanges(focusDecorators);
    var a = 0;
    var f = 0;
    var anchorIndex = void 0;
    var focusIndex = void 0;
    var anchorOff = void 0;
    var focusOff = void 0;

    anchorRanges.forEach(function (range, i, ranges) {
      var length = range.text.length;

      a += length;
      if (a < anchorOffset) return;
      anchorIndex = i;
      anchorOff = anchorOffset - (a - length);
      return false;
    });

    focusRanges.forEach(function (range, i, ranges) {
      var length = range.text.length;

      f += length;
      if (f < focusOffset) return;
      focusIndex = i;
      focusOff = focusOffset - (f - length);
      return false;
    });

    var anchorSpan = _this3.element.querySelector('[data-offset-key="' + anchorKey + '-' + anchorIndex + '"]');
    var focusSpan = _this3.element.querySelector('[data-offset-key="' + focusKey + '-' + focusIndex + '"]');
    var anchorEl = (0, _findDeepestNode2.default)(anchorSpan);
    var focusEl = (0, _findDeepestNode2.default)(focusSpan);

    // If they are already selected, do nothing.
    if (anchorEl == native.anchorNode && anchorOff == native.anchorOffset && focusEl == native.focusNode && focusOff == native.focusOffset) {
      return;
    }

    // Otherwise, set the `isSelecting` flag and update the selection.
    _this3.tmp.isSelecting = true;
    native.removeAllRanges();
    var range = window.document.createRange();
    range.setStart(anchorEl, anchorOff);
    native.addRange(range);
    (0, _extendSelection2.default)(native, focusEl, focusOff);

    // Then unset the `isSelecting` flag after a delay.
    setTimeout(function () {
      // COMPAT: In Firefox, it's not enough to create a range, you also need to
      // focus the contenteditable element too. (2016/11/16)
      if (_environment.IS_FIREFOX) _this3.element.focus();
      _this3.tmp.isSelecting = false;
    });

    debug('updateSelection', { selection: selection, native: native });
  };

  this.ref = function (element) {
    _this3.element = element;
  };

  this.isInEditor = function (target) {
    var element = _this3.element;
    // COMPAT: Text nodes don't have `isContentEditable` property. So, when
    // `target` is a text node use its parent node for check.

    var el = target.nodeType === 3 ? target.parentNode : target;
    return el.isContentEditable && (el === element || (0, _findClosestNode2.default)(el, '[data-slate-editor]') === element);
  };

  this.onBeforeInput = function (event) {
    if (_this3.props.readOnly) return;
    if (!_this3.isInEditor(event.target)) return;

    var data = {};

    debug('onBeforeInput', { event: event, data: data });
    _this3.props.onBeforeInput(event, data);
  };

  this.onBlur = function (event) {
    if (_this3.props.readOnly) return;
    if (_this3.tmp.isCopying) return;
    if (!_this3.isInEditor(event.target)) return;

    // If the active element is still the editor, the blur event is due to the
    // window itself being blurred (eg. when changing tabs) so we should ignore
    // the event, since we want to maintain focus when returning.
    var window = (0, _getWindow2.default)(_this3.element);
    if (window.document.activeElement == _this3.element) return;

    var data = {};

    debug('onBlur', { event: event, data: data });
    _this3.props.onBlur(event, data);
  };

  this.onFocus = function (event) {
    if (_this3.props.readOnly) return;
    if (_this3.tmp.isCopying) return;
    if (!_this3.isInEditor(event.target)) return;

    // COMPAT: If the editor has nested editable elements, the focus can go to
    // those elements. In Firefox, this must be prevented because it results in
    // issues with keyboard navigation. (2017/03/30)
    if (_environment.IS_FIREFOX && event.target != _this3.element) {
      _this3.element.focus();
      return;
    }

    var data = {};

    debug('onFocus', { event: event, data: data });
    _this3.props.onFocus(event, data);
  };

  this.onCompositionStart = function (event) {
    if (!_this3.isInEditor(event.target)) return;

    _this3.tmp.isComposing = true;
    _this3.tmp.compositions++;

    debug('onCompositionStart', { event: event });
  };

  this.onCompositionEnd = function (event) {
    if (!_this3.isInEditor(event.target)) return;

    _this3.tmp.forces++;
    var count = _this3.tmp.compositions;

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition in still in affect.
    setTimeout(function () {
      if (_this3.tmp.compositions > count) return;
      _this3.tmp.isComposing = false;
    });

    debug('onCompositionEnd', { event: event });
  };

  this.onCopy = function (event) {
    if (!_this3.isInEditor(event.target)) return;
    var window = (0, _getWindow2.default)(event.target);

    _this3.tmp.isCopying = true;
    window.requestAnimationFrame(function () {
      _this3.tmp.isCopying = false;
    });

    var state = _this3.props.state;

    var data = {};
    data.type = 'fragment';
    data.fragment = state.fragment;

    debug('onCopy', { event: event, data: data });
    _this3.props.onCopy(event, data);
  };

  this.onCut = function (event) {
    if (_this3.props.readOnly) return;
    if (!_this3.isInEditor(event.target)) return;
    var window = (0, _getWindow2.default)(event.target);

    _this3.tmp.isCopying = true;
    window.requestAnimationFrame(function () {
      _this3.tmp.isCopying = false;
    });

    var state = _this3.props.state;

    var data = {};
    data.type = 'fragment';
    data.fragment = state.fragment;

    debug('onCut', { event: event, data: data });
    _this3.props.onCut(event, data);
  };

  this.onDragEnd = function (event) {
    if (!_this3.isInEditor(event.target)) return;

    _this3.tmp.isDragging = false;
    _this3.tmp.isInternalDrag = null;

    debug('onDragEnd', { event: event });
  };

  this.onDragOver = function (event) {
    if (!_this3.isInEditor(event.target)) return;
    if (_this3.tmp.isDragging) return;
    _this3.tmp.isDragging = true;
    _this3.tmp.isInternalDrag = false;

    debug('onDragOver', { event: event });
  };

  this.onDragStart = function (event) {
    if (!_this3.isInEditor(event.target)) return;

    _this3.tmp.isDragging = true;
    _this3.tmp.isInternalDrag = true;
    var dataTransfer = event.nativeEvent.dataTransfer;

    var data = (0, _getTransferData2.default)(dataTransfer);

    // If it's a node being dragged, the data type is already set.
    if (data.type == 'node') return;

    var state = _this3.props.state;
    var fragment = state.fragment;

    var encoded = _base2.default.serializeNode(fragment);

    (0, _setTransferData2.default)(dataTransfer, _transferTypes2.default.FRAGMENT, encoded);

    debug('onDragStart', { event: event });
  };

  this.onDrop = function (event) {
    event.preventDefault();

    if (_this3.props.readOnly) return;
    if (!_this3.isInEditor(event.target)) return;

    var window = (0, _getWindow2.default)(event.target);
    var _props2 = _this3.props,
        state = _props2.state,
        editor = _props2.editor;
    var nativeEvent = event.nativeEvent;
    var dataTransfer = nativeEvent.dataTransfer,
        x = nativeEvent.x,
        y = nativeEvent.y;

    var data = (0, _getTransferData2.default)(dataTransfer);

    // Resolve the point where the drop occured.
    var range = void 0;

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y);
    } else {
      range = window.document.createRange();
      range.setStart(nativeEvent.rangeParent, nativeEvent.rangeOffset);
    }

    var _range = range,
        startContainer = _range.startContainer,
        startOffset = _range.startOffset;

    var point = (0, _getPoint2.default)(startContainer, startOffset, state, editor);
    if (!point) return;

    var target = _selection2.default.create({
      anchorKey: point.key,
      anchorOffset: point.offset,
      focusKey: point.key,
      focusOffset: point.offset,
      isFocused: true
    });

    // Add drop-specific information to the data.
    data.target = target;

    // COMPAT: Edge throws "Permission denied" errors when
    // accessing `dropEffect` or `effectAllowed` (2017/7/12)
    try {
      data.effect = dataTransfer.dropEffect;
    } catch (err) {
      data.effect = null;
    }

    if (data.type == 'fragment' || data.type == 'node') {
      data.isInternal = _this3.tmp.isInternalDrag;
    }

    debug('onDrop', { event: event, data: data });
    _this3.props.onDrop(event, data);
  };

  this.onInput = function (event) {
    if (_this3.tmp.isComposing) return;
    if (_this3.props.state.isBlurred) return;
    if (!_this3.isInEditor(event.target)) return;
    debug('onInput', { event: event });

    var window = (0, _getWindow2.default)(event.target);
    var _props3 = _this3.props,
        state = _props3.state,
        editor = _props3.editor;

    // Get the selection point.

    var native = window.getSelection();
    var anchorNode = native.anchorNode,
        anchorOffset = native.anchorOffset;

    var point = (0, _getPoint2.default)(anchorNode, anchorOffset, state, editor);
    if (!point) return;

    // Get the range in question.
    var key = point.key,
        index = point.index,
        start = point.start,
        end = point.end;
    var document = state.document,
        selection = state.selection;

    var schema = editor.getSchema();
    var decorators = document.getDescendantDecorators(key, schema);
    var node = document.getDescendant(key);
    var block = document.getClosestBlock(node.key);
    var ranges = node.getRanges(decorators);
    var lastText = block.getLastText();

    // Get the text information.
    var textContent = anchorNode.textContent;

    var lastChar = textContent.charAt(textContent.length - 1);
    var isLastText = node == lastText;
    var isLastRange = index == ranges.size - 1;

    // If we're dealing with the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastText && isLastRange && lastChar == '\n') {
      textContent = textContent.slice(0, -1);
    }

    // If the text is no different, abort.
    var range = ranges.get(index);
    var text = range.text,
        marks = range.marks;

    if (textContent == text) return;

    // Determine what the selection should be after changing the text.
    var delta = textContent.length - text.length;
    var after = selection.collapseToEnd().move(delta);

    // Change the current state to have the text replaced.
    editor.change(function (change) {
      change.select({
        anchorKey: key,
        anchorOffset: start,
        focusKey: key,
        focusOffset: end
      }).delete().insertText(textContent, marks).select(after);
    });
  };

  this.onKeyDown = function (event) {
    if (_this3.props.readOnly) return;
    if (!_this3.isInEditor(event.target)) return;

    var altKey = event.altKey,
        ctrlKey = event.ctrlKey,
        metaKey = event.metaKey,
        shiftKey = event.shiftKey,
        which = event.which;

    var key = (0, _keycode2.default)(which);
    var data = {};

    // Keep track of an `isShifting` flag, because it's often used to trigger
    // "Paste and Match Style" commands, but isn't available on the event in a
    // normal paste event.
    if (key == 'shift') {
      _this3.tmp.isShifting = true;
    }

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (_this3.tmp.isComposing && (key == 'left' || key == 'right' || key == 'up' || key == 'down')) {
      event.preventDefault();
      return;
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = which;
    data.key = key;
    data.isAlt = altKey;
    data.isCmd = _environment.IS_MAC ? metaKey && !altKey : false;
    data.isCtrl = ctrlKey && !altKey;
    data.isLine = _environment.IS_MAC ? metaKey : false;
    data.isMeta = metaKey;
    data.isMod = _environment.IS_MAC ? metaKey && !altKey : ctrlKey && !altKey;
    data.isModAlt = _environment.IS_MAC ? metaKey && altKey : ctrlKey && altKey;
    data.isShift = shiftKey;
    data.isWord = _environment.IS_MAC ? altKey : ctrlKey;

    // These key commands have native behavior in contenteditable elements which
    // will cause our state to be out of sync, so prevent them.
    if (key == 'enter' || key == 'backspace' || key == 'delete' || key == 'b' && data.isMod || key == 'i' && data.isMod || key == 'y' && data.isMod || key == 'z' && data.isMod) {
      event.preventDefault();
    }

    debug('onKeyDown', { event: event, data: data });
    _this3.props.onKeyDown(event, data);
  };

  this.onKeyUp = function (event) {
    var altKey = event.altKey,
        ctrlKey = event.ctrlKey,
        metaKey = event.metaKey,
        shiftKey = event.shiftKey,
        which = event.which;

    var key = (0, _keycode2.default)(which);
    var data = {};

    if (key == 'shift') {
      _this3.tmp.isShifting = false;
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = which;
    data.key = key;
    data.isAlt = altKey;
    data.isCmd = _environment.IS_MAC ? metaKey && !altKey : false;
    data.isCtrl = ctrlKey && !altKey;
    data.isLine = _environment.IS_MAC ? metaKey : false;
    data.isMeta = metaKey;
    data.isMod = _environment.IS_MAC ? metaKey && !altKey : ctrlKey && !altKey;
    data.isModAlt = _environment.IS_MAC ? metaKey && altKey : ctrlKey && altKey;
    data.isShift = shiftKey;
    data.isWord = _environment.IS_MAC ? altKey : ctrlKey;

    debug('onKeyUp', { event: event, data: data });
    _this3.props.onKeyUp(event, data);
  };

  this.onPaste = function (event) {
    if (_this3.props.readOnly) return;
    if (!_this3.isInEditor(event.target)) return;

    var data = (0, _getTransferData2.default)(event.clipboardData);

    // Attach the `isShift` flag, so that people can use it to trigger "Paste
    // and Match Style" logic.
    data.isShift = !!_this3.tmp.isShifting;
    debug('onPaste', { event: event, data: data });

    // COMPAT: In IE 11, only plain text can be retrieved from the event's
    // `clipboardData`. To get HTML, use the browser's native paste action which
    // can only be handled synchronously. (2017/06/23)
    if (_environment.IS_IE) {
      // Do not use `event.preventDefault()` as we need the native paste action.
      (0, _getHtmlFromNativePaste2.default)(event.target, function (html) {
        // If pasted HTML can be retreived, it is added to the `data` object,
        // setting the `type` to `html`.
        _this3.props.onPaste(event, html === undefined ? data : _extends({}, data, { html: html, type: 'html' }));
      });
    } else {
      event.preventDefault();
      _this3.props.onPaste(event, data);
    }
  };

  this.onSelect = function (event) {
    if (_this3.props.readOnly) return;
    if (_this3.tmp.isCopying) return;
    if (_this3.tmp.isComposing) return;
    if (_this3.tmp.isSelecting) return;
    if (!_this3.isInEditor(event.target)) return;

    var window = (0, _getWindow2.default)(event.target);
    var _props4 = _this3.props,
        state = _props4.state,
        editor = _props4.editor;
    var document = state.document,
        selection = state.selection;

    var native = window.getSelection();
    var data = {};

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      data.selection = selection.set('isFocused', false);
      data.isNative = true;
    }

    // Otherwise, determine the Slate selection from the native one.
    else {
        var anchorNode = native.anchorNode,
            anchorOffset = native.anchorOffset,
            focusNode = native.focusNode,
            focusOffset = native.focusOffset;

        var anchor = (0, _getPoint2.default)(anchorNode, anchorOffset, state, editor);
        var focus = (0, _getPoint2.default)(focusNode, focusOffset, state, editor);
        if (!anchor || !focus) return;

        // There are situations where a select event will fire with a new native
        // selection that resolves to the same internal position. In those cases
        // we don't need to trigger any changes, since our internal model is
        // already up to date, but we do want to update the native selection again
        // to make sure it is in sync.
        if (anchor.key == selection.anchorKey && anchor.offset == selection.anchorOffset && focus.key == selection.focusKey && focus.offset == selection.focusOffset && selection.isFocused) {
          _this3.updateSelection();
          return;
        }

        var properties = {
          anchorKey: anchor.key,
          anchorOffset: anchor.offset,
          focusKey: focus.key,
          focusOffset: focus.offset,
          isFocused: true,
          isBackward: null

          // If the selection is at the end of a non-void inline node, and there is
          // a node after it, put it in the node after instead.
        };var anchorText = document.getNode(anchor.key);
        var focusText = document.getNode(focus.key);
        var anchorInline = document.getClosestInline(anchor.key);
        var focusInline = document.getClosestInline(focus.key);

        if (anchorInline && !anchorInline.isVoid && anchor.offset == anchorText.text.length) {
          var block = document.getClosestBlock(anchor.key);
          var next = block.getNextText(anchor.key);
          if (next) {
            properties.anchorKey = next.key;
            properties.anchorOffset = 0;
          }
        }

        if (focusInline && !focusInline.isVoid && focus.offset == focusText.text.length) {
          var _block = document.getClosestBlock(focus.key);
          var _next = _block.getNextText(focus.key);
          if (_next) {
            properties.focusKey = _next.key;
            properties.focusOffset = 0;
          }
        }

        data.selection = selection.merge(properties).normalize(document);
      }

    debug('onSelect', { event: event, data: data });
    _this3.props.onSelect(event, data);
  };

  this.renderNode = function (node) {
    var _props5 = _this3.props,
        editor = _props5.editor,
        readOnly = _props5.readOnly,
        schema = _props5.schema,
        state = _props5.state;


    return _react2.default.createElement(_node2.default, {
      key: node.key,
      block: null,
      node: node,
      parent: state.document,
      schema: schema,
      state: state,
      editor: editor,
      readOnly: readOnly
    });
  };
};

exports.default = Content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2NvbnRlbnQuanMiXSwibmFtZXMiOlsiZGVidWciLCJDb250ZW50IiwicHJvcHMiLCJ0bXAiLCJjb21wb3NpdGlvbnMiLCJmb3JjZXMiLCJjbGFzc05hbWUiLCJyZWFkT25seSIsInN0YXRlIiwidGFiSW5kZXgiLCJyb2xlIiwidGFnTmFtZSIsIkNvbnRhaW5lciIsImRvY3VtZW50IiwiY2hpbGRyZW4iLCJub2RlcyIsIm1hcCIsInJlbmRlck5vZGUiLCJub2RlIiwidG9BcnJheSIsInN0eWxlIiwib3V0bGluZSIsIndoaXRlU3BhY2UiLCJ3b3JkV3JhcCIsIldlYmtpdFVzZXJNb2RpZnkiLCJzcGVsbENoZWNrIiwicmVmIiwia2V5Iiwib25CZWZvcmVJbnB1dCIsIm9uQmx1ciIsIm9uRm9jdXMiLCJvbkNvbXBvc2l0aW9uRW5kIiwib25Db21wb3NpdGlvblN0YXJ0Iiwib25Db3B5Iiwib25DdXQiLCJvbkRyYWdFbmQiLCJvbkRyYWdPdmVyIiwib25EcmFnU3RhcnQiLCJvbkRyb3AiLCJvbklucHV0Iiwib25LZXlEb3duIiwib25LZXlVcCIsIm9uUGFzdGUiLCJvblNlbGVjdCIsImF1dG9Db3JyZWN0IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiYm9vbCIsImlzUmVxdWlyZWQiLCJhdXRvRm9jdXMiLCJhcnJheSIsInN0cmluZyIsImVkaXRvciIsIm9iamVjdCIsImZ1bmMiLCJzY2hlbWEiLCJudW1iZXIiLCJkZWZhdWx0UHJvcHMiLCJzaG91bGRDb21wb25lbnRVcGRhdGUiLCJpc05hdGl2ZSIsImNvbXBvbmVudERpZE1vdW50IiwidXBkYXRlU2VsZWN0aW9uIiwiZWxlbWVudCIsImZvY3VzIiwiY29tcG9uZW50RGlkVXBkYXRlIiwic2VsZWN0aW9uIiwid2luZG93IiwibmF0aXZlIiwiZ2V0U2VsZWN0aW9uIiwicmFuZ2VDb3VudCIsImlzQmx1cnJlZCIsImlzSW5FZGl0b3IiLCJhbmNob3JOb2RlIiwicmVtb3ZlQWxsUmFuZ2VzIiwiYmx1ciIsImFuY2hvclRleHQiLCJmb2N1c1RleHQiLCJhbmNob3JLZXkiLCJhbmNob3JPZmZzZXQiLCJmb2N1c0tleSIsImZvY3VzT2Zmc2V0IiwiZ2V0U2NoZW1hIiwiYW5jaG9yRGVjb3JhdG9ycyIsImdldERlc2NlbmRhbnREZWNvcmF0b3JzIiwiZm9jdXNEZWNvcmF0b3JzIiwiYW5jaG9yUmFuZ2VzIiwiZ2V0UmFuZ2VzIiwiZm9jdXNSYW5nZXMiLCJhIiwiZiIsImFuY2hvckluZGV4IiwiZm9jdXNJbmRleCIsImFuY2hvck9mZiIsImZvY3VzT2ZmIiwiZm9yRWFjaCIsInJhbmdlIiwiaSIsInJhbmdlcyIsImxlbmd0aCIsInRleHQiLCJhbmNob3JTcGFuIiwicXVlcnlTZWxlY3RvciIsImZvY3VzU3BhbiIsImFuY2hvckVsIiwiZm9jdXNFbCIsImZvY3VzTm9kZSIsImlzU2VsZWN0aW5nIiwiY3JlYXRlUmFuZ2UiLCJzZXRTdGFydCIsImFkZFJhbmdlIiwic2V0VGltZW91dCIsInRhcmdldCIsImVsIiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwiaXNDb250ZW50RWRpdGFibGUiLCJldmVudCIsImRhdGEiLCJpc0NvcHlpbmciLCJhY3RpdmVFbGVtZW50IiwiaXNDb21wb3NpbmciLCJjb3VudCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInR5cGUiLCJmcmFnbWVudCIsImlzRHJhZ2dpbmciLCJpc0ludGVybmFsRHJhZyIsImRhdGFUcmFuc2ZlciIsIm5hdGl2ZUV2ZW50IiwiZW5jb2RlZCIsInNlcmlhbGl6ZU5vZGUiLCJGUkFHTUVOVCIsInByZXZlbnREZWZhdWx0IiwieCIsInkiLCJjYXJldFJhbmdlRnJvbVBvaW50IiwicmFuZ2VQYXJlbnQiLCJyYW5nZU9mZnNldCIsInN0YXJ0Q29udGFpbmVyIiwic3RhcnRPZmZzZXQiLCJwb2ludCIsImNyZWF0ZSIsIm9mZnNldCIsImlzRm9jdXNlZCIsImVmZmVjdCIsImRyb3BFZmZlY3QiLCJlcnIiLCJpc0ludGVybmFsIiwiaW5kZXgiLCJzdGFydCIsImVuZCIsImRlY29yYXRvcnMiLCJnZXREZXNjZW5kYW50IiwiYmxvY2siLCJnZXRDbG9zZXN0QmxvY2siLCJsYXN0VGV4dCIsImdldExhc3RUZXh0IiwidGV4dENvbnRlbnQiLCJsYXN0Q2hhciIsImNoYXJBdCIsImlzTGFzdFRleHQiLCJpc0xhc3RSYW5nZSIsInNpemUiLCJzbGljZSIsImdldCIsIm1hcmtzIiwiZGVsdGEiLCJhZnRlciIsImNvbGxhcHNlVG9FbmQiLCJtb3ZlIiwiY2hhbmdlIiwic2VsZWN0IiwiZGVsZXRlIiwiaW5zZXJ0VGV4dCIsImFsdEtleSIsImN0cmxLZXkiLCJtZXRhS2V5Iiwic2hpZnRLZXkiLCJ3aGljaCIsImlzU2hpZnRpbmciLCJjb2RlIiwiaXNBbHQiLCJpc0NtZCIsImlzQ3RybCIsImlzTGluZSIsImlzTWV0YSIsImlzTW9kIiwiaXNNb2RBbHQiLCJpc1NoaWZ0IiwiaXNXb3JkIiwiY2xpcGJvYXJkRGF0YSIsImh0bWwiLCJ1bmRlZmluZWQiLCJzZXQiLCJhbmNob3IiLCJwcm9wZXJ0aWVzIiwiaXNCYWNrd2FyZCIsImdldE5vZGUiLCJhbmNob3JJbmxpbmUiLCJnZXRDbG9zZXN0SW5saW5lIiwiZm9jdXNJbmxpbmUiLCJpc1ZvaWQiLCJuZXh0IiwiZ2V0TmV4dFRleHQiLCJtZXJnZSIsIm5vcm1hbGl6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxRQUFRLHFCQUFNLGVBQU4sQ0FBZDs7QUFFQTs7Ozs7O0lBTU1DLE87OztBQTZDSjs7Ozs7O0FBM0NBOzs7Ozs7QUFpREEsbUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxrSEFD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UUFBWCxHQUFzQjJILE1BQUsvSyxHQUEzQjtBQUNBd0ssdUJBQVduSCxXQUFYLEdBQXlCLENBQXpCO0FBQ0Q7QUFDRjs7QUFFRHFDLGFBQUtwRCxTQUFMLEdBQWlCQSxVQUNkMkksS0FEYyxDQUNSVCxVQURRLEVBRWRVLFNBRmMsQ0FFSmhNLFFBRkksQ0FBakI7QUFHRDs7QUFFRGIsVUFBTSxVQUFOLEVBQWtCLEVBQUVvSCxZQUFGLEVBQVNDLFVBQVQsRUFBbEI7QUFDQSxXQUFLbkgsS0FBTCxDQUFXeUMsUUFBWCxDQUFvQnlFLEtBQXBCLEVBQTJCQyxJQUEzQjtBQUNELEc7O09BdUZEcEcsVSxHQUFhLFVBQUNDLElBQUQsRUFBVTtBQUFBLGtCQUN1QixPQUFLaEIsS0FENUI7QUFBQSxRQUNia0QsTUFEYSxXQUNiQSxNQURhO0FBQUEsUUFDTDdDLFFBREssV0FDTEEsUUFESztBQUFBLFFBQ0tnRCxNQURMLFdBQ0tBLE1BREw7QUFBQSxRQUNhL0MsS0FEYixXQUNhQSxLQURiOzs7QUFHckIsV0FDRTtBQUNFLFdBQUtVLEtBQUtTLEdBRFo7QUFFRSxhQUFPLElBRlQ7QUFHRSxZQUFNVCxJQUhSO0FBSUUsY0FBUVYsTUFBTUssUUFKaEI7QUFLRSxjQUFRMEMsTUFMVjtBQU1FLGFBQU8vQyxLQU5UO0FBT0UsY0FBUTRDLE1BUFY7QUFRRSxnQkFBVTdDO0FBUlosTUFERjtBQVlELEc7OztrQkFVWU4sTyIsImZpbGUiOiJjb250ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSAnZ2V0LXdpbmRvdydcbmltcG9ydCBrZXljb2RlIGZyb20gJ2tleWNvZGUnXG5cbmltcG9ydCBUUkFOU0ZFUl9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvdHJhbnNmZXItdHlwZXMnXG5pbXBvcnQgQmFzZTY0IGZyb20gJy4uL3NlcmlhbGl6ZXJzL2Jhc2UtNjQnXG5pbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnXG5pbXBvcnQgU2VsZWN0aW9uIGZyb20gJy4uL21vZGVscy9zZWxlY3Rpb24nXG5pbXBvcnQgU2xhdGVUeXBlcyBmcm9tICcuLi91dGlscy9wcm9wLXR5cGVzJ1xuaW1wb3J0IGV4dGVuZFNlbGVjdGlvbiBmcm9tICcuLi91dGlscy9leHRlbmQtc2VsZWN0aW9uJ1xuaW1wb3J0IGZpbmRDbG9zZXN0Tm9kZSBmcm9tICcuLi91dGlscy9maW5kLWNsb3Nlc3Qtbm9kZSdcbmltcG9ydCBmaW5kRGVlcGVzdE5vZGUgZnJvbSAnLi4vdXRpbHMvZmluZC1kZWVwZXN0LW5vZGUnXG5pbXBvcnQgZ2V0SHRtbEZyb21OYXRpdmVQYXN0ZSBmcm9tICcuLi91dGlscy9nZXQtaHRtbC1mcm9tLW5hdGl2ZS1wYXN0ZSdcbmltcG9ydCBnZXRQb2ludCBmcm9tICcuLi91dGlscy9nZXQtcG9pbnQnXG5pbXBvcnQgZ2V0VHJhbnNmZXJEYXRhIGZyb20gJy4uL3V0aWxzL2dldC10cmFuc2Zlci1kYXRhJ1xuaW1wb3J0IHNldFRyYW5zZmVyRGF0YSBmcm9tICcuLi91dGlscy9zZXQtdHJhbnNmZXItZGF0YSdcbmltcG9ydCB7IElTX0ZJUkVGT1gsIElTX01BQywgSVNfSUUgfSBmcm9tICcuLi9jb25zdGFudHMvZW52aXJvbm1lbnQnXG5cbi8qKlxuICogRGVidWcuXG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ3NsYXRlOmNvbnRlbnQnKVxuXG4vKipcbiAqIENvbnRlbnQuXG4gKlxuICogQHR5cGUge0NvbXBvbmVudH1cbiAqL1xuXG5jbGFzcyBDb250ZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAvKipcbiAgICogUHJvcGVydHkgdHlwZXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYXV0b0NvcnJlY3Q6IFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBhdXRvRm9jdXM6IFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWU6IFR5cGVzLnN0cmluZyxcbiAgICBlZGl0b3I6IFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uQmVmb3JlSW5wdXQ6IFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkJsdXI6IFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkNvcHk6IFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkN1dDogVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRHJvcDogVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRm9jdXM6IFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbktleURvd246IFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbktleVVwOiBUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25QYXN0ZTogVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uU2VsZWN0OiBUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVhZE9ubHk6IFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICByb2xlOiBUeXBlcy5zdHJpbmcsXG4gICAgc2NoZW1hOiBTbGF0ZVR5cGVzLnNjaGVtYS5pc1JlcXVpcmVkLFxuICAgIHNwZWxsQ2hlY2s6IFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzdGF0ZTogU2xhdGVUeXBlcy5zdGF0ZS5pc1JlcXVpcmVkLFxuICAgIHN0eWxlOiBUeXBlcy5vYmplY3QsXG4gICAgdGFiSW5kZXg6IFR5cGVzLm51bWJlcixcbiAgICB0YWdOYW1lOiBUeXBlcy5zdHJpbmcsXG4gIH1cblxuICAvKipcbiAgICogRGVmYXVsdCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHN0eWxlOiB7fSxcbiAgICB0YWdOYW1lOiAnZGl2JyxcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAqL1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy50bXAgPSB7fVxuICAgIHRoaXMudG1wLmNvbXBvc2l0aW9ucyA9IDBcbiAgICB0aGlzLnRtcC5mb3JjZXMgPSAwXG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIHRoZSBjb21wb25lbnQgdXBkYXRlP1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSA9IChwcm9wcywgc3RhdGUpID0+IHtcbiAgICAvLyBJZiB0aGUgcmVhZE9ubHkgc3RhdGUgaGFzIGNoYW5nZWQsIHdlIG5lZWQgdG8gcmUtcmVuZGVyIHNvIHRoYXRcbiAgICAvLyB0aGUgY3Vyc29yIHdpbGwgYmUgYWRkZWQgb3IgcmVtb3ZlZCBhZ2Fpbi5cbiAgICBpZiAocHJvcHMucmVhZE9ubHkgIT0gdGhpcy5wcm9wcy5yZWFkT25seSkgcmV0dXJuIHRydWVcblxuICAgIC8vIElmIHRoZSBzdGF0ZSBoYXMgYmVlbiBjaGFuZ2VkIG5hdGl2ZWx5LCBuZXZlciByZS1yZW5kZXIsIG9yIGVsc2Ugd2UnbGxcbiAgICAvLyBlbmQgdXAgZHVwbGljYXRpbmcgY29udGVudC5cbiAgICBpZiAocHJvcHMuc3RhdGUuaXNOYXRpdmUpIHJldHVybiBmYWxzZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIHByb3BzLmNsYXNzTmFtZSAhPSB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fFxuICAgICAgcHJvcHMuc2NoZW1hICE9IHRoaXMucHJvcHMuc2NoZW1hIHx8XG4gICAgICBwcm9wcy5hdXRvQ29ycmVjdCAhPSB0aGlzLnByb3BzLmF1dG9Db3JyZWN0IHx8XG4gICAgICBwcm9wcy5zcGVsbENoZWNrICE9IHRoaXMucHJvcHMuc3BlbGxDaGVjayB8fFxuICAgICAgcHJvcHMuc3RhdGUgIT0gdGhpcy5wcm9wcy5zdGF0ZSB8fFxuICAgICAgcHJvcHMuc3R5bGUgIT0gdGhpcy5wcm9wcy5zdHlsZVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBlZGl0b3IgZmlyc3QgbW91bnRzIGluIHRoZSBET00gd2UgbmVlZCB0bzpcbiAgICpcbiAgICogICAtIFVwZGF0ZSB0aGUgc2VsZWN0aW9uLCBpbiBjYXNlIGl0IHN0YXJ0cyBmb2N1c2VkLlxuICAgKiAgIC0gRm9jdXMgdGhlIGVkaXRvciBpZiBgYXV0b0ZvY3VzYCBpcyBzZXQuXG4gICAqL1xuXG4gIGNvbXBvbmVudERpZE1vdW50ID0gKCkgPT4ge1xuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uKClcblxuICAgIGlmICh0aGlzLnByb3BzLmF1dG9Gb2N1cykge1xuICAgICAgdGhpcy5lbGVtZW50LmZvY3VzKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gdXBkYXRlLCB1cGRhdGUgdGhlIHNlbGVjdGlvbi5cbiAgICovXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlID0gKCkgPT4ge1xuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uKClcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIG5hdGl2ZSBET00gc2VsZWN0aW9uIHRvIHJlZmxlY3QgdGhlIGludGVybmFsIG1vZGVsLlxuICAgKi9cblxuICB1cGRhdGVTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3QgeyBlZGl0b3IsIHN0YXRlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBkb2N1bWVudCwgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdyh0aGlzLmVsZW1lbnQpXG4gICAgY29uc3QgbmF0aXZlID0gd2luZG93LmdldFNlbGVjdGlvbigpXG5cbiAgICAvLyBJZiBib3RoIHNlbGVjdGlvbnMgYXJlIGJsdXJyZWQsIGRvIG5vdGhpbmcuXG4gICAgaWYgKCFuYXRpdmUucmFuZ2VDb3VudCAmJiBzZWxlY3Rpb24uaXNCbHVycmVkKSByZXR1cm5cblxuICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gaGFzIGJlZW4gYmx1cnJlZCwgYnV0IGlzIHN0aWxsIGluc2lkZSB0aGUgZWRpdG9yIGluIHRoZVxuICAgIC8vIERPTSwgYmx1ciBpdCBtYW51YWxseS5cbiAgICBpZiAoc2VsZWN0aW9uLmlzQmx1cnJlZCkge1xuICAgICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IobmF0aXZlLmFuY2hvck5vZGUpKSByZXR1cm5cbiAgICAgIG5hdGl2ZS5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgdGhpcy5lbGVtZW50LmJsdXIoKVxuICAgICAgZGVidWcoJ3VwZGF0ZVNlbGVjdGlvbicsIHsgc2VsZWN0aW9uLCBuYXRpdmUgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgZmlndXJlIG91dCB3aGljaCBET00gbm9kZXMgc2hvdWxkIGJlIHNlbGVjdGVkLi4uXG4gICAgY29uc3QgeyBhbmNob3JUZXh0LCBmb2N1c1RleHQgfSA9IHN0YXRlXG4gICAgY29uc3QgeyBhbmNob3JLZXksIGFuY2hvck9mZnNldCwgZm9jdXNLZXksIGZvY3VzT2Zmc2V0IH0gPSBzZWxlY3Rpb25cbiAgICBjb25zdCBzY2hlbWEgPSBlZGl0b3IuZ2V0U2NoZW1hKClcbiAgICBjb25zdCBhbmNob3JEZWNvcmF0b3JzID0gZG9jdW1lbnQuZ2V0RGVzY2VuZGFudERlY29yYXRvcnMoYW5jaG9yS2V5LCBzY2hlbWEpXG4gICAgY29uc3QgZm9jdXNEZWNvcmF0b3JzID0gZG9jdW1lbnQuZ2V0RGVzY2VuZGFudERlY29yYXRvcnMoZm9jdXNLZXksIHNjaGVtYSlcbiAgICBjb25zdCBhbmNob3JSYW5nZXMgPSBhbmNob3JUZXh0LmdldFJhbmdlcyhhbmNob3JEZWNvcmF0b3JzKVxuICAgIGNvbnN0IGZvY3VzUmFuZ2VzID0gZm9jdXNUZXh0LmdldFJhbmdlcyhmb2N1c0RlY29yYXRvcnMpXG4gICAgbGV0IGEgPSAwXG4gICAgbGV0IGYgPSAwXG4gICAgbGV0IGFuY2hvckluZGV4XG4gICAgbGV0IGZvY3VzSW5kZXhcbiAgICBsZXQgYW5jaG9yT2ZmXG4gICAgbGV0IGZvY3VzT2ZmXG5cbiAgICBhbmNob3JSYW5nZXMuZm9yRWFjaCgocmFuZ2UsIGksIHJhbmdlcykgPT4ge1xuICAgICAgY29uc3QgeyBsZW5ndGggfSA9IHJhbmdlLnRleHRcbiAgICAgIGEgKz0gbGVuZ3RoXG4gICAgICBpZiAoYSA8IGFuY2hvck9mZnNldCkgcmV0dXJuXG4gICAgICBhbmNob3JJbmRleCA9IGlcbiAgICAgIGFuY2hvck9mZiA9IGFuY2hvck9mZnNldCAtIChhIC0gbGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSlcblxuICAgIGZvY3VzUmFuZ2VzLmZvckVhY2goKHJhbmdlLCBpLCByYW5nZXMpID0+IHtcbiAgICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSByYW5nZS50ZXh0XG4gICAgICBmICs9IGxlbmd0aFxuICAgICAgaWYgKGYgPCBmb2N1c09mZnNldCkgcmV0dXJuXG4gICAgICBmb2N1c0luZGV4ID0gaVxuICAgICAgZm9jdXNPZmYgPSBmb2N1c09mZnNldCAtIChmIC0gbGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSlcblxuICAgIGNvbnN0IGFuY2hvclNwYW4gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtb2Zmc2V0LWtleT1cIiR7YW5jaG9yS2V5fS0ke2FuY2hvckluZGV4fVwiXWApXG4gICAgY29uc3QgZm9jdXNTcGFuID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLW9mZnNldC1rZXk9XCIke2ZvY3VzS2V5fS0ke2ZvY3VzSW5kZXh9XCJdYClcbiAgICBjb25zdCBhbmNob3JFbCA9IGZpbmREZWVwZXN0Tm9kZShhbmNob3JTcGFuKVxuICAgIGNvbnN0IGZvY3VzRWwgPSBmaW5kRGVlcGVzdE5vZGUoZm9jdXNTcGFuKVxuXG4gICAgLy8gSWYgdGhleSBhcmUgYWxyZWFkeSBzZWxlY3RlZCwgZG8gbm90aGluZy5cbiAgICBpZiAoXG4gICAgICBhbmNob3JFbCA9PSBuYXRpdmUuYW5jaG9yTm9kZSAmJlxuICAgICAgYW5jaG9yT2ZmID09IG5hdGl2ZS5hbmNob3JPZmZzZXQgJiZcbiAgICAgIGZvY3VzRWwgPT0gbmF0aXZlLmZvY3VzTm9kZSAmJlxuICAgICAgZm9jdXNPZmYgPT0gbmF0aXZlLmZvY3VzT2Zmc2V0XG4gICAgKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHNldCB0aGUgYGlzU2VsZWN0aW5nYCBmbGFnIGFuZCB1cGRhdGUgdGhlIHNlbGVjdGlvbi5cbiAgICB0aGlzLnRtcC5pc1NlbGVjdGluZyA9IHRydWVcbiAgICBuYXRpdmUucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBjb25zdCByYW5nZSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgcmFuZ2Uuc2V0U3RhcnQoYW5jaG9yRWwsIGFuY2hvck9mZilcbiAgICBuYXRpdmUuYWRkUmFuZ2UocmFuZ2UpXG4gICAgZXh0ZW5kU2VsZWN0aW9uKG5hdGl2ZSwgZm9jdXNFbCwgZm9jdXNPZmYpXG5cbiAgICAvLyBUaGVuIHVuc2V0IHRoZSBgaXNTZWxlY3RpbmdgIGZsYWcgYWZ0ZXIgYSBkZWxheS5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIENPTVBBVDogSW4gRmlyZWZveCwgaXQncyBub3QgZW5vdWdoIHRvIGNyZWF0ZSBhIHJhbmdlLCB5b3UgYWxzbyBuZWVkIHRvXG4gICAgICAvLyBmb2N1cyB0aGUgY29udGVudGVkaXRhYmxlIGVsZW1lbnQgdG9vLiAoMjAxNi8xMS8xNilcbiAgICAgIGlmIChJU19GSVJFRk9YKSB0aGlzLmVsZW1lbnQuZm9jdXMoKVxuICAgICAgdGhpcy50bXAuaXNTZWxlY3RpbmcgPSBmYWxzZVxuICAgIH0pXG5cbiAgICBkZWJ1ZygndXBkYXRlU2VsZWN0aW9uJywgeyBzZWxlY3Rpb24sIG5hdGl2ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBSZWFjdCByZWYgbWV0aG9kIHRvIHNldCB0aGUgcm9vdCBjb250ZW50IGVsZW1lbnQgbG9jYWxseS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBuXG4gICAqL1xuXG4gIHJlZiA9IChlbGVtZW50KSA9PiB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFuIGV2ZW50IGB0YXJnZXRgIGlzIGZpcmVkIGZyb20gd2l0aGluIHRoZSBjb250ZW50ZWRpdGFibGVcbiAgICogZWxlbWVudC4gVGhpcyBzaG91bGQgYmUgZmFsc2UgZm9yIGVkaXRzIGhhcHBlbmluZyBpbiBub24tY29udGVudGVkaXRhYmxlXG4gICAqIGNoaWxkcmVuLCBzdWNoIGFzIHZvaWQgbm9kZXMgYW5kIG90aGVyIG5lc3RlZCBTbGF0ZSBlZGl0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBpc0luRWRpdG9yID0gKHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IHsgZWxlbWVudCB9ID0gdGhpc1xuICAgIC8vIENPTVBBVDogVGV4dCBub2RlcyBkb24ndCBoYXZlIGBpc0NvbnRlbnRFZGl0YWJsZWAgcHJvcGVydHkuIFNvLCB3aGVuXG4gICAgLy8gYHRhcmdldGAgaXMgYSB0ZXh0IG5vZGUgdXNlIGl0cyBwYXJlbnQgbm9kZSBmb3IgY2hlY2suXG4gICAgY29uc3QgZWwgPSB0YXJnZXQubm9kZVR5cGUgPT09IDMgPyB0YXJnZXQucGFyZW50Tm9kZSA6IHRhcmdldFxuICAgIHJldHVybiAoXG4gICAgICAoZWwuaXNDb250ZW50RWRpdGFibGUpICYmXG4gICAgICAoZWwgPT09IGVsZW1lbnQgfHwgZmluZENsb3Nlc3ROb2RlKGVsLCAnW2RhdGEtc2xhdGUtZWRpdG9yXScpID09PSBlbGVtZW50KVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBiZWZvcmUgaW5wdXQsIGJ1YmJsZSB1cC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25CZWZvcmVJbnB1dCA9IChldmVudCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnJlYWRPbmx5KSByZXR1cm5cbiAgICBpZiAoIXRoaXMuaXNJbkVkaXRvcihldmVudC50YXJnZXQpKSByZXR1cm5cblxuICAgIGNvbnN0IGRhdGEgPSB7fVxuXG4gICAgZGVidWcoJ29uQmVmb3JlSW5wdXQnLCB7IGV2ZW50LCBkYXRhIH0pXG4gICAgdGhpcy5wcm9wcy5vbkJlZm9yZUlucHV0KGV2ZW50LCBkYXRhKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGJsdXIsIHVwZGF0ZSB0aGUgc2VsZWN0aW9uIHRvIGJlIG5vdCBmb2N1c2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkJsdXIgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZWFkT25seSkgcmV0dXJuXG4gICAgaWYgKHRoaXMudG1wLmlzQ29weWluZykgcmV0dXJuXG4gICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IoZXZlbnQudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICAvLyBJZiB0aGUgYWN0aXZlIGVsZW1lbnQgaXMgc3RpbGwgdGhlIGVkaXRvciwgdGhlIGJsdXIgZXZlbnQgaXMgZHVlIHRvIHRoZVxuICAgIC8vIHdpbmRvdyBpdHNlbGYgYmVpbmcgYmx1cnJlZCAoZWcuIHdoZW4gY2hhbmdpbmcgdGFicykgc28gd2Ugc2hvdWxkIGlnbm9yZVxuICAgIC8vIHRoZSBldmVudCwgc2luY2Ugd2Ugd2FudCB0byBtYWludGFpbiBmb2N1cyB3aGVuIHJldHVybmluZy5cbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3codGhpcy5lbGVtZW50KVxuICAgIGlmICh3aW5kb3cuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSB0aGlzLmVsZW1lbnQpIHJldHVyblxuXG4gICAgY29uc3QgZGF0YSA9IHt9XG5cbiAgICBkZWJ1Zygnb25CbHVyJywgeyBldmVudCwgZGF0YSB9KVxuICAgIHRoaXMucHJvcHMub25CbHVyKGV2ZW50LCBkYXRhKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGZvY3VzLCB1cGRhdGUgdGhlIHNlbGVjdGlvbiB0byBiZSBmb2N1c2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkZvY3VzID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVhZE9ubHkpIHJldHVyblxuICAgIGlmICh0aGlzLnRtcC5pc0NvcHlpbmcpIHJldHVyblxuICAgIGlmICghdGhpcy5pc0luRWRpdG9yKGV2ZW50LnRhcmdldCkpIHJldHVyblxuXG4gICAgLy8gQ09NUEFUOiBJZiB0aGUgZWRpdG9yIGhhcyBuZXN0ZWQgZWRpdGFibGUgZWxlbWVudHMsIHRoZSBmb2N1cyBjYW4gZ28gdG9cbiAgICAvLyB0aG9zZSBlbGVtZW50cy4gSW4gRmlyZWZveCwgdGhpcyBtdXN0IGJlIHByZXZlbnRlZCBiZWNhdXNlIGl0IHJlc3VsdHMgaW5cbiAgICAvLyBpc3N1ZXMgd2l0aCBrZXlib2FyZCBuYXZpZ2F0aW9uLiAoMjAxNy8wMy8zMClcbiAgICBpZiAoSVNfRklSRUZPWCAmJiBldmVudC50YXJnZXQgIT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQuZm9jdXMoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHt9XG5cbiAgICBkZWJ1Zygnb25Gb2N1cycsIHsgZXZlbnQsIGRhdGEgfSlcbiAgICB0aGlzLnByb3BzLm9uRm9jdXMoZXZlbnQsIGRhdGEpXG4gIH1cblxuICAvKipcbiAgICogT24gY29tcG9zaXRpb24gc3RhcnQsIHNldCB0aGUgYGlzQ29tcG9zaW5nYCBmbGFnLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkNvbXBvc2l0aW9uU3RhcnQgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuaXNJbkVkaXRvcihldmVudC50YXJnZXQpKSByZXR1cm5cblxuICAgIHRoaXMudG1wLmlzQ29tcG9zaW5nID0gdHJ1ZVxuICAgIHRoaXMudG1wLmNvbXBvc2l0aW9ucysrXG5cbiAgICBkZWJ1Zygnb25Db21wb3NpdGlvblN0YXJ0JywgeyBldmVudCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGNvbXBvc2l0aW9uIGVuZCwgcmVtb3ZlIHRoZSBgaXNDb21wb3NpbmdgIGZsYWcgb24gdGhlIG5leHQgdGljay4gQWxzb1xuICAgKiBpbmNyZW1lbnQgdGhlIGBmb3JjZXNgIGtleSwgd2hpY2ggd2lsbCBmb3JjZSB0aGUgY29udGVudGVkaXRhYmxlIGVsZW1lbnRcbiAgICogdG8gY29tcGxldGVseSByZS1yZW5kZXIsIHNpbmNlIElNRSBwdXRzIFJlYWN0IGluIGFuIHVucmVjb25jaWxhYmxlIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkNvbXBvc2l0aW9uRW5kID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IoZXZlbnQudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICB0aGlzLnRtcC5mb3JjZXMrK1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy50bXAuY29tcG9zaXRpb25zXG5cbiAgICAvLyBUaGUgYGNvdW50YCBjaGVjayBoZXJlIGVuc3VyZXMgdGhhdCBpZiBhbm90aGVyIGNvbXBvc2l0aW9uIHN0YXJ0c1xuICAgIC8vIGJlZm9yZSB0aGUgdGltZW91dCBoYXMgY2xvc2VkIG91dCB0aGlzIG9uZSwgd2Ugd2lsbCBhYm9ydCB1bnNldHRpbmcgdGhlXG4gICAgLy8gYGlzQ29tcG9zaW5nYCBmbGFnLCBzaW5jZSBhIGNvbXBvc2l0aW9uIGluIHN0aWxsIGluIGFmZmVjdC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnRtcC5jb21wb3NpdGlvbnMgPiBjb3VudCkgcmV0dXJuXG4gICAgICB0aGlzLnRtcC5pc0NvbXBvc2luZyA9IGZhbHNlXG4gICAgfSlcblxuICAgIGRlYnVnKCdvbkNvbXBvc2l0aW9uRW5kJywgeyBldmVudCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGNvcHksIGRlZmVyIHRvIGBvbkN1dENvcHlgLCB0aGVuIGJ1YmJsZSB1cC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25Db3B5ID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IoZXZlbnQudGFyZ2V0KSkgcmV0dXJuXG4gICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KGV2ZW50LnRhcmdldClcblxuICAgIHRoaXMudG1wLmlzQ29weWluZyA9IHRydWVcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMudG1wLmlzQ29weWluZyA9IGZhbHNlXG4gICAgfSlcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBkYXRhID0ge31cbiAgICBkYXRhLnR5cGUgPSAnZnJhZ21lbnQnXG4gICAgZGF0YS5mcmFnbWVudCA9IHN0YXRlLmZyYWdtZW50XG5cbiAgICBkZWJ1Zygnb25Db3B5JywgeyBldmVudCwgZGF0YSB9KVxuICAgIHRoaXMucHJvcHMub25Db3B5KGV2ZW50LCBkYXRhKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGN1dCwgZGVmZXIgdG8gYG9uQ3V0Q29weWAsIHRoZW4gYnViYmxlIHVwLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkN1dCA9IChldmVudCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnJlYWRPbmx5KSByZXR1cm5cbiAgICBpZiAoIXRoaXMuaXNJbkVkaXRvcihldmVudC50YXJnZXQpKSByZXR1cm5cbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coZXZlbnQudGFyZ2V0KVxuXG4gICAgdGhpcy50bXAuaXNDb3B5aW5nID0gdHJ1ZVxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy50bXAuaXNDb3B5aW5nID0gZmFsc2VcbiAgICB9KVxuXG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGRhdGEgPSB7fVxuICAgIGRhdGEudHlwZSA9ICdmcmFnbWVudCdcbiAgICBkYXRhLmZyYWdtZW50ID0gc3RhdGUuZnJhZ21lbnRcblxuICAgIGRlYnVnKCdvbkN1dCcsIHsgZXZlbnQsIGRhdGEgfSlcbiAgICB0aGlzLnByb3BzLm9uQ3V0KGV2ZW50LCBkYXRhKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGRyYWcgZW5kLCB1bnNldCB0aGUgYGlzRHJhZ2dpbmdgIGZsYWcuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqL1xuXG4gIG9uRHJhZ0VuZCA9IChldmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5pc0luRWRpdG9yKGV2ZW50LnRhcmdldCkpIHJldHVyblxuXG4gICAgdGhpcy50bXAuaXNEcmFnZ2luZyA9IGZhbHNlXG4gICAgdGhpcy50bXAuaXNJbnRlcm5hbERyYWcgPSBudWxsXG5cbiAgICBkZWJ1Zygnb25EcmFnRW5kJywgeyBldmVudCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGRyYWcgb3Zlciwgc2V0IHRoZSBgaXNEcmFnZ2luZ2AgZmxhZyBhbmQgdGhlIGBpc0ludGVybmFsRHJhZ2AgZmxhZy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25EcmFnT3ZlciA9IChldmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5pc0luRWRpdG9yKGV2ZW50LnRhcmdldCkpIHJldHVyblxuICAgIGlmICh0aGlzLnRtcC5pc0RyYWdnaW5nKSByZXR1cm5cbiAgICB0aGlzLnRtcC5pc0RyYWdnaW5nID0gdHJ1ZVxuICAgIHRoaXMudG1wLmlzSW50ZXJuYWxEcmFnID0gZmFsc2VcblxuICAgIGRlYnVnKCdvbkRyYWdPdmVyJywgeyBldmVudCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGRyYWcgc3RhcnQsIHNldCB0aGUgYGlzRHJhZ2dpbmdgIGZsYWcgYW5kIHRoZSBgaXNJbnRlcm5hbERyYWdgIGZsYWcuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqL1xuXG4gIG9uRHJhZ1N0YXJ0ID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IoZXZlbnQudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICB0aGlzLnRtcC5pc0RyYWdnaW5nID0gdHJ1ZVxuICAgIHRoaXMudG1wLmlzSW50ZXJuYWxEcmFnID0gdHJ1ZVxuICAgIGNvbnN0IHsgZGF0YVRyYW5zZmVyIH0gPSBldmVudC5uYXRpdmVFdmVudFxuICAgIGNvbnN0IGRhdGEgPSBnZXRUcmFuc2ZlckRhdGEoZGF0YVRyYW5zZmVyKVxuXG4gICAgLy8gSWYgaXQncyBhIG5vZGUgYmVpbmcgZHJhZ2dlZCwgdGhlIGRhdGEgdHlwZSBpcyBhbHJlYWR5IHNldC5cbiAgICBpZiAoZGF0YS50eXBlID09ICdub2RlJykgcmV0dXJuXG5cbiAgICBjb25zdCB7IHN0YXRlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBmcmFnbWVudCB9ID0gc3RhdGVcbiAgICBjb25zdCBlbmNvZGVkID0gQmFzZTY0LnNlcmlhbGl6ZU5vZGUoZnJhZ21lbnQpXG5cbiAgICBzZXRUcmFuc2ZlckRhdGEoZGF0YVRyYW5zZmVyLCBUUkFOU0ZFUl9UWVBFUy5GUkFHTUVOVCwgZW5jb2RlZClcblxuICAgIGRlYnVnKCdvbkRyYWdTdGFydCcsIHsgZXZlbnQgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBkcm9wLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbkRyb3AgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZWFkT25seSkgcmV0dXJuXG4gICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IoZXZlbnQudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coZXZlbnQudGFyZ2V0KVxuICAgIGNvbnN0IHsgc3RhdGUsIGVkaXRvciB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgbmF0aXZlRXZlbnQgfSA9IGV2ZW50XG4gICAgY29uc3QgeyBkYXRhVHJhbnNmZXIsIHgsIHkgfSA9IG5hdGl2ZUV2ZW50XG4gICAgY29uc3QgZGF0YSA9IGdldFRyYW5zZmVyRGF0YShkYXRhVHJhbnNmZXIpXG5cbiAgICAvLyBSZXNvbHZlIHRoZSBwb2ludCB3aGVyZSB0aGUgZHJvcCBvY2N1cmVkLlxuICAgIGxldCByYW5nZVxuXG4gICAgLy8gQ09NUEFUOiBJbiBGaXJlZm94LCBgY2FyZXRSYW5nZUZyb21Qb2ludGAgZG9lc24ndCBleGlzdC4gKDIwMTYvMDcvMjUpXG4gICAgaWYgKHdpbmRvdy5kb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KSB7XG4gICAgICByYW5nZSA9IHdpbmRvdy5kb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KHgsIHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJhbmdlID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgICAgIHJhbmdlLnNldFN0YXJ0KG5hdGl2ZUV2ZW50LnJhbmdlUGFyZW50LCBuYXRpdmVFdmVudC5yYW5nZU9mZnNldClcbiAgICB9XG5cbiAgICBjb25zdCB7IHN0YXJ0Q29udGFpbmVyLCBzdGFydE9mZnNldCB9ID0gcmFuZ2VcbiAgICBjb25zdCBwb2ludCA9IGdldFBvaW50KHN0YXJ0Q29udGFpbmVyLCBzdGFydE9mZnNldCwgc3RhdGUsIGVkaXRvcilcbiAgICBpZiAoIXBvaW50KSByZXR1cm5cblxuICAgIGNvbnN0IHRhcmdldCA9IFNlbGVjdGlvbi5jcmVhdGUoe1xuICAgICAgYW5jaG9yS2V5OiBwb2ludC5rZXksXG4gICAgICBhbmNob3JPZmZzZXQ6IHBvaW50Lm9mZnNldCxcbiAgICAgIGZvY3VzS2V5OiBwb2ludC5rZXksXG4gICAgICBmb2N1c09mZnNldDogcG9pbnQub2Zmc2V0LFxuICAgICAgaXNGb2N1c2VkOiB0cnVlXG4gICAgfSlcblxuICAgIC8vIEFkZCBkcm9wLXNwZWNpZmljIGluZm9ybWF0aW9uIHRvIHRoZSBkYXRhLlxuICAgIGRhdGEudGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICAvLyBDT01QQVQ6IEVkZ2UgdGhyb3dzIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvcnMgd2hlblxuICAgIC8vIGFjY2Vzc2luZyBgZHJvcEVmZmVjdGAgb3IgYGVmZmVjdEFsbG93ZWRgICgyMDE3LzcvMTIpXG4gICAgdHJ5IHtcbiAgICAgIGRhdGEuZWZmZWN0ID0gZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3RcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGRhdGEuZWZmZWN0ID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChkYXRhLnR5cGUgPT0gJ2ZyYWdtZW50JyB8fCBkYXRhLnR5cGUgPT0gJ25vZGUnKSB7XG4gICAgICBkYXRhLmlzSW50ZXJuYWwgPSB0aGlzLnRtcC5pc0ludGVybmFsRHJhZ1xuICAgIH1cblxuICAgIGRlYnVnKCdvbkRyb3AnLCB7IGV2ZW50LCBkYXRhIH0pXG4gICAgdGhpcy5wcm9wcy5vbkRyb3AoZXZlbnQsIGRhdGEpXG4gIH1cblxuICAvKipcbiAgICogT24gaW5wdXQsIGhhbmRsZSBzcGVsbGNoZWNrIGFuZCBvdGhlciBzaW1pbGFyIGVkaXRzIHRoYXQgZG9uJ3QgZ28gdHJpZ2dlclxuICAgKiB0aGUgYG9uQmVmb3JlSW5wdXRgIGFuZCBpbnN0ZWFkIHVwZGF0ZSB0aGUgRE9NIGRpcmVjdGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKi9cblxuICBvbklucHV0ID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMudG1wLmlzQ29tcG9zaW5nKSByZXR1cm5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGF0ZS5pc0JsdXJyZWQpIHJldHVyblxuICAgIGlmICghdGhpcy5pc0luRWRpdG9yKGV2ZW50LnRhcmdldCkpIHJldHVyblxuICAgIGRlYnVnKCdvbklucHV0JywgeyBldmVudCB9KVxuXG4gICAgY29uc3Qgd2luZG93ID0gZ2V0V2luZG93KGV2ZW50LnRhcmdldClcbiAgICBjb25zdCB7IHN0YXRlLCBlZGl0b3IgfSA9IHRoaXMucHJvcHNcblxuICAgIC8vIEdldCB0aGUgc2VsZWN0aW9uIHBvaW50LlxuICAgIGNvbnN0IG5hdGl2ZSA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgIGNvbnN0IHsgYW5jaG9yTm9kZSwgYW5jaG9yT2Zmc2V0IH0gPSBuYXRpdmVcbiAgICBjb25zdCBwb2ludCA9IGdldFBvaW50KGFuY2hvck5vZGUsIGFuY2hvck9mZnNldCwgc3RhdGUsIGVkaXRvcilcbiAgICBpZiAoIXBvaW50KSByZXR1cm5cblxuICAgIC8vIEdldCB0aGUgcmFuZ2UgaW4gcXVlc3Rpb24uXG4gICAgY29uc3QgeyBrZXksIGluZGV4LCBzdGFydCwgZW5kIH0gPSBwb2ludFxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiB9ID0gc3RhdGVcbiAgICBjb25zdCBzY2hlbWEgPSBlZGl0b3IuZ2V0U2NoZW1hKClcbiAgICBjb25zdCBkZWNvcmF0b3JzID0gZG9jdW1lbnQuZ2V0RGVzY2VuZGFudERlY29yYXRvcnMoa2V5LCBzY2hlbWEpXG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldERlc2NlbmRhbnQoa2V5KVxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKG5vZGUua2V5KVxuICAgIGNvbnN0IHJhbmdlcyA9IG5vZGUuZ2V0UmFuZ2VzKGRlY29yYXRvcnMpXG4gICAgY29uc3QgbGFzdFRleHQgPSBibG9jay5nZXRMYXN0VGV4dCgpXG5cbiAgICAvLyBHZXQgdGhlIHRleHQgaW5mb3JtYXRpb24uXG4gICAgbGV0IHsgdGV4dENvbnRlbnQgfSA9IGFuY2hvck5vZGVcbiAgICBjb25zdCBsYXN0Q2hhciA9IHRleHRDb250ZW50LmNoYXJBdCh0ZXh0Q29udGVudC5sZW5ndGggLSAxKVxuICAgIGNvbnN0IGlzTGFzdFRleHQgPSBub2RlID09IGxhc3RUZXh0XG4gICAgY29uc3QgaXNMYXN0UmFuZ2UgPSBpbmRleCA9PSByYW5nZXMuc2l6ZSAtIDFcblxuICAgIC8vIElmIHdlJ3JlIGRlYWxpbmcgd2l0aCB0aGUgbGFzdCBsZWFmLCBhbmQgdGhlIERPTSB0ZXh0IGVuZHMgaW4gYSBuZXcgbGluZSxcbiAgICAvLyB3ZSB3aWxsIGhhdmUgYWRkZWQgYW5vdGhlciBuZXcgbGluZSBpbiA8TGVhZj4ncyByZW5kZXIgbWV0aG9kIHRvIGFjY291bnRcbiAgICAvLyBmb3IgYnJvd3NlcnMgY29sbGFwc2luZyBhIHNpbmdsZSB0cmFpbGluZyBuZXcgbGluZXMsIHNvIHJlbW92ZSBpdC5cbiAgICBpZiAoaXNMYXN0VGV4dCAmJiBpc0xhc3RSYW5nZSAmJiBsYXN0Q2hhciA9PSAnXFxuJykge1xuICAgICAgdGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudC5zbGljZSgwLCAtMSlcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGV4dCBpcyBubyBkaWZmZXJlbnQsIGFib3J0LlxuICAgIGNvbnN0IHJhbmdlID0gcmFuZ2VzLmdldChpbmRleClcbiAgICBjb25zdCB7IHRleHQsIG1hcmtzIH0gPSByYW5nZVxuICAgIGlmICh0ZXh0Q29udGVudCA9PSB0ZXh0KSByZXR1cm5cblxuICAgIC8vIERldGVybWluZSB3aGF0IHRoZSBzZWxlY3Rpb24gc2hvdWxkIGJlIGFmdGVyIGNoYW5naW5nIHRoZSB0ZXh0LlxuICAgIGNvbnN0IGRlbHRhID0gdGV4dENvbnRlbnQubGVuZ3RoIC0gdGV4dC5sZW5ndGhcbiAgICBjb25zdCBhZnRlciA9IHNlbGVjdGlvbi5jb2xsYXBzZVRvRW5kKCkubW92ZShkZWx0YSlcblxuICAgIC8vIENoYW5nZSB0aGUgY3VycmVudCBzdGF0ZSB0byBoYXZlIHRoZSB0ZXh0IHJlcGxhY2VkLlxuICAgIGVkaXRvci5jaGFuZ2UoKGNoYW5nZSkgPT4ge1xuICAgICAgY2hhbmdlXG4gICAgICAgIC5zZWxlY3Qoe1xuICAgICAgICAgIGFuY2hvcktleToga2V5LFxuICAgICAgICAgIGFuY2hvck9mZnNldDogc3RhcnQsXG4gICAgICAgICAgZm9jdXNLZXk6IGtleSxcbiAgICAgICAgICBmb2N1c09mZnNldDogZW5kXG4gICAgICAgIH0pXG4gICAgICAgIC5kZWxldGUoKVxuICAgICAgICAuaW5zZXJ0VGV4dCh0ZXh0Q29udGVudCwgbWFya3MpXG4gICAgICAgIC5zZWxlY3QoYWZ0ZXIpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBrZXkgZG93biwgcHJldmVudCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiBjZXJ0YWluIGNvbW1hbmRzIHRoYXQgd2lsbFxuICAgKiBsZWF2ZSB0aGUgZWRpdG9yIGluIGFuIG91dC1vZi1zeW5jIHN0YXRlLCB0aGVuIGJ1YmJsZSB1cC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25LZXlEb3duID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVhZE9ubHkpIHJldHVyblxuICAgIGlmICghdGhpcy5pc0luRWRpdG9yKGV2ZW50LnRhcmdldCkpIHJldHVyblxuXG4gICAgY29uc3QgeyBhbHRLZXksIGN0cmxLZXksIG1ldGFLZXksIHNoaWZ0S2V5LCB3aGljaCB9ID0gZXZlbnRcbiAgICBjb25zdCBrZXkgPSBrZXljb2RlKHdoaWNoKVxuICAgIGNvbnN0IGRhdGEgPSB7fVxuXG4gICAgLy8gS2VlcCB0cmFjayBvZiBhbiBgaXNTaGlmdGluZ2AgZmxhZywgYmVjYXVzZSBpdCdzIG9mdGVuIHVzZWQgdG8gdHJpZ2dlclxuICAgIC8vIFwiUGFzdGUgYW5kIE1hdGNoIFN0eWxlXCIgY29tbWFuZHMsIGJ1dCBpc24ndCBhdmFpbGFibGUgb24gdGhlIGV2ZW50IGluIGFcbiAgICAvLyBub3JtYWwgcGFzdGUgZXZlbnQuXG4gICAgaWYgKGtleSA9PSAnc2hpZnQnKSB7XG4gICAgICB0aGlzLnRtcC5pc1NoaWZ0aW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIFdoZW4gY29tcG9zaW5nLCB0aGVzZSBjaGFyYWN0ZXJzIGNvbW1pdCB0aGUgY29tcG9zaXRpb24gYnV0IGFsc28gbW92ZSB0aGVcbiAgICAvLyBzZWxlY3Rpb24gYmVmb3JlIHdlJ3JlIGFibGUgdG8gaGFuZGxlIGl0LCBzbyBwcmV2ZW50IHRoZWlyIGRlZmF1bHQsXG4gICAgLy8gc2VsZWN0aW9uLW1vdmluZyBiZWhhdmlvci5cbiAgICBpZiAoXG4gICAgICB0aGlzLnRtcC5pc0NvbXBvc2luZyAmJlxuICAgICAgKGtleSA9PSAnbGVmdCcgfHwga2V5ID09ICdyaWdodCcgfHwga2V5ID09ICd1cCcgfHwga2V5ID09ICdkb3duJylcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIEFkZCBoZWxwZnVsIHByb3BlcnRpZXMgZm9yIGhhbmRsaW5nIGhvdGtleXMgdG8gdGhlIGRhdGEgb2JqZWN0LlxuICAgIGRhdGEuY29kZSA9IHdoaWNoXG4gICAgZGF0YS5rZXkgPSBrZXlcbiAgICBkYXRhLmlzQWx0ID0gYWx0S2V5XG4gICAgZGF0YS5pc0NtZCA9IElTX01BQyA/IG1ldGFLZXkgJiYgIWFsdEtleSA6IGZhbHNlXG4gICAgZGF0YS5pc0N0cmwgPSBjdHJsS2V5ICYmICFhbHRLZXlcbiAgICBkYXRhLmlzTGluZSA9IElTX01BQyA/IG1ldGFLZXkgOiBmYWxzZVxuICAgIGRhdGEuaXNNZXRhID0gbWV0YUtleVxuICAgIGRhdGEuaXNNb2QgPSBJU19NQUMgPyBtZXRhS2V5ICYmICFhbHRLZXkgOiBjdHJsS2V5ICYmICFhbHRLZXlcbiAgICBkYXRhLmlzTW9kQWx0ID0gSVNfTUFDID8gbWV0YUtleSAmJiBhbHRLZXkgOiBjdHJsS2V5ICYmIGFsdEtleVxuICAgIGRhdGEuaXNTaGlmdCA9IHNoaWZ0S2V5XG4gICAgZGF0YS5pc1dvcmQgPSBJU19NQUMgPyBhbHRLZXkgOiBjdHJsS2V5XG5cbiAgICAvLyBUaGVzZSBrZXkgY29tbWFuZHMgaGF2ZSBuYXRpdmUgYmVoYXZpb3IgaW4gY29udGVudGVkaXRhYmxlIGVsZW1lbnRzIHdoaWNoXG4gICAgLy8gd2lsbCBjYXVzZSBvdXIgc3RhdGUgdG8gYmUgb3V0IG9mIHN5bmMsIHNvIHByZXZlbnQgdGhlbS5cbiAgICBpZiAoXG4gICAgICAoa2V5ID09ICdlbnRlcicpIHx8XG4gICAgICAoa2V5ID09ICdiYWNrc3BhY2UnKSB8fFxuICAgICAgKGtleSA9PSAnZGVsZXRlJykgfHxcbiAgICAgIChrZXkgPT0gJ2InICYmIGRhdGEuaXNNb2QpIHx8XG4gICAgICAoa2V5ID09ICdpJyAmJiBkYXRhLmlzTW9kKSB8fFxuICAgICAgKGtleSA9PSAneScgJiYgZGF0YS5pc01vZCkgfHxcbiAgICAgIChrZXkgPT0gJ3onICYmIGRhdGEuaXNNb2QpXG4gICAgKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuXG4gICAgZGVidWcoJ29uS2V5RG93bicsIHsgZXZlbnQsIGRhdGEgfSlcbiAgICB0aGlzLnByb3BzLm9uS2V5RG93bihldmVudCwgZGF0YSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBrZXkgdXAsIHVuc2V0IHRoZSBgaXNTaGlmdGluZ2AgZmxhZy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICovXG5cbiAgb25LZXlVcCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHsgYWx0S2V5LCBjdHJsS2V5LCBtZXRhS2V5LCBzaGlmdEtleSwgd2hpY2ggfSA9IGV2ZW50XG4gICAgY29uc3Qga2V5ID0ga2V5Y29kZSh3aGljaClcbiAgICBjb25zdCBkYXRhID0ge31cblxuICAgIGlmIChrZXkgPT0gJ3NoaWZ0Jykge1xuICAgICAgdGhpcy50bXAuaXNTaGlmdGluZyA9IGZhbHNlXG4gICAgfVxuXG4gICAgLy8gQWRkIGhlbHBmdWwgcHJvcGVydGllcyBmb3IgaGFuZGxpbmcgaG90a2V5cyB0byB0aGUgZGF0YSBvYmplY3QuXG4gICAgZGF0YS5jb2RlID0gd2hpY2hcbiAgICBkYXRhLmtleSA9IGtleVxuICAgIGRhdGEuaXNBbHQgPSBhbHRLZXlcbiAgICBkYXRhLmlzQ21kID0gSVNfTUFDID8gbWV0YUtleSAmJiAhYWx0S2V5IDogZmFsc2VcbiAgICBkYXRhLmlzQ3RybCA9IGN0cmxLZXkgJiYgIWFsdEtleVxuICAgIGRhdGEuaXNMaW5lID0gSVNfTUFDID8gbWV0YUtleSA6IGZhbHNlXG4gICAgZGF0YS5pc01ldGEgPSBtZXRhS2V5XG4gICAgZGF0YS5pc01vZCA9IElTX01BQyA/IG1ldGFLZXkgJiYgIWFsdEtleSA6IGN0cmxLZXkgJiYgIWFsdEtleVxuICAgIGRhdGEuaXNNb2RBbHQgPSBJU19NQUMgPyBtZXRhS2V5ICYmIGFsdEtleSA6IGN0cmxLZXkgJiYgYWx0S2V5XG4gICAgZGF0YS5pc1NoaWZ0ID0gc2hpZnRLZXlcbiAgICBkYXRhLmlzV29yZCA9IElTX01BQyA/IGFsdEtleSA6IGN0cmxLZXlcblxuICAgIGRlYnVnKCdvbktleVVwJywgeyBldmVudCwgZGF0YSB9KVxuICAgIHRoaXMucHJvcHMub25LZXlVcChldmVudCwgZGF0YSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBwYXN0ZSwgZGV0ZXJtaW5lIHRoZSB0eXBlIGFuZCBidWJibGUgdXAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqL1xuXG4gIG9uUGFzdGUgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZWFkT25seSkgcmV0dXJuXG4gICAgaWYgKCF0aGlzLmlzSW5FZGl0b3IoZXZlbnQudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICBjb25zdCBkYXRhID0gZ2V0VHJhbnNmZXJEYXRhKGV2ZW50LmNsaXBib2FyZERhdGEpXG5cbiAgICAvLyBBdHRhY2ggdGhlIGBpc1NoaWZ0YCBmbGFnLCBzbyB0aGF0IHBlb3BsZSBjYW4gdXNlIGl0IHRvIHRyaWdnZXIgXCJQYXN0ZVxuICAgIC8vIGFuZCBNYXRjaCBTdHlsZVwiIGxvZ2ljLlxuICAgIGRhdGEuaXNTaGlmdCA9ICEhdGhpcy50bXAuaXNTaGlmdGluZ1xuICAgIGRlYnVnKCdvblBhc3RlJywgeyBldmVudCwgZGF0YSB9KVxuXG4gICAgLy8gQ09NUEFUOiBJbiBJRSAxMSwgb25seSBwbGFpbiB0ZXh0IGNhbiBiZSByZXRyaWV2ZWQgZnJvbSB0aGUgZXZlbnQnc1xuICAgIC8vIGBjbGlwYm9hcmREYXRhYC4gVG8gZ2V0IEhUTUwsIHVzZSB0aGUgYnJvd3NlcidzIG5hdGl2ZSBwYXN0ZSBhY3Rpb24gd2hpY2hcbiAgICAvLyBjYW4gb25seSBiZSBoYW5kbGVkIHN5bmNocm9ub3VzbHkuICgyMDE3LzA2LzIzKVxuICAgIGlmIChJU19JRSkge1xuICAgICAgLy8gRG8gbm90IHVzZSBgZXZlbnQucHJldmVudERlZmF1bHQoKWAgYXMgd2UgbmVlZCB0aGUgbmF0aXZlIHBhc3RlIGFjdGlvbi5cbiAgICAgIGdldEh0bWxGcm9tTmF0aXZlUGFzdGUoZXZlbnQudGFyZ2V0LCAoaHRtbCkgPT4ge1xuICAgICAgICAvLyBJZiBwYXN0ZWQgSFRNTCBjYW4gYmUgcmV0cmVpdmVkLCBpdCBpcyBhZGRlZCB0byB0aGUgYGRhdGFgIG9iamVjdCxcbiAgICAgICAgLy8gc2V0dGluZyB0aGUgYHR5cGVgIHRvIGBodG1sYC5cbiAgICAgICAgdGhpcy5wcm9wcy5vblBhc3RlKGV2ZW50LCBodG1sID09PSB1bmRlZmluZWQgPyBkYXRhIDogeyAuLi5kYXRhLCBodG1sLCB0eXBlOiAnaHRtbCcgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMucHJvcHMub25QYXN0ZShldmVudCwgZGF0YSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gc2VsZWN0LCB1cGRhdGUgdGhlIGN1cnJlbnQgc3RhdGUncyBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqL1xuXG4gIG9uU2VsZWN0ID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVhZE9ubHkpIHJldHVyblxuICAgIGlmICh0aGlzLnRtcC5pc0NvcHlpbmcpIHJldHVyblxuICAgIGlmICh0aGlzLnRtcC5pc0NvbXBvc2luZykgcmV0dXJuXG4gICAgaWYgKHRoaXMudG1wLmlzU2VsZWN0aW5nKSByZXR1cm5cbiAgICBpZiAoIXRoaXMuaXNJbkVkaXRvcihldmVudC50YXJnZXQpKSByZXR1cm5cblxuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdyhldmVudC50YXJnZXQpXG4gICAgY29uc3QgeyBzdGF0ZSwgZWRpdG9yIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBkb2N1bWVudCwgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuICAgIGNvbnN0IG5hdGl2ZSA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgIGNvbnN0IGRhdGEgPSB7fVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIHJhbmdlcywgdGhlIGVkaXRvciB3YXMgYmx1cnJlZCBuYXRpdmVseS5cbiAgICBpZiAoIW5hdGl2ZS5yYW5nZUNvdW50KSB7XG4gICAgICBkYXRhLnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zZXQoJ2lzRm9jdXNlZCcsIGZhbHNlKVxuICAgICAgZGF0YS5pc05hdGl2ZSA9IHRydWVcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGRldGVybWluZSB0aGUgU2xhdGUgc2VsZWN0aW9uIGZyb20gdGhlIG5hdGl2ZSBvbmUuXG4gICAgZWxzZSB7XG4gICAgICBjb25zdCB7IGFuY2hvck5vZGUsIGFuY2hvck9mZnNldCwgZm9jdXNOb2RlLCBmb2N1c09mZnNldCB9ID0gbmF0aXZlXG4gICAgICBjb25zdCBhbmNob3IgPSBnZXRQb2ludChhbmNob3JOb2RlLCBhbmNob3JPZmZzZXQsIHN0YXRlLCBlZGl0b3IpXG4gICAgICBjb25zdCBmb2N1cyA9IGdldFBvaW50KGZvY3VzTm9kZSwgZm9jdXNPZmZzZXQsIHN0YXRlLCBlZGl0b3IpXG4gICAgICBpZiAoIWFuY2hvciB8fCAhZm9jdXMpIHJldHVyblxuXG4gICAgICAvLyBUaGVyZSBhcmUgc2l0dWF0aW9ucyB3aGVyZSBhIHNlbGVjdCBldmVudCB3aWxsIGZpcmUgd2l0aCBhIG5ldyBuYXRpdmVcbiAgICAgIC8vIHNlbGVjdGlvbiB0aGF0IHJlc29sdmVzIHRvIHRoZSBzYW1lIGludGVybmFsIHBvc2l0aW9uLiBJbiB0aG9zZSBjYXNlc1xuICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byB0cmlnZ2VyIGFueSBjaGFuZ2VzLCBzaW5jZSBvdXIgaW50ZXJuYWwgbW9kZWwgaXNcbiAgICAgIC8vIGFscmVhZHkgdXAgdG8gZGF0ZSwgYnV0IHdlIGRvIHdhbnQgdG8gdXBkYXRlIHRoZSBuYXRpdmUgc2VsZWN0aW9uIGFnYWluXG4gICAgICAvLyB0byBtYWtlIHN1cmUgaXQgaXMgaW4gc3luYy5cbiAgICAgIGlmIChcbiAgICAgICAgYW5jaG9yLmtleSA9PSBzZWxlY3Rpb24uYW5jaG9yS2V5ICYmXG4gICAgICAgIGFuY2hvci5vZmZzZXQgPT0gc2VsZWN0aW9uLmFuY2hvck9mZnNldCAmJlxuICAgICAgICBmb2N1cy5rZXkgPT0gc2VsZWN0aW9uLmZvY3VzS2V5ICYmXG4gICAgICAgIGZvY3VzLm9mZnNldCA9PSBzZWxlY3Rpb24uZm9jdXNPZmZzZXQgJiZcbiAgICAgICAgc2VsZWN0aW9uLmlzRm9jdXNlZFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7XG4gICAgICAgIGFuY2hvcktleTogYW5jaG9yLmtleSxcbiAgICAgICAgYW5jaG9yT2Zmc2V0OiBhbmNob3Iub2Zmc2V0LFxuICAgICAgICBmb2N1c0tleTogZm9jdXMua2V5LFxuICAgICAgICBmb2N1c09mZnNldDogZm9jdXMub2Zmc2V0LFxuICAgICAgICBpc0ZvY3VzZWQ6IHRydWUsXG4gICAgICAgIGlzQmFja3dhcmQ6IG51bGxcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIHNlbGVjdGlvbiBpcyBhdCB0aGUgZW5kIG9mIGEgbm9uLXZvaWQgaW5saW5lIG5vZGUsIGFuZCB0aGVyZSBpc1xuICAgICAgLy8gYSBub2RlIGFmdGVyIGl0LCBwdXQgaXQgaW4gdGhlIG5vZGUgYWZ0ZXIgaW5zdGVhZC5cbiAgICAgIGNvbnN0IGFuY2hvclRleHQgPSBkb2N1bWVudC5nZXROb2RlKGFuY2hvci5rZXkpXG4gICAgICBjb25zdCBmb2N1c1RleHQgPSBkb2N1bWVudC5nZXROb2RlKGZvY3VzLmtleSlcbiAgICAgIGNvbnN0IGFuY2hvcklubGluZSA9IGRvY3VtZW50LmdldENsb3Nlc3RJbmxpbmUoYW5jaG9yLmtleSlcbiAgICAgIGNvbnN0IGZvY3VzSW5saW5lID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdElubGluZShmb2N1cy5rZXkpXG5cbiAgICAgIGlmIChhbmNob3JJbmxpbmUgJiYgIWFuY2hvcklubGluZS5pc1ZvaWQgJiYgYW5jaG9yLm9mZnNldCA9PSBhbmNob3JUZXh0LnRleHQubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKGFuY2hvci5rZXkpXG4gICAgICAgIGNvbnN0IG5leHQgPSBibG9jay5nZXROZXh0VGV4dChhbmNob3Iua2V5KVxuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHByb3BlcnRpZXMuYW5jaG9yS2V5ID0gbmV4dC5rZXlcbiAgICAgICAgICBwcm9wZXJ0aWVzLmFuY2hvck9mZnNldCA9IDBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZm9jdXNJbmxpbmUgJiYgIWZvY3VzSW5saW5lLmlzVm9pZCAmJiBmb2N1cy5vZmZzZXQgPT0gZm9jdXNUZXh0LnRleHQubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdEJsb2NrKGZvY3VzLmtleSlcbiAgICAgICAgY29uc3QgbmV4dCA9IGJsb2NrLmdldE5leHRUZXh0KGZvY3VzLmtleSlcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzLmZvY3VzS2V5ID0gbmV4dC5rZXlcbiAgICAgICAgICBwcm9wZXJ0aWVzLmZvY3VzT2Zmc2V0ID0gMFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRhdGEuc2VsZWN0aW9uID0gc2VsZWN0aW9uXG4gICAgICAgIC5tZXJnZShwcm9wZXJ0aWVzKVxuICAgICAgICAubm9ybWFsaXplKGRvY3VtZW50KVxuICAgIH1cblxuICAgIGRlYnVnKCdvblNlbGVjdCcsIHsgZXZlbnQsIGRhdGEgfSlcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0KGV2ZW50LCBkYXRhKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgZWRpdG9yIGNvbnRlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzIH0gPSB0aGlzXG4gICAgY29uc3QgeyBjbGFzc05hbWUsIHJlYWRPbmx5LCBzdGF0ZSwgdGFiSW5kZXgsIHJvbGUsIHRhZ05hbWUgfSA9IHByb3BzXG4gICAgY29uc3QgQ29udGFpbmVyID0gdGFnTmFtZVxuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gICAgY29uc3QgY2hpbGRyZW4gPSBkb2N1bWVudC5ub2Rlc1xuICAgICAgLm1hcChub2RlID0+IHRoaXMucmVuZGVyTm9kZShub2RlKSlcbiAgICAgIC50b0FycmF5KClcblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBvdXRsaW5lIHN0eWxlcy5cbiAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgIC8vIFByZXNlcnZlIGFkamFjZW50IHdoaXRlc3BhY2UgYW5kIG5ldyBsaW5lcy5cbiAgICAgIHdoaXRlU3BhY2U6ICdwcmUtd3JhcCcsXG4gICAgICAvLyBBbGxvdyB3b3JkcyB0byBicmVhayBpZiB0aGV5IGFyZSB0b28gbG9uZy5cbiAgICAgIHdvcmRXcmFwOiAnYnJlYWstd29yZCcsXG4gICAgICAvLyBDT01QQVQ6IEluIGlPUywgYSBmb3JtYXR0aW5nIG1lbnUgd2l0aCBib2xkLCBpdGFsaWMgYW5kIHVuZGVybGluZVxuICAgICAgLy8gYnV0dG9ucyBpcyBzaG93biB3aGljaCBjYXVzZXMgb3VyIGludGVybmFsIHN0YXRlIHRvIGdldCBvdXQgb2Ygc3luYyBpblxuICAgICAgLy8gd2VpcmQgd2F5cy4gVGhpcyBoaWRlcyB0aGF0LiAoMjAxNi8wNi8yMSlcbiAgICAgIC4uLihyZWFkT25seSA/IHt9IDogeyBXZWJraXRVc2VyTW9kaWZ5OiAncmVhZC13cml0ZS1wbGFpbnRleHQtb25seScgfSksXG4gICAgICAvLyBBbGxvdyBmb3IgcGFzc2VkLWluIHN0eWxlcyB0byBvdmVycmlkZSBhbnl0aGluZy5cbiAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgIH1cblxuICAgIC8vIENPTVBBVDogSW4gRmlyZWZveCwgc3BlbGxjaGVja2luZyBjYW4gcmVtb3ZlIGVudGlyZSB3cmFwcGluZyBlbGVtZW50c1xuICAgIC8vIGluY2x1ZGluZyBpbmxpbmUgb25lcyBsaWtlIGA8YT5gLCB3aGljaCBpcyBqYXJyaW5nIGZvciB0aGUgdXNlciBidXQgYWxzb1xuICAgIC8vIGNhdXNlcyB0aGUgRE9NIHRvIGdldCBpbnRvIGFuIGlycmVjb25jaWxhYmxlIHN0YXRlLiAoMjAxNi8wOS8wMSlcbiAgICBjb25zdCBzcGVsbENoZWNrID0gSVNfRklSRUZPWCA/IGZhbHNlIDogcHJvcHMuc3BlbGxDaGVja1xuXG4gICAgZGVidWcoJ3JlbmRlcicsIHsgcHJvcHMgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8Q29udGFpbmVyXG4gICAgICAgIGRhdGEtc2xhdGUtZWRpdG9yXG4gICAgICAgIGtleT17dGhpcy50bXAuZm9yY2VzfVxuICAgICAgICByZWY9e3RoaXMucmVmfVxuICAgICAgICBkYXRhLWtleT17ZG9jdW1lbnQua2V5fVxuICAgICAgICBjb250ZW50RWRpdGFibGU9eyFyZWFkT25seX1cbiAgICAgICAgc3VwcHJlc3NDb250ZW50RWRpdGFibGVXYXJuaW5nXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICBvbkJlZm9yZUlucHV0PXt0aGlzLm9uQmVmb3JlSW5wdXR9XG4gICAgICAgIG9uQmx1cj17dGhpcy5vbkJsdXJ9XG4gICAgICAgIG9uRm9jdXM9e3RoaXMub25Gb2N1c31cbiAgICAgICAgb25Db21wb3NpdGlvbkVuZD17dGhpcy5vbkNvbXBvc2l0aW9uRW5kfVxuICAgICAgICBvbkNvbXBvc2l0aW9uU3RhcnQ9e3RoaXMub25Db21wb3NpdGlvblN0YXJ0fVxuICAgICAgICBvbkNvcHk9e3RoaXMub25Db3B5fVxuICAgICAgICBvbkN1dD17dGhpcy5vbkN1dH1cbiAgICAgICAgb25EcmFnRW5kPXt0aGlzLm9uRHJhZ0VuZH1cbiAgICAgICAgb25EcmFnT3Zlcj17dGhpcy5vbkRyYWdPdmVyfVxuICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5vbkRyYWdTdGFydH1cbiAgICAgICAgb25Ecm9wPXt0aGlzLm9uRHJvcH1cbiAgICAgICAgb25JbnB1dD17dGhpcy5vbklucHV0fVxuICAgICAgICBvbktleURvd249e3RoaXMub25LZXlEb3dufVxuICAgICAgICBvbktleVVwPXt0aGlzLm9uS2V5VXB9XG4gICAgICAgIG9uUGFzdGU9e3RoaXMub25QYXN0ZX1cbiAgICAgICAgb25TZWxlY3Q9e3RoaXMub25TZWxlY3R9XG4gICAgICAgIGF1dG9Db3JyZWN0PXtwcm9wcy5hdXRvQ29ycmVjdH1cbiAgICAgICAgc3BlbGxDaGVjaz17c3BlbGxDaGVja31cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICByb2xlPXtyZWFkT25seSA/IG51bGwgOiAocm9sZSB8fCAndGV4dGJveCcpfVxuICAgICAgICB0YWJJbmRleD17dGFiSW5kZXh9XG4gICAgICAgIC8vIENPTVBBVDogVGhlIEdyYW1tYXJseSBDaHJvbWUgZXh0ZW5zaW9uIHdvcmtzIGJ5IGNoYW5naW5nIHRoZSBET00gb3V0XG4gICAgICAgIC8vIGZyb20gdW5kZXIgYGNvbnRlbnRlZGl0YWJsZWAgZWxlbWVudHMsIHdoaWNoIGxlYWRzIHRvIHdlaXJkIGJlaGF2aW9yc1xuICAgICAgICAvLyBzbyB3ZSBoYXZlIHRvIGRpc2FibGUgaXQgbGlrZSB0aGlzLiAoMjAxNy8wNC8yNClcbiAgICAgICAgZGF0YS1ncmFtbT17ZmFsc2V9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICA8L0NvbnRhaW5lcj5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGEgYG5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICovXG5cbiAgcmVuZGVyTm9kZSA9IChub2RlKSA9PiB7XG4gICAgY29uc3QgeyBlZGl0b3IsIHJlYWRPbmx5LCBzY2hlbWEsIHN0YXRlIH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKFxuICAgICAgPE5vZGVcbiAgICAgICAga2V5PXtub2RlLmtleX1cbiAgICAgICAgYmxvY2s9e251bGx9XG4gICAgICAgIG5vZGU9e25vZGV9XG4gICAgICAgIHBhcmVudD17c3RhdGUuZG9jdW1lbnR9XG4gICAgICAgIHNjaGVtYT17c2NoZW1hfVxuICAgICAgICBzdGF0ZT17c3RhdGV9XG4gICAgICAgIGVkaXRvcj17ZWRpdG9yfVxuICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtDb21wb25lbnR9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgQ29udGVudFxuIl19