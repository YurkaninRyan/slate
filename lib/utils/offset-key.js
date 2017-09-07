'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _normalizeNodeAndOffset = require('./normalize-node-and-offset');

var _normalizeNodeAndOffset2 = _interopRequireDefault(_normalizeNodeAndOffset);

var _findClosestNode = require('./find-closest-node');

var _findClosestNode2 = _interopRequireDefault(_findClosestNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Offset key parser regex.
 *
 * @type {RegExp}
 */

var PARSER = /^(\w+)(?:-(\d+))?$/;

/**
 * Offset key attribute name.
 *
 * @type {String}
 */

var ATTRIBUTE = 'data-offset-key';

/**
 * Offset key attribute selector.
 *
 * @type {String}
 */

var SELECTOR = '[' + ATTRIBUTE + ']';

/**
 * Void node selection.
 *
 * @type {String}
 */

var VOID_SELECTOR = '[data-slate-void]';

/**
 * Find the start and end bounds from an `offsetKey` and `ranges`.
 *
 * @param {Number} index
 * @param {List<Range>} ranges
 * @return {Object}
 */

function findBounds(index, ranges) {
  var range = ranges.get(index);
  var start = ranges.slice(0, index).reduce(function (memo, r) {
    return memo += r.text.length;
  }, 0);

  return {
    start: start,
    end: start + range.text.length
  };
}

/**
 * From a DOM node, find the closest parent's offset key.
 *
 * @param {Element} rawNode
 * @param {Number} rawOffset
 * @return {Object}
 */

function findKey(rawNode, rawOffset) {
  var _normalizeNodeAndOffs = (0, _normalizeNodeAndOffset2.default)(rawNode, rawOffset),
      node = _normalizeNodeAndOffs.node,
      offset = _normalizeNodeAndOffs.offset;

  var parentNode = node.parentNode;

  // Find the closest parent with an offset key attribute.

  var closest = (0, _findClosestNode2.default)(parentNode, SELECTOR);

  // For void nodes, the element with the offset key will be a cousin, not an
  // ancestor, so find it by going down from the nearest void parent.
  if (!closest) {
    var closestVoid = (0, _findClosestNode2.default)(parentNode, VOID_SELECTOR);
    if (!closestVoid) return null;
    closest = closestVoid.querySelector(SELECTOR);
    offset = closest.textContent.length;
  }

  // Get the string value of the offset key attribute.
  var offsetKey = closest.getAttribute(ATTRIBUTE);

  // If we still didn't find an offset key, abort.
  if (!offsetKey) return null;

  // Return the parsed the offset key.
  var parsed = parse(offsetKey);
  return {
    key: parsed.key,
    index: parsed.index,
    offset: offset
  };
}

/**
 * Find the selection point from an `offsetKey` and `ranges`.
 *
 * @param {Object} offsetKey
 * @param {List<Range>} ranges
 * @return {Object}
 */

function findPoint(offsetKey, ranges) {
  var key = offsetKey.key,
      index = offsetKey.index,
      offset = offsetKey.offset;

  var _findBounds = findBounds(index, ranges),
      start = _findBounds.start,
      end = _findBounds.end;

  // Don't let the offset be outside of the start and end bounds.


  offset = start + offset;
  offset = Math.max(offset, start);
  offset = Math.min(offset, end);

  return {
    key: key,
    index: index,
    start: start,
    end: end,
    offset: offset
  };
}

/**
 * Parse an offset key `string`.
 *
 * @param {String} string
 * @return {Object}
 */

function parse(string) {
  var matches = PARSER.exec(string);
  if (!matches) throw new Error('Invalid offset key string "' + string + '".');

  var _matches = _slicedToArray(matches, 3),
      original = _matches[0],
      key = _matches[1],
      index = _matches[2]; // eslint-disable-line no-unused-vars


  return {
    key: key,
    index: parseInt(index, 10)
  };
}

/**
 * Stringify an offset key `object`.
 *
 * @param {Object} object
 *   @property {String} key
 *   @property {Number} index
 * @return {String}
 */

function stringify(object) {
  return object.key + '-' + object.index;
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  findBounds: findBounds,
  findKey: findKey,
  findPoint: findPoint,
  parse: parse,
  stringify: stringify
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9vZmZzZXQta2V5LmpzIl0sIm5hbWVzIjpbIlBBUlNFUiIsIkFUVFJJQlVURSIsIlNFTEVDVE9SIiwiVk9JRF9TRUxFQ1RPUiIsImZpbmRCb3VuZHMiLCJpbmRleCIsInJhbmdlcyIsInJhbmdlIiwiZ2V0Iiwic3RhcnQiLCJzbGljZSIsInJlZHVjZSIsIm1lbW8iLCJyIiwidGV4dCIsImxlbmd0aCIsImVuZCIsImZpbmRLZXkiLCJyYXdOb2RlIiwicmF3T2Zmc2V0Iiwibm9kZSIsIm9mZnNldCIsInBhcmVudE5vZGUiLCJjbG9zZXN0IiwiY2xvc2VzdFZvaWQiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJvZmZzZXRLZXkiLCJnZXRBdHRyaWJ1dGUiLCJwYXJzZWQiLCJwYXJzZSIsImtleSIsImZpbmRQb2ludCIsIk1hdGgiLCJtYXgiLCJtaW4iLCJzdHJpbmciLCJtYXRjaGVzIiwiZXhlYyIsIkVycm9yIiwib3JpZ2luYWwiLCJwYXJzZUludCIsInN0cmluZ2lmeSIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsU0FBUyxvQkFBZjs7QUFFQTs7Ozs7O0FBTUEsSUFBTUMsWUFBWSxpQkFBbEI7O0FBRUE7Ozs7OztBQU1BLElBQU1DLGlCQUFlRCxTQUFmLE1BQU47O0FBRUE7Ozs7OztBQU1BLElBQU1FLGdCQUFnQixtQkFBdEI7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0MsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkJDLE1BQTNCLEVBQW1DO0FBQ2pDLE1BQU1DLFFBQVFELE9BQU9FLEdBQVAsQ0FBV0gsS0FBWCxDQUFkO0FBQ0EsTUFBTUksUUFBUUgsT0FDWEksS0FEVyxDQUNMLENBREssRUFDRkwsS0FERSxFQUVYTSxNQUZXLENBRUosVUFBQ0MsSUFBRCxFQUFPQyxDQUFQLEVBQWE7QUFDbkIsV0FBT0QsUUFBUUMsRUFBRUMsSUFBRixDQUFP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IiwiZmlsZSI6Im9mZnNldC1rZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBub3JtYWxpemVOb2RlQW5kT2Zmc2V0IGZyb20gJy4vbm9ybWFsaXplLW5vZGUtYW5kLW9mZnNldCdcbmltcG9ydCBmaW5kQ2xvc2VzdE5vZGUgZnJvbSAnLi9maW5kLWNsb3Nlc3Qtbm9kZSdcblxuLyoqXG4gKiBPZmZzZXQga2V5IHBhcnNlciByZWdleC5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG5cbmNvbnN0IFBBUlNFUiA9IC9eKFxcdyspKD86LShcXGQrKSk/JC9cblxuLyoqXG4gKiBPZmZzZXQga2V5IGF0dHJpYnV0ZSBuYW1lLlxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cblxuY29uc3QgQVRUUklCVVRFID0gJ2RhdGEtb2Zmc2V0LWtleSdcblxuLyoqXG4gKiBPZmZzZXQga2V5IGF0dHJpYnV0ZSBzZWxlY3Rvci5cbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5cbmNvbnN0IFNFTEVDVE9SID0gYFske0FUVFJJQlVURX1dYFxuXG4vKipcbiAqIFZvaWQgbm9kZSBzZWxlY3Rpb24uXG4gKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuXG5jb25zdCBWT0lEX1NFTEVDVE9SID0gJ1tkYXRhLXNsYXRlLXZvaWRdJ1xuXG4vKipcbiAqIEZpbmQgdGhlIHN0YXJ0IGFuZCBlbmQgYm91bmRzIGZyb20gYW4gYG9mZnNldEtleWAgYW5kIGByYW5nZXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHtMaXN0PFJhbmdlPn0gcmFuZ2VzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gZmluZEJvdW5kcyhpbmRleCwgcmFuZ2VzKSB7XG4gIGNvbnN0IHJhbmdlID0gcmFuZ2VzLmdldChpbmRleClcbiAgY29uc3Qgc3RhcnQgPSByYW5nZXNcbiAgICAuc2xpY2UoMCwgaW5kZXgpXG4gICAgLnJlZHVjZSgobWVtbywgcikgPT4ge1xuICAgICAgcmV0dXJuIG1lbW8gKz0gci50ZXh0Lmxlbmd0aFxuICAgIH0sIDApXG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgcmFuZ2UudGV4dC5sZW5ndGhcbiAgfVxufVxuXG4vKipcbiAqIEZyb20gYSBET00gbm9kZSwgZmluZCB0aGUgY2xvc2VzdCBwYXJlbnQncyBvZmZzZXQga2V5LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmF3Tm9kZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhd09mZnNldFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGZpbmRLZXkocmF3Tm9kZSwgcmF3T2Zmc2V0KSB7XG4gIGxldCB7IG5vZGUsIG9mZnNldCB9ID0gbm9ybWFsaXplTm9kZUFuZE9mZnNldChyYXdOb2RlLCByYXdPZmZzZXQpXG4gIGNvbnN0IHsgcGFyZW50Tm9kZSB9ID0gbm9kZVxuXG4gIC8vIEZpbmQgdGhlIGNsb3Nlc3QgcGFyZW50IHdpdGggYW4gb2Zmc2V0IGtleSBhdHRyaWJ1dGUuXG4gIGxldCBjbG9zZXN0ID0gZmluZENsb3Nlc3ROb2RlKHBhcmVudE5vZGUsIFNFTEVDVE9SKVxuXG4gIC8vIEZvciB2b2lkIG5vZGVzLCB0aGUgZWxlbWVudCB3aXRoIHRoZSBvZmZzZXQga2V5IHdpbGwgYmUgYSBjb3VzaW4sIG5vdCBhblxuICAvLyBhbmNlc3Rvciwgc28gZmluZCBpdCBieSBnb2luZyBkb3duIGZyb20gdGhlIG5lYXJlc3Qgdm9pZCBwYXJlbnQuXG4gIGlmICghY2xvc2VzdCkge1xuICAgIGNvbnN0IGNsb3Nlc3RWb2lkID0gZmluZENsb3Nlc3ROb2RlKHBhcmVudE5vZGUsIFZPSURfU0VMRUNUT1IpXG4gICAgaWYgKCFjbG9zZXN0Vm9pZCkgcmV0dXJuIG51bGxcbiAgICBjbG9zZXN0ID0gY2xvc2VzdFZvaWQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUilcbiAgICBvZmZzZXQgPSBjbG9zZXN0LnRleHRDb250ZW50Lmxlbmd0aFxuICB9XG5cbiAgLy8gR2V0IHRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIG9mZnNldCBrZXkgYXR0cmlidXRlLlxuICBjb25zdCBvZmZzZXRLZXkgPSBjbG9zZXN0LmdldEF0dHJpYnV0ZShBVFRSSUJVVEUpXG5cbiAgLy8gSWYgd2Ugc3RpbGwgZGlkbid0IGZpbmQgYW4gb2Zmc2V0IGtleSwgYWJvcnQuXG4gIGlmICghb2Zmc2V0S2V5KSByZXR1cm4gbnVsbFxuXG4gIC8vIFJldHVybiB0aGUgcGFyc2VkIHRoZSBvZmZzZXQga2V5LlxuICBjb25zdCBwYXJzZWQgPSBwYXJzZShvZmZzZXRLZXkpXG4gIHJldHVybiB7XG4gICAga2V5OiBwYXJzZWQua2V5LFxuICAgIGluZGV4OiBwYXJzZWQuaW5kZXgsXG4gICAgb2Zmc2V0XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBzZWxlY3Rpb24gcG9pbnQgZnJvbSBhbiBgb2Zmc2V0S2V5YCBhbmQgYHJhbmdlc2AuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9mZnNldEtleVxuICogQHBhcmFtIHtMaXN0PFJhbmdlPn0gcmFuZ2VzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gZmluZFBvaW50KG9mZnNldEtleSwgcmFuZ2VzKSB7XG4gIGxldCB7IGtleSwgaW5kZXgsIG9mZnNldCB9ID0gb2Zmc2V0S2V5XG4gIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gZmluZEJvdW5kcyhpbmRleCwgcmFuZ2VzKVxuXG4gIC8vIERvbid0IGxldCB0aGUgb2Zmc2V0IGJlIG91dHNpZGUgb2YgdGhlIHN0YXJ0IGFuZCBlbmQgYm91bmRzLlxuICBvZmZzZXQgPSBzdGFydCArIG9mZnNldFxuICBvZmZzZXQgPSBNYXRoLm1heChvZmZzZXQsIHN0YXJ0KVxuICBvZmZzZXQgPSBNYXRoLm1pbihvZmZzZXQsIGVuZClcblxuICByZXR1cm4ge1xuICAgIGtleSxcbiAgICBpbmRleCxcbiAgICBzdGFydCxcbiAgICBlbmQsXG4gICAgb2Zmc2V0XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhbiBvZmZzZXQga2V5IGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHJpbmcpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IFBBUlNFUi5leGVjKHN0cmluZylcbiAgaWYgKCFtYXRjaGVzKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgb2Zmc2V0IGtleSBzdHJpbmcgXCIke3N0cmluZ31cIi5gKVxuICBjb25zdCBbIG9yaWdpbmFsLCBrZXksIGluZGV4IF0gPSBtYXRjaGVzIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuIHtcbiAgICBrZXksXG4gICAgaW5kZXg6IHBhcnNlSW50KGluZGV4LCAxMClcbiAgfVxufVxuXG4vKipcbiAqIFN0cmluZ2lmeSBhbiBvZmZzZXQga2V5IGBvYmplY3RgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqICAgQHByb3BlcnR5IHtTdHJpbmd9IGtleVxuICogICBAcHJvcGVydHkge051bWJlcn0gaW5kZXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqZWN0KSB7XG4gIHJldHVybiBgJHtvYmplY3Qua2V5fS0ke29iamVjdC5pbmRleH1gXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQge1xuICBmaW5kQm91bmRzLFxuICBmaW5kS2V5LFxuICBmaW5kUG9pbnQsXG4gIHBhcnNlLFxuICBzdHJpbmdpZnlcbn1cbiJdfQ==