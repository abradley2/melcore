var createStore = require('../../lib/melkor').createStore
var reducers = require('./reducers')

var initialState = {
	count: 0,
	names: []
}

var store = createStore(initialState)

store.applyReducers({
	count: reducers.count,
	todos: reducers.todos
})

module.exports = store
