# Melkor

Simple Flux architecture utils for Mithril.js

### Simple example

**Create a Dispatcher**

```
var myDispatcher = new Dispatcher()
```

**Create a Store**
Stores hold data and actions. When creating a store,
the first argument is an object which contains
its action dictionary and a reference to its data.

The second argument is the dispatcher the store will register with.

```
var todos = m.prop([
    {title: 'do laundry', completed: false},
    {title: 'write code', completed: true}
])

var todoStore = new Store({
    data: todos,
    actions: {
        'ADD_TODO': function (payload) {
            this.data().push(payload.todo)
        }
    }
}, myDispatcher)
```

Then use the dispatcher:

```
myDispatcher.dispatch({
    action: 'ADD_TODO',
    todo: {title: 'New todo', completed: false}
})
```

All stores that use the dispatcher will then fire an action
with a name matching the payload's 'action' parameter. It will
then pass the payload as that function's argument

You should generally create handlers on your dispatcher so it can respond
to UI events appropriately to all related stores. This is especially helpful
since single actions often affect multiple stores.

```
myDispatcher.handleRemoveTodo = function (removed) {

    this.dispatch({
        action: 'REMOVE_TODO',
        todo: removed
    })

    this.dispatch({
        action: 'REMOVE_SUB_TODOS',
        parentTodo: removed
    })

}
```

### Other stuff

If you do not pass in a dispatcher as the second argument to a store,
it will default to using it's own internal dispatcher created in its
constructor.

A store's associated dispatcher is accessible in its dispatcher attribute.

```
var myStore = new Store({
    data: m.prop([]),
    actions: {
        'DO_STUFF': function (payload) { ... }
    }
})

var dispatcher = myStore.dispatcher

dispatcher.dispatch({
    action: 'DO_STUFF',
    stuff: { ... }
})
```

Store's will call their initialize function when constructed
if it is defined.

```
var CustomStore = Store.extend({
    initialize: function (params) {
        console.log(this, params)
    }
})

var store = new CustomStore({ ... })
```
