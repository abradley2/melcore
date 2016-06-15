var m = require('mithril'),
    assign = require('./util/assign'),
    extend = require('./util/extend')

var Dispatcher = function () {
    
    this.callbacks = []

}

Dispatcher.extend = extend

assign(Dispatcher.prototype, {

    register: function (callback, dependencies) {
        this.callbacks.push( callback )
        return (this.callbacks.length - 1)
    },

    dispatch: function (payload) {
        this.callbacks.forEach(function (callback) {
            callback(payload)
        })
    }

})

module.exports = Dispatcher