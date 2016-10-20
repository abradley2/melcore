# Melcore

Minimal Redux-ish implementation for Mithril.js, with middleware
for handling asynchronous request via `m.request`

I really just wanted a library like Redux, with a built in middleware for handling
requests using `m.request`,
and a nicer way to write reducers so it won't fail quietly when one of my
constants are mistyped. Other than those couple of reasons, this may as well
be titled "Discount knockoff-Redux". But "Melcore" sounds kewler and this fits with
the "Mithril" theme I guess.

# The Store

A store is an object that contains a single atom of the application's state,
and registered reducers that divide the responsibilities of creating a new
state with every action based of the previous state.

```
var setupStore = require('melcore').setupStore

var store = setupStore({
	'todos': {},
	'count': 1
})
	.addReducer( 'todos', require('./reducers/todos') )
	.addReducer( 'count', require('./reducers/counts') )
	.create()
```

# Reducers

Reducers are done in such a way that they will not fail silently if
you try to respond to an undefined action type.

```
var setupReducer = require('melcore').setupReducer
var constants = require('./constants')

var todos = setupReducer()
	.on(constants.CREATE_TODO, function (previousState, action) {
		...
	})
	.on(constants.EDIT_TODO, function (previousState, action) {
		...
	})
	.create()

module.exports = todos
```

# Action Creators

**"type", "request", "status", and "response"** are all special
action attributes.

```
var bindActionCreators = require('melcore').bindActionCreators
var constants = require('./constants')
var store = require('./store')

var module = {
	controller: function () {
		return bindActionCreators({
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
	view: function () {
		var state = store.getState()

		return m('div', [
			m('h3', state.count),
			m('button', { onclick: ctrl.increment }, '+'),
			m('button', { onclick: ctrl.decrement }, '-')
		])
	}
}


```

# Requests

Any action that has a `request` attribute will trigger a call on `m.request`, passing its content


So when you dispatch an action with these contents:

```
{
  type: 'FETCH_TODOS',
  request: {
    method: 'GET',
    url: '/api/todos'
  }
}
```

Another action will automatically be dispatched when the request is finished.

If the request finishes (promise.then)
```
{
  type: 'FETCH_TODOS',
  status: 'done',
  request: {
    method: 'GET',
    url: '/api/todos'
  },
  response: [
    {id: 1, title: 'Todo One'},
    {id: 2, title: 'Todo Two'}
  ]
}
```

else (promise.catch)
```
{
  type: 'FETCH_TODOS',
  status: 'error',
  request: {
    method: 'GET',
    url: '/api/todos'
  },
  response: {
    error: new Error( ... )
  }
}
```
