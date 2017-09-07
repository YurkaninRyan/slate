'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('../models/schema');

var _schema2 = _interopRequireDefault(_schema);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Normalize the document and selection with a `schema`.
 *
 * @param {Change} change
 * @param {Schema} schema
 */

Changes.normalize = function (change, schema) {
  change.normalizeDocument(schema);
};

/**
 * Normalize the document with a `schema`.
 *
 * @param {Change} change
 * @param {Schema} schema
 */

Changes.normalizeDocument = function (change, schema) {
  var state = change.state;
  var document = state.document;

  change.normalizeNodeByKey(document.key, schema);
};

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Change} change
 * @param {Node|String} key
 * @param {Schema} schema
 */

Changes.normalizeNodeByKey = function (change, key, schema) {
  assertSchema(schema);

  // If the schema has no validation rules, there's nothing to normalize.
  if (!schema.hasValidators) return;

  var state = change.state;
  var document = state.document;

  var node = document.assertNode(key);
  normalizeNodeAndChildren(change, node, schema);
};

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNodeAndChildren(change, node, schema) {
  if (node.kind == 'text') {
    normalizeNode(change, node, schema);
    return;
  }

  // We can't just loop the children and normalize them, because in the process
  // of normalizing one child, we might end up creating another. Instead, we
  // have to normalize one at a time, and check for new children along the way.
  // PERF: use a mutable array here instead of an immutable stack.
  var keys = node.nodes.toArray().map(function (n) {
    return n.key;
  });

  // While there is still a child key that hasn't been normalized yet...

  var _loop = function _loop() {
    var ops = change.operations.length;
    var key = void 0;

    // PERF: use a mutable set here since we'll be add to it a lot.
    var set = new _immutable.Set().asMutable();

    // Unwind the stack, normalizing every child and adding it to the set.
    while (key = keys[0]) {
      var child = node.getChild(key);
      normalizeNodeAndChildren(change, child, schema);
      set.add(key);
      keys.shift();
    }

    // Turn the set immutable to be able to compare against it.
    set = set.asImmutable();

    // PERF: Only re-find the node and re-normalize any new children if
    // operations occured that might have changed it.
    if (change.operations.length != ops) {
      node = refindNode(change, node);

      // Add any new children back onto the stack.
      node.nodes.forEach(function (n) {
        if (set.has(n.key)) return;
        keys.unshift(n.key);
      });
    }
  };

  while (keys.length) {
    _loop();
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(change, node, schema);
  }
}

/**
 * Re-find a reference to a node that may have been modified or removed
 * entirely by a change.
 *
 * @param {Change} change
 * @param {Node} node
 * @return {Node}
 */

