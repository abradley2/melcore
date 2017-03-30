const chai = require('chai')

const createStore = require('../lib/melcore').createStore
const constants = require('./sut/constants')
const reducers = require('./sut/reducers')
const NameActions = constants.NameActions
const CountActions = constants.CountActions

describe('melcore', function () {
  var store

  beforeEach(function () {
    store = createStore([
      reducers.count,
      reducers.names
    ])

    store.registerReducer = (function (func) {
      function wrapper () {
        wrapper.callCount++
        return func.apply(store, arguments)
      }
      wrapper.callCount = 0
      return wrapper
    })(store.registerReducer)

    store.setupReducer('person')
      .on('__INIT__', function () {
        return {
          name: 'bob'
        }
      })
      .on('person/SET_NAME', function (oldState, newName) {
        return Object.assign({}, oldState, {name: newName})
      })

    store.setupReducer('noop')
      .on('__INIT__', function () {
        return {}
      })
      .on('noop', function (oldState) {
        return oldState
      })

    store.createReducer('message')
      .on('__INIT__', function () {
        return 'Hello World'
      })
      .on('message/EDIT_MESSAGE', function (oldState, newMessage) {
        return newMessage
      })

    store.init()
  })

  it('should create a store', function () {
    chai.assert.isFunction(store.dispatch)
    chai.assert.isFunction(store.getState)
  })

  it('should have called registerReducer three times', function () {
    chai.assert.equal(store.registerReducer.callCount, 3)
  })

  it('should be able to dispatch an action', function () {
    const initialCount = store.getState().count

    store.dispatch(CountActions.INCREMENT)

    chai.assert.equal(
      store.getState().count,
      initialCount + 1
    )
  })

  it('should handle a thunk effect/action', function () {
    const initialCount = store.getState().count

    store.dispatch(function (dispatch) {
      dispatch(CountActions.DECREMENT)
    })

    chai.assert.equal(
      store.getState().count,
      initialCount - 1
    )
  })

  it('should be able to use a reducer setup on the store', function () {
    store.dispatch('message/EDIT_MESSAGE', 'It worked!')

    chai.assert.equal(
      store.getState().message,
      'It worked!'
    )
  })

  it('should store previous state', function () {
    store.dispatch(NameActions.ADD_NAME, {name: 'bob'})

    chai.assert.isUndefined(
      store.getPrev().names[0]
    )

    chai.assert.equal(
      store.getState().names[0],
      'bob'
    )
  })

  it('should be able to do object comparison to tell if something changed', function () {
    store.dispatch('person/SET_NAME', 'linda')

    chai.assert.equal(
      store.getPrev().names,
      store.getState().names
    )

    chai.assert.notEqual(
      store.getPrev().person,
      store.getState().person
    )
  })

  it('should never have prev and current state be the same', function () {
    chai.assert.notEqual(
      store.getPrev(),
      store.getState()
    )

    store.dispatch('noop')

    chai.assert.notEqual(
      store.getPrev(),
      store.getState()
    )
  })

  it('should throw an error when an action is unhandled', function () {
    var thrown
    try {
      store.dispatch('WontBeHandled')
    } catch (err) {
      thrown = err
    } finally {
      chai.assert.isDefined(thrown)
    }
  })
})
