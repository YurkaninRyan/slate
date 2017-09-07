'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./document');

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

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
  isVoid: false,
  key: undefined,
  nodes: new _immutable.List(),
  type: undefined

  /**
   * Inline.
   *
   * @type {Inline}
   */

};
var Inline = function (_Record) {
  _inherits(Inline, _Record);

  function Inline() {
    _classCallCheck(this, Inline);

    return _possibleConstructorReturn(this, (Inline.__proto__ || Object.getPrototypeOf(Inline)).apply(this, arguments));
  }

  _createClass(Inline, [{
    key: 'kind',


    /**
     * Get the node's kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'inline';
    }

    /**
     * Check if the inline is empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get() {
      return this.text == '';
    }

    /**
     * Get the concatenated text of all the inline's children.
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
     * Create a new `Inline` with `attrs`.
     *
     * @param {Object|String|Inline} attrs
     * @return {Inline}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Inline.isInline(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var _attrs = attrs,
            data = _attrs.data,
            isVoid = _attrs.isVoid,
            key = _attrs.key,
            type = _attrs.type;
        var _attrs2 = attrs,
            nodes = _attrs2.nodes;


        if (typeof type != 'string') {
          throw new Error('`Inline.create` requires a block `type` string.');
        }

        if (nodes == null || nodes.length == 0) {
          nodes = [_text2.default.create()];
        }

        var inline = new Inline({
          data: _data2.default.create(data),
          isVoid: !!isVoid,
          key: key || (0, _generateKey2.default)(),
          nodes: _node2.default.createList(nodes),
          type: type
        });

        return inline;
      }

      throw new Error('`Inline.create` only accepts objects, strings or inlines, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Inlines` from an array.
     *
     * @param {Array<Inline|Object>|List<Inline|Object>} elements
     * @return {List<Inline>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new _immutable.List(elements.map(Inline.create));
        return list;
      }

      throw new Error('`Inline.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Check if a `value` is a `Inline`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isInline',
    value: function isInline(value) {
      return !!(value && value[_modelTypes2.default.INLINE]);
    }

    /**
     * Check if a `value` is a list of inlines.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isInlineList',
    value: function isInlineList(value) {
      return _immutable.List.isList(value) && value.every(function (item) {
        return Inline.isInline(item);
      });
    }
  }]);

  return Inline;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Inline.prototype[_modelTypes2.default.INLINE] = true;

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(_node2.default.prototype).forEach(function (method) {
  if (method == 'constructor') return;
  Inline.prototype[method] = _node2.default.prototype[method];
});

/**
 * Export.
 *
 * @type {Inline}
 */

exports.default = Inline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvaW5saW5lLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRTIiwiZGF0YSIsImlzVm9pZCIsImtleSIsInVuZGVmaW5lZCIsIm5vZGVzIiwidHlwZSIsIklubGluZSIsInRleHQiLCJnZXRUZXh0IiwiYXR0cnMiLCJpc0lubGluZSIsIkVycm9yIiwibGVuZ3RoIiwiY3JlYXRlIiwiaW5saW5lIiwiY3JlYXRlTGlzdCIsImVsZW1lbnRzIiwiaXNMaXN0IiwiQXJyYXkiLCJpc0FycmF5IiwibGlzdCIsIm1hcCIsInZhbHVlIiwiSU5MSU5FIiwiZXZlcnkiLCJpdGVtIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImZvckVhY2giLCJtZXRob2QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0E7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQWhCQTs7OztBQU1BOzs7O0FBWUE7Ozs7OztBQU1BLElBQU1BLFdBQVc7QUFDZkMsUUFBTSxvQkFEUztBQUVmQyxVQUFRLEtBRk87QUFHZkMsT0FBS0MsU0FIVTtBQUlmQyxTQUFPLHFCQUpRO0FBS2ZDLFFBQU1GOztBQUdSOzs7Ozs7QUFSaUIsQ0FBakI7SUFjTUcsTTs7Ozs7Ozs7Ozs7OztBQWtGSjs7Ozs7O3dCQU1XO0FBQ1QsYUFBTyxRQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1jO0FBQ1osYUFBTyxLQUFLQyxJQUFMLElBQWEsRUFBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBTVc7QUFDVCxhQUFPLEtBQUtDLE9BQUwsRUFBUDtBQUNEOzs7OztBQTVHRDs7Ozs7Ozs2QkFPMEI7QUFBQSxVQUFaQyxLQUFZLHVFQUFKLEVBQUk7O0FBQ3hCLFVBQUlILE9BQU9JLFFBQVAsQ0FBZ0JELEtBQWhCLENBQUosRUFBNEI7QUFDMUIsZUFBT0EsS0FBUDtBQUNEOztBQUVELFVBQUksT0FBT0EsS0FBUCxJQUFnQixRQUFwQixFQUE4QjtBQUM1QkEsZ0JBQVEsRUFBRUosTUFBTUksS0FBUixFQUFSO0FBQ0Q7O0FBRUQsVUFBSSw2QkFBY0EsS0FBZCxDQUFKLEVBQTBCO0FBQUEscUJBQ1lBLEtBRFo7QUFBQSxZQUNoQlQsSUFEZ0IsVUFDaEJBLElBRGdCO0FBQUEsWUFDVkMsTUFEVSxVQUNWQSxNQURVO0FBQUEsWUFDRkMsR0FERSxVQUNGQSxHQURFO0FBQUEsWUFDR0csSUFESCxVQUNHQSxJQURIO0FBQUEsc0JBRVJJLEtBRlE7QUFBQSxZQUVsQkwsS0FGa0IsV0FFbEJBLEtBRmtCOzs7QUFJeEIsWUFBSSxPQUFPQyxJQUFQLElBQWUsUUFBbkIsRUFBNkI7QUFDM0IsZ0JBQU0sSUFBSU0sS0FBSixDQUFVLGlEQUFWLENBQU47QUFDRDs7QUFFRCxZQUFJUCxTQUFTLElBQVQsSUFBaUJBLE1BQU1RLE1BQU4sSUFBZ0IsQ0FBckMsRUFBd0M7QUFDdENSLGtCQUFRLENBQUMsZUFBS1MsTUFBTCxFQUFELENBQVI7QUFDRDs7QUFFRCxZQUFNQyxTQUFTLElBQUlSLE1BQUosQ0FBVztBQUN4Qk4sZ0JBQU0sZUFBS2EsTUFBTCxDQUFZYixJQUFaLENBRGtCO0FBRXhCQyxrQkFBUSxDQUFDLENBQUNBLE1BRmM7QUFHeEJDLGVBQUtBLE9BQU8sNEJBSFk7QUFJeEJFLGlCQUFPLGVBQUtXLFVBQUwsQ0FBZ0JYLEtBQWhCLENBSmlCO0FBS3hCQztBQUx3QixTQUFYLENBQWY7O0FBUUEsZUFBT1MsTUFBUDtBQUNEOztBQUVELFlBQU0sSUFBSUgsS0FBSixtRkFBNEZGLEtBQTVGLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7O2lDQU9pQztBQUFBLFVBQWZPLFFBQWUsdUVBQUosRUFBSTs7QUFDL0IsVUFBSSxnQkFBS0MsTUFBTCxDQUFZRCxRQUFaLEtBQXlCRSxNQUFNQyxPQUFOLENBQWNILFFBQWQsQ0FBN0IsRUFBc0Q7QUFDcEQsWUFBTUksT0FBTyxvQkFBU0osU0FBU0ssR0FBVCxDQUFhZixPQUFPTyxNQUFwQixDQUFULENBQWI7QUFDQSxlQUFPTyxJQUFQO0FBQ0Q7O0FBRUQsWUFBTSxJQUFJVCxLQUFKLDJFQUFvRkssUUFBcEYsQ0FBTjtBQUNEOztBQUVEOzs7Ozs7Ozs7NkJBT2dCTSxLLEVBQU87QUFDckIsYUFBTyxDQUFDLEVBQUVBLFNBQVNBLE1BQU0scUJBQVlDLE1BQWxCLENBQVgsQ0FBUjtBQUNEOztBQUVEOzs7Ozs7Ozs7aUNBT29CRCxLLEVBQU87QUFDekIsYUFBTyxnQkFBS0wsTUFBTCxDQUFZSyxLQUFaLEtBQXNCQSxNQUFNRSxLQUFOLENBQVk7QUFBQSxlQUFRbEIsT0FBT0ksUUFBUCxDQUFnQmUsSUFBaEIsQ0FBUjtBQUFBLE9BQVosQ0FBN0I7QUFDRDs7OztFQWhGa0IsdUJBQU8xQixRQUFQLEM7O0FBa0hyQjs7OztBQUlBTyxPQUFPb0IsU0FBUCxDQUFpQixxQkFBWUgsTUFBN0IsSUFBdUMsSUFBdkM7O0FBRUE7Ozs7QUFJQUksT0FBT0MsbUJBQVAsQ0FBMkIsZUFBS0YsU0FBaEMsRUFBMkNHLE9BQTNDLENBQW1ELFVBQUNDLE1BQUQsRUFBWTtBQUM3RCxNQUFJQSxVQUFVLGFBQWQsRUFBNkI7QUFDN0J4QixTQUFPb0IsU0FBUCxDQUFpQkksTUFBakIsSUFBMkIsZUFBS0osU0FBTCxDQUFlSSxNQUFmLENBQTNCO0FBQ0QsQ0FIRDs7QUFLQTs7Ozs7O2tCQU1leEIsTSIsImZpbGUiOiJpbmxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogUHJldmVudCBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gKi9cblxuaW1wb3J0ICcuL2RvY3VtZW50J1xuXG4vKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xuXG5pbXBvcnQgRGF0YSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnXG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi4vY29uc3RhbnRzL21vZGVsLXR5cGVzJ1xuaW1wb3J0IGdlbmVyYXRlS2V5IGZyb20gJy4uL3V0aWxzL2dlbmVyYXRlLWtleSdcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2lzLXBsYWluLW9iamVjdCdcbmltcG9ydCB7IExpc3QsIE1hcCwgUmVjb3JkIH0gZnJvbSAnaW1tdXRhYmxlJ1xuXG4vKipcbiAqIERlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBkYXRhOiBuZXcgTWFwKCksXG4gIGlzVm9pZDogZmFsc2UsXG4gIGtleTogdW5kZWZpbmVkLFxuICBub2RlczogbmV3IExpc3QoKSxcbiAgdHlwZTogdW5kZWZpbmVkLFxufVxuXG4vKipcbiAqIElubGluZS5cbiAqXG4gKiBAdHlwZSB7SW5saW5lfVxuICovXG5cbmNsYXNzIElubGluZSBleHRlbmRzIFJlY29yZChERUZBVUxUUykge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYElubGluZWAgd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd8SW5saW5lfSBhdHRyc1xuICAgKiBAcmV0dXJuIHtJbmxpbmV9XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGUoYXR0cnMgPSB7fSkge1xuICAgIGlmIChJbmxpbmUuaXNJbmxpbmUoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGF0dHJzID09ICdzdHJpbmcnKSB7XG4gICAgICBhdHRycyA9IHsgdHlwZTogYXR0cnMgfVxuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3QgeyBkYXRhLCBpc1ZvaWQsIGtleSwgdHlwZSB9ID0gYXR0cnNcbiAgICAgIGxldCB7IG5vZGVzIH0gPSBhdHRyc1xuXG4gICAgICBpZiAodHlwZW9mIHR5cGUgIT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgSW5saW5lLmNyZWF0ZWAgcmVxdWlyZXMgYSBibG9jayBgdHlwZWAgc3RyaW5nLicpXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlcyA9PSBudWxsIHx8IG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIG5vZGVzID0gW1RleHQuY3JlYXRlKCldXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlubGluZSA9IG5ldyBJbmxpbmUoe1xuICAgICAgICBkYXRhOiBEYXRhLmNyZWF0ZShkYXRhKSxcbiAgICAgICAgaXNWb2lkOiAhIWlzVm9pZCxcbiAgICAgICAga2V5OiBrZXkgfHwgZ2VuZXJhdGVLZXkoKSxcbiAgICAgICAgbm9kZXM6IE5vZGUuY3JlYXRlTGlzdChub2RlcyksXG4gICAgICAgIHR5cGUsXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaW5saW5lXG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBJbmxpbmUuY3JlYXRlXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzLCBzdHJpbmdzIG9yIGlubGluZXMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2F0dHJzfWApXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbGlzdCBvZiBgSW5saW5lc2AgZnJvbSBhbiBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxJbmxpbmV8T2JqZWN0PnxMaXN0PElubGluZXxPYmplY3Q+fSBlbGVtZW50c1xuICAgKiBAcmV0dXJuIHtMaXN0PElubGluZT59XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGVMaXN0KGVsZW1lbnRzID0gW10pIHtcbiAgICBpZiAoTGlzdC5pc0xpc3QoZWxlbWVudHMpIHx8IEFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgICBjb25zdCBsaXN0ID0gbmV3IExpc3QoZWxlbWVudHMubWFwKElubGluZS5jcmVhdGUpKVxuICAgICAgcmV0dXJuIGxpc3RcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYElubGluZS5jcmVhdGVMaXN0XFxgIG9ubHkgYWNjZXB0cyBhcnJheXMgb3IgbGlzdHMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2VsZW1lbnRzfWApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBgdmFsdWVgIGlzIGEgYElubGluZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNJbmxpbmUodmFsdWUpIHtcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbTU9ERUxfVFlQRVMuSU5MSU5FXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBsaXN0IG9mIGlubGluZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNJbmxpbmVMaXN0KHZhbHVlKSB7XG4gICAgcmV0dXJuIExpc3QuaXNMaXN0KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeShpdGVtID0+IElubGluZS5pc0lubGluZShpdGVtKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5vZGUncyBraW5kLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBraW5kKCkge1xuICAgIHJldHVybiAnaW5saW5lJ1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBpbmxpbmUgaXMgZW1wdHkuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnRleHQgPT0gJydcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbmNhdGVuYXRlZCB0ZXh0IG9mIGFsbCB0aGUgaW5saW5lJ3MgY2hpbGRyZW4uXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZ2V0IHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpXG4gIH1cblxufVxuXG4vKipcbiAqIEF0dGFjaCBhIHBzZXVkby1zeW1ib2wgZm9yIHR5cGUgY2hlY2tpbmcuXG4gKi9cblxuSW5saW5lLnByb3RvdHlwZVtNT0RFTF9UWVBFUy5JTkxJTkVdID0gdHJ1ZVxuXG4vKipcbiAqIE1peCBpbiBgTm9kZWAgbWV0aG9kcy5cbiAqL1xuXG5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhOb2RlLnByb3RvdHlwZSkuZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gIGlmIChtZXRob2QgPT0gJ2NvbnN0cnVjdG9yJykgcmV0dXJuXG4gIElubGluZS5wcm90b3R5cGVbbWV0aG9kXSA9IE5vZGUucHJvdG90eXBlW21ldGhvZF1cbn0pXG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtJbmxpbmV9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgSW5saW5lXG4iXX0=