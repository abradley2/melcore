// Based on the MDN polyfill for Object.assign
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign


function assign (target) {
    var output = Object(target)

    for (var idx = 1; idx < arguments.length; idx++) {
        var source = arguments[idx]

        if (source !== undefined && source !== null) {

            for (var nextKey in source) {
                if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                    output[nextKey] = source[nextKey]
                }
            }

        }
    }

    return output
}

module.exports = assign