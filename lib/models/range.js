'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

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
   * Range.
   *
   * @type {Range}
   */

};
var Range = function (_Record) {
  _inherits(Range, _Record);

  function Range() {
    _classCallCheck(this, Range);

    return _possibleConstructorReturn(this, (Range.__proto__ || Object.getPrototypeOf(Range)).apply(this, arguments));
  }

  _createClass(Range, [{
    key: 'getCharacters',


    /**
     * Return range as a list of characters
     *
     * @return {List<Character>}
     */

    value: function getCharacters() {
      var marks = this.marks;

      var characters = _character2.default.createList(this.text.split('').map(function (char) {
        return _character2.default.create({
          text: char,
          marks: marks
        });
      }));

      return characters;
    }
  }, {
    key: 'kind',


    /**
     * Get the node's kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'range';
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Range` with `attrs`.
     *
     * @param {Object|Range} attrs
     * @return {Range}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Range.isRange(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { text: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var _attrs = attrs,
            marks = _attrs.marks,
            text = _attrs.text;

        var range = new Range({
          text: text,
          marks: _mark2.default.createSet(marks)
        });

        return range;
      }

      throw new Error('`Range.create` only accepts objects, strings or ranges, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `Range`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isRange',
    value: function isRange(value) {
      return !!(value && value[_modelTypes2.default.RANGE]);
    }

    /**
     * Check if a `value` is a list of ranges.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isRangeList',
    value: function isRangeList(value) {
      return _immutable.List.isList(value) && value.every(function (item) {
        return Range.isRange(item);
      });
    }
  }]);

  return Range;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[_modelTypes2.default.RANGE] = true;

/**
 * Export.
 *
 * @type {Range}
 */

exports.default = Range;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcmFuZ2UuanMiXSwibmFtZXMiOlsiREVGQVVMVFMiLCJtYXJrcyIsInRleHQiLCJSYW5nZSIsImNoYXJhY3RlcnMiLCJjcmVhdGVMaXN0Iiwic3BsaXQiLCJtYXAiLCJjaGFyIiwiY3JlYXRlIiwiYXR0cnMiLCJpc1JhbmdlIiwicmFuZ2UiLCJjcmVhdGVTZXQiLCJFcnJvciIsInZhbHVlIiwiUkFOR0UiLCJpc0xpc3QiLCJldmVyeSIsIml0ZW0iLCJwcm90b3R5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxXQUFXO0FBQ2ZDLFNBQU8sb0JBRFE7QUFFZkMsUUFBTTs7QUFHUjs7Ozs7O0FBTGlCLENBQWpCO0lBV01DLEs7Ozs7Ozs7Ozs7Ozs7QUErREo7Ozs7OztvQ0FNZ0I7QUFBQSxVQUNORixLQURNLEdBQ0ksSUFESixDQUNOQSxLQURNOztBQUVkLFVBQU1HLGFBQWEsb0JBQVVDLFVBQVYsQ0FBcUIsS0FBS0gsSUFBTCxDQUNyQ0ksS0FEcUMsQ0FDL0IsRUFEK0IsRUFFckNDLEdBRnFDLENBRWpDLFVBQUNDLElBQUQsRUFBVTtBQUNiLGVBQU8sb0JBQVVDLE1BQVYsQ0FBaUI7QUFDdEJQLGdCQUFNTSxJQURnQjtBQUV0QlA7QUFGc0IsU0FBakIsQ0FBUDtBQUlELE9BUHFDLENBQXJCLENBQW5COztBQVNBLGFBQU9HLFVBQVA7QUFDRDs7Ozs7QUE1QkQ7Ozs7Ozt3QkFNVztBQUNULGFBQU8sT0FBUDtBQUNEOzs7OztBQTNERDs7Ozs7Ozs2QkFPMEI7QUFBQSxVQUFaTSxLQUFZLHVFQUFKLEVBQUk7O0FBQ3hCLFVBQUlQLE1BQU1RLE9BQU4sQ0FBY0QsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCLGVBQU9BLEtBQVA7QUFDRDs7QUFFRCxVQUFJLE9BQU9BLEtBQVAsSUFBZ0IsUUFBcEIsRUFBOEI7QUFDNUJBLGdCQUFRLEVBQUVSLE1BQU1RLEtBQVIsRUFBUjtBQUNEOztBQUVELFVBQUksNkJBQWNBLEtBQWQsQ0FBSixFQUEwQjtBQUFBLHFCQUNBQSxLQURBO0FBQUEsWUFDaEJULEtBRGdCLFVBQ2hCQSxLQURnQjtBQUFBLFlBQ1RDLElBRFMsVUFDVEEsSUFEUzs7QUFFeEIsWUFBTVUsUUFBUSxJQUFJVCxLQUFKLENBQVU7QUFDdEJELG9CQURzQjtBQUV0QkQsaUJBQU8sZUFBS1ksU0FBTCxDQUFlWixLQUFmO0FBRmUsU0FBVixDQUFkOztBQUtBLGVBQU9XLEtBQVA7QUFDRDs7QUFFRCxZQUFNLElBQUlFLEtBQUosaUZBQTBGSixLQUExRixDQUFOO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs0QkFPZUssSyxFQUFPO0FBQ3BCLGFBQU8sQ0FBQyxFQUFFQSxTQUFTQSxNQUFNLHFCQUFZQyxLQUFsQixDQUFYLENBQVI7QUFDRDs7QUFFRDs7Ozs7Ozs7O2dDQU9tQkQsSyxFQUFPO0FBQ3hCLGFBQU8sZ0JBQUtFLE1BQUwsQ0FBWUYsS0FBWixLQUFzQkEsTUFBTUcsS0FBTixDQUFZO0FBQUEsZUFBUWYsTUFBTVEsT0FBTixDQUFjUSxJQUFkLENBQVI7QUFBQSxPQUFaLENBQTdCO0FBQ0Q7Ozs7RUFuRGlCLHVCQUFPbkIsUUFBUCxDOztBQXFGcEI7Ozs7QUFJQUcsTUFBTWlCLFNBQU4sQ0FBZ0IscUJBQVlKLEtBQTVCLElBQXFDLElBQXJDOztBQUVBOzs7Ozs7a0JBTWViLEsiLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vY2hhcmFjdGVyJ1xuaW1wb3J0IE1hcmsgZnJvbSAnLi9tYXJrJ1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnaXMtcGxhaW4tb2JqZWN0J1xuaW1wb3J0IHsgTGlzdCwgUmVjb3JkLCBTZXQgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogRGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuY29uc3QgREVGQVVMVFMgPSB7XG4gIG1hcmtzOiBuZXcgU2V0KCksXG4gIHRleHQ6ICcnLFxufVxuXG4vKipcbiAqIFJhbmdlLlxuICpcbiAqIEB0eXBlIHtSYW5nZX1cbiAqL1xuXG5jbGFzcyBSYW5nZSBleHRlbmRzIFJlY29yZChERUZBVUxUUykge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYFJhbmdlYCB3aXRoIGBhdHRyc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fFJhbmdlfSBhdHRyc1xuICAgKiBAcmV0dXJuIHtSYW5nZX1cbiAgICovXG5cbiAgc3RhdGljIGNyZWF0ZShhdHRycyA9IHt9KSB7XG4gICAgaWYgKFJhbmdlLmlzUmFuZ2UoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGF0dHJzID09ICdzdHJpbmcnKSB7XG4gICAgICBhdHRycyA9IHsgdGV4dDogYXR0cnMgfVxuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3QgeyBtYXJrcywgdGV4dCB9ID0gYXR0cnNcbiAgICAgIGNvbnN0IHJhbmdlID0gbmV3IFJhbmdlKHtcbiAgICAgICAgdGV4dCxcbiAgICAgICAgbWFya3M6IE1hcmsuY3JlYXRlU2V0KG1hcmtzKSxcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiByYW5nZVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgXFxgUmFuZ2UuY3JlYXRlXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzLCBzdHJpbmdzIG9yIHJhbmdlcywgYnV0IHlvdSBwYXNzZWQgaXQ6ICR7YXR0cnN9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBgUmFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzUmFuZ2UodmFsdWUpIHtcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbTU9ERUxfVFlQRVMuUkFOR0VdKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgYHZhbHVlYCBpcyBhIGxpc3Qgb2YgcmFuZ2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzUmFuZ2VMaXN0KHZhbHVlKSB7XG4gICAgcmV0dXJuIExpc3QuaXNMaXN0KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeShpdGVtID0+IFJhbmdlLmlzUmFuZ2UoaXRlbSkpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBub2RlJ3Mga2luZC5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQga2luZCgpIHtcbiAgICByZXR1cm4gJ3JhbmdlJ1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiByYW5nZSBhcyBhIGxpc3Qgb2YgY2hhcmFjdGVyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtMaXN0PENoYXJhY3Rlcj59XG4gICAqL1xuXG4gIGdldENoYXJhY3RlcnMoKSB7XG4gICAgY29uc3QgeyBtYXJrcyB9ID0gdGhpc1xuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBDaGFyYWN0ZXIuY3JlYXRlTGlzdCh0aGlzLnRleHRcbiAgICAgIC5zcGxpdCgnJylcbiAgICAgIC5tYXAoKGNoYXIpID0+IHtcbiAgICAgICAgcmV0dXJuIENoYXJhY3Rlci5jcmVhdGUoe1xuICAgICAgICAgIHRleHQ6IGNoYXIsXG4gICAgICAgICAgbWFya3NcbiAgICAgICAgfSlcbiAgICAgIH0pKVxuXG4gICAgcmV0dXJuIGNoYXJhY3RlcnNcbiAgfVxuXG59XG5cbi8qKlxuICogQXR0YWNoIGEgcHNldWRvLXN5bWJvbCBmb3IgdHlwZSBjaGVja2luZy5cbiAqL1xuXG5SYW5nZS5wcm90b3R5cGVbTU9ERUxfVFlQRVMuUkFOR0VdID0gdHJ1ZVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7UmFuZ2V9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgUmFuZ2VcbiJdfQ==