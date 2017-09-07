'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _block = require('../models/block');

var _block2 = _interopRequireDefault(_block);

var _change = require('../models/change');

var _change2 = _interopRequireDefault(_change);

var _character = require('../models/character');

var _character2 = _interopRequireDefault(_character);

var _data = require('../models/data');

var _data2 = _interopRequireDefault(_data);

var _document = require('../models/document');

var _document2 = _interopRequireDefault(_document);

var _history = require('../models/history');

var _history2 = _interopRequireDefault(_history);

var _inline = require('../models/inline');

var _inline2 = _interopRequireDefault(_inline);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _node = require('../models/node');

var _node2 = _interopRequireDefault(_node);

var _range = require('../models/range');

var _range2 = _interopRequireDefault(_range);

var _schema = require('../models/schema');

var _schema2 = _interopRequireDefault(_schema);

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

var _stack = require('../models/stack');

var _stack2 = _interopRequireDefault(_stack);

var _state = require('../models/state');

var _state2 = _interopRequireDefault(_state);

var _text = require('../models/text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a prop type checker for Slate objects with `name` and `validate`.
 *
 * @param {String} name
 * @param {Function} validate
 * @return {Function}
 */

function create(name, validate) {
  function check(isRequired, props, propName, componentName, location) {
    var value = props[propName];
    if (value == null && !isRequired) return null;
    if (value == null && isRequired) return new Error('The ' + location + ' `' + propName + '` is marked as required in `' + componentName + '`, but it was not supplied.');
    if (validate(value)) return null;
    return new Error('Invalid ' + location + ' `' + propName + '` supplied to `' + componentName + '`, expected a Slate `' + name + '` but received: ' + value);
  }

  function propType() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return check.apply(undefined, [false].concat(args));
  }

  propType.isRequired = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return check.apply(undefined, [true].concat(args));
  };

  return propType;
}

/**
 * Prop type checkers.
 *
 * @type {Object}
 */

