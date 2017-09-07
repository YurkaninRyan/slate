'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Placeholder.
 *
 * @type {Component}
 */

var Placeholder = function (_React$Component) {
  _inherits(Placeholder, _React$Component);

  function Placeholder() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Placeholder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Placeholder.__proto__ || Object.getPrototypeOf(Placeholder)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = function (props, state) {
      return props.children != _this.props.children || props.className != _this.props.className || props.firstOnly != _this.props.firstOnly || props.parent != _this.props.parent || props.node != _this.props.node || props.style != _this.props.style;
    }, _this.isVisible = function () {
      var _this$props = _this.props,
          firstOnly = _this$props.firstOnly,
          node = _this$props.node,
          parent = _this$props.parent;

      if (node.text) return false;

      if (firstOnly) {
        if (parent.nodes.size > 1) return false;
        if (parent.nodes.first() === node) return true;
        return false;
      } else {
        return true;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Property types.
   *
   * @type {Object}
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * Should the placeholder update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  /**
   * Is the placeholder visible?
   *
   * @return {Boolean}
   */

  _createClass(Placeholder, [{
    key: 'render',


    /**
     * Render.
     *
     * If the placeholder is a string, and no `className` or `style` has been
     * passed, give it a default style of lowered opacity.
     *
     * @return {Element}
     */

    value: function render() {
      var isVisible = this.isVisible();
      if (!isVisible) return null;

      var _props = this.props,
          children = _props.children,
          className = _props.className;
      var style = this.props.style;


      if (typeof children === 'string' && style == null && className == null) {
        style = { opacity: '0.333' };
      } else if (style == null) {
        style = {};
      }

      var styles = _extends({
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        pointerEvents: 'none'
      }, style);

      return _react2.default.createElement(
        'span',
        { contentEditable: false, className: className, style: styles },
        children
      );
    }
  }]);

  return Placeholder;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Placeholder.propTypes = {
  children: _propTypes2.default.any.isRequired,
  className: _propTypes2.default.string,
  firstOnly: _propTypes2.default.bool,
  node: _propTypes4.default.node.isRequired,
  parent: _propTypes4.default.node,
  state: _propTypes4.default.state.isRequired,
  style: _propTypes2.default.object };
Placeholder.defaultProps = {
  firstOnly: true };
exports.default = Placeholder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3BsYWNlaG9sZGVyLmpzIl0sIm5hbWVzIjpbIlBsYWNlaG9sZGVyIiwic2hvdWxkQ29tcG9uZW50VXBkYXRlIiwicHJvcHMiLCJzdGF0ZSIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwiZmlyc3RPbmx5IiwicGFyZW50Iiwibm9kZSIsInN0eWxlIiwiaXNWaXNpYmxlIiwidGV4dCIsIm5vZGVzIiwic2l6ZSIsImZpcnN0Iiwib3BhY2l0eSIsInN0eWxlcyIsInBvc2l0aW9uIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicG9pbnRlckV2ZW50cyIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImFueSIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJib29sIiwib2JqZWN0IiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0lBTU1BLFc7Ozs7Ozs7Ozs7Ozs7O2dNQW9DSkMscUIsR0FBd0IsVUFBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQ3hDLGFBQ0VELE1BQU1FLFFBQU4sSUFBa0IsTUFBS0YsS0FBTCxDQUFXRSxRQUE3QixJQUNBRixNQUFNRyxTQUFOLElBQW1CLE1BQUtILEtBQUwsQ0FBV0csU0FEOUIsSUFFQUgsTUFBTUksU0FBTixJQUFtQixNQUFLSixLQUFMLENBQVdJLFNBRjlCLElBR0FKLE1BQU1LLE1BQU4sSUFBZ0IsTUFBS0wsS0FBTCxDQUFXSyxNQUgzQixJQUlBTCxNQUFNTSxJQUFOLElBQWMsTUFBS04sS0FBTCxDQUFXTSxJQUp6QixJQUtBTixNQUFNTyxLQUFOLElBQWUsTUFBS1AsS0FBTCxDQUFXTyxLQU41QjtBQVFELEssUUFRREMsUyxHQUFZLFlBQU07QUFBQSx3QkFDb0IsTUFBS1IsS0FEekI7QUFBQSxVQUNSSSxTQURRLGVBQ1JBLFNBRFE7QUFBQSxVQUNHRSxJQURILGVBQ0dBLElBREg7QUFBQSxVQUNTRCxNQURULGVBQ1NBLE1BRFQ7O0FBRWhCLFVBQUlDLEtBQUtHLElBQVQsRUFBZSxPQUFPLEtBQVA7O0FBRWYsVUFBSUwsU0FBSixFQUFlO0FBQ2IsWUFBSUMsT0FBT0ssS0FBUCxDQUFhQyxJQUFiLEdBQW9CLENBQXhCLEVBQTJCLE9BQU8sS0FBUDtBQUMzQixZQUFJTixPQUFPSyxLQUFQLENBQWFFLEtBQWIsT0FBeUJOLElBQTdCLEVBQW1DLE9BQU8sSUFBUDtBQUNuQyxlQUFPLEtBQVA7QUFDRCxPQUpELE1BSU87QUFDTCxlQUFPLElBQVA7QUFDRDtBQUNGLEs7OztBQTlERDs7Ozs7O0FBZ0JBOzs7Ozs7QUFVQTs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs2QkFTUztBQUNQLFVBQU1FLFlBQVksS0FBS0EsU0FBTCxFQUFsQjtBQUNBLFVBQUksQ0FBQ0EsU0FBTCxFQUFnQixPQUFPLElBQVA7O0FBRlQsbUJBSXlCLEtBQUtSLEtBSjlCO0FBQUEsVUFJQ0UsUUFKRCxVQUlDQSxRQUpEO0FBQUEsVUFJV0MsU0FKWCxVQUlXQSxTQUpYO0FBQUEsVUFLREksS0FMQyxHQUtTLEtBQUtQLEtBTGQsQ0FLRE8sS0FMQzs7O0FBT1AsVUFBSSxPQUFPTCxRQUFQLEtBQW9CLFFBQXBCLElBQWdDSyxTQUFTLElBQXpDLElBQWlESixhQUFhLElBQWxFLEVBQXdFO0FBQ3RFSSxnQkFBUSxFQUFFTSxTQUFTLE9BQVgsRUFBUjtBQUNELE9BRkQsTUFFTyxJQUFJTixTQUFTLElBQWIsRUFBbUI7QUFDeEJBLGdCQUFRLEVBQVI7QUFDRDs7QUFFRCxVQUFNTztBQUNKQyxrQkFBVSxVQUROO0FBRUpDLGFBQUssS0FGRDtBQUdKQyxlQUFPLEtBSEg7QUFJSkMsZ0JBQVEsS0FKSjtBQUtKQyxjQUFNLEtBTEY7QUFNSkMsdUJBQWU7QUFOWCxTQU9EYixLQVBDLENBQU47O0FBVUEsYUFDRTtBQUFBO0FBQUEsVUFBTSxpQkFBaUIsS0FBdkIsRUFBOEIsV0FBV0osU0FBekMsRUFBb0QsT0FBT1csTUFBM0Q7QUFDR1o7QUFESCxPQURGO0FBS0Q7Ozs7RUF2R3VCLGdCQUFNbUIsUzs7QUEyR2hDOzs7Ozs7QUEzR012QixXLENBUUd3QixTLEdBQVk7QUFDakJwQixZQUFVLG9CQUFNcUIsR0FBTixDQUFVQyxVQURIO0FBRWpCckIsYUFBVyxvQkFBTXNCLE1BRkE7QUFHakJyQixhQUFXLG9CQUFNc0IsSUFIQTtBQUlqQnBCLFFBQU0sb0JBQVdBLElBQVgsQ0FBZ0JrQixVQUpMO0FBS2pCbkIsVUFBUSxvQkFBV0MsSUFMRjtBQU1qQkwsU0FBTyxvQkFBV0EsS0FBWCxDQUFpQnVCLFVBTlA7QUFPakJqQixTQUFPLG9CQUFNb0IsTUFQSSxFO0FBUmY3QixXLENBd0JHOEIsWSxHQUFlO0FBQ3BCeEIsYUFBVyxJQURTLEU7a0JBeUZUTixXIiwiZmlsZSI6InBsYWNlaG9sZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgVHlwZXMgZnJvbSAncHJvcC10eXBlcydcblxuaW1wb3J0IFNsYXRlVHlwZXMgZnJvbSAnLi4vdXRpbHMvcHJvcC10eXBlcydcblxuLyoqXG4gKiBQbGFjZWhvbGRlci5cbiAqXG4gKiBAdHlwZSB7Q29tcG9uZW50fVxuICovXG5cbmNsYXNzIFBsYWNlaG9sZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAvKipcbiAgICogUHJvcGVydHkgdHlwZXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFR5cGVzLmFueS5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogVHlwZXMuc3RyaW5nLFxuICAgIGZpcnN0T25seTogVHlwZXMuYm9vbCxcbiAgICBub2RlOiBTbGF0ZVR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcbiAgICBwYXJlbnQ6IFNsYXRlVHlwZXMubm9kZSxcbiAgICBzdGF0ZTogU2xhdGVUeXBlcy5zdGF0ZS5pc1JlcXVpcmVkLFxuICAgIHN0eWxlOiBUeXBlcy5vYmplY3QsXG4gIH1cblxuICAvKipcbiAgICogRGVmYXVsdCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGZpcnN0T25seTogdHJ1ZSxcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgdGhlIHBsYWNlaG9sZGVyIHVwZGF0ZT9cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUgPSAocHJvcHMsIHN0YXRlKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHByb3BzLmNoaWxkcmVuICE9IHRoaXMucHJvcHMuY2hpbGRyZW4gfHxcbiAgICAgIHByb3BzLmNsYXNzTmFtZSAhPSB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fFxuICAgICAgcHJvcHMuZmlyc3RPbmx5ICE9IHRoaXMucHJvcHMuZmlyc3RPbmx5IHx8XG4gICAgICBwcm9wcy5wYXJlbnQgIT0gdGhpcy5wcm9wcy5wYXJlbnQgfHxcbiAgICAgIHByb3BzLm5vZGUgIT0gdGhpcy5wcm9wcy5ub2RlIHx8XG4gICAgICBwcm9wcy5zdHlsZSAhPSB0aGlzLnByb3BzLnN0eWxlXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIElzIHRoZSBwbGFjZWhvbGRlciB2aXNpYmxlP1xuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBpc1Zpc2libGUgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBmaXJzdE9ubHksIG5vZGUsIHBhcmVudCB9ID0gdGhpcy5wcm9wc1xuICAgIGlmIChub2RlLnRleHQpIHJldHVybiBmYWxzZVxuXG4gICAgaWYgKGZpcnN0T25seSkge1xuICAgICAgaWYgKHBhcmVudC5ub2Rlcy5zaXplID4gMSkgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAocGFyZW50Lm5vZGVzLmZpcnN0KCkgPT09IG5vZGUpIHJldHVybiB0cnVlXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyLlxuICAgKlxuICAgKiBJZiB0aGUgcGxhY2Vob2xkZXIgaXMgYSBzdHJpbmcsIGFuZCBubyBgY2xhc3NOYW1lYCBvciBgc3R5bGVgIGhhcyBiZWVuXG4gICAqIHBhc3NlZCwgZ2l2ZSBpdCBhIGRlZmF1bHQgc3R5bGUgb2YgbG93ZXJlZCBvcGFjaXR5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNWaXNpYmxlID0gdGhpcy5pc1Zpc2libGUoKVxuICAgIGlmICghaXNWaXNpYmxlKSByZXR1cm4gbnVsbFxuXG4gICAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH0gPSB0aGlzLnByb3BzXG4gICAgbGV0IHsgc3R5bGUgfSA9IHRoaXMucHJvcHNcblxuICAgIGlmICh0eXBlb2YgY2hpbGRyZW4gPT09ICdzdHJpbmcnICYmIHN0eWxlID09IG51bGwgJiYgY2xhc3NOYW1lID09IG51bGwpIHtcbiAgICAgIHN0eWxlID0geyBvcGFjaXR5OiAnMC4zMzMnIH1cbiAgICB9IGVsc2UgaWYgKHN0eWxlID09IG51bGwpIHtcbiAgICAgIHN0eWxlID0ge31cbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZXMgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogJzBweCcsXG4gICAgICByaWdodDogJzBweCcsXG4gICAgICBib3R0b206ICcwcHgnLFxuICAgICAgbGVmdDogJzBweCcsXG4gICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAuLi5zdHlsZVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjb250ZW50RWRpdGFibGU9e2ZhbHNlfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3N0eWxlc30+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7Q29tcG9uZW50fVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlaG9sZGVyXG4iXX0=