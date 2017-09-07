'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _block = require('../models/block');

var _block2 = _interopRequireDefault(_block);

var _character = require('../models/character');

var _character2 = _interopRequireDefault(_character);

var _content = require('../components/content');

var _content2 = _interopRequireDefault(_content);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _inline = require('../models/inline');

var _inline2 = _interopRequireDefault(_inline);

var _plain = require('../serializers/plain');

var _plain2 = _interopRequireDefault(_plain);

var _placeholder = require('../components/placeholder');

var _placeholder2 = _interopRequireDefault(_placeholder);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _getPoint = require('../utils/get-point');

var _getPoint2 = _interopRequireDefault(_getPoint);

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _findDomNode = require('../utils/find-dom-node');

var _findDomNode2 = _interopRequireDefault(_findDomNode);

var _environment = require('../constants/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:core');

/**
 * The default plugin.
 *
 * @param {Object} options
 *   @property {Element} placeholder
 *   @property {String} placeholderClassName
 *   @property {Object} placeholderStyle
 * @return {Object}
 */

function Plugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var placeholder = options.placeholder,
      placeholderClassName = options.placeholderClassName,
      placeholderStyle = options.placeholderStyle;

  /**
   * On before change, enforce the editor's schema.
   *
   * @param {Change} change
   * @param {Editor} schema
   */

  function onBeforeChange(change, editor) {
    var state = change.state;

    var schema = editor.getSchema();
    var prevState = editor.getState();

    // PERF: Skip normalizing if the change is native, since we know that it
    // can't have changed anything that requires a core schema fix.
    if (state.isNative) return;

    // PERF: Skip normalizing if the document hasn't changed, since the core
    // schema only normalizes changes to the document, not selection.
    if (prevState && state.document == prevState.document) return;

    change.normalize(schema);
    debug('onBeforeChange');
  }

  /**
   * On before input, see if we can let the browser continue with it's native
   * input behavior, to avoid a re-render for performance.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onBeforeInput(e, data, change, editor) {
    var _change = change,
        state = _change.state;
    var document = state.document,
        startKey = state.startKey,
        startBlock = state.startBlock,
        startOffset = state.startOffset,
        startInline = state.startInline,
        startText = state.startText;

    var pText = startBlock.getPreviousText(startKey);
    var pInline = pText && startBlock.getClosestInline(pText.key);
    var nText = startBlock.getNextText(startKey);
    var nInline = nText && startBlock.getClosestInline(nText.key);

    // Determine what the characters would be if natively inserted.
    var schema = editor.getSchema();
    var decorators = document.getDescendantDecorators(startKey, schema);
    var initialChars = startText.getDecorations(decorators);
    var prevChar = startOffset === 0 ? null : initialChars.get(startOffset - 1);
    var nextChar = startOffset === initialChars.size ? null : initialChars.get(startOffset);
    var char = _character2.default.create({
      text: e.data,
      // When cursor is at start of a range of marks, without preceding text,
      // the native behavior is to insert inside the range of marks.
      marks: prevChar && prevChar.marks || nextChar && nextChar.marks || []
    });

    var chars = initialChars.insert(startOffset, char);

    // COMPAT: In iOS, when choosing from the predictive text suggestions, the
    // native selection will be changed to span the existing word, so that the word
    // is replaced. But the `select` event for this change doesn't fire until after
    // the `beforeInput` event, even though the native selection is updated. So we
    // need to manually adjust the selection to be in sync. (03/18/2017)
    var window = (0, _getWindow2.default)(e.target);
    var native = window.getSelection();
    var anchorNode = native.anchorNode,
        anchorOffset = native.anchorOffset,
        focusNode = native.focusNode,
        focusOffset = native.focusOffset;

    var anchorPoint = (0, _getPoint2.default)(anchorNode, anchorOffset, state, editor);
    var focusPoint = (0, _getPoint2.default)(focusNode, focusOffset, state, editor);
    if (anchorPoint && focusPoint) {
      var selection = state.selection;

      if (selection.anchorKey !== anchorPoint.key || selection.anchorOffset !== anchorPoint.offset || selection.focusKey !== focusPoint.key || selection.focusOffset !== focusPoint.offset) {
        change = change.select({
          anchorKey: anchorPoint.key,
          anchorOffset: anchorPoint.offset,
          focusKey: focusPoint.key,
          focusOffset: focusPoint.offset
        });
      }
    }

    // Determine what the characters should be, if not natively inserted.
    change.insertText(e.data);
    var next = change.state;
    var nextText = next.startText;
    var nextChars = nextText.getDecorations(decorators);

    // We do not have to re-render if the current selection is collapsed, the
    // current node is not empty, there are no marks on the cursor, the cursor
    // is not at the edge of an inline node, the cursor isn't at the starting
    // edge of a text node after an inline node, and the natively inserted
    // characters would be the same as the non-native.
    var isNative =
    // If the selection is expanded, we don't know what the edit will look
    // like so we can't let it happen natively.
    state.isCollapsed &&
    // If the selection has marks, then we need to render it non-natively
    // because we need to create the new marks as well.
    state.selection.marks == null &&
    // If the text node in question has no content, browsers might do weird
    // things so we need to insert it normally instead.
    state.startText.text != '' && (
    // COMPAT: Browsers do weird things when typing at the edges of inline
    // nodes, so we can't let them render natively. (?)
    !startInline || !state.selection.isAtStartOf(startInline)) && (!startInline || !state.selection.isAtEndOf(startInline)) &&
    // COMPAT: In Chrome & Safari, it isn't possible to have a selection at
    // the starting edge of a text node after another inline node. It will
    // have been automatically changed. So we can't render natively because
    // the cursor isn't technique in the right spot. (2016/12/01)
    !(pInline && !pInline.isVoid && startOffset == 0) && !(nInline && !nInline.isVoid && startOffset == startText.text.length) &&
    // COMPAT: When inserting a Space character, Chrome will sometimes
    // split the text node into two adjacent text nodes. See:
    // https://github.com/ianstormtaylor/slate/issues/938
    !(e.data === ' ' && _environment.IS_CHROME) &&
    // If the
    chars.equals(nextChars);

    // If `isNative`, set the flag on the change.
    if (isNative) {
      change.setIsNative(true);
    }

    // Otherwise, prevent default so that the DOM remains untouched.
    else {
        e.preventDefault();
      }

    debug('onBeforeInput', { data: data, isNative: isNative });
  }

  /**
   * On blur.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onBlur(e, data, change) {
    debug('onBlur', { data: data });
    change.blur();
  }

  /**
   * On copy.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onCopy(e, data, change) {
    debug('onCopy', data);
    onCutOrCopy(e, data, change);
  }

  /**
   * On cut.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   */

  function onCut(e, data, change, editor) {
    debug('onCut', data);
    onCutOrCopy(e, data, change);
    var window = (0, _getWindow2.default)(e.target);

    // Once the fake cut content has successfully been added to the clipboard,
    // delete the content in the current selection.
    window.requestAnimationFrame(function () {
      editor.change(function (t) {
        return t.delete();
      });
    });
  }

  /**
   * On cut or copy, create a fake selection so that we can add a Base 64
   * encoded copy of the fragment to the HTML, to decode on future pastes.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onCutOrCopy(e, data, change) {
    var window = (0, _getWindow2.default)(e.target);
    var native = window.getSelection();
    var state = change.state;
    var endBlock = state.endBlock,
        endInline = state.endInline;

    var isVoidBlock = endBlock && endBlock.isVoid;
    var isVoidInline = endInline && endInline.isVoid;
    var isVoid = isVoidBlock || isVoidInline;

    // If the selection is collapsed, and it isn't inside a void node, abort.
    if (native.isCollapsed && !isVoid) return;

    var fragment = data.fragment;

    var encoded = _base2.default.serializeNode(fragment);
    var range = native.getRangeAt(0);
    var contents = range.cloneContents();
    var attach = contents.childNodes[0];

    // If the end node is a void node, we need to move the end of the range from
    // the void node's spacer span, to the end of the void node's content.
    if (isVoid) {
      var _r = range.cloneRange();
      var node = (0, _findDomNode2.default)(isVoidBlock ? endBlock : endInline);
      _r.setEndAfter(node);
      contents = _r.cloneContents();
      attach = contents.childNodes[contents.childNodes.length - 1].firstChild;
    }

    // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when pasted.
    var zws = [].slice.call(contents.querySelectorAll('[data-slate-zero-width]'));
    zws.forEach(function (zw) {
      return zw.parentNode.removeChild(zw);
    });

    // COMPAT: In Chrome and Safari, if the last element in the selection to
    // copy has `contenteditable="false"` the copy will fail, and nothing will
    // be put in the clipboard. So we remove them all. (2017/05/04)
    if (_environment.IS_CHROME || _environment.IS_SAFARI) {
      var els = [].slice.call(contents.querySelectorAll('[contenteditable="false"]'));
      els.forEach(function (el) {
        return el.removeAttribute('contenteditable');
      });
    }

    // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
    // in the HTML, and can be used for intra-Slate pasting. If it's a text
    // node, wrap it in a `<span>` so we have something to set an attribute on.
    if (attach.nodeType == 3) {
      var span = window.document.createElement('span');
      span.appendChild(attach);
      contents.appendChild(span);
      attach = span;
    }

    attach.setAttribute('data-slate-fragment', encoded);

    // Add the phony content to the DOM, and select it, so it will be copied.
    var body = window.document.querySelector('body');
    var div = window.document.createElement('div');
    div.setAttribute('contenteditable', true);
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    div.appendChild(contents);
    body.appendChild(div);

    // COMPAT: In Firefox, trying to use the terser `native.selectAllChildren`
    // throws an error, so we use the older `range` equivalent. (2016/06/21)
    var r = window.document.createRange();
    r.selectNodeContents(div);
    native.removeAllRanges();
    native.addRange(r);

    // Revert to the previous selection right after copying.
    window.requestAnimationFrame(function () {
      body.removeChild(div);
      native.removeAllRanges();
      native.addRange(range);
    });
  }

  /**
   * On drop.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDrop(e, data, change) {
    debug('onDrop', { data: data });

    switch (data.type) {
      case 'text':
      case 'html':
        return onDropText(e, data, change);
      case 'fragment':
        return onDropFragment(e, data, change);
      case 'node':
        return onDropNode(e, data, change);
    }
  }

  /**
   * On drop node, insert the node wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDropNode(e, data, change) {
    debug('onDropNode', { data: data });

    var state = change.state;
    var selection = state.selection;
    var node = data.node,
        target = data.target,
        isInternal = data.isInternal;

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.

    if (isInternal && selection.endKey == target.endKey && selection.endOffset < target.endOffset) {
      target = target.move(selection.startKey == selection.endKey ? 0 - selection.endOffset + selection.startOffset : 0 - selection.endOffset);
    }

    if (isInternal) {
      change.delete();
    }

    if (_block2.default.isBlock(node)) {
      change.select(target).insertBlock(node).removeNodeByKey(node.key);
    }

    if (_inline2.default.isInline(node)) {
      change.select(target).insertInline(node).removeNodeByKey(node.key);
    }
  }

  /**
   * On drop fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDropFragment(e, data, change) {
    debug('onDropFragment', { data: data });

    var state = change.state;
    var selection = state.selection;
    var fragment = data.fragment,
        target = data.target,
        isInternal = data.isInternal;

    // If the drag is internal and the target is after the selection, it
    // needs to account for the selection's content being deleted.

    if (isInternal && selection.endKey == target.endKey && selection.endOffset < target.endOffset) {
      target = target.move(selection.startKey == selection.endKey ? 0 - selection.endOffset + selection.startOffset : 0 - selection.endOffset);
    }

    if (isInternal) {
      change.delete();
    }

    change.select(target).insertFragment(fragment);
  }

  /**
   * On drop text, split the blocks at new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onDropText(e, data, change) {
    debug('onDropText', { data: data });

    var state = change.state;
    var document = state.document;
    var text = data.text,
        target = data.target;
    var anchorKey = target.anchorKey;


    change.select(target);

    var hasVoidParent = document.hasVoidParent(anchorKey);

    // Insert text into nearest text node
    if (hasVoidParent) {
      var node = document.getNode(anchorKey);

      while (hasVoidParent) {
        node = document.getNextText(node.key);
        if (!node) break;
        hasVoidParent = document.hasVoidParent(node.key);
      }

      if (node) change.collapseToStartOf(node);
    }

    text.split('\n').forEach(function (line, i) {
      if (i > 0) change.splitBlock();
      change.insertText(line);
    });
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDown(e, data, change) {
    debug('onKeyDown', { data: data });

    switch (data.key) {
      case 'enter':
        return onKeyDownEnter(e, data, change);
      case 'backspace':
        return onKeyDownBackspace(e, data, change);
      case 'delete':
        return onKeyDownDelete(e, data, change);
      case 'left':
        return onKeyDownLeft(e, data, change);
      case 'right':
        return onKeyDownRight(e, data, change);
      case 'up':
        return onKeyDownUp(e, data, change);
      case 'down':
        return onKeyDownDown(e, data, change);
      case 'd':
        return onKeyDownD(e, data, change);
      case 'h':
        return onKeyDownH(e, data, change);
      case 'k':
        return onKeyDownK(e, data, change);
      case 'y':
        return onKeyDownY(e, data, change);
      case 'z':
        return onKeyDownZ(e, data, change);
    }
  }

  /**
   * On `enter` key down, split the current block in half.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownEnter(e, data, change) {
    var state = change.state;
    var document = state.document,
        startKey = state.startKey;

    var hasVoidParent = document.hasVoidParent(startKey);

    // For void nodes, we don't want to split. Instead we just move to the start
    // of the next text node if one exists.
    if (hasVoidParent) {
      var text = document.getNextText(startKey);
      if (!text) return;
      change.collapseToStartOf(text);
      return;
    }

    change.splitBlock();
  }

  /**
   * On `backspace` key down, delete backwards.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownBackspace(e, data, change) {
    var boundary = 'Char';
    if (data.isWord) boundary = 'Word';
    if (data.isLine) boundary = 'Line';
    change['delete' + boundary + 'Backward']();
  }

  /**
   * On `delete` key down, delete forwards.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownDelete(e, data, change) {
    var boundary = 'Char';
    if (data.isWord) boundary = 'Word';
    if (data.isLine) boundary = 'Line';
    change['delete' + boundary + 'Forward']();
  }

  /**
   * On `left` key down, move backward.
   *
   * COMPAT: This is required to make navigating with the left arrow work when
   * a void node is selected.
   *
   * COMPAT: This is also required to solve for the case where an inline node is
   * surrounded by empty text nodes with zero-width spaces in them. Without this
   * the zero-width spaces will cause two arrow keys to jump to the next text.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownLeft(e, data, change) {
    var state = change.state;


    if (data.isCtrl) return;
    if (data.isAlt) return;
    if (state.isExpanded) return;

    var document = state.document,
        startKey = state.startKey,
        startText = state.startText;

    var hasVoidParent = document.hasVoidParent(startKey);

    // If the current text node is empty, or we're inside a void parent, we're
    // going to need to handle the selection behavior.
    if (startText.text == '' || hasVoidParent) {
      e.preventDefault();
      var previous = document.getPreviousText(startKey);

      // If there's no previous text node in the document, abort.
      if (!previous) return;

      // If the previous text is in the current block, and inside a non-void
      // inline node, move one character into the inline node.
      var startBlock = state.startBlock;

      var previousBlock = document.getClosestBlock(previous.key);
      var previousInline = document.getClosestInline(previous.key);

      if (previousBlock === startBlock && previousInline && !previousInline.isVoid) {
        var extendOrMove = data.isShift ? 'extend' : 'move';
        change.collapseToEndOf(previous)[extendOrMove](-1);
        return;
      }

      // Otherwise, move to the end of the previous node.
      change.collapseToEndOf(previous);
    }
  }

  /**
   * On `right` key down, move forward.
   *
   * COMPAT: This is required to make navigating with the right arrow work when
   * a void node is selected.
   *
   * COMPAT: This is also required to solve for the case where an inline node is
   * surrounded by empty text nodes with zero-width spaces in them. Without this
   * the zero-width spaces will cause two arrow keys to jump to the next text.
   *
   * COMPAT: In Chrome & Safari, selections that are at the zero offset of
   * an inline node will be automatically replaced to be at the last offset
   * of a previous inline node, which screws us up, so we never want to set the
   * selection to the very start of an inline node here. (2016/11/29)
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownRight(e, data, change) {
    var state = change.state;


    if (data.isCtrl) return;
    if (data.isAlt) return;
    if (state.isExpanded) return;

    var document = state.document,
        startKey = state.startKey,
        startText = state.startText;

    var hasVoidParent = document.hasVoidParent(startKey);

    // If the current text node is empty, or we're inside a void parent, we're
    // going to need to handle the selection behavior.
    if (startText.text == '' || hasVoidParent) {
      e.preventDefault();
      var next = document.getNextText(startKey);

      // If there's no next text node in the document, abort.
      if (!next) return;

      // If the next text is inside a void node, move to the end of it.
      if (document.hasVoidParent(next.key)) {
        change.collapseToEndOf(next);
        return;
      }

      // If the next text is in the current block, and inside an inline node,
      // move one character into the inline node.
      var startBlock = state.startBlock;

      var nextBlock = document.getClosestBlock(next.key);
      var nextInline = document.getClosestInline(next.key);

      if (nextBlock == startBlock && nextInline) {
        var extendOrMove = data.isShift ? 'extend' : 'move';
        change.collapseToStartOf(next)[extendOrMove](1);
        return;
      }

      // Otherwise, move to the start of the next text node.
      change.collapseToStartOf(next);
    }
  }

  /**
   * On `up` key down, for Macs, move the selection to start of the block.
   *
   * COMPAT: Certain browsers don't handle the selection updates properly. In
   * Chrome, option-shift-up doesn't properly extend the selection. And in
   * Firefox, option-up doesn't properly move the selection.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownUp(e, data, change) {
    if (!_environment.IS_MAC || data.isCtrl || !data.isAlt) return;

    var state = change.state;
    var selection = state.selection,
        document = state.document,
        focusKey = state.focusKey,
        focusBlock = state.focusBlock;

    var transform = data.isShift ? 'extendToStartOf' : 'collapseToStartOf';
    var block = selection.hasFocusAtStartOf(focusBlock) ? document.getPreviousBlock(focusKey) : focusBlock;

    if (!block) return;
    var text = block.getFirstText();

    e.preventDefault();
    change[transform](text);
  }

  /**
   * On `down` key down, for Macs, move the selection to end of the block.
   *
   * COMPAT: Certain browsers don't handle the selection updates properly. In
   * Chrome, option-shift-down doesn't properly extend the selection. And in
   * Firefox, option-down doesn't properly move the selection.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownDown(e, data, change) {
    if (!_environment.IS_MAC || data.isCtrl || !data.isAlt) return;

    var state = change.state;
    var selection = state.selection,
        document = state.document,
        focusKey = state.focusKey,
        focusBlock = state.focusBlock;

    var transform = data.isShift ? 'extendToEndOf' : 'collapseToEndOf';
    var block = selection.hasFocusAtEndOf(focusBlock) ? document.getNextBlock(focusKey) : focusBlock;

    if (!block) return;
    var text = block.getLastText();

    e.preventDefault();
    change[transform](text);
  }

  /**
   * On `d` key down, for Macs, delete one character forward.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownD(e, data, change) {
    if (!_environment.IS_MAC || !data.isCtrl) return;
    e.preventDefault();
    change.deleteCharForward();
  }

  /**
   * On `h` key down, for Macs, delete until the end of the line.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownH(e, data, change) {
    if (!_environment.IS_MAC || !data.isCtrl) return;
    e.preventDefault();
    change.deleteCharBackward();
  }

  /**
   * On `k` key down, for Macs, delete until the end of the line.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownK(e, data, change) {
    if (!_environment.IS_MAC || !data.isCtrl) return;
    e.preventDefault();
    change.deleteLineForward();
  }

  /**
   * On `y` key down, redo.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownY(e, data, change) {
    if (!data.isMod) return;
    change.redo();
  }

  /**
   * On `z` key down, undo or redo.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onKeyDownZ(e, data, change) {
    if (!data.isMod) return;
    change[data.isShift ? 'redo' : 'undo']();
  }

  /**
   * On paste.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onPaste(e, data, change) {
    debug('onPaste', { data: data });

    switch (data.type) {
      case 'fragment':
        return onPasteFragment(e, data, change);
      case 'text':
      case 'html':
        return onPasteText(e, data, change);
    }
  }

  /**
   * On paste fragment.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onPasteFragment(e, data, change) {
    debug('onPasteFragment', { data: data });
    change.insertFragment(data.fragment);
  }

  /**
   * On paste text, split blocks at new lines.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onPasteText(e, data, change) {
    debug('onPasteText', { data: data });

    var state = change.state;
    var document = state.document,
        selection = state.selection,
        startBlock = state.startBlock;

    if (startBlock.isVoid) return;

    var text = data.text;

    var defaultBlock = { type: startBlock.type, data: startBlock.data };
    var defaultMarks = document.getMarksAtRange(selection.collapseToStart());
    var fragment = _plain2.default.deserialize(text, { defaultBlock: defaultBlock, defaultMarks: defaultMarks }).document;
    change.insertFragment(fragment);
  }

  /**
   * On select.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  function onSelect(e, data, change) {
    debug('onSelect', { data: data });
    change.select(data.selection);
  }

  /**
   * Render.
   *
   * @param {Object} props
   * @param {State} state
   * @param {Editor} editor
   * @return {Object}
   */

  function render(props, state, editor) {
    return _react2.default.createElement(_content2.default, {
      autoCorrect: props.autoCorrect,
      autoFocus: props.autoFocus,
      className: props.className,
      children: props.children,
      editor: editor,
      onBeforeInput: editor.onBeforeInput,
      onBlur: editor.onBlur,
      onFocus: editor.onFocus,
      onCopy: editor.onCopy,
      onCut: editor.onCut,
      onDrop: editor.onDrop,
      onKeyDown: editor.onKeyDown,
      onKeyUp: editor.onKeyUp,
      onPaste: editor.onPaste,
      onSelect: editor.onSelect,
      readOnly: props.readOnly,
      role: props.role,
      schema: editor.getSchema(),
      spellCheck: props.spellCheck,
      state: state,
      style: props.style,
      tabIndex: props.tabIndex,
      tagName: props.tagName
    });
  }

  /**
   * A default schema rule to render block nodes.
   *
   * @type {Object}
   */

  var BLOCK_RENDER_RULE = {
    match: function match(node) {
      return node.kind == 'block';
    },
    render: function render(props) {
      return _react2.default.createElement(
        'div',
        _extends({}, props.attributes, { style: { position: 'relative' } }),
        props.children,
        placeholder ? _react2.default.createElement(
          _placeholder2.default,
          {
            className: placeholderClassName,
            node: props.node,
            parent: props.state.document,
            state: props.state,
            style: placeholderStyle
          },
          placeholder
        ) : null
      );
    }

    /**
     * A default schema rule to render inline nodes.
     *
     * @type {Object}
     */

  };var INLINE_RENDER_RULE = {
    match: function match(node) {
      return node.kind == 'inline';
    },
    render: function render(props) {
      return _react2.default.createElement(
        'span',
        _extends({}, props.attributes, { style: { position: 'relative' } }),
        props.children
      );
    }

    /**
     * Add default rendering rules to the schema.
     *
     * @type {Object}
     */

  };var schema = {
    rules: [BLOCK_RENDER_RULE, INLINE_RENDER_RULE]

    /**
     * Return the core plugin.
     *
     * @type {Object}
     */

  };return {
    onBeforeChange: onBeforeChange,
    onBeforeInput: onBeforeInput,
    onBlur: onBlur,
    onCopy: onCopy,
    onCut: onCut,
    onDrop: onDrop,
    onKeyDown: onKeyDown,
    onPaste: onPaste,
    onSelect: onSelect,
    render: render,
    schema: schema
  };
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Plugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbHVnaW5zL2NvcmUuanMiXSwibmFtZXMiOlsiZGVidWciLCJQbHVnaW4iLCJvcHRpb25zIiwicGxhY2Vob2xkZXIiLCJwbGFjZWhvbGRlckNsYXNzTmFtZSIsInBsYWNlaG9sZGVyU3R5bGUiLCJvbkJlZm9yZUNoYW5nZSIsImNoYW5nZSIsImVkaXRvciIsInN0YXRlIiwic2NoZW1hIiwiZ2V0U2NoZW1hIiwicHJldlN0YXRlIiwiZ2V0U3RhdGUiLCJpc05hdGl2ZSIsImRvY3VtZW50Iiwibm9ybWFsaXplIiwib25CZWZvcmVJbnB1dCIsImUiLCJkYXRhIiwic3RhcnRLZXkiLCJzdGFydEJsb2NrIiwic3RhcnRPZmZzZXQiLCJzdGFydElubGluZSIsInN0YXJ0VGV4dCIsInBUZXh0IiwiZ2V0UHJldmlvdXNUZXh0IiwicElubGluZSIsImdldENsb3Nlc3RJbmxpbmUiLCJrZXkiLCJuVGV4dCIsImdldE5leHRUZXh0IiwibklubGluZSIsImRlY29yYXRvcnMiLCJnZXREZXNjZW5kYW50RGVjb3JhdG9ycyIsImluaXRpYWxDaGFycyIsImdldERlY29yYXRpb25zIiwicHJldkNoYXIiLCJnZXQiLCJuZXh0Q2hhciIsInNpemUiLCJjaGFyIiwiY3JlYXRlIiwidGV4dCIsIm1hcmtzIiwiY2hhcnMiLCJpbnNlcnQiLCJ3aW5kb3ciLCJ0YXJnZXQiLCJuYXRpdmUiLCJnZXRTZWxlY3Rpb24iLCJhbmNob3JOb2RlIiwiYW5jaG9yT2Zmc2V0IiwiZm9jdXNOb2RlIiwiZm9jdXNPZmZzZXQiLCJhbmNob3JQb2ludCIsImZvY3VzUG9pbnQiLCJzZWxlY3Rpb24iLCJhbmNob3JLZXkiLCJvZmZzZXQiLCJmb2N1c0tleSIsInNlbGVjdCIsImluc2VydFRleHQiLCJuZXh0IiwibmV4dFRleHQiLCJuZXh0Q2hhcnMiLCJpc0NvbGxhcHNlZCIsImlzQXRTdGFydE9mIiwiaXNBdEVuZE9mIiwiaXNWb2lkIiwibGVuZ3RoIiwiZXF1YWxzIiwic2V0SXNOYXRpdmUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uQmx1ciIsImJsdXIiLCJvbkNvcHkiLCJvbkN1dE9yQ29weSIsIm9uQ3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwidCIsImRlbGV0ZSIsImVuZEJsb2NrIiwiZW5kSW5saW5lIiwiaXNWb2lkQmxvY2siLCJpc1ZvaWRJbmxpbmUiLCJmcmFnbWVudCIsImVuY29kZWQiLCJzZXJpYWxpemVOb2RlIiwicmFuZ2UiLCJnZXRSYW5nZUF0IiwiY29udGVudHMiLCJjbG9uZUNvbnRlbnRzIiwiYXR0YWNoIiwiY2hpbGROb2RlcyIsInIiLCJjbG9uZVJhbmdlIiwibm9kZSIsInNldEVuZEFmdGVyIiwiZmlyc3RDaGlsZCIsInp3cyIsInNsaWNlIiwiY2FsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwienciLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJlbHMiLCJlbCIsInJlbW92ZUF0dHJpYnV0ZSIsIm5vZGVUeXBlIiwic3BhbiIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsInNldEF0dHJpYnV0ZSIsImJvZHkiLCJxdWVyeVNlbGVjdG9yIiwiZGl2Iiwic3R5bGUiLCJwb3NpdGlvbiIsImxlZnQiLCJjcmVhdGVSYW5nZSIsInNlbGVjdE5vZGVDb250ZW50cyIsInJlbW92ZUFsbFJhbmdlcyIsImFkZFJhbmdlIiwib25Ecm9wIiwidHlwZSIsIm9uRHJvcFRleHQiLCJvbkRyb3BGcmFnbWVudCIsIm9uRHJvcE5vZGUiLCJpc0ludGVybmFsIiwiZW5kS2V5IiwiZW5kT2Zmc2V0IiwibW92ZSIsImlzQmxvY2siLCJpbnNlcnRCbG9jayIsInJlbW92ZU5vZGVCeUtleSIsImlzSW5saW5lIiwiaW5zZXJ0SW5saW5lIiwiaW5zZXJ0RnJhZ21lbnQiLCJoYXNWb2lkUGFyZW50IiwiZ2V0Tm9kZSIsImNvbGxhcHNlVG9TdGFydE9mIiwic3BsaXQiLCJsaW5lIiwiaSIsInNwbGl0QmxvY2siLCJvbktleURvd24iLCJvbktleURvd25FbnRlciIsIm9uS2V5RG93bkJhY2tzcGFjZSIsIm9uS2V5RG93bkRlbGV0ZSIsIm9uS2V5RG93bkxlZnQiLCJvbktleURvd25SaWdodCIsIm9uS2V5RG93blVwIiwib25LZXlEb3duRG93biIsIm9uS2V5RG93bkQiLCJvbktleURvd25IIiwib25LZXlEb3duSyIsIm9uS2V5RG93blkiLCJvbktleURvd25aIiwiYm91bmRhcnkiLCJpc1dvcmQiLCJpc0xpbmUiLCJpc0N0cmwiLCJpc0FsdCIsImlzRXhwYW5kZWQiLCJwcmV2aW91cyIsInByZXZpb3VzQmxvY2siLCJnZXRDbG9zZXN0QmxvY2siLCJwcmV2aW91c0lubGluZSIsImV4dGVuZE9yTW92ZSIsImlzU2hpZnQiLCJjb2xsYXBzZVRvRW5kT2YiLCJuZXh0QmxvY2siLCJuZXh0SW5saW5lIiwiZm9jdXNCbG9jayIsInRyYW5zZm9ybSIsImJsb2NrIiwiaGFzRm9jdXNBdFN0YXJ0T2YiLCJnZXRQcmV2aW91c0Jsb2NrIiwiZ2V0Rmlyc3RUZXh0IiwiaGFzRm9jdXNBdEVuZE9mIiwiZ2V0TmV4dEJsb2NrIiwiZ2V0TGFzdFRleHQiLCJkZWxldGVDaGFyRm9yd2FyZCIsImRlbGV0ZUNoYXJCYWNrd2FyZCIsImRlbGV0ZUxpbmVGb3J3YXJkIiwiaXNNb2QiLCJyZWRvIiwib25QYXN0ZSIsIm9uUGFzdGVGcmFnbWVudCIsIm9uUGFzdGVUZXh0IiwiZGVmYXVsdEJsb2NrIiwiZGVmYXVsdE1hcmtzIiwiZ2V0TWFya3NBdFJhbmdlIiwiY29sbGFwc2VUb1N0YXJ0IiwiZGVzZXJpYWxpemUiLCJvblNlbGVjdCIsInJlbmRlciIsInByb3BzIiwiYXV0b0NvcnJlY3QiLCJhdXRvRm9jdXMiLCJjbGFzc05hbWUiLCJjaGlsZHJlbiIsIm9uRm9jdXMiLCJvbktleVVwIiwicmVhZE9ubHkiLCJyb2xlIiwic3BlbGxDaGVjayIsInRhYkluZGV4IiwidGFnTmFtZSIsIkJMT0NLX1JFTkRFUl9SVUxFIiwibWF0Y2giLCJraW5kIiwiYXR0cmlidXRlcyIsIklOTElORV9SRU5ERVJf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THNCLHdCQVBLO0FBUUwwQyxvQkFSSztBQVNMUSxzQkFUSztBQVVMQyxrQkFWSztBQVdMN0w7QUFYSyxHQUFQO0FBYUQ7O0FBRUQ7Ozs7OztrQkFNZVQsTSIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgQmFzZTY0IGZyb20gJy4uL3NlcmlhbGl6ZXJzL2Jhc2UtNjQnXG5pbXBvcnQgQmxvY2sgZnJvbSAnLi4vbW9kZWxzL2Jsb2NrJ1xuaW1wb3J0IENoYXJhY3RlciBmcm9tICcuLi9tb2RlbHMvY2hhcmFjdGVyJ1xuaW1wb3J0IENvbnRlbnQgZnJvbSAnLi4vY29tcG9uZW50cy9jb250ZW50J1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IElubGluZSBmcm9tICcuLi9tb2RlbHMvaW5saW5lJ1xuaW1wb3J0IFBsYWluIGZyb20gJy4uL3NlcmlhbGl6ZXJzL3BsYWluJ1xuaW1wb3J0IFBsYWNlaG9sZGVyIGZyb20gJy4uL2NvbXBvbmVudHMvcGxhY2Vob2xkZXInXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgZ2V0UG9pbnQgZnJvbSAnLi4vdXRpbHMvZ2V0LXBvaW50J1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tICdnZXQtd2luZG93J1xuaW1wb3J0IGZpbmRET01Ob2RlIGZyb20gJy4uL3V0aWxzL2ZpbmQtZG9tLW5vZGUnXG5pbXBvcnQgeyBJU19DSFJPTUUsIElTX01BQywgSVNfU0FGQVJJIH0gZnJvbSAnLi4vY29uc3RhbnRzL2Vudmlyb25tZW50J1xuXG4vKipcbiAqIERlYnVnLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdzbGF0ZTpjb3JlJylcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBwbHVnaW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgQHByb3BlcnR5IHtFbGVtZW50fSBwbGFjZWhvbGRlclxuICogICBAcHJvcGVydHkge1N0cmluZ30gcGxhY2Vob2xkZXJDbGFzc05hbWVcbiAqICAgQHByb3BlcnR5IHtPYmplY3R9IHBsYWNlaG9sZGVyU3R5bGVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBQbHVnaW4ob3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHtcbiAgICBwbGFjZWhvbGRlcixcbiAgICBwbGFjZWhvbGRlckNsYXNzTmFtZSxcbiAgICBwbGFjZWhvbGRlclN0eWxlLFxuICB9ID0gb3B0aW9uc1xuXG4gIC8qKlxuICAgKiBPbiBiZWZvcmUgY2hhbmdlLCBlbmZvcmNlIHRoZSBlZGl0b3IncyBzY2hlbWEuXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICogQHBhcmFtIHtFZGl0b3J9IHNjaGVtYVxuICAgKi9cblxuICBmdW5jdGlvbiBvbkJlZm9yZUNoYW5nZShjaGFuZ2UsIGVkaXRvcikge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHNjaGVtYSA9IGVkaXRvci5nZXRTY2hlbWEoKVxuICAgIGNvbnN0IHByZXZTdGF0ZSA9IGVkaXRvci5nZXRTdGF0ZSgpXG5cbiAgICAvLyBQRVJGOiBTa2lwIG5vcm1hbGl6aW5nIGlmIHRoZSBjaGFuZ2UgaXMgbmF0aXZlLCBzaW5jZSB3ZSBrbm93IHRoYXQgaXRcbiAgICAvLyBjYW4ndCBoYXZlIGNoYW5nZWQgYW55dGhpbmcgdGhhdCByZXF1aXJlcyBhIGNvcmUgc2NoZW1hIGZpeC5cbiAgICBpZiAoc3RhdGUuaXNOYXRpdmUpIHJldHVyblxuXG4gICAgLy8gUEVSRjogU2tpcCBub3JtYWxpemluZyBpZiB0aGUgZG9jdW1lbnQgaGFzbid0IGNoYW5nZWQsIHNpbmNlIHRoZSBjb3JlXG4gICAgLy8gc2NoZW1hIG9ubHkgbm9ybWFsaXplcyBjaGFuZ2VzIHRvIHRoZSBkb2N1bWVudCwgbm90IHNlbGVjdGlvbi5cbiAgICBpZiAocHJldlN0YXRlICYmIHN0YXRlLmRvY3VtZW50ID09IHByZXZTdGF0ZS5kb2N1bWVudCkgcmV0dXJuXG5cbiAgICBjaGFuZ2Uubm9ybWFsaXplKHNjaGVtYSlcbiAgICBkZWJ1Zygnb25CZWZvcmVDaGFuZ2UnKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGJlZm9yZSBpbnB1dCwgc2VlIGlmIHdlIGNhbiBsZXQgdGhlIGJyb3dzZXIgY29udGludWUgd2l0aCBpdCdzIG5hdGl2ZVxuICAgKiBpbnB1dCBiZWhhdmlvciwgdG8gYXZvaWQgYSByZS1yZW5kZXIgZm9yIHBlcmZvcm1hbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICogQHBhcmFtIHtFZGl0b3J9IGVkaXRvclxuICAgKi9cblxuICBmdW5jdGlvbiBvbkJlZm9yZUlucHV0KGUsIGRhdGEsIGNoYW5nZSwgZWRpdG9yKSB7XG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gICAgY29uc3QgeyBkb2N1bWVudCwgc3RhcnRLZXksIHN0YXJ0QmxvY2ssIHN0YXJ0T2Zmc2V0LCBzdGFydElubGluZSwgc3RhcnRUZXh0IH0gPSBzdGF0ZVxuICAgIGNvbnN0IHBUZXh0ID0gc3RhcnRCbG9jay5nZXRQcmV2aW91c1RleHQoc3RhcnRLZXkpXG4gICAgY29uc3QgcElubGluZSA9IHBUZXh0ICYmIHN0YXJ0QmxvY2suZ2V0Q2xvc2VzdElubGluZShwVGV4dC5rZXkpXG4gICAgY29uc3QgblRleHQgPSBzdGFydEJsb2NrLmdldE5leHRUZXh0KHN0YXJ0S2V5KVxuICAgIGNvbnN0IG5JbmxpbmUgPSBuVGV4dCAmJiBzdGFydEJsb2NrLmdldENsb3Nlc3RJbmxpbmUoblRleHQua2V5KVxuXG4gICAgLy8gRGV0ZXJtaW5lIHdoYXQgdGhlIGNoYXJhY3RlcnMgd291bGQgYmUgaWYgbmF0aXZlbHkgaW5zZXJ0ZWQuXG4gICAgY29uc3Qgc2NoZW1hID0gZWRpdG9yLmdldFNjaGVtYSgpXG4gICAgY29uc3QgZGVjb3JhdG9ycyA9IGRvY3VtZW50LmdldERlc2NlbmRhbnREZWNvcmF0b3JzKHN0YXJ0S2V5LCBzY2hlbWEpXG4gICAgY29uc3QgaW5pdGlhbENoYXJzID0gc3RhcnRUZXh0LmdldERlY29yYXRpb25zKGRlY29yYXRvcnMpXG4gICAgY29uc3QgcHJldkNoYXIgPSBzdGFydE9mZnNldCA9PT0gMCA/IG51bGwgOiBpbml0aWFsQ2hhcnMuZ2V0KHN0YXJ0T2Zmc2V0IC0gMSlcbiAgICBjb25zdCBuZXh0Q2hhciA9IHN0YXJ0T2Zmc2V0ID09PSBpbml0aWFsQ2hhcnMuc2l6ZSA/IG51bGwgOiBpbml0aWFsQ2hhcnMuZ2V0KHN0YXJ0T2Zmc2V0KVxuICAgIGNvbnN0IGNoYXIgPSBDaGFyYWN0ZXIuY3JlYXRlKHtcbiAgICAgIHRleHQ6IGUuZGF0YSxcbiAgICAgIC8vIFdoZW4gY3Vyc29yIGlzIGF0IHN0YXJ0IG9mIGEgcmFuZ2Ugb2YgbWFya3MsIHdpdGhvdXQgcHJlY2VkaW5nIHRleHQsXG4gICAgICAvLyB0aGUgbmF0aXZlIGJlaGF2aW9yIGlzIHRvIGluc2VydCBpbnNpZGUgdGhlIHJhbmdlIG9mIG1hcmtzLlxuICAgICAgbWFya3M6IChcbiAgICAgICAgKHByZXZDaGFyICYmIHByZXZDaGFyLm1hcmtzKSB8fFxuICAgICAgICAobmV4dENoYXIgJiYgbmV4dENoYXIubWFya3MpIHx8XG4gICAgICAgIFtdXG4gICAgICApXG4gICAgfSlcblxuICAgIGNvbnN0IGNoYXJzID0gaW5pdGlhbENoYXJzLmluc2VydChzdGFydE9mZnNldCwgY2hhcilcblxuICAgIC8vIENPTVBBVDogSW4gaU9TLCB3aGVuIGNob29zaW5nIGZyb20gdGhlIHByZWRpY3RpdmUgdGV4dCBzdWdnZXN0aW9ucywgdGhlXG4gICAgLy8gbmF0aXZlIHNlbGVjdGlvbiB3aWxsIGJlIGNoYW5nZWQgdG8gc3BhbiB0aGUgZXhpc3Rpbmcgd29yZCwgc28gdGhhdCB0aGUgd29yZFxuICAgIC8vIGlzIHJlcGxhY2VkLiBCdXQgdGhlIGBzZWxlY3RgIGV2ZW50IGZvciB0aGlzIGNoYW5nZSBkb2Vzbid0IGZpcmUgdW50aWwgYWZ0ZXJcbiAgICAvLyB0aGUgYGJlZm9yZUlucHV0YCBldmVudCwgZXZlbiB0aG91Z2ggdGhlIG5hdGl2ZSBzZWxlY3Rpb24gaXMgdXBkYXRlZC4gU28gd2VcbiAgICAvLyBuZWVkIHRvIG1hbnVhbGx5IGFkanVzdCB0aGUgc2VsZWN0aW9uIHRvIGJlIGluIHN5bmMuICgwMy8xOC8yMDE3KVxuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdyhlLnRhcmdldClcbiAgICBjb25zdCBuYXRpdmUgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICBjb25zdCB7IGFuY2hvck5vZGUsIGFuY2hvck9mZnNldCwgZm9jdXNOb2RlLCBmb2N1c09mZnNldCB9ID0gbmF0aXZlXG4gICAgY29uc3QgYW5jaG9yUG9pbnQgPSBnZXRQb2ludChhbmNob3JOb2RlLCBhbmNob3JPZmZzZXQsIHN0YXRlLCBlZGl0b3IpXG4gICAgY29uc3QgZm9jdXNQb2ludCA9IGdldFBvaW50KGZvY3VzTm9kZSwgZm9jdXNPZmZzZXQsIHN0YXRlLCBlZGl0b3IpXG4gICAgaWYgKGFuY2hvclBvaW50ICYmIGZvY3VzUG9pbnQpIHtcbiAgICAgIGNvbnN0IHsgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuICAgICAgaWYgKFxuICAgICAgICBzZWxlY3Rpb24uYW5jaG9yS2V5ICE9PSBhbmNob3JQb2ludC5rZXkgfHxcbiAgICAgICAgc2VsZWN0aW9uLmFuY2hvck9mZnNldCAhPT0gYW5jaG9yUG9pbnQub2Zmc2V0IHx8XG4gICAgICAgIHNlbGVjdGlvbi5mb2N1c0tleSAhPT0gZm9jdXNQb2ludC5rZXkgfHxcbiAgICAgICAgc2VsZWN0aW9uLmZvY3VzT2Zmc2V0ICE9PSBmb2N1c1BvaW50Lm9mZnNldFxuICAgICAgKSB7XG4gICAgICAgIGNoYW5nZSA9IGNoYW5nZVxuICAgICAgICAgIC5zZWxlY3Qoe1xuICAgICAgICAgICAgYW5jaG9yS2V5OiBhbmNob3JQb2ludC5rZXksXG4gICAgICAgICAgICBhbmNob3JPZmZzZXQ6IGFuY2hvclBvaW50Lm9mZnNldCxcbiAgICAgICAgICAgIGZvY3VzS2V5OiBmb2N1c1BvaW50LmtleSxcbiAgICAgICAgICAgIGZvY3VzT2Zmc2V0OiBmb2N1c1BvaW50Lm9mZnNldFxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHdoYXQgdGhlIGNoYXJhY3RlcnMgc2hvdWxkIGJlLCBpZiBub3QgbmF0aXZlbHkgaW5zZXJ0ZWQuXG4gICAgY2hhbmdlLmluc2VydFRleHQoZS5kYXRhKVxuICAgIGNvbnN0IG5leHQgPSBjaGFuZ2Uuc3RhdGVcbiAgICBjb25zdCBuZXh0VGV4dCA9IG5leHQuc3RhcnRUZXh0XG4gICAgY29uc3QgbmV4dENoYXJzID0gbmV4dFRleHQuZ2V0RGVjb3JhdGlvbnMoZGVjb3JhdG9ycylcblxuICAgIC8vIFdlIGRvIG5vdCBoYXZlIHRvIHJlLXJlbmRlciBpZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29sbGFwc2VkLCB0aGVcbiAgICAvLyBjdXJyZW50IG5vZGUgaXMgbm90IGVtcHR5LCB0aGVyZSBhcmUgbm8gbWFya3Mgb24gdGhlIGN1cnNvciwgdGhlIGN1cnNvclxuICAgIC8vIGlzIG5vdCBhdCB0aGUgZWRnZSBvZiBhbiBpbmxpbmUgbm9kZSwgdGhlIGN1cnNvciBpc24ndCBhdCB0aGUgc3RhcnRpbmdcbiAgICAvLyBlZGdlIG9mIGEgdGV4dCBub2RlIGFmdGVyIGFuIGlubGluZSBub2RlLCBhbmQgdGhlIG5hdGl2ZWx5IGluc2VydGVkXG4gICAgLy8gY2hhcmFjdGVycyB3b3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgbm9uLW5hdGl2ZS5cbiAgICBjb25zdCBpc05hdGl2ZSA9IChcbiAgICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gaXMgZXhwYW5kZWQsIHdlIGRvbid0IGtub3cgd2hhdCB0aGUgZWRpdCB3aWxsIGxvb2tcbiAgICAgIC8vIGxpa2Ugc28gd2UgY2FuJ3QgbGV0IGl0IGhhcHBlbiBuYXRpdmVseS5cbiAgICAgIChzdGF0ZS5pc0NvbGxhcHNlZCkgJiZcbiAgICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gaGFzIG1hcmtzLCB0aGVuIHdlIG5lZWQgdG8gcmVuZGVyIGl0IG5vbi1uYXRpdmVseVxuICAgICAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGNyZWF0ZSB0aGUgbmV3IG1hcmtzIGFzIHdlbGwuXG4gICAgICAoc3RhdGUuc2VsZWN0aW9uLm1hcmtzID09IG51bGwpICYmXG4gICAgICAvLyBJZiB0aGUgdGV4dCBub2RlIGluIHF1ZXN0aW9uIGhhcyBubyBjb250ZW50LCBicm93c2VycyBtaWdodCBkbyB3ZWlyZFxuICAgICAgLy8gdGhpbmdzIHNvIHdlIG5lZWQgdG8gaW5zZXJ0IGl0IG5vcm1hbGx5IGluc3RlYWQuXG4gICAgICAoc3RhdGUuc3RhcnRUZXh0LnRleHQgIT0gJycpICYmXG4gICAgICAvLyBDT01QQVQ6IEJyb3dzZXJzIGRvIHdlaXJkIHRoaW5ncyB3aGVuIHR5cGluZyBhdCB0aGUgZWRnZXMgb2YgaW5saW5lXG4gICAgICAvLyBub2Rlcywgc28gd2UgY2FuJ3QgbGV0IHRoZW0gcmVuZGVyIG5hdGl2ZWx5LiAoPylcbiAgICAgICghc3RhcnRJbmxpbmUgfHwgIXN0YXRlLnNlbGVjdGlvbi5pc0F0U3RhcnRPZihzdGFydElubGluZSkpICYmXG4gICAgICAoIXN0YXJ0SW5saW5lIHx8ICFzdGF0ZS5zZWxlY3Rpb24uaXNBdEVuZE9mKHN0YXJ0SW5saW5lKSkgJiZcbiAgICAgIC8vIENPTVBBVDogSW4gQ2hyb21lICYgU2FmYXJpLCBpdCBpc24ndCBwb3NzaWJsZSB0byBoYXZlIGEgc2VsZWN0aW9uIGF0XG4gICAgICAvLyB0aGUgc3RhcnRpbmcgZWRnZSBvZiBhIHRleHQgbm9kZSBhZnRlciBhbm90aGVyIGlubGluZSBub2RlLiBJdCB3aWxsXG4gICAgICAvLyBoYXZlIGJlZW4gYXV0b21hdGljYWxseSBjaGFuZ2VkLiBTbyB3ZSBjYW4ndCByZW5kZXIgbmF0aXZlbHkgYmVjYXVzZVxuICAgICAgLy8gdGhlIGN1cnNvciBpc24ndCB0ZWNobmlxdWUgaW4gdGhlIHJpZ2h0IHNwb3QuICgyMDE2LzEyLzAxKVxuICAgICAgKCEocElubGluZSAmJiAhcElubGluZS5pc1ZvaWQgJiYgc3RhcnRPZmZzZXQgPT0gMCkpICYmXG4gICAgICAoIShuSW5saW5lICYmICFuSW5saW5lLmlzVm9pZCAmJiBzdGFydE9mZnNldCA9PSBzdGFydFRleHQudGV4dC5sZW5ndGgpKSAmJlxuICAgICAgLy8gQ09NUEFUOiBXaGVuIGluc2VydGluZyBhIFNwYWNlIGNoYXJhY3RlciwgQ2hyb21lIHdpbGwgc29tZXRpbWVzXG4gICAgICAvLyBzcGxpdCB0aGUgdGV4dCBub2RlIGludG8gdHdvIGFkamFjZW50IHRleHQgbm9kZXMuIFNlZTpcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pYW5zdG9ybXRheWxvci9zbGF0ZS9pc3N1ZXMvOTM4XG4gICAgICAoIShlLmRhdGEgPT09ICcgJyAmJiBJU19DSFJPTUUpKSAmJlxuICAgICAgLy8gSWYgdGhlXG4gICAgICAoY2hhcnMuZXF1YWxzKG5leHRDaGFycykpXG4gICAgKVxuXG4gICAgLy8gSWYgYGlzTmF0aXZlYCwgc2V0IHRoZSBmbGFnIG9uIHRoZSBjaGFuZ2UuXG4gICAgaWYgKGlzTmF0aXZlKSB7XG4gICAgICBjaGFuZ2Uuc2V0SXNOYXRpdmUodHJ1ZSlcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHByZXZlbnQgZGVmYXVsdCBzbyB0aGF0IHRoZSBET00gcmVtYWlucyB1bnRvdWNoZWQuXG4gICAgZWxzZSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBkZWJ1Zygnb25CZWZvcmVJbnB1dCcsIHsgZGF0YSwgaXNOYXRpdmUgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBibHVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICovXG5cbiAgZnVuY3Rpb24gb25CbHVyKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGRlYnVnKCdvbkJsdXInLCB7IGRhdGEgfSlcbiAgICBjaGFuZ2UuYmx1cigpXG4gIH1cblxuICAvKipcbiAgICogT24gY29weS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uQ29weShlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBkZWJ1Zygnb25Db3B5JywgZGF0YSlcbiAgICBvbkN1dE9yQ29weShlLCBkYXRhLCBjaGFuZ2UpXG4gIH1cblxuICAvKipcbiAgICogT24gY3V0LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICogQHBhcmFtIHtFZGl0b3J9IGVkaXRvclxuICAgKi9cblxuICBmdW5jdGlvbiBvbkN1dChlLCBkYXRhLCBjaGFuZ2UsIGVkaXRvcikge1xuICAgIGRlYnVnKCdvbkN1dCcsIGRhdGEpXG4gICAgb25DdXRPckNvcHkoZSwgZGF0YSwgY2hhbmdlKVxuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdyhlLnRhcmdldClcblxuICAgIC8vIE9uY2UgdGhlIGZha2UgY3V0IGNvbnRlbnQgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIGFkZGVkIHRvIHRoZSBjbGlwYm9hcmQsXG4gICAgLy8gZGVsZXRlIHRoZSBjb250ZW50IGluIHRoZSBjdXJyZW50IHNlbGVjdGlvbi5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGVkaXRvci5jaGFuZ2UodCA9PiB0LmRlbGV0ZSgpKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogT24gY3V0IG9yIGNvcHksIGNyZWF0ZSBhIGZha2Ugc2VsZWN0aW9uIHNvIHRoYXQgd2UgY2FuIGFkZCBhIEJhc2UgNjRcbiAgICogZW5jb2RlZCBjb3B5IG9mIHRoZSBmcmFnbWVudCB0byB0aGUgSFRNTCwgdG8gZGVjb2RlIG9uIGZ1dHVyZSBwYXN0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbkN1dE9yQ29weShlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBjb25zdCB3aW5kb3cgPSBnZXRXaW5kb3coZS50YXJnZXQpXG4gICAgY29uc3QgbmF0aXZlID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gICAgY29uc3QgeyBlbmRCbG9jaywgZW5kSW5saW5lIH0gPSBzdGF0ZVxuICAgIGNvbnN0IGlzVm9pZEJsb2NrID0gZW5kQmxvY2sgJiYgZW5kQmxvY2suaXNWb2lkXG4gICAgY29uc3QgaXNWb2lkSW5saW5lID0gZW5kSW5saW5lICYmIGVuZElubGluZS5pc1ZvaWRcbiAgICBjb25zdCBpc1ZvaWQgPSBpc1ZvaWRCbG9jayB8fCBpc1ZvaWRJbmxpbmVcblxuICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gaXMgY29sbGFwc2VkLCBhbmQgaXQgaXNuJ3QgaW5zaWRlIGEgdm9pZCBub2RlLCBhYm9ydC5cbiAgICBpZiAobmF0aXZlLmlzQ29sbGFwc2VkICYmICFpc1ZvaWQpIHJldHVyblxuXG4gICAgY29uc3QgeyBmcmFnbWVudCB9ID0gZGF0YVxuICAgIGNvbnN0IGVuY29kZWQgPSBCYXNlNjQuc2VyaWFsaXplTm9kZShmcmFnbWVudClcbiAgICBjb25zdCByYW5nZSA9IG5hdGl2ZS5nZXRSYW5nZUF0KDApXG4gICAgbGV0IGNvbnRlbnRzID0gcmFuZ2UuY2xvbmVDb250ZW50cygpXG4gICAgbGV0IGF0dGFjaCA9IGNvbnRlbnRzLmNoaWxkTm9kZXNbMF1cblxuICAgIC8vIElmIHRoZSBlbmQgbm9kZSBpcyBhIHZvaWQgbm9kZSwgd2UgbmVlZCB0byBtb3ZlIHRoZSBlbmQgb2YgdGhlIHJhbmdlIGZyb21cbiAgICAvLyB0aGUgdm9pZCBub2RlJ3Mgc3BhY2VyIHNwYW4sIHRvIHRoZSBlbmQgb2YgdGhlIHZvaWQgbm9kZSdzIGNvbnRlbnQuXG4gICAgaWYgKGlzVm9pZCkge1xuICAgICAgY29uc3QgciA9IHJhbmdlLmNsb25lUmFuZ2UoKVxuICAgICAgY29uc3Qgbm9kZSA9IGZpbmRET01Ob2RlKGlzVm9pZEJsb2NrID8gZW5kQmxvY2sgOiBlbmRJbmxpbmUpXG4gICAgICByLnNldEVuZEFmdGVyKG5vZGUpXG4gICAgICBjb250ZW50cyA9IHIuY2xvbmVDb250ZW50cygpXG4gICAgICBhdHRhY2ggPSBjb250ZW50cy5jaGlsZE5vZGVzW2NvbnRlbnRzLmNoaWxkTm9kZXMubGVuZ3RoIC0gMV0uZmlyc3RDaGlsZFxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgemVyby13aWR0aCBzcGFjZSBzcGFucyBmcm9tIHRoZSBjbG9uZWQgRE9NIHNvIHRoYXQgdGhleSBkb24ndFxuICAgIC8vIHNob3cgdXAgZWxzZXdoZXJlIHdoZW4gcGFzdGVkLlxuICAgIGNvbnN0IHp3cyA9IFtdLnNsaWNlLmNhbGwoY29udGVudHMucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2xhdGUtemVyby13aWR0aF0nKSlcbiAgICB6d3MuZm9yRWFjaCh6dyA9PiB6dy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHp3KSlcblxuICAgIC8vIENPTVBBVDogSW4gQ2hyb21lIGFuZCBTYWZhcmksIGlmIHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvbiB0b1xuICAgIC8vIGNvcHkgaGFzIGBjb250ZW50ZWRpdGFibGU9XCJmYWxzZVwiYCB0aGUgY29weSB3aWxsIGZhaWwsIGFuZCBub3RoaW5nIHdpbGxcbiAgICAvLyBiZSBwdXQgaW4gdGhlIGNsaXBib2FyZC4gU28gd2UgcmVtb3ZlIHRoZW0gYWxsLiAoMjAxNy8wNS8wNClcbiAgICBpZiAoSVNfQ0hST01FIHx8IElTX1NBRkFSSSkge1xuICAgICAgY29uc3QgZWxzID0gW10uc2xpY2UuY2FsbChjb250ZW50cy5xdWVyeVNlbGVjdG9yQWxsKCdbY29udGVudGVkaXRhYmxlPVwiZmFsc2VcIl0nKSlcbiAgICAgIGVscy5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZUF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpXG4gICAgfVxuXG4gICAgLy8gU2V0IGEgYGRhdGEtc2xhdGUtZnJhZ21lbnRgIGF0dHJpYnV0ZSBvbiBhIG5vbi1lbXB0eSBub2RlLCBzbyBpdCBzaG93cyB1cFxuICAgIC8vIGluIHRoZSBIVE1MLCBhbmQgY2FuIGJlIHVzZWQgZm9yIGludHJhLVNsYXRlIHBhc3RpbmcuIElmIGl0J3MgYSB0ZXh0XG4gICAgLy8gbm9kZSwgd3JhcCBpdCBpbiBhIGA8c3Bhbj5gIHNvIHdlIGhhdmUgc29tZXRoaW5nIHRvIHNldCBhbiBhdHRyaWJ1dGUgb24uXG4gICAgaWYgKGF0dGFjaC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICBjb25zdCBzcGFuID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgc3Bhbi5hcHBlbmRDaGlsZChhdHRhY2gpXG4gICAgICBjb250ZW50cy5hcHBlbmRDaGlsZChzcGFuKVxuICAgICAgYXR0YWNoID0gc3BhblxuICAgIH1cblxuICAgIGF0dGFjaC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2xhdGUtZnJhZ21lbnQnLCBlbmNvZGVkKVxuXG4gICAgLy8gQWRkIHRoZSBwaG9ueSBjb250ZW50IHRvIHRoZSBET00sIGFuZCBzZWxlY3QgaXQsIHNvIGl0IHdpbGwgYmUgY29waWVkLlxuICAgIGNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXG4gICAgY29uc3QgZGl2ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2LnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSlcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgZGl2LnN0eWxlLmxlZnQgPSAnLTk5OTlweCdcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY29udGVudHMpXG4gICAgYm9keS5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICAvLyBDT01QQVQ6IEluIEZpcmVmb3gsIHRyeWluZyB0byB1c2UgdGhlIHRlcnNlciBgbmF0aXZlLnNlbGVjdEFsbENoaWxkcmVuYFxuICAgIC8vIHRocm93cyBhbiBlcnJvciwgc28gd2UgdXNlIHRoZSBvbGRlciBgcmFuZ2VgIGVxdWl2YWxlbnQuICgyMDE2LzA2LzIxKVxuICAgIGNvbnN0IHIgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKVxuICAgIHIuc2VsZWN0Tm9kZUNvbnRlbnRzKGRpdilcbiAgICBuYXRpdmUucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBuYXRpdmUuYWRkUmFuZ2UocilcblxuICAgIC8vIFJldmVydCB0byB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHJpZ2h0IGFmdGVyIGNvcHlpbmcuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBib2R5LnJlbW92ZUNoaWxkKGRpdilcbiAgICAgIG5hdGl2ZS5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgbmF0aXZlLmFkZFJhbmdlKHJhbmdlKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogT24gZHJvcC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uRHJvcChlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBkZWJ1Zygnb25Ecm9wJywgeyBkYXRhIH0pXG5cbiAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgcmV0dXJuIG9uRHJvcFRleHQoZSwgZGF0YSwgY2hhbmdlKVxuICAgICAgY2FzZSAnZnJhZ21lbnQnOlxuICAgICAgICByZXR1cm4gb25Ecm9wRnJhZ21lbnQoZSwgZGF0YSwgY2hhbmdlKVxuICAgICAgY2FzZSAnbm9kZSc6XG4gICAgICAgIHJldHVybiBvbkRyb3BOb2RlKGUsIGRhdGEsIGNoYW5nZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gZHJvcCBub2RlLCBpbnNlcnQgdGhlIG5vZGUgd2hlcmV2ZXIgaXQgaXMgZHJvcHBlZC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uRHJvcE5vZGUoZSwgZGF0YSwgY2hhbmdlKSB7XG4gICAgZGVidWcoJ29uRHJvcE5vZGUnLCB7IGRhdGEgfSlcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuICAgIGxldCB7IG5vZGUsIHRhcmdldCwgaXNJbnRlcm5hbCB9ID0gZGF0YVxuXG4gICAgLy8gSWYgdGhlIGRyYWcgaXMgaW50ZXJuYWwgYW5kIHRoZSB0YXJnZXQgaXMgYWZ0ZXIgdGhlIHNlbGVjdGlvbiwgaXRcbiAgICAvLyBuZWVkcyB0byBhY2NvdW50IGZvciB0aGUgc2VsZWN0aW9uJ3MgY29udGVudCBiZWluZyBkZWxldGVkLlxuICAgIGlmIChcbiAgICAgIGlzSW50ZXJuYWwgJiZcbiAgICAgIHNlbGVjdGlvbi5lbmRLZXkgPT0gdGFyZ2V0LmVuZEtleSAmJlxuICAgICAgc2VsZWN0aW9uLmVuZE9mZnNldCA8IHRhcmdldC5lbmRPZmZzZXRcbiAgICApIHtcbiAgICAgIHRhcmdldCA9IHRhcmdldC5tb3ZlKHNlbGVjdGlvbi5zdGFydEtleSA9PSBzZWxlY3Rpb24uZW5kS2V5XG4gICAgICAgID8gMCAtIHNlbGVjdGlvbi5lbmRPZmZzZXQgKyBzZWxlY3Rpb24uc3RhcnRPZmZzZXRcbiAgICAgICAgOiAwIC0gc2VsZWN0aW9uLmVuZE9mZnNldClcbiAgICB9XG5cbiAgICBpZiAoaXNJbnRlcm5hbCkge1xuICAgICAgY2hhbmdlLmRlbGV0ZSgpXG4gICAgfVxuXG4gICAgaWYgKEJsb2NrLmlzQmxvY2sobm9kZSkpIHtcbiAgICAgIGNoYW5nZVxuICAgICAgICAuc2VsZWN0KHRhcmdldClcbiAgICAgICAgLmluc2VydEJsb2NrKG5vZGUpXG4gICAgICAgIC5yZW1vdmVOb2RlQnlLZXkobm9kZS5rZXkpXG4gICAgfVxuXG4gICAgaWYgKElubGluZS5pc0lubGluZShub2RlKSkge1xuICAgICAgY2hhbmdlXG4gICAgICAgIC5zZWxlY3QodGFyZ2V0KVxuICAgICAgICAuaW5zZXJ0SW5saW5lKG5vZGUpXG4gICAgICAgIC5yZW1vdmVOb2RlQnlLZXkobm9kZS5rZXkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGRyb3AgZnJhZ21lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbkRyb3BGcmFnbWVudChlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBkZWJ1Zygnb25Ecm9wRnJhZ21lbnQnLCB7IGRhdGEgfSlcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuICAgIGxldCB7IGZyYWdtZW50LCB0YXJnZXQsIGlzSW50ZXJuYWwgfSA9IGRhdGFcblxuICAgIC8vIElmIHRoZSBkcmFnIGlzIGludGVybmFsIGFuZCB0aGUgdGFyZ2V0IGlzIGFmdGVyIHRoZSBzZWxlY3Rpb24sIGl0XG4gICAgLy8gbmVlZHMgdG8gYWNjb3VudCBmb3IgdGhlIHNlbGVjdGlvbidzIGNvbnRlbnQgYmVpbmcgZGVsZXRlZC5cbiAgICBpZiAoXG4gICAgICBpc0ludGVybmFsICYmXG4gICAgICBzZWxlY3Rpb24uZW5kS2V5ID09IHRhcmdldC5lbmRLZXkgJiZcbiAgICAgIHNlbGVjdGlvbi5lbmRPZmZzZXQgPCB0YXJnZXQuZW5kT2Zmc2V0XG4gICAgKSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQubW92ZShzZWxlY3Rpb24uc3RhcnRLZXkgPT0gc2VsZWN0aW9uLmVuZEtleVxuICAgICAgICA/IDAgLSBzZWxlY3Rpb24uZW5kT2Zmc2V0ICsgc2VsZWN0aW9uLnN0YXJ0T2Zmc2V0XG4gICAgICAgIDogMCAtIHNlbGVjdGlvbi5lbmRPZmZzZXQpXG4gICAgfVxuXG4gICAgaWYgKGlzSW50ZXJuYWwpIHtcbiAgICAgIGNoYW5nZS5kZWxldGUoKVxuICAgIH1cblxuICAgIGNoYW5nZVxuICAgICAgLnNlbGVjdCh0YXJnZXQpXG4gICAgICAuaW5zZXJ0RnJhZ21lbnQoZnJhZ21lbnQpXG4gIH1cblxuICAvKipcbiAgICogT24gZHJvcCB0ZXh0LCBzcGxpdCB0aGUgYmxvY2tzIGF0IG5ldyBsaW5lcy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uRHJvcFRleHQoZSwgZGF0YSwgY2hhbmdlKSB7XG4gICAgZGVidWcoJ29uRHJvcFRleHQnLCB7IGRhdGEgfSlcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gICAgY29uc3QgeyB0ZXh0LCB0YXJnZXQgfSA9IGRhdGFcbiAgICBjb25zdCB7IGFuY2hvcktleSB9ID0gdGFyZ2V0XG5cbiAgICBjaGFuZ2Uuc2VsZWN0KHRhcmdldClcblxuICAgIGxldCBoYXNWb2lkUGFyZW50ID0gZG9jdW1lbnQuaGFzVm9pZFBhcmVudChhbmNob3JLZXkpXG5cbiAgICAvLyBJbnNlcnQgdGV4dCBpbnRvIG5lYXJlc3QgdGV4dCBub2RlXG4gICAgaWYgKGhhc1ZvaWRQYXJlbnQpIHtcbiAgICAgIGxldCBub2RlID0gZG9jdW1lbnQuZ2V0Tm9kZShhbmNob3JLZXkpXG5cbiAgICAgIHdoaWxlIChoYXNWb2lkUGFyZW50KSB7XG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5nZXROZXh0VGV4dChub2RlLmtleSlcbiAgICAgICAgaWYgKCFub2RlKSBicmVha1xuICAgICAgICBoYXNWb2lkUGFyZW50ID0gZG9jdW1lbnQuaGFzVm9pZFBhcmVudChub2RlLmtleSlcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUpIGNoYW5nZS5jb2xsYXBzZVRvU3RhcnRPZihub2RlKVxuICAgIH1cblxuICAgIHRleHRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5mb3JFYWNoKChsaW5lLCBpKSA9PiB7XG4gICAgICAgIGlmIChpID4gMCkgY2hhbmdlLnNwbGl0QmxvY2soKVxuICAgICAgICBjaGFuZ2UuaW5zZXJ0VGV4dChsaW5lKVxuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBrZXkgZG93bi5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uS2V5RG93bihlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBkZWJ1Zygnb25LZXlEb3duJywgeyBkYXRhIH0pXG5cbiAgICBzd2l0Y2ggKGRhdGEua2V5KSB7XG4gICAgICBjYXNlICdlbnRlcic6IHJldHVybiBvbktleURvd25FbnRlcihlLCBkYXRhLCBjaGFuZ2UpXG4gICAgICBjYXNlICdiYWNrc3BhY2UnOiByZXR1cm4gb25LZXlEb3duQmFja3NwYWNlKGUsIGRhdGEsIGNoYW5nZSlcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6IHJldHVybiBvbktleURvd25EZWxldGUoZSwgZGF0YSwgY2hhbmdlKVxuICAgICAgY2FzZSAnbGVmdCc6IHJldHVybiBvbktleURvd25MZWZ0KGUsIGRhdGEsIGNoYW5nZSlcbiAgICAgIGNhc2UgJ3JpZ2h0JzogcmV0dXJuIG9uS2V5RG93blJpZ2h0KGUsIGRhdGEsIGNoYW5nZSlcbiAgICAgIGNhc2UgJ3VwJzogcmV0dXJuIG9uS2V5RG93blVwKGUsIGRhdGEsIGNoYW5nZSlcbiAgICAgIGNhc2UgJ2Rvd24nOiByZXR1cm4gb25LZXlEb3duRG93bihlLCBkYXRhLCBjaGFuZ2UpXG4gICAgICBjYXNlICdkJzogcmV0dXJuIG9uS2V5RG93bkQoZSwgZGF0YSwgY2hhbmdlKVxuICAgICAgY2FzZSAnaCc6IHJldHVybiBvbktleURvd25IKGUsIGRhdGEsIGNoYW5nZSlcbiAgICAgIGNhc2UgJ2snOiByZXR1cm4gb25LZXlEb3duSyhlLCBkYXRhLCBjaGFuZ2UpXG4gICAgICBjYXNlICd5JzogcmV0dXJuIG9uS2V5RG93blkoZSwgZGF0YSwgY2hhbmdlKVxuICAgICAgY2FzZSAneic6IHJldHVybiBvbktleURvd25aKGUsIGRhdGEsIGNoYW5nZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gYGVudGVyYCBrZXkgZG93biwgc3BsaXQgdGhlIGN1cnJlbnQgYmxvY2sgaW4gaGFsZi5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uS2V5RG93bkVudGVyKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIHN0YXJ0S2V5IH0gPSBzdGF0ZVxuICAgIGNvbnN0IGhhc1ZvaWRQYXJlbnQgPSBkb2N1bWVudC5oYXNWb2lkUGFyZW50KHN0YXJ0S2V5KVxuXG4gICAgLy8gRm9yIHZvaWQgbm9kZXMsIHdlIGRvbid0IHdhbnQgdG8gc3BsaXQuIEluc3RlYWQgd2UganVzdCBtb3ZlIHRvIHRoZSBzdGFydFxuICAgIC8vIG9mIHRoZSBuZXh0IHRleHQgbm9kZSBpZiBvbmUgZXhpc3RzLlxuICAgIGlmIChoYXNWb2lkUGFyZW50KSB7XG4gICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0TmV4dFRleHQoc3RhcnRLZXkpXG4gICAgICBpZiAoIXRleHQpIHJldHVyblxuICAgICAgY2hhbmdlLmNvbGxhcHNlVG9TdGFydE9mKHRleHQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjaGFuZ2Uuc3BsaXRCbG9jaygpXG4gIH1cblxuICAvKipcbiAgICogT24gYGJhY2tzcGFjZWAga2V5IGRvd24sIGRlbGV0ZSBiYWNrd2FyZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25CYWNrc3BhY2UoZSwgZGF0YSwgY2hhbmdlKSB7XG4gICAgbGV0IGJvdW5kYXJ5ID0gJ0NoYXInXG4gICAgaWYgKGRhdGEuaXNXb3JkKSBib3VuZGFyeSA9ICdXb3JkJ1xuICAgIGlmIChkYXRhLmlzTGluZSkgYm91bmRhcnkgPSAnTGluZSdcbiAgICBjaGFuZ2VbYGRlbGV0ZSR7Ym91bmRhcnl9QmFja3dhcmRgXSgpXG4gIH1cblxuICAvKipcbiAgICogT24gYGRlbGV0ZWAga2V5IGRvd24sIGRlbGV0ZSBmb3J3YXJkcy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uS2V5RG93bkRlbGV0ZShlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBsZXQgYm91bmRhcnkgPSAnQ2hhcidcbiAgICBpZiAoZGF0YS5pc1dvcmQpIGJvdW5kYXJ5ID0gJ1dvcmQnXG4gICAgaWYgKGRhdGEuaXNMaW5lKSBib3VuZGFyeSA9ICdMaW5lJ1xuICAgIGNoYW5nZVtgZGVsZXRlJHtib3VuZGFyeX1Gb3J3YXJkYF0oKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGBsZWZ0YCBrZXkgZG93biwgbW92ZSBiYWNrd2FyZC5cbiAgICpcbiAgICogQ09NUEFUOiBUaGlzIGlzIHJlcXVpcmVkIHRvIG1ha2UgbmF2aWdhdGluZyB3aXRoIHRoZSBsZWZ0IGFycm93IHdvcmsgd2hlblxuICAgKiBhIHZvaWQgbm9kZSBpcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQ09NUEFUOiBUaGlzIGlzIGFsc28gcmVxdWlyZWQgdG8gc29sdmUgZm9yIHRoZSBjYXNlIHdoZXJlIGFuIGlubGluZSBub2RlIGlzXG4gICAqIHN1cnJvdW5kZWQgYnkgZW1wdHkgdGV4dCBub2RlcyB3aXRoIHplcm8td2lkdGggc3BhY2VzIGluIHRoZW0uIFdpdGhvdXQgdGhpc1xuICAgKiB0aGUgemVyby13aWR0aCBzcGFjZXMgd2lsbCBjYXVzZSB0d28gYXJyb3cga2V5cyB0byBqdW1wIHRvIHRoZSBuZXh0IHRleHQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25MZWZ0KGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuXG4gICAgaWYgKGRhdGEuaXNDdHJsKSByZXR1cm5cbiAgICBpZiAoZGF0YS5pc0FsdCkgcmV0dXJuXG4gICAgaWYgKHN0YXRlLmlzRXhwYW5kZWQpIHJldHVyblxuXG4gICAgY29uc3QgeyBkb2N1bWVudCwgc3RhcnRLZXksIHN0YXJ0VGV4dCB9ID0gc3RhdGVcbiAgICBjb25zdCBoYXNWb2lkUGFyZW50ID0gZG9jdW1lbnQuaGFzVm9pZFBhcmVudChzdGFydEtleSlcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IHRleHQgbm9kZSBpcyBlbXB0eSwgb3Igd2UncmUgaW5zaWRlIGEgdm9pZCBwYXJlbnQsIHdlJ3JlXG4gICAgLy8gZ29pbmcgdG8gbmVlZCB0byBoYW5kbGUgdGhlIHNlbGVjdGlvbiBiZWhhdmlvci5cbiAgICBpZiAoc3RhcnRUZXh0LnRleHQgPT0gJycgfHwgaGFzVm9pZFBhcmVudCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjb25zdCBwcmV2aW91cyA9IGRvY3VtZW50LmdldFByZXZpb3VzVGV4dChzdGFydEtleSlcblxuICAgICAgLy8gSWYgdGhlcmUncyBubyBwcmV2aW91cyB0ZXh0IG5vZGUgaW4gdGhlIGRvY3VtZW50LCBhYm9ydC5cbiAgICAgIGlmICghcHJldmlvdXMpIHJldHVyblxuXG4gICAgICAvLyBJZiB0aGUgcHJldmlvdXMgdGV4dCBpcyBpbiB0aGUgY3VycmVudCBibG9jaywgYW5kIGluc2lkZSBhIG5vbi12b2lkXG4gICAgICAvLyBpbmxpbmUgbm9kZSwgbW92ZSBvbmUgY2hhcmFjdGVyIGludG8gdGhlIGlubGluZSBub2RlLlxuICAgICAgY29uc3QgeyBzdGFydEJsb2NrIH0gPSBzdGF0ZVxuICAgICAgY29uc3QgcHJldmlvdXNCbG9jayA9IGRvY3VtZW50LmdldENsb3Nlc3RCbG9jayhwcmV2aW91cy5rZXkpXG4gICAgICBjb25zdCBwcmV2aW91c0lubGluZSA9IGRvY3VtZW50LmdldENsb3Nlc3RJbmxpbmUocHJldmlvdXMua2V5KVxuXG4gICAgICBpZiAocHJldmlvdXNCbG9jayA9PT0gc3RhcnRCbG9jayAmJiBwcmV2aW91c0lubGluZSAmJiAhcHJldmlvdXNJbmxpbmUuaXNWb2lkKSB7XG4gICAgICAgIGNvbnN0IGV4dGVuZE9yTW92ZSA9IGRhdGEuaXNTaGlmdCA/ICdleHRlbmQnIDogJ21vdmUnXG4gICAgICAgIGNoYW5nZS5jb2xsYXBzZVRvRW5kT2YocHJldmlvdXMpW2V4dGVuZE9yTW92ZV0oLTEpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBPdGhlcndpc2UsIG1vdmUgdG8gdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgbm9kZS5cbiAgICAgIGNoYW5nZS5jb2xsYXBzZVRvRW5kT2YocHJldmlvdXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGByaWdodGAga2V5IGRvd24sIG1vdmUgZm9yd2FyZC5cbiAgICpcbiAgICogQ09NUEFUOiBUaGlzIGlzIHJlcXVpcmVkIHRvIG1ha2UgbmF2aWdhdGluZyB3aXRoIHRoZSByaWdodCBhcnJvdyB3b3JrIHdoZW5cbiAgICogYSB2b2lkIG5vZGUgaXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIENPTVBBVDogVGhpcyBpcyBhbHNvIHJlcXVpcmVkIHRvIHNvbHZlIGZvciB0aGUgY2FzZSB3aGVyZSBhbiBpbmxpbmUgbm9kZSBpc1xuICAgKiBzdXJyb3VuZGVkIGJ5IGVtcHR5IHRleHQgbm9kZXMgd2l0aCB6ZXJvLXdpZHRoIHNwYWNlcyBpbiB0aGVtLiBXaXRob3V0IHRoaXNcbiAgICogdGhlIHplcm8td2lkdGggc3BhY2VzIHdpbGwgY2F1c2UgdHdvIGFycm93IGtleXMgdG8ganVtcCB0byB0aGUgbmV4dCB0ZXh0LlxuICAgKlxuICAgKiBDT01QQVQ6IEluIENocm9tZSAmIFNhZmFyaSwgc2VsZWN0aW9ucyB0aGF0IGFyZSBhdCB0aGUgemVybyBvZmZzZXQgb2ZcbiAgICogYW4gaW5saW5lIG5vZGUgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHJlcGxhY2VkIHRvIGJlIGF0IHRoZSBsYXN0IG9mZnNldFxuICAgKiBvZiBhIHByZXZpb3VzIGlubGluZSBub2RlLCB3aGljaCBzY3Jld3MgdXMgdXAsIHNvIHdlIG5ldmVyIHdhbnQgdG8gc2V0IHRoZVxuICAgKiBzZWxlY3Rpb24gdG8gdGhlIHZlcnkgc3RhcnQgb2YgYW4gaW5saW5lIG5vZGUgaGVyZS4gKDIwMTYvMTEvMjkpXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25SaWdodChlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcblxuICAgIGlmIChkYXRhLmlzQ3RybCkgcmV0dXJuXG4gICAgaWYgKGRhdGEuaXNBbHQpIHJldHVyblxuICAgIGlmIChzdGF0ZS5pc0V4cGFuZGVkKSByZXR1cm5cblxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIHN0YXJ0S2V5LCBzdGFydFRleHQgfSA9IHN0YXRlXG4gICAgY29uc3QgaGFzVm9pZFBhcmVudCA9IGRvY3VtZW50Lmhhc1ZvaWRQYXJlbnQoc3RhcnRLZXkpXG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCB0ZXh0IG5vZGUgaXMgZW1wdHksIG9yIHdlJ3JlIGluc2lkZSBhIHZvaWQgcGFyZW50LCB3ZSdyZVxuICAgIC8vIGdvaW5nIHRvIG5lZWQgdG8gaGFuZGxlIHRoZSBzZWxlY3Rpb24gYmVoYXZpb3IuXG4gICAgaWYgKHN0YXJ0VGV4dC50ZXh0ID09ICcnIHx8IGhhc1ZvaWRQYXJlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmdldE5leHRUZXh0KHN0YXJ0S2V5KVxuXG4gICAgICAvLyBJZiB0aGVyZSdzIG5vIG5leHQgdGV4dCBub2RlIGluIHRoZSBkb2N1bWVudCwgYWJvcnQuXG4gICAgICBpZiAoIW5leHQpIHJldHVyblxuXG4gICAgICAvLyBJZiB0aGUgbmV4dCB0ZXh0IGlzIGluc2lkZSBhIHZvaWQgbm9kZSwgbW92ZSB0byB0aGUgZW5kIG9mIGl0LlxuICAgICAgaWYgKGRvY3VtZW50Lmhhc1ZvaWRQYXJlbnQobmV4dC5rZXkpKSB7XG4gICAgICAgIGNoYW5nZS5jb2xsYXBzZVRvRW5kT2YobmV4dClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBuZXh0IHRleHQgaXMgaW4gdGhlIGN1cnJlbnQgYmxvY2ssIGFuZCBpbnNpZGUgYW4gaW5saW5lIG5vZGUsXG4gICAgICAvLyBtb3ZlIG9uZSBjaGFyYWN0ZXIgaW50byB0aGUgaW5saW5lIG5vZGUuXG4gICAgICBjb25zdCB7IHN0YXJ0QmxvY2sgfSA9IHN0YXRlXG4gICAgICBjb25zdCBuZXh0QmxvY2sgPSBkb2N1bWVudC5nZXRDbG9zZXN0QmxvY2sobmV4dC5rZXkpXG4gICAgICBjb25zdCBuZXh0SW5saW5lID0gZG9jdW1lbnQuZ2V0Q2xvc2VzdElubGluZShuZXh0LmtleSlcblxuICAgICAgaWYgKG5leHRCbG9jayA9PSBzdGFydEJsb2NrICYmIG5leHRJbmxpbmUpIHtcbiAgICAgICAgY29uc3QgZXh0ZW5kT3JNb3ZlID0gZGF0YS5pc1NoaWZ0ID8gJ2V4dGVuZCcgOiAnbW92ZSdcbiAgICAgICAgY2hhbmdlLmNvbGxhcHNlVG9TdGFydE9mKG5leHQpW2V4dGVuZE9yTW92ZV0oMSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSwgbW92ZSB0byB0aGUgc3RhcnQgb2YgdGhlIG5leHQgdGV4dCBub2RlLlxuICAgICAgY2hhbmdlLmNvbGxhcHNlVG9TdGFydE9mKG5leHQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGB1cGAga2V5IGRvd24sIGZvciBNYWNzLCBtb3ZlIHRoZSBzZWxlY3Rpb24gdG8gc3RhcnQgb2YgdGhlIGJsb2NrLlxuICAgKlxuICAgKiBDT01QQVQ6IENlcnRhaW4gYnJvd3NlcnMgZG9uJ3QgaGFuZGxlIHRoZSBzZWxlY3Rpb24gdXBkYXRlcyBwcm9wZXJseS4gSW5cbiAgICogQ2hyb21lLCBvcHRpb24tc2hpZnQtdXAgZG9lc24ndCBwcm9wZXJseSBleHRlbmQgdGhlIHNlbGVjdGlvbi4gQW5kIGluXG4gICAqIEZpcmVmb3gsIG9wdGlvbi11cCBkb2Vzbid0IHByb3Blcmx5IG1vdmUgdGhlIHNlbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uS2V5RG93blVwKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGlmICghSVNfTUFDIHx8IGRhdGEuaXNDdHJsIHx8ICFkYXRhLmlzQWx0KSByZXR1cm5cblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgc2VsZWN0aW9uLCBkb2N1bWVudCwgZm9jdXNLZXksIGZvY3VzQmxvY2sgfSA9IHN0YXRlXG4gICAgY29uc3QgdHJhbnNmb3JtID0gZGF0YS5pc1NoaWZ0ID8gJ2V4dGVuZFRvU3RhcnRPZicgOiAnY29sbGFwc2VUb1N0YXJ0T2YnXG4gICAgY29uc3QgYmxvY2sgPSBzZWxlY3Rpb24uaGFzRm9jdXNBdFN0YXJ0T2YoZm9jdXNCbG9jaylcbiAgICAgID8gZG9jdW1lbnQuZ2V0UHJldmlvdXNCbG9jayhmb2N1c0tleSlcbiAgICAgIDogZm9jdXNCbG9ja1xuXG4gICAgaWYgKCFibG9jaykgcmV0dXJuXG4gICAgY29uc3QgdGV4dCA9IGJsb2NrLmdldEZpcnN0VGV4dCgpXG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBjaGFuZ2VbdHJhbnNmb3JtXSh0ZXh0KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGBkb3duYCBrZXkgZG93biwgZm9yIE1hY3MsIG1vdmUgdGhlIHNlbGVjdGlvbiB0byBlbmQgb2YgdGhlIGJsb2NrLlxuICAgKlxuICAgKiBDT01QQVQ6IENlcnRhaW4gYnJvd3NlcnMgZG9uJ3QgaGFuZGxlIHRoZSBzZWxlY3Rpb24gdXBkYXRlcyBwcm9wZXJseS4gSW5cbiAgICogQ2hyb21lLCBvcHRpb24tc2hpZnQtZG93biBkb2Vzbid0IHByb3Blcmx5IGV4dGVuZCB0aGUgc2VsZWN0aW9uLiBBbmQgaW5cbiAgICogRmlyZWZveCwgb3B0aW9uLWRvd24gZG9lc24ndCBwcm9wZXJseSBtb3ZlIHRoZSBzZWxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25Eb3duKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGlmICghSVNfTUFDIHx8IGRhdGEuaXNDdHJsIHx8ICFkYXRhLmlzQWx0KSByZXR1cm5cblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgc2VsZWN0aW9uLCBkb2N1bWVudCwgZm9jdXNLZXksIGZvY3VzQmxvY2sgfSA9IHN0YXRlXG4gICAgY29uc3QgdHJhbnNmb3JtID0gZGF0YS5pc1NoaWZ0ID8gJ2V4dGVuZFRvRW5kT2YnIDogJ2NvbGxhcHNlVG9FbmRPZidcbiAgICBjb25zdCBibG9jayA9IHNlbGVjdGlvbi5oYXNGb2N1c0F0RW5kT2YoZm9jdXNCbG9jaylcbiAgICAgID8gZG9jdW1lbnQuZ2V0TmV4dEJsb2NrKGZvY3VzS2V5KVxuICAgICAgOiBmb2N1c0Jsb2NrXG5cbiAgICBpZiAoIWJsb2NrKSByZXR1cm5cbiAgICBjb25zdCB0ZXh0ID0gYmxvY2suZ2V0TGFzdFRleHQoKVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY2hhbmdlW3RyYW5zZm9ybV0odGV4dClcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBgZGAga2V5IGRvd24sIGZvciBNYWNzLCBkZWxldGUgb25lIGNoYXJhY3RlciBmb3J3YXJkLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICovXG5cbiAgZnVuY3Rpb24gb25LZXlEb3duRChlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBpZiAoIUlTX01BQyB8fCAhZGF0YS5pc0N0cmwpIHJldHVyblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNoYW5nZS5kZWxldGVDaGFyRm9yd2FyZCgpXG4gIH1cblxuICAvKipcbiAgICogT24gYGhgIGtleSBkb3duLCBmb3IgTWFjcywgZGVsZXRlIHVudGlsIHRoZSBlbmQgb2YgdGhlIGxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25IKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGlmICghSVNfTUFDIHx8ICFkYXRhLmlzQ3RybCkgcmV0dXJuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY2hhbmdlLmRlbGV0ZUNoYXJCYWNrd2FyZCgpXG4gIH1cblxuICAvKipcbiAgICogT24gYGtgIGtleSBkb3duLCBmb3IgTWFjcywgZGVsZXRlIHVudGlsIHRoZSBlbmQgb2YgdGhlIGxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25LKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGlmICghSVNfTUFDIHx8ICFkYXRhLmlzQ3RybCkgcmV0dXJuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY2hhbmdlLmRlbGV0ZUxpbmVGb3J3YXJkKClcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBgeWAga2V5IGRvd24sIHJlZG8uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvbktleURvd25ZKGUsIGRhdGEsIGNoYW5nZSkge1xuICAgIGlmICghZGF0YS5pc01vZCkgcmV0dXJuXG4gICAgY2hhbmdlLnJlZG8oKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGB6YCBrZXkgZG93biwgdW5kbyBvciByZWRvLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICovXG5cbiAgZnVuY3Rpb24gb25LZXlEb3duWihlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBpZiAoIWRhdGEuaXNNb2QpIHJldHVyblxuICAgIGNoYW5nZVtkYXRhLmlzU2hpZnQgPyAncmVkbycgOiAndW5kbyddKClcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBwYXN0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uUGFzdGUoZSwgZGF0YSwgY2hhbmdlKSB7XG4gICAgZGVidWcoJ29uUGFzdGUnLCB7IGRhdGEgfSlcblxuICAgIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdmcmFnbWVudCc6XG4gICAgICAgIHJldHVybiBvblBhc3RlRnJhZ21lbnQoZSwgZGF0YSwgY2hhbmdlKVxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgcmV0dXJuIG9uUGFzdGVUZXh0KGUsIGRhdGEsIGNoYW5nZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gcGFzdGUgZnJhZ21lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvblBhc3RlRnJhZ21lbnQoZSwgZGF0YSwgY2hhbmdlKSB7XG4gICAgZGVidWcoJ29uUGFzdGVGcmFnbWVudCcsIHsgZGF0YSB9KVxuICAgIGNoYW5nZS5pbnNlcnRGcmFnbWVudChkYXRhLmZyYWdtZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIHBhc3RlIHRleHQsIHNwbGl0IGJsb2NrcyBhdCBuZXcgbGluZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICAgKi9cblxuICBmdW5jdGlvbiBvblBhc3RlVGV4dChlLCBkYXRhLCBjaGFuZ2UpIHtcbiAgICBkZWJ1Zygnb25QYXN0ZVRleHQnLCB7IGRhdGEgfSlcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiwgc3RhcnRCbG9jayB9ID0gc3RhdGVcbiAgICBpZiAoc3RhcnRCbG9jay5pc1ZvaWQpIHJldHVyblxuXG4gICAgY29uc3QgeyB0ZXh0IH0gPSBkYXRhXG4gICAgY29uc3QgZGVmYXVsdEJsb2NrID0geyB0eXBlOiBzdGFydEJsb2NrLnR5cGUsIGRhdGE6IHN0YXJ0QmxvY2suZGF0YSB9XG4gICAgY29uc3QgZGVmYXVsdE1hcmtzID0gZG9jdW1lbnQuZ2V0TWFya3NBdFJhbmdlKHNlbGVjdGlvbi5jb2xsYXBzZVRvU3RhcnQoKSlcbiAgICBjb25zdCBmcmFnbWVudCA9IFBsYWluLmRlc2VyaWFsaXplKHRleHQsIHsgZGVmYXVsdEJsb2NrLCBkZWZhdWx0TWFya3MgfSkuZG9jdW1lbnRcbiAgICBjaGFuZ2UuaW5zZXJ0RnJhZ21lbnQoZnJhZ21lbnQpXG4gIH1cblxuICAvKipcbiAgICogT24gc2VsZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAgICovXG5cbiAgZnVuY3Rpb24gb25TZWxlY3QoZSwgZGF0YSwgY2hhbmdlKSB7XG4gICAgZGVidWcoJ29uU2VsZWN0JywgeyBkYXRhIH0pXG4gICAgY2hhbmdlLnNlbGVjdChkYXRhLnNlbGVjdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcGFyYW0ge0VkaXRvcn0gZWRpdG9yXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgZnVuY3Rpb24gcmVuZGVyKHByb3BzLCBzdGF0ZSwgZWRpdG9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb250ZW50XG4gICAgICAgIGF1dG9Db3JyZWN0PXtwcm9wcy5hdXRvQ29ycmVjdH1cbiAgICAgICAgYXV0b0ZvY3VzPXtwcm9wcy5hdXRvRm9jdXN9XG4gICAgICAgIGNsYXNzTmFtZT17cHJvcHMuY2xhc3NOYW1lfVxuICAgICAgICBjaGlsZHJlbj17cHJvcHMuY2hpbGRyZW59XG4gICAgICAgIGVkaXRvcj17ZWRpdG9yfVxuICAgICAgICBvbkJlZm9yZUlucHV0PXtlZGl0b3Iub25CZWZvcmVJbnB1dH1cbiAgICAgICAgb25CbHVyPXtlZGl0b3Iub25CbHVyfVxuICAgICAgICBvbkZvY3VzPXtlZGl0b3Iub25Gb2N1c31cbiAgICAgICAgb25Db3B5PXtlZGl0b3Iub25Db3B5fVxuICAgICAgICBvbkN1dD17ZWRpdG9yLm9uQ3V0fVxuICAgICAgICBvbkRyb3A9e2VkaXRvci5vbkRyb3B9XG4gICAgICAgIG9uS2V5RG93bj17ZWRpdG9yLm9uS2V5RG93bn1cbiAgICAgICAgb25LZXlVcD17ZWRpdG9yLm9uS2V5VXB9XG4gICAgICAgIG9uUGFzdGU9e2VkaXRvci5vblBhc3RlfVxuICAgICAgICBvblNlbGVjdD17ZWRpdG9yLm9uU2VsZWN0fVxuICAgICAgICByZWFkT25seT17cHJvcHMucmVhZE9ubHl9XG4gICAgICAgIHJvbGU9e3Byb3BzLnJvbGV9XG4gICAgICAgIHNjaGVtYT17ZWRpdG9yLmdldFNjaGVtYSgpfVxuICAgICAgICBzcGVsbENoZWNrPXtwcm9wcy5zcGVsbENoZWNrfVxuICAgICAgICBzdGF0ZT17c3RhdGV9XG4gICAgICAgIHN0eWxlPXtwcm9wcy5zdHlsZX1cbiAgICAgICAgdGFiSW5kZXg9e3Byb3BzLnRhYkluZGV4fVxuICAgICAgICB0YWdOYW1lPXtwcm9wcy50YWdOYW1lfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogQSBkZWZhdWx0IHNjaGVtYSBydWxlIHRvIHJlbmRlciBibG9jayBub2Rlcy5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAgY29uc3QgQkxPQ0tfUkVOREVSX1JVTEUgPSB7XG4gICAgbWF0Y2g6IChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gbm9kZS5raW5kID09ICdibG9jaydcbiAgICB9LFxuICAgIHJlbmRlcjogKHByb3BzKSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHsuLi5wcm9wcy5hdHRyaWJ1dGVzfSBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAge3BsYWNlaG9sZGVyXG4gICAgICAgICAgICA/IDxQbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17cGxhY2Vob2xkZXJDbGFzc05hbWV9XG4gICAgICAgICAgICAgICAgbm9kZT17cHJvcHMubm9kZX1cbiAgICAgICAgICAgICAgICBwYXJlbnQ9e3Byb3BzLnN0YXRlLmRvY3VtZW50fVxuICAgICAgICAgICAgICAgIHN0YXRlPXtwcm9wcy5zdGF0ZX1cbiAgICAgICAgICAgICAgICBzdHlsZT17cGxhY2Vob2xkZXJTdHlsZX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtwbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgPC9QbGFjZWhvbGRlcj5cbiAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgZGVmYXVsdCBzY2hlbWEgcnVsZSB0byByZW5kZXIgaW5saW5lIG5vZGVzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBjb25zdCBJTkxJTkVfUkVOREVSX1JVTEUgPSB7XG4gICAgbWF0Y2g6IChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gbm9kZS5raW5kID09ICdpbmxpbmUnXG4gICAgfSxcbiAgICByZW5kZXI6IChwcm9wcykgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gey4uLnByb3BzLmF0dHJpYnV0ZXN9IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIHtwcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZGVmYXVsdCByZW5kZXJpbmcgcnVsZXMgdG8gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAgY29uc3Qgc2NoZW1hID0ge1xuICAgIHJ1bGVzOiBbXG4gICAgICBCTE9DS19SRU5ERVJfUlVMRSxcbiAgICAgIElOTElORV9SRU5ERVJfUlVMRVxuICAgIF1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNvcmUgcGx1Z2luLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICByZXR1cm4ge1xuICAgIG9uQmVmb3JlQ2hhbmdlLFxuICAgIG9uQmVmb3JlSW5wdXQsXG4gICAgb25CbHVyLFxuICAgIG9uQ29weSxcbiAgICBvbkN1dCxcbiAgICBvbkRyb3AsXG4gICAgb25LZXlEb3duLFxuICAgIG9uUGFzdGUsXG4gICAgb25TZWxlY3QsXG4gICAgcmVuZGVyLFxuICAgIHNjaGVtYSxcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IFBsdWdpblxuIl19