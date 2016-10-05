var chai = require('chai')
var sinon = require('sinon')

var melkor = require('../lib/melkor')


describe('melkor', function () {
	var store
	var createTodo
	var updateTodo
	var removeTodo

	beforeEach(function () {
		createTodo = sinon.spy()
		updateTodo = sinon.spy()
		removeTodo = sinon.spy()

		store = melkor.createStore({

			todos: function (state, payload) {
				switch (payload.type) {
					case 'CREATE_TODO':
						createTodo(payload)
						return state

					case 'UPDATE_TODO':
						updateTodo(payload)
						return state

					case 'REMOVE_TODO':
						removeTodo(payload)
						return state

					default:
						return state
				}

			}
		
		})
	})

	it('should create a store', function () {
		chai.assert.isFunction(store.applyMiddleware)
		chai.assert.isFunction(store.dispatch)
		chai.assert.isFunction(store.getState)
	})

	it('should be able to bind action creators', function () {
		var todoActions = melkor.bindActionCreators({
			create: function () {
				return {
					type: 'CREATE_TODO'
				}
			},
			update: function () {
				return {
					type: 'UPDATE_TODO'
				}
			},
			remove: function () {
				return {
					type: 'REMOVE_TODO'
				}
			}
		}, store)

		chai.assert.ok(todoActions)
	})

	it('should dispatch action when bound creator called', function () {
		var todoActions = melkor.bindActionCreators({
			create: function () {
				return {
					type: 'CREATE_TODO'
				}
			}
		}, store)

		todoActions.create()

		chai.assert.isTrue(createTodo.calledOnce)
		chai.assert.isFalse(updateTodo.calledOnce)
		chai.assert.isFalse(removeTodo.calledOnce)
	})

})