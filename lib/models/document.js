'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./block');

require('./inline');

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _generateKey = require('../utils/generate-key');

var _generateKey2 = _interopRequireDefault(_generateKey);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/**
 * Prevent circular dependencies.
 */

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  data: new _immutable.Map(),
  key: undefined,
  nodes: new _immutable.List()

  /**
   * Document.
   *
   * @type {Document}
   */

};
var Document = function (_Record) {
  _inherits(Document, _Record);

  function Document() {
    _classCallCheck(this, Document);

    return _possibleConstructorReturn(this, (Document.__proto__ || Object.getPrototypeOf(Document)).apply(this, arguments));
  }

  _createClass(Document, [{
    key: 'kind',


    /**
     * Get the node's kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'document';
    }

    /**
     * Check if the document is empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get() {
      return this.text == '';
    }

    /**
     * Get the concatenated text of all the document's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get() {
      return this.getText();
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Document` with `attrs`.
     *
     * @param {Object|Array|List|Text} attrs
     * @return {Document}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Document.isDocument(attrs)) {
        return attrs;
      }

      if (_immutable.List.isList(attrs) || Array.isArray(attrs)) {
        attrs = { nodes: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var _attrs = attrs,
            data = _attrs.data,
            key = _attrs.key,
            nodes = _attrs.nodes;

        var document = new Document({
          key: key || (0, _generateKey2.default)(),
          data: _data2.default.create(data),
          nodes: _node2.default.createList(nodes)
        });

        return document;
      }

      throw new Error('`Document.create` only accepts objects, arrays, lists or documents, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `Document`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isDocument',
    value: function isDocument(value) {
      return !!(value && value[_modelTypes2.default.DOCUMENT]);
    }
  }]);

  return Document;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Document.prototype[_modelTypes2.default.DOCUMENT] = true;

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(_node2.default.prototype).forEach(function (method) {
  if (method == 'constructor') return;
  Document.prototype[method] = _node2.default.prototype[method];
});

/**
 * Export.
 *
 * @type {Document}
 */

exports.default = Document;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZG9jdW1lbnQuanMiXSwibmFtZXMiOlsiREVGQVVMVFMiLCJkYXRhIiwia2V5IiwidW5kZWZpbmVkIiwibm9kZXMiLCJEb2N1bWVudCIsInRleHQiLCJnZXRUZXh0IiwiYXR0cnMiLCJpc0RvY3VtZW50IiwiaXNMaXN0IiwiQXJyYXkiLCJpc0FycmF5IiwiZG9jdW1lbnQiLCJjcmVhdGUiLCJjcmVhdGVMaXN0IiwiRXJyb3IiLCJ2YWx1ZSIsIkRPQ1VNRU5UIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImZvckVhY2giLCJtZXRob2QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0E7O0FBQ0E7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7QUFoQkE7Ozs7QUFPQTs7OztBQVdBOzs7Ozs7QUFNQSxJQUFNQSxXQUFXO0FBQ2ZDLFFBQU0sb0JBRFM7QUFFZkMsT0FBS0MsU0FGVTtBQUdmQyxTQUFPOztBQUdUOzs7Ozs7QUFOaUIsQ0FBakI7SUFZTUMsUTs7Ozs7Ozs7Ozs7OztBQTJDSjs7Ozs7O3dCQU1XO0FBQ1QsYUFBTyxVQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1jO0FBQ1osYUFBTyxLQUFLQyxJQUFMLElBQWEsRUFBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBTVc7QUFDVCxhQUFPLEtBQUtDLE9BQUwsRUFBUDtBQUNEOzs7OztBQXJFRDs7Ozs7Ozs2QkFPMEI7QUFBQSxVQUFaQyxLQUFZLHVFQUFKLEVBQUk7O0FBQ3hCLFVBQUlILFNBQVNJLFVBQVQsQ0FBb0JELEtBQXBCLENBQUosRUFBZ0M7QUFDOUIsZUFBT0EsS0FBUDtBQUNEOztBQUVELFVBQUksZ0JBQUtFLE1BQUwsQ0FBWUYsS0FBWixLQUFzQkcsTUFBTUMsT0FBTixDQUFjSixLQUFkLENBQTFCLEVBQWdEO0FBQzlDQSxnQkFBUSxFQUFFSixPQUFPSSxLQUFULEVBQVI7QUFDRDs7QUFFRCxVQUFJLDZCQUFjQSxLQUFkLENBQUosRUFBMEI7QUFBQSxxQkFDS0EsS0FETDtBQUFBLFlBQ2hCUCxJQURnQixVQUNoQkEsSUFEZ0I7QUFBQSxZQUNWQyxHQURVLFVBQ1ZBLEdBRFU7QUFBQSxZQUNMRSxLQURLLFVBQ0xBLEtBREs7O0FBRXhCLFlBQU1TLFdBQVcsSUFBSVIsUUFBSixDQUFhO0FBQzVCSCxlQUFLQSxPQUFPLDRCQURnQjtBQUU1QkQsZ0JBQU0sZUFBS2EsTUFBTCxDQUFZYixJQUFaLENBRnNCO0FBRzVCRyxpQkFBTyxlQUFLVyxVQUFMLENBQWdCWCxLQUFoQjtBQUhxQixTQUFiLENBQWpCOztBQU1BLGVBQU9TLFFBQVA7QUFDRDs7QUFFRCxZQUFNLElBQUlHLEtBQUosNkZBQXNHUixLQUF0RyxDQUFOO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzsrQkFPa0JTLEssRUFBTztBQUN2QixhQUFPLENBQUMsRUFBRUEsU0FBU0EsTUFBTSxxQkFBWUMsUUFBbEIsQ0FBWCxDQUFSO0FBQ0Q7Ozs7RUF6Q29CLHVCQUFPbEIsUUFBUCxDOztBQTJFdkI7Ozs7QUFJQUssU0FBU2MsU0FBVCxDQUFtQixxQkFBWUQsUUFBL0IsSUFBMkMsSUFBM0M7O0FBRUE7Ozs7QUFJQUUsT0FBT0MsbUJBQVAsQ0FBMkIsZUFBS0YsU0FBaEMsRUFBMkNHLE9BQTNDLENBQW1ELFVBQUNDLE1BQUQsRUFBWTtBQUM3RCxNQUFJQSxVQUFVLGFBQWQsRUFBNkI7QUFDN0JsQixXQUFTYyxTQUFULENBQW1CSSxNQUFuQixJQUE2QixlQUFLSixTQUFMLENBQWVJLE1BQWYsQ0FBN0I7QUFDRCxDQUhEOztBQUtBOzs7Ozs7a0JBTWVsQixRIiwiZmlsZSI6ImRvY3VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIFByZXZlbnQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICovXG5cbmltcG9ydCAnLi9ibG9jaydcbmltcG9ydCAnLi9pbmxpbmUnXG5cbi8qKlxuICogRGVwZW5kZW5jaWVzLlxuICovXG5cbmltcG9ydCBEYXRhIGZyb20gJy4vZGF0YSdcbmltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSdcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgZ2VuZXJhdGVLZXkgZnJvbSAnLi4vdXRpbHMvZ2VuZXJhdGUta2V5J1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnaXMtcGxhaW4tb2JqZWN0J1xuaW1wb3J0IHsgTGlzdCwgTWFwLCBSZWNvcmQgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogRGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuY29uc3QgREVGQVVMVFMgPSB7XG4gIGRhdGE6IG5ldyBNYXAoKSxcbiAga2V5OiB1bmRlZmluZWQsXG4gIG5vZGVzOiBuZXcgTGlzdCgpLFxufVxuXG4vKipcbiAqIERvY3VtZW50LlxuICpcbiAqIEB0eXBlIHtEb2N1bWVudH1cbiAqL1xuXG5jbGFzcyBEb2N1bWVudCBleHRlbmRzIFJlY29yZChERUZBVUxUUykge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYERvY3VtZW50YCB3aXRoIGBhdHRyc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fExpc3R8VGV4dH0gYXR0cnNcbiAgICogQHJldHVybiB7RG9jdW1lbnR9XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGUoYXR0cnMgPSB7fSkge1xuICAgIGlmIChEb2N1bWVudC5pc0RvY3VtZW50KGF0dHJzKSkge1xuICAgICAgcmV0dXJuIGF0dHJzXG4gICAgfVxuXG4gICAgaWYgKExpc3QuaXNMaXN0KGF0dHJzKSB8fCBBcnJheS5pc0FycmF5KGF0dHJzKSkge1xuICAgICAgYXR0cnMgPSB7IG5vZGVzOiBhdHRycyB9XG4gICAgfVxuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QoYXR0cnMpKSB7XG4gICAgICBjb25zdCB7IGRhdGEsIGtleSwgbm9kZXMgfSA9IGF0dHJzXG4gICAgICBjb25zdCBkb2N1bWVudCA9IG5ldyBEb2N1bWVudCh7XG4gICAgICAgIGtleToga2V5IHx8IGdlbmVyYXRlS2V5KCksXG4gICAgICAgIGRhdGE6IERhdGEuY3JlYXRlKGRhdGEpLFxuICAgICAgICBub2RlczogTm9kZS5jcmVhdGVMaXN0KG5vZGVzKSxcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBkb2N1bWVudFxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgXFxgRG9jdW1lbnQuY3JlYXRlXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzLCBhcnJheXMsIGxpc3RzIG9yIGRvY3VtZW50cywgYnV0IHlvdSBwYXNzZWQgaXQ6ICR7YXR0cnN9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBgRG9jdW1lbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzRG9jdW1lbnQodmFsdWUpIHtcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbTU9ERUxfVFlQRVMuRE9DVU1FTlRdKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbm9kZSdzIGtpbmQuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IGtpbmQoKSB7XG4gICAgcmV0dXJuICdkb2N1bWVudCdcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZG9jdW1lbnQgaXMgZW1wdHkuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnRleHQgPT0gJydcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbmNhdGVuYXRlZCB0ZXh0IG9mIGFsbCB0aGUgZG9jdW1lbnQncyBjaGlsZHJlbi5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUZXh0KClcbiAgfVxuXG59XG5cbi8qKlxuICogQXR0YWNoIGEgcHNldWRvLXN5bWJvbCBmb3IgdHlwZSBjaGVja2luZy5cbiAqL1xuXG5Eb2N1bWVudC5wcm90b3R5cGVbTU9ERUxfVFlQRVMuRE9DVU1FTlRdID0gdHJ1ZVxuXG4vKipcbiAqIE1peCBpbiBgTm9kZWAgbWV0aG9kcy5cbiAqL1xuXG5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhOb2RlLnByb3RvdHlwZSkuZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gIGlmIChtZXRob2QgPT0gJ2NvbnN0cnVjdG9yJykgcmV0dXJuXG4gIERvY3VtZW50LnByb3RvdHlwZVttZXRob2RdID0gTm9kZS5wcm90b3R5cGVbbWV0aG9kXVxufSlcblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0RvY3VtZW50fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IERvY3VtZW50XG4iXX0=