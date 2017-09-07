'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

var _isEmpty = require('is-empty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Set `properties` on the selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.select = function (change, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = _selection2.default.createProperties(properties);

  var _options$snapshot = options.snapshot,
      snapshot = _options$snapshot === undefined ? false : _options$snapshot;
  var state = change.state;
  var document = state.document,
      selection = state.selection;

  var props = {};
  var sel = selection.toJSON();
  var next = selection.merge(properties).normalize(document);
  properties = (0, _pick2.default)(next, Object.keys(properties));

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (var k in properties) {
    if (snapshot == false && properties[k] == sel[k]) continue;
    props[k] = properties[k];
  }

  // Resolve the selection keys into paths.
  sel.anchorPath = sel.anchorKey == null ? null : document.getPath(sel.anchorKey);
  delete sel.anchorKey;

  if (props.anchorKey) {
    props.anchorPath = props.anchorKey == null ? null : document.getPath(props.anchorKey);
    delete props.anchorKey;
  }

  sel.focusPath = sel.focusKey == null ? null : document.getPath(sel.focusKey);
  delete sel.focusKey;

  if (props.focusKey) {
    props.focusPath = props.focusKey == null ? null : document.getPath(props.focusKey);
    delete props.focusKey;
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  var moved = ['anchorPath', 'anchorOffset', 'focusPath', 'focusOffset'].some(function (p) {
    return props.hasOwnProperty(p);
  });

  if (sel.marks && properties.marks == sel.marks && moved) {
    props.marks = null;
  }

  // If there are no new properties to set, abort.
  if ((0, _isEmpty2.default)(props)) {
    return;
  }

  // Apply the operation.
  change.applyOperation({
    type: 'set_selection',
    properties: props,
    selection: sel
  }, snapshot ? { skip: false, merge: false } : {});
};

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes.selectAll = function (change) {
  var state = change.state;
  var document = state.document,
      selection = state.selection;

  var next = selection.moveToRangeOf(document);
  change.select(next);
};

/**
 * Snapshot the current selection.
 *
 * @param {Change} change
 */

Changes.snapshotSelection = function (change) {
  var state = change.state;
  var selection = state.selection;

  change.select(selection, { snapshot: true });
};

/**
 * Set `properties` on the selection.
 *
 * @param {Mixed} ...args
 * @param {Change} change
 */

Changes.moveTo = function (change, properties) {
  _logger2.default.deprecate('0.17.0', 'The `moveTo()` change is deprecated, please use `select()` instead.');
  change.select(properties);
};

/**
 * Unset the selection's marks.
 *
 * @param {Change} change
 */

Changes.unsetMarks = function (change) {
  _logger2.default.deprecate('0.17.0', 'The `unsetMarks()` change is deprecated.');
  change.select({ marks: null });
};

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Change} change
 */

Changes.unsetSelection = function (change) {
  _logger2.default.deprecate('0.17.0', 'The `unsetSelection()` change is deprecated, please use `deselect()` instead.');
  change.select({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  });
};

/**
 * Mix in selection changes that are just a proxy for the selection method.
 */

var PROXY_TRANSFORMS = ['blur', 'collapseTo', 'collapseToAnchor', 'collapseToEnd', 'collapseToEndOf', 'collapseToFocus', 'collapseToStart', 'collapseToStartOf', 'extend', 'extendTo', 'extendToEndOf', 'extendToStartOf', 'flip', 'focus', 'move', 'moveAnchor', 'moveAnchorOffsetTo', 'moveAnchorTo', 'moveAnchorToEndOf', 'moveAnchorToStartOf', 'moveEnd', 'moveEndOffsetTo', 'moveEndTo', 'moveFocus', 'moveFocusOffsetTo', 'moveFocusTo', 'moveFocusToEndOf', 'moveFocusToStartOf', 'moveOffsetsTo', 'moveStart', 'moveStartOffsetTo', 'moveStartTo',
// 'moveTo', Commented out for now, since it conflicts with a deprecated one.
'moveToEnd', 'moveToEndOf', 'moveToRangeOf', 'moveToStart', 'moveToStartOf', 'deselect'];

PROXY_TRANSFORMS.forEach(function (method) {
  Changes[method] = function (change) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var normalize = method != 'deselect';
    var state = change.state;
    var document = state.document,
        selection = state.selection;

    var next = selection[method].apply(selection, args);
    if (normalize) next = next.normalize(document);
    change.select(next);
  };
});

