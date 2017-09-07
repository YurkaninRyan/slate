'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _raw = require('../serializers/raw');

var _raw2 = _interopRequireDefault(_raw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toRaw
 *   @property {String|Object} defaultBlock
 *   @property {Array} defaultMarks
 * @return {State}
 */

function deserialize(string) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$defaultBlock = options.defaultBlock,
      defaultBlock = _options$defaultBlock === undefined ? { type: 'line' } : _options$defaultBlock,
      _options$defaultMarks = options.defaultMarks,
      defaultMarks = _options$defaultMarks === undefined ? [] : _options$defaultMarks;


  var raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: string.split('\n').map(function (line) {
        return _extends({}, defaultBlock, {
          kind: 'block',
          nodes: [{
            kind: 'text',
            ranges: [{
              text: line,
              marks: defaultMarks
            }]
          }]
        });
      })
    }
  };

  return options.toRaw ? raw : _raw2.default.deserialize(raw);
}

/**
 * Serialize a `state` to plain text.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state) {
  return serializeNode(state.document);
}

/**
 * Serialize a `node` to plain text.
 * For blocks, or document, it recursively calls itself
 * to aggregate the text.
 * For other types of nodes, it uses the .text property
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node) {
  if (node.kind == 'document' || node.kind == 'block' && node.nodes.size > 0 && node.nodes.first().kind == 'block') {
    return node.nodes.map(function (n) {
      return serializeNode(n);
    }).filter(function (text) {
      return text != '';
    }).join('\n');
  } else {
    return node.text;
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  deserialize: deserialize,
  serialize: serialize
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJpYWxpemVycy9wbGFpbi5qcyJdLCJuYW1lcyI6WyJkZXNlcmlhbGl6ZSIsInN0cmluZyIsIm9wdGlvbnMiLCJkZWZhdWx0QmxvY2siLCJ0eXBlIiwiZGVmYXVsdE1hcmtzIiwicmF3Iiwia2luZCIsImRvY3VtZW50Iiwibm9kZXMiLCJzcGxpdCIsIm1hcCIsImxpbmUiLCJyYW5nZXMiLCJ0ZXh0IiwibWFya3MiLCJ0b1JhdyIsInNlcmlhbGl6ZSIsInN0YXRlIiwic2VyaWFsaXplTm9kZSIsIm5vZGUiLCJzaXplIiwiZmlyc3QiLCJuIiwiZmlsdGVyIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsU0FBU0EsV0FBVCxDQUFxQkMsTUFBckIsRUFBMkM7QUFBQSxNQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQSw4QkFJckNBLE9BSnFDLENBRXZDQyxZQUZ1QztBQUFBLE1BRXZDQSxZQUZ1Qyx5Q0FFeEIsRUFBRUMsTUFBTSxNQUFSLEVBRndCO0FBQUEsOEJBSXJDRixPQUpxQyxDQUd2Q0csWUFIdUM7QUFBQSxNQUd2Q0EsWUFIdUMseUNBR3hCLEVBSHdCOzs7QUFNekMsTUFBTUMsTUFBTTtBQUNWQyxVQUFNLE9BREk7QUFFVkMsY0FBVTtBQUNSRCxZQUFNLFVBREU7QUFFUkUsYUFBT1IsT0FBT1MsS0FBUCxDQUFhLElBQWIsRUFBbUJDLEdBQW5CLENBQXVCLFVBQUNDLElBQUQsRUFBVTtBQUN0Qyw0QkFDS1QsWUFETDtBQUVFSSxnQkFBTSxPQUZSO0FBR0VFLGlCQUFPLENBQ0w7QUFDRUYsa0JBQU0sTUFEUjtBQUVFTSxvQkFBUSxDQUNOO0FBQ0VDLG9CQUFNRixJQURSO0FBRUVHLHFCQUFPVjtBQUZULGFBRE07QUFGVixXQURLO0FBSFQ7QUFlRCxPQWhCTTtBQUZDO0FBRkEsR0FBWjs7QUF3QkEsU0FBT0gsUUFBUWMsS0FBUixHQUFnQlYsR0FBaEIsR0FBc0IsY0FBSU4sV0FBSixDQUFnQk0sR0FBaEIsQ0FBN0I7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFNBQVNXLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQ3hCLFNBQU9DLGNBQWNELE1BQU1WLFFBQXBCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFNBQVNXLGFBQVQsQ0FBdUJDLElBQXZCLEVBQTZCO0FBQzNCLE1BQ0dBLEtBQUtiLElBQUwsSUFBYSxVQUFkLElBQ0NhLEtBQUtiLElBQUwsSUFBYSxPQUFiLElBQXdCYSxLQUFLWCxLQUFMLENBQVdZLElBQVgsR0FBa0IsQ0FBMUMsSUFBK0NELEtBQUtYLEtBQUwsQ0FBV2EsS0FBWCxHQUFtQmYsSUFBbkIsSUFBMkIsT0FGN0UsRUFHRTtBQUNBLFdBQU9hLEtBQUtYLEtBQUwsQ0FDSkUsR0FESSxDQUNBO0FBQUEsYUFBS1EsY0FBY0ksQ0FBZCxDQUFMO0FBQUEsS0FEQSxFQUVKQyxNQUZJLENBRUc7QUFBQSxhQUFRVixRQUFRLEVBQWhCO0FBQUEsS0FGSCxFQUdKVyxJQUhJLENBR0MsSUFIRCxDQUFQO0FBSUQsR0FSRCxNQVFPO0FBQ0wsV0FBT0wsS0FBS04sSUFBWjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7OztrQkFNZTtBQUNiZCwwQkFEYTtBQUViaUI7QUFGYSxDIiwiZmlsZSI6InBsYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgUmF3IGZyb20gJy4uL3NlcmlhbGl6ZXJzL3JhdydcblxuLyoqXG4gKiBEZXNlcmlhbGl6ZSBhIHBsYWluIHRleHQgYHN0cmluZ2AgdG8gYSBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICBAcHJvcGVydHkge0Jvb2xlYW59IHRvUmF3XG4gKiAgIEBwcm9wZXJ0eSB7U3RyaW5nfE9iamVjdH0gZGVmYXVsdEJsb2NrXG4gKiAgIEBwcm9wZXJ0eSB7QXJyYXl9IGRlZmF1bHRNYXJrc1xuICogQHJldHVybiB7U3RhdGV9XG4gKi9cblxuZnVuY3Rpb24gZGVzZXJpYWxpemUoc3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3Qge1xuICAgIGRlZmF1bHRCbG9jayA9IHsgdHlwZTogJ2xpbmUnIH0sXG4gICAgZGVmYXVsdE1hcmtzID0gW10sXG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgcmF3ID0ge1xuICAgIGtpbmQ6ICdzdGF0ZScsXG4gICAgZG9jdW1lbnQ6IHtcbiAgICAgIGtpbmQ6ICdkb2N1bWVudCcsXG4gICAgICBub2Rlczogc3RyaW5nLnNwbGl0KCdcXG4nKS5tYXAoKGxpbmUpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5kZWZhdWx0QmxvY2ssXG4gICAgICAgICAga2luZDogJ2Jsb2NrJyxcbiAgICAgICAgICBub2RlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBraW5kOiAndGV4dCcsXG4gICAgICAgICAgICAgIHJhbmdlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6IGxpbmUsXG4gICAgICAgICAgICAgICAgICBtYXJrczogZGVmYXVsdE1hcmtzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnMudG9SYXcgPyByYXcgOiBSYXcuZGVzZXJpYWxpemUocmF3KVxufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBhIGBzdGF0ZWAgdG8gcGxhaW4gdGV4dC5cbiAqXG4gKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShzdGF0ZSkge1xuICByZXR1cm4gc2VyaWFsaXplTm9kZShzdGF0ZS5kb2N1bWVudClcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgYSBgbm9kZWAgdG8gcGxhaW4gdGV4dC5cbiAqIEZvciBibG9ja3MsIG9yIGRvY3VtZW50LCBpdCByZWN1cnNpdmVseSBjYWxscyBpdHNlbGZcbiAqIHRvIGFnZ3JlZ2F0ZSB0aGUgdGV4dC5cbiAqIEZvciBvdGhlciB0eXBlcyBvZiBub2RlcywgaXQgdXNlcyB0aGUgLnRleHQgcHJvcGVydHlcbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemVOb2RlKG5vZGUpIHtcbiAgaWYgKFxuICAgIChub2RlLmtpbmQgPT0gJ2RvY3VtZW50JykgfHxcbiAgICAobm9kZS5raW5kID09ICdibG9jaycgJiYgbm9kZS5ub2Rlcy5zaXplID4gMCAmJiBub2RlLm5vZGVzLmZpcnN0KCkua2luZCA9PSAnYmxvY2snKVxuICApIHtcbiAgICByZXR1cm4gbm9kZS5ub2Rlc1xuICAgICAgLm1hcChuID0+IHNlcmlhbGl6ZU5vZGUobikpXG4gICAgICAuZmlsdGVyKHRleHQgPT4gdGV4dCAhPSAnJylcbiAgICAgIC5qb2luKCdcXG4nKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBub2RlLnRleHRcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGVzZXJpYWxpemUsXG4gIHNlcmlhbGl6ZVxufVxuIl19