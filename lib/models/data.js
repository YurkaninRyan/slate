'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Data.
 *
 * This isn't an immutable record, it's just a thin wrapper around `Map` so that
 * we can allow for more convenient creation.
 *
 * @type {Object}
 */

var Data = {

  /**
   * Create a new `Data` with `attrs`.
   *
   * @param {Object|Data|Map} attrs
   * @return {Data} data
   */

  create: function create() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (_immutable.Map.isMap(attrs)) {
      return attrs;
    }

    if ((0, _isPlainObject2.default)(attrs)) {
      return new _immutable.Map(attrs);
    }

    throw new Error('`Data.create` only accepts objects or maps, but you passed it: ' + attrs);
  }
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Data;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZGF0YS5qcyJdLCJuYW1lcyI6WyJEYXRhIiwiY3JlYXRlIiwiYXR0cnMiLCJpc01hcCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7OztBQVNBLElBQU1BLE9BQU87O0FBRVg7Ozs7Ozs7QUFPQUMsUUFUVyxvQkFTUTtBQUFBLFFBQVpDLEtBQVksdUVBQUosRUFBSTs7QUFDakIsUUFBSSxlQUFJQyxLQUFKLENBQVVELEtBQVYsQ0FBSixFQUFzQjtBQUNwQixhQUFPQSxLQUFQO0FBQ0Q7O0FBRUQsUUFBSSw2QkFBY0EsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCLGFBQU8sbUJBQVFBLEtBQVIsQ0FBUDtBQUNEOztBQUVELFVBQU0sSUFBSUUsS0FBSixxRUFBOEVGLEtBQTlFLENBQU47QUFDRDtBQW5CVSxDQUFiOztBQXVCQTs7Ozs7O2tCQU1lRixJIiwiZmlsZSI6ImRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2lzLXBsYWluLW9iamVjdCdcbmltcG9ydCB7IE1hcCB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBEYXRhLlxuICpcbiAqIFRoaXMgaXNuJ3QgYW4gaW1tdXRhYmxlIHJlY29yZCwgaXQncyBqdXN0IGEgdGhpbiB3cmFwcGVyIGFyb3VuZCBgTWFwYCBzbyB0aGF0XG4gKiB3ZSBjYW4gYWxsb3cgZm9yIG1vcmUgY29udmVuaWVudCBjcmVhdGlvbi5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IERhdGEgPSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgRGF0YWAgd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxEYXRhfE1hcH0gYXR0cnNcbiAgICogQHJldHVybiB7RGF0YX0gZGF0YVxuICAgKi9cblxuICBjcmVhdGUoYXR0cnMgPSB7fSkge1xuICAgIGlmIChNYXAuaXNNYXAoYXR0cnMpKSB7XG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChhdHRycykpIHtcbiAgICAgIHJldHVybiBuZXcgTWFwKGF0dHJzKVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgXFxgRGF0YS5jcmVhdGVcXGAgb25seSBhY2NlcHRzIG9iamVjdHMgb3IgbWFwcywgYnV0IHlvdSBwYXNzZWQgaXQ6ICR7YXR0cnN9YClcbiAgfVxuXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgRGF0YVxuIl19