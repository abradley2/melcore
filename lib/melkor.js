var m = require('mithril')

function handleAsyncActions (action, store) {
	if (action.request && !action.request.status) {
		m.request(action.request)
			.then(function (res) {
				store.dispatch(
					Object.assign({status: 'done', response: res}, action)
				)
			})
			.catch(function (err) {
				store.dispatch(
				Object.assign({status: 'error', error: err}, action)
			)
		})
	}
	return action
}

function Store (defaultState, reducerMap) {
	this._middlewares = [handleAsyncActions]
	this._state = defaultState || {}
	if (reducerMap) this.applyReducers(reducerMap)
}

Store.prototype.dispatch = function (action) {
	m.startComputation()
  
	for (var i = 0; i < this._middlewares.length; i++) {
		action = this._middlewares[i](action, this)
	}
	
	for (var stateAttr in this._reducers) {
		var oldState = this._state[stateAttr]
		var newState = this._reducers[stateAttr]( action, oldState )

		this._state[stateAttr] = newState
	}
  
	m.endComputation()
}

Store.prototype.getState = function () {
	return this._state
}

Store.prototype.applyMiddleware = function () {
	for (var i = 0; i < arguments.length; i++) {
		this._middlewares.push(arguments[i]) 
	}
}

Store.prototype.applyReducers = function (reducerMap) {
	this._reducers = reducerMap
}

function createStore (defaultData) {
	return new Store(defaultData)
}

function bindActionCreators (actionCreators, store) {
	var boundActions = {}

	Object.keys(actionCreators).forEach(function (name, actionCreator) {

		boundActions[name] = function (payload) {
			var action = actionCreator( store.getState(), payload )

			store.dispatch(action)
		}

	})
  
	return boundActions
}

module.exports = {
	createStore: createStore,
	bindActionCreators: bindActionCreators
}