'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('../models/schema');

var _schema2 = _interopRequireDefault(_schema);

var _text = require('../models/text');

var _text2 = _interopRequireDefault(_text);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Options object with normalize set to `false`.
 *
 * @type {Object}
 */

var OPTS = { normalize: false

  /**
   * Define the core schema rules, order-sensitive.
   *
   * @type {Array}
   */

};var rules = [

/**
 * Only allow block nodes in documents.
 *
 * @type {Object}
 */

{
  match: function match(node) {
    return node.kind == 'document';
  },
  validate: function validate(document) {
    var invalids = document.nodes.filter(function (n) {
      return n.kind != 'block';
    });
    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, document, invalids) {
    invalids.forEach(function (node) {
      change.removeNodeByKey(node.key, OPTS);
    });
  }
},

/**
 * Only allow block nodes or inline and text nodes in blocks.
 *
 * @type {Object}
 */

{
  match: function match(node) {
    return node.kind == 'block';
  },
  validate: function validate(block) {
    var first = block.nodes.first();
    if (!first) return null;

    var kinds = first.kind == 'block' ? ['block'] : ['inline', 'text'];

    var invalids = block.nodes.filter(function (n) {
      return !kinds.includes(n.kind);
    });
    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, block, invalids) {
    invalids.forEach(function (node) {
      change.removeNodeByKey(node.key, OPTS);
    });
  }
},

/**
 * Only allow inline and text nodes in inlines.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return object.kind == 'inline';
  },
  validate: function validate(inline) {
    var invalids = inline.nodes.filter(function (n) {
      return n.kind != 'inline' && n.kind != 'text';
    });
    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, inline, invalids) {
    invalids.forEach(function (node) {
      change.removeNodeByKey(node.key, OPTS);
    });
  }
},

/**
 * Ensure that block and inline nodes have at least one text child.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return object.kind == 'block' || object.kind == 'inline';
  },
  validate: function validate(node) {
    return node.nodes.size == 0;
  },
  normalize: function normalize(change, node) {
    var text = _text2.default.create();
    change.insertNodeByKey(node.key, 0, text, OPTS);
  }
},

/**
 * Ensure that void nodes contain a text node with a single space of text.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return (object.kind == 'inline' || object.kind == 'block') && object.isVoid;
  },
  validate: function validate(node) {
    return node.text !== ' ' || node.nodes.size !== 1;
  },
  normalize: function normalize(change, node, result) {
    var text = _text2.default.create(' ');
    var index = node.nodes.size;

    change.insertNodeByKey(node.key, index, text, OPTS);

    node.nodes.forEach(function (child) {
      change.removeNodeByKey(child.key, OPTS);
    });
  }
},

/**
 * Ensure that inline nodes are never empty.
 *
 * This rule is applied to all blocks, because when they contain an empty
 * inline, we need to remove the inline from that parent block. If `validate`
 * was to be memoized, it should be against the parent node, not the inline
 * themselves.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return object.kind == 'block';
  },
  validate: function validate(block) {
    var invalids = block.nodes.filter(function (n) {
      return n.kind == 'inline' && n.text == '';
    });
    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, block, invalids) {
    // If all of the block's nodes are invalid, insert an empty text node so
    // that the selection will be preserved when they are all removed.
    if (block.nodes.size == invalids.size) {
      var text = _text2.default.create();
      change.insertNodeByKey(block.key, 1, text, OPTS);
    }

    invalids.forEach(function (node) {
      change.removeNodeByKey(node.key, OPTS);
    });
  }
},

/**
 * Ensure that inline void nodes are surrounded by text nodes, by adding extra
 * blank text nodes if necessary.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return object.kind == 'block' || object.kind == 'inline';
  },
  validate: function validate(node) {
    var invalids = node.nodes.reduce(function (list, child, index) {
      if (child.kind !== 'inline') return list;

      var prev = index > 0 ? node.nodes.get(index - 1) : null;
      var next = node.nodes.get(index + 1);
      // We don't test if "prev" is inline, since it has already been processed in the loop
      var insertBefore = !prev;
      var insertAfter = !next || next.kind == 'inline';

      if (insertAfter || insertBefore) {
        list = list.push({ insertAfter: insertAfter, insertBefore: insertBefore, index: index });
      }

      return list;
    }, new _immutable.List());

    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, block, invalids) {
    // Shift for every text node inserted previously.
    var shift = 0;

    invalids.forEach(function (_ref) {
      var index = _ref.index,
          insertAfter = _ref.insertAfter,
          insertBefore = _ref.insertBefore;

      if (insertBefore) {
        change.insertNodeByKey(block.key, shift + index, _text2.default.create(), OPTS);
        shift++;
      }

      if (insertAfter) {
        change.insertNodeByKey(block.key, shift + index + 1, _text2.default.create(), OPTS);
        shift++;
      }
    });
  }
},

/**
 * Merge adjacent text nodes.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return object.kind == 'block' || object.kind == 'inline';
  },
  validate: function validate(node) {
    var invalids = node.nodes.map(function (child, i) {
      var next = node.nodes.get(i + 1);
      if (child.kind != 'text') return;
      if (!next || next.kind != 'text') return;
      return next;
    }).filter(Boolean);

    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, node, invalids) {
    // Reverse the list to handle consecutive merges, since the earlier nodes
    // will always exist after each merge.
    invalids.reverse().forEach(function (n) {
      return change.mergeNodeByKey(n.key, OPTS);
    });
  }
},

/**
 * Prevent extra empty text nodes, except when adjacent to inline void nodes.
 *
 * @type {Object}
 */

{
  match: function match(object) {
    return object.kind == 'block' || object.kind == 'inline';
  },
  validate: function validate(node) {
    var nodes = node.nodes;

    if (nodes.size <= 1) return;

    var invalids = nodes.filter(function (desc, i) {
      if (desc.kind != 'text') return;
      if (desc.text.length > 0) return;

      var prev = i > 0 ? nodes.get(i - 1) : null;
      var next = nodes.get(i + 1);

      // If it's the first node, and the next is a void, preserve it.
      if (!prev && next.kind == 'inline') return;

      // It it's the last node, and the previous is an inline, preserve it.
      if (!next && prev.kind == 'inline') return;

      // If it's surrounded by inlines, preserve it.
      if (next && prev && next.kind == 'inline' && prev.kind == 'inline') return;

      // Otherwise, remove it.
      return true;
    });

    return invalids.size ? invalids : null;
  },
  normalize: function normalize(change, node, invalids) {
    invalids.forEach(function (text) {
      change.removeNodeByKey(text.key, OPTS);
    });
  }
}];

