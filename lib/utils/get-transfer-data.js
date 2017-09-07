'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _transferTypes = require('../constants/transfer-types');

var _transferTypes2 = _interopRequireDefault(_transferTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fragment matching regexp for HTML nodes.
 *
 * @type {RegExp}
 */

var FRAGMENT_MATCHER = / data-slate-fragment="([^\s"]+)"/;

/**
 * Get the data and type from a native data `transfer`.
 *
 * @param {DataTransfer} transfer
 * @return {Object}
 */

function getTransferData(transfer) {
  var fragment = getType(transfer, _transferTypes2.default.FRAGMENT);
  var node = getType(transfer, _transferTypes2.default.NODE);
  var html = getType(transfer, 'text/html');
  var rich = getType(transfer, 'text/rtf');
  var text = getType(transfer, 'text/plain');
  var files = void 0;

  // If there isn't a fragment, but there is HTML, check to see if the HTML is
  // actually an encoded fragment.
  if (!fragment && html && ~html.indexOf(' data-slate-fragment="')) {
    var matches = FRAGMENT_MATCHER.exec(html);

    var _matches = _slicedToArray(matches, 2),
        full = _matches[0],
        encoded = _matches[1]; // eslint-disable-line no-unused-vars


    if (encoded) fragment = encoded;
  }

  // COMPAT: Edge doesn't handle custom data types
  // These will be embedded in text/plain in this case (2017/7/12)
  if (text) {
    var embeddedTypes = getEmbeddedTypes(text);

    if (embeddedTypes[_transferTypes2.default.FRAGMENT]) fragment = embeddedTypes[_transferTypes2.default.FRAGMENT];
    if (embeddedTypes[_transferTypes2.default.NODE]) node = embeddedTypes[_transferTypes2.default.NODE];
    if (embeddedTypes['text/plain']) text = embeddedTypes['text/plain'];
  }

  // Decode a fragment or node if they exist.
  if (fragment) fragment = _base2.default.deserializeNode(fragment);
  if (node) node = _base2.default.deserializeNode(node);

  // COMPAT: Edge sometimes throws 'NotSupportedError'
  // when accessing `transfer.items` (2017/7/12)
  try {
    // Get and normalize files if they exist.
    if (transfer.items && transfer.items.length) {
      files = Array.from(transfer.items).map(function (item) {
        return item.kind == 'file' ? item.getAsFile() : null;
      }).filter(function (exists) {
        return exists;
      });
    } else if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files);
    }
  } catch (err) {
    if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files);
    }
  }

  // Determine the type of the data.
  var data = { files: files, fragment: fragment, html: html, node: node, rich: rich, text: text };
  data.type = getTransferType(data);
  return data;
}

/**
 * Takes text input, checks whether contains embedded data
 * and returns object with original text +/- additional data
 *
 * @param {String} text
 * @return {Object}
 */

function getEmbeddedTypes(text) {
  var prefix = 'SLATE-DATA-EMBED::';

  if (text.substring(0, prefix.length) !== prefix) {
    return { 'text/plain': text };
  }

  // Attempt to parse, if fails then just standard text/plain
  // Otherwise, already had data embedded
  try {
    return JSON.parse(text.substring(prefix.length));
  } catch (err) {
    throw new Error('Unable to parse custom embedded drag data');
  }
}

/**
 * Get the type of a transfer from its `data`.
 *
 * @param {Object} data
 * @return {String}
 */

function getTransferType(data) {
  if (data.fragment) return 'fragment';
  if (data.node) return 'node';

  // COMPAT: Microsoft Word adds an image of the selected text to the data.
  // Since files are preferred over HTML or text, this would cause the type to
  // be considered `files`. But it also adds rich text data so we can check
  // for that and properly set the type to `html` or `text`. (2016/11/21)
  if (data.rich && data.html) return 'html';
  if (data.rich && data.text) return 'text';

  if (data.files && data.files.length) return 'files';
  if (data.html) return 'html';
  if (data.text) return 'text';
  return 'unknown';
}

/**
 * Get one of types `TYPES.FRAGMENT`, `TYPES.NODE`, `text/html`, `text/rtf` or
 * `text/plain` from transfers's `data` if possible, otherwise return null.
 *
 * @param {Object} transfer
 * @param {String} type
 * @return {String}
 */

