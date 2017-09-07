'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:operation:invert');

/**
 * Invert an `op`.
 *
 * @param {Object} op
 * @return {Object}
 */

function invertOperation(op) {
  var type = op.type;

  debug(type, op);

  /**
   * Insert node.
   */

  if (type == 'insert_node') {
    return _extends({}, op, {
      type: 'remove_node'
    });
  }

  /**
   * Remove node.
   */

  if (type == 'remove_node') {
    return _extends({}, op, {
      type: 'insert_node'
    });
  }

  /**
   * Move node.
   */

  if (type == 'move_node') {
    return _extends({}, op, {
      path: op.newPath,
      newPath: op.path
    });
  }

  /**
   * Merge node.
   */

  if (type == 'merge_node') {
    var path = op.path;
    var length = path.length;

    var last = length - 1;
    return _extends({}, op, {
      type: 'split_node',
      path: path.slice(0, last).concat([path[last] - 1])
    });
  }

  /**
   * Split node.
   */

  if (type == 'split_node') {
    var _path = op.path;
    var _length = _path.length;

    var _last = _length - 1;
    return _extends({}, op, {
      type: 'merge_node',
      path: _path.slice(0, _last).concat([_path[_last] + 1])
    });
  }

  /**
   * Set node.
   */

  if (type == 'set_node') {
    var properties = op.properties,
        node = op.node;

    return _extends({}, op, {
      node: node.merge(properties),
      properties: (0, _pick2.default)(node, Object.keys(properties))
    });
  }

  /**
   * Insert text.
   */

  if (type == 'insert_text') {
    return _extends({}, op, {
      type: 'remove_text'
    });
  }

  /**
   * Remove text.
   */

  if (type == 'remove_text') {
    return _extends({}, op, {
      type: 'insert_text'
    });
  }

  /**
   * Add mark.
   */

  if (type == 'add_mark') {
    return _extends({}, op, {
      type: 'remove_mark'
    });
  }

  /**
   * Remove mark.
   */

  if (type == 'remove_mark') {
    return _extends({}, op, {
      type: 'add_mark'
    });
  }

  /**
   * Set mark.
   */

  if (type == 'set_mark') {
    var _properties = op.properties,
        mark = op.mark;

    return _extends({}, op, {
      mark: mark.merge(_properties),
      properties: (0, _pick2.default)(mark, Object.keys(_properties))
    });
  }

  /**
   * Set selection.
   */

  if (type == 'set_selection') {
    var _properties2 = op.properties,
        selection = op.selection;

    var inverse = _extends({}, op, {
      selection: _extends({}, selection, _properties2),
      properties: (0, _pick2.default)(selection, Object.keys(_properties2))
    });

    return inverse;
  }

  /**
   * Set data.
   */

  if (type == 'set_data') {
    var _properties3 = op.properties,
        data = op.data;

    return _extends({}, op, {
      data: data.merge(_properties3),
      properties: (0, _pick2.default)(data, Object.keys(_properties3))
    });
  }

  /**
   * Unknown.
   */

  throw new Error('Unknown op type: "' + type + '".');
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = invertOperation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vcGVyYXRpb25zL2ludmVydC5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsImludmVydE9wZXJhdGlvbiIsIm9wIiwidHlwZSIsInBhdGgiLCJuZXdQYXRoIiwibGVuZ3RoIiwibGFzdCIsInNsaWNlIiwiY29uY2F0IiwicHJvcGVydGllcyIsIm5vZGUiLCJtZXJnZSIsIk9iamVjdCIsImtleXMiLCJtYXJrIiwic2VsZWN0aW9uIiwiaW52ZXJzZSIsImRhdGEiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsUUFBUSxxQkFBTSx3QkFBTixDQUFkOztBQUVBOzs7Ozs7O0FBT0EsU0FBU0MsZUFBVCxDQUF5QkMsRUFBekIsRUFBNkI7QUFBQSxNQUNuQkMsSUFEbUIsR0FDVkQsRUFEVSxDQUNuQkMsSUFEbUI7O0FBRTNCSCxRQUFNRyxJQUFOLEVBQVlELEVBQVo7O0FBRUE7Ozs7QUFJQSxNQUFJQyxRQUFRLGFBQVosRUFBMkI7QUFDekIsd0JBQ0tELEVBREw7QUFFRUMsWUFBTTtBQUZSO0FBSUQ7O0FBRUQ7Ozs7QUFJQSxNQUFJQSxRQUFRLGFBQVosRUFBMkI7QUFDekIsd0JBQ0tELEVBREw7QUFFRUMsWUFBTTtBQUZSO0FBSUQ7O0FBRUQ7Ozs7QUFJQSxNQUFJQSxRQUFRLFdBQVosRUFBeUI7QUFDdkIsd0JBQ0tELEVBREw7QUFFRUUsWUFBTUYsR0FBR0csT0FGWDtBQUdFQSxlQUFTSCxHQUFHRTtBQUhkO0FBS0Q7O0FBRUQ7Ozs7QUFJQSxNQUFJRCxRQUFRLFlBQVosRUFBMEI7QUFBQSxRQUNoQkMsSUFEZ0IsR0FDUEYsRUFETyxDQUNoQkUsSUFEZ0I7QUFBQSxRQUVoQkUsTUFGZ0IsR0FFTEYsSUFGSyxDQUVoQkUsTUFGZ0I7O0FBR3hCLFFBQU1DLE9BQU9ELFNBQVMsQ0FBdEI7QUFDQSx3QkFDS0osRUFETDtBQUVFQyxZQUFNLFlBRlI7QUFHRUMsWUFBTUEsS0FBS0ksS0FBTCxDQUFXLENBQVgsRUFBY0QsSUFBZCxFQUFvQkUsTUFBcEIsQ0FBMkIsQ0FBQ0wsS0FBS0csSUFBTCxJQUFhLENBQWQsQ0FBM0I7QUFIUjtBQUtEOztBQUVEOzs7O0FBSUEsTUFBSUosUUFBUSxZQUFaLEVBQTBCO0FBQUEsUUFDaEJDLEtBRGdCLEdBQ1BGLEVBRE8sQ0FDaEJFLElBRGdCO0FBQUEsUUFFaEJFLE9BRmdCLEdBRUxGLEtBRkssQ0FFaEJFLE1BRmdCOztBQUd4QixRQUFNQyxRQUFPRCxVQUFTLENBQXRCO0FBQ0Esd0JBQ0tKLEVBREw7QUFFRUMsWUFBTSxZQUZSO0FBR0VDLFlBQU1BLE1BQUtJLEtBQUwsQ0FBVyxDQUFYLEVBQWNELEtBQWQsRUFBb0JFLE1BQXBCLENBQTJCLENBQUNMLE1BQUtHLEtBQUwsSUFBYSxDQUFkLENBQTNCO0FBSFI7QUFLRDs7QUFFRDs7OztBQUlBLE1BQUlKLFFBQVEsVUFBWixFQUF3QjtBQUFBLFFBQ2RPLFVBRGMsR0FDT1IsRUFEUCxDQUNkUSxVQURjO0FBQUEsUUFDRkMsSUFERSxHQUNPVCxFQURQLENBQ0ZTLElBREU7O0FBRXRCLHdCQUNLVCxFQURMO0FBRUVTLFlBQU1BLEtBQUtDLEtBQUwsQ0FBV0YsVUFBWCxDQUZSO0FBR0VBLGtCQUFZLG9CQUFLQyxJQUFMLEVBQVdFLE9BQU9DLElBQVAsQ0FBWUosVUFBWixDQUFYO0FBSGQ7QUFLRDs7QUFFRDs7OztBQUlBLE1BQUlQLFFBQVEsYUFBWixFQUEyQjtBQUN6Qix3QkFDS0QsRUFETDtBQUVFQyxZQUFNO0FBRlI7QUFJRDs7QUFFRDs7OztBQUlBLE1BQUlBLFFBQVEsYUFBWixFQUEyQjtBQUN6Qix3QkFDS0QsRUFETDtBQUVFQyxZQUFNO0FBRlI7QUFJRDs7QUFFRDs7OztBQUlBLE1BQUlBLFFBQVEsVUFBWixFQUF3QjtBQUN0Qix3QkFDS0QsRUFETDtBQUVFQyxZQUFNO0FBRlI7QUFJRDs7QUFFRDs7OztBQUlBLE1BQUlBLFFBQVEsYUFBWixFQUEyQjtBQUN6Qix3QkFDS0QsRUFETDtBQUVFQyxZQUFNO0FBRlI7QUFJRDs7QUFFRDs7OztBQUlBLE1BQUlBLFFBQVEsVUFBWixFQUF3QjtBQUFBLFFBQ2RPLFdBRGMsR0FDT1IsRUFEUCxDQUNkUSxVQURjO0FBQUEsUUFDRkssSUFERSxHQUNPYixFQURQLENBQ0ZhLElBREU7O0FBRXRCLHdCQUNLYixFQURMO0FBRUVhLFlBQU1BLEtBQUtILEtBQUwsQ0FBV0YsV0FBWCxDQUZSO0FBR0VBLGtCQUFZLG9CQUFLSyxJQUFMLEVBQVdGLE9BQU9DLElBQVAsQ0FBWUosV0FBWixDQUFYO0FBSGQ7QUFLRDs7QUFFRDs7OztBQUlBLE1BQUlQLFFBQVEsZUFBWixFQUE2QjtBQUFBLFFBQ25CTyxZQURtQixHQUNPUixFQURQLENBQ25CUSxVQURtQjtBQUFBLFFBQ1BNLFNBRE8sR0FDT2QsRUFEUCxDQUNQYyxTQURPOztBQUUzQixRQUFNQyx1QkFDRGYsRUFEQztBQUVKYyw4QkFBZ0JBLFNBQWhCLEVBQThCTixZQUE5QixDQUZJO0FBR0pBLGtCQUFZLG9CQUFLTSxTQUFMLEVBQWdCSCxPQUFPQyxJQUFQLENBQVlKLFlBQVosQ0FBaEI7QUFIUixNQUFOOztBQU1BLFdBQU9PLE9BQVA7QUFDRDs7QUFFRDs7OztBQUlBLE1BQUlkLFFBQVEsVUFBWixFQUF3QjtBQUFBLFFBQ2RPLFlBRGMsR0FDT1IsRUFEUCxDQUNkUSxVQURjO0FBQUEsUUFDRlEsSUFERSxHQUNPaEIsRUFEUCxDQUNGZ0IsSUFERTs7QUFFdEIsd0JBQ0toQixFQURMO0FBRUVnQixZQUFNQSxLQUFLTixLQUFMLENBQVdGLFlBQVgsQ0FGUjtBQUdFQSxrQkFBWSxvQkFBS1EsSUFBTCxFQUFXTCxPQUFPQyxJQUFQLENBQVlKLFlBQVosQ0FBWDtBQUhkO0FBS0Q7O0FBRUQ7Ozs7QUFJQSxRQUFNLElBQUlTLEtBQUosd0JBQStCaEIsSUFBL0IsUUFBTjtBQUNEOztBQUVEOzs7Ozs7a0JBTWVGLGUiLCJmaWxlIjoiaW52ZXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgcGljayBmcm9tICdsb2Rhc2gvcGljaydcblxuLyoqXG4gKiBEZWJ1Zy5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuY29uc3QgZGVidWcgPSBEZWJ1Zygnc2xhdGU6b3BlcmF0aW9uOmludmVydCcpXG5cbi8qKlxuICogSW52ZXJ0IGFuIGBvcGAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gaW52ZXJ0T3BlcmF0aW9uKG9wKSB7XG4gIGNvbnN0IHsgdHlwZSB9ID0gb3BcbiAgZGVidWcodHlwZSwgb3ApXG5cbiAgLyoqXG4gICAqIEluc2VydCBub2RlLlxuICAgKi9cblxuICBpZiAodHlwZSA9PSAnaW5zZXJ0X25vZGUnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wLFxuICAgICAgdHlwZTogJ3JlbW92ZV9ub2RlJyxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG5vZGUuXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdyZW1vdmVfbm9kZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3AsXG4gICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIG5vZGUuXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdtb3ZlX25vZGUnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wLFxuICAgICAgcGF0aDogb3AubmV3UGF0aCxcbiAgICAgIG5ld1BhdGg6IG9wLnBhdGgsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIG5vZGUuXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdtZXJnZV9ub2RlJykge1xuICAgIGNvbnN0IHsgcGF0aCB9ID0gb3BcbiAgICBjb25zdCB7IGxlbmd0aCB9ID0gcGF0aFxuICAgIGNvbnN0IGxhc3QgPSBsZW5ndGggLSAxXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wLFxuICAgICAgdHlwZTogJ3NwbGl0X25vZGUnLFxuICAgICAgcGF0aDogcGF0aC5zbGljZSgwLCBsYXN0KS5jb25jYXQoW3BhdGhbbGFzdF0gLSAxXSksXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0IG5vZGUuXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdzcGxpdF9ub2RlJykge1xuICAgIGNvbnN0IHsgcGF0aCB9ID0gb3BcbiAgICBjb25zdCB7IGxlbmd0aCB9ID0gcGF0aFxuICAgIGNvbnN0IGxhc3QgPSBsZW5ndGggLSAxXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wLFxuICAgICAgdHlwZTogJ21lcmdlX25vZGUnLFxuICAgICAgcGF0aDogcGF0aC5zbGljZSgwLCBsYXN0KS5jb25jYXQoW3BhdGhbbGFzdF0gKyAxXSksXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBub2RlLlxuICAgKi9cblxuICBpZiAodHlwZSA9PSAnc2V0X25vZGUnKSB7XG4gICAgY29uc3QgeyBwcm9wZXJ0aWVzLCBub2RlIH0gPSBvcFxuICAgIHJldHVybiB7XG4gICAgICAuLi5vcCxcbiAgICAgIG5vZGU6IG5vZGUubWVyZ2UocHJvcGVydGllcyksXG4gICAgICBwcm9wZXJ0aWVzOiBwaWNrKG5vZGUsIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpKSxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IHRleHQuXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdpbnNlcnRfdGV4dCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3AsXG4gICAgICB0eXBlOiAncmVtb3ZlX3RleHQnLFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGV4dC5cbiAgICovXG5cbiAgaWYgKHR5cGUgPT0gJ3JlbW92ZV90ZXh0Jykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcCxcbiAgICAgIHR5cGU6ICdpbnNlcnRfdGV4dCcsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtYXJrLlxuICAgKi9cblxuICBpZiAodHlwZSA9PSAnYWRkX21hcmsnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wLFxuICAgICAgdHlwZTogJ3JlbW92ZV9tYXJrJyxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG1hcmsuXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdyZW1vdmVfbWFyaycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3AsXG4gICAgICB0eXBlOiAnYWRkX21hcmsnLFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgbWFyay5cbiAgICovXG5cbiAgaWYgKHR5cGUgPT0gJ3NldF9tYXJrJykge1xuICAgIGNvbnN0IHsgcHJvcGVydGllcywgbWFyayB9ID0gb3BcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3AsXG4gICAgICBtYXJrOiBtYXJrLm1lcmdlKHByb3BlcnRpZXMpLFxuICAgICAgcHJvcGVydGllczogcGljayhtYXJrLCBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSksXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBzZWxlY3Rpb24uXG4gICAqL1xuXG4gIGlmICh0eXBlID09ICdzZXRfc2VsZWN0aW9uJykge1xuICAgIGNvbnN0IHsgcHJvcGVydGllcywgc2VsZWN0aW9uIH0gPSBvcFxuICAgIGNvbnN0IGludmVyc2UgPSB7XG4gICAgICAuLi5vcCxcbiAgICAgIHNlbGVjdGlvbjogeyAuLi5zZWxlY3Rpb24sIC4uLnByb3BlcnRpZXMgfSxcbiAgICAgIHByb3BlcnRpZXM6IHBpY2soc2VsZWN0aW9uLCBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSksXG4gICAgfVxuXG4gICAgcmV0dXJuIGludmVyc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgZGF0YS5cbiAgICovXG5cbiAgaWYgKHR5cGUgPT0gJ3NldF9kYXRhJykge1xuICAgIGNvbnN0IHsgcHJvcGVydGllcywgZGF0YSB9ID0gb3BcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3AsXG4gICAgICBkYXRhOiBkYXRhLm1lcmdlKHByb3BlcnRpZXMpLFxuICAgICAgcHJvcGVydGllczogcGljayhkYXRhLCBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSksXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVua25vd24uXG4gICAqL1xuXG4gIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBvcCB0eXBlOiBcIiR7dHlwZX1cIi5gKVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgaW52ZXJ0T3BlcmF0aW9uXG4iXX0=