const assign = require('object-assign')

function obj (key, val) {
  const _obj = {}
  _obj[key] = val
  return _obj
}

function set (key, val, target) {
  return assign({}, target, obj(key, val))
}

exports.setupReducer = function setupReducer (slice, store) {
  const setFunc = set.bind({}, slice)
  const handlers = {}

  function onAction (action, oldState, payload) {
    if (handlers && handlers[action]) {
      const newState = handlers[action](oldState[slice], payload)
      onAction.handledAction = true

      return setFunc.bind({}, newState)
    } else {
      onAction.handledAction = false
      return oldState
    }
  }

  const reducer = {
    on: function on (actionType, handler) {
      if (typeof actionType !== 'string') throw new TypeError('actionType must be string')

      assign(handlers, obj(actionType, handler))

      return reducer
    },
    onAction: onAction
  }

  if (store) store.registerReducer(reducer)

  return reducer
}

exports.createReducer = exports.setupReducer

exports.createStore = function createStore (reducers) {
  var __STATE__ = {}
  var __PREV__ = {}

  if (!reducers) reducers = []

  function dispatch (action, payload) {
    var actionHandled = false

    if (!action) throw new TypeError('did not dispatch valid action')

    if (action.constructor === Function) return action(dispatch)

    if (typeof action !== 'string') throw new TypeError('action must be a string')

    __PREV__ = __STATE__
    __STATE__ = reducers.reduce(function reduceState (currentState, reducer, idx) {
      const result = reducer.onAction(action, currentState, payload)

      if (reducer.onAction.handledAction) actionHandled = true

      if (result.constructor === Function) {
        return result(currentState)
      }

      return result
    }, assign({}, __STATE__))

    if (!actionHandled) throw new Error('Unhandled action ' + action)
  }

  const store = {
    init: function () {
      dispatch('__INIT__')
    },
    registerReducer: function (reducer) {
      reducers.push(reducer)
    },
    setupReducer: function (slice) {
      return exports.setupReducer(slice, store)
    },
    createReducer: function (slice) {
      return exports.createReducer(slice, store)
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
