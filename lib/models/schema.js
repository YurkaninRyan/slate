'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isReactComponent = require('../utils/is-react-component');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  rules: []

  /**
   * Schema.
   *
   * @type {Schema}
   */

};
var Schema = function (_Record) {
  _inherits(Schema, _Record);

  function Schema() {
    _classCallCheck(this, Schema);

    return _possibleConstructorReturn(this, (Schema.__proto__ || Object.getPrototypeOf(Schema)).apply(this, arguments));
  }

  _createClass(Schema, [{
    key: '__getComponent',


    /**
     * Return the renderer for an `object`.
     *
     * This method is private, because it should always be called on one of the
     * often-changing immutable objects instead, since it will be memoized for
     * much better performance.
     *
     * @param {Mixed} object
     * @return {Component|Void}
     */

    value: function __getComponent(object) {
      var match = (0, _find2.default)(this.rules, function (rule) {
        return rule.render && rule.match(object);
      });
      if (!match) return;
      return match.render;
    }

    /**
     * Return the decorators for an `object`.
     *
     * This method is private, because it should always be called on one of the
     * often-changing immutable objects instead, since it will be memoized for
     * much better performance.
     *
     * @param {Mixed} object
     * @return {Array}
     */

  }, {
    key: '__getDecorators',
    value: function __getDecorators(object) {
      return this.rules.filter(function (rule) {
        return rule.decorate && rule.match(object);
      }).map(function (rule) {
        return function (text) {
          return rule.decorate(text, object);
        };
      });
    }

    /**
     * Validate an `object` against the schema, returning the failing rule and
     * value if the object is invalid, or void if it's valid.
     *
     * This method is private, because it should always be called on one of the
     * often-changing immutable objects instead, since it will be memoized for
     * much better performance.
     *
     * @param {Mixed} object
     * @return {Object|Void}
     */

  }, {
    key: '__validate',
    value: function __validate(object) {
      var value = void 0;

      var match = (0, _find2.default)(this.rules, function (rule) {
        if (!rule.validate) return;
        if (!rule.match(object)) return;

        value = rule.validate(object);
        return value;
      });

      if (!value) return;

      return {
        rule: match,
        value: value
      };
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'schema';
    }

    /**
     * Return true if one rule can normalize the document
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasValidators',
    get: function get() {
      var rules = this.rules;

      return rules.some(function (rule) {
        return rule.validate;
      });
    }

    /**
     * Return true if one rule can decorate text nodes
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasDecorators',
    get: function get() {
      var rules = this.rules;

      return rules.some(function (rule) {
        return rule.decorate;
      });
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Schema` with `attrs`.
     *
     * @param {Object|Schema} attrs
     * @return {Schema}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Schema.isSchema(attrs)) {
        return attrs;
      }

      if ((0, _isPlainObject2.default)(attrs)) {
        var schema = new Schema(normalizeProperties(attrs));
        return schema;
      }

      throw new Error('`Schema.create` only accepts objects or schemas, but you passed it: ' + attrs);
    }

    /**
     * Check if a `value` is a `Schema`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isSchema',
    value: function isSchema(value) {
      return !!(value && value[_modelTypes2.default.SCHEMA]);
    }
  }]);

  return Schema;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Normalize the `properties` of a schema.
 *
 * @param {Object} properties
 * @return {Object}
 */

function normalizeProperties(properties) {
  var _properties$rules = properties.rules,
      rules = _properties$rules === undefined ? [] : _properties$rules,
      nodes = properties.nodes,
      marks = properties.marks;


  if (nodes) {
    var array = normalizeNodes(nodes);
    rules = rules.concat(array);
  }

  if (marks) {
    var _array = normalizeMarks(marks);
    rules = rules.concat(_array);
  }

  if (properties.transform) {
    _logger2.default.deprecate('0.22.0', 'The `schema.transform` property has been deprecated in favor of `schema.change`.');
    properties.change = properties.transform;
    delete properties.transform;
  }

  return { rules: rules };
}

/**
 * Normalize a `nodes` shorthand argument.
 *
 * @param {Object} nodes
 * @return {Array}
 */

function normalizeNodes(nodes) {
  var rules = [];

  var _loop = function _loop(key) {
    var rule = nodes[key];

    if ((0, _typeOf2.default)(rule) == 'function' || (0, _isReactComponent2.default)(rule)) {
      rule = { render: rule };
    }

    rule.match = function (object) {
      return (object.kind == 'block' || object.kind == 'inline') && object.type == key;
    };

    rules.push(rule);
  };

  for (var key in nodes) {
    _loop(key);
  }

  return rules;
}

/**
 * Normalize a `marks` shorthand argument.
 *
 * @param {Object} marks
 * @return {Array}
 */

function normalizeMarks(marks) {
  var rules = [];

  var _loop2 = function _loop2(key) {
    var rule = marks[key];

    if (!rule.render && !rule.decorator && !rule.validate) {
      rule = { render: rule };
    }

    rule.render = normalizeMarkComponent(rule.render);
    rule.match = function (object) {
      return object.kind == 'mark' && object.type == key;
    };
    rules.push(rule);
  };

  for (var key in marks) {
    _loop2(key);
  }

  return rules;
}

/**
 * Normalize a mark `render` property.
 *
 * @param {Component|Function|Object|String} render
 * @return {Component}
 */

function normalizeMarkComponent(render) {
  if ((0, _isReactComponent2.default)(render)) return render;

  switch ((0, _typeOf2.default)(render)) {
    case 'function':
      return render;
    case 'object':
      return function (props) {
        return _react2.default.createElement(
          'span',
          { style: render },
          props.children
        );
      };
    case 'string':
      return function (props) {
        return _react2.default.createElement(
          'span',
          { className: render },
          props.children
        );
      };
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Schema.prototype[_modelTypes2.default.SCHEMA] = true;

/**
 * Export.
 *
 * @type {Schema}
 */

exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc2NoZW1hLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRTIiwicnVsZXMiLCJTY2hlbWEiLCJvYmplY3QiLCJtYXRjaCIsInJ1bGUiLCJyZW5kZXIiLCJmaWx0ZXIiLCJkZWNvcmF0ZSIsIm1hcCIsInRleHQiLCJ2YWx1ZSIsInZhbGlkYXRlIiwic29tZSIsImF0dHJzIiwiaXNTY2hlbWEiLCJzY2hlbWEiLCJub3JtYWxpemVQcm9wZXJ0aWVzIiwiRXJyb3IiLCJTQ0hFTUEiLCJwcm9wZXJ0aWVzIiwibm9kZXMiLCJtYXJrcyIsImFycmF5Iiwibm9ybWFsaXplTm9kZXMiLCJjb25jYXQiLCJub3JtYWxpemVNYXJrcyIsInRyYW5zZm9ybSIsImRlcHJlY2F0ZSIsImNoYW5nZSIsImtleSIsImtpbmQiLCJ0eXBlIiwicHVzaCIsImRlY29yYXRvciIsIm5vcm1hbGl6ZU1hcmtDb21wb25lbnQiLCJwcm9wcyIsImNoaWxkcmVuIiwicHJvdG90eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsV0FBVztBQUNmQyxTQUFPOztBQUdUOzs7Ozs7QUFKaUIsQ0FBakI7SUFVTUMsTTs7Ozs7Ozs7Ozs7OztBQWlFSjs7Ozs7Ozs7Ozs7bUNBV2VDLE0sRUFBUTtBQUNyQixVQUFNQyxRQUFRLG9CQUFLLEtBQUtILEtBQVYsRUFBaUI7QUFBQSxlQUFRSSxLQUFLQyxNQUFMLElBQWVELEtBQUtELEtBQUwsQ0FBV0QsTUFBWCxDQUF2QjtBQUFBLE9BQWpCLENBQWQ7QUFDQSxVQUFJLENBQUNDLEtBQUwsRUFBWTtBQUNaLGFBQU9BLE1BQU1FLE1BQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7OztvQ0FXZ0JILE0sRUFBUTtBQUN0QixhQUFPLEtBQUtGLEtBQUwsQ0FDSk0sTUFESSxDQUNHO0FBQUEs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bEQ7QUFBQSxLQUFiO0FBQ0E3QixVQUFNZ0MsSUFBTixDQUFXNUIsSUFBWDtBQVoyQjs7QUFHN0IsT0FBSyxJQUFNeUIsR0FBWCxJQUFrQlIsS0FBbEIsRUFBeUI7QUFBQSxXQUFkUSxHQUFjO0FBVXhCOztBQUVELFNBQU83QixLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTa0Msc0JBQVQsQ0FBZ0M3QixNQUFoQyxFQUF3QztBQUN0QyxNQUFJLGdDQUFpQkEsTUFBakIsQ0FBSixFQUE4QixPQUFPQSxNQUFQOztBQUU5QixVQUFRLHNCQUFPQSxNQUFQLENBQVI7QUFDRSxTQUFLLFVBQUw7QUFDRSxhQUFPQSxNQUFQO0FBQ0YsU0FBSyxRQUFMO0FBQ0UsYUFBTztBQUFBLGVBQVM7QUFBQTtBQUFBLFlBQU0sT0FBT0EsTUFBYjtBQUFzQjhCLGdCQUFNQztBQUE1QixTQUFUO0FBQUEsT0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU87QUFBQSxlQUFTO0FBQUE7QUFBQSxZQUFNLFdBQVcvQixNQUFqQjtBQUEwQjhCLGdCQUFNQztBQUFoQyxTQUFUO0FBQUEsT0FBUDtBQU5KO0FBUUQ7O0FBRUQ7Ozs7QUFJQW5DLE9BQU9vQyxTQUFQLENBQWlCLHFCQUFZbkIsTUFBN0IsSUFBdUMsSUFBdkM7O0FBRUE7Ozs7OztrQkFNZWpCLE0iLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi4vY29uc3RhbnRzL21vZGVsLXR5cGVzJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGZpbmQgZnJvbSAnbG9kYXNoL2ZpbmQnXG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdpcy1wbGFpbi1vYmplY3QnXG5pbXBvcnQgaXNSZWFjdENvbXBvbmVudCBmcm9tICcuLi91dGlscy9pcy1yZWFjdC1jb21wb25lbnQnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcidcbmltcG9ydCB0eXBlT2YgZnJvbSAndHlwZS1vZidcbmltcG9ydCB7IFJlY29yZCB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBEZWZhdWx0IHByb3BlcnRpZXMuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcnVsZXM6IFtdLFxufVxuXG4vKipcbiAqIFNjaGVtYS5cbiAqXG4gKiBAdHlwZSB7U2NoZW1hfVxuICovXG5cbmNsYXNzIFNjaGVtYSBleHRlbmRzIFJlY29yZChERUZBVUxUUykge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYFNjaGVtYWAgd2l0aCBgYXR0cnNgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTY2hlbWF9IGF0dHJzXG4gICAqIEByZXR1cm4ge1NjaGVtYX1cbiAgICovXG5cbiAgc3RhdGljIGNyZWF0ZShhdHRycyA9IHt9KSB7XG4gICAgaWYgKFNjaGVtYS5pc1NjaGVtYShhdHRycykpIHtcbiAgICAgIHJldHVybiBhdHRyc1xuICAgIH1cblxuICAgIGlmIChpc1BsYWluT2JqZWN0KGF0dHJzKSkge1xuICAgICAgY29uc3Qgc2NoZW1hID0gbmV3IFNjaGVtYShub3JtYWxpemVQcm9wZXJ0aWVzKGF0dHJzKSlcbiAgICAgIHJldHVybiBzY2hlbWFcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYFNjaGVtYS5jcmVhdGVcXGAgb25seSBhY2NlcHRzIG9iamVjdHMgb3Igc2NoZW1hcywgYnV0IHlvdSBwYXNzZWQgaXQ6ICR7YXR0cnN9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGB2YWx1ZWAgaXMgYSBgU2NoZW1hYC5cbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIHN0YXRpYyBpc1NjaGVtYSh2YWx1ZSkge1xuICAgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZVtNT0RFTF9UWVBFUy5TQ0hFTUFdKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUga2luZC5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cblxuICBnZXQga2luZCgpIHtcbiAgICByZXR1cm4gJ3NjaGVtYSdcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdHJ1ZSBpZiBvbmUgcnVsZSBjYW4gbm9ybWFsaXplIHRoZSBkb2N1bWVudFxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cblxuICBnZXQgaGFzVmFsaWRhdG9ycygpIHtcbiAgICBjb25zdCB7IHJ1bGVzIH0gPSB0aGlzXG4gICAgcmV0dXJuIHJ1bGVzLnNvbWUocnVsZSA9PiBydWxlLnZhbGlkYXRlKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0cnVlIGlmIG9uZSBydWxlIGNhbiBkZWNvcmF0ZSB0ZXh0IG5vZGVzXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGdldCBoYXNEZWNvcmF0b3JzKCkge1xuICAgIGNvbnN0IHsgcnVsZXMgfSA9IHRoaXNcbiAgICByZXR1cm4gcnVsZXMuc29tZShydWxlID0+IHJ1bGUuZGVjb3JhdGUpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSByZW5kZXJlciBmb3IgYW4gYG9iamVjdGAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHByaXZhdGUsIGJlY2F1c2UgaXQgc2hvdWxkIGFsd2F5cyBiZSBjYWxsZWQgb24gb25lIG9mIHRoZVxuICAgKiBvZnRlbi1jaGFuZ2luZyBpbW11dGFibGUgb2JqZWN0cyBpbnN0ZWFkLCBzaW5jZSBpdCB3aWxsIGJlIG1lbW9pemVkIGZvclxuICAgKiBtdWNoIGJldHRlciBwZXJmb3JtYW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtNaXhlZH0gb2JqZWN0XG4gICAqIEByZXR1cm4ge0NvbXBvbmVudHxWb2lkfVxuICAgKi9cblxuICBfX2dldENvbXBvbmVudChvYmplY3QpIHtcbiAgICBjb25zdCBtYXRjaCA9IGZpbmQodGhpcy5ydWxlcywgcnVsZSA9PiBydWxlLnJlbmRlciAmJiBydWxlLm1hdGNoKG9iamVjdCkpXG4gICAgaWYgKCFtYXRjaCkgcmV0dXJuXG4gICAgcmV0dXJuIG1hdGNoLnJlbmRlclxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGVjb3JhdG9ycyBmb3IgYW4gYG9iamVjdGAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHByaXZhdGUsIGJlY2F1c2UgaXQgc2hvdWxkIGFsd2F5cyBiZSBjYWxsZWQgb24gb25lIG9mIHRoZVxuICAgKiBvZnRlbi1jaGFuZ2luZyBpbW11dGFibGUgb2JqZWN0cyBpbnN0ZWFkLCBzaW5jZSBpdCB3aWxsIGJlIG1lbW9pemVkIGZvclxuICAgKiBtdWNoIGJldHRlciBwZXJmb3JtYW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtNaXhlZH0gb2JqZWN0XG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBfX2dldERlY29yYXRvcnMob2JqZWN0KSB7XG4gICAgcmV0dXJuIHRoaXMucnVsZXNcbiAgICAgIC5maWx0ZXIocnVsZSA9PiBydWxlLmRlY29yYXRlICYmIHJ1bGUubWF0Y2gob2JqZWN0KSlcbiAgICAgIC5tYXAoKHJ1bGUpID0+IHtcbiAgICAgICAgcmV0dXJuICh0ZXh0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJ1bGUuZGVjb3JhdGUodGV4dCwgb2JqZWN0KVxuICAgICAgICB9XG4gICAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGFuIGBvYmplY3RgIGFnYWluc3QgdGhlIHNjaGVtYSwgcmV0dXJuaW5nIHRoZSBmYWlsaW5nIHJ1bGUgYW5kXG4gICAqIHZhbHVlIGlmIHRoZSBvYmplY3QgaXMgaW52YWxpZCwgb3Igdm9pZCBpZiBpdCdzIHZhbGlkLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBwcml2YXRlLCBiZWNhdXNlIGl0IHNob3VsZCBhbHdheXMgYmUgY2FsbGVkIG9uIG9uZSBvZiB0aGVcbiAgICogb2Z0ZW4tY2hhbmdpbmcgaW1tdXRhYmxlIG9iamVjdHMgaW5zdGVhZCwgc2luY2UgaXQgd2lsbCBiZSBtZW1vaXplZCBmb3JcbiAgICogbXVjaCBiZXR0ZXIgcGVyZm9ybWFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7TWl4ZWR9IG9iamVjdFxuICAgKiBAcmV0dXJuIHtPYmplY3R8Vm9pZH1cbiAgICovXG5cbiAgX192YWxpZGF0ZShvYmplY3QpIHtcbiAgICBsZXQgdmFsdWVcblxuICAgIGNvbnN0IG1hdGNoID0gZmluZCh0aGlzLnJ1bGVzLCAocnVsZSkgPT4ge1xuICAgICAgaWYgKCFydWxlLnZhbGlkYXRlKSByZXR1cm5cbiAgICAgIGlmICghcnVsZS5tYXRjaChvYmplY3QpKSByZXR1cm5cblxuICAgICAgdmFsdWUgPSBydWxlLnZhbGlkYXRlKG9iamVjdClcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH0pXG5cbiAgICBpZiAoIXZhbHVlKSByZXR1cm5cblxuICAgIHJldHVybiB7XG4gICAgICBydWxlOiBtYXRjaCxcbiAgICAgIHZhbHVlLFxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBgcHJvcGVydGllc2Agb2YgYSBzY2hlbWEuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnRpZXNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVQcm9wZXJ0aWVzKHByb3BlcnRpZXMpIHtcbiAgbGV0IHsgcnVsZXMgPSBbXSwgbm9kZXMsIG1hcmtzIH0gPSBwcm9wZXJ0aWVzXG5cbiAgaWYgKG5vZGVzKSB7XG4gICAgY29uc3QgYXJyYXkgPSBub3JtYWxpemVOb2Rlcyhub2RlcylcbiAgICBydWxlcyA9IHJ1bGVzLmNvbmNhdChhcnJheSlcbiAgfVxuXG4gIGlmIChtYXJrcykge1xuICAgIGNvbnN0IGFycmF5ID0gbm9ybWFsaXplTWFya3MobWFya3MpXG4gICAgcnVsZXMgPSBydWxlcy5jb25jYXQoYXJyYXkpXG4gIH1cblxuICBpZiAocHJvcGVydGllcy50cmFuc2Zvcm0pIHtcbiAgICBsb2dnZXIuZGVwcmVjYXRlKCcwLjIyLjAnLCAnVGhlIGBzY2hlbWEudHJhbnNmb3JtYCBwcm9wZXJ0eSBoYXMgYmVlbiBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGBzY2hlbWEuY2hhbmdlYC4nKVxuICAgIHByb3BlcnRpZXMuY2hhbmdlID0gcHJvcGVydGllcy50cmFuc2Zvcm1cbiAgICBkZWxldGUgcHJvcGVydGllcy50cmFuc2Zvcm1cbiAgfVxuXG4gIHJldHVybiB7IHJ1bGVzIH1cbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgYSBgbm9kZXNgIHNob3J0aGFuZCBhcmd1bWVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZXNcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5vZGVzKG5vZGVzKSB7XG4gIGNvbnN0IHJ1bGVzID0gW11cblxuICBmb3IgKGNvbnN0IGtleSBpbiBub2Rlcykge1xuICAgIGxldCBydWxlID0gbm9kZXNba2V5XVxuXG4gICAgaWYgKHR5cGVPZihydWxlKSA9PSAnZnVuY3Rpb24nIHx8IGlzUmVhY3RDb21wb25lbnQocnVsZSkpIHtcbiAgICAgIHJ1bGUgPSB7IHJlbmRlcjogcnVsZSB9XG4gICAgfVxuXG4gICAgcnVsZS5tYXRjaCA9IChvYmplY3QpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIChvYmplY3Qua2luZCA9PSAnYmxvY2snIHx8IG9iamVjdC5raW5kID09ICdpbmxpbmUnKSAmJlxuICAgICAgICBvYmplY3QudHlwZSA9PSBrZXlcbiAgICAgIClcbiAgICB9XG5cbiAgICBydWxlcy5wdXNoKHJ1bGUpXG4gIH1cblxuICByZXR1cm4gcnVsZXNcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgYSBgbWFya3NgIHNob3J0aGFuZCBhcmd1bWVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbWFya3NcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1hcmtzKG1hcmtzKSB7XG4gIGNvbnN0IHJ1bGVzID0gW11cblxuICBmb3IgKGNvbnN0IGtleSBpbiBtYXJrcykge1xuICAgIGxldCBydWxlID0gbWFya3Nba2V5XVxuXG4gICAgaWYgKCFydWxlLnJlbmRlciAmJiAhcnVsZS5kZWNvcmF0b3IgJiYgIXJ1bGUudmFsaWRhdGUpIHtcbiAgICAgIHJ1bGUgPSB7IHJlbmRlcjogcnVsZSB9XG4gICAgfVxuXG4gICAgcnVsZS5yZW5kZXIgPSBub3JtYWxpemVNYXJrQ29tcG9uZW50KHJ1bGUucmVuZGVyKVxuICAgIHJ1bGUubWF0Y2ggPSBvYmplY3QgPT4gb2JqZWN0LmtpbmQgPT0gJ21hcmsnICYmIG9iamVjdC50eXBlID09IGtleVxuICAgIHJ1bGVzLnB1c2gocnVsZSlcbiAgfVxuXG4gIHJldHVybiBydWxlc1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIG1hcmsgYHJlbmRlcmAgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtDb21wb25lbnR8RnVuY3Rpb258T2JqZWN0fFN0cmluZ30gcmVuZGVyXG4gKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplTWFya0NvbXBvbmVudChyZW5kZXIpIHtcbiAgaWYgKGlzUmVhY3RDb21wb25lbnQocmVuZGVyKSkgcmV0dXJuIHJlbmRlclxuXG4gIHN3aXRjaCAodHlwZU9mKHJlbmRlcikpIHtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gcmVuZGVyXG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHJldHVybiBwcm9wcyA9PiA8c3BhbiBzdHlsZT17cmVuZGVyfT57cHJvcHMuY2hpbGRyZW59PC9zcGFuPlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gcHJvcHMgPT4gPHNwYW4gY2xhc3NOYW1lPXtyZW5kZXJ9Pntwcm9wcy5jaGlsZHJlbn08L3NwYW4+XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBwc2V1ZG8tc3ltYm9sIGZvciB0eXBlIGNoZWNraW5nLlxuICovXG5cblNjaGVtYS5wcm90b3R5cGVbTU9ERUxfVFlQRVMuU0NIRU1BXSA9IHRydWVcblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge1NjaGVtYX1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlbWFcbiJdfQ==