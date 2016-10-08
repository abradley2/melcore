var m = require('mithril')

function zip (k, v) {
	var retVal = {}
	retVal[k] = v
	return retVal
}

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

function clone (obj) {
	if (!obj || typeof obj !== 'object') {

		return obj

	} else if (Array.isArray(obj)) {

		return obj.map(clone)

	} else if (typeof obj === 'object') {
		var cloned = {}

		for (var prop in obj) {
			if (Object.hasOwnProperty.call(obj, prop)) {
				cloned[prop] = clone( obj[prop] )
			}
		}

		return cloned
	} else {
		
		return obj
	}
}

function cloneWithProps (obj, extras) {
	return assign( clone(obj), extras )
}

function handleAsyncActions (action, store) {
	if (action.request && !action.request.status) {
		m.request(action.request)
			.then(function (res) {
				store.dispatch(
					assign({status: 'done', response: res}, action)
				)
			})
			.catch(function (err) {
				store.dispatch(
					assign({status: 'error', error: err}, action)
				)
			})
	}
	return action
}

function Reducer (handlers) {
	this.handlers = handlers || {}
}

Reducer.prototype.handleAction = function (oldState, action) {
	if (this.handlers[action.type]) this.handlers[action.type]()
}

function setupReducer (store, storeAttr, _handlers, _asserts) {
	var asserts = _asserts || {}
	var handlers = _handlers || {}

	return {
		assert: function (actionType, assertion) {
			asserts[actionType] = function (action) {
				for (var param in action) {
					if (Object.hasOwnProperty(assertion, param)) {
						return (
							action[param] === assertion[param]
							|| action[param].constructor === assertion[param]
						)
					}
				}
			}
		},
		on: function (actionType, handler) {
			if (typeof actionType !== 'string') {
				throw new TypeError('Must register string as actionType ')
			}
			handlers[actionType] = handler
			return createReducer(store, storeAttr, handlers, asserts)
		},
		create: function () {
			return new Reducer(handlers)
		}
	}
	
}

function Store (defaultState, reducerMap) {
	this._middlewares = [handleAsyncActions]
	this._state = defaultState || {}
	this.applyReducers(reducerMap)
}

Store.prototype.dispatch = function (action) {
	var results = [{}]

	if (
		(typeof action !== 'object')
		|| (typeof action.type !== 'string')
	) {
		throw new Error('Action must be an object with at least attribute <String>type')
	}

	for (var i = 0; i < this._middlewares.length; i++) {
		action = this._middlewares[i](action, this)
	}

	for (var stateAttr in this._reducers) {
		var result = {}
		var reducer = this._reducers[stateAttr]
		result[stateAttr] = reducer.handleAction( this._state[stateAttr], action )
		if (!result[stateAttr]) {
			throw new Error('Reducer must return a new valid state attribute (cannot be null or falsey)')
		}
		results.push(result)
	}

	this._state = assign.apply(Object, results)
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
	setupReducer: setupReducer,
	clone: clone,
	cloneWithProps: cloneWithProps,
	bindActionCreators: bindActionCreators
}