/**
 * Create the core schema.
 *
 * @type {Schema}
 */

var SCHEMA = _schema2.default.create({ rules: rules });

/**
 * Export.
 *
 * @type {Schema}
 */

exports.default = SCHEMA;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL2NvcmUuanMiXSwibmFtZXMiOlsiT1BUUyIsIm5vcm1hbGl6ZSIsInJ1bGVzIiwibWF0Y2giLCJub2RlIiwia2luZCIsInZhbGlkYXRlIiwiZG9jdW1lbnQiLCJpbnZhbGlkcyIsIm5vZGVzIiwiZmlsdGVyIiwibiIsInNpemUiLCJjaGFuZ2UiLCJmb3JFYWNoIiwicmVtb3ZlTm9kZUJ5S2V5Iiwia2V5IiwiYmxvY2siLCJmaXJzdCIsImtpbmRzIiwiaW5jbHVkZXMiLCJvYmplY3QiLCJpbmxpbmUiLCJ0ZXh0IiwiY3JlYXRlIiwiaW5zZXJ0Tm9kZUJ5S2V5IiwiaXNWb2lkIiwicmVzdWx0IiwiaW5kZXgiLCJjaGlsZCIsInJlZHVjZSIsImxpc3QiLCJwcmV2IiwiZ2V0IiwibmV4dCIsImluc2VydEJlZm9yZSIsImluc2VydEFmdGVyIiwicHVzaCIsInNoaWZ0IiwibWFwIiwiaSIsIkJvb2xlYW4iLCJyZXZlcnNlIiwibWVyZ2VOb2RlQnlLZXkiLCJkZXNjIiwibGVuZ3RoIiwiU0NIRU1BIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsT0FBTyxFQUFFQyxXQUFXOztBQUUxQjs7Ozs7O0FBRmEsQ0FBYixDQVFBLElBQU1DLFFBQVE7O0FBRVo7Ozs7OztBQU1BO0FBQ0VDLFNBQU8sZUFBQ0MsSUFBRCxFQUFVO0FBQ2YsV0FBT0EsS0FBS0MsSUFBTCxJQUFhLFVBQXBCO0FBQ0QsR0FISDtBQUlFQyxZQUFVLGtCQUFDQyxRQUFELEVBQWM7QUFDdEIsUUFBTUMsV0FBV0QsU0FBU0UsS0FBVCxDQUFlQyxNQUFmLENBQXNCO0FBQUEsYUFBS0MsRUFBRU4sSUFBRixJQUFVLE9BQWY7QUFBQSxLQUF0QixDQUFqQjtBQUNBLFdBQU9HLFNBQVNJLElBQVQsR0FBZ0JKLFFBQWhCLEdBQTJCLElBQWxDO0FBQ0QsR0FQSDtBQVFFUCxhQUFXLG1CQUFDWSxNQUFELEVBQVNO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O0FBQ0EsVUFBSSxDQUFDNkIsSUFBRCxJQUFTRixLQUFLM0IsSUFBTCxJQUFhLFFBQTFCLEVBQW9DOztBQUVwQztBQUNBLFVBQUk2QixRQUFRRixJQUFSLElBQWdCRSxLQUFLN0IsSUFBTCxJQUFhLFFBQTdCLElBQXlDMkIsS0FBSzNCLElBQUwsSUFBYSxRQUExRCxFQUFvRTs7QUFFcEU7QUFDQSxhQUFPLElBQVA7QUFDRCxLQWxCZ0IsQ0FBakI7O0FBb0JBLFdBQU9HLFNBQVNJLElBQVQsR0FBZ0JKLFFBQWhCLEdBQTJCLElBQWxDO0FBQ0QsR0E3Qkg7QUE4QkVQLGFBQVcsbUJBQUNZLE1BQUQsRUFBU1QsSUFBVCxFQUFlSSxRQUFmLEVBQTRCO0FBQ3JDQSxhQUFTTSxPQUFULENBQWlCLFVBQUNTLElBQUQsRUFBVTtBQUN6QlYsYUFBT0UsZUFBUCxDQUF1QlEsS0FBS1AsR0FBNUIsRUFBaUNoQixJQUFqQztBQUNELEtBRkQ7QUFHRDtBQWxDSCxDQTNPWSxDQUFkOztBQWtSQTs7Ozs7O0FBTUEsSUFBTThDLFNBQVMsaUJBQU90QixNQUFQLENBQWMsRUFBRXRCLFlBQUYsRUFBZCxDQUFmOztBQUVBOzs7Ozs7a0JBTWU0QyxNIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBTY2hlbWEgZnJvbSAnLi4vbW9kZWxzL3NjaGVtYSdcbmltcG9ydCBUZXh0IGZyb20gJy4uL21vZGVscy90ZXh0J1xuaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSdcblxuLyoqXG4gKiBPcHRpb25zIG9iamVjdCB3aXRoIG5vcm1hbGl6ZSBzZXQgdG8gYGZhbHNlYC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IE9QVFMgPSB7IG5vcm1hbGl6ZTogZmFsc2UgfVxuXG4vKipcbiAqIERlZmluZSB0aGUgY29yZSBzY2hlbWEgcnVsZXMsIG9yZGVyLXNlbnNpdGl2ZS5cbiAqXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cblxuY29uc3QgcnVsZXMgPSBbXG5cbiAgLyoqXG4gICAqIE9ubHkgYWxsb3cgYmxvY2sgbm9kZXMgaW4gZG9jdW1lbnRzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICB7XG4gICAgbWF0Y2g6IChub2RlKSA9PiB7XG4gICAgICByZXR1cm4gbm9kZS5raW5kID09ICdkb2N1bWVudCdcbiAgICB9LFxuICAgIHZhbGlkYXRlOiAoZG9jdW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGludmFsaWRzID0gZG9jdW1lbnQubm9kZXMuZmlsdGVyKG4gPT4gbi5raW5kICE9ICdibG9jaycpXG4gICAgICByZXR1cm4gaW52YWxpZHMuc2l6ZSA/IGludmFsaWRzIDogbnVsbFxuICAgIH0sXG4gICAgbm9ybWFsaXplOiAoY2hhbmdlLCBkb2N1bWVudCwgaW52YWxpZHMpID0+IHtcbiAgICAgIGludmFsaWRzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShub2RlLmtleSwgT1BUUylcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBPbmx5IGFsbG93IGJsb2NrIG5vZGVzIG9yIGlubGluZSBhbmQgdGV4dCBub2RlcyBpbiBibG9ja3MuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHtcbiAgICBtYXRjaDogKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBub2RlLmtpbmQgPT0gJ2Jsb2NrJ1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IChibG9jaykgPT4ge1xuICAgICAgY29uc3QgZmlyc3QgPSBibG9jay5ub2Rlcy5maXJzdCgpXG4gICAgICBpZiAoIWZpcnN0KSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCBraW5kcyA9IGZpcnN0LmtpbmQgPT0gJ2Jsb2NrJ1xuICAgICAgICA/IFsnYmxvY2snXVxuICAgICAgICA6IFsnaW5saW5lJywgJ3RleHQnXVxuXG4gICAgICBjb25zdCBpbnZhbGlkcyA9IGJsb2NrLm5vZGVzLmZpbHRlcihuID0+ICFraW5kcy5pbmNsdWRlcyhuLmtpbmQpKVxuICAgICAgcmV0dXJuIGludmFsaWRzLnNpemUgPyBpbnZhbGlkcyA6IG51bGxcbiAgICB9LFxuICAgIG5vcm1hbGl6ZTogKGNoYW5nZSwgYmxvY2ssIGludmFsaWRzKSA9PiB7XG4gICAgICBpbnZhbGlkcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIGNoYW5nZS5yZW1vdmVOb2RlQnlLZXkobm9kZS5rZXksIE9QVFMpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogT25seSBhbGxvdyBpbmxpbmUgYW5kIHRleHQgbm9kZXMgaW4gaW5saW5lcy5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAge1xuICAgIG1hdGNoOiAob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LmtpbmQgPT0gJ2lubGluZSdcbiAgICB9LFxuICAgIHZhbGlkYXRlOiAoaW5saW5lKSA9PiB7XG4gICAgICBjb25zdCBpbnZhbGlkcyA9IGlubGluZS5ub2Rlcy5maWx0ZXIobiA9PiBuLmtpbmQgIT0gJ2lubGluZScgJiYgbi5raW5kICE9ICd0ZXh0JylcbiAgICAgIHJldHVybiBpbnZhbGlkcy5zaXplID8gaW52YWxpZHMgOiBudWxsXG4gICAgfSxcbiAgICBub3JtYWxpemU6IChjaGFuZ2UsIGlubGluZSwgaW52YWxpZHMpID0+IHtcbiAgICAgIGludmFsaWRzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShub2RlLmtleSwgT1BUUylcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCBibG9jayBhbmQgaW5saW5lIG5vZGVzIGhhdmUgYXQgbGVhc3Qgb25lIHRleHQgY2hpbGQuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHtcbiAgICBtYXRjaDogKG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIG9iamVjdC5raW5kID09ICdibG9jaycgfHwgb2JqZWN0LmtpbmQgPT0gJ2lubGluZSdcbiAgICB9LFxuICAgIHZhbGlkYXRlOiAobm9kZSkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGUubm9kZXMuc2l6ZSA9PSAwXG4gICAgfSxcbiAgICBub3JtYWxpemU6IChjaGFuZ2UsIG5vZGUpID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSBUZXh0LmNyZWF0ZSgpXG4gICAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KG5vZGUua2V5LCAwLCB0ZXh0LCBPUFRTKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdm9pZCBub2RlcyBjb250YWluIGEgdGV4dCBub2RlIHdpdGggYSBzaW5nbGUgc3BhY2Ugb2YgdGV4dC5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAge1xuICAgIG1hdGNoOiAob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAob2JqZWN0LmtpbmQgPT0gJ2lubGluZScgfHwgb2JqZWN0LmtpbmQgPT0gJ2Jsb2NrJykgJiZcbiAgICAgICAgKG9iamVjdC5pc1ZvaWQpXG4gICAgICApXG4gICAgfSxcbiAgICB2YWxpZGF0ZTogKG5vZGUpID0+IHtcbiAgICAgIHJldHVybiBub2RlLnRleHQgIT09ICcgJyB8fCBub2RlLm5vZGVzLnNpemUgIT09IDFcbiAgICB9LFxuICAgIG5vcm1hbGl6ZTogKGNoYW5nZSwgbm9kZSwgcmVzdWx0KSA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gVGV4dC5jcmVhdGUoJyAnKVxuICAgICAgY29uc3QgaW5kZXggPSBub2RlLm5vZGVzLnNpemVcblxuICAgICAgY2hhbmdlLmluc2VydE5vZGVCeUtleShub2RlLmtleSwgaW5kZXgsIHRleHQsIE9QVFMpXG5cbiAgICAgIG5vZGUubm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleShjaGlsZC5rZXksIE9QVFMpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgaW5saW5lIG5vZGVzIGFyZSBuZXZlciBlbXB0eS5cbiAgICpcbiAgICogVGhpcyBydWxlIGlzIGFwcGxpZWQgdG8gYWxsIGJsb2NrcywgYmVjYXVzZSB3aGVuIHRoZXkgY29udGFpbiBhbiBlbXB0eVxuICAgKiBpbmxpbmUsIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBpbmxpbmUgZnJvbSB0aGF0IHBhcmVudCBibG9jay4gSWYgYHZhbGlkYXRlYFxuICAgKiB3YXMgdG8gYmUgbWVtb2l6ZWQsIGl0IHNob3VsZCBiZSBhZ2FpbnN0IHRoZSBwYXJlbnQgbm9kZSwgbm90IHRoZSBpbmxpbmVcbiAgICogdGhlbXNlbHZlcy5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAge1xuICAgIG1hdGNoOiAob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LmtpbmQgPT0gJ2Jsb2NrJ1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IChibG9jaykgPT4ge1xuICAgICAgY29uc3QgaW52YWxpZHMgPSBibG9jay5ub2Rlcy5maWx0ZXIobiA9PiBuLmtpbmQgPT0gJ2lubGluZScgJiYgbi50ZXh0ID09ICcnKVxuICAgICAgcmV0dXJuIGludmFsaWRzLnNpemUgPyBpbnZhbGlkcyA6IG51bGxcbiAgICB9LFxuICAgIG5vcm1hbGl6ZTogKGNoYW5nZSwgYmxvY2ssIGludmFsaWRzKSA9PiB7XG4gICAgICAvLyBJZiBhbGwgb2YgdGhlIGJsb2NrJ3Mgbm9kZXMgYXJlIGludmFsaWQsIGluc2VydCBhbiBlbXB0eSB0ZXh0IG5vZGUgc29cbiAgICAgIC8vIHRoYXQgdGhlIHNlbGVjdGlvbiB3aWxsIGJlIHByZXNlcnZlZCB3aGVuIHRoZXkgYXJlIGFsbCByZW1vdmVkLlxuICAgICAgaWYgKGJsb2NrLm5vZGVzLnNpemUgPT0gaW52YWxpZHMuc2l6ZSkge1xuICAgICAgICBjb25zdCB0ZXh0ID0gVGV4dC5jcmVhdGUoKVxuICAgICAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KGJsb2NrLmtleSwgMSwgdGV4dCwgT1BUUylcbiAgICAgIH1cblxuICAgICAgaW52YWxpZHMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBjaGFuZ2UucmVtb3ZlTm9kZUJ5S2V5KG5vZGUua2V5LCBPUFRTKVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IGlubGluZSB2b2lkIG5vZGVzIGFyZSBzdXJyb3VuZGVkIGJ5IHRleHQgbm9kZXMsIGJ5IGFkZGluZyBleHRyYVxuICAgKiBibGFuayB0ZXh0IG5vZGVzIGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAge1xuICAgIG1hdGNoOiAob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LmtpbmQgPT0gJ2Jsb2NrJyB8fCBvYmplY3Qua2luZCA9PSAnaW5saW5lJ1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IChub2RlKSA9PiB7XG4gICAgICBjb25zdCBpbnZhbGlkcyA9IG5vZGUubm9kZXMucmVkdWNlKChsaXN0LCBjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGNoaWxkLmtpbmQgIT09ICdpbmxpbmUnKSByZXR1cm4gbGlzdFxuXG4gICAgICAgIGNvbnN0IHByZXYgPSBpbmRleCA+IDAgPyBub2RlLm5vZGVzLmdldChpbmRleCAtIDEpIDogbnVsbFxuICAgICAgICBjb25zdCBuZXh0ID0gbm9kZS5ub2Rlcy5nZXQoaW5kZXggKyAxKVxuICAgICAgICAvLyBXZSBkb24ndCB0ZXN0IGlmIFwicHJldlwiIGlzIGlubGluZSwgc2luY2UgaXQgaGFzIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQgaW4gdGhlIGxvb3BcbiAgICAgICAgY29uc3QgaW5zZXJ0QmVmb3JlID0gIXByZXZcbiAgICAgICAgY29uc3QgaW5zZXJ0QWZ0ZXIgPSAhbmV4dCB8fCAobmV4dC5raW5kID09ICdpbmxpbmUnKVxuXG4gICAgICAgIGlmIChpbnNlcnRBZnRlciB8fCBpbnNlcnRCZWZvcmUpIHtcbiAgICAgICAgICBsaXN0ID0gbGlzdC5wdXNoKHsgaW5zZXJ0QWZ0ZXIsIGluc2VydEJlZm9yZSwgaW5kZXggfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgICB9LCBuZXcgTGlzdCgpKVxuXG4gICAgICByZXR1cm4gaW52YWxpZHMuc2l6ZSA/IGludmFsaWRzIDogbnVsbFxuICAgIH0sXG4gICAgbm9ybWFsaXplOiAoY2hhbmdlLCBibG9jaywgaW52YWxpZHMpID0+IHtcbiAgICAgIC8vIFNoaWZ0IGZvciBldmVyeSB0ZXh0IG5vZGUgaW5zZXJ0ZWQgcHJldmlvdXNseS5cbiAgICAgIGxldCBzaGlmdCA9IDBcblxuICAgICAgaW52YWxpZHMuZm9yRWFjaCgoeyBpbmRleCwgaW5zZXJ0QWZ0ZXIsIGluc2VydEJlZm9yZSB9KSA9PiB7XG4gICAgICAgIGlmIChpbnNlcnRCZWZvcmUpIHtcbiAgICAgICAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KGJsb2NrLmtleSwgc2hpZnQgKyBpbmRleCwgVGV4dC5jcmVhdGUoKSwgT1BUUylcbiAgICAgICAgICBzaGlmdCsrXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5zZXJ0QWZ0ZXIpIHtcbiAgICAgICAgICBjaGFuZ2UuaW5zZXJ0Tm9kZUJ5S2V5KGJsb2NrLmtleSwgc2hpZnQgKyBpbmRleCArIDEsIFRleHQuY3JlYXRlKCksIE9QVFMpXG4gICAgICAgICAgc2hpZnQrK1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogTWVyZ2UgYWRqYWNlbnQgdGV4dCBub2Rlcy5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG5cbiAge1xuICAgIG1hdGNoOiAob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LmtpbmQgPT0gJ2Jsb2NrJyB8fCBvYmplY3Qua2luZCA9PSAnaW5saW5lJ1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IChub2RlKSA9PiB7XG4gICAgICBjb25zdCBpbnZhbGlkcyA9IG5vZGUubm9kZXNcbiAgICAgICAgLm1hcCgoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gbm9kZS5ub2Rlcy5nZXQoaSArIDEpXG4gICAgICAgICAgaWYgKGNoaWxkLmtpbmQgIT0gJ3RleHQnKSByZXR1cm5cbiAgICAgICAgICBpZiAoIW5leHQgfHwgbmV4dC5raW5kICE9ICd0ZXh0JykgcmV0dXJuXG4gICAgICAgICAgcmV0dXJuIG5leHRcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuXG4gICAgICByZXR1cm4gaW52YWxpZHMuc2l6ZSA/IGludmFsaWRzIDogbnVsbFxuICAgIH0sXG4gICAgbm9ybWFsaXplOiAoY2hhbmdlLCBub2RlLCBpbnZhbGlkcykgPT4ge1xuICAgICAgLy8gUmV2ZXJzZSB0aGUgbGlzdCB0byBoYW5kbGUgY29uc2VjdXRpdmUgbWVyZ2VzLCBzaW5jZSB0aGUgZWFybGllciBub2Rlc1xuICAgICAgLy8gd2lsbCBhbHdheXMgZXhpc3QgYWZ0ZXIgZWFjaCBtZXJnZS5cbiAgICAgIGludmFsaWRzLnJldmVyc2UoKS5mb3JFYWNoKG4gPT4gY2hhbmdlLm1lcmdlTm9kZUJ5S2V5KG4ua2V5LCBPUFRTKSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFByZXZlbnQgZXh0cmEgZW1wdHkgdGV4dCBub2RlcywgZXhjZXB0IHdoZW4gYWRqYWNlbnQgdG8gaW5saW5lIHZvaWQgbm9kZXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuXG4gIHtcbiAgICBtYXRjaDogKG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIG9iamVjdC5raW5kID09ICdibG9jaycgfHwgb2JqZWN0LmtpbmQgPT0gJ2lubGluZSdcbiAgICB9LFxuICAgIHZhbGlkYXRlOiAobm9kZSkgPT4ge1xuICAgICAgY29uc3QgeyBub2RlcyB9ID0gbm9kZVxuICAgICAgaWYgKG5vZGVzLnNpemUgPD0gMSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGludmFsaWRzID0gbm9kZXMuZmlsdGVyKChkZXNjLCBpKSA9PiB7XG4gICAgICAgIGlmIChkZXNjLmtpbmQgIT0gJ3RleHQnKSByZXR1cm5cbiAgICAgICAgaWYgKGRlc2MudGV4dC5sZW5ndGggPiAwKSByZXR1cm5cblxuICAgICAgICBjb25zdCBwcmV2ID0gaSA+IDAgPyBub2Rlcy5nZXQoaSAtIDEpIDogbnVsbFxuICAgICAgICBjb25zdCBuZXh0ID0gbm9kZXMuZ2V0KGkgKyAxKVxuXG4gICAgICAgIC8vIElmIGl0J3MgdGhlIGZpcnN0IG5vZGUsIGFuZCB0aGUgbmV4dCBpcyBhIHZvaWQsIHByZXNlcnZlIGl0LlxuICAgICAgICBpZiAoIXByZXYgJiYgbmV4dC5raW5kID09ICdpbmxpbmUnKSByZXR1cm5cblxuICAgICAgICAvLyBJdCBpdCdzIHRoZSBsYXN0IG5vZGUsIGFuZCB0aGUgcHJldmlvdXMgaXMgYW4gaW5saW5lLCBwcmVzZXJ2ZSBpdC5cbiAgICAgICAgaWYgKCFuZXh0ICYmIHByZXYua2luZCA9PSAnaW5saW5lJykgcmV0dXJuXG5cbiAgICAgICAgLy8gSWYgaXQncyBzdXJyb3VuZGVkIGJ5IGlubGluZXMsIHByZXNlcnZlIGl0LlxuICAgICAgICBpZiAobmV4dCAmJiBwcmV2ICYmIG5leHQua2luZCA9PSAnaW5saW5lJyAmJiBwcmV2LmtpbmQgPT0gJ2lubGluZScpIHJldHVyblxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgcmVtb3ZlIGl0LlxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGludmFsaWRzLnNpemUgPyBpbnZhbGlkcyA6IG51bGxcbiAgICB9LFxuICAgIG5vcm1hbGl6ZTogKGNoYW5nZSwgbm9kZSwgaW52YWxpZHMpID0+IHtcbiAgICAgIGludmFsaWRzLmZvckVhY2goKHRleHQpID0+IHtcbiAgICAgICAgY2hhbmdlLnJlbW92ZU5vZGVCeUtleSh0ZXh0LmtleSwgT1BUUylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbl1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIGNvcmUgc2NoZW1hLlxuICpcbiAqIEB0eXBlIHtTY2hlbWF9XG4gKi9cblxuY29uc3QgU0NIRU1BID0gU2NoZW1hLmNyZWF0ZSh7IHJ1bGVzIH0pXG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtTY2hlbWF9XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgU0NIRU1BXG4iXX0=