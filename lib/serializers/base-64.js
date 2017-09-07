'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raw = require('./raw');

var _raw2 = _interopRequireDefault(_raw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Encode a JSON `object` as base-64 `string`.
 *
 * @param {Object} object
 * @return {String}
 */

function encode(object) {
  var string = JSON.stringify(object);
  var encoded = window.btoa(window.encodeURIComponent(string));
  return encoded;
}

/**
 * Decode a base-64 `string` to a JSON `object`.
 *
 * @param {String} string
 * @return {Object}
 */

function decode(string) {
  var decoded = window.decodeURIComponent(window.atob(string));
  var object = JSON.parse(decoded);
  return object;
}

/**
 * Deserialize a State `string`.
 *
 * @param {String} string
 * @return {State}
 */

function deserialize(string, options) {
  var raw = decode(string);
  var state = _raw2.default.deserialize(raw, options);
  return state;
}

/**
 * Deserialize a Node `string`.
 *
 * @param {String} string
 * @return {Node}
 */

function deserializeNode(string, options) {
  var raw = decode(string);
  var node = _raw2.default.deserializeNode(raw, options);
  return node;
}

/**
 * Serialize a `state`.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state, options) {
  var raw = _raw2.default.serialize(state, options);
  var encoded = encode(raw);
  return encoded;
}

/**
 * Serialize a `node`.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node, options) {
  var raw = _raw2.default.serializeNode(node, options);
  var encoded = encode(raw);
  return encoded;
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  deserialize: deserialize,
  deserializeNode: deserializeNode,
  serialize: serialize,
  serializeNode: serializeNode
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJpYWxpemVycy9iYXNlLTY0LmpzIl0sIm5hbWVzIjpbImVuY29kZSIsIm9iamVjdCIsInN0cmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNvZGVkIiwid2luZG93IiwiYnRvYSIsImVuY29kZVVSSUNvbXBvbmVudCIsImRlY29kZSIsImRlY29kZWQiLCJkZWNvZGVVUklDb21wb25lbnQiLCJhdG9iIiwicGFyc2UiLCJkZXNlcmlhbGl6ZSIsIm9wdGlvbnMiLCJyYXciLCJzdGF0ZSIsImRlc2VyaWFsaXplTm9kZSIsIm5vZGUiLCJzZXJpYWxpemUiLCJzZXJpYWxpemVOb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFTQSxNQUFULENBQWdCQyxNQUFoQixFQUF3QjtBQUN0QixNQUFNQyxTQUFTQyxLQUFLQyxTQUFMLENBQWVILE1BQWYsQ0FBZjtBQUNBLE1BQU1JLFVBQVVDLE9BQU9DLElBQVAsQ0FBWUQsT0FBT0Usa0JBQVAsQ0FBMEJOLE1BQTFCLENBQVosQ0FBaEI7QUFDQSxTQUFPRyxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTSSxNQUFULENBQWdCUCxNQUFoQixFQUF3QjtBQUN0QixNQUFNUSxVQUFVSixPQUFPSyxrQkFBUCxDQUEwQkwsT0FBT00sSUFBUCxDQUFZVixNQUFaLENBQTFCLENBQWhCO0FBQ0EsTUFBTUQsU0FBU0UsS0FBS1UsS0FBTCxDQUFXSCxPQUFYLENBQWY7QUFDQSxTQUFPVCxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTYSxXQUFULENBQXFCWixNQUFyQixFQUE2QmEsT0FBN0IsRUFBc0M7QUFDcEMsTUFBTUMsTUFBTVAsT0FBT1AsTUFBUCxDQUFaO0FBQ0EsTUFBTWUsUUFBUSxjQUFJSCxXQUFKLENBQWdCRSxHQUFoQixFQUFxQkQsT0FBckIsQ0FBZDtBQUNBLFNBQU9FLEtBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFNBQVNDLGVBQVQsQ0FBeUJoQixNQUF6QixFQUFpQ2EsT0FBakMsRUFBMEM7QUFDeEMsTUFBTUMsTUFBTVAsT0FBT1AsTUFBUCxDQUFaO0FBQ0EsTUFBTWlCLE9BQU8sY0FBSUQsZUFBSixDQUFvQkYsR0FBcEIsRUFBeUJELE9BQXpCLENBQWI7QUFDQSxTQUFPSSxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTQyxTQUFULENBQW1CSCxLQUFuQixFQUEwQkYsT0FBMUIsRUFBbUM7QUFDakMsTUFBTUMsTUFBTSxjQUFJSSxTQUFKLENBQWNILEtBQWQsRUFBcUJGLE9BQXJCLENBQVo7QUFDQSxNQUFNVixVQUFVTCxPQUFPZ0IsR0FBUCxDQUFoQjtBQUNBLFNBQU9YLE9BQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFNBQVNnQixhQUFULENBQXVCRixJQUF2QixFQUE2QkosT0FBN0IsRUFBc0M7QUFDcEMsTUFBTUMsTUFBTSxjQUFJSyxhQUFKLENBQWtCRixJQUFsQixFQUF3QkosT0FBeEIsQ0FBWjtBQUNBLE1BQU1WLFVBQVVMLE9BQU9nQixHQUFQLENBQWhCO0FBQ0EsU0FBT1gsT0FBUDtBQUNEOztBQUVEOzs7Ozs7a0JBTWU7QUFDYlMsMEJBRGE7QUFFYkksa0NBRmE7QUFHYkUsc0JBSGE7QUFJYkM7QUFKYSxDIiwiZmlsZSI6ImJhc2UtNjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBSYXcgZnJvbSAnLi9yYXcnXG5cbi8qKlxuICogRW5jb2RlIGEgSlNPTiBgb2JqZWN0YCBhcyBiYXNlLTY0IGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBlbmNvZGUob2JqZWN0KSB7XG4gIGNvbnN0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iamVjdClcbiAgY29uc3QgZW5jb2RlZCA9IHdpbmRvdy5idG9hKHdpbmRvdy5lbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKSlcbiAgcmV0dXJuIGVuY29kZWRcbn1cblxuLyoqXG4gKiBEZWNvZGUgYSBiYXNlLTY0IGBzdHJpbmdgIHRvIGEgSlNPTiBgb2JqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlKHN0cmluZykge1xuICBjb25zdCBkZWNvZGVkID0gd2luZG93LmRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cuYXRvYihzdHJpbmcpKVxuICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGRlY29kZWQpXG4gIHJldHVybiBvYmplY3Rcbn1cblxuLyoqXG4gKiBEZXNlcmlhbGl6ZSBhIFN0YXRlIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0YXRlfVxuICovXG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplKHN0cmluZywgb3B0aW9ucykge1xuICBjb25zdCByYXcgPSBkZWNvZGUoc3RyaW5nKVxuICBjb25zdCBzdGF0ZSA9IFJhdy5kZXNlcmlhbGl6ZShyYXcsIG9wdGlvbnMpXG4gIHJldHVybiBzdGF0ZVxufVxuXG4vKipcbiAqIERlc2VyaWFsaXplIGEgTm9kZSBgc3RyaW5nYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplTm9kZShzdHJpbmcsIG9wdGlvbnMpIHtcbiAgY29uc3QgcmF3ID0gZGVjb2RlKHN0cmluZylcbiAgY29uc3Qgbm9kZSA9IFJhdy5kZXNlcmlhbGl6ZU5vZGUocmF3LCBvcHRpb25zKVxuICByZXR1cm4gbm9kZVxufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBhIGBzdGF0ZWAuXG4gKlxuICogQHBhcmFtIHtTdGF0ZX0gc3RhdGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUoc3RhdGUsIG9wdGlvbnMpIHtcbiAgY29uc3QgcmF3ID0gUmF3LnNlcmlhbGl6ZShzdGF0ZSwgb3B0aW9ucylcbiAgY29uc3QgZW5jb2RlZCA9IGVuY29kZShyYXcpXG4gIHJldHVybiBlbmNvZGVkXG59XG5cbi8qKlxuICogU2VyaWFsaXplIGEgYG5vZGVgLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZU5vZGUobm9kZSwgb3B0aW9ucykge1xuICBjb25zdCByYXcgPSBSYXcuc2VyaWFsaXplTm9kZShub2RlLCBvcHRpb25zKVxuICBjb25zdCBlbmNvZGVkID0gZW5jb2RlKHJhdylcbiAgcmV0dXJuIGVuY29kZWRcbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRlc2VyaWFsaXplLFxuICBkZXNlcmlhbGl6ZU5vZGUsXG4gIHNlcmlhbGl6ZSxcbiAgc2VyaWFsaXplTm9kZVxufVxuIl19