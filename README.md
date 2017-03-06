# Melcore

Minimal Redux-ish implementation.

I really just wanted something like Redux with a nicer way of creating reducers
and setting up the store.

# The Store

A store is an object that contains a single atom of the application's state,
and registered reducers that divide the responsibilities of creating a new
state with every action.

```
const createStore = require('melcore').createStore

const store = createStore([
	require('./reducers/todos'),
	require('./reducers/counts')
])

module.exports = store
```

The store has several functions: `dispatch`, `getState` and `bindActionCreators`

# Get State

To retrieve the store's current state atom, call `store.getState()`. You can
pass in a optional string to specify a getter.

`store.getState('todos')` is equivalent to `store.getState().todos`

# Reducers

Reducers are done in such a way that they will not fail silently if
you try to respond to an undefined action type. This is better than a `switch`
statement since you may accidentally misspell a constant and `case` won't care

```
const __INIT__ = require('melcore').__INIT__
const setupReducer = require('melcore').setupReducer
const constants = require('./constants')

var todos = setupReducer('todos')
	.on(__INIT__, function () {
		return []
	})
	.on(constants.CREATE_TODO, function (action, oldState) {
		return oldState.concat([action.todo])
	})
	.on(constants.REMOVE_TODO, function (action, oldState) {
		return oldState.filter(function (todo) {
			return todo.id !== action.targetId
		})
	})
	.create()

module.exports = todos
```

`setupReducer` always takes a string as it's only argument. It specifies which piece of
oldState it will receive from the store on every action, and which state it is
expected to return on every handler.

Instead of creating a reducer via `melcore.setupReducer` and adding it to the store's
array of reducers, you can also call `setupReducer` directly on the store:

```
const store = require('./store')

store.setupReducer('message')
  .on('__INIT__', function () {
    return 'Hello World!'
  })
  .on('message/editMessage', function (oldState, message) {
    return message
  })
  .create()
```

The reducer will now be part of the store's main reducer. This is nice when
you have a modular file structure and don't want to go back to edit your main
`store.js` file every time you create a new module in your app.

# Dispatch

To dispatch an action to the store, simply call its `dispatch` method.

These are two roughly equivalent way to dispatching actions:

```
store.dispatch({
	type: 'DO_SOMETHING',
  data: 'hello'
})
```

or

```
store.dispatch('DO_SOMETHING', {data: 'hello'})
```

# Action Creators

There is a `bindActionCreators` method which will have all functions of the map
dispatch their returned payload as actions.

Mostly you should just use `store.dispatch` at the end of action creating methods.

```
const constants = require('./constants')
const getState = require('./store').getState
const bindActionCreators = require('./store').bindActionCreators

const methods = bindActionCreators({
  increment: function (e) {
    return [constants.INCREMENT, 2]
  },
  decrement: function (e) {
    return {
      type: constants.DECREMENT
    }
  }
})
```

# Handling thunks
_Won't you take me to... thunk-y toooown?_  

Action creators that return functions receive the store's dispatch method
as the callback argument. This is useful for when an action is asynchronous.

```
const store = require('./store')

function getStuff (dispatch) {
  m.request({ .. }).then(function (res) {
    dispatch: {
      type: 'GOT_STUFF',
      stuff: res
    }
  })
}

store.dispatch( getStuff )
```

# Middleware? Plugins?

To add middleware, just add it as a reducer.

Here's some "middleware" that logs the resulting state and action after
all the other reducers have resolved:

```
function logAction (newState, action) {
  console.log('action called!')
  console.log(newState, action)
  
  return state
}

const store = createStore(
  require('./reducers').concat([ logAction ])
)
```

Keep in mind, reducers always need to return state.