function refindNode(change, node) {
  var state = change.state;
  var document = state.document;

  return node.kind == 'document' ? document : document.getDescendant(node.key);
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNode(change, node, schema) {
  var max = schema.rules.length;
  var iterations = 0;

  function iterate(t, n) {
    var failure = n.validate(schema);
    if (!failure) return;

    // Run the `normalize` function for the rule with the invalid value.
    var value = failure.value,
        rule = failure.rule;

    rule.normalize(t, n, value);

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = refindNode(t, n);
    if (!n) return;

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `validate` or
    // `normalize` function of a schema rule to be written incorrectly and for
    // an infinite invalid loop to occur.
    iterations++;

    if (iterations > max) {
      throw new Error('A schema rule could not be validated after sufficient iterations. This is usually due to a `rule.validate` or `rule.normalize` function of a schema being incorrectly written, causing an infinite loop.');
    }

    // Otherwise, iterate again.
    iterate(t, n);
  }

  iterate(change, node);
}

/**
 * Assert that a `schema` exists.
 *
 * @param {Schema} schema
 */

function assertSchema(schema) {
  if (_schema2.default.isSchema(schema)) {
    return;
  } else if (schema == null) {
    throw new Error('You must pass a `schema` object.');
  } else {
    throw new Error('You passed an invalid `schema` object: ' + schema + '.');
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFuZ2VzL25vcm1hbGl6ZS5qcyJdLCJuYW1lcyI6WyJDaGFuZ2VzIiwibm9ybWFsaXplIiwiY2hhbmdlIiwic2NoZW1hIiwibm9ybWFsaXplRG9jdW1lbnQiLCJzdGF0ZSIsImRvY3VtZW50Iiwibm9ybWFsaXplTm9kZUJ5S2V5Iiwia2V5IiwiYXNzZXJ0U2NoZW1hIiwiaGFzVmFsaWRhdG9ycyIsIm5vZGUiLCJhc3NlcnROb2RlIiwibm9ybWFsaXplTm9kZUFuZENoaWxkcmVuIiwia2luZCIsIm5vcm1hbGl6ZU5vZGUiLCJrZXlzIiwibm9kZXMiLCJ0b0FycmF5IiwibWFwIiwibiIsIm9wcyIsIm9wZXJhdGlvbnMiLCJsZW5ndGgiLCJzZXQiLCJhc011dGFibGUiLCJjaGlsZCIsImdldENoaWxkIiwiYWRkIiwic2hpZnQiLCJhc0ltbXV0YWJsZSIsInJlZmluZE5vZGUiLCJmb3JFYWNoIiwiaGFzIiwidW5zaGlmdCIsImdldERlc2NlbmRhbnQiLCJtYXgiLCJydWxlcyIsIml0ZXJhdGlvbnMiLCJpdGVyYXRlIiwidCIsImZhaWx1cmUiLCJ2YWxpZGF0ZSIsInZhbHVlIiwicnVsZSIsIkVycm9yIiwiaXNTY2hlbWEiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsVUFBVSxFQUFoQjs7QUFFQTs7Ozs7OztBQU9BQSxRQUFRQyxTQUFSLEdBQW9CLFVBQUNDLE1BQUQsRUFBU0MsTUFBVCxFQUFvQjtBQUN0Q0QsU0FBT0UsaUJBQVAsQ0FBeUJELE1BQXpCO0FBQ0QsQ0FGRDs7QUFJQTs7Ozs7OztBQU9BSCxRQUFRSSxpQkFBUixHQUE0QixVQUFDRixNQUFELEVBQVNDLE1BQVQsRUFBb0I7QUFBQSxNQUN0Q0UsS0FEc0MsR0FDNUJILE1BRDRCLENBQ3RDRyxLQURzQztBQUFBLE1BRXRDQyxRQUZzQyxHQUV6QkQsS0FGeUIsQ0FFdENDLFFBRnNDOztBQUc5Q0osU0FBT0ssa0JBQVAsQ0FB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QixFQUFvQnBCLENBQXBCLEVBQXVCO0FBQ3JCLFFBQU1xQixVQUFVckIsRUFBRXNCLFFBQUYsQ0FBV3ZDLE1BQVgsQ0FBaEI7QUFDQSxRQUFJLENBQUNzQyxPQUFMLEVBQWM7O0FBRWQ7QUFKcUIsUUFLYkUsS0FMYSxHQUtHRixPQUxILENBS2JFLEtBTGE7QUFBQSxRQUtOQyxJQUxNLEdBS0dILE9BTEgsQ0FLTkcsSUFMTTs7QUFNckJBLFNBQUszQyxTQUFMLENBQWV1QyxDQUFmLEVBQWtCcEIsQ0FBbEIsRUFBcUJ1QixLQUFyQjs7QUFFQTtBQUNBO0FBQ0F2QixRQUFJVyxXQUFXUyxDQUFYLEVBQWNwQixDQUFkLENBQUo7QUFDQSxRQUFJLENBQUNBLENBQUwsRUFBUTs7QUFFUjtBQUNBO0FBQ0E7QUFDQTtBQUNBa0I7O0FBRUEsUUFBSUEsYUFBYUYsR0FBakIsRUFBc0I7QUFDcEIsWUFBTSxJQUFJUyxLQUFKLENBQVUsME1BQVYsQ0FBTjtBQUNEOztBQUVEO0FBQ0FOLFlBQVFDLENBQVIsRUFBV3BCLENBQVg7QUFDRDs7QUFFRG1CLFVBQVFyQyxNQUFSLEVBQWdCUyxJQUFoQjtBQUNEOztBQUVEOzs7Ozs7QUFNQSxTQUFTRixZQUFULENBQXNCTixNQUF0QixFQUE4QjtBQUM1QixNQUFJLGlCQUFPMkMsUUFBUCxDQUFnQjNDLE1BQWhCLENBQUosRUFBNkI7QUFDM0I7QUFDRCxHQUZELE1BRU8sSUFBSUEsVUFBVSxJQUFkLEVBQW9CO0FBQ3pCLFVBQU0sSUFBSTBDLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsVUFBTSxJQUFJQSxLQUFKLDZDQUFzRDFDLE1BQXRELE9BQU47QUFDRDtBQUNGOztBQUVEOzs7Ozs7a0JBTWVILE8iLCJmaWxlIjoibm9ybWFsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgU2NoZW1hIGZyb20gJy4uL21vZGVscy9zY2hlbWEnXG5pbXBvcnQgeyBTZXQgfSBmcm9tICdpbW11dGFibGUnXG5cbi8qKlxuICogQ2hhbmdlcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5cbmNvbnN0IENoYW5nZXMgPSB7fVxuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGUgZG9jdW1lbnQgYW5kIHNlbGVjdGlvbiB3aXRoIGEgYHNjaGVtYWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICovXG5cbkNoYW5nZXMubm9ybWFsaXplID0gKGNoYW5nZSwgc2NoZW1hKSA9PiB7XG4gIGNoYW5nZS5ub3JtYWxpemVEb2N1bWVudChzY2hlbWEpXG59XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBkb2N1bWVudCB3aXRoIGEgYHNjaGVtYWAuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICovXG5cbkNoYW5nZXMubm9ybWFsaXplRG9jdW1lbnQgPSAoY2hhbmdlLCBzY2hlbWEpID0+IHtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY2hhbmdlXG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHN0YXRlXG4gIGNoYW5nZS5ub3JtYWxpemVOb2RlQnlLZXkoZG9jdW1lbnQua2V5LCBzY2hlbWEpXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgYG5vZGVgIGFuZCBpdHMgY2hpbGRyZW4gd2l0aCBhIGBzY2hlbWFgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7Tm9kZXxTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICovXG5cbkNoYW5nZXMubm9ybWFsaXplTm9kZUJ5S2V5ID0gKGNoYW5nZSwga2V5LCBzY2hlbWEpID0+IHtcbiAgYXNzZXJ0U2NoZW1hKHNjaGVtYSlcblxuICAvLyBJZiB0aGUgc2NoZW1hIGhhcyBubyB2YWxpZGF0aW9uIHJ1bGVzLCB0aGVyZSdzIG5vdGhpbmcgdG8gbm9ybWFsaXplLlxuICBpZiAoIXNjaGVtYS5oYXNWYWxpZGF0b3JzKSByZXR1cm5cblxuICBjb25zdCB7IHN0YXRlIH0gPSBjaGFuZ2VcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gc3RhdGVcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmFzc2VydE5vZGUoa2V5KVxuICBub3JtYWxpemVOb2RlQW5kQ2hpbGRyZW4oY2hhbmdlLCBub2RlLCBzY2hlbWEpXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgYG5vZGVgIGFuZCBpdHMgY2hpbGRyZW4gd2l0aCBhIGBzY2hlbWFgLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5vZGVBbmRDaGlsZHJlbihjaGFuZ2UsIG5vZGUsIHNjaGVtYSkge1xuICBpZiAobm9kZS5raW5kID09ICd0ZXh0Jykge1xuICAgIG5vcm1hbGl6ZU5vZGUoY2hhbmdlLCBub2RlLCBzY2hlbWEpXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBXZSBjYW4ndCBqdXN0IGxvb3AgdGhlIGNoaWxkcmVuIGFuZCBub3JtYWxpemUgdGhlbSwgYmVjYXVzZSBpbiB0aGUgcHJvY2Vzc1xuICAvLyBvZiBub3JtYWxpemluZyBvbmUgY2hpbGQsIHdlIG1pZ2h0IGVuZCB1cCBjcmVhdGluZyBhbm90aGVyLiBJbnN0ZWFkLCB3ZVxuICAvLyBoYXZlIHRvIG5vcm1hbGl6ZSBvbmUgYXQgYSB0aW1lLCBhbmQgY2hlY2sgZm9yIG5ldyBjaGlsZHJlbiBhbG9uZyB0aGUgd2F5LlxuICAvLyBQRVJGOiB1c2UgYSBtdXRhYmxlIGFycmF5IGhlcmUgaW5zdGVhZCBvZiBhbiBpbW11dGFibGUgc3RhY2suXG4gIGNvbnN0IGtleXMgPSBub2RlLm5vZGVzLnRvQXJyYXkoKS5tYXAobiA9PiBuLmtleSlcblxuICAvLyBXaGlsZSB0aGVyZSBpcyBzdGlsbCBhIGNoaWxkIGtleSB0aGF0IGhhc24ndCBiZWVuIG5vcm1hbGl6ZWQgeWV0Li4uXG4gIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgIGNvbnN0IG9wcyA9IGNoYW5nZS5vcGVyYXRpb25zLmxlbmd0aFxuICAgIGxldCBrZXlcblxuICAgIC8vIFBFUkY6IHVzZSBhIG11dGFibGUgc2V0IGhlcmUgc2luY2Ugd2UnbGwgYmUgYWRkIHRvIGl0IGEgbG90LlxuICAgIGxldCBzZXQgPSBuZXcgU2V0KCkuYXNNdXRhYmxlKClcblxuICAgIC8vIFVud2luZCB0aGUgc3RhY2ssIG5vcm1hbGl6aW5nIGV2ZXJ5IGNoaWxkIGFuZCBhZGRpbmcgaXQgdG8gdGhlIHNldC5cbiAgICB3aGlsZSAoa2V5ID0ga2V5c1swXSkge1xuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmdldENoaWxkKGtleSlcbiAgICAgIG5vcm1hbGl6ZU5vZGVBbmRDaGlsZHJlbihjaGFuZ2UsIGNoaWxkLCBzY2hlbWEpXG4gICAgICBzZXQuYWRkKGtleSlcbiAgICAgIGtleXMuc2hpZnQoKVxuICAgIH1cblxuICAgIC8vIFR1cm4gdGhlIHNldCBpbW11dGFibGUgdG8gYmUgYWJsZSB0byBjb21wYXJlIGFnYWluc3QgaXQuXG4gICAgc2V0ID0gc2V0LmFzSW1tdXRhYmxlKClcblxuICAgIC8vIFBFUkY6IE9ubHkgcmUtZmluZCB0aGUgbm9kZSBhbmQgcmUtbm9ybWFsaXplIGFueSBuZXcgY2hpbGRyZW4gaWZcbiAgICAvLyBvcGVyYXRpb25zIG9jY3VyZWQgdGhhdCBtaWdodCBoYXZlIGNoYW5nZWQgaXQuXG4gICAgaWYgKGNoYW5nZS5vcGVyYXRpb25zLmxlbmd0aCAhPSBvcHMpIHtcbiAgICAgIG5vZGUgPSByZWZpbmROb2RlKGNoYW5nZSwgbm9kZSlcblxuICAgICAgLy8gQWRkIGFueSBuZXcgY2hpbGRyZW4gYmFjayBvbnRvIHRoZSBzdGFjay5cbiAgICAgIG5vZGUubm9kZXMuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAoc2V0LmhhcyhuLmtleSkpIHJldHVyblxuICAgICAgICBrZXlzLnVuc2hpZnQobi5rZXkpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgbm9kZSBpdHNlbGYgaWYgaXQgc3RpbGwgZXhpc3RzLlxuICBpZiAobm9kZSkge1xuICAgIG5vcm1hbGl6ZU5vZGUoY2hhbmdlLCBub2RlLCBzY2hlbWEpXG4gIH1cbn1cblxuLyoqXG4gKiBSZS1maW5kIGEgcmVmZXJlbmNlIHRvIGEgbm9kZSB0aGF0IG1heSBoYXZlIGJlZW4gbW9kaWZpZWQgb3IgcmVtb3ZlZFxuICogZW50aXJlbHkgYnkgYSBjaGFuZ2UuXG4gKlxuICogQHBhcmFtIHtDaGFuZ2V9IGNoYW5nZVxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5cbmZ1bmN0aW9uIHJlZmluZE5vZGUoY2hhbmdlLCBub2RlKSB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNoYW5nZVxuICBjb25zdCB7IGRvY3VtZW50IH0gPSBzdGF0ZVxuICByZXR1cm4gbm9kZS5raW5kID09ICdkb2N1bWVudCdcbiAgICA/IGRvY3VtZW50XG4gICAgOiBkb2N1bWVudC5nZXREZXNjZW5kYW50KG5vZGUua2V5KVxufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIGBub2RlYCB3aXRoIGEgYHNjaGVtYWAsIGJ1dCBub3QgaXRzIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7Q2hhbmdlfSBjaGFuZ2VcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5vZGUoY2hhbmdlLCBub2RlLCBzY2hlbWEpIHtcbiAgY29uc3QgbWF4ID0gc2NoZW1hLnJ1bGVzLmxlbmd0aFxuICBsZXQgaXRlcmF0aW9ucyA9IDBcblxuICBmdW5jdGlvbiBpdGVyYXRlKHQsIG4pIHtcbiAgICBjb25zdCBmYWlsdXJlID0gbi52YWxpZGF0ZShzY2hlbWEpXG4gICAgaWYgKCFmYWlsdXJlKSByZXR1cm5cblxuICAgIC8vIFJ1biB0aGUgYG5vcm1hbGl6ZWAgZnVuY3Rpb24gZm9yIHRoZSBydWxlIHdpdGggdGhlIGludmFsaWQgdmFsdWUuXG4gICAgY29uc3QgeyB2YWx1ZSwgcnVsZSB9ID0gZmFpbHVyZVxuICAgIHJ1bGUubm9ybWFsaXplKHQsIG4sIHZhbHVlKVxuXG4gICAgLy8gUmUtZmluZCB0aGUgbm9kZSByZWZlcmVuY2UsIGluIGNhc2UgaXQgd2FzIHVwZGF0ZWQuIElmIHRoZSBub2RlIG5vIGxvbmdlclxuICAgIC8vIGV4aXN0cywgd2UncmUgZG9uZSBmb3IgdGhpcyBicmFuY2guXG4gICAgbiA9IHJlZmluZE5vZGUodCwgbilcbiAgICBpZiAoIW4pIHJldHVyblxuXG4gICAgLy8gSW5jcmVtZW50IHRoZSBpdGVyYXRpb25zIGNvdW50ZXIsIGFuZCBjaGVjayB0byBtYWtlIHN1cmUgdGhhdCB3ZSBoYXZlbid0XG4gICAgLy8gZXhjZWVkZWQgdGhlIG1heC4gV2l0aG91dCB0aGlzIGNoZWNrLCBpdCdzIGVhc3kgZm9yIHRoZSBgdmFsaWRhdGVgIG9yXG4gICAgLy8gYG5vcm1hbGl6ZWAgZnVuY3Rpb24gb2YgYSBzY2hlbWEgcnVsZSB0byBiZSB3cml0dGVuIGluY29ycmVjdGx5IGFuZCBmb3JcbiAgICAvLyBhbiBpbmZpbml0ZSBpbnZhbGlkIGxvb3AgdG8gb2NjdXIuXG4gICAgaXRlcmF0aW9ucysrXG5cbiAgICBpZiAoaXRlcmF0aW9ucyA+IG1heCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHNjaGVtYSBydWxlIGNvdWxkIG5vdCBiZSB2YWxpZGF0ZWQgYWZ0ZXIgc3VmZmljaWVudCBpdGVyYXRpb25zLiBUaGlzIGlzIHVzdWFsbHkgZHVlIHRvIGEgYHJ1bGUudmFsaWRhdGVgIG9yIGBydWxlLm5vcm1hbGl6ZWAgZnVuY3Rpb24gb2YgYSBzY2hlbWEgYmVpbmcgaW5jb3JyZWN0bHkgd3JpdHRlbiwgY2F1c2luZyBhbiBpbmZpbml0ZSBsb29wLicpXG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBpdGVyYXRlIGFnYWluLlxuICAgIGl0ZXJhdGUodCwgbilcbiAgfVxuXG4gIGl0ZXJhdGUoY2hhbmdlLCBub2RlKVxufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IGEgYHNjaGVtYWAgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7U2NoZW1hfSBzY2hlbWFcbiAqL1xuXG5mdW5jdGlvbiBhc3NlcnRTY2hlbWEoc2NoZW1hKSB7XG4gIGlmIChTY2hlbWEuaXNTY2hlbWEoc2NoZW1hKSkge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKHNjaGVtYSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBwYXNzIGEgYHNjaGVtYWAgb2JqZWN0LicpXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBZb3UgcGFzc2VkIGFuIGludmFsaWQgXFxgc2NoZW1hXFxgIG9iamVjdDogJHtzY2hlbWF9LmApXG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VzXG4iXX0=