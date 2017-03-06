const assign = require('object-assign')

function obj (key, val) {
  const _obj = {}
  _obj[key] = val
  return _obj
}

function set (key, val, target) {
  return assign({}, target, obj(key, val))
}

exports.__INIT__ = '__INIT__'

exports.setupReducer = function setupReducer (slice, handlers) {
  const setFunc = set.bind({}, slice)

  function on (actionType, handler) {
    if (typeof actionType !== 'string') throw new TypeError('actionType must be string')

    return setupReducer(
      slice,
      assign({}, handlers, obj(actionType, handler))
    )
  }

  function create () {
    return function onAction (action, oldState) {
      if (handlers && handlers[action.type]) {
        const newState = handlers[action.type](action, oldState[slice])

        return setFunc.bind({}, newState)
      }
      return oldState
    }
  }

  return {
    on: on,
    create: create
  }
}

exports.createStore = function createStore (reducers) {
  let __STATE__ = {}

  function getState (slice) {
    if (slice) return __STATE__[slice]
    return __STATE__
  }

  function dispatch (action) {
    if (!action) throw new TypeError('did not dispatch valid action')

    if (action.constructor === Function) return action(dispatch)

    if (!action.type) throw new TypeError('must specify action.type')

    __STATE__ = reducers.reduce(function reduceState (currentState, reduceFunc) {
      const result = reduceFunc(action, currentState)

      if (typeof result === 'undefined') {
        throw new TypeError('reducers may not return undefined')
      }

      if (result.constructor === Function) return result(currentState)

      return result
    }, __STATE__)
  }

  function actionCreator (func) {
    return function createAction () {
      dispatch(
        func.apply({}, arguments)
      )
    }
  }

  function bindActionCreators (actionMap) {
    return Object.keys(actionMap).reduce(function (acc, cur) {
      return assign(
        acc,
        obj(cur, actionCreator(actionMap[cur]))
      )
    }, {})
  }

  dispatch({type: exports.__INIT__})

  return {
    getState: getState,
    dispatch: dispatch,
    actionCreator: actionCreator,
    bindActionCreators: bindActionCreators
  }
}
