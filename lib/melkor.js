var m = require('mithril')

var typeMap = {
	'null': null,
	'String': String,
	'Object': Object,
	'Number': Number,
	'Array': Array,
	'Boolean': Boolean
}

function checkTypes (action, assertion) {
	for (var param in action) {

		if (assertion[param] || assertion[param] === null) {

			if (
				action[param] === assertion[param] ||
				action[param].constructor === assertion[param]
			) {
				continue
			} else {
				var expected = Object.keys(typeMap)
					.filter(function (typeName) {
						return typeMap[typeName] === assertion[param]

					})
					.pop()

				if (!expected) {
					throw new TypeError('Incorrect type assertion for ' + param + ' must be null, String, Object, Number, Array or Boolean')
				}

				throw new TypeError(param + ' is ' + (typeof action[param]) + ', expected ' + expected)
			}
		}
	}

	return true
}


function zip (k, v) {
	var retVal = {}
	retVal[k] = v
	return retVal
}

function checkTypes (action, types) {
	for (var param in action) {
		if (types[param] || types[param] === null) {
			if ( !(action[param] === types[param] || action[param].constructor === types[param]) ) {
				throw new TypeError(action.type + ' ' + param + ' should be ' + types[param])
			}
		}
	}

	return true
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

function assignClone (obj, extras) {
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
	if (!this.handlers[action.type]) {
		return oldState
	} else {
		return this.handlers[action.type](oldState, action)
	}
}


function setupReducer (store, storeAttr, _handlers) {

	var handlers = _handlers || {}

	return {
		on: function (actionType, handler) {
			if (typeof actionType !== 'string') {
				throw new TypeError('Must register string as actionType ')
			}
			handlers[actionType] = handler

			return setupReducer(store, storeAttr, handlers)
		},
		create: function () {
			return new Reducer(handlers)
		}
	}

}

function Store (defaultState, middlewares, reducers) {
	this._middlewares = middlewares.concat([handleAsyncActions])
	this._state = defaultState
	this._reducers = reducers
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
		if (typeof result[stateAttr] === 'undefined') {
			throw new Error('Reducer must return a new valid state attribute')
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

function setupStore (defaultData, _middlewares, _reducers) {
	var state = defaultData || {}
	var middlewares = _middlewares || []
	var reducers = _reducers || {}

	return {
		addMiddleware: function (middleware) {
			middlewares.push(middleware)
			return setupStore(state, middlewares, reducers)
		},
		addReducer: function (stateAttr, reducer) {
			if (!typeof reducer === 'function') {
				throw new TypeError('reducer must be a function')
			}
			if (!typeof stateAttr === 'string') {
				throw new TypeError('stateAttr must be a string')
			}
			reducers[stateAttr] = reducer
			return setupStore(state, middlewares, reducers)
		},
		create: function () {
			return new Store(state, middlewares, reducers)
		}
	}

	return new Store(defaultData)
}

function bindActionCreators (actionCreators, store) {
	var boundActions = {}

	Object.keys(actionCreators).forEach(function (name) {
		var actionCreator = actionCreators[name]

		boundActions[name] = function (payload) {
			var action = actionCreator( payload )

			store.dispatch(action)
		}

	})

	return boundActions
}

module.exports = {
	checkTypes: checkTypes,
	setupStore: setupStore,
	setupReducer: setupReducer,
	clone: clone,
	assign: assign,
	assignClone: assignClone,
	bindActionCreators: bindActionCreators
}
