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
   * Block.
   *
   * @type {Block}
   */

};
var Block = function (_Record) {
  _inherits(Block, _Record);

  function Block() {
    _classCallCheck(this, Block);

    return _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).apply(this, arguments));
  }

  _createClass(Block, [{
    key: 'kind',


    /**
     * Get the node's kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'block';
    }

    /**
     * Check if the block is empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get() {
      return this.text == '';
    }

    /**
     * Get the concatenated text of all the block's children.
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
     * Create a new `Block` with `attrs`.
     *
     * @param {Object|String|Block} attrs
     * @return {Block}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Block.isBlock(attrs)) {
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
          throw new Error('`Block.create` requires a block `type` string.');
        }

        if (nodes == null || nodes.length == 0) {
          nodes = [_text2.default.create()];
        }

        var block = new Block({
          data: _data2.default.create(data),
          isVoid: !!isVoid,
          key: key || (0, _generateKey2.default)(),
          nodes: _node2.default.createList(nodes),
          type: type
        });

        return block;
      }

      throw new Error('`Block.create` only accepts objects, strings or blocks, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Blocks` from `elements`.
     *
     * @param {Array<Block|Object>|List<Block|Object>} elements
     * @return {List<Block>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new _immutable.List(elements.map(Block.create));
        return list;
      }

      throw new Error('`Block.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Check if a `value` is a `Block`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isBlock',
    value: function isBlock(value) {
      return !!(value && value[_modelTypes2.default.BLOCK]);
    }

    /**
     * Check if a `value` is a block list.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isBlockList',
    value: function isBlockList(value) {
      return _immutable.List.isList(value) && value.every(function (item) {
        return Block.isBlock(item);
      });
    }
  }]);

  return Block;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Block.prototype[_modelTypes2.default.BLOCK] = true;

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(_node2.default.prototype).forEach(function (method) {
  if (method == 'constructor') return;
  Block.prototype[method] = _node2.default.prototype[method];
});

/**
 * Export.
 *
 * @type {Block}
 */

exports.default = Block;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvYmxvY2suanMiXSwibmFtZXMiOlsiREVGQVVMVFMiLCJkYXRhIiwiaXNWb2lkIiwia2V5IiwidW5kZWZpbmVkIiwibm9kZXMiLCJ0eXBlIiwiQmxvY2siLCJ0ZXh0IiwiZ2V0VGV4dCIsImF0dHJzIiwiaXNCbG9jayIsIkVycm9yIiwibGVuZ3RoIiwiY3JlYXRlIiwiYmxvY2siLCJjcmVhdGVMaXN0IiwiZWxlbWVudHMiLCJpc0xpc3QiLCJBcnJheSIsImlzQXJyYXkiLCJsaXN0IiwibWFwIiwidmFsdWUiLCJCTE9DSyIsImV2ZXJ5IiwiaXRlbSIsInByb3RvdHlwZSIsIk9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJmb3JFYWNoIiwibWV0aG9kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUtBOztBQU1BOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7QUFoQkE7Ozs7QUFNQTs7OztBQVlBOzs7Ozs7QUFNQSxJQUFNQSxXQUFXO0FBQ2ZDLFFBQU0sb0JBRFM7QUFFZkMsVUFBUSxLQUZPO0FBR2ZDLE9BQUtDLFNBSFU7QUFJZkMsU0FBTyxxQkFKUTtBQUtmQyxRQUFNRjs7QUFHUjs7Ozs7O0FBUmlCLENBQWpCO0lBY01HLEs7Ozs7Ozs7Ozs7Ozs7QUFrRko7Ozs7Ozt3QkFNVztBQUNULGFBQU8sT0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFNYztBQUNaLGFBQU8sS0FBS0MsSUFBTCxJQUFhLEVBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQU1XO0FBQ1QsYUFBTyxLQUFLQyxPQUFMLEVBQVA7QUFDRDs7Ozs7QUE1R0Q7Ozs7Ozs7NkJBTzBCO0FBQUEsVUFBWkMsS0FBWSx1RUFBSixFQUFJOztBQUN4QixVQUFJSCxNQUFNSSxPQUFOLENBQWNELEtBQWQsQ0FBSixFQUEwQjtBQUN4QixlQUFPQSxLQUFQO0FBQ0Q7O0FBRUQsVUFBSSxPQUFPQSxLQUFQLElBQWdCLFFBQXBCLEVBQThCO0FBQzVCQSxnQkFBUSxFQUFFSixNQUFNSSxLQUFSLEVBQVI7QUFDRDs7QUFFRCxVQUFJLDZCQUFjQSxLQUFkLENBQUosRUFBMEI7QUFBQSxxQkFDWUEsS0FEWjtBQUFBLFlBQ2hCVCxJQURnQixVQUNoQkEsSUFEZ0I7QUFBQSxZQUNWQyxNQURVLFVBQ1ZBLE1BRFU7QUFBQSxZQUNGQyxHQURFLFVBQ0ZBLEdBREU7QUFBQSxZQUNHRyxJQURILFVBQ0dBLElBREg7QUFBQSxzQkFFUkksS0FGUTtBQUFBLFlBRWxCTCxLQUZrQixXQUVsQkEsS0FGa0I7OztBQUl4QixZQUFJLE9BQU9DLElBQVAsSUFBZSxRQUFuQixFQUE2QjtBQUMzQixnQkFBTSxJQUFJTSxLQUFKLENBQVUsZ0RBQVYsQ0FBTjtBQUNEOztBQUVELFlBQUlQLFNBQVMsSUFBVCxJQUFpQkEsTUFBTVEsTUFBTixJQUFnQixDQUFyQyxFQUF3QztBQUN0Q1Isa0JBQVEsQ0FBQyxlQUFLUyxNQUFMLEVBQUQsQ0FBUjtBQUNEOztBQUVELFlBQU1DLFFBQVEsSUFBSVIsS0FBSixDQUFVO0FBQ3RCTixnQkFBTSxlQUFLYSxNQUFMLENBQVliLElBQVosQ0FEZ0I7QUFFdEJDLGtCQUFRLENBQUMsQ0FBQ0EsTUFGWTtBQUd0QkMsZUFBS0EsT0FBTyw0QkFIVTtBQUl0QkUsaUJBQU8sZUFBS1csVUFBTCxDQUFnQlgsS0FBaEIsQ0FKZTtBQUt0QkM7QUFMc0IsU0FBVixDQUFkOztBQVFBLGVBQU9TLEtBQVA7QUFDRDs7QUFFRCxZQUFNLElBQUlILEtBQUosaUZBQTBGRixLQUExRixDQUFOO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztpQ0FPaUM7QUFBQSxVQUFmTyxRQUFlLHVFQUFKLEVBQUk7O0FBQy9CLFVBQUksZ0JBQUtDLE1BQUwsQ0FBWUQsUUFBWixLQUF5QkUsTUFBTUMsT0FBTixDQUFjSCxRQUFkLENBQTdCLEVBQXNEO0FBQ3BELFlBQU1JLE9BQU8sb0JBQVNKLFNBQVNLLEdBQVQsQ0FBYWYsTUFBTU8sTUFBbkIsQ0FBVCxDQUFiO0FBQ0EsZUFBT08sSUFBUDtBQUNEOztBQUVELFlBQU0sSUFBSVQsS0FBSiwwRUFBbUZLLFFBQW5GLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7OzRCQU9lTSxLLEVBQU87QUFDcEIsYUFBTyxDQUFDLEVBQUVBLFNBQVNBLE1BQU0scUJBQVlDLEtBQWxCLENBQVgsQ0FBUjtBQUNEOztBQUVEOzs7Ozs7Ozs7Z0NBT21CRCxLLEVBQU87QUFDeEIsYUFBTyxnQkFBS0wsTUFBTCxDQUFZSyxLQUFaLEtBQXNCQSxNQUFNRSxLQUFOLENBQVk7QUFBQSxlQUFRbEIsTUFBTUksT0FBTixDQUFjZSxJQUFkLENBQVI7QUFBQSxPQUFaLENBQTdCO0FBQ0Q7Ozs7RUFoRmlCLHVCQUFPMUIsUUFBUCxDOztBQWtIcEI7Ozs7QUFJQU8sTUFBTW9CLFNBQU4sQ0FBZ0IscUJBQVlILEtBQTVCLElBQXFDLElBQXJDOztBQUVBOzs7O0FBSUFJLE9BQU9DLG1CQUFQLENBQTJCLGVBQUtGLFNBQWhDLEVBQTJDRyxPQUEzQyxDQUFtRCxVQUFDQyxNQUFELEVBQVk7QUFDN0QsTUFBSUEsVUFBVSxhQUFkLEVBQTZCO0FBQzdCeEIsUUFBTW9CLFNBQU4sQ0FBZ0JJLE1BQWhCLElBQTBCLGVBQUtKLFNBQUwsQ0FBZUksTUFBZixDQUExQjtBQUNELENBSEQ7O0FBS0E7Ozs7OztrQkFNZXhCLEsiLCJmaWxlIjoiYmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogUHJldmVudCBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gKi9cblxuaW1wb3J0ICcuL2RvY3VtZW50J1xuXG4vKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xuXG5pbXBvcnQgRGF0YSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnXG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi4vY29uc3RhbnRzL21vZGVsLXR5cGVzJ1xuaW1wb3J0IGdlbmVyYXRlS2V5IGZyb20gJy4uL3V0aWxzL2dlbmVyYXRlLWtleSdcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2lzLXBsYWluLW9iamVjdCdcbmltcG9ydCB7IExpc3QsIE1hcCwgUmVjb3JkIH0gZnJvbSAnaW1tdXRhYmxlJ1xuXG4vKipcbiAqIERlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBkYXRhOiBuZXcgTWFwKCksXG4gIGlzVm9pZDogZmFsc2UsXG4gIGtleTogdW5kZWZpbmVkLFxuICBub2RlczogbmV3IExpc3QoKSxcbiAgdHlwZTogdW5kZWZpbmVkLFxufVxuXG4vKipcbiAqIEJsb2NrLlxuICpcbiAqIEB0eXBlIHtCbG9ja31cbiAqL1xuXG5jbGFzcyBCbG9jayBleHRlbmRzIFJlY29yZChERUZBVUxUUykge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYEJsb2NrYCB3aXRoIGBhdHRyc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ3xCbG9ja30gYXR0cnNcbiAgICogQHJldHVybiB7QmxvY2t9XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGUoYXR0cnMgPSB7fSkge1xuICAgIGlmIChCbG9jay5pc0Jsb2NrKGF0dHJzKSkge1xuICAgICAgcmV0dXJuIGF0dHJzXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhdHRycyA9PSAnc3RyaW5nJykge1xuICAgICAgYXR0cnMgPSB7IHR5cGU6IGF0dHJzIH1cbiAgICB9XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChhdHRycykpIHtcbiAgICAgIGNvbnN0IHsgZGF0YSwgaXNWb2lkLCBrZXksIHR5cGUgfSA9IGF0dHJzXG4gICAgICBsZXQgeyBub2RlcyB9ID0gYXR0cnNcblxuICAgICAgaWYgKHR5cGVvZiB0eXBlICE9ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYEJsb2NrLmNyZWF0ZWAgcmVxdWlyZXMgYSBibG9jayBgdHlwZWAgc3RyaW5nLicpXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlcyA9PSBudWxsIHx8IG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIG5vZGVzID0gW1RleHQuY3JlYXRlKCldXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gbmV3IEJsb2NrKHtcbiAgICAgICAgZGF0YTogRGF0YS5jcmVhdGUoZGF0YSksXG4gICAgICAgIGlzVm9pZDogISFpc1ZvaWQsXG4gICAgICAgIGtleToga2V5IHx8IGdlbmVyYXRlS2V5KCksXG4gICAgICAgIG5vZGVzOiBOb2RlLmNyZWF0ZUxpc3Qobm9kZXMpLFxuICAgICAgICB0eXBlLFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGJsb2NrXG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBCbG9jay5jcmVhdGVcXGAgb25seSBhY2NlcHRzIG9iamVjdHMsIHN0cmluZ3Mgb3IgYmxvY2tzLCBidXQgeW91IHBhc3NlZCBpdDogJHthdHRyc31gKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGxpc3Qgb2YgYEJsb2Nrc2AgZnJvbSBgZWxlbWVudHNgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PEJsb2NrfE9iamVjdD58TGlzdDxCbG9ja3xPYmplY3Q+fSBlbGVtZW50c1xuICAgKiBAcmV0dXJuIHtMaXN0PEJsb2NrPn1cbiAgICovXG5cbiAgc3RhdGljIGNyZWF0ZUxpc3QoZWxlbWVudHMgPSBbXSkge1xuICAgIGlmIChMaXN0LmlzTGlzdChlbGVtZW50cykgfHwgQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBuZXcgTGlzdChlbGVtZW50cy5tYXAoQmxvY2suY3JlYXRlKSlcbiAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBCbG9jay5jcmVhdGVMaXN0XFxgIG9ubHkgYWNjZXB0cyBhcnJheXMgb3IgbGlzdHMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2VsZW1lbnRzfWApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBgdmFsdWVgIGlzIGEgYEJsb2NrYC5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHN0YXRpYyBpc0Jsb2NrKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlW01PREVMX1RZUEVTLkJMT0NLXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBibG9jayBsaXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzQmxvY2tMaXN0KHZhbHVlKSB7XG4gICAgcmV0dXJuIExpc3QuaXNMaXN0KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeShpdGVtID0+IEJsb2NrLmlzQmxvY2soaXRlbSkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBub2RlJ3Mga2luZC5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQga2luZCgpIHtcbiAgICByZXR1cm4gJ2Jsb2NrJ1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBibG9jayBpcyBlbXB0eS5cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgZ2V0IGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCA9PSAnJ1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29uY2F0ZW5hdGVkIHRleHQgb2YgYWxsIHRoZSBibG9jaydzIGNoaWxkcmVuLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCB0ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmdldFRleHQoKVxuICB9XG5cbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBwc2V1ZG8tc3ltYm9sIGZvciB0eXBlIGNoZWNraW5nLlxuICovXG5cbkJsb2NrLnByb3RvdHlwZVtNT0RFTF9UWVBFUy5CTE9DS10gPSB0cnVlXG5cbi8qKlxuICogTWl4IGluIGBOb2RlYCBtZXRob2RzLlxuICovXG5cbk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE5vZGUucHJvdG90eXBlKS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgaWYgKG1ldGhvZCA9PSAnY29uc3RydWN0b3InKSByZXR1cm5cbiAgQmxvY2sucHJvdG90eXBlW21ldGhvZF0gPSBOb2RlLnByb3RvdHlwZVttZXRob2RdXG59KVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7QmxvY2t9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgQmxvY2tcbiJdfQ==