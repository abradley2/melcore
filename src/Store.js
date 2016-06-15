var m = require('mithril'),
    extend = require('./util/extend'),
    Dispatcher = require('./Dispatcher')

var baseDispatcher = new Dispatcher

var Store = function (params, dispatcher) {
    var params = params || {},
        actions = params.actions || {},
        data = params.data || null

    if (typeof dispatcher === 'undefined') dispatcher = baseDispatcher

    if (this.initialize) this.initialize.apply(this, arguments)

    this.dispatcher = dispatcher

    this.data = m.prop(data)

    this.dispatchIndex = dispatcher.register(function (payload) {

        Object.keys(actions).some(function (actionName) {

            if (payload.action === actionName) {
                actions[actionName].call(this, payload)
                return true
            } else {
                return false
            }

        }, this)

    })

}

Store.extend = extend

module.exports = Store