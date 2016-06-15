var assign = require('./assign')


// Subclassing function based on Backbone's
// http://backbonejs.org/docs/backbone.html#section-247
// and the classical inheritance pattern shown in this MDN section
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

function extend (protoProps) {
    var parent = this

    if ( protoProps && Object.hasOwnProperty(protoProps, 'constructor') ) {
        child = protoProps.constructor
    } else {
        child = function () {
            return parent.apply(this, arguments)
        }
    }

    assign(child, parent)

    child.prototype = Object.create(parent.prototype)

    assign(child.prototype, protoProps)

    child.prototype.constructor = child

    child.__super__ = parent.prototype

    return child

}

module.exports = extend