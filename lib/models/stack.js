'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _core = require('../plugins/core');

var _core2 = _interopRequireDefault(_core);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _schema2 = require('./schema');

var _schema3 = _interopRequireDefault(_schema2);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:stack');

/**
 * Methods that are triggered on events and can change the state.
 *
 * @type {Array}
 */

var METHODS = ['onBeforeInput', 'onBeforeChange', 'onBlur', 'onCopy', 'onCut', 'onDrop', 'onFocus', 'onKeyDown', 'onKeyUp', 'onPaste', 'onSelect', 'onChange'];

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  plugins: [],
  schema: new _schema3.default()

  /**
   * Stack.
   *
   * @type {Stack}
   */

};
var Stack = function (_Record) {
  _inherits(Stack, _Record);

  function Stack() {
    _classCallCheck(this, Stack);

    return _possibleConstructorReturn(this, (Stack.__proto__ || Object.getPrototypeOf(Stack)).apply(this, arguments));
  }

  _createClass(Stack, [{
    key: 'render',


    /**
     * Invoke `render` on all of the plugins in reverse, building up a tree of
     * higher-order components.
     *
     * @param {State} state
     * @param {Editor} editor
     * @param {Object} children
     * @param {Object} props
     * @return {Component}
     */

    value: function render(state, editor, props) {
      debug('render');
      var plugins = this.plugins.slice().reverse();
      var children = void 0;

      for (var i = 0; i < plugins.length; i++) {
        var plugin = plugins[i];
        if (!plugin.render) continue;
        children = plugin.render(props, state, editor);
        props.children = children;
      }

      return children;
    }

    /**
     * Invoke `renderPortal` on all of the plugins, building a list of portals.
     *
     * @param {State} state
     * @param {Editor} editor
     * @return {Array}
     */

  }, {
    key: 'renderPortal',
    value: function renderPortal(state, editor) {
      debug('renderPortal');
      var portals = [];

      for (var i = 0; i < this.plugins.length; i++) {
        var plugin = this.plugins[i];
        if (!plugin.renderPortal) continue;
        var portal = plugin.renderPortal(state, editor);
        if (portal) portals.push(portal);
      }

      return portals;
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'stack';
    }
  }], [{
    key: 'create',


    /**
     * Constructor.
     *
     * @param {Object} attrs
     *   @property {Array} plugins
     *   @property {Schema|Object} schema
     *   @property {Function} ...handlers
     */

    value: function create(attrs) {
      var plugins = resolvePlugins(attrs);
      var schema = resolveSchema(plugins);
      var stack = new Stack({ plugins: plugins, schema: schema });
      return stack;
    }

    /**
     * Check if a `value` is a `Stack`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isStack',
    value: function isStack(value) {
      return !!(value && value[_modelTypes2.default.STACK]);
    }
  }]);

  return Stack;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Stack.prototype[_modelTypes2.default.STACK] = true;

/**
 * Mix in the stack methods.
 *
 * @param {Change} change
 * @param {Editor} editor
 * @param {Mixed} ...args
 */

var _loop = function _loop(i) {
  var method = METHODS[i];
  Stack.prototype[method] = function (change, editor) {
    debug(method);

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    for (var k = 0; k < this.plugins.length; k++) {
      var plugin = this.plugins[k];
      if (!plugin[method]) continue;
      var next = plugin[method].apply(plugin, args.concat([change, editor]));
      if (next != null) break;
    }
  };
};

for (var i = 0; i < METHODS.length; i++) {
  _loop(i);
}

/**
 * Resolve a schema from a set of `plugins`.
 *
 * @param {Array} plugins
 * @return {Schema}
 */

function resolveSchema(plugins) {
  var rules = [];

  for (var i = 0; i < plugins.length; i++) {
    var plugin = plugins[i];
    if (plugin.schema == null) continue;
    var _schema = _schema3.default.create(plugin.schema);
    rules = rules.concat(_schema.rules);
  }

  var schema = _schema3.default.create({ rules: rules });
  return schema;
}

/**
 * Resolve an array of plugins from `properties`.
 *
 * In addition to the plugins provided in `properties.plugins`, this will
 * create two other plugins:
 *
 * - A plugin made from the top-level `properties` themselves, which are
 * placed at the beginning of the stack. That way, you can add a `onKeyDown`
 * handler, and it will override all of the existing plugins.
 *
 * - A "core" functionality plugin that handles the most basic events in Slate,
 * like deleting characters, splitting blocks, etc.
 *
 * @param {Object} props
 * @return {Array}
 */

function resolvePlugins(props) {
  var _props$plugins = props.plugins,
      plugins = _props$plugins === undefined ? [] : _props$plugins,
      overridePlugin = _objectWithoutProperties(props, ['plugins']);

  var corePlugin = (0, _core2.default)(props);
  return [overridePlugin].concat(_toConsumableArray(plugins), [corePlugin]);
}

/**
 * Export.
 *
 * @type {Stack}
 */

exports.default = Stack;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc3RhY2suanMiXSwibmFtZXMiOlsiZGVidWciLCJNRVRIT0RTIiwiREVGQVVMVFMiLCJwbHVnaW5zIiwic2NoZW1hIiwiU3RhY2siLCJzdGF0ZSIsImVkaXRvciIsInByb3BzIiwic2xpY2UiLCJyZXZlcnNlIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwicGx1Z2luIiwicmVuZGVyIiwicG9ydGFscyIsInJlbmRlclBvcnRhbCIsInBvcnRhbCIsInB1c2giLCJhdHRycyIsInJlc29sdmVQbHVnaW5zIiwicmVzb2x2ZVNjaGVtYSIsInN0YWNrIiwidmFsdWUiLCJTVEFDSyIsInByb3RvdHlwZSIsIm1ldGhvZCIsImNoYW5nZSIsImFyZ3MiLCJrIiwibmV4dCIsInJ1bGVzIiwiY3JlYXRlIiwiY29uY2F0Iiwib3ZlcnJpZGVQbHVnaW4iLCJjb3JlUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQU1BLElBQU1BLFFBQVEscUJBQU0sYUFBTixDQUFkOztBQUVBOzs7Ozs7QUFNQSxJQUFNQyxVQUFVLENBQ2QsZUFEYyxFQUVkLGdCQUZjLEVBR2QsUUFIYyxFQUlkLFFBSmMsRUFLZCxPQUxjLEVBTWQsUUFOYyxFQU9kLFNBUGMsRUFRZCxXQVJjLEVBU2QsU0FUYyxFQVVkLFNBVmMsRUFXZCxVQVhjLEVBWWQsVUFaYyxDQUFoQjs7QUFlQTs7Ozs7O0FBTUEsSUFBTUMsV0FBVztBQUNmQyxXQUFTLEVBRE07QUFFZkMsVUFBUTs7QUFHVjs7Ozs7O0FBTGlCLENBQWpCO0lBV01DLEs7Ozs7Ozs7Ozs7Ozs7QUF1Q0o7Ozs7Ozs7Ozs7OzJCQVdPQyxLLEVBQU9DLE0sRUFBUUMsSyxFQUFPO0FBQzNCUixZQUFNLFFBQU47QUFDQSxVQUFNRyxVQUFVLEtBQUtBLE9BQUwsQ0FBYU0sS0FBYixHQUFxQkMsT0FBckIsRUFBaEI7QUFD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SUUsT0FBT1YsTUFBUCxJQUFpQixJQUFyQixFQUEyQjtBQUMzQixRQUFNQSxVQUFTLGlCQUFPNkIsTUFBUCxDQUFjbkIsT0FBT1YsTUFBckIsQ0FBZjtBQUNBNEIsWUFBUUEsTUFBTUUsTUFBTixDQUFhOUIsUUFBTzRCLEtBQXBCLENBQVI7QUFDRDs7QUFFRCxNQUFNNUIsU0FBUyxpQkFBTzZCLE1BQVAsQ0FBYyxFQUFFRCxZQUFGLEVBQWQsQ0FBZjtBQUNBLFNBQU81QixNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLFNBQVNpQixjQUFULENBQXdCYixLQUF4QixFQUErQjtBQUFBLHVCQUNlQSxLQURmLENBQ3JCTCxPQURxQjtBQUFBLE1BQ3JCQSxPQURxQixrQ0FDWCxFQURXO0FBQUEsTUFDSmdDLGNBREksNEJBQ2UzQixLQURmOztBQUU3QixNQUFNNEIsYUFBYSxvQkFBVzVCLEtBQVgsQ0FBbkI7QUFDQSxVQUNFMkIsY0FERiw0QkFFS2hDLE9BRkwsSUFHRWlDLFVBSEY7QUFLRDs7QUFFRDs7Ozs7O2tCQU1lL0IsSyIsImZpbGUiOiJzdGFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IE1PREVMX1RZUEVTIGZyb20gJy4uL2NvbnN0YW50cy9tb2RlbC10eXBlcydcbmltcG9ydCBDb3JlUGx1Z2luIGZyb20gJy4uL3BsdWdpbnMvY29yZSdcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnXG5pbXBvcnQgeyBSZWNvcmQgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogRGVidWcuXG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ3NsYXRlOnN0YWNrJylcblxuLyoqXG4gKiBNZXRob2RzIHRoYXQgYXJlIHRyaWdnZXJlZCBvbiBldmVudHMgYW5kIGNhbiBjaGFuZ2UgdGhlIHN0YXRlLlxuICpcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuXG5jb25zdCBNRVRIT0RTID0gW1xuICAnb25CZWZvcmVJbnB1dCcsXG4gICdvbkJlZm9yZUNoYW5nZScsXG4gICdvbkJsdXInLFxuICAnb25Db3B5JyxcbiAgJ29uQ3V0JyxcbiAgJ29uRHJvcCcsXG4gICdvbkZvY3VzJyxcbiAgJ29uS2V5RG93bicsXG4gICdvbktleVVwJyxcbiAgJ29uUGFzdGUnLFxuICAnb25TZWxlY3QnLFxuICAnb25DaGFuZ2UnLFxuXVxuXG4vKipcbiAqIERlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBwbHVnaW5zOiBbXSxcbiAgc2NoZW1hOiBuZXcgU2NoZW1hKCksXG59XG5cbi8qKlxuICogU3RhY2suXG4gKlxuICogQHR5cGUge1N0YWNrfVxuICovXG5cbmNsYXNzIFN0YWNrIGV4dGVuZHMgUmVjb3JkKERFRkFVTFRTKSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cnNcbiAgICogICBAcHJvcGVydHkge0FycmF5fSBwbHVnaW5zXG4gICAqICAgQHByb3BlcnR5IHtTY2hlbWF8T2JqZWN0fSBzY2hlbWFcbiAgICogICBAcHJvcGVydHkge0Z1bmN0aW9ufSAuLi5oYW5kbGVyc1xuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlKGF0dHJzKSB7XG4gICAgY29uc3QgcGx1Z2lucyA9IHJlc29sdmVQbHVnaW5zKGF0dHJzKVxuICAgIGNvbnN0IHNjaGVtYSA9IHJlc29sdmVTY2hlbWEocGx1Z2lucylcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh7IHBsdWdpbnMsIHNjaGVtYSB9KVxuICAgIHJldHVybiBzdGFja1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgYHZhbHVlYCBpcyBhIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNTdGFjayh2YWx1ZSkge1xuICAgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZVtNT0RFTF9UWVBFUy5TVEFDS10pXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBraW5kLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBraW5kKCkge1xuICAgIHJldHVybiAnc3RhY2snXG4gIH1cblxuICAvKipcbiAgICogSW52b2tlIGByZW5kZXJgIG9uIGFsbCBvZiB0aGUgcGx1Z2lucyBpbiByZXZlcnNlLCBidWlsZGluZyB1cCBhIHRyZWUgb2ZcbiAgICogaGlnaGVyLW9yZGVyIGNvbXBvbmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlXG4gICAqIEBwYXJhbSB7RWRpdG9yfSBlZGl0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gICAqL1xuXG4gIHJlbmRlcihzdGF0ZSwgZWRpdG9yLCBwcm9wcykge1xuICAgIGRlYnVnKCdyZW5kZXInKVxuICAgIGNvbnN0IHBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuc2xpY2UoKS5yZXZlcnNlKClcbiAgICBsZXQgY2hpbGRyZW5cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcGx1Z2luID0gcGx1Z2luc1tpXVxuICAgICAgaWYgKCFwbHVnaW4ucmVuZGVyKSBjb250aW51ZVxuICAgICAgY2hpbGRyZW4gPSBwbHVnaW4ucmVuZGVyKHByb3BzLCBzdGF0ZSwgZWRpdG9yKVxuICAgICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlblxuICAgIH1cblxuICAgIHJldHVybiBjaGlsZHJlblxuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZSBgcmVuZGVyUG9ydGFsYCBvbiBhbGwgb2YgdGhlIHBsdWdpbnMsIGJ1aWxkaW5nIGEgbGlzdCBvZiBwb3J0YWxzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcGFyYW0ge0VkaXRvcn0gZWRpdG9yXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICByZW5kZXJQb3J0YWwoc3RhdGUsIGVkaXRvcikge1xuICAgIGRlYnVnKCdyZW5kZXJQb3J0YWwnKVxuICAgIGNvbnN0IHBvcnRhbHMgPSBbXVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luc1tpXVxuICAgICAgaWYgKCFwbHVnaW4ucmVuZGVyUG9ydGFsKSBjb250aW51ZVxuICAgICAgY29uc3QgcG9ydGFsID0gcGx1Z2luLnJlbmRlclBvcnRhbChzdGF0ZSwgZWRpdG9yKVxuICAgICAgaWYgKHBvcnRhbCkgcG9ydGFscy5wdXNoKHBvcnRhbClcbiAgICB9XG5cbiAgICByZXR1cm4gcG9ydGFsc1xuICB9XG5cbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBwc2V1ZG8tc3ltYm9sIGZvciB0eXBlIGNoZWNraW5nLlxuICovXG5cblN0YWNrLnByb3RvdHlwZVtNT0RFTF9UWVBFUy5TVEFDS10gPSB0cnVlXG5cbi8qKlxuICogTWl4IGluIHRoZSBzdGFjayBtZXRob2RzLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7RWRpdG9yfSBlZGl0b3JcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLmFyZ3NcbiAqL1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IE1FVEhPRFMubGVuZ3RoOyBpKyspIHtcbiAgY29uc3QgbWV0aG9kID0gTUVUSE9EU1tpXVxuICBTdGFjay5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChjaGFuZ2UsIGVkaXRvciwgLi4uYXJncykge1xuICAgIGRlYnVnKG1ldGhvZClcblxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5wbHVnaW5zLmxlbmd0aDsgaysrKSB7XG4gICAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnNba11cbiAgICAgIGlmICghcGx1Z2luW21ldGhvZF0pIGNvbnRpbnVlXG4gICAgICBjb25zdCBuZXh0ID0gcGx1Z2luW21ldGhvZF0oLi4uYXJncywgY2hhbmdlLCBlZGl0b3IpXG4gICAgICBpZiAobmV4dCAhPSBudWxsKSBicmVha1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlc29sdmUgYSBzY2hlbWEgZnJvbSBhIHNldCBvZiBgcGx1Z2luc2AuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGx1Z2luc1xuICogQHJldHVybiB7U2NoZW1hfVxuICovXG5cbmZ1bmN0aW9uIHJlc29sdmVTY2hlbWEocGx1Z2lucykge1xuICBsZXQgcnVsZXMgPSBbXVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBsdWdpbiA9IHBsdWdpbnNbaV1cbiAgICBpZiAocGx1Z2luLnNjaGVtYSA9PSBudWxsKSBjb250aW51ZVxuICAgIGNvbnN0IHNjaGVtYSA9IFNjaGVtYS5jcmVhdGUocGx1Z2luLnNjaGVtYSlcbiAgICBydWxlcyA9IHJ1bGVzLmNvbmNhdChzY2hlbWEucnVsZXMpXG4gIH1cblxuICBjb25zdCBzY2hlbWEgPSBTY2hlbWEuY3JlYXRlKHsgcnVsZXMgfSlcbiAgcmV0dXJuIHNjaGVtYVxufVxuXG4vKipcbiAqIFJlc29sdmUgYW4gYXJyYXkgb2YgcGx1Z2lucyBmcm9tIGBwcm9wZXJ0aWVzYC5cbiAqXG4gKiBJbiBhZGRpdGlvbiB0byB0aGUgcGx1Z2lucyBwcm92aWRlZCBpbiBgcHJvcGVydGllcy5wbHVnaW5zYCwgdGhpcyB3aWxsXG4gKiBjcmVhdGUgdHdvIG90aGVyIHBsdWdpbnM6XG4gKlxuICogLSBBIHBsdWdpbiBtYWRlIGZyb20gdGhlIHRvcC1sZXZlbCBgcHJvcGVydGllc2AgdGhlbXNlbHZlcywgd2hpY2ggYXJlXG4gKiBwbGFjZWQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RhY2suIFRoYXQgd2F5LCB5b3UgY2FuIGFkZCBhIGBvbktleURvd25gXG4gKiBoYW5kbGVyLCBhbmQgaXQgd2lsbCBvdmVycmlkZSBhbGwgb2YgdGhlIGV4aXN0aW5nIHBsdWdpbnMuXG4gKlxuICogLSBBIFwiY29yZVwiIGZ1bmN0aW9uYWxpdHkgcGx1Z2luIHRoYXQgaGFuZGxlcyB0aGUgbW9zdCBiYXNpYyBldmVudHMgaW4gU2xhdGUsXG4gKiBsaWtlIGRlbGV0aW5nIGNoYXJhY3RlcnMsIHNwbGl0dGluZyBibG9ja3MsIGV0Yy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIHJlc29sdmVQbHVnaW5zKHByb3BzKSB7XG4gIGNvbnN0IHsgcGx1Z2lucyA9IFtdLCAuLi5vdmVycmlkZVBsdWdpbiB9ID0gcHJvcHNcbiAgY29uc3QgY29yZVBsdWdpbiA9IENvcmVQbHVnaW4ocHJvcHMpXG4gIHJldHVybiBbXG4gICAgb3ZlcnJpZGVQbHVnaW4sXG4gICAgLi4ucGx1Z2lucyxcbiAgICBjb3JlUGx1Z2luXG4gIF1cbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge1N0YWNrfVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IFN0YWNrXG4iXX0=