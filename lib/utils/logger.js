'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isDev = require('../constants/is-dev');

var _isDev2 = _interopRequireDefault(_isDev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Log a `message` at `level`.
 *
 * @param {String} level
 * @param {String} message
 * @param {Any} ...args
 */

function log(level, message) {
  if (!_isDev2.default) {
    return;
  }

  if (typeof console != 'undefined' && typeof console[level] == 'function') {
    var _console;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_console = console)[level].apply(_console, [message].concat(args));
  }
}

/**
 * Log a development warning `message`.
 *
 * @param {String} message
 * @param {Any} ...args
 */

/* eslint-disable no-console */

function warn(message) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  log.apply(undefined, ['warn', 'Warning: ' + message].concat(args));
}

/**
 * Log a deprecation warning `message`, with helpful `version` number.
 *
 * @param {String} version
 * @param {String} message
 * @param {Any} ...args
 */

function deprecate(version, message) {
  for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  log.apply(undefined, ['warn', 'Deprecation (v' + version + '): ' + message].concat(args));
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = {
  deprecate: deprecate,
  warn: warn
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9sb2dnZXIuanMiXSwibmFtZXMiOlsibG9nIiwibGV2ZWwiLCJtZXNzYWdlIiwiY29uc29sZSIsImFyZ3MiLCJ3YXJuIiwiZGVwcmVjYXRlIiwidmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7Ozs7OztBQUVBOzs7Ozs7OztBQVFBLFNBQVNBLEdBQVQsQ0FBYUMsS0FBYixFQUFvQkMsT0FBcEIsRUFBc0M7QUFDcEMsTUFBSSxnQkFBSixFQUFhO0FBQ1g7QUFDRDs7QUFFRCxNQUFJLE9BQU9DLE9BQVAsSUFBa0IsV0FBbEIsSUFBaUMsT0FBT0EsUUFBUUYsS0FBUixDQUFQLElBQXlCLFVBQTlELEVBQTBFO0FBQUE7O0FBQUEsc0NBTDVDRyxJQUs0QztBQUw1Q0EsVUFLNEM7QUFBQTs7QUFDeEUseUJBQVFILEtBQVIsbUJBQWVDLE9BQWYsU0FBMkJFLElBQTNCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OztBQXRCQTs7QUE2QkEsU0FBU0MsSUFBVCxDQUFjSCxPQUFkLEVBQWdDO0FBQUEscUNBQU5FLElBQU07QUFBTkEsUUFBTTtBQUFBOztBQUM5Qkosd0JBQUksTUFBSixnQkFBd0JFLE9BQXhCLFNBQXNDRSxJQUF0QztBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFNBQVNFLFNBQVQsQ0FBbUJDLE9BQW5CLEVBQTRCTCxPQUE1QixFQUE4QztBQUFBLHFDQUFORSxJQUFNO0FBQU5BLFFBQU07QUFBQTs7QUFDNUNKLHdCQUFJLE1BQUoscUJBQTZCTyxPQUE3QixXQUEwQ0wsT0FBMUMsU0FBd0RFLElBQXhEO0FBQ0Q7O0FBRUQ7Ozs7OztrQkFNZTtBQUNiRSxzQkFEYTtBQUViRDtBQUZhLEMiLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG5pbXBvcnQgSVNfREVWIGZyb20gJy4uL2NvbnN0YW50cy9pcy1kZXYnXG5cbi8qKlxuICogTG9nIGEgYG1lc3NhZ2VgIGF0IGBsZXZlbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGxldmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHtBbnl9IC4uLmFyZ3NcbiAqL1xuXG5mdW5jdGlvbiBsb2cobGV2ZWwsIG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgaWYgKCFJU19ERVYpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uc29sZVtsZXZlbF0gPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGVbbGV2ZWxdKG1lc3NhZ2UsIC4uLmFyZ3MpXG4gIH1cbn1cblxuLyoqXG4gKiBMb2cgYSBkZXZlbG9wbWVudCB3YXJuaW5nIGBtZXNzYWdlYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHtBbnl9IC4uLmFyZ3NcbiAqL1xuXG5mdW5jdGlvbiB3YXJuKG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgbG9nKCd3YXJuJywgYFdhcm5pbmc6ICR7bWVzc2FnZX1gLCAuLi5hcmdzKVxufVxuXG4vKipcbiAqIExvZyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgYG1lc3NhZ2VgLCB3aXRoIGhlbHBmdWwgYHZlcnNpb25gIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmVyc2lvblxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7QW55fSAuLi5hcmdzXG4gKi9cblxuZnVuY3Rpb24gZGVwcmVjYXRlKHZlcnNpb24sIG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgbG9nKCd3YXJuJywgYERlcHJlY2F0aW9uICh2JHt2ZXJzaW9ufSk6ICR7bWVzc2FnZX1gLCAuLi5hcmdzKVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkZXByZWNhdGUsXG4gIHdhcm4sXG59XG4iXX0=