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

    store.setupReducer('message')
      .on('__INIT__', function () {
        return 'Hello World'
      })
      .on('message/EDIT_MESSAGE', function (oldState, newMessage) {
        return newMessage
      })
      .create()

    store.init()
  })

  it('should create a store', function () {
    chai.assert.isFunction(store.dispatch)
    chai.assert.isFunction(store.getState)
  })

  it('should be able to bind action creators', function () {
    const actions = store.bindActionCreators({
      add: function () {
        return {
          type: NameActions.ADD_NAME
        }
      },
      edit: function () {
        return {
          type: NameActions.EDIT_NAME
        }
      },
      remove: function () {
        return {
          type: NameActions.REMOVE_NAME
        }
      }
    }, store)

    chai.assert.ok(actions)
  })

  it('should dispatch action when bound creator called', function () {
    const actions = store.bindActionCreators({
      create: function (name) {
        return {
          type: NameActions.ADD_NAME,
          name: name
        }
      }
    }, store)

    actions.create('Tony')

    const names = store.getState('names')

    chai.assert.equal(names[names.length - 1], 'Tony')
  })

  it('should be able to dispatch an action', function () {
    const initialCount = store.getState().count

    store.dispatch({type: CountActions.INCREMENT})

    chai.assert.equal(
      store.getState().count,
      initialCount + 1
    )
  })

  it('should handle a thunk effect/action', function () {
    const initialCount = store.getState().count

    store.dispatch(function (dispatch) {
      dispatch({type: CountActions.DECREMENT})
    })

    chai.assert.equal(
      store.getState().count,
      initialCount - 1
    )
  })

  it('should be able to dispatch an action as a string', function () {
    const initialCount = store.getState().count

    store.dispatch(CountActions.INCREMENT)

    chai.assert.equal(
      store.getState().count,
      initialCount + 1
    )
  })

  it('should be able to use a reducer setup on the store', function () {
    store.dispatch('message/EDIT_MESSAGE', 'It worked!')

    chai.assert.equal(
      store.getState().message,
      'It worked!'
    )
  })
})
