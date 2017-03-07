# Melcore

Minimal Redux-ish implementation (just 100 lines of code).

Use it with React, Inferno, Choo, Mithril, whatever really.

I really just wanted something like Redux with a nicer way of creating reducers
and setting up the store.

The api is also whittled down further. There's no dedicated way to add middleware,
since you can just add additional "reducers" before and after. Pre-populating state is
also done just by dispatching an "initialize" type action and having reducers form
initial state from there. Also rather than the store having one reducer that is put
together via "combineReducers", it is the default to just have the store take an array of
reducers.

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
(In the above example, the store is being passed an array of reducers. Alternatively,
)

The store has several functions: `dispatch`, `getState`, `getPrev`, and `setupReducer`

# Get State

To retrieve the store's current state atom, call `store.getState()`.

You can retrieve the store's state prior to the last dispatch call with `store.getPrev()`.

# Reducers

Reducers are done in such a way that they will not fail silently if
you try to respond to an undefined action type. This is better than a `switch`
statement since you may accidentally misspell a constant and `case` won't care

```
const __INIT__ = require('melcore').__INIT__
const setupReducer = require('melcore').setupReducer
const constants = require('./constants')

const todos = setupReducer('todos')
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

```
store.dispatch('ACTION_NAME', {data: 'stuff'})
```

The second argument to dispatch (optional) is which whatever payload you
wish to send as part of that action.


# Initialization

The store gets it's initial state idiomatically by just dispatching an action agreed
upon to be the "start" for your application. I prefer this as to increasing the
function signature to setup reducers and the store as Redux does.

Calling `store.init()` will dispatch the `__INIT__` action to all reducers with
no initial arguments. Do this on app start, and have each reducer return their
initial state as a result of this action.

Of course, you can always just define and use your own action string as the "init",
rather than the built-in one. `store.init()` is really just there to make this
convention explicit.

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

# Mutating State

It is best practice to not mutate state inside a reducer. The state returned should
be
1. A new object containing no references that would be linked to previous state
2. The previous state, untouched.

I highly recommend [Icepick](https://github.com/aearly/icepick) as a way to deal with this.
[Immutable.js](https://github.com/facebook/immutable-js) is very good as well.

# Plugins? Middleware?

Just given how Melcore works, all you need is the ability to wrap the dispatch method.

For convenience, `wrapDispatch` is provided for you on the store. Though you can just
wrap the method as you would normally.

```
store.wrapDispatch(function (dispatch, action, payload) {
  console.log('this action is about to be dispatched: ', action)
  
  dispatch(action, payload)
  
  console.log('the new application state is: ', store.getState())
})
```