'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _changes = require('../changes');

var _changes2 = _interopRequireDefault(_changes);

var _apply = require('../operations/apply');

var _apply2 = _interopRequireDefault(_apply);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:change');

/**
 * Change.
 *
 * @type {Change}
 */

var Change = function () {
  _createClass(Change, null, [{
    key: 'isChange',


    /**
     * Check if a `value` is a `Change`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

    value: function isChange(value) {
      return !!(value && value[_modelTypes2.default.CHANGE]);
    }

    /**
     * Create a new `Change` with `attrs`.
     *
     * @param {Object} attrs
     *   @property {State} state
     */

  }]);

  function Change(attrs) {
    _classCallCheck(this, Change);

    var state = attrs.state;

    this.state = state;
    this.operations = [];
    this.flags = (0, _pick2.default)(attrs, ['merge', 'save']);
    this.setIsNative(attrs.isNative === undefined ? false : attrs.isNative);
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  _createClass(Change, [{
    key: 'applyOperation',


    /**
     * Apply an `operation` to the current state, saving the operation to the
     * history if needed.
     *
     * @param {Object} operation
     * @param {Object} options
     * @return {Change}
     */

    value: function applyOperation(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var operations = this.operations,
          flags = this.flags;
      var state = this.state;
      var _state = state,
          history = _state.history;

      // Default options to the change-level flags, this allows for setting
      // specific options for all of the operations of a given change.

      options = _extends({}, flags, options);

      // Derive the default option values.
      var _options = options,
          _options$merge = _options.merge,
          merge = _options$merge === undefined ? operations.length == 0 ? null : true : _options$merge,
          _options$save = _options.save,
          save = _options$save === undefined ? true : _options$save,
          _options$skip = _options.skip,
          skip = _options$skip === undefined ? null : _options$skip;

      // Apply the operation to the state.

      debug('apply', { operation: operation, save: save, merge: merge });
      state = (0, _apply2.default)(state, operation);

      // If needed, save the operation to the history.
      if (history && save) {
        history = history.save(operation, { merge: merge, skip: skip });
        state = state.set('history', history);
      }

      // Update the mutable change object.
      this.state = state;
      this.operations.push(operation);
      return this;
    }

    /**
     * Apply a series of `operations` to the current state.
     *
     * @param {Array} operations
     * @param {Object} options
     * @return {Change}
     */

  }, {
    key: 'applyOperations',
    value: function applyOperations(operations, options) {
      var _this = this;

      operations.forEach(function (op) {
        return _this.applyOperation(op, options);
      });
      return this;
    }

    /**
     * Call a change `fn` with arguments.
     *
     * @param {Function} fn
     * @param {Mixed} ...args
     * @return {Change}
     */

  }, {
    key: 'call',
    value: function call(fn) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      fn.apply(undefined, [this].concat(args));
      return this;
    }

    /**
     * Set an operation flag by `key` to `value`.
     *
     * @param {String} key
     * @param {Any} value
     * @return {Change}
     */

  }, {
    key: 'setOperationFlag',
    value: function setOperationFlag(key, value) {
      this.flags[key] = value;
      return this;
    }

    /**
     * Unset an operation flag by `key`.
     *
     * @param {String} key
     * @return {Change}
     */

  }, {
    key: 'unsetOperationFlag',
    value: function unsetOperationFlag(key) {
      delete this.flags[key];
      return this;
    }

    /**
     * Deprecated.
     *
     * @return {State}
     */

  }, {
    key: 'apply',
    value: function apply() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _logger2.default.deprecate('0.22.0', 'The `change.apply()` method is deprecrated and no longer necessary, as all operations are applied immediately when invoked. You can access the change\'s state, which is already pre-computed, directly via `change.state` instead.');
      return this.state;
    }
  }, {
    key: 'kind',
    get: function get() {
      return 'change';
    }
  }]);

  return Change;
}();

/**
 * Attach a pseudo-symbol for type checking.
 */

Change.prototype[_modelTypes2.default.CHANGE] = true;

/**
 * Add a change method for each of the changes.
 */

Object.keys(_changes2.default).forEach(function (type) {
  Change.prototype[type] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug(type, { args: args });
    this.call.apply(this, [_changes2.default[type]].concat(args));
    return this;
  };
})

/**
 * Add deprecation warnings in case people try to access a change as a state.
 */