/**
 * Mix in node-related changes.
 */

var PREFIXES = ['moveTo', 'collapseTo', 'extendTo'];

var DIRECTIONS = ['Next', 'Previous'];

var KINDS = ['Block', 'Inline', 'Text'];

PREFIXES.forEach(function (prefix) {
  var edges = ['Start', 'End'];

  if (prefix == 'moveTo') {
    edges.push('Range');
  }

  edges.forEach(function (edge) {
    DIRECTIONS.forEach(function (direction) {
      KINDS.forEach(function (kind) {
        var get = 'get' + direction + kind;
        var getAtRange = 'get' + kind + 'sAtRange';
        var index = direction == 'Next' ? 'last' : 'first';
        var method = '' + prefix + edge + 'Of';
        var name = '' + method + direction + kind;

        Changes[name] = function (change) {
          var state = change.state;
          var document = state.document,
              selection = state.selection;

          var nodes = document[getAtRange](selection);
          var node = nodes[index]();
          var target = document[get](node.key);
          if (!target) return;
          var next = selection[method](target);
          change.select(next);
        };
      });
    });
  });
});

/**
 * Mix in deprecated changes with a warning.
 */

var DEPRECATED_TRANSFORMS = [['extendBackward', 'extend', 'The `extendBackward(n)` change is deprecated, please use `extend(n)` instead with a negative offset.'], ['extendForward', 'extend', 'The `extendForward(n)` change is deprecated, please use `extend(n)` instead.'], ['moveBackward', 'move', 'The `moveBackward(n)` change is deprecated, please use `move(n)` instead with a negative offset.'], ['moveForward', 'move', 'The `moveForward(n)` change is deprecated, please use `move(n)` instead.'], ['moveStartOffset', 'moveStart', 'The `moveStartOffset(n)` change is deprecated, please use `moveStart(n)` instead.'], ['moveEndOffset', 'moveEnd', 'The `moveEndOffset(n)` change is deprecated, please use `moveEnd()` instead.'], ['moveToOffsets', 'moveOffsetsTo', 'The `moveToOffsets()` change is deprecated, please use `moveOffsetsTo()` instead.'], ['flipSelection', 'flip', 'The `flipSelection()` change is deprecated, please use `flip()` instead.']];

