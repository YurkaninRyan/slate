'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Set data with `type` and `content` on a `dataTransfer` object.
 *
 * COMPAT: In Edge, custom types throw errors, so embed all non-standard
 * types in text/plain compound object. (2017/7/12)
 *
 * @param {DataTransfer} dataTransfer
 * @param {String} type
 * @param {String} content
 */

function setTransferData(dataTransfer, type, content) {
  try {
    dataTransfer.setData(type, content);
  } catch (err) {
    var prefix = 'SLATE-DATA-EMBED::';
    var text = dataTransfer.getData('text/plain');
    var obj = {};

    // If the existing plain text data is prefixed, it's Slate JSON data.
    if (text.substring(0, prefix.length) === prefix) {
      try {
        obj = JSON.parse(text.substring(prefix.length));
      } catch (e) {
        throw new Error('Failed to parse Slate data from `DataTransfer` object.');
      }
    }

    // Otherwise, it's just set it as is.
    else {
        obj['text/plain'] = text;
      }

    obj[type] = content;
    var string = '' + prefix + JSON.stringify(obj);
    dataTransfer.setData('text/plain', string);
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = setTransferData;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zZXQtdHJhbnNmZXItZGF0YS5qcyJdLCJuYW1lcyI6WyJzZXRUcmFuc2ZlckRhdGEiLCJkYXRhVHJhbnNmZXIiLCJ0eXBlIiwiY29udGVudCIsInNldERhdGEiLCJlcnIiLCJwcmVmaXgiLCJ0ZXh0IiwiZ2V0RGF0YSIsIm9iaiIsInN1YnN0cmluZyIsImxlbmd0aCIsIkpTT04iLCJwYXJzZSIsImUiLCJFcnJvciIsInN0cmluZyIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBV0EsU0FBU0EsZUFBVCxDQUF5QkMsWUFBekIsRUFBdUNDLElBQXZDLEVBQTZDQyxPQUE3QyxFQUFzRDtBQUNwRCxNQUFJO0FBQ0ZGLGlCQUFhRyxPQUFiLENBQXFCRixJQUFyQixFQUEyQkMsT0FBM0I7QUFDRCxHQUZELENBRUUsT0FBT0UsR0FBUCxFQUFZO0FBQ1osUUFBTUMsU0FBUyxvQkFBZjtBQUNBLFFBQU1DLE9BQU9OLGFBQWFPLE9BQWIsQ0FBcUIsWUFBckIsQ0FBYjtBQUNBLFFBQUlDLE1BQU0sRUFBVjs7QUFFQTtBQUNBLFFBQUlGLEtBQUtHLFNBQUwsQ0FBZSxDQUFmLEVBQWtCSixPQUFPSyxNQUF6QixNQUFxQ0wsTUFBekMsRUFBaUQ7QUFDL0MsVUFBSTtBQUNGRyxjQUFNRyxLQUFLQyxLQUFMLENBQVdOLEtBQUtHLFNBQUwsQ0FBZUosT0FBT0ssTUFBdEIsQ0FBWCxDQUFOO0FBQ0QsT0FGRCxDQUVFLE9BQU9HLENBQVAsRUFBVTtBQUNWLGNBQU0sSUFBSUMsS0FBSixDQUFVLHdEQUFWLENBQU47QUFDRDtBQUNGOztBQUVEO0FBUkEsU0FTSztBQUNITixZQUFJLFlBQUosSUFBb0JGLElBQXBCO0FBQ0Q7O0FBRURFLFFBQUlQLElBQUosSUFBWUMsT0FBWjtBQUNBLFFBQU1hLGNBQVlWLE1BQVosR0FBcUJNLEtBQUtLLFNBQUwsQ0FBZVIsR0FBZixDQUEzQjtBQUNBUixpQkFBYUcsT0FBYixDQUFxQixZQUFyQixFQUFtQ1ksTUFBbkM7QUFDRDtBQUNGOztBQUVEOzs7Ozs7a0JBTWVoQixlIiwiZmlsZSI6InNldC10cmFuc2Zlci1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIFNldCBkYXRhIHdpdGggYHR5cGVgIGFuZCBgY29udGVudGAgb24gYSBgZGF0YVRyYW5zZmVyYCBvYmplY3QuXG4gKlxuICogQ09NUEFUOiBJbiBFZGdlLCBjdXN0b20gdHlwZXMgdGhyb3cgZXJyb3JzLCBzbyBlbWJlZCBhbGwgbm9uLXN0YW5kYXJkXG4gKiB0eXBlcyBpbiB0ZXh0L3BsYWluIGNvbXBvdW5kIG9iamVjdC4gKDIwMTcvNy8xMilcbiAqXG4gKiBAcGFyYW0ge0RhdGFUcmFuc2Zlcn0gZGF0YVRyYW5zZmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnRcbiAqL1xuXG5mdW5jdGlvbiBzZXRUcmFuc2ZlckRhdGEoZGF0YVRyYW5zZmVyLCB0eXBlLCBjb250ZW50KSB7XG4gIHRyeSB7XG4gICAgZGF0YVRyYW5zZmVyLnNldERhdGEodHlwZSwgY29udGVudClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJ1NMQVRFLURBVEEtRU1CRUQ6OidcbiAgICBjb25zdCB0ZXh0ID0gZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvcGxhaW4nKVxuICAgIGxldCBvYmogPSB7fVxuXG4gICAgLy8gSWYgdGhlIGV4aXN0aW5nIHBsYWluIHRleHQgZGF0YSBpcyBwcmVmaXhlZCwgaXQncyBTbGF0ZSBKU09OIGRhdGEuXG4gICAgaWYgKHRleHQuc3Vic3RyaW5nKDAsIHByZWZpeC5sZW5ndGgpID09PSBwcmVmaXgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG9iaiA9IEpTT04ucGFyc2UodGV4dC5zdWJzdHJpbmcocHJlZml4Lmxlbmd0aCkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHBhcnNlIFNsYXRlIGRhdGEgZnJvbSBgRGF0YVRyYW5zZmVyYCBvYmplY3QuJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGl0J3MganVzdCBzZXQgaXQgYXMgaXMuXG4gICAgZWxzZSB7XG4gICAgICBvYmpbJ3RleHQvcGxhaW4nXSA9IHRleHRcbiAgICB9XG5cbiAgICBvYmpbdHlwZV0gPSBjb250ZW50XG4gICAgY29uc3Qgc3RyaW5nID0gYCR7cHJlZml4fSR7SlNPTi5zdHJpbmdpZnkob2JqKX1gXG4gICAgZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCBzdHJpbmcpXG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvcnQuXG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IHNldFRyYW5zZmVyRGF0YVxuIl19