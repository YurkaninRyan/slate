'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _raw = require('./raw');

var _raw2 = _interopRequireDefault(_raw);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * String.
 *
 * @type {String}
 */

var String = new _immutable.Record({
  kind: 'string',
  text: ''
});

/**
 * A rule to (de)serialize text nodes. This is automatically added to the HTML
 * serializer so that users don't have to worry about text-level serialization.
 *
 * @type {Object}
 */

var TEXT_RULE = {
  deserialize: function deserialize(el) {
    if (el.tagName == 'br') {
      return {
        kind: 'text',
        text: '\n'
      };
    }

    if (el.nodeName == '#text') {
      if (el.value && el.value.match(/<!--.*?-->/)) return;

      return {
        kind: 'text',
        text: el.value || el.nodeValue
      };
    }
  },
  serialize: function serialize(obj, children) {
    if (obj.kind == 'string') {
      return children.split('\n').reduce(function (array, text, i) {
        if (i != 0) array.push(_react2.default.createElement('br', null));
        array.push(text);
        return array;
      }, []);
    }
  }
};

/**
 * HTML serializer.
 *
 * @type {Html}
 */

var Html =

/**
 * Create a new serializer with `rules`.
 *
 * @param {Object} options
 *   @property {Array} rules
 *   @property {String|Object} defaultBlockType
 *   @property {Function} parseHtml
 */

function Html() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Html);

  _initialiseProps.call(this);

  this.rules = [].concat(_toConsumableArray(options.rules || []), [TEXT_RULE]);

  this.defaultBlockType = options.defaultBlockType || 'paragraph';

  // Set DOM parser function or fallback to native DOMParser if present.
  if (typeof options.parseHtml === 'function') {
    this.parseHtml = options.parseHtml;
  } else if (typeof DOMParser !== 'undefined') {
    this.parseHtml = function (html) {
      var parsed = new DOMParser().parseFromString(html, 'text/html');
      // Unwrap from <html> and <body>
      return parsed.childNodes[0].childNodes[1];
    };
  } else {
    throw new Error('Native DOMParser is not present in this environment; you must supply a parse function via options.parseHtml');
  }
}

/**
 * Deserialize pasted HTML.
 *
 * @param {String} html
 * @param {Object} options
 *   @property {Boolean} toRaw
 * @return {State}
 */

/**
 * Deserialize an array of DOM elements.
 *
 * @param {Array} elements
 * @return {Array}
 */

/**
 * Deserialize a DOM element.
 *
 * @param {Object} element
 * @return {Any}
 */

/**
 * Deserialize a `mark` object.
 *
 * @param {Object} mark
 * @return {Array}
 */

/**
 * Serialize a `state` object into an HTML string.
 *
 * @param {State} state
 * @param {Object} options
 *   @property {Boolean} render
 * @return {String|Array}
 */

/**
 * Serialize a `node`.
 *
 * @param {Node} node
 * @return {String}
 */

/**
 * Serialize a `range`.
 *
 * @param {Range} range
 * @return {String}
 */

/**
 * Serialize a `string`.
 *
 * @param {String} string
 * @return {String}
 */

/**
 * Filter out cruft newline nodes inserted by the DOM parser.
 *
 * @param {Object} element
 * @return {Boolean}
 */

;