DEPRECATED_TRANSFORMS.forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      old = _ref2[0],
      current = _ref2[1],
      warning = _ref2[2];

  Changes[old] = function (change) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    _logger2.default.deprecate('0.17.0', warning);
    var state = change.state;
    var document = state.document,
        selection = state.selection;

    var sel = selection[current].apply(selection, args).normalize(document);
    change.select(sel);
  };
});

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFuZ2VzL29uLXNlbGVjdGlvbi5qcyJdLCJuYW1lcyI6WyJDaGFuZ2VzIiwic2VsZWN0IiwiY2hhbmdlIiwicHJvcGVydGllcyIsIm9wdGlvbnMiLCJjcmVhdGVQcm9wZXJ0aWVzIiwic25hcHNob3QiLCJzdGF0ZSIsImRvY3VtZW50Iiwic2VsZWN0aW9uIiwicHJvcHMiLCJzZWwiLCJ0b0pTT04iLCJuZXh0IiwibWVyZ2UiLCJub3JtYWxpemUiLCJPYmplY3QiLCJrZXlzIiwiayIsImFuY2hvclBhdGgiLCJhbmNob3JLZXkiLCJnZXRQYXRoIiwiZm9jdXNQYXRoIiwiZm9jdXNLZXkiLCJtb3ZlZCIsInNvbWUiLCJoYXNPd25Qcm9wZXJ0eSIsInAiLCJtYXJrcyIsImFwcGx5T3BlcmF0aW9uIiwidHlwZSIsInNraXAiLCJzZWxlY3RBbGwiLCJtb3ZlVG9SYW5nZU9mIiwic25hcHNob3RTZWxlY3Rpb24iLCJtb3ZlVG8iLCJkZXByZWNhdGUiLCJ1bnNldE1hcmtzIiwidW5zZXRTZWxlY3Rpb24iLCJhbmNob3JPZmZzZXQiLCJmb2N1c09mZnNldCIsImlzRm9jdXNlZCIsImlzQmFja3dhcmQiLCJQUk9YWV9UUkFOU0ZPUk1TIiwiZm9yRWFjaCIsIm1ldGhvZCIsImFyZ3MiLCJQUkVGSVhFUyIsIkRJUkVDVElPTlMiLCJLSU5EUyIsInByZWZpeCIsImVkZ2VzIiwicHVzaCIsImVkZ2UiLCJkaXJlY3Rpb24iLCJraW5kIiwiZ2V0IiwiZ2V0QXRSYW5nZSIsImluZGV4IiwibmFtZSIsIm5vZGVzIiwibm9kZSIsInRhcmdldCIsImtleSIsIkRFUFJFQ0FURURfVFJBTlNGT1JNUyIsIm9sZCIsImN1cnJlbnQiLCJ3YXJuaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsVUFBVSxFQUFoQjs7QUFFQTs7Ozs7OztBQU9BQSxRQUFRQyxNQUFSLEdBQWlC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QVAsQ0FBaUIsUUFBakIsRUFBMkIrQixPQUEzQjtBQURrQyxRQUUxQjVELEtBRjBCLEdBRWhCTCxNQUZnQixDQUUxQkssS0FGMEI7QUFBQSxRQUcxQkMsUUFIMEIsR0FHRkQsS0FIRSxDQUcxQkMsUUFIMEI7QUFBQSxRQUdoQkMsU0FIZ0IsR0FHRkYsS0FIRSxDQUdoQkUsU0FIZ0I7O0FBSWxDLFFBQU1FLE1BQU1GLFVBQVV5RCxPQUFWLG1CQUFzQnBCLElBQXRCLEVBQTRCL0IsU0FBNUIsQ0FBc0NQLFFBQXRDLENBQVo7QUFDQU4sV0FBT0QsTUFBUCxDQUFjVSxHQUFkO0FBQ0QsR0FORDtBQU9ELENBUkQ7O0FBVUE7Ozs7OztrQkFNZVgsTyIsImZpbGUiOiJvbi1zZWxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBTZWxlY3Rpb24gZnJvbSAnLi4vbW9kZWxzL3NlbGVjdGlvbidcbmltcG9ydCBpc0VtcHR5IGZyb20gJ2lzLWVtcHR5J1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInXG5pbXBvcnQgcGljayBmcm9tICdsb2Rhc2gvcGljaydcblxuLyoqXG4gKiBDaGFuZ2VzLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cblxuY29uc3QgQ2hhbmdlcyA9IHt9XG5cbi8qKlxuICogU2V0IGBwcm9wZXJ0aWVzYCBvbiB0aGUgc2VsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gKi9cblxuQ2hhbmdlcy5zZWxlY3QgPSAoY2hhbmdlLCBwcm9wZXJ0aWVzLCBvcHRpb25zID0ge30pID0+IHtcbiAgcHJvcGVydGllcyA9IFNlbGVjdGlvbi5jcmVhdGVQcm9wZXJ0aWVzKHByb3BlcnRpZXMpXG5cbiAgY29uc3QgeyBzbmFwc2hvdCA9IGZhbHNlIH0gPSBvcHRpb25zXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gIGNvbnN0IHByb3BzID0ge31cbiAgY29uc3Qgc2VsID0gc2VsZWN0aW9uLnRvSlNPTigpXG4gIGNvbnN0IG5leHQgPSBzZWxlY3Rpb24ubWVyZ2UocHJvcGVydGllcykubm9ybWFsaXplKGRvY3VtZW50KVxuICBwcm9wZXJ0aWVzID0gcGljayhuZXh0LCBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSlcblxuICAvLyBSZW1vdmUgYW55IHByb3BlcnRpZXMgdGhhdCBhcmUgYWxyZWFkeSBlcXVhbCB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uIEFuZFxuICAvLyBjcmVhdGUgYSBkaWN0aW9uYXJ5IG9mIHRoZSBwcmV2aW91cyB2YWx1ZXMgZm9yIGFsbCBvZiB0aGUgcHJvcGVydGllcyB0aGF0XG4gIC8vIGFyZSBiZWluZyBjaGFuZ2VkLCBmb3IgdGhlIGludmVyc2Ugb3BlcmF0aW9uLlxuICBmb3IgKGNvbnN0IGsgaW4gcHJvcGVydGllcykge1xuICAgIGlmIChzbmFwc2hvdCA9PSBmYWxzZSAmJiBwcm9wZXJ0aWVzW2tdID09IHNlbFtrXSkgY29udGludWVcbiAgICBwcm9wc1trXSA9IHByb3BlcnRpZXNba11cbiAgfVxuXG4gIC8vIFJlc29sdmUgdGhlIHNlbGVjdGlvbiBrZXlzIGludG8gcGF0aHMuXG4gIHNlbC5hbmNob3JQYXRoID0gc2VsLmFuY2hvcktleSA9PSBudWxsID8gbnVsbCA6IGRvY3VtZW50LmdldFBhdGgoc2VsLmFuY2hvcktleSlcbiAgZGVsZXRlIHNlbC5hbmNob3JLZXlcblxuICBpZiAocHJvcHMuYW5jaG9yS2V5KSB7XG4gICAgcHJvcHMuYW5jaG9yUGF0aCA9IHByb3BzLmFuY2hvcktleSA9PSBudWxsID8gbnVsbCA6IGRvY3VtZW50LmdldFBhdGgocHJvcHMuYW5jaG9yS2V5KVxuICAgIGRlbGV0ZSBwcm9wcy5hbmNob3JLZXlcbiAgfVxuXG4gIHNlbC5mb2N1c1BhdGggPSBzZWwuZm9jdXNLZXkgPT0gbnVsbCA/IG51bGwgOiBkb2N1bWVudC5nZXRQYXRoKHNlbC5mb2N1c0tleSlcbiAgZGVsZXRlIHNlbC5mb2N1c0tleVxuXG4gIGlmIChwcm9wcy5mb2N1c0tleSkge1xuICAgIHByb3BzLmZvY3VzUGF0aCA9IHByb3BzLmZvY3VzS2V5ID09IG51bGwgPyBudWxsIDogZG9jdW1lbnQuZ2V0UGF0aChwcm9wcy5mb2N1c0tleSlcbiAgICBkZWxldGUgcHJvcHMuZm9jdXNLZXlcbiAgfVxuXG4gIC8vIElmIHRoZSBzZWxlY3Rpb24gbW92ZXMsIGNsZWFyIGFueSBtYXJrcywgdW5sZXNzIHRoZSBuZXcgc2VsZWN0aW9uXG4gIC8vIHByb3BlcnRpZXMgY2hhbmdlIHRoZSBtYXJrcyBpbiBzb21lIHdheS5cbiAgY29uc3QgbW92ZWQgPSBbXG4gICAgJ2FuY2hvclBhdGgnLFxuICAgICdhbmNob3JPZmZzZXQnLFxuICAgICdmb2N1c1BhdGgnLFxuICAgICdmb2N1c09mZnNldCcsXG4gIF0uc29tZShwID0+IHByb3BzLmhhc093blByb3BlcnR5KHApKVxuXG4gIGlmIChzZWwubWFya3MgJiYgcHJvcGVydGllcy5tYXJrcyA9PSBzZWwubWFya3MgJiYgbW92ZWQpIHtcbiAgICBwcm9wcy5tYXJrcyA9IG51bGxcbiAgfVxuXG4gIC8vIElmIHRoZXJlIGFyZSBubyBuZXcgcHJvcGVydGllcyB0byBzZXQsIGFib3J0LlxuICBpZiAoaXNFbXB0eShwcm9wcykpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIEFwcGx5IHRoZSBvcGVyYXRpb24uXG4gIGNoYW5nZS5hcHBseU9wZXJhdGlvbih7XG4gICAgdHlwZTogJ3NldF9zZWxlY3Rpb24nLFxuICAgIHByb3BlcnRpZXM6IHByb3BzLFxuICAgIHNlbGVjdGlvbjogc2VsLFxuICB9LCBzbmFwc2hvdCA/IHsgc2tpcDogZmFsc2UsIG1lcmdlOiBmYWxzZSB9IDoge30pXG59XG5cbi8qKlxuICogU2VsZWN0IHRoZSB3aG9sZSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKi9cblxuQ2hhbmdlcy5zZWxlY3RBbGwgPSAoY2hhbmdlKSA9PiB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gIGNvbnN0IG5leHQgPSBzZWxlY3Rpb24ubW92ZVRvUmFuZ2VPZihkb2N1bWVudClcbiAgY2hhbmdlLnNlbGVjdChuZXh0KVxufVxuXG4vKipcbiAqIFNuYXBzaG90IHRoZSBjdXJyZW50IHNlbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKi9cblxuQ2hhbmdlcy5zbmFwc2hvdFNlbGVjdGlvbiA9IChjaGFuZ2UpID0+IHtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgc2VsZWN0aW9uIH0gPSBzdGF0ZVxuICBjaGFuZ2Uuc2VsZWN0KHNlbGVjdGlvbiwgeyBzbmFwc2hvdDogdHJ1ZSB9KVxufVxuXG4vKipcbiAqIFNldCBgcHJvcGVydGllc2Agb24gdGhlIHNlbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSAuLi5hcmdzXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKi9cblxuQ2hhbmdlcy5tb3ZlVG8gPSAoY2hhbmdlLCBwcm9wZXJ0aWVzKSA9PiB7XG4gIGxvZ2dlci5kZXByZWNhdGUoJzAuMTcuMCcsICdUaGUgYG1vdmVUbygpYCBjaGFuZ2UgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgc2VsZWN0KClgIGluc3RlYWQuJylcbiAgY2hhbmdlLnNlbGVjdChwcm9wZXJ0aWVzKVxufVxuXG4vKipcbiAqIFVuc2V0IHRoZSBzZWxlY3Rpb24ncyBtYXJrcy5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKi9cblxuQ2hhbmdlcy51bnNldE1hcmtzID0gKGNoYW5nZSkgPT4ge1xuICBsb2dnZXIuZGVwcmVjYXRlKCcwLjE3LjAnLCAnVGhlIGB1bnNldE1hcmtzKClgIGNoYW5nZSBpcyBkZXByZWNhdGVkLicpXG4gIGNoYW5nZS5zZWxlY3QoeyBtYXJrczogbnVsbCB9KVxufVxuXG4vKipcbiAqIFVuc2V0IHRoZSBzZWxlY3Rpb24sIHJlbW92aW5nIGFuIGFzc29jaWF0aW9uIHRvIGEgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge0NoYW5nZX0gY2hhbmdlXG4gKi9cblxuQ2hhbmdlcy51bnNldFNlbGVjdGlvbiA9IChjaGFuZ2UpID0+IHtcbiAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgJ1RoZSBgdW5zZXRTZWxlY3Rpb24oKWAgY2hhbmdlIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGRlc2VsZWN0KClgIGluc3RlYWQuJylcbiAgY2hhbmdlLnNlbGVjdCh7XG4gICAgYW5jaG9yS2V5OiBudWxsLFxuICAgIGFuY2hvck9mZnNldDogMCxcbiAgICBmb2N1c0tleTogbnVsbCxcbiAgICBmb2N1c09mZnNldDogMCxcbiAgICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgIGlzQmFja3dhcmQ6IGZhbHNlXG4gIH0pXG59XG5cbi8qKlxuICogTWl4IGluIHNlbGVjdGlvbiBjaGFuZ2VzIHRoYXQgYXJlIGp1c3QgYSBwcm94eSBmb3IgdGhlIHNlbGVjdGlvbiBtZXRob2QuXG4gKi9cblxuY29uc3QgUFJPWFlfVFJBTlNGT1JNUyA9IFtcbiAgJ2JsdXInLFxuICAnY29sbGFwc2VUbycsXG4gICdjb2xsYXBzZVRvQW5jaG9yJyxcbiAgJ2NvbGxhcHNlVG9FbmQnLFxuICAnY29sbGFwc2VUb0VuZE9mJyxcbiAgJ2NvbGxhcHNlVG9Gb2N1cycsXG4gICdjb2xsYXBzZVRvU3RhcnQnLFxuICAnY29sbGFwc2VUb1N0YXJ0T2YnLFxuICAnZXh0ZW5kJyxcbiAgJ2V4dGVuZFRvJyxcbiAgJ2V4dGVuZFRvRW5kT2YnLFxuICAnZXh0ZW5kVG9TdGFydE9mJyxcbiAgJ2ZsaXAnLFxuICAnZm9jdXMnLFxuICAnbW92ZScsXG4gICdtb3ZlQW5jaG9yJyxcbiAgJ21vdmVBbmNob3JPZmZzZXRUbycsXG4gICdtb3ZlQW5jaG9yVG8nLFxuICAnbW92ZUFuY2hvclRvRW5kT2YnLFxuICAnbW92ZUFuY2hvclRvU3RhcnRPZicsXG4gICdtb3ZlRW5kJyxcbiAgJ21vdmVFbmRPZmZzZXRUbycsXG4gICdtb3ZlRW5kVG8nLFxuICAnbW92ZUZvY3VzJyxcbiAgJ21vdmVGb2N1c09mZnNldFRvJyxcbiAgJ21vdmVGb2N1c1RvJyxcbiAgJ21vdmVGb2N1c1RvRW5kT2YnLFxuICAnbW92ZUZvY3VzVG9TdGFydE9mJyxcbiAgJ21vdmVPZmZzZXRzVG8nLFxuICAnbW92ZVN0YXJ0JyxcbiAgJ21vdmVTdGFydE9mZnNldFRvJyxcbiAgJ21vdmVTdGFydFRvJyxcbiAgLy8gJ21vdmVUbycsIENvbW1lbnRlZCBvdXQgZm9yIG5vdywgc2luY2UgaXQgY29uZmxpY3RzIHdpdGggYSBkZXByZWNhdGVkIG9uZS5cbiAgJ21vdmVUb0VuZCcsXG4gICdtb3ZlVG9FbmRPZicsXG4gICdtb3ZlVG9SYW5nZU9mJyxcbiAgJ21vdmVUb1N0YXJ0JyxcbiAgJ21vdmVUb1N0YXJ0T2YnLFxuICAnZGVzZWxlY3QnLFxuXVxuXG5QUk9YWV9UUkFOU0ZPUk1TLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICBDaGFuZ2VzW21ldGhvZF0gPSAoY2hhbmdlLCAuLi5hcmdzKSA9PiB7XG4gICAgY29uc3Qgbm9ybWFsaXplID0gbWV0aG9kICE9ICdkZXNlbGVjdCdcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgICBjb25zdCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gICAgbGV0IG5leHQgPSBzZWxlY3Rpb25bbWV0aG9kXSguLi5hcmdzKVxuICAgIGlmIChub3JtYWxpemUpIG5leHQgPSBuZXh0Lm5vcm1hbGl6ZShkb2N1bWVudClcbiAgICBjaGFuZ2Uuc2VsZWN0KG5leHQpXG4gIH1cbn0pXG5cbi8qKlxuICogTWl4IGluIG5vZGUtcmVsYXRlZCBjaGFuZ2VzLlxuICovXG5cbmNvbnN0IFBSRUZJWEVTID0gW1xuICAnbW92ZVRvJyxcbiAgJ2NvbGxhcHNlVG8nLFxuICAnZXh0ZW5kVG8nLFxuXVxuXG5jb25zdCBESVJFQ1RJT05TID0gW1xuICAnTmV4dCcsXG4gICdQcmV2aW91cycsXG5dXG5cbmNvbnN0IEtJTkRTID0gW1xuICAnQmxvY2snLFxuICAnSW5saW5lJyxcbiAgJ1RleHQnLFxuXVxuXG5QUkVGSVhFUy5mb3JFYWNoKChwcmVmaXgpID0+IHtcbiAgY29uc3QgZWRnZXMgPSBbXG4gICAgJ1N0YXJ0JyxcbiAgICAnRW5kJyxcbiAgXVxuXG4gIGlmIChwcmVmaXggPT0gJ21vdmVUbycpIHtcbiAgICBlZGdlcy5wdXNoKCdSYW5nZScpXG4gIH1cblxuICBlZGdlcy5mb3JFYWNoKChlZGdlKSA9PiB7XG4gICAgRElSRUNUSU9OUy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHtcbiAgICAgIEtJTkRTLmZvckVhY2goKGtpbmQpID0+IHtcbiAgICAgICAgY29uc3QgZ2V0ID0gYGdldCR7ZGlyZWN0aW9ufSR7a2luZH1gXG4gICAgICAgIGNvbnN0IGdldEF0UmFuZ2UgPSBgZ2V0JHtraW5kfXNBdFJhbmdlYFxuICAgICAgICBjb25zdCBpbmRleCA9IGRpcmVjdGlvbiA9PSAnTmV4dCcgPyAnbGFzdCcgOiAnZmlyc3QnXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGAke3ByZWZpeH0ke2VkZ2V9T2ZgXG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHttZXRob2R9JHtkaXJlY3Rpb259JHtraW5kfWBcblxuICAgICAgICBDaGFuZ2VzW25hbWVdID0gKGNoYW5nZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICAgICAgICAgIGNvbnN0IHsgZG9jdW1lbnQsIHNlbGVjdGlvbiB9ID0gc3RhdGVcbiAgICAgICAgICBjb25zdCBub2RlcyA9IGRvY3VtZW50W2dldEF0UmFuZ2VdKHNlbGVjdGlvbilcbiAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaW5kZXhdKClcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudFtnZXRdKG5vZGUua2V5KVxuICAgICAgICAgIGlmICghdGFyZ2V0KSByZXR1cm5cbiAgICAgICAgICBjb25zdCBuZXh0ID0gc2VsZWN0aW9uW21ldGhvZF0odGFyZ2V0KVxuICAgICAgICAgIGNoYW5nZS5zZWxlY3QobmV4dClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcblxuLyoqXG4gKiBNaXggaW4gZGVwcmVjYXRlZCBjaGFuZ2VzIHdpdGggYSB3YXJuaW5nLlxuICovXG5cbmNvbnN0IERFUFJFQ0FURURfVFJBTlNGT1JNUyA9IFtcbiAgWydleHRlbmRCYWNrd2FyZCcsICdleHRlbmQnLCAnVGhlIGBleHRlbmRCYWNrd2FyZChuKWAgY2hhbmdlIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGV4dGVuZChuKWAgaW5zdGVhZCB3aXRoIGEgbmVnYXRpdmUgb2Zmc2V0LiddLFxuICBbJ2V4dGVuZEZvcndhcmQnLCAnZXh0ZW5kJywgJ1RoZSBgZXh0ZW5kRm9yd2FyZChuKWAgY2hhbmdlIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGV4dGVuZChuKWAgaW5zdGVhZC4nXSxcbiAgWydtb3ZlQmFja3dhcmQnLCAnbW92ZScsICdUaGUgYG1vdmVCYWNrd2FyZChuKWAgY2hhbmdlIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYG1vdmUobilgIGluc3RlYWQgd2l0aCBhIG5lZ2F0aXZlIG9mZnNldC4nXSxcbiAgWydtb3ZlRm9yd2FyZCcsICdtb3ZlJywgJ1RoZSBgbW92ZUZvcndhcmQobilgIGNoYW5nZSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBtb3ZlKG4pYCBpbnN0ZWFkLiddLFxuICBbJ21vdmVTdGFydE9mZnNldCcsICdtb3ZlU3RhcnQnLCAnVGhlIGBtb3ZlU3RhcnRPZmZzZXQobilgIGNoYW5nZSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBtb3ZlU3RhcnQobilgIGluc3RlYWQuJ10sXG4gIFsnbW92ZUVuZE9mZnNldCcsICdtb3ZlRW5kJywgJ1RoZSBgbW92ZUVuZE9mZnNldChuKWAgY2hhbmdlIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYG1vdmVFbmQoKWAgaW5zdGVhZC4nXSxcbiAgWydtb3ZlVG9PZmZzZXRzJywgJ21vdmVPZmZzZXRzVG8nLCAnVGhlIGBtb3ZlVG9PZmZzZXRzKClgIGNoYW5nZSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBtb3ZlT2Zmc2V0c1RvKClgIGluc3RlYWQuJ10sXG4gIFsnZmxpcFNlbGVjdGlvbicsICdmbGlwJywgJ1RoZSBgZmxpcFNlbGVjdGlvbigpYCBjaGFuZ2UgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgZmxpcCgpYCBpbnN0ZWFkLiddLFxuXVxuXG5ERVBSRUNBVEVEX1RSQU5TRk9STVMuZm9yRWFjaCgoWyBvbGQsIGN1cnJlbnQsIHdhcm5pbmcgXSkgPT4ge1xuICBDaGFuZ2VzW29sZF0gPSAoY2hhbmdlLCAuLi5hcmdzKSA9PiB7XG4gICAgbG9nZ2VyLmRlcHJlY2F0ZSgnMC4xNy4wJywgd2FybmluZylcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgICBjb25zdCB7IGRvY3VtZW50LCBzZWxlY3Rpb24gfSA9IHN0YXRlXG4gICAgY29uc3Qgc2VsID0gc2VsZWN0aW9uW2N1cnJlbnRdKC4uLmFyZ3MpLm5vcm1hbGl6ZShkb2N1bWVudClcbiAgICBjaGFuZ2Uuc2VsZWN0KHNlbClcbiAgfVxufSlcblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VzXG4iXX0=