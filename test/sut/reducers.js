const setupReducer = require('../../lib/melcore').setupReducer
const constants = require('./constants')
const CountActions = constants.CountActions
const NameActions = constants.NameActions

exports.count = setupReducer('count')
  .on('__INIT__', function () {
    return 0
  })
  .on(CountActions.INCREMENT, function (oldState, payload) {
    const newState = oldState + 1

    return newState
  })
  .on(CountActions.DECREMENT, function (oldState, payload) {
    const newState = oldState - 1

    return newState
  })

exports.names = setupReducer('names')
  .on('__INIT__', function () {
    return []
  })
  .on(NameActions.ADD_NAME, function (oldState, payload) {
    const newState = oldState.concat([payload.name])

    return newState
  })
  .on(NameActions.EDIT_NAME, function (oldState, payload) {
    const newState = oldState.slice(0)

    newState[payload.idx] = payload.name

    return newState
  })
  .on(NameActions.REMOVE_NAME, function (oldState, payload) {
    const newState = oldState.slice(0)

    newState.splice(payload.idx, 1)

    return newState
  })