/**
 * Add a unique key to a React `element`.
 *
 * @param {Element} element
 * @return {Element}
 */

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.deserialize = function (html) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var children = Array.from(_this.parseHtml(html).childNodes);
    var nodes = _this.deserializeElements(children);

    var defaultBlockType = _this.defaultBlockType;

    var defaults = typeof defaultBlockType == 'string' ? { type: defaultBlockType } : defaultBlockType;

    // HACK: ensure for now that all top-level inline are wrapped into a block.
    nodes = nodes.reduce(function (memo, node, i, original) {
      if (node.kind == 'block') {
        memo.push(node);
        return memo;
      }

      if (i > 0 && original[i - 1].kind != 'block') {
        var _block = memo[memo.length - 1];
        _block.nodes.push(node);
        return memo;
      }

      var block = _extends({
        kind: 'block',
        nodes: [node]
      }, defaults);

      memo.push(block);
      return memo;
    }, []);

    if (nodes.length === 0) {
      nodes = [_extends({
        kind: 'block',
        nodes: []
      }, defaults)];
    }

    var raw = {
      kind: 'state',
      document: {
        kind: 'document',
        nodes: nodes
      }
    };

    if (options.toRaw) {
      return raw;
    }

    var state = _raw2.default.deserialize(raw, { terse: true });
    return state;
  };

  this.deserializeElements = function () {
    var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var nodes = [];

    elements.filter(_this.cruftNewline).forEach(function (element) {
      var node = _this.deserializeElement(element);
      switch ((0, _typeOf2.default)(node)) {
        case 'array':
          nodes = nodes.concat(node);
          break;
        case 'object':
          nodes.push(node);
          break;
      }
    });

    return nodes;
  };

  this.deserializeElement = function (element) {
    var node = void 0;

    if (!element.tagName) {
      element.tagName = '';
    }

    var next = function next(elements) {
      if (typeof NodeList !== 'undefined' && elements instanceof NodeList) {
        elements = Array.from(elements);
      }
      switch ((0, _typeOf2.default)(elements)) {
        case 'array':
          return _this.deserializeElements(elements);
        case 'object':
          return _this.deserializeElement(elements);
        case 'null':
        case 'undefined':
          return;
        default:
          throw new Error('The `next` argument was called with invalid children: "' + elements + '".');
      }
    };

    for (var i = 0; i < _this.rules.length; i++) {
      var rule = _this.rules[i];
      if (!rule.deserialize) continue;
      var ret = rule.deserialize(element, next);
      var type = (0, _typeOf2.default)(ret);

      if (type != 'array' && type != 'object' && type != 'null' && type != 'undefined') {
        throw new Error('A rule returned an invalid deserialized representation: "' + node + '".');
      }

      if (ret === undefined) continue;
      if (ret === null) return null;

      node = ret.kind == 'mark' ? _this.deserializeMark(ret) : ret;
      break;
    }

    return node || next(element.childNodes);
  };

  this.deserializeMark = function (mark) {
    var type = mark.type,
        data = mark.data;


    var applyMark = function applyMark(node) {
      if (node.kind == 'mark') {
        return _this.deserializeMark(node);
      } else if (node.kind == 'text') {
        if (!node.ranges) node.ranges = [{ text: node.text }];
        node.ranges = node.ranges.map(function (range) {
          range.marks = range.marks || [];
          range.marks.push({ type: type, data: data });
          return range;
        });
      } else {
        node.nodes = node.nodes.map(applyMark);
      }

      return node;
    };

    return mark.nodes.reduce(function (nodes, node) {
      var ret = applyMark(node);
      if (Array.isArray(ret)) return nodes.concat(ret);
      nodes.push(ret);
      return nodes;
    }, []);
  };

  this.serialize = function (state) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var document = state.document;

    var elements = document.nodes.map(_this.serializeNode);
    if (options.render === false) return elements;

    var html = _server2.default.renderToStaticMarkup(_react2.default.createElement(
      'body',
      null,
      elements
    ));
    var inner = html.slice(6, -7);
    return inner;
  };

  this.serializeNode = function (node) {
    if (node.kind == 'text') {
      var ranges = node.getRanges();
      return ranges.map(_this.serializeRange);
    }

    var children = node.nodes.map(_this.serializeNode);

    for (var i = 0; i < _this.rules.length; i++) {
      var rule = _this.rules[i];
      if (!rule.serialize) continue;
      var ret = rule.serialize(node, children);
      if (ret) return addKey(ret);
    }

    throw new Error('No serializer defined for node of type "' + node.type + '".');
  };

  this.serializeRange = function (range) {
    var string = new String({ text: range.text });
    var text = _this.serializeString(string);

    return range.marks.reduce(function (children, mark) {
      for (var i = 0; i < _this.rules.length; i++) {
        var rule = _this.rules[i];
        if (!rule.serialize) continue;
        var ret = rule.serialize(mark, children);
        if (ret) return addKey(ret);
      }

      throw new Error('No serializer defined for mark of type "' + mark.type + '".');
    }, text);
  };

  this.serializeString = function (string) {
    for (var i = 0; i < _this.rules.length; i++) {
      var rule = _this.rules[i];
      if (!rule.serialize) continue;
      var ret = rule.serialize(string, string.text);
      if (ret) return ret;
    }
  };

  this.cruftNewline = function (element) {
    return !(element.nodeName == '#text' && element.value == '\n');
  };
};

