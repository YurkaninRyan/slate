'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:history');

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  redos: new _immutable.Stack(),
  undos: new _immutable.Stack()

  /**
   * History.
   *
   * @type {History}
   */

};
var History = function (_Record) {
  _inherits(History, _Record);

  function History() {
    _classCallCheck(this, History);

    return _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).apply(this, arguments));
  }

  _createClass(History, [{
    key: 'save',


    /**
     * Save an `operation` into the history.
     *
     * @param {Object} operation
     * @param {Object} options
     * @return {History}
     */

    value: function save(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var history = this;
      var _history = history,
          undos = _history.undos,
          redos = _history.redos;
      var merge = options.merge,
          skip = options.skip;

      var prevBatch = undos.peek();
      var prevOperation = prevBatch && prevBatch[prevBatch.length - 1];

      if (skip == null) {
        skip = shouldSkip(operation, prevOperation);
      }

      if (skip) {
        return history;
      }

      if (merge == null) {
        merge = shouldMerge(operation, prevOperation);
      }

      debug('save', { operation: operation, merge: merge });

      // If the `merge` flag is true, add the operation to the previous batch.
      if (merge) {
        var batch = prevBatch.slice();
        batch.push(operation);
        undos = undos.pop();
        undos = undos.push(batch);
      }

      // Otherwise, create a new batch with the operation.
      else {
          var _batch = [operation];
          undos = undos.push(_batch);
        }

      // Constrain the history to 100 entries for memory's sake.
      if (undos.length > 100) {
        undos = undos.take(100);
      }

      // Clear the redos and update the history.
      redos = redos.clear();
      history = history.set('undos', undos).set('redos', redos);
      return history;
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'history';
    }
  }], [{
    key: 'create',


    /**
     * Create a new `History` with `attrs`.
     *
     * @param {Object|History} attrs
     * @return {History}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (History.isHistory(attrs)) {
        return attrs;
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var history = new History({
          undos: attrs.undos || new _immutable.Stack(),
          redos: attrs.redos || new _immutable.Stack()
        });

        return history;
      }

      throw new Error('`History.create` only accepts objects or histories, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `History`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isHistory',
    value: function isHistory(value) {
      return !!(value && value[_modelTypes2.default.HISTORY]);
    }
  }]);

  return History;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

History.prototype[_modelTypes2.default.HISTORY] = true;

/**
 * Check whether to merge a new operation `o` into the previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldMerge(o, p) {
  if (!p) return false;

  var merge = o.type == 'set_selection' && p.type == 'set_selection' || o.type == 'insert_text' && p.type == 'insert_text' && o.offset == p.offset + p.text.length && (0, _isEqual2.default)(o.path, p.path) || o.type == 'remove_text' && p.type == 'remove_text' && o.offset + o.text.length == p.offset && (0, _isEqual2.default)(o.path, p.path);

  return merge;
}

/**
 * Check whether to skip a new operation `o`, given previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldSkip(o, p) {
  if (!p) return false;

  var skip = o.type == 'set_selection' && p.type == 'set_selection';

  return skip;
}

/**
 * Export.
 *
 * @type {History}
 */

exports.default = History;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvaGlzdG9yeS5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIkRFRkFVTFRTIiwicmVkb3MiLCJ1bmRvcyIsIkhpc3RvcnkiLCJvcGVyYXRpb24iLCJvcHRpb25zIiwiaGlzdG9yeSIsIm1lcmdlIiwic2tpcCIsInByZXZCYXRjaCIsInBlZWsiLCJwcmV2T3BlcmF0aW9uIiwibGVuZ3RoIiwic2hvdWxkU2tpcCIsInNob3VsZE1lcmdlIiwiYmF0Y2giLCJzbGljZSIsInB1c2giLCJwb3AiLCJ0YWtlIiwiY2xlYXIiLCJzZXQiLCJhdHRycyIsImlzSGlzdG9yeSIsIkVycm9yIiwidmFsdWUiLCJISVNUT1JZIiwicHJvdG90eXBlIiwibyIsInAiLCJ0eXBlIiwib2Zmc2V0IiwidGV4dCIsInBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7QUFNQSxJQUFNQSxRQUFRLHFCQUFNLGVBQU4sQ0FBZDs7QUFFQTs7Ozs7O0FBTUEsSUFBTUMsV0FBVztBQUNmQyxTQUFPLHNCQURRO0FBRWZDLFNBQU87O0FBR1Q7Ozs7OztBQUxpQixDQUFqQjtJQVdNQyxPOzs7Ozs7Ozs7Ozs7O0FBK0NKOzs7Ozs7Ozt5QkFRS0MsUyxFQUF5QjtBQUFBLFVBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFDNUIsVUFBSUMsVUFBVSxJQUFkO0FBRDRCLHFCQUVMQSxPQUZLO0FBQUEsVUFFdEJKLEtBRnNCLFlBRXRCQSxLQUZzQjtBQUFBLFVBRWZELEtBRmUsWUFFZkEsS0FGZTtBQUFBLFVBR3RCTSxLQUhzQixHQUdORixPQUhNLENBR3RCRSxLQUhzQjtBQUFBLFVBR2ZDLElBSGUsR0FHTkgsT0FITSxDQUdmRyxJQUhlOztBQUk1QixVQUFNQyxZQUFZUCxNQUFNUSxJQUFOLEVBQWxCO0FBQ0EsVUFBTUMsZ0JBQWdCRixhQUFhQSxVQUFVQSxVQUFVRyxNQUFWLEdBQW1CLENB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RUksSUFBbEIsQ0FiSjs7QUFpQkEsU0FBTzFCLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFRQSxTQUFTTSxVQUFULENBQW9CZSxDQUFwQixFQUF1QkMsQ0FBdkIsRUFBMEI7QUFDeEIsTUFBSSxDQUFDQSxDQUFMLEVBQVEsT0FBTyxLQUFQOztBQUVSLE1BQU1yQixPQUNKb0IsRUFBRUUsSUFBRixJQUFVLGVBQVYsSUFDQUQsRUFBRUMsSUFBRixJQUFVLGVBRlo7O0FBS0EsU0FBT3RCLElBQVA7QUFDRDs7QUFFRDs7Ozs7O2tCQU1lTCxPIiwiZmlsZSI6Imhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9jb25zdGFudHMvbW9kZWwtdHlwZXMnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgaXNFcXVhbCBmcm9tICdsb2Rhc2gvaXNFcXVhbCdcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2lzLXBsYWluLW9iamVjdCdcbmltcG9ydCB7IFJlY29yZCwgU3RhY2sgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogRGVidWcuXG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ3NsYXRlOmhpc3RvcnknKVxuXG4vKipcbiAqIERlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICByZWRvczogbmV3IFN0YWNrKCksXG4gIHVuZG9zOiBuZXcgU3RhY2soKSxcbn1cblxuLyoqXG4gKiBIaXN0b3J5LlxuICpcbiAqIEB0eXBlIHtIaXN0b3J5fVxuICovXG5cbmNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSZWNvcmQoREVGQVVMVFMpIHtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBIaXN0b3J5YCB3aXRoIGBhdHRyc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fEhpc3Rvcnl9IGF0dHJzXG4gICAqIEByZXR1cm4ge0hpc3Rvcnl9XG4gICAqL1xuXG4gIHN0YXRpYyBjcmVhdGUoYXR0cnMgPSB7fSkge1xuICAgIGlmIChIaXN0b3J5LmlzSGlzdG9yeShhdHRycykpIHtcbiAgICAgIHJldHVybiBhdHRyc1xuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3QgaGlzdG9yeSA9IG5ldyBIaXN0b3J5KHtcbiAgICAgICAgdW5kb3M6IGF0dHJzLnVuZG9zIHx8IG5ldyBTdGFjaygpLFxuICAgICAgICByZWRvczogYXR0cnMucmVkb3MgfHwgbmV3IFN0YWNrKCksXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaGlzdG9yeVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgXFxgSGlzdG9yeS5jcmVhdGVcXGAgb25seSBhY2NlcHRzIG9iamVjdHMgb3IgaGlzdG9yaWVzLCBidXQgeW91IHBhc3NlZCBpdDogJHthdHRyc31gKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgYHZhbHVlYCBpcyBhIGBIaXN0b3J5YC5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHN0YXRpYyBpc0hpc3RvcnkodmFsdWUpIHtcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbTU9ERUxfVFlQRVMuSElTVE9SWV0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBraW5kLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuXG4gIGdldCBraW5kKCkge1xuICAgIHJldHVybiAnaGlzdG9yeSdcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGFuIGBvcGVyYXRpb25gIGludG8gdGhlIGhpc3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcGVyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybiB7SGlzdG9yeX1cbiAgICovXG5cbiAgc2F2ZShvcGVyYXRpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBoaXN0b3J5ID0gdGhpc1xuICAgIGxldCB7IHVuZG9zLCByZWRvcyB9ID0gaGlzdG9yeVxuICAgIGxldCB7IG1lcmdlLCBza2lwIH0gPSBvcHRpb25zXG4gICAgY29uc3QgcHJldkJhdGNoID0gdW5kb3MucGVlaygpXG4gICAgY29uc3QgcHJldk9wZXJhdGlvbiA9IHByZXZCYXRjaCAmJiBwcmV2QmF0Y2hbcHJldkJhdGNoLmxlbmd0aCAtIDFdXG5cbiAgICBpZiAoc2tpcCA9PSBudWxsKSB7XG4gICAgICBza2lwID0gc2hvdWxkU2tpcChvcGVyYXRpb24sIHByZXZPcGVyYXRpb24pXG4gICAgfVxuXG4gICAgaWYgKHNraXApIHtcbiAgICAgIHJldHVybiBoaXN0b3J5XG4gICAgfVxuXG4gICAgaWYgKG1lcmdlID09IG51bGwpIHtcbiAgICAgIG1lcmdlID0gc2hvdWxkTWVyZ2Uob3BlcmF0aW9uLCBwcmV2T3BlcmF0aW9uKVxuICAgIH1cblxuICAgIGRlYnVnKCdzYXZlJywgeyBvcGVyYXRpb24sIG1lcmdlIH0pXG5cbiAgICAvLyBJZiB0aGUgYG1lcmdlYCBmbGFnIGlzIHRydWUsIGFkZCB0aGUgb3BlcmF0aW9uIHRvIHRoZSBwcmV2aW91cyBiYXRjaC5cbiAgICBpZiAobWVyZ2UpIHtcbiAgICAgIGNvbnN0IGJhdGNoID0gcHJldkJhdGNoLnNsaWNlKClcbiAgICAgIGJhdGNoLnB1c2gob3BlcmF0aW9uKVxuICAgICAgdW5kb3MgPSB1bmRvcy5wb3AoKVxuICAgICAgdW5kb3MgPSB1bmRvcy5wdXNoKGJhdGNoKVxuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IGJhdGNoIHdpdGggdGhlIG9wZXJhdGlvbi5cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IGJhdGNoID0gW29wZXJhdGlvbl1cbiAgICAgIHVuZG9zID0gdW5kb3MucHVzaChiYXRjaClcbiAgICB9XG5cbiAgICAvLyBDb25zdHJhaW4gdGhlIGhpc3RvcnkgdG8gMTAwIGVudHJpZXMgZm9yIG1lbW9yeSdzIHNha2UuXG4gICAgaWYgKHVuZG9zLmxlbmd0aCA+IDEwMCkge1xuICAgICAgdW5kb3MgPSB1bmRvcy50YWtlKDEwMClcbiAgICB9XG5cbiAgICAvLyBDbGVhciB0aGUgcmVkb3MgYW5kIHVwZGF0ZSB0aGUgaGlzdG9yeS5cbiAgICByZWRvcyA9IHJlZG9zLmNsZWFyKClcbiAgICBoaXN0b3J5ID0gaGlzdG9yeS5zZXQoJ3VuZG9zJywgdW5kb3MpLnNldCgncmVkb3MnLCByZWRvcylcbiAgICByZXR1cm4gaGlzdG9yeVxuICB9XG5cbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBwc2V1ZG8tc3ltYm9sIGZvciB0eXBlIGNoZWNraW5nLlxuICovXG5cbkhpc3RvcnkucHJvdG90eXBlW01PREVMX1RZUEVTLkhJU1RPUlldID0gdHJ1ZVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdG8gbWVyZ2UgYSBuZXcgb3BlcmF0aW9uIGBvYCBpbnRvIHRoZSBwcmV2aW91cyBvcGVyYXRpb24gYHBgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvXG4gKiBAcGFyYW0ge09iamVjdH0gcFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBzaG91bGRNZXJnZShvLCBwKSB7XG4gIGlmICghcCkgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3QgbWVyZ2UgPSAoXG4gICAgKFxuICAgICAgby50eXBlID09ICdzZXRfc2VsZWN0aW9uJyAmJlxuICAgICAgcC50eXBlID09ICdzZXRfc2VsZWN0aW9uJ1xuICAgICkgfHwgKFxuICAgICAgby50eXBlID09ICdpbnNlcnRfdGV4dCcgJiZcbiAgICAgIHAudHlwZSA9PSAnaW5zZXJ0X3RleHQnICYmXG4gICAgICBvLm9mZnNldCA9PSBwLm9mZnNldCArIHAudGV4dC5sZW5ndGggJiZcbiAgICAgIGlzRXF1YWwoby5wYXRoLCBwLnBhdGgpXG4gICAgKSB8fCAoXG4gICAgICBvLnR5cGUgPT0gJ3JlbW92ZV90ZXh0JyAmJlxuICAgICAgcC50eXBlID09ICdyZW1vdmVfdGV4dCcgJiZcbiAgICAgIG8ub2Zmc2V0ICsgby50ZXh0Lmxlbmd0aCA9PSBwLm9mZnNldCAmJlxuICAgICAgaXNFcXVhbChvLnBhdGgsIHAucGF0aClcbiAgICApXG4gIClcblxuICByZXR1cm4gbWVyZ2Vcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRvIHNraXAgYSBuZXcgb3BlcmF0aW9uIGBvYCwgZ2l2ZW4gcHJldmlvdXMgb3BlcmF0aW9uIGBwYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb1xuICogQHBhcmFtIHtPYmplY3R9IHBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gc2hvdWxkU2tpcChvLCBwKSB7XG4gIGlmICghcCkgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3Qgc2tpcCA9IChcbiAgICBvLnR5cGUgPT0gJ3NldF9zZWxlY3Rpb24nICYmXG4gICAgcC50eXBlID09ICdzZXRfc2VsZWN0aW9uJ1xuICApXG5cbiAgcmV0dXJuIHNraXBcbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0hpc3Rvcnl9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeVxuIl19