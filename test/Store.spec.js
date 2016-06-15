var m = require('mithril'),
    chai = require('chai'),
    Store = require('../src/Store'),
    Dispatcher = require('../src/Dispatcher')

describe('Store', function () {

    it('should successfully create an instance of a Store', function () {

        var store = new Store({
            actions: {
                ADD_TASK: function (payload) {
                    this.data().push(payload.task || {name: 'New Task', completed: false})
                },
                EDIT_TASK: function (payload) {
                    this.data()[payload.index] = payload.task
                },
                REMOVE_TASK: function (payload) {
                    this.data().splice(payload.index, 1)
                }
            },
            data: m.prop([
                {name: 'do laundry', completed: false},
                {name: 'write code', completed: true}
            ])
        })

        chai.assert.ok(store)

        chai.assert.isObject(store.dispatcher)
        chai.assert.isFunction(store.data)


    })

    it('Multiple stores work with single dispatcher', function () {

        var todos = m.prop([
            {id: 1, title: 'morning routine'},
            {id: 2, title: 'work'}
        ])

        var subTodos = m.prop([
            {id: 1, parentId: 1, title: 'take shower'},
            {id: 2, parentId: 2, title: 'write code'},
            {id: 3, parentId: 1, title: 'eat breakfast'},
            {id: 4, parentId: 2, title: 'go to meetings'}
        ])

        var MyDispatcher = Dispatcher.extend({
            handleTodoRemove: function (todo) {
                this.dispatch({
                    action: 'REMOVE_TODO',
                    id: todo.id
                })
                this.dispatch({
                    action: 'REMOVE_SUB_TODOS',
                    parentId: todo.id
                })
            }
        })

        myDispatcher = new MyDispatcher()

        var todoStore = new Store({
            data: todos,
            actions: {
                REMOVE_TODO: function (payload) {
                    this.data(
                        this.data().filter(function (todo) {
                            return todo.id !== payload.id
                        })
                    )
                }
            }
        }, myDispatcher)

        var subTodoStore = new Store({
            data: subTodos,
            actions: {
                REMOVE_SUB_TODOS: function (payload) {
                    this.data(
                        this.data().filter(function (sub) {
                            return sub.parentId !== payload.parentId
                        })
                    )
                }
            }
        }, myDispatcher)

        var target = todos()[0]

        myDispatcher.handleTodoRemove(target)

        chai.assert.isFalse(
            todos().some(function (todo) {
                return todo.id === target.id
            })
        )

        chai.assert.isFalse(
            subTodos().some(function (todo) {
                return todo.parentId === target.id
            })
        )

    })

    it('able to define actions on the prototype of a Store constructor', function () {
        var dispatcher = new Dispatcher()

        var BaseStore = Store.extend({
            actions: {
                'ON_PROTO': function () {
                    this.data().called = true
                }
            }
        })

        var store = new BaseStore({
            data: m.prop({
                called: false
            })
        }, dispatcher)

        chai.assert.isFalse( store.data().called )

        dispatcher.dispatch({action: 'ON_PROTO'})

        chai.assert.isTrue( store.data().called )

    })

})
