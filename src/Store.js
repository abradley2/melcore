var extend = require('./util/extend'),
    Dispatcher = require('./Dispatcher')

var Store = function (params, dispatcher) {
    var self = this,
        params = params || {},
        data = params.data || null

    if (params.actions) this.actions = params.actions

    if (typeof dispatcher === 'undefined') dispatcher = new Dispatcher()

    this.dispatcher = dispatcher

    this.data = data

    this.dispatchIndex = dispatcher.register(function (payload) {

        if (self.actions[payload.action]) {
            self.actions[payload.action].call(self, payload)
        }

    })

    if (this.initialize) this.initialize.apply(this, arguments)

}

Store.extend = extend

module.exports = Store
