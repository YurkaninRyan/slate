'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _memoize = require('../utils/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

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
  data: new _immutable.Map(),
  type: undefined

  /**
   * Mark.
   *
   * @type {Mark}
   */

};
var Mark = function (_Record) {
  _inherits(Mark, _Record);

  function Mark() {
    _classCallCheck(this, Mark);

    return _possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).apply(this, arguments));
  }

  _createClass(Mark, [{
    key: 'getComponent',


    /**
     * Get the component for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Component|Void}
     */

    value: function getComponent(schema) {
      return schema.__getComponent(this);
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     */

    get: function get() {
      return 'mark';
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Mark` with `attrs`.
     *
     * @param {Object|Mark} attrs
     * @return {Mark}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Mark.isMark(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var _attrs = attrs,
            data = _attrs.data,
            type = _attrs.type;


        if (typeof type != 'string') {
          throw new Error('`Mark.create` requires a mark `type` string.');
        }

        var mark = new Mark({
          type: type,
          data: _data2.default.create(data)
        });

        return mark;
      }

      throw new Error('`Mark.create` only accepts objects, strings or marks, but you passed it: ' + attrs);
    }

    /**
     * Create a set of marks.
     *
     * @param {Array<Object|Mark>} elements
     * @return {Set<Mark>}
     */

  }, {
    key: 'createSet',
    value: function createSet(elements) {
      if (_immutable.Set.isSet(elements) || Array.isArray(elements)) {
        var marks = new _immutable.Set(elements.map(Mark.create));
        return marks;
      }

      if (elements == null) {
        return new _immutable.Set();
      }

      throw new Error('`Mark.createSet` only accepts sets, arrays or null, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable mark properties from `attrs`.
     *
     * @param {Object|String|Mark} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Mark.isMark(attrs)) {
        return {
          data: attrs.data,
          type: attrs.type
        };
      }

      if (typeof attrs == 'string') {
        return { type: attrs };
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var props = {};
        if ('type' in attrs) props.type = attrs.type;
        if ('data' in attrs) props.data = _data2.default.create(attrs.data);
        return props;
      }

      throw new Error('`Mark.createProperties` only accepts objects, strings or marks, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `Mark`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isMark',
    value: function isMark(value) {
      return !!(value && value[_modelTypes2.default.MARK]);
    }

    /**
     * Check if a `value` is a set of marks.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isMarkSet',
    value: function isMarkSet(value) {
      return _immutable.Set.isSet(value) && value.every(function (item) {
        return Mark.isMark(item);
      });
    }
  }]);

  return Mark;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Mark.prototype[_modelTypes2.default.MARK] = true;

/**
 * Memoize read methods.
 */

(0, _memoize2.default)(Mark.prototype, ['getComponent'], {
  takesArguments: true
});

/**
 * Export.
 *
 * @type {Mark}
 */

exports.default = Mark;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvbWFyay5qcyJdLCJuYW1lcyI6WyJERUZBVUxUUyIsImRhdGEiLCJ0eXBlIiwidW5kZWZpbmVkIiwiTWFyayIsInNjaGVtYSIsIl9fZ2V0Q29tcG9uZW50IiwiYXR0cnMiLCJpc01hcmsiLCJFcnJvciIsIm1hcmsiLCJjcmVhdGUiLCJlbGVtZW50cyIsImlzU2V0IiwiQXJyYXkiLCJpc0FycmF5IiwibWFya3MiLCJtYXAiLCJwcm9wcyIsInZhbHVlIiwiTUFSSyIsImV2ZXJ5IiwiaXRlbSIsInByb3RvdHlwZSIsInRha2VzQXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsV0FBVztBQUNmQyxRQUFNLG9CQURTO0FBRWZDLFFBQU1DOztBQUdSOzs7Ozs7QUFMaUIsQ0FBakI7SUFXTUMsSTs7Ozs7Ozs7Ozs7OztBQW1ISjs7Ozs7OztpQ0FPYUMsTSxFQUFRO0FBQ25CLGFBQU9BLE9BQU9DLGNBQVAsQ0FBc0IsSUFBdEIsQ0FBUDtBQUNEOzs7OztBQWpCRDs7Ozt3QkFJVztBQUNULGFBQU8sTUFBUDtBQUNEOzs7OztBQS9HRDs7Ozs7Ozs2QkFPMEI7QUFBQSxVQUFaQyxLQUFZLHVFQUFKLEVBQUk7O0FBQ3hCLFVBQUlILEtBQUtJLE1BQUwsQ0FBWUQsS0FBWixDQUFKLEVBQXdCO0FBQ3RCLGVBQU9BLEtBQVA7QUFDRDs7QUFFRCxVQUFJLE9BQU9BLEtBQVAsSUFBZ0IsUUFBcEIsRUFBOEI7QUFDNUJBLGdCQUFRLEVBQUVMLE1BQU1LLEtBQVIsRUFBUjtBQUNEOztBQUVELFVBQUksNkJBQWNBLEtBQWQsQ0FBSixFQUEwQjtBQUFBLHFCQUNEQSxLQURDO0FBQUEsWUFDaEJOLElBRGdCLFVBQ2hCQSxJQURnQjtBQUFBLFlBQ1ZDLElBRFUsVUFDVkEsSUFEVTs7O0FBR3hCLFlBQUksT0FBT0EsSUFBUCxJQUFlLFFBQW5CLEVBQTZCO0FBQzNCLGdCQUFNLElBQUlPLEtBQUosQ0FBVSw4Q0FBVixDQUFOO0FBQ0Q7O0FBRUQsWUFBTUMsT0FBTyxJQUFJTixJQUFKLENBQVM7QUFDcEJGLG9CQURvQjtBQUVwQkQsZ0JBQU0sZUFBS1UsTUFBTCxDQUFZVixJQUFaO0FBRmMsU0FBVCxDQUFiOztBQUtBLGVBQU9TLElBQVA7QUFDRDs7QUFFRCxZQUFNLElBQUlELEtBQUosK0VBQXdGRixLQUF4RixDQUFOO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs4QkFPaUJLLFEsRUFBVTtBQUN6QixVQUFJLGVBQUlDLEtBQUosQ0FBVUQsUUFBVixLQUF1QkUsTUFBTUMsT0FBTixDQUFjSCxRQUFkLENBQTNCLEVBQW9EO0FBQ2xELFlBQU1JLFFBQVEsbUJBQVFKLFNBQVNLLEdBQVQsQ0FBYWIsS0FBS08sTUFBbEIsQ0FBUixDQUFkO0FBQ0EsZUFBT0ssS0FBUDtBQUNEOztBQUVELFVBQUlKLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsZUFBTyxvQkFBUDtBQUNEOztBQUVELFlBQU0sSUFBSUgsS0FBSiw2RUFBc0ZHLFFBQXRGLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7O3VDQU9vQztBQUFBLFVBQVpMLEtBQVksdUVBQUosRUFBSTs7QUFDbEMsVUFBSUgsS0FBS0ksTUFBTCxDQUFZRCxLQUFaLENBQUosRUFBd0I7QUFDdEIsZUFBTztBQUNMTixnQkFBTU0sTUFBTU4sSUFEUDtBQUVMQyxnQkFBTUssTUFBTUw7QUFGUCxTQUFQO0FBSUQ7O0FBRUQsVUFBSSxPQUFPSyxLQUFQLElBQWdCLFFBQXBCLEVBQThCO0FBQzVCLGVBQU8sRUFBRUwsTUFBTUssS0FBUixFQUFQO0FBQ0Q7O0FBRUQsVUFBSSw2QkFBY0EsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCLFlBQU1XLFFBQVEsRUFBZDtBQUNBLFlBQUksVUFBVVgsS0FBZCxFQUFxQlcsTUFBTWhCLElBQU4sR0FBYUssTUFBTUwsSUFBbkI7QUFDckIsWUFBSSxVQUFVSyxLQUFkLEVBQXFCVyxNQUFNakIsSUFBTixHQUFhLGVBQUtVLE1BQUwsQ0FBWUosTUFBTU4sSUFBbEIsQ0FBYjtBQUNyQixlQUFPaUIsS0FBUDtBQUNEOztBQUVELFlBQU0sSUFBSVQsS0FBSix5RkFBa0dGLEtBQWxHLENBQU47QUFDRDs7QUFFRDs7Ozs7Ozs7OzJCQU9jWSxLLEVBQU87QUFDbkIsYUFBTyxDQUFDLEVBQUVBLFNBQVNBLE1BQU0scUJBQVlDLElBQWxCLENBQVgsQ0FBUjtBQUNEOztBQUVEOzs7Ozs7Ozs7OEJBT2lCRCxLLEVBQU87QUFDdEIsYUFBTyxlQUFJTixLQUFKLENBQVVNLEtBQVYsS0FBb0JBLE1BQU1FLEtBQU4sQ0FBWTtBQUFBLGVBQVFqQixLQUFLSSxNQUFMLENBQVljLElBQVosQ0FBUjtBQUFBLE9BQVosQ0FBM0I7QUFDRDs7OztFQXpHZ0IsdUJBQU90QixRQUFQLEM7O0FBZ0luQjs7OztBQUlBSSxLQUFLbUIsU0FBTCxDQUFlLHFCQUFZSCxJQUEzQixJQUFtQyxJQUFuQzs7QUFFQTs7OztBQUlBLHVCQUFRaEIsS0FBS21CLFNBQWIsRUFBd0IsQ0FDdEIsY0FEc0IsQ0FBeEIsRUFFRztBQUNEQyxrQkFBZ0I7QUFEZixDQUZIOztBQU1BOzs7Ozs7a0JBTWVwQixJIiwiZmlsZSI6Im1hcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgRGF0YSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdpcy1wbGFpbi1vYmplY3QnXG5pbXBvcnQgbWVtb2l6ZSBmcm9tICcuLi91dGlscy9tZW1vaXplJ1xuaW1wb3J0IHsgTWFwLCBSZWNvcmQsIFNldCB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBEZWZhdWx0IHByb3BlcnRpZXMuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgZGF0YTogbmV3IE1hcCgpLFxuICB0eXBlOiB1bmRlZmluZWQsXG59XG5cbi8qKlxuICogTWFyay5cbiAqXG4gKiBAdHlwZSB7TWFya31cbiAqL1xuXG5jbGFzcyBNYXJrIGV4dGVuZHMgUmVjb3JkKERFRkFVTFRTKSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgTWFya2Agd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxNYXJrfSBhdHRyc1xuICAgKiBAcmV0dXJuIHtNYXJrfVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlKGF0dHJzID0ge30pIHtcbiAgICBpZiAoTWFyay5pc01hcmsoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGF0dHJzID09ICdzdHJpbmcnKSB7XG4gICAgICBhdHRycyA9IHsgdHlwZTogYXR0cnMgfVxuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3QgeyBkYXRhLCB0eXBlIH0gPSBhdHRyc1xuXG4gICAgICBpZiAodHlwZW9mIHR5cGUgIT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgTWFyay5jcmVhdGVgIHJlcXVpcmVzIGEgbWFyayBgdHlwZWAgc3RyaW5nLicpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hcmsgPSBuZXcgTWFyayh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIGRhdGE6IERhdGEuY3JlYXRlKGRhdGEpLFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIG1hcmtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYE1hcmsuY3JlYXRlXFxgIG9ubHkgYWNjZXB0cyBvYmplY3RzLCBzdHJpbmdzIG9yIG1hcmtzLCBidXQgeW91IHBhc3NlZCBpdDogJHthdHRyc31gKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHNldCBvZiBtYXJrcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3R8TWFyaz59IGVsZW1lbnRzXG4gICAqIEByZXR1cm4ge1NldDxNYXJrPn1cbiAgICovXG5cbiAgc3RhdGljIGNyZWF0ZVNldChlbGVtZW50cykge1xuICAgIGlmIChTZXQuaXNTZXQoZWxlbWVudHMpIHx8IEFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IG5ldyBTZXQoZWxlbWVudHMubWFwKE1hcmsuY3JlYXRlKSlcbiAgICAgIHJldHVybiBtYXJrc1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50cyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFNldCgpXG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBNYXJrLmNyZWF0ZVNldFxcYCBvbmx5IGFjY2VwdHMgc2V0cywgYXJyYXlzIG9yIG51bGwsIGJ1dCB5b3UgcGFzc2VkIGl0OiAke2VsZW1lbnRzfWApXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGljdGlvbmFyeSBvZiBzZXR0YWJsZSBtYXJrIHByb3BlcnRpZXMgZnJvbSBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd8TWFya30gYXR0cnNcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0aWMgY3JlYXRlUHJvcGVydGllcyhhdHRycyA9IHt9KSB7XG4gICAgaWYgKE1hcmsuaXNNYXJrKGF0dHJzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YTogYXR0cnMuZGF0YSxcbiAgICAgICAgdHlwZTogYXR0cnMudHlwZSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGF0dHJzID09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBhdHRycyB9XG4gICAgfVxuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QoYXR0cnMpKSB7XG4gICAgICBjb25zdCBwcm9wcyA9IHt9XG4gICAgICBpZiAoJ3R5cGUnIGluIGF0dHJzKSBwcm9wcy50eXBlID0gYXR0cnMudHlwZVxuICAgICAgaWYgKCdkYXRhJyBpbiBhdHRycykgcHJvcHMuZGF0YSA9IERhdGEuY3JlYXRlKGF0dHJzLmRhdGEpXG4gICAgICByZXR1cm4gcHJvcHNcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYE1hcmsuY3JlYXRlUHJvcGVydGllc1xcYCBvbmx5IGFjY2VwdHMgb2JqZWN0cywgc3RyaW5ncyBvciBtYXJrcywgYnV0IHlvdSBwYXNzZWQgaXQ6ICR7YXR0cnN9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBgTWFya2AuXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzdGF0aWMgaXNNYXJrKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlW01PREVMX1RZUEVTLk1BUktdKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgYHZhbHVlYCBpcyBhIHNldCBvZiBtYXJrcy5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHN0YXRpYyBpc01hcmtTZXQodmFsdWUpIHtcbiAgICByZXR1cm4gU2V0LmlzU2V0KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeShpdGVtID0+IE1hcmsuaXNNYXJrKGl0ZW0pKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUga2luZC5cbiAgICovXG5cbiAgZ2V0IGtpbmQoKSB7XG4gICAgcmV0dXJuICdtYXJrJ1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29tcG9uZW50IGZvciB0aGUgbm9kZSBmcm9tIGEgYHNjaGVtYWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hfSBzY2hlbWFcbiAgICogQHJldHVybiB7Q29tcG9uZW50fFZvaWR9XG4gICAqL1xuXG4gIGdldENvbXBvbmVudChzY2hlbWEpIHtcbiAgICByZXR1cm4gc2NoZW1hLl9fZ2V0Q29tcG9uZW50KHRoaXMpXG4gIH1cblxufVxuXG4vKipcbiAqIEF0dGFjaCBhIHBzZXVkby1zeW1ib2wgZm9yIHR5cGUgY2hlY2tpbmcuXG4gKi9cblxuTWFyay5wcm90b3R5cGVbTU9ERUxfVFlQRVMuTUFSS10gPSB0cnVlXG5cbi8qKlxuICogTWVtb2l6ZSByZWFkIG1ldGhvZHMuXG4gKi9cblxubWVtb2l6ZShNYXJrLnByb3RvdHlwZSwgW1xuICAnZ2V0Q29tcG9uZW50Jyxcbl0sIHtcbiAgdGFrZXNBcmd1bWVudHM6IHRydWUsXG59KVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7TWFya31cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBNYXJrXG4iXX0=