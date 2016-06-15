**WIP**  
(still need to finish documentation)

# Melkor

Simple Flux architecture utils for Mithril.js

### Api

Like Mithril, the API of Melkor is very simple and nimble.

Melkor uses the Mithril _m.deferred_ for async flow control

**Dispatcher**  

\#register(callback: Function)



\#dispatch(payload)  

**Store**

Create a store via it's factory function

```
var todoStore = new Store({
    data: [
        {task: 'do laundry', completed: false},
        {task: 'write code', completed: true}
    ],
    actions: {
        ADD_TODO: function () {
            this.data().push({task: 'new task', completed: false})
        },
        REMOVE_TODO: function (idx) {
            this.data().splice(idx, 1)
        },
        EDIT_TODO: function (idx, todo) {
            this.data()[idx] = todo
        }
    }
})
```

You can access the props of a store via _data()_

```
var todos = todoStore.data()

// returns:
// [
//      {task: 'do laundry', completed: false},
//      {tasl: 'write code', completed: true}
// ]
```

The second parameter when iti