var key = 0;

function addKey(element) {
  return _react2.default.cloneElement(element, { key: key++ });
}

/**
 * Export.
 *
 * @type {Html}
 */

exports.default = Html;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJpYWxpemVycy9odG1sLmpzIl0sIm5hbWVzIjpbIlN0cmluZyIsImtpbmQiLCJ0ZXh0IiwiVEVYVF9SVUxFIiwiZGVzZXJpYWxpemUiLCJlbCIsInRhZ05hbWUiLCJub2RlTmFtZSIsInZhbHVlIiwibWF0Y2giLCJub2RlVmFsdWUiLCJzZXJpYWxpemUiLCJvYmoiLCJjaGlsZHJlbiIsInNwbGl0IiwicmVkdWNlIiwiYXJyYXkiLCJpIiwicHVzaCIsIkh0bWwiLCJvcHRpb25zIiwicnVsZXMiLCJkZWZhdWx0QmxvY2tUeXBlIiwicGFyc2VIdG1sIiwiRE9NUGFyc2VyIiwiaHRtbCIsInBhcnNlZCIsInBhcnNlRnJvbVN0cmluZyIsImNoaWxkTm9kZXMiLCJFcnJvciIsIkFycmF5IiwiZnJvbSIsIm5vZGVzIiwiZGVzZXJpYWxpemVFbGVtZW50cyIsImRlZmF1bHRzIiwidHlwZSIsIm1lbW8iLCJub2RlIiwib3JpZ2luYWwiLCJibG9jayIsImxlbmd0aCIsInJhdyIsImRvY3VtZW50IiwidG9SYXciLCJzdGF0ZSIsInRlcnNlIiwiZWxlbWVudHMiLCJmaWx0ZXIiLCJjcnVmdE5ld2xpbmUiLCJmb3JFYWNoIiwiZWxlbWVudCIsImRlc2VyaWFsaXplRWxlbWVudCIsImNvbmNhdCIsIm5leHQiLCJOb2RlTGlzdCIsInJ1bGUiLCJyZXQiLCJ1bmRlZmluZWQiLCJkZXNlcmlhbGl6ZU1hcmsiLCJtYXJrIiwiZGF0YSIsImFwcGx5TWFyayIsInJhbmdlcyIsIm1hcCIsInJhbmdlIiwibWFya3MiLCJpc0FycmF5Iiwic2VyaWFsaXplTm9kZSIsInJlbmRlciIsInJlbmRlclRvU3RhdGljTWFya3VwIiwiaW5uZXIiLCJzbGljZSIsImdldFJhbmdlcyIsInNlcmlhbGl6ZVJhbmdlIiwiYWRkS2V5Iiwic3RyaW5nIiwic2VyaWFsaXplU3RyaW5nIiwia2V5IiwiY2xvbmVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7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LEtBQUtBLEtBQVAsRUFBNUIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7a0JBTWUxRCxJIiwiZmlsZSI6Imh0bWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBSYXcgZnJvbSAnLi9yYXcnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET01TZXJ2ZXIgZnJvbSAncmVhY3QtZG9tL3NlcnZlcidcbmltcG9ydCB0eXBlT2YgZnJvbSAndHlwZS1vZidcbmltcG9ydCB7IFJlY29yZCB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBTdHJpbmcuXG4gKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuXG5jb25zdCBTdHJpbmcgPSBuZXcgUmVjb3JkKHtcbiAga2luZDogJ3N0cmluZycsXG4gIHRleHQ6ICcnXG59KVxuXG4vKipcbiAqIEEgcnVsZSB0byAoZGUpc2VyaWFsaXplIHRleHQgbm9kZXMuIFRoaXMgaXMgYXV0b21hdGljYWxseSBhZGRlZCB0byB0aGUgSFRNTFxuICogc2VyaWFsaXplciBzbyB0aGF0IHVzZXJzIGRvbid0IGhhdmUgdG8gd29ycnkgYWJvdXQgdGV4dC1sZXZlbCBzZXJpYWxpemF0aW9uLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuY29uc3QgVEVYVF9SVUxFID0ge1xuXG4gIGRlc2VyaWFsaXplKGVsKSB7XG4gICAgaWYgKGVsLnRhZ05hbWUgPT0gJ2JyJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2luZDogJ3RleHQnLFxuICAgICAgICB0ZXh0OiAnXFxuJ1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbC5ub2RlTmFtZSA9PSAnI3RleHQnKSB7XG4gICAgICBpZiAoZWwudmFsdWUgJiYgZWwudmFsdWUubWF0Y2goLzwhLS0uKj8tLT4vKSkgcmV0dXJuXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtpbmQ6ICd0ZXh0JyxcbiAgICAgICAgdGV4dDogZWwudmFsdWUgfHwgZWwubm9kZVZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHNlcmlhbGl6ZShvYmosIGNoaWxkcmVuKSB7XG4gICAgaWYgKG9iai5raW5kID09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAucmVkdWNlKChhcnJheSwgdGV4dCwgaSkgPT4ge1xuICAgICAgICAgIGlmIChpICE9IDApIGFycmF5LnB1c2goPGJyIC8+KVxuICAgICAgICAgIGFycmF5LnB1c2godGV4dClcbiAgICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgfSwgW10pXG4gICAgfVxuICB9XG5cbn1cblxuLyoqXG4gKiBIVE1MIHNlcmlhbGl6ZXIuXG4gKlxuICogQHR5cGUge0h0bWx9XG4gKi9cblxuY2xhc3MgSHRtbCB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBzZXJpYWxpemVyIHdpdGggYHJ1bGVzYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogICBAcHJvcGVydHkge0FycmF5fSBydWxlc1xuICAgKiAgIEBwcm9wZXJ0eSB7U3RyaW5nfE9iamVjdH0gZGVmYXVsdEJsb2NrVHlwZVxuICAgKiAgIEBwcm9wZXJ0eSB7RnVuY3Rpb259IHBhcnNlSHRtbFxuICAgKi9cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnJ1bGVzID0gW1xuICAgICAgLi4uKG9wdGlvbnMucnVsZXMgfHwgW10pLFxuICAgICAgVEVYVF9SVUxFXG4gICAgXVxuXG4gICAgdGhpcy5kZWZhdWx0QmxvY2tUeXBlID0gb3B0aW9ucy5kZWZhdWx0QmxvY2tUeXBlIHx8ICdwYXJhZ3JhcGgnXG5cbiAgICAvLyBTZXQgRE9NIHBhcnNlciBmdW5jdGlvbiBvciBmYWxsYmFjayB0byBuYXRpdmUgRE9NUGFyc2VyIGlmIHByZXNlbnQuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnBhcnNlSHRtbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5wYXJzZUh0bWwgPSBvcHRpb25zLnBhcnNlSHRtbFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIERPTVBhcnNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMucGFyc2VIdG1sID0gKGh0bWwpID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJylcbiAgICAgICAgLy8gVW53cmFwIGZyb20gPGh0bWw+IGFuZCA8Ym9keT5cbiAgICAgICAgcmV0dXJuIHBhcnNlZC5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMV1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnTmF0aXZlIERPTVBhcnNlciBpcyBub3QgcHJlc2VudCBpbiB0aGlzIGVudmlyb25tZW50OyB5b3UgbXVzdCBzdXBwbHkgYSBwYXJzZSBmdW5jdGlvbiB2aWEgb3B0aW9ucy5wYXJzZUh0bWwnXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplIHBhc3RlZCBIVE1MLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdG9SYXdcbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplID0gKGh0bWwsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0aGlzLnBhcnNlSHRtbChodG1sKS5jaGlsZE5vZGVzKVxuICAgIGxldCBub2RlcyA9IHRoaXMuZGVzZXJpYWxpemVFbGVtZW50cyhjaGlsZHJlbilcblxuICAgIGNvbnN0IHsgZGVmYXVsdEJsb2NrVHlwZSB9ID0gdGhpc1xuICAgIGNvbnN0IGRlZmF1bHRzID0gdHlwZW9mIGRlZmF1bHRCbG9ja1R5cGUgPT0gJ3N0cmluZydcbiAgICAgID8geyB0eXBlOiBkZWZhdWx0QmxvY2tUeXBlIH1cbiAgICAgIDogZGVmYXVsdEJsb2NrVHlwZVxuXG4gICAgLy8gSEFDSzogZW5zdXJlIGZvciBub3cgdGhhdCBhbGwgdG9wLWxldmVsIGlubGluZSBhcmUgd3JhcHBlZCBpbnRvIGEgYmxvY2suXG4gICAgbm9kZXMgPSBub2Rlcy5yZWR1Y2UoKG1lbW8sIG5vZGUsIGksIG9yaWdpbmFsKSA9PiB7XG4gICAgICBpZiAobm9kZS5raW5kID09ICdibG9jaycpIHtcbiAgICAgICAgbWVtby5wdXNoKG5vZGUpXG4gICAgICAgIHJldHVybiBtZW1vXG4gICAgICB9XG5cbiAgICAgIGlmIChpID4gMCAmJiBvcmlnaW5hbFtpIC0gMV0ua2luZCAhPSAnYmxvY2snKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gbWVtb1ttZW1vLmxlbmd0aCAtIDFdXG4gICAgICAgIGJsb2NrLm5vZGVzLnB1c2gobm9kZSlcbiAgICAgICAgcmV0dXJuIG1lbW9cbiAgICAgIH1cblxuICAgICAgY29uc3QgYmxvY2sgPSB7XG4gICAgICAgIGtpbmQ6ICdibG9jaycsXG4gICAgICAgIG5vZGVzOiBbbm9kZV0sXG4gICAgICAgIC4uLmRlZmF1bHRzXG4gICAgICB9XG5cbiAgICAgIG1lbW8ucHVzaChibG9jaylcbiAgICAgIHJldHVybiBtZW1vXG4gICAgfSwgW10pXG5cbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBub2RlcyA9IFt7XG4gICAgICAgIGtpbmQ6ICdibG9jaycsXG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgLi4uZGVmYXVsdHNcbiAgICAgIH1dXG4gICAgfVxuXG4gICAgY29uc3QgcmF3ID0ge1xuICAgICAga2luZDogJ3N0YXRlJyxcbiAgICAgIGRvY3VtZW50OiB7XG4gICAgICAgIGtpbmQ6ICdkb2N1bWVudCcsXG4gICAgICAgIG5vZGVzLFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnRvUmF3KSB7XG4gICAgICByZXR1cm4gcmF3XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGUgPSBSYXcuZGVzZXJpYWxpemUocmF3LCB7IHRlcnNlOiB0cnVlIH0pXG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemUgYW4gYXJyYXkgb2YgRE9NIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBlbGVtZW50c1xuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG5cbiAgZGVzZXJpYWxpemVFbGVtZW50cyA9IChlbGVtZW50cyA9IFtdKSA9PiB7XG4gICAgbGV0IG5vZGVzID0gW11cblxuICAgIGVsZW1lbnRzLmZpbHRlcih0aGlzLmNydWZ0TmV3bGluZSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZGVzZXJpYWxpemVFbGVtZW50KGVsZW1lbnQpXG4gICAgICBzd2l0Y2ggKHR5cGVPZihub2RlKSkge1xuICAgICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgICAgbm9kZXMgPSBub2Rlcy5jb25jYXQobm9kZSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbm9kZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZSBhIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICAgKiBAcmV0dXJuIHtBbnl9XG4gICAqL1xuXG4gIGRlc2VyaWFsaXplRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XG4gICAgbGV0IG5vZGVcblxuICAgIGlmICghZWxlbWVudC50YWdOYW1lKSB7XG4gICAgICBlbGVtZW50LnRhZ05hbWUgPSAnJ1xuICAgIH1cblxuICAgIGNvbnN0IG5leHQgPSAoZWxlbWVudHMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgTm9kZUxpc3QgIT09ICd1bmRlZmluZWQnICYmIGVsZW1lbnRzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgZWxlbWVudHMgPSBBcnJheS5mcm9tKGVsZW1lbnRzKVxuICAgICAgfVxuICAgICAgc3dpdGNoICh0eXBlT2YoZWxlbWVudHMpKSB7XG4gICAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgICByZXR1cm4gdGhpcy5kZXNlcmlhbGl6ZUVsZW1lbnRzKGVsZW1lbnRzKVxuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIHJldHVybiB0aGlzLmRlc2VyaWFsaXplRWxlbWVudChlbGVtZW50cylcbiAgICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXFxgbmV4dFxcYCBhcmd1bWVudCB3YXMgY2FsbGVkIHdpdGggaW52YWxpZCBjaGlsZHJlbjogXCIke2VsZW1lbnRzfVwiLmApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBydWxlID0gdGhpcy5ydWxlc1tpXVxuICAgICAgaWYgKCFydWxlLmRlc2VyaWFsaXplKSBjb250aW51ZVxuICAgICAgY29uc3QgcmV0ID0gcnVsZS5kZXNlcmlhbGl6ZShlbGVtZW50LCBuZXh0KVxuICAgICAgY29uc3QgdHlwZSA9IHR5cGVPZihyZXQpXG5cbiAgICAgIGlmICh0eXBlICE9ICdhcnJheScgJiYgdHlwZSAhPSAnb2JqZWN0JyAmJiB0eXBlICE9ICdudWxsJyAmJiB0eXBlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBydWxlIHJldHVybmVkIGFuIGludmFsaWQgZGVzZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uOiBcIiR7bm9kZX1cIi5gKVxuICAgICAgfVxuXG4gICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpIGNvbnRpbnVlXG4gICAgICBpZiAocmV0ID09PSBudWxsKSByZXR1cm4gbnVsbFxuXG4gICAgICBub2RlID0gcmV0LmtpbmQgPT0gJ21hcmsnID8gdGhpcy5kZXNlcmlhbGl6ZU1hcmsocmV0KSA6IHJldFxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZSB8fCBuZXh0KGVsZW1lbnQuY2hpbGROb2RlcylcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZSBhIGBtYXJrYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtYXJrXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBkZXNlcmlhbGl6ZU1hcmsgPSAobWFyaykgPT4ge1xuICAgIGNvbnN0IHsgdHlwZSwgZGF0YSB9ID0gbWFya1xuXG4gICAgY29uc3QgYXBwbHlNYXJrID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlLmtpbmQgPT0gJ21hcmsnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc2VyaWFsaXplTWFyayhub2RlKVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChub2RlLmtpbmQgPT0gJ3RleHQnKSB7XG4gICAgICAgIGlmICghbm9kZS5yYW5nZXMpIG5vZGUucmFuZ2VzID0gW3sgdGV4dDogbm9kZS50ZXh0IH1dXG4gICAgICAgIG5vZGUucmFuZ2VzID0gbm9kZS5yYW5nZXMubWFwKChyYW5nZSkgPT4ge1xuICAgICAgICAgIHJhbmdlLm1hcmtzID0gcmFuZ2UubWFya3MgfHwgW11cbiAgICAgICAgICByYW5nZS5tYXJrcy5wdXNoKHsgdHlwZSwgZGF0YSB9KVxuICAgICAgICAgIHJldHVybiByYW5nZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBlbHNlIHtcbiAgICAgICAgbm9kZS5ub2RlcyA9IG5vZGUubm9kZXMubWFwKGFwcGx5TWFyaylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG5cbiAgICByZXR1cm4gbWFyay5ub2Rlcy5yZWR1Y2UoKG5vZGVzLCBub2RlKSA9PiB7XG4gICAgICBjb25zdCByZXQgPSBhcHBseU1hcmsobm9kZSlcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJldCkpIHJldHVybiBub2Rlcy5jb25jYXQocmV0KVxuICAgICAgbm9kZXMucHVzaChyZXQpXG4gICAgICByZXR1cm4gbm9kZXNcbiAgICB9LCBbXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgYSBgc3RhdGVgIG9iamVjdCBpbnRvIGFuIEhUTUwgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiAgIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcmVuZGVyXG4gICAqIEByZXR1cm4ge1N0cmluZ3xBcnJheX1cbiAgICovXG5cbiAgc2VyaWFsaXplID0gKHN0YXRlLCBvcHRpb25zID0ge30pID0+IHtcbiAgICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQubm9kZXMubWFwKHRoaXMuc2VyaWFsaXplTm9kZSlcbiAgICBpZiAob3B0aW9ucy5yZW5kZXIgPT09IGZhbHNlKSByZXR1cm4gZWxlbWVudHNcblxuICAgIGNvbnN0IGh0bWwgPSBSZWFjdERPTVNlcnZlci5yZW5kZXJUb1N0YXRpY01hcmt1cCg8Ym9keT57ZWxlbWVudHN9PC9ib2R5PilcbiAgICBjb25zdCBpbm5lciA9IGh0bWwuc2xpY2UoNiwgLTcpXG4gICAgcmV0dXJuIGlubmVyXG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplIGEgYG5vZGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBzZXJpYWxpemVOb2RlID0gKG5vZGUpID0+IHtcbiAgICBpZiAobm9kZS5raW5kID09ICd0ZXh0Jykge1xuICAgICAgY29uc3QgcmFuZ2VzID0gbm9kZS5nZXRSYW5nZXMoKVxuICAgICAgcmV0dXJuIHJhbmdlcy5tYXAodGhpcy5zZXJpYWxpemVSYW5nZSlcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUubm9kZXMubWFwKHRoaXMuc2VyaWFsaXplTm9kZSlcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcnVsZSA9IHRoaXMucnVsZXNbaV1cbiAgICAgIGlmICghcnVsZS5zZXJpYWxpemUpIGNvbnRpbnVlXG4gICAgICBjb25zdCByZXQgPSBydWxlLnNlcmlhbGl6ZShub2RlLCBjaGlsZHJlbilcbiAgICAgIGlmIChyZXQpIHJldHVybiBhZGRLZXkocmV0KVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgTm8gc2VyaWFsaXplciBkZWZpbmVkIGZvciBub2RlIG9mIHR5cGUgXCIke25vZGUudHlwZX1cIi5gKVxuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZSBhIGByYW5nZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgc2VyaWFsaXplUmFuZ2UgPSAocmFuZ2UpID0+IHtcbiAgICBjb25zdCBzdHJpbmcgPSBuZXcgU3RyaW5nKHsgdGV4dDogcmFuZ2UudGV4dCB9KVxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNlcmlhbGl6ZVN0cmluZyhzdHJpbmcpXG5cbiAgICByZXR1cm4gcmFuZ2UubWFya3MucmVkdWNlKChjaGlsZHJlbiwgbWFyaykgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJ1bGUgPSB0aGlzLnJ1bGVzW2ldXG4gICAgICAgIGlmICghcnVsZS5zZXJpYWxpemUpIGNvbnRpbnVlXG4gICAgICAgIGNvbnN0IHJldCA9IHJ1bGUuc2VyaWFsaXplKG1hcmssIGNoaWxkcmVuKVxuICAgICAgICBpZiAocmV0KSByZXR1cm4gYWRkS2V5KHJldClcbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzZXJpYWxpemVyIGRlZmluZWQgZm9yIG1hcmsgb2YgdHlwZSBcIiR7bWFyay50eXBlfVwiLmApXG4gICAgfSwgdGV4dClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgYSBgc3RyaW5nYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIHNlcmlhbGl6ZVN0cmluZyA9IChzdHJpbmcpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHJ1bGUgPSB0aGlzLnJ1bGVzW2ldXG4gICAgICBpZiAoIXJ1bGUuc2VyaWFsaXplKSBjb250aW51ZVxuICAgICAgY29uc3QgcmV0ID0gcnVsZS5zZXJpYWxpemUoc3RyaW5nLCBzdHJpbmcudGV4dClcbiAgICAgIGlmIChyZXQpIHJldHVybiByZXRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIG91dCBjcnVmdCBuZXdsaW5lIG5vZGVzIGluc2VydGVkIGJ5IHRoZSBET00gcGFyc2VyLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBjcnVmdE5ld2xpbmUgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiAhKGVsZW1lbnQubm9kZU5hbWUgPT0gJyN0ZXh0JyAmJiBlbGVtZW50LnZhbHVlID09ICdcXG4nKVxuICB9XG5cbn1cblxuLyoqXG4gKiBBZGQgYSB1bmlxdWUga2V5IHRvIGEgUmVhY3QgYGVsZW1lbnRgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5sZXQga2V5ID0gMFxuXG5mdW5jdGlvbiBhZGRLZXkoZWxlbWVudCkge1xuICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGVsZW1lbnQsIHsga2V5OiBrZXkrKyB9KVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7SHRtbH1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBIdG1sXG4iXX0=