'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__enable = exports.__clear = exports.default = undefined;

var _es6Map = require('es6-map');

var _es6Map2 = _interopRequireDefault(_es6Map);

var _isDev = require('../constants/is-dev');

var _isDev2 = _interopRequireDefault(_isDev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GLOBAL: True if memoization should is enabled. Only effective when `IS_DEV`.
 *
 * @type {Boolean}
 */

var ENABLED = true;

/**
 * GLOBAL: Changing this cache key will clear all previous cached results.
 * Only effective when `IS_DEV`.
 *
 * @type {Number}
 */

var CACHE_KEY = 0;

/**
 * The leaf node of a cache tree. Used to support variable argument length. A
 * unique object, so that native Maps will key it by reference.
 *
 * @type {Object}
 */

var LEAF = {};

/**
 * A value to represent a memoized undefined value. Allows efficient value
 * retrieval using Map.get only.
 *
 * @type {Object}
 */

var UNDEFINED = {};

/**
 * Default value for unset keys in native Maps
 *
 * @type {Undefined}
 */

var UNSET = undefined;

/**
 * Memoize all of the `properties` on a `object`.
 *
 * @param {Object} object
 * @param {Array} properties
 * @return {Record}
 */

function memoize(object, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$takesArgumen = options.takesArguments,
      takesArguments = _options$takesArgumen === undefined ? true : _options$takesArgumen;

  var _loop = function _loop(i) {
    var property = properties[i];
    var original = object[property];

    if (!original) {
      throw new Error('Object does not have a property named "' + property + '".');
    }

    object[property] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (_isDev2.default) {
        // If memoization is disabled, call into the original method.
        if (!ENABLED) return original.apply(this, args);

        // If the cache key is different, previous caches must be cleared.
        if (CACHE_KEY !== this.__cache_key) {
          this.__cache_key = CACHE_KEY;
          this.__cache = new _es6Map2.default();
        }
      }

      if (!this.__cache) {
        this.__cache = new _es6Map2.default();
      }

      var cachedValue = void 0;
      var keys = void 0;

      if (takesArguments) {
        keys = [property].concat(args);
        cachedValue = getIn(this.__cache, keys);
      } else {
        cachedValue = this.__cache.get(property);
      }

      // If we've got a result already, return it.
      if (cachedValue !== UNSET) {
        return cachedValue === UNDEFINED ? undefined : cachedValue;
      }

      // Otherwise calculate what it should be once and cache it.
      var value = original.apply(this, args);
      var v = value === undefined ? UNDEFINED : value;

      if (takesArguments) {
        this.__cache = setIn(this.__cache, keys, v);
      } else {
        this.__cache.set(property, v);
      }

      return value;
    };
  };

  for (var i = 0; i < properties.length; i++) {
    _loop(i);
  }
}

/**
 * Get a value at a key path in a tree of Map.
 *
 * If not set, returns UNSET.
 * If the set value is undefined, returns UNDEFINED.
 *
 * @param {Map} map
 * @param {Array} keys
 * @return {Any|UNSET|UNDEFINED}
 */

function getIn(map, keys) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    map = map.get(key);
    if (map === UNSET) return UNSET;
  }

  return map.get(LEAF);
}

/**
 * Set a value at a key path in a tree of Map, creating Maps on the go.
 *
 * @param {Map} map
 * @param {Array} keys
 * @param {Any} value
 * @return {Map}
 */

function setIn(map, keys, value) {
  var parent = map;
  var child = void 0;

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    child = parent.get(key);

    // If the path was not created yet...
    if (child === UNSET) {
      child = new _es6Map2.default();
      parent.set(key, child);
    }

    parent = child;
  }

  // The whole path has been created, so set the value to the bottom most map.
  child.set(LEAF, value);
  return map;
}

/**
 * In DEV mode, clears the previously memoized values, globally.
 *
 * @return {Void}
 */

function __clear() {
  CACHE_KEY++;

  if (CACHE_KEY >= Number.MAX_SAFE_INTEGER) {
    CACHE_KEY = 0;
  }
}

/**
 * In DEV mode, enable or disable the use of memoize values, globally.
 *
 * @param {Boolean} enabled
 * @return {Void}
 */

