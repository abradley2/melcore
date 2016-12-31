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

const store = setupStore([
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

Melcore automatically dispatches an action of type `__INIT__` on store initialization.
This is useful for setting up initial state. You may use the `__INIT__` constant
exported by Melcore, or just give it the string `"__INIT__"`

`setupReducer` always takes a string as it's only argument. It specifies which piece of
oldState it will receive from the store on every action, and which state it is
expected to return on every handler.

A reducer can also be a plain function that takes an action and the entire state atom
its two arguments.

# Dispatch

To dispatch an action to the store, simply call its `dispatch` method. All actions
must have a `type` property- a string specifying the action to be handled.

```
store.dispatch({
	type: 'DO_SOMETHING'
})
```

# Action Creators

```
const constants = require('./constants')
const store = require('./store')

var module = {
	controller: function () {
		return store.bindActionCreators({
			increment: function (e) {
				return {
					type: constants.INCREMENT
				}
			},
			decrement: function (e) {
				return {
					type: constants.DECREMENT
				}
			}
		}, store)
	},
	view: function (ctrl) {
		var state = store.getState()

		return m('div', [
			m('h3', state.count),
			m('button', { onclick: ctrl.increment }, '+'),
			m('button', { onclick: ctrl.decrement }, '-')
		])
	}
}
```

# Handling thunks
_Won't you take me to... thunk-y toooown?_  

Action creators that return functions receive the store's dispatch method
as the callback argument. This is useful for when an action is asynchronous.

```
const store = require('./store')

const actions = store.bindActionCreators({
	somemthingAsync: function () {
		return function (dispatch) {
			m.request({ .. }).then(dispatch)
		}
	}
})
```
