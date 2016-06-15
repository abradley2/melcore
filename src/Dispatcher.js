var m = require('mithril'),
    assign = require('./util/assign')

function Dispatcher () {
    
    this.callbacks = []

}

assign(Dispatcher.prototype, {

    register: function (callback) {
        this.callbacks.push(callback)
    },

    dispatch: function (payload) {
        
        var promises = this.callbacks.map(function (cb) {
            var out = cb(payload)

            if (out && out.then) {
                return out
            } else {
                var deferred = m.deferred()
                deferred.resolve(out)
                return deferred.promise
            }

        })

        return promises
    }

})

module.exports = Dispatcher