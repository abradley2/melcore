const setupReducer = require('../../lib/melcore').setupReducer
const constants = require('./constants')
const CountActions = constants.CountActions
const NameActions = constants.NameActions

exports.count = setupReducer('count')
  .on('__INIT__', function () {
    return 0
  })
  .on(CountActions.INCREMENT, function (action, oldState) {
    const newState = oldState + 1

    return newState
  })
  .on(CountActions.DECREMENT, function (action, oldState) {
    const newState = oldState - 1

    return newState
  })
  .create()

exports.names = setupReducer('names')
  .on('__INIT__', function () {
    return []
  })
  .on(NameActions.ADD_NAME, function (action, oldState) {
    const newState = oldState.concat([action.name])

    return newState
  })
  .on(NameActions.EDIT_NAME, function (action, oldState) {
    const newState = oldState.slice(0)

    newState[action.idx] = action.name

    return newState
  })
  .on(NameActions.REMOVE_NAME, function (action, oldState) {
    const newState = oldState.slice(0)

    newState.splice(action.idx, 1)

    return newState
  })
  .create()