function __enable(enabled) {
  ENABLED = enabled;
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = memoize;
exports.__clear = __clear;
exports.__enable = __enable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9tZW1vaXplLmpzIl0sIm5hbWVzIjpbIkVOQUJMRUQiLCJDQUNIRV9LRVkiLCJMRUFGIiwiVU5ERUZJTkVEIiwiVU5TRVQiLCJ1bmRlZmluZWQiLCJtZW1vaXplIiwib2JqZWN0IiwicHJvcGVydGllcyIsIm9wdGlvbnMiLCJ0YWtlc0FyZ3VtZW50cyIsImkiLCJwcm9wZXJ0eSIsIm9yaWdpbmFsIiwiRXJyb3IiLCJhcmdzIiwiYXBwbHkiLCJfX2NhY2hlX2tleSIsIl9fY2FjaGUiLCJjYWNoZWRWYWx1ZSIsImtleXMiLCJnZXRJbiIsImdldCIsInZhbHVlIiwidiIsInNldEluIiwic2V0IiwibGVuZ3RoIiwibWFwIiwia2V5IiwicGFyZW50IiwiY2hpbGQiLCJfX2NsZWFyIiwiTnVtYmVyIiwiTUFYX1NBRkVfSU5URUdFUiIsIl9fZW5hYmxlIiwiZW5hYmxlZCIsImRlZmF1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBSUEsVUFBVSxJQUFkOztBQUVBOzs7Ozs7O0FBT0EsSUFBSUMsWUFBWSxDQUFoQjs7QUFFQTs7Ozs7OztBQU9BLElBQU1DLE9BQU8sRUFBYjs7QUFFQTs7Ozs7OztBQU9BLElBQU1DLFlBQVksRUFBbEI7O0FBRUE7Ozs7OztBQU1BLElBQU1DLFFBQVFDLFNBQWQ7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0MsT0FBVCxDQUFpQkMsTUFBakIsRUFBeUJDLFVBQXpCLEVBQW1EO0FBQUEsTUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUEsOEJBQ2ZBLE9BRGUsQ0FDekNDLGNBRHlDO0FBQUEsTUFDekNBLGNBRHlDLHlDQUN4QixJQUR3Qjs7QUFBQSw2QkFHeENDLENBSHdDO0FBSS9DLFFBQU1DLFdBQVdKLFdBQVdHLENBQVgsQ0FBakI7QUFDQSxRQUFNRSxXQUFXTixPQUFPSyxRQUFQLENBQWpCOztBQUVBLFFBQUksQ0FBQ0MsUUFBTCxFQUFlO0FBQ2IsWUFB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QVV4QixJQUFWLEVBQWdCcUIsS0FBaEI7QUFDQSxTQUFPSyxHQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFNBQVNJLE9BQVQsR0FBbUI7QUFDakIvQjs7QUFFQSxNQUFJQSxhQUFhZ0MsT0FBT0MsZ0JBQXhCLEVBQTBDO0FBQ3hDakMsZ0JBQVksQ0FBWjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTa0MsUUFBVCxDQUFrQkMsT0FBbEIsRUFBMkI7QUFDekJwQyxZQUFVb0MsT0FBVjtBQUNEOztBQUVEOzs7Ozs7UUFPYUMsTyxHQUFYL0IsTztRQUNBMEIsTyxHQUFBQSxPO1FBQ0FHLFEsR0FBQUEsUSIsImZpbGUiOiJtZW1vaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgTWFwIGZyb20gJ2VzNi1tYXAnXG5pbXBvcnQgSVNfREVWIGZyb20gJy4uL2NvbnN0YW50cy9pcy1kZXYnXG5cbi8qKlxuICogR0xPQkFMOiBUcnVlIGlmIG1lbW9pemF0aW9uIHNob3VsZCBpcyBlbmFibGVkLiBPbmx5IGVmZmVjdGl2ZSB3aGVuIGBJU19ERVZgLlxuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmxldCBFTkFCTEVEID0gdHJ1ZVxuXG4vKipcbiAqIEdMT0JBTDogQ2hhbmdpbmcgdGhpcyBjYWNoZSBrZXkgd2lsbCBjbGVhciBhbGwgcHJldmlvdXMgY2FjaGVkIHJlc3VsdHMuXG4gKiBPbmx5IGVmZmVjdGl2ZSB3aGVuIGBJU19ERVZgLlxuICpcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cblxubGV0IENBQ0hFX0tFWSA9IDBcblxuLyoqXG4gKiBUaGUgbGVhZiBub2RlIG9mIGEgY2FjaGUgdHJlZS4gVXNlZCB0byBzdXBwb3J0IHZhcmlhYmxlIGFyZ3VtZW50IGxlbmd0aC4gQVxuICogdW5pcXVlIG9iamVjdCwgc28gdGhhdCBuYXRpdmUgTWFwcyB3aWxsIGtleSBpdCBieSByZWZlcmVuY2UuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5jb25zdCBMRUFGID0ge31cblxuLyoqXG4gKiBBIHZhbHVlIHRvIHJlcHJlc2VudCBhIG1lbW9pemVkIHVuZGVmaW5lZCB2YWx1ZS4gQWxsb3dzIGVmZmljaWVudCB2YWx1ZVxuICogcmV0cmlldmFsIHVzaW5nIE1hcC5nZXQgb25seS5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IFVOREVGSU5FRCA9IHt9XG5cbi8qKlxuICogRGVmYXVsdCB2YWx1ZSBmb3IgdW5zZXQga2V5cyBpbiBuYXRpdmUgTWFwc1xuICpcbiAqIEB0eXBlIHtVbmRlZmluZWR9XG4gKi9cblxuY29uc3QgVU5TRVQgPSB1bmRlZmluZWRcblxuLyoqXG4gKiBNZW1vaXplIGFsbCBvZiB0aGUgYHByb3BlcnRpZXNgIG9uIGEgYG9iamVjdGAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICogQHBhcmFtIHtBcnJheX0gcHJvcGVydGllc1xuICogQHJldHVybiB7UmVjb3JkfVxuICovXG5cbmZ1bmN0aW9uIG1lbW9pemUob2JqZWN0LCBwcm9wZXJ0aWVzLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgeyB0YWtlc0FyZ3VtZW50cyA9IHRydWUgfSA9IG9wdGlvbnNcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnRpZXNbaV1cbiAgICBjb25zdCBvcmlnaW5hbCA9IG9iamVjdFtwcm9wZXJ0eV1cblxuICAgIGlmICghb3JpZ2luYWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgT2JqZWN0IGRvZXMgbm90IGhhdmUgYSBwcm9wZXJ0eSBuYW1lZCBcIiR7cHJvcGVydHl9XCIuYClcbiAgICB9XG5cbiAgICBvYmplY3RbcHJvcGVydHldID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgIGlmIChJU19ERVYpIHtcbiAgICAgICAgLy8gSWYgbWVtb2l6YXRpb24gaXMgZGlzYWJsZWQsIGNhbGwgaW50byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICBpZiAoIUVOQUJMRUQpIHJldHVybiBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKVxuXG4gICAgICAgIC8vIElmIHRoZSBjYWNoZSBrZXkgaXMgZGlmZmVyZW50LCBwcmV2aW91cyBjYWNoZXMgbXVzdCBiZSBjbGVhcmVkLlxuICAgICAgICBpZiAoQ0FDSEVfS0VZICE9PSB0aGlzLl9fY2FjaGVfa2V5KSB7XG4gICAgICAgICAgdGhpcy5fX2NhY2hlX2tleSA9IENBQ0hFX0tFWVxuICAgICAgICAgIHRoaXMuX19jYWNoZSA9IG5ldyBNYXAoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fX2NhY2hlKSB7XG4gICAgICAgIHRoaXMuX19jYWNoZSA9IG5ldyBNYXAoKVxuICAgICAgfVxuXG4gICAgICBsZXQgY2FjaGVkVmFsdWVcbiAgICAgIGxldCBrZXlzXG5cbiAgICAgIGlmICh0YWtlc0FyZ3VtZW50cykge1xuICAgICAgICBrZXlzID0gW3Byb3BlcnR5LCAuLi5hcmdzXVxuICAgICAgICBjYWNoZWRWYWx1ZSA9IGdldEluKHRoaXMuX19jYWNoZSwga2V5cylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhY2hlZFZhbHVlID0gdGhpcy5fX2NhY2hlLmdldChwcm9wZXJ0eSlcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UndmUgZ290IGEgcmVzdWx0IGFscmVhZHksIHJldHVybiBpdC5cbiAgICAgIGlmIChjYWNoZWRWYWx1ZSAhPT0gVU5TRVQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlZFZhbHVlID09PSBVTkRFRklORUQgPyB1bmRlZmluZWQgOiBjYWNoZWRWYWx1ZVxuICAgICAgfVxuXG4gICAgICAvLyBPdGhlcndpc2UgY2FsY3VsYXRlIHdoYXQgaXQgc2hvdWxkIGJlIG9uY2UgYW5kIGNhY2hlIGl0LlxuICAgICAgY29uc3QgdmFsdWUgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKVxuICAgICAgY29uc3QgdiA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBVTkRFRklORUQgOiB2YWx1ZVxuXG4gICAgICBpZiAodGFrZXNBcmd1bWVudHMpIHtcbiAgICAgICAgdGhpcy5fX2NhY2hlID0gc2V0SW4odGhpcy5fX2NhY2hlLCBrZXlzLCB2KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX2NhY2hlLnNldChwcm9wZXJ0eSwgdilcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2V0IGEgdmFsdWUgYXQgYSBrZXkgcGF0aCBpbiBhIHRyZWUgb2YgTWFwLlxuICpcbiAqIElmIG5vdCBzZXQsIHJldHVybnMgVU5TRVQuXG4gKiBJZiB0aGUgc2V0IHZhbHVlIGlzIHVuZGVmaW5lZCwgcmV0dXJucyBVTkRFRklORUQuXG4gKlxuICogQHBhcmFtIHtNYXB9IG1hcFxuICogQHBhcmFtIHtBcnJheX0ga2V5c1xuICogQHJldHVybiB7QW55fFVOU0VUfFVOREVGSU5FRH1cbiAqL1xuXG5mdW5jdGlvbiBnZXRJbihtYXAsIGtleXMpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgIG1hcCA9IG1hcC5nZXQoa2V5KVxuICAgIGlmIChtYXAgPT09IFVOU0VUKSByZXR1cm4gVU5TRVRcbiAgfVxuXG4gIHJldHVybiBtYXAuZ2V0KExFQUYpXG59XG5cbi8qKlxuICogU2V0IGEgdmFsdWUgYXQgYSBrZXkgcGF0aCBpbiBhIHRyZWUgb2YgTWFwLCBjcmVhdGluZyBNYXBzIG9uIHRoZSBnby5cbiAqXG4gKiBAcGFyYW0ge01hcH0gbWFwXG4gKiBAcGFyYW0ge0FycmF5fSBrZXlzXG4gKiBAcGFyYW0ge0FueX0gdmFsdWVcbiAqIEByZXR1cm4ge01hcH1cbiAqL1xuXG5mdW5jdGlvbiBzZXRJbihtYXAsIGtleXMsIHZhbHVlKSB7XG4gIGxldCBwYXJlbnQgPSBtYXBcbiAgbGV0IGNoaWxkXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgIGNoaWxkID0gcGFyZW50LmdldChrZXkpXG5cbiAgICAvLyBJZiB0aGUgcGF0aCB3YXMgbm90IGNyZWF0ZWQgeWV0Li4uXG4gICAgaWYgKGNoaWxkID09PSBVTlNFVCkge1xuICAgICAgY2hpbGQgPSBuZXcgTWFwKClcbiAgICAgIHBhcmVudC5zZXQoa2V5LCBjaGlsZClcbiAgICB9XG5cbiAgICBwYXJlbnQgPSBjaGlsZFxuICB9XG5cbiAgLy8gVGhlIHdob2xlIHBhdGggaGFzIGJlZW4gY3JlYXRlZCwgc28gc2V0IHRoZSB2YWx1ZSB0byB0aGUgYm90dG9tIG1vc3QgbWFwLlxuICBjaGlsZC5zZXQoTEVBRiwgdmFsdWUpXG4gIHJldHVybiBtYXBcbn1cblxuLyoqXG4gKiBJbiBERVYgbW9kZSwgY2xlYXJzIHRoZSBwcmV2aW91c2x5IG1lbW9pemVkIHZhbHVlcywgZ2xvYmFsbHkuXG4gKlxuICogQHJldHVybiB7Vm9pZH1cbiAqL1xuXG5mdW5jdGlvbiBfX2NsZWFyKCkge1xuICBDQUNIRV9LRVkrK1xuXG4gIGlmIChDQUNIRV9LRVkgPj0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICBDQUNIRV9LRVkgPSAwXG4gIH1cbn1cblxuLyoqXG4gKiBJbiBERVYgbW9kZSwgZW5hYmxlIG9yIGRpc2FibGUgdGhlIHVzZSBvZiBtZW1vaXplIHZhbHVlcywgZ2xvYmFsbHkuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkXG4gKiBAcmV0dXJuIHtWb2lkfVxuICovXG5cbmZ1bmN0aW9uIF9fZW5hYmxlKGVuYWJsZWQpIHtcbiAgRU5BQkxFRCA9IGVuYWJsZWRcbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5leHBvcnQge1xuICBtZW1vaXplIGFzIGRlZmF1bHQsXG4gIF9fY2xlYXIsXG4gIF9fZW5hYmxlXG59XG4iXX0=