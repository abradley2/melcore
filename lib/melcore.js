const assign = require('object-assign')

function obj (key, val) {
  const _obj = {}
  _obj[key] = val
  return _obj
}

function set (key, val, target) {
  return assign({}, target, obj(key, val))
}

exports.setupReducer = function setupReducer (slice, handlers, _store) {
  const setFunc = set.bind({}, slice)

  function on (actionType, handler) {
    if (typeof actionType !== 'string') throw new TypeError('actionType must be string')

    return setupReducer(
      slice,
      assign({}, handlers, obj(actionType, handler)),
      _store
    )
  }

  function create () {
    const reducer = function onAction (action, oldState, payload) {
      if (handlers && handlers[action]) {
        const newState = handlers[action](oldState[slice], payload)

        reducer.handledAction = true

        return setFunc.bind({}, newState)
      } else {
        reducer.handledAction = false
        return oldState
      }
    }

    if (_store) _store.registerReducer(reducer)

    return reducer
  }

  return {
    on: on,
    create: create
  }
}

exports.createStore = function createStore (reducers) {
  var __STATE__ = {}
  var __PREV__ = {}

  function dispatch (action, payload) {
    var actionHandled = false

    if (!action) throw new TypeError('did not dispatch valid action')

    if (action.constructor === Function) return action(dispatch)

    if (typeof action !== 'string') throw new TypeError('action must be a string')

    __PREV__ = __STATE__
    __STATE__ = reducers.reduce(function reduceState (currentState, reduceFunc) {
      const result = reduceFunc(action, currentState, payload)

      if (reduceFunc.handledAction) actionHandled = true

      if (typeof result === 'undefined') {
        throw new TypeError('reducers may not return undefined')
      }

      if (result.constructor === Function) return result(currentState)

      return result
    }, assign({}, __STATE__))

    if (!actionHandled) throw new Error('Unhandled action ' + action)
  }

  const store = {
    init: function () {
      dispatch('__INIT__')
    },
    registerReducer: function (reduceFunc) {
      reducers.push(reduceFunc)
    },
    setupReducer: function (slice) {
      return exports.setupReducer(slice, {}, store)
    },
    getState: function () {
      return __STATE__
    },
    getPrev: function () {
      return __PREV__
    },
    wrapDispatch: function (func) {
      const dispatch = store.dispatch.bind({})
      store.dispatch = function (action, payload) {
        func(dispatch, action, payload)
      }
    },
    dispatch: dispatch
  }

  return store
}