;['hasUndos', 'hasRedos', 'isBlurred', 'isFocused', 'isCollapsed', 'isExpanded', 'isBackward', 'isForward', 'startKey', 'endKey', 'startOffset', 'endOffset', 'anchorKey', 'focusKey', 'anchorOffset', 'focusOffset', 'startBlock', 'endBlock', 'anchorBlock', 'focusBlock', 'startInline', 'endInline', 'anchorInline', 'focusInline', 'startText', 'endText', 'anchorText', 'focusText', 'characters', 'marks', 'blocks', 'fragment', 'inlines', 'texts', 'isEmpty'].forEach(function (getter) {
  Object.defineProperty(Change.prototype, getter, {
    get: function get() {
      _logger2.default.deprecate('0.22.0', 'You attempted to access the `' + getter + '` property of what was previously a `state` object but is now a `change` object. This syntax has been deprecated as plugins are now passed `change` objects instead of `state` objects.');
      return this.state[getter];
    }
  });
});

Change.prototype.transform = function () {
  _logger2.default.deprecate('0.22.0', 'You attempted to call `.transform()` on what was previously a `state` object but is now already a `change` object. This syntax has been deprecated as plugins are now passed `change` objects instead of `state` objects.');
  return this;
};

/**
 * Export.
 *
 * @type {Change}
 */

