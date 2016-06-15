var m = require('mithril'),
    extend = require('./util/extend'),
    Dispatcher = require('./Dispatcher')

var baseDispatcher = new Dispatcher

var Store = function (params, dispatcher) {
    var self = this,
        params = params || {},
        actions = params.actions || {},
        data = params.data || null

    if (typeof dispatcher === 'undefined') dispatcher = baseDispatcher

    if (this.initialize) this.initialize.apply(this, arguments)

    this.dispatcher = dispatcher

    this.data = m.prop(data)

    this.dispatchIndex = dispatcher.register(function (payload) {

        Object.keys(actions).some(function (actionName) {

            if (payload.action === actionName) {
                actions[actionName].call(self, payload)
                return true
            } else {
                return false
            }

        })

    })

}

Store.extend = extend

module.exports = Store
