var m = require('mithril')

// polyfill for IE 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function assign (target) {
	if (target === undefined || target === null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}

	var output = Object(target)
	for (var index = 1; index < arguments.length; index++) {
		var source = arguments[index];
		if (source !== undefined && source !== null) {
			for (var nextKey in source) {
				if (source.hasOwnProperty(nextKey)) {
					output[nextKey] = source[nextKey]
				}
			}
		}
	}
	return output;
}

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

function Store (reducerMap, defaultState) {
	this._middlewares = [handleAsyncActions]
	this._state = defaultState || {}
	this.applyReducers(reducerMap)
}

Store.prototype.dispatch = function (action) {
  
	for (var i = 0; i < this._middlewares.length; i++) {
		action = this._middlewares[i](action, this)
	}
	
	for (var stateAttr in this._reducers) {
		var oldState = this._state[stateAttr]
		var newState = this._reducers[stateAttr]( oldState, action )

		this._state[stateAttr] = newState
	}

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

	Object.keys(actionCreators).forEach(function (name) {
		var actionCreator = actionCreators[name]

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