exports.default = Change;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvY2hhbmdlLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiQ2hhbmdlIiwidmFsdWUiLCJDSEFOR0UiLCJhdHRycyIsInN0YXRlIiwib3BlcmF0aW9ucyIsImZsYWdzIiwic2V0SXNOYXRpdmUiLCJpc05hdGl2ZSIsInVuZGVmaW5lZCIsIm9wZXJhdGlvbiIsIm9wdGlvbnMiLCJoaXN0b3J5IiwibWVyZ2UiLCJsZW5ndGgiLCJzYXZlIiwic2tpcCIsInNldCIsInB1c2giLCJmb3JFYWNoIiwiYXBwbHlPcGVyYXRpb24iLCJvcCIsImZuIiwiYXJncyIsImtleSIsImRlcHJlY2F0ZSIsInByb3RvdHlwZSIsIk9iamVjdCIsImtleXMiLCJ0eXBlIiwiY2FsbCIsImdldHRlciIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwidHJhbnNmb3JtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxRQUFRLHFCQUFNLGNBQU4sQ0FBZDs7QUFFQTs7Ozs7O0lBTU1DLE07Ozs7O0FBRUo7Ozs7Ozs7NkJBT2dCQyxLLEVBQU87QUFDckIsYUFBTyxDQUFDLEVBQUVBLFNBQVNBLE1BQU0scUJBQVlDLE1BQWxCLENBQVgsQ0FBUjtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFPQSxrQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLFFBQ1RDLEtBRFMsR0FDQ0QsS0FERCxDQUNUQyxLQURTOztBQUVqQixTQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLG9CQUFLSCxLQUFMLEVBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFaLENBQWI7QUFDQSxTQUFLSSxXQUFMLENBQWlCSixNQUFNSyxRQUFOLEtBQW1CQyxTQUFuQixHQUErQixLQUEvQixHQUF1Q04sTUFBTUss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SUFBUDtBQUNELEdBSkQ7QUFLRCxDQU5EOztBQVFBOzs7O0FBUkEsQ0FZQyxDQUNDLFVBREQsRUFFQyxVQUZELEVBR0MsV0FIRCxFQUlDLFdBSkQsRUFLQyxhQUxELEVBTUMsWUFORCxFQU9DLFlBUEQsRUFRQyxXQVJELEVBU0MsVUFURCxFQVVDLFFBVkQsRUFXQyxhQVhELEVBWUMsV0FaRCxFQWFDLFdBYkQsRUFjQyxVQWRELEVBZUMsY0FmRCxFQWdCQyxhQWhCRCxFQWlCQyxZQWpCRCxFQWtCQyxVQWxCRCxFQW1CQyxhQW5CRCxFQW9CQyxZQXBCRCxFQXFCQyxhQXJCRCxFQXNCQyxXQXRCRCxFQXVCQyxjQXZCRCxFQXdCQyxhQXhCRCxFQXlCQyxXQXpCRCxFQTBCQyxTQTFCRCxFQTJCQyxZQTNCRCxFQTRCQyxXQTVCRCxFQTZCQyxZQTdCRCxFQThCQyxPQTlCRCxFQStCQyxRQS9CRCxFQWdDQyxVQWhDRCxFQWlDQyxTQWpDRCxFQWtDQyxPQWxDRCxFQW1DQyxTQW5DRCxFQW9DQ0osT0FwQ0QsQ0FvQ1MsVUFBQ1ksTUFBRCxFQUFZO0FBQ3BCSixTQUFPSyxjQUFQLENBQXNCaEMsT0FBTzBCLFNBQTdCLEVBQXdDSyxNQUF4QyxFQUFnRDtBQUM5Q0UsT0FEOEMsaUJBQ3hDO0FBQ0osdUJBQU9SLFNBQVAsQ0FBaUIsUUFBakIsb0NBQTRETSxNQUE1RDtBQUNBLGFBQU8sS0FBSzNCLEtBQUwsQ0FBVzJCLE1BQVgsQ0FBUDtBQUNEO0FBSjZDLEdBQWhEO0FBTUQsQ0EzQ0E7O0FBNkNEL0IsT0FBTzBCLFNBQVAsQ0FBaUJRLFNBQWpCLEdBQTZCLFlBQVk7QUFDdkMsbUJBQU9ULFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsMk5BQTNCO0FBQ0EsU0FBTyxJQUFQO0FBQ0QsQ0FIRDs7QUFLQTs7Ozs7O2tCQU1lekIsTSIsImZpbGUiOiJjaGFuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgQ2hhbmdlcyBmcm9tICcuLi9jaGFuZ2VzJ1xuaW1wb3J0IGFwcGx5IGZyb20gJy4uL29wZXJhdGlvbnMvYXBwbHknXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcidcbmltcG9ydCBwaWNrIGZyb20gJ2xvZGFzaC9waWNrJ1xuXG4vKipcbiAqIERlYnVnLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdzbGF0ZTpjaGFuZ2UnKVxuXG4vKipcbiAqIENoYW5nZS5cbiAqXG4gKiBAdHlwZSB7Q2hhbmdlfVxuICovXG5cbmNsYXNzIENoYW5nZSB7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgYHZhbHVlYCBpcyBhIGBDaGFuZ2VgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc3RhdGljIGlzQ2hhbmdlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlW01PREVMX1RZUEVTLkNIQU5HRV0pXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBDaGFuZ2VgIHdpdGggYGF0dHJzYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gICAqICAgQHByb3BlcnR5IHtTdGF0ZX0gc3RhdGVcbiAgICovXG5cbiAgY29uc3RydWN0b3IoYXR0cnMpIHtcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBhdHRyc1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZVxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdXG4gICAgdGhpcy5mbGFncyA9IHBpY2soYXR0cnMsIFsnbWVyZ2UnLCAnc2F2ZSddKVxuICAgIHRoaXMuc2V0SXNOYXRpdmUoYXR0cnMuaXNOYXRpdmUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXR0cnMuaXNOYXRpdmUpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBraW5kLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBraW5kKCkge1xuICAgIHJldHVybiAnY2hhbmdlJ1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGFuIGBvcGVyYXRpb25gIHRvIHRoZSBjdXJyZW50IHN0YXRlLCBzYXZpbmcgdGhlIG9wZXJhdGlvbiB0byB0aGVcbiAgICogaGlzdG9yeSBpZiBuZWVkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcGVyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybiB7Q2hhbmdlfVxuICAgKi9cblxuICBhcHBseU9wZXJhdGlvbihvcGVyYXRpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgb3BlcmF0aW9ucywgZmxhZ3MgfSA9IHRoaXNcbiAgICBsZXQgeyBzdGF0ZSB9ID0gdGhpc1xuICAgIGxldCB7IGhpc3RvcnkgfSA9IHN0YXRlXG5cbiAgICAvLyBEZWZhdWx0IG9wdGlvbnMgdG8gdGhlIGNoYW5nZS1sZXZlbCBmbGFncywgdGhpcyBhbGxvd3MgZm9yIHNldHRpbmdcbiAgICAvLyBzcGVjaWZpYyBvcHRpb25zIGZvciBhbGwgb2YgdGhlIG9wZXJhdGlvbnMgb2YgYSBnaXZlbiBjaGFuZ2UuXG4gICAgb3B0aW9ucyA9IHsgLi4uZmxhZ3MsIC4uLm9wdGlvbnMgfVxuXG4gICAgLy8gRGVyaXZlIHRoZSBkZWZhdWx0IG9wdGlvbiB2YWx1ZXMuXG4gICAgY29uc3Qge1xuICAgICAgbWVyZ2UgPSBvcGVyYXRpb25zLmxlbmd0aCA9PSAwID8gbnVsbCA6IHRydWUsXG4gICAgICBzYXZlID0gdHJ1ZSxcbiAgICAgIHNraXAgPSBudWxsLFxuICAgIH0gPSBvcHRpb25zXG5cbiAgICAvLyBBcHBseSB0aGUgb3BlcmF0aW9uIHRvIHRoZSBzdGF0ZS5cbiAgICBkZWJ1ZygnYXBwbHknLCB7IG9wZXJhdGlvbiwgc2F2ZSwgbWVyZ2UgfSlcbiAgICBzdGF0ZSA9IGFwcGx5KHN0YXRlLCBvcGVyYXRpb24pXG5cbiAgICAvLyBJZiBuZWVkZWQsIHNhdmUgdGhlIG9wZXJhdGlvbiB0byB0aGUgaGlzdG9yeS5cbiAgICBpZiAoaGlzdG9yeSAmJiBzYXZlKSB7XG4gICAgICBoaXN0b3J5ID0gaGlzdG9yeS5zYXZlKG9wZXJhdGlvbiwgeyBtZXJnZSwgc2tpcCB9KVxuICAgICAgc3RhdGUgPSBzdGF0ZS5zZXQoJ2hpc3RvcnknLCBoaXN0b3J5KVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgbXV0YWJsZSBjaGFuZ2Ugb2JqZWN0LlxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZVxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgc2VyaWVzIG9mIGBvcGVyYXRpb25zYCB0byB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gb3BlcmF0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHtDaGFuZ2V9XG4gICAqL1xuXG4gIGFwcGx5T3BlcmF0aW9ucyhvcGVyYXRpb25zLCBvcHRpb25zKSB7XG4gICAgb3BlcmF0aW9ucy5mb3JFYWNoKG9wID0+IHRoaXMuYXBwbHlPcGVyYXRpb24ob3AsIG9wdGlvbnMpKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIGNoYW5nZSBgZm5gIHdpdGggYXJndW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAcGFyYW0ge01peGVkfSAuLi5hcmdzXG4gICAqIEByZXR1cm4ge0NoYW5nZX1cbiAgICovXG5cbiAgY2FsbChmbiwgLi4uYXJncykge1xuICAgIGZuKHRoaXMsIC4uLmFyZ3MpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gb3BlcmF0aW9uIGZsYWcgYnkgYGtleWAgdG8gYHZhbHVlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAgICogQHJldHVybiB7Q2hhbmdlfVxuICAgKi9cblxuICBzZXRPcGVyYXRpb25GbGFnKGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLmZsYWdzW2tleV0gPSB2YWx1ZVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogVW5zZXQgYW4gb3BlcmF0aW9uIGZsYWcgYnkgYGtleWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7Q2hhbmdlfVxuICAgKi9cblxuICB1bnNldE9wZXJhdGlvbkZsYWcoa2V5KSB7XG4gICAgZGVsZXRlIHRoaXMuZmxhZ3Nba2V5XVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZC5cbiAgICpcbiAgICogQHJldHVybiB7U3RhdGV9XG4gICAqL1xuXG4gIGFwcGx5KG9wdGlvbnMgPSB7fSkge1xuICAgIGxvZ2dlci5kZXByZWNhdGUoJzAuMjIuMCcsICdUaGUgYGNoYW5nZS5hcHBseSgpYCBtZXRob2QgaXMgZGVwcmVjcmF0ZWQgYW5kIG5vIGxvbmdlciBuZWNlc3NhcnksIGFzIGFsbCBvcGVyYXRpb25zIGFyZSBhcHBsaWVkIGltbWVkaWF0ZWx5IHdoZW4gaW52b2tlZC4gWW91IGNhbiBhY2Nlc3MgdGhlIGNoYW5nZVxcJ3Mgc3RhdGUsIHdoaWNoIGlzIGFscmVhZHkgcHJlLWNvbXB1dGVkLCBkaXJlY3RseSB2aWEgYGNoYW5nZS5zdGF0ZWAgaW5zdGVhZC4nKVxuICAgIHJldHVybiB0aGlzLnN0YXRlXG4gIH1cblxufVxuXG4vKipcbiAqIEF0dGFjaCBhIHBzZXVkby1zeW1ib2wgZm9yIHR5cGUgY2hlY2tpbmcuXG4gKi9cblxuQ2hhbmdlLnByb3RvdHlwZVtNT0RFTF9UWVBFUy5DSEFOR0VdID0gdHJ1ZVxuXG4vKipcbiAqIEFkZCBhIGNoYW5nZSBtZXRob2QgZm9yIGVhY2ggb2YgdGhlIGNoYW5nZXMuXG4gKi9cblxuT2JqZWN0LmtleXMoQ2hhbmdlcykuZm9yRWFjaCgodHlwZSkgPT4ge1xuICBDaGFuZ2UucHJvdG90eXBlW3R5cGVdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBkZWJ1Zyh0eXBlLCB7IGFyZ3MgfSlcbiAgICB0aGlzLmNhbGwoQ2hhbmdlc1t0eXBlXSwgLi4uYXJncylcbiAgICByZXR1cm4gdGhpc1xuICB9XG59KVxuXG4vKipcbiAqIEFkZCBkZXByZWNhdGlvbiB3YXJuaW5ncyBpbiBjYXNlIHBlb3BsZSB0cnkgdG8gYWNjZXNzIGEgY2hhbmdlIGFzIGEgc3RhdGUuXG4gKi9cblxuO1tcbiAgJ2hhc1VuZG9zJyxcbiAgJ2hhc1JlZG9zJyxcbiAgJ2lzQmx1cnJlZCcsXG4gICdpc0ZvY3VzZWQnLFxuICAnaXNDb2xsYXBzZWQnLFxuICAnaXNFeHBhbmRlZCcsXG4gICdpc0JhY2t3YXJkJyxcbiAgJ2lzRm9yd2FyZCcsXG4gICdzdGFydEtleScsXG4gICdlbmRLZXknLFxuICAnc3RhcnRPZmZzZXQnLFxuICAnZW5kT2Zmc2V0JyxcbiAgJ2FuY2hvcktleScsXG4gICdmb2N1c0tleScsXG4gICdhbmNob3JPZmZzZXQnLFxuICAnZm9jdXNPZmZzZXQnLFxuICAnc3RhcnRCbG9jaycsXG4gICdlbmRCbG9jaycsXG4gICdhbmNob3JCbG9jaycsXG4gICdmb2N1c0Jsb2NrJyxcbiAgJ3N0YXJ0SW5saW5lJyxcbiAgJ2VuZElubGluZScsXG4gICdhbmNob3JJbmxpbmUnLFxuICAnZm9jdXNJbmxpbmUnLFxuICAnc3RhcnRUZXh0JyxcbiAgJ2VuZFRleHQnLFxuICAnYW5jaG9yVGV4dCcsXG4gICdmb2N1c1RleHQnLFxuICAnY2hhcmFjdGVycycsXG4gICdtYXJrcycsXG4gICdibG9ja3MnLFxuICAnZnJhZ21lbnQnLFxuICAnaW5saW5lcycsXG4gICd0ZXh0cycsXG4gICdpc0VtcHR5Jyxcbl0uZm9yRWFjaCgoZ2V0dGVyKSA9PiB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaGFuZ2UucHJvdG90eXBlLCBnZXR0ZXIsIHtcbiAgICBnZXQoKSB7XG4gICAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjIyLjAnLCBgWW91IGF0dGVtcHRlZCB0byBhY2Nlc3MgdGhlIFxcYCR7Z2V0dGVyfVxcYCBwcm9wZXJ0eSBvZiB3aGF0IHdhcyBwcmV2aW91c2x5IGEgXFxgc3RhdGVcXGAgb2JqZWN0IGJ1dCBpcyBub3cgYSBcXGBjaGFuZ2VcXGAgb2JqZWN0LiBUaGlzIHN5bnRheCBoYXMgYmVlbiBkZXByZWNhdGVkIGFzIHBsdWdpbnMgYXJlIG5vdyBwYXNzZWQgXFxgY2hhbmdlXFxgIG9iamVjdHMgaW5zdGVhZCBvZiBcXGBzdGF0ZVxcYCBvYmplY3RzLmApXG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZVtnZXR0ZXJdXG4gICAgfVxuICB9KVxufSlcblxuQ2hhbmdlLnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAoKSB7XG4gIGxvZ2dlci5kZXByZWNhdGUoJzAuMjIuMCcsICdZb3UgYXR0ZW1wdGVkIHRvIGNhbGwgYC50cmFuc2Zvcm0oKWAgb24gd2hhdCB3YXMgcHJldmlvdXNseSBhIGBzdGF0ZWAgb2JqZWN0IGJ1dCBpcyBub3cgYWxyZWFkeSBhIGBjaGFuZ2VgIG9iamVjdC4gVGhpcyBzeW50YXggaGFzIGJlZW4gZGVwcmVjYXRlZCBhcyBwbHVnaW5zIGFyZSBub3cgcGFzc2VkIGBjaGFuZ2VgIG9iamVjdHMgaW5zdGVhZCBvZiBgc3RhdGVgIG9iamVjdHMuJylcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0NoYW5nZX1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VcbiJdfQ==