function getType(transfer, type) {
  if (!transfer.types || !transfer.types.length) {
    // COMPAT: In IE 11, there is no `types` field but `getData('Text')`
    // is supported`. (2017/06/23)
    return type === 'text/plain' ? transfer.getData('Text') || null : null;
  }

  return transfer.types.indexOf(type) !== -1 ? transfer.getData(type) || null : null;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = getTransferData;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9nZXQtdHJhbnNmZXItZGF0YS5qcyJdLCJuYW1lcyI6WyJGUkFHTUVOVF9NQVRDSEVSIiwiZ2V0VHJhbnNmZXJEYXRhIiwidHJhbnNmZXIiLCJmcmFnbWVudCIsImdldFR5cGUiLCJGUkFHTUVOVCIsIm5vZGUiLCJOT0RFIiwiaHRtbCIsInJpY2giLCJ0ZXh0IiwiZmlsZXMiLCJpbmRleE9mIiwibWF0Y2hlcyIsImV4ZWMiLCJmdWxsIiwiZW5jb2RlZCIsImVtYmVkZGVkVHlwZXMiLCJnZXRFbWJlZGRlZFR5cGVzIiwiZGVzZXJpYWxpemVOb2RlIiwiaXRlbXMiLCJsZW5ndGgiLCJBcnJheSIsImZyb20iLCJtYXAiLCJpdGVtIiwia2luZCIsImdldEFzRmlsZSIsImZpbHRlciIsImV4aXN0cyIsImVyciIsImRhdGEiLCJ0eXBlIiwiZ2V0VHJhbnNmZXJUeXBlIiwicHJlZml4Iiwic3Vic3RyaW5nIiwiSlNPTiIsInBhcnNlIiwiRXJyb3IiLCJ0eXBlcyIsImdldERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7OztBQU1BLElBQU1BLG1CQUFtQixrQ0FBekI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFTQyxlQUFULENBQXlCQyxRQUF6QixFQUFtQztBQUNqQyxNQUFJQyxXQUFXQyxRQUFRRixRQUFSLEVBQWtCLHdCQUFlRyxRQUFqQyxDQUFmO0FBQ0EsTUFBSUMsT0FBT0YsUUFBUUYsUUFBUixFQUFrQix3QkFBZUssSUFBakMsQ0FBWDtBQUNBLE1BQU1DLE9BQU9KLFFBQVFGLFFBQVIsRUFBa0IsV0FBbEIsQ0FBYjtBQUNBLE1BQU1PLE9BQU9MLFFBQVFGLFFBQVIsRUFBa0IsVUFBbEIsQ0FBYjtBQUNBLE1BQUlRLE9BQU9OLFFBQVFGLFFBQVIsRUFBa0IsWUFBbEIsQ0FBWDtBQUNBLE1BQUlTLGNBQUo7O0FBRUE7QUFDQTtBQUNBLE1BQ0UsQ0FBQ1IsUUFBRCxJQUNBSyxJQURBLElBRUEs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TUFBSXlCLEtBQUt0QixJQUFMLElBQWFzQixLQUFLdkIsSUFBdEIsRUFBNEIsT0FBTyxNQUFQO0FBQzVCLE1BQUl1QixLQUFLdEIsSUFBTCxJQUFhc0IsS0FBS3JCLElBQXRCLEVBQTRCLE9BQU8sTUFBUDs7QUFFNUIsTUFBSXFCLEtBQUtwQixLQUFMLElBQWNvQixLQUFLcEIsS0FBTCxDQUFXVSxNQUE3QixFQUFxQyxPQUFPLE9BQVA7QUFDckMsTUFBSVUsS0FBS3ZCLElBQVQsRUFBZSxPQUFPLE1BQVA7QUFDZixNQUFJdUIsS0FBS3JCLElBQVQsRUFBZSxPQUFPLE1BQVA7QUFDZixTQUFPLFNBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU04sT0FBVCxDQUFpQkYsUUFBakIsRUFBMkI4QixJQUEzQixFQUFpQztBQUMvQixNQUFJLENBQUM5QixTQUFTcUMsS0FBVixJQUFtQixDQUFDckMsU0FBU3FDLEtBQVQsQ0FBZWxCLE1BQXZDLEVBQStDO0FBQzdDO0FBQ0E7QUFDQSxXQUFPVyxTQUFTLFlBQVQsR0FBd0I5QixTQUFTc0MsT0FBVCxDQUFpQixNQUFqQixLQUE0QixJQUFwRCxHQUEyRCxJQUFsRTtBQUNEOztBQUVELFNBQU90QyxTQUFTcUMsS0FBVCxDQUFlM0IsT0FBZixDQUF1Qm9CLElBQXZCLE1BQWlDLENBQUMsQ0FBbEMsR0FBc0M5QixTQUFTc0MsT0FBVCxDQUFpQlIsSUFBakIsS0FBMEIsSUFBaEUsR0FBdUUsSUFBOUU7QUFDRDs7QUFFRDs7Ozs7O2tCQU1lL0IsZSIsImZpbGUiOiJnZXQtdHJhbnNmZXItZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IEJhc2U2NCBmcm9tICcuLi9zZXJpYWxpemVycy9iYXNlLTY0J1xuaW1wb3J0IFRSQU5TRkVSX1RZUEVTIGZyb20gJy4uL2NvbnN0YW50cy90cmFuc2Zlci10eXBlcydcblxuLyoqXG4gKiBGcmFnbWVudCBtYXRjaGluZyByZWdleHAgZm9yIEhUTUwgbm9kZXMuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xuXG5jb25zdCBGUkFHTUVOVF9NQVRDSEVSID0gLyBkYXRhLXNsYXRlLWZyYWdtZW50PVwiKFteXFxzXCJdKylcIi9cblxuLyoqXG4gKiBHZXQgdGhlIGRhdGEgYW5kIHR5cGUgZnJvbSBhIG5hdGl2ZSBkYXRhIGB0cmFuc2ZlcmAuXG4gKlxuICogQHBhcmFtIHtEYXRhVHJhbnNmZXJ9IHRyYW5zZmVyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gZ2V0VHJhbnNmZXJEYXRhKHRyYW5zZmVyKSB7XG4gIGxldCBmcmFnbWVudCA9IGdldFR5cGUodHJhbnNmZXIsIFRSQU5TRkVSX1RZUEVTLkZSQUdNRU5UKVxuICBsZXQgbm9kZSA9IGdldFR5cGUodHJhbnNmZXIsIFRSQU5TRkVSX1RZUEVTLk5PREUpXG4gIGNvbnN0IGh0bWwgPSBnZXRUeXBlKHRyYW5zZmVyLCAndGV4dC9odG1sJylcbiAgY29uc3QgcmljaCA9IGdldFR5cGUodHJhbnNmZXIsICd0ZXh0L3J0ZicpXG4gIGxldCB0ZXh0ID0gZ2V0VHlwZSh0cmFuc2ZlciwgJ3RleHQvcGxhaW4nKVxuICBsZXQgZmlsZXNcblxuICAvLyBJZiB0aGVyZSBpc24ndCBhIGZyYWdtZW50LCBidXQgdGhlcmUgaXMgSFRNTCwgY2hlY2sgdG8gc2VlIGlmIHRoZSBIVE1MIGlzXG4gIC8vIGFjdHVhbGx5IGFuIGVuY29kZWQgZnJhZ21lbnQuXG4gIGlmIChcbiAgICAhZnJhZ21lbnQgJiZcbiAgICBodG1sICYmXG4gICAgfmh0bWwuaW5kZXhPZignIGRhdGEtc2xhdGUtZnJhZ21lbnQ9XCInKVxuICApIHtcbiAgICBjb25zdCBtYXRjaGVzID0gRlJBR01FTlRfTUFUQ0hFUi5leGVjKGh0bWwpXG4gICAgY29uc3QgWyBmdWxsLCBlbmNvZGVkIF0gPSBtYXRjaGVzIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICBpZiAoZW5jb2RlZCkgZnJhZ21lbnQgPSBlbmNvZGVkXG4gIH1cblxuICAvLyBDT01QQVQ6IEVkZ2UgZG9lc24ndCBoYW5kbGUgY3VzdG9tIGRhdGEgdHlwZXNcbiAgLy8gVGhlc2Ugd2lsbCBiZSBlbWJlZGRlZCBpbiB0ZXh0L3BsYWluIGluIHRoaXMgY2FzZSAoMjAxNy83LzEyKVxuICBpZiAodGV4dCkge1xuICAgIGNvbnN0IGVtYmVkZGVkVHlwZXMgPSBnZXRFbWJlZGRlZFR5cGVzKHRleHQpXG5cbiAgICBpZiAoZW1iZWRkZWRUeXBlc1tUUkFOU0ZFUl9UWVBFUy5GUkFHTUVOVF0pIGZyYWdtZW50ID0gZW1iZWRkZWRUeXBlc1tUUkFOU0ZFUl9UWVBFUy5GUkFHTUVOVF1cbiAgICBpZiAoZW1iZWRkZWRUeXBlc1tUUkFOU0ZFUl9UWVBFUy5OT0RFXSkgbm9kZSA9IGVtYmVkZGVkVHlwZXNbVFJBTlNGRVJfVFlQRVMuTk9ERV1cbiAgICBpZiAoZW1iZWRkZWRUeXBlc1sndGV4dC9wbGFpbiddKSB0ZXh0ID0gZW1iZWRkZWRUeXBlc1sndGV4dC9wbGFpbiddXG4gIH1cblxuICAvLyBEZWNvZGUgYSBmcmFnbWVudCBvciBub2RlIGlmIHRoZXkgZXhpc3QuXG4gIGlmIChmcmFnbWVudCkgZnJhZ21lbnQgPSBCYXNlNjQuZGVzZXJpYWxpemVOb2RlKGZyYWdtZW50KVxuICBpZiAobm9kZSkgbm9kZSA9IEJhc2U2NC5kZXNlcmlhbGl6ZU5vZGUobm9kZSlcblxuICAvLyBDT01QQVQ6IEVkZ2Ugc29tZXRpbWVzIHRocm93cyAnTm90U3VwcG9ydGVkRXJyb3InXG4gIC8vIHdoZW4gYWNjZXNzaW5nIGB0cmFuc2Zlci5pdGVtc2AgKDIwMTcvNy8xMilcbiAgdHJ5IHtcbiAgICAvLyBHZXQgYW5kIG5vcm1hbGl6ZSBmaWxlcyBpZiB0aGV5IGV4aXN0LlxuICAgIGlmICh0cmFuc2Zlci5pdGVtcyAmJiB0cmFuc2Zlci5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIGZpbGVzID0gQXJyYXkuZnJvbSh0cmFuc2Zlci5pdGVtcylcbiAgICAgICAgLm1hcChpdGVtID0+IGl0ZW0ua2luZCA9PSAnZmlsZScgPyBpdGVtLmdldEFzRmlsZSgpIDogbnVsbClcbiAgICAgICAgLmZpbHRlcihleGlzdHMgPT4gZXhpc3RzKVxuICAgIH0gZWxzZSBpZiAodHJhbnNmZXIuZmlsZXMgJiYgdHJhbnNmZXIuZmlsZXMubGVuZ3RoKSB7XG4gICAgICBmaWxlcyA9IEFycmF5LmZyb20odHJhbnNmZXIuZmlsZXMpXG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAodHJhbnNmZXIuZmlsZXMgJiYgdHJhbnNmZXIuZmlsZXMubGVuZ3RoKSB7XG4gICAgICBmaWxlcyA9IEFycmF5LmZyb20odHJhbnNmZXIuZmlsZXMpXG4gICAgfVxuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIHRoZSB0eXBlIG9mIHRoZSBkYXRhLlxuICBjb25zdCBkYXRhID0geyBmaWxlcywgZnJhZ21lbnQsIGh0bWwsIG5vZGUsIHJpY2gsIHRleHQgfVxuICBkYXRhLnR5cGUgPSBnZXRUcmFuc2ZlclR5cGUoZGF0YSlcbiAgcmV0dXJuIGRhdGFcbn1cblxuLyoqXG4gKiBUYWtlcyB0ZXh0IGlucHV0LCBjaGVja3Mgd2hldGhlciBjb250YWlucyBlbWJlZGRlZCBkYXRhXG4gKiBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCBvcmlnaW5hbCB0ZXh0ICsvLSBhZGRpdGlvbmFsIGRhdGFcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGdldEVtYmVkZGVkVHlwZXModGV4dCkge1xuICBjb25zdCBwcmVmaXggPSAnU0xBVEUtREFUQS1FTUJFRDo6J1xuXG4gIGlmICh0ZXh0LnN1YnN0cmluZygwLCBwcmVmaXgubGVuZ3RoKSAhPT0gcHJlZml4KSB7XG4gICAgcmV0dXJuIHsgJ3RleHQvcGxhaW4nOiB0ZXh0IH1cbiAgfVxuXG4gIC8vIEF0dGVtcHQgdG8gcGFyc2UsIGlmIGZhaWxzIHRoZW4ganVzdCBzdGFuZGFyZCB0ZXh0L3BsYWluXG4gIC8vIE90aGVyd2lzZSwgYWxyZWFkeSBoYWQgZGF0YSBlbWJlZGRlZFxuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQuc3Vic3RyaW5nKHByZWZpeC5sZW5ndGgpKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwYXJzZSBjdXN0b20gZW1iZWRkZWQgZHJhZyBkYXRhJylcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgdHlwZSBvZiBhIHRyYW5zZmVyIGZyb20gaXRzIGBkYXRhYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGdldFRyYW5zZmVyVHlwZShkYXRhKSB7XG4gIGlmIChkYXRhLmZyYWdtZW50KSByZXR1cm4gJ2ZyYWdtZW50J1xuICBpZiAoZGF0YS5ub2RlKSByZXR1cm4gJ25vZGUnXG5cbiAgLy8gQ09NUEFUOiBNaWNyb3NvZnQgV29yZCBhZGRzIGFuIGltYWdlIG9mIHRoZSBzZWxlY3RlZCB0ZXh0IHRvIHRoZSBkYXRhLlxuICAvLyBTaW5jZSBmaWxlcyBhcmUgcHJlZmVycmVkIG92ZXIgSFRNTCBvciB0ZXh0LCB0aGlzIHdvdWxkIGNhdXNlIHRoZSB0eXBlIHRvXG4gIC8vIGJlIGNvbnNpZGVyZWQgYGZpbGVzYC4gQnV0IGl0IGFsc28gYWRkcyByaWNoIHRleHQgZGF0YSBzbyB3ZSBjYW4gY2hlY2tcbiAgLy8gZm9yIHRoYXQgYW5kIHByb3Blcmx5IHNldCB0aGUgdHlwZSB0byBgaHRtbGAgb3IgYHRleHRgLiAoMjAxNi8xMS8yMSlcbiAgaWYgKGRhdGEucmljaCAmJiBkYXRhLmh0bWwpIHJldHVybiAnaHRtbCdcbiAgaWYgKGRhdGEucmljaCAmJiBkYXRhLnRleHQpIHJldHVybiAndGV4dCdcblxuICBpZiAoZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmxlbmd0aCkgcmV0dXJuICdmaWxlcydcbiAgaWYgKGRhdGEuaHRtbCkgcmV0dXJuICdodG1sJ1xuICBpZiAoZGF0YS50ZXh0KSByZXR1cm4gJ3RleHQnXG4gIHJldHVybiAndW5rbm93bidcbn1cblxuLyoqXG4gKiBHZXQgb25lIG9mIHR5cGVzIGBUWVBFUy5GUkFHTUVOVGAsIGBUWVBFUy5OT0RFYCwgYHRleHQvaHRtbGAsIGB0ZXh0L3J0ZmAgb3JcbiAqIGB0ZXh0L3BsYWluYCBmcm9tIHRyYW5zZmVycydzIGBkYXRhYCBpZiBwb3NzaWJsZSwgb3RoZXJ3aXNlIHJldHVybiBudWxsLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2ZlclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBnZXRUeXBlKHRyYW5zZmVyLCB0eXBlKSB7XG4gIGlmICghdHJhbnNmZXIudHlwZXMgfHwgIXRyYW5zZmVyLnR5cGVzLmxlbmd0aCkge1xuICAgIC8vIENPTVBBVDogSW4gSUUgMTEsIHRoZXJlIGlzIG5vIGB0eXBlc2AgZmllbGQgYnV0IGBnZXREYXRhKCdUZXh0JylgXG4gICAgLy8gaXMgc3VwcG9ydGVkYC4gKDIwMTcvMDYvMjMpXG4gICAgcmV0dXJuIHR5cGUgPT09ICd0ZXh0L3BsYWluJyA/IHRyYW5zZmVyLmdldERhdGEoJ1RleHQnKSB8fCBudWxsIDogbnVsbFxuICB9XG5cbiAgcmV0dXJuIHRyYW5zZmVyLnR5cGVzLmluZGV4T2YodHlwZSkgIT09IC0xID8gdHJhbnNmZXIuZ2V0RGF0YSh0eXBlKSB8fCBudWxsIDogbnVsbFxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VHJhbnNmZXJEYXRhXG4iXX0=