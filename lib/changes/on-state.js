'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Set the `isNative` flag on the underlying state to prevent re-renders.
 *
 * @param {Change} change
 * @param {Boolean} value
 */

Changes.setIsNative = function (change, value) {
  var state = change.state;

  state = state.set('isNative', value);
  change.state = state;
};

/**
 * Set `properties` on the top-level state's data.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.setData = function (change, properties) {
  var state = change.state;
  var data = state.data;


  change.applyOperation({
    type: 'set_data',
    properties: properties,
    data: data
  });
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFuZ2VzL29uLXN0YXRlLmpzIl0sIm5hbWVzIjpbIkNoYW5nZXMiLCJzZXRJc05hdGl2ZSIsImNoYW5nZSIsInZhbHVlIiwic3RhdGUiLCJzZXQiLCJzZXREYXRhIiwicHJvcGVydGllcyIsImRhdGEiLCJhcHBseU9wZXJhdGlvbiIsInR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7Ozs7QUFNQSxJQUFNQSxVQUFVLEVBQWhCOztBQUVBOzs7Ozs7O0FBT0FBLFFBQVFDLFdBQVIsR0FBc0IsVUFBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQW1CO0FBQUEsTUFDakNDLEtBRGlDLEdBQ3ZCRixNQUR1QixDQUNqQ0UsS0FEaUM7O0FBRXZDQSxVQUFRQSxNQUFNQyxHQUFOLENBQVUsVUFBVixFQUFzQkYsS0FBdEIsQ0FBUjtBQUNBRCxTQUFPRSxLQUFQLEdBQWVBLEtBQWY7QUFDRCxDQUpEOztBQU1BOzs7Ozs7O0FBT0FKLFFBQVFNLE9BQVIsR0FBa0IsVUFBQ0osTUFBRCxFQUFTSyxVQUFULEVBQXdCO0FBQUEsTUFDaENILEtBRGdDLEdBQ3RCRixNQURzQixDQUNoQ0UsS0FEZ0M7QUFBQSxNQUVoQ0ksSUFGZ0MsR0FFdkJKLEtBRnVCLENBRWhDSSxJQUZnQzs7O0FBSXhDTixTQUFPTyxjQUFQLENBQXNCO0FBQ3BCQyxVQUFNLFVBRGM7QUFFcEJILDBCQUZvQjtBQUdwQkM7QUFIb0IsR0FBdEI7QUFLRCxDQVREOztBQVdBOzs7Ozs7a0JBTWVSLE8iLCJmaWxlIjoib24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQ2hhbmdlcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IENoYW5nZXMgPSB7fVxuXG4vKipcbiAqIFNldCB0aGUgYGlzTmF0aXZlYCBmbGFnIG9uIHRoZSB1bmRlcmx5aW5nIHN0YXRlIHRvIHByZXZlbnQgcmUtcmVuZGVycy5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlXG4gKi9cblxuQ2hhbmdlcy5zZXRJc05hdGl2ZSA9IChjaGFuZ2UsIHZhbHVlKSA9PiB7XG4gIGxldCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgc3RhdGUgPSBzdGF0ZS5zZXQoJ2lzTmF0aXZlJywgdmFsdWUpXG4gIGNoYW5nZS5zdGF0ZSA9IHN0YXRlXG59XG5cbi8qKlxuICogU2V0IGBwcm9wZXJ0aWVzYCBvbiB0aGUgdG9wLWxldmVsIHN0YXRlJ3MgZGF0YS5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xuICovXG5cbkNoYW5nZXMuc2V0RGF0YSA9IChjaGFuZ2UsIHByb3BlcnRpZXMpID0+IHtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZGF0YSB9ID0gc3RhdGVcblxuICBjaGFuZ2UuYXBwbHlPcGVyYXRpb24oe1xuICAgIHR5cGU6ICdzZXRfZGF0YScsXG4gICAgcHJvcGVydGllcyxcbiAgICBkYXRhLFxuICB9KVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZXNcbiJdfQ==