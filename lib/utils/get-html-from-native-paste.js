'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require('react-dom');

/**
 * Get clipboard HTML data by capturing the HTML inserted by the browser's
 * native paste action. To make this work, `preventDefault()` may not be
 * called on the `onPaste` event. As this method is asynchronous, a callback
 * is needed to return the HTML content. This solution was adapted from
 * http://stackoverflow.com/a/6804718.
 *
 * @param {Component} component
 * @param {Function} callback
 */

function getHtmlFromNativePaste(component, callback) {
  var el = (0, _reactDom.findDOMNode)(component);

  // Create an off-screen clone of the element and give it focus.
  var clone = el.cloneNode();
  clone.setAttribute('class', '');
  clone.setAttribute('style', 'position: fixed; left: -9999px');
  el.parentNode.insertBefore(clone, el);
  clone.focus();

  // Tick forward so the native paste behaviour occurs in cloned element and we
  // can get what was pasted from the DOM.
  setTimeout(function () {
    if (clone.childElementCount > 0) {
      // If the node contains any child nodes, that is the HTML content.
      var html = clone.innerHTML;
      clone.parentNode.removeChild(clone);
      callback(html);
    } else {
      // Only plain text, no HTML.
      callback();
    }
  }, 0);
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = getHtmlFromNativePaste;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9nZXQtaHRtbC1mcm9tLW5hdGl2ZS1wYXN0ZS5qcyJdLCJuYW1lcyI6WyJnZXRIdG1sRnJvbU5hdGl2ZVBhc3RlIiwiY29tcG9uZW50IiwiY2FsbGJhY2siLCJlbCIsImNsb25lIiwiY2xvbmVOb2RlIiwic2V0QXR0cmlidXRlIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsImZvY3VzIiwic2V0VGltZW91dCIsImNoaWxkRWxlbWVudENvdW50IiwiaHRtbCIsImlubmVySFRNTCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxTQUFTQSxzQkFBVCxDQUFnQ0MsU0FBaEMsRUFBMkNDLFFBQTNDLEVBQXFEO0FBQ25ELE1BQU1DLEtBQUssMkJBQVlGLFNBQVosQ0FBWDs7QUFFQTtBQUNBLE1BQU1HLFFBQVFELEdBQUdFLFNBQUgsRUFBZDtBQUNBRCxRQUFNRSxZQUFOLENBQW1CLE9BQW5CLEVBQTRCLEVBQTVCO0FBQ0FGLFFBQU1FLFlBQU4sQ0FBbUIsT0FBbkIsRUFBNEIsZ0NBQTVCO0FBQ0FILEtBQUdJLFVBQUgsQ0FBY0MsWUFBZCxDQUEyQkosS0FBM0IsRUFBa0NELEVBQWxDO0FBQ0FDLFFBQU1LLEtBQU47O0FBRUE7QUFDQTtBQUNBQyxhQUFXLFlBQU07QUFDZixRQUFJTixNQUFNTyxpQkFBTixHQUEwQixDQUE5QixFQUFpQztBQUMvQjtBQUNBLFVBQU1DLE9BQU9SLE1BQU1TLFNBQW5CO0FBQ0FULFlBQU1HLFVBQU4sQ0FBaUJPLFdBQWpCLENBQTZCVixLQUE3QjtBQUNBRixlQUFTVSxJQUFUO0FBQ0QsS0FMRCxNQUtPO0FBQ0w7QUFDQVY7QUFDRDtBQUNGLEdBVkQsRUFVRyxDQVZIO0FBV0Q7O0FBRUQ7Ozs7OztrQkFNZUYsc0IiLCJmaWxlIjoiZ2V0LWh0bWwtZnJvbS1uYXRpdmUtcGFzdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGZpbmRET01Ob2RlIH0gZnJvbSAncmVhY3QtZG9tJ1xuXG4vKipcbiAqIEdldCBjbGlwYm9hcmQgSFRNTCBkYXRhIGJ5IGNhcHR1cmluZyB0aGUgSFRNTCBpbnNlcnRlZCBieSB0aGUgYnJvd3NlcidzXG4gKiBuYXRpdmUgcGFzdGUgYWN0aW9uLiBUbyBtYWtlIHRoaXMgd29yaywgYHByZXZlbnREZWZhdWx0KClgIG1heSBub3QgYmVcbiAqIGNhbGxlZCBvbiB0aGUgYG9uUGFzdGVgIGV2ZW50LiBBcyB0aGlzIG1ldGhvZCBpcyBhc3luY2hyb25vdXMsIGEgY2FsbGJhY2tcbiAqIGlzIG5lZWRlZCB0byByZXR1cm4gdGhlIEhUTUwgY29udGVudC4gVGhpcyBzb2x1dGlvbiB3YXMgYWRhcHRlZCBmcm9tXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82ODA0NzE4LlxuICpcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cblxuZnVuY3Rpb24gZ2V0SHRtbEZyb21OYXRpdmVQYXN0ZShjb21wb25lbnQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IGVsID0gZmluZERPTU5vZGUoY29tcG9uZW50KVxuXG4gIC8vIENyZWF0ZSBhbiBvZmYtc2NyZWVuIGNsb25lIG9mIHRoZSBlbGVtZW50IGFuZCBnaXZlIGl0IGZvY3VzLlxuICBjb25zdCBjbG9uZSA9IGVsLmNsb25lTm9kZSgpXG4gIGNsb25lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnJylcbiAgY2xvbmUuc2V0QXR0cmlidXRlKCdzdHlsZScsICdwb3NpdGlvbjogZml4ZWQ7IGxlZnQ6IC05OTk5cHgnKVxuICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjbG9uZSwgZWwpXG4gIGNsb25lLmZvY3VzKClcblxuICAvLyBUaWNrIGZvcndhcmQgc28gdGhlIG5hdGl2ZSBwYXN0ZSBiZWhhdmlvdXIgb2NjdXJzIGluIGNsb25lZCBlbGVtZW50IGFuZCB3ZVxuICAvLyBjYW4gZ2V0IHdoYXQgd2FzIHBhc3RlZCBmcm9tIHRoZSBET00uXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChjbG9uZS5jaGlsZEVsZW1lbnRDb3VudCA+IDApIHtcbiAgICAgIC8vIElmIHRoZSBub2RlIGNvbnRhaW5zIGFueSBjaGlsZCBub2RlcywgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50LlxuICAgICAgY29uc3QgaHRtbCA9IGNsb25lLmlubmVySFRNTFxuICAgICAgY2xvbmUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZSlcbiAgICAgIGNhbGxiYWNrKGh0bWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE9ubHkgcGxhaW4gdGV4dCwgbm8gSFRNTC5cbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH0sIDApXG59XG5cbi8qKlxuICogRXhwb3J0LlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBnZXRIdG1sRnJvbU5hdGl2ZVBhc3RlXG4iXX0=