var Types = {
  block: create('Block', function (v) {
    return _block2.default.isBlock(v);
  }),
  blocks: create('List<Block>', function (v) {
    return _block2.default.isBlockList(v);
  }),
  change: create('Change', function (v) {
    return _change2.default.isChange(v);
  }),
  character: create('Character', function (v) {
    return _character2.default.isCharacter(v);
  }),
  characters: create('List<Character>', function (v) {
    return _character2.default.isCharacterList(v);
  }),
  data: create('Data', function (v) {
    return _data2.default.isData(v);
  }),
  document: create('Document', function (v) {
    return _document2.default.isDocument(v);
  }),
  history: create('History', function (v) {
    return _history2.default.isHistory(v);
  }),
  inline: create('Inline', function (v) {
    return _inline2.default.isInline(v);
  }),
  mark: create('Mark', function (v) {
    return _mark2.default.isMark(v);
  }),
  marks: create('Set<Mark>', function (v) {
    return _mark2.default.isMarkSet(v);
  }),
  node: create('Node', function (v) {
    return _node2.default.isNode(v);
  }),
  nodes: create('List<Node>', function (v) {
    return _node2.default.isNodeList(v);
  }),
  range: create('Range', function (v) {
    return _range2.default.isRange(v);
  }),
  ranges: create('List<Range>', function (v) {
    return _range2.default.isRangeList(v);
  }),
  schema: create('Schema', function (v) {
    return _schema2.default.isSchema(v);
  }),
  selection: create('Selection', function (v) {
    return _selection2.default.isSelection(v);
  }),
  stack: create('Stack', function (v) {
    return _stack2.default.isStack(v);
  }),
  state: create('State', function (v) {
    return _state2.default.isState(v);
  }),
  text: create('Text', function (v) {
    return _text2.default.isText(v);
  }),
  texts: create('List<Text>', function (v) {
    return _text2.default.isTextList(v);
  })

  /**
   * Export.
   *
   * @type {Object}
   */

};exports.default = Types;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wcm9wLXR5cGVzLmpzIl0sIm5hbWVzIjpbImNyZWF0ZSIsIm5hbWUiLCJ2YWxpZGF0ZSIsImNoZWNrIiwiaXNSZXF1aXJlZCIsInByb3BzIiwicHJvcE5hbWUiLCJjb21wb25lbnROYW1lIiwibG9jYXRpb24iLCJ2YWx1ZSIsIkVycm9yIiwicHJvcFR5cGUiLCJhcmdzIiwiVHlwZXMiLCJibG9jayIsImlzQmxvY2siLCJ2IiwiYmxvY2tzIiwiaXNCbG9ja0xpc3QiLCJjaGFuZ2UiLCJpc0NoYW5nZSIsImNoYXJhY3RlciIsImlzQ2hhcmFjdGVyIiwiY2hhcmFjdGVycyIsImlzQ2hhcmFjdGVyTGlzdCIsImRhdGEiLCJpc0RhdGEiLCJkb2N1bWVudCIsImlzRG9jdW1lbnQiLCJoaXN0b3J5IiwiaXNIaXN0b3J5IiwiaW5saW5lIiwiaXNJbmxpbmUiLCJtYXJrIiwiaXNNYXJrIiwibWFya3MiLCJpc01hcmtTZXQiLCJub2RlIiwiaXNOb2RlIiwibm9kZXMiLCJpc05vZGVMaXN0IiwicmFuZ2UiLCJpc1JhbmdlIiwicmFuZ2VzIiwiaXNSYW5nZUxpc3QiLCJzY2hlbWEiLCJpc1NjaGVtYSIsInNlbGVjdGlvbiIsImlzU2VsZWN0aW9uIiwic3RhY2siLCJpc1N0YWNrIiwic3RhdGUiLCJpc1N0YXRlIiwidGV4dCIsImlzVGV4dCIsInRleHRzIiwiaXNUZXh0TGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFTQSxNQUFULENBQWdCQyxJQUFoQixFQUFzQkMsUUFBdEIsRUFBZ0M7QUFDOUIsV0FBU0MsS0FBVCxDQUFlQyxVQUFmLEVBQTJCQyxLQUEzQixFQUFrQ0MsUUFBbEMsRUFBNEND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TDtBQUFBLEdBQWhCLENBZEs7QUFlWjJCLFVBQVEzQyxPQUFPLGFBQVAsRUFBc0I7QUFBQSxXQUFLLGdCQUFNNEMsV0FBTixDQUFrQjVCLENBQWxCLENBQUw7QUFBQSxHQUF0QixDQWZJO0FBZ0JaNkIsVUFBUTdDLE9BQU8sUUFBUCxFQUFpQjtBQUFBLFdBQUssaUJBQU84QyxRQUFQLENBQWdCOUIsQ0FBaEIsQ0FBTDtBQUFBLEdBQWpCLENBaEJJO0FBaUJaK0IsYUFBVy9DLE9BQU8sV0FBUCxFQUFvQjtBQUFBLFdBQUssb0JBQVVnRCxXQUFWLENBQXNCaEMsQ0FBdEIsQ0FBTDtBQUFBLEdBQXBCLENBakJDO0FBa0JaaUMsU0FBT2pELE9BQU8sT0FBUCxFQUFnQjtBQUFBLFdBQUssZ0JBQU1rRCxPQUFOLENBQWNsQyxDQUFkLENBQUw7QUFBQSxHQUFoQixDQWxCSztBQW1CWm1DLFNBQU9uRCxPQUFPLE9BQVAsRUFBZ0I7QUFBQSxXQUFLLGdCQUFNb0QsT0FBTixDQUFjcEMsQ0FBZCxDQUFMO0FBQUEsR0FBaEIsQ0FuQks7QUFvQlpxQyxRQUFNckQsT0FBTyxNQUFQLEVBQWU7QUFBQSxXQUFLLGVBQUtzRCxNQUFMLENBQVl0QyxDQUFaLENBQUw7QUFBQSxHQUFmLENBcEJNO0FBcUJadUMsU0FBT3ZELE9BQU8sWUFBUCxFQUFxQjtBQUFBLFdBQUssZUFBS3dELFVBQUwsQ0FBZ0J4QyxDQUFoQixDQUFMO0FBQUEsR0FBckI7O0FBR1Q7Ozs7OztBQXhCYyxDQUFkLEMsa0JBOEJlSCxLIiwiZmlsZSI6InByb3AtdHlwZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCbG9jayBmcm9tICcuLi9tb2RlbHMvYmxvY2snXG5pbXBvcnQgQ2hhbmdlIGZyb20gJy4uL21vZGVscy9jaGFuZ2UnXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4uL21vZGVscy9jaGFyYWN0ZXInXG5pbXBvcnQgRGF0YSBmcm9tICcuLi9tb2RlbHMvZGF0YSdcbmltcG9ydCBEb2N1bWVudCBmcm9tICcuLi9tb2RlbHMvZG9jdW1lbnQnXG5pbXBvcnQgSGlzdG9yeSBmcm9tICcuLi9tb2RlbHMvaGlzdG9yeSdcbmltcG9ydCBJbmxpbmUgZnJvbSAnLi4vbW9kZWxzL2lubGluZSdcbmltcG9ydCBNYXJrIGZyb20gJy4uL21vZGVscy9tYXJrJ1xuaW1wb3J0IE5vZGUgZnJvbSAnLi4vbW9kZWxzL25vZGUnXG5pbXBvcnQgUmFuZ2UgZnJvbSAnLi4vbW9kZWxzL3JhbmdlJ1xuaW1wb3J0IFNjaGVtYSBmcm9tICcuLi9tb2RlbHMvc2NoZW1hJ1xuaW1wb3J0IFNlbGVjdGlvbiBmcm9tICcuLi9tb2RlbHMvc2VsZWN0aW9uJ1xuaW1wb3J0IFN0YWNrIGZyb20gJy4uL21vZGVscy9zdGFjaydcbmltcG9ydCBTdGF0ZSBmcm9tICcuLi9tb2RlbHMvc3RhdGUnXG5pbXBvcnQgVGV4dCBmcm9tICcuLi9tb2RlbHMvdGV4dCdcblxuLyoqXG4gKiBDcmVhdGUgYSBwcm9wIHR5cGUgY2hlY2tlciBmb3IgU2xhdGUgb2JqZWN0cyB3aXRoIGBuYW1lYCBhbmQgYHZhbGlkYXRlYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gdmFsaWRhdGVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZShuYW1lLCB2YWxpZGF0ZSkge1xuICBmdW5jdGlvbiBjaGVjayhpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwcm9wc1twcm9wTmFtZV1cbiAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiAhaXNSZXF1aXJlZCkgcmV0dXJuIG51bGxcbiAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiBpc1JlcXVpcmVkKSByZXR1cm4gbmV3IEVycm9yKGBUaGUgJHtsb2NhdGlvbn0gXFxgJHtwcm9wTmFtZX1cXGAgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluIFxcYCR7Y29tcG9uZW50TmFtZX1cXGAsIGJ1dCBpdCB3YXMgbm90IHN1cHBsaWVkLmApXG4gICAgaWYgKHZhbGlkYXRlKHZhbHVlKSkgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gbmV3IEVycm9yKGBJbnZhbGlkICR7bG9jYXRpb259IFxcYCR7cHJvcE5hbWV9XFxgIHN1cHBsaWVkIHRvIFxcYCR7Y29tcG9uZW50TmFtZX1cXGAsIGV4cGVjdGVkIGEgU2xhdGUgXFxgJHtuYW1lfVxcYCBidXQgcmVjZWl2ZWQ6ICR7dmFsdWV9YClcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3BUeXBlKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gY2hlY2soZmFsc2UsIC4uLmFyZ3MpXG4gIH1cblxuICBwcm9wVHlwZS5pc1JlcXVpcmVkID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gY2hlY2sodHJ1ZSwgLi4uYXJncylcbiAgfVxuXG4gIHJldHVybiBwcm9wVHlwZVxufVxuXG4vKipcbiAqIFByb3AgdHlwZSBjaGVja2Vycy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IFR5cGVzID0ge1xuICBibG9jazogY3JlYXRlKCdCbG9jaycsIHYgPT4gQmxvY2suaXNCbG9jayh2KSksXG4gIGJsb2NrczogY3JlYXRlKCdMaXN0PEJsb2NrPicsIHYgPT4gQmxvY2suaXNCbG9ja0xpc3QodikpLFxuICBjaGFuZ2U6IGNyZWF0ZSgnQ2hhbmdlJywgdiA9PiBDaGFuZ2UuaXNDaGFuZ2UodikpLFxuICBjaGFyYWN0ZXI6IGNyZWF0ZSgnQ2hhcmFjdGVyJywgdiA9PiBDaGFyYWN0ZXIuaXNDaGFyYWN0ZXIodikpLFxuICBjaGFyYWN0ZXJzOiBjcmVhdGUoJ0xpc3Q8Q2hhcmFjdGVyPicsIHYgPT4gQ2hhcmFjdGVyLmlzQ2hhcmFjdGVyTGlzdCh2KSksXG4gIGRhdGE6IGNyZWF0ZSgnRGF0YScsIHYgPT4gRGF0YS5pc0RhdGEodikpLFxuICBkb2N1bWVudDogY3JlYXRlKCdEb2N1bWVudCcsIHYgPT4gRG9jdW1lbnQuaXNEb2N1bWVudCh2KSksXG4gIGhpc3Rvcnk6IGNyZWF0ZSgnSGlzdG9yeScsIHYgPT4gSGlzdG9yeS5pc0hpc3RvcnkodikpLFxuICBpbmxpbmU6IGNyZWF0ZSgnSW5saW5lJywgdiA9PiBJbmxpbmUuaXNJbmxpbmUodikpLFxuICBtYXJrOiBjcmVhdGUoJ01hcmsnLCB2ID0+IE1hcmsuaXNNYXJrKHYpKSxcbiAgbWFya3M6IGNyZWF0ZSgnU2V0PE1hcms+JywgdiA9PiBNYXJrLmlzTWFya1NldCh2KSksXG4gIG5vZGU6IGNyZWF0ZSgnTm9kZScsIHYgPT4gTm9kZS5pc05vZGUodikpLFxuICBub2RlczogY3JlYXRlKCdMaXN0PE5vZGU+JywgdiA9PiBOb2RlLmlzTm9kZUxpc3QodikpLFxuICByYW5nZTogY3JlYXRlKCdSYW5nZScsIHYgPT4gUmFuZ2UuaXNSYW5nZSh2KSksXG4gIHJhbmdlczogY3JlYXRlKCdMaXN0PFJhbmdlPicsIHYgPT4gUmFuZ2UuaXNSYW5nZUxpc3QodikpLFxuICBzY2hlbWE6IGNyZWF0ZSgnU2NoZW1hJywgdiA9PiBTY2hlbWEuaXNTY2hlbWEodikpLFxuICBzZWxlY3Rpb246IGNyZWF0ZSgnU2VsZWN0aW9uJywgdiA9PiBTZWxlY3Rpb24uaXNTZWxlY3Rpb24odikpLFxuICBzdGFjazogY3JlYXRlKCdTdGFjaycsIHYgPT4gU3RhY2suaXNTdGFjayh2KSksXG4gIHN0YXRlOiBjcmVhdGUoJ1N0YXRlJywgdiA9PiBTdGF0ZS5pc1N0YXRlKHYpKSxcbiAgdGV4dDogY3JlYXRlKCdUZXh0JywgdiA9PiBUZXh0LmlzVGV4dCh2KSksXG4gIHRleHRzOiBjcmVhdGUoJ0xpc3Q8VGV4dD4nLCB2ID0+IFRleHQuaXNUZXh0TGlzdCh2KSksXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgVHlwZXNcbiJdfQ==