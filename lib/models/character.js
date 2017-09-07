'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  marks: new _immutable.Set(),
  text: ''

  /**
   * Character.
   *
   * @type {Character}
   */

};
var Character = function (_Record) {
  _inherits(Character, _Record);

  function Character() {
    _classCallCheck(this, Character);

    return _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).apply(this, arguments));
  }

  _createClass(Character, [{
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'character';
    }
  }], [{
    key: 'create',


    /**
     * Create a `Character` with `attrs`.
     *
     * @param {Object|String|Character} attrs
     * @return {Character}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Character.isCharacter(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { text: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var _attrs = attrs,
            marks = _attrs.marks,
            text = _attrs.text;


        var character = new Character({
          text: text,
          marks: _mark2.default.createSet(marks)
        });

        return character;
      }

      throw new Error('`Character.create` only accepts objects, strings or characters, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Characters` from `elements`.
     *
     * @param {String|Array<Object|Character|String>|List<Object|Character|String>} elements
     * @return {List<Character>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (typeof elements == 'string') {
        elements = elements.split('');
      }

      if (_immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new _immutable.List(elements.map(Character.create));
        return list;
      }

      throw new Error('`Block.createList` only accepts strings, arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Check if a `value` is a `Character`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isCharacter',
    value: function isCharacter(value) {
      return !!(value && value[_modelTypes2.default.CHARACTER]);
    }

    /**
     * Check if a `value` is a character list.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isCharacterList',
    value: function isCharacterList(value) {
      return _immutable.List.isList(value) && value.every(function (item) {
        return Character.isCharacter(item);
      });
    }

    /**
     * Deprecated.
     */

  }, {
    key: 'createListFromText',
    value: function createListFromText(string) {
      _logger2.default.deprecate('0.22.0', 'The `Character.createListFromText(string)` method is deprecated, use `Character.createList(string)` instead.');
      return this.createList(string);
    }
  }]);

  return Character;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Character.prototype[_modelTypes2.default.CHARACTER] = true;

/**
 * Export.
 *
 * @type {Character}
 */

exports.default = Character;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvY2hhcmFjdGVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRTIiwibWFya3MiLCJ0ZXh0IiwiQ2hhcmFjdGVyIiwiYXR0cnMiLCJpc0NoYXJhY3RlciIsImNoYXJhY3RlciIsImNyZWF0ZVNldCIsIkVycm9yIiwiZWxlbWVudHMiLCJzcGxpdCIsImlzTGlzdCIsIkFycmF5IiwiaXNBcnJheSIsImxpc3QiLCJtYXAiLCJjcmVhdGUiLCJ2YWx1ZSIsIkNIQVJBQ1RFUiIsImV2ZXJ5IiwiaXRlbSIsInN0cmluZyIsImRlcHJlY2F0ZSIsImNyZWF0ZUxpc3QiLCJwcm90b3R5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxXQUFXO0FBQ2ZDLFNBQU8sb0JBRFE7QUFFZkMsUUFBTTs7QUFHUjs7Ozs7O0FBTGlCLENBQWpCO0lBV01DLFM7Ozs7Ozs7Ozs7Ozs7QUFtRko7Ozs7Ozt3QkFNVztBQUNULGFBQU8sV0FBUDtBQUNEOzs7OztBQXpGRDs7Ozs7Ozs2QkFPMEI7QUFBQSxVQUFaQyxLQUFZLHVFQUFKLEVBQUk7O0FBQ3hCLFVBQUlELFVBQVVFLFdBQVYsQ0FBc0JELEtBQXRCLENBQUosRUFBa0M7QUFDaEMsZUFBT0EsS0FBUDtBQUNEOztBQUVELFVBQUksT0FBT0EsS0FBUCxJQUFnQixRQUFwQixFQUE4QjtBQUM1QkEsZ0JBQVEsRUFBRUYsTUFBTUUsS0FBUixFQUFSO0FBQ0Q7O0FBRUQsVUFBSSw2QkFBY0EsS0FBZCxDQUFKLEVBQTBCO0FBQUEscUJBQ0FBLEtBREE7QUFBQSxZQUNoQkgsS0FEZ0IsVUFDaEJBLEtBRGdCO0FBQUEsWUFDVEMsSUFEUyxVQUNUQSxJQURTOzs7QUFHeEIsWUFBTUksWUFBWSxJQUFJSCxTQUFKLENBQWM7QUFDOUJELG9CQUQ4QjtBQUU5QkQsaUJBQU8sZUFBS00sU0FBTCxDQUFlTixLQUFmO0FBRnVCLFNBQWQsQ0FBbEI7O0FBS0EsZUFBT0ssU0FBUDtBQUNEOztBQUVELFlBQU0sSUFBSUUsS0FBSix5RkFBa0dKLEtBQWxHLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7O2lDQU9pQztBQUFBLFVBQWZLLFFBQWUsdUVBQUosRUFBSTs7QUFDL0IsVUFBSSxPQUFPQSxRQUFQLElBQW1CLFFBQXZCLEVBQWlDO0FBQy9CQSxtQkFBV0EsU0FBU0MsS0FBVCxDQUFlLEVBQWYsQ0FBWDtBQUNEOztBQUVELFVBQUksZ0JBQUtDLE1BQUwsQ0FBWUYsUUFBWixLQUF5QkcsTUFBTUMsT0FBTixDQUFjSixRQUFkLENBQTdCLEVBQXNEO0FBQ3BELFlBQU1LLE9BQU8sb0JBQVNMLFNBQVNNLEdBQVQsQ0FBYVosVUFBVWEsTUFBdkIsQ0FBVCxDQUFiO0FBQ0EsZUFBT0YsSUFBUDtBQUNEOztBQUVELFlBQU0sSUFBSU4sS0FBSixtRkFBNEZDLFFBQTVGLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7O2dDQU9tQlEsSyxFQUFPO0FBQ3hCLGFBQU8sQ0FBQyxFQUFFQSxTQUFTQSxNQUFNLHFCQUFZQyxTQUFsQixDQUFYLENBQVI7QUFDRDs7QUFFRDs7Ozs7Ozs7O29DQU91QkQsSyxFQUFPO0FBQzVCLGFBQU8sZ0JBQUtOLE1BQUwsQ0FBWU0sS0FBWixLQUFzQkEsTUFBTUUsS0FBTixDQUFZO0FBQUEsZUFBUWhCLFVBQVVFLFdBQVYsQ0FBc0JlLElBQXRCLENBQVI7QUFBQSxPQUFaLENBQTdCO0FBQ0Q7O0FBRUQ7Ozs7Ozt1Q0FJMEJDLE0sRUFBUTtBQUNoQyx1QkFBT0MsU0FBUCxDQUFpQixRQUFqQixFQUEyQiw4R0FBM0I7QUFDQSxhQUFPLEtBQUtDLFVBQUwsQ0FBZ0JGLE1BQWhCLENBQVA7QUFDRDs7OztFQWpGcUIsdUJBQU9yQixRQUFQLEM7O0FBK0Z4Qjs7OztBQUlBRyxVQUFVcUIsU0FBVixDQUFvQixxQkFBWU4sU0FBaEMsSUFBNkMsSUFBN0M7O0FBRUE7Ozs7OztrQkFNZWYsUyIsImZpbGUiOiJjaGFyYWN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgTWFyayBmcm9tICcuL21hcmsnXG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdpcy1wbGFpbi1vYmplY3QnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcidcbmltcG9ydCB7IExpc3QsIFJlY29yZCwgU2V0IH0gZnJvbSAnaW1tdXRhYmxlJ1xuXG4vKipcbiAqIERlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBtYXJrczogbmV3IFNldCgpLFxuICB0ZXh0OiAnJyxcbn1cblxuLyoqXG4gKiBDaGFyYWN0ZXIuXG4gKlxuICogQHR5cGUge0NoYXJhY3Rlcn1cbiAqL1xuXG5jbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBSZWNvcmQoREVGQVVMVFMpIHtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgYENoYXJhY3RlcmAgd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd8Q2hhcmFjdGVyfSBhdHRyc1xuICAgKiBAcmV0dXJuIHtDaGFyYWN0ZXJ9XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGUoYXR0cnMgPSB7fSkge1xuICAgIGlmIChDaGFyYWN0ZXIuaXNDaGFyYWN0ZXIoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGF0dHJzID09ICdzdHJpbmcnKSB7XG4gICAgICBhdHRycyA9IHsgdGV4dDogYXR0cnMgfVxuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3QgeyBtYXJrcywgdGV4dCB9ID0gYXR0cnNcblxuICAgICAgY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3Rlcih7XG4gICAgICAgIHRleHQsXG4gICAgICAgIG1hcmtzOiBNYXJrLmNyZWF0ZVNldChtYXJrcyksXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBDaGFyYWN0ZXIuY3JlYXRlXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzLCBzdHJpbmdzIG9yIGNoYXJhY3RlcnMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2F0dHJzfWApXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbGlzdCBvZiBgQ2hhcmFjdGVyc2AgZnJvbSBgZWxlbWVudHNgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheTxPYmplY3R8Q2hhcmFjdGVyfFN0cmluZz58TGlzdDxPYmplY3R8Q2hhcmFjdGVyfFN0cmluZz59IGVsZW1lbnRzXG4gICAqIEByZXR1cm4ge0xpc3Q8Q2hhcmFjdGVyPn1cbiAgICovXG5cbiAgc3RhdGljIGNyZWF0ZUxpc3QoZWxlbWVudHMgPSBbXSkge1xuICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT0gJ3N0cmluZycpIHtcbiAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuc3BsaXQoJycpXG4gICAgfVxuXG4gICAgaWYgKExpc3QuaXNMaXN0KGVsZW1lbnRzKSB8fCBBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgICAgY29uc3QgbGlzdCA9IG5ldyBMaXN0KGVsZW1lbnRzLm1hcChDaGFyYWN0ZXIuY3JlYXRlKSlcbiAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBCbG9jay5jcmVhdGVMaXN0XFxgIG9ubHkgYWNjZXB0cyBzdHJpbmdzLCBhcnJheXMgb3IgbGlzdHMsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2VsZW1lbnRzfWApXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBgdmFsdWVgIGlzIGEgYENoYXJhY3RlcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNDaGFyYWN0ZXIodmFsdWUpIHtcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbTU9ERUxfVFlQRVMuQ0hBUkFDVEVSXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBjaGFyYWN0ZXIgbGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHN0YXRpYyBpc0NoYXJhY3Rlckxpc3QodmFsdWUpIHtcbiAgICByZXR1cm4gTGlzdC5pc0xpc3QodmFsdWUpICYmIHZhbHVlLmV2ZXJ5KGl0ZW0gPT4gQ2hhcmFjdGVyLmlzQ2hhcmFjdGVyKGl0ZW0pKVxuICB9XG5cbiAgLyoqXG4gICAqIERlcHJlY2F0ZWQuXG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGVMaXN0RnJvbVRleHQoc3RyaW5nKSB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4yMi4wJywgJ1RoZSBgQ2hhcmFjdGVyLmNyZWF0ZUxpc3RGcm9tVGV4dChzdHJpbmcpYCBtZXRob2QgaXMgZGVwcmVjYXRlZCwgdXNlIGBDaGFyYWN0ZXIuY3JlYXRlTGlzdChzdHJpbmcpYCBpbnN0ZWFkLicpXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlTGlzdChzdHJpbmcpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBraW5kLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBraW5kKCkge1xuICAgIHJldHVybiAnY2hhcmFjdGVyJ1xuICB9XG5cbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBwc2V1ZG8tc3ltYm9sIGZvciB0eXBlIGNoZWNraW5nLlxuICovXG5cbkNoYXJhY3Rlci5wcm90b3R5cGVbTU9ERUxfVFlQRVMuQ0hBUkFDVEVSXSA9IHRydWVcblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0NoYXJhY3Rlcn1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiJdfQ==