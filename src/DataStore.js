var m = require('mithril'),
    assign = require('./util/assign'),
    extend = require('./util/extend'),
    Store = require('./Store')

var DataStore = Store.extend({

    constructor: function (params, dispatcher) {
        this.__super__.constructor(params, dispatcher)
    }

})

DataStore.extend = extend

assign(DataStore.prototype, {

})

module.exports = DataStore