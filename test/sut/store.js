var createStore = require('../../lib/melkor').createStore
var reducers = require('./reducers')

var initialState = {
	count: {
		number: 0
	},
	todos: []
}

var store = createStore(initialState, {
	count: reducers.count,
	todos: reducers.todos
})

module.exports = store