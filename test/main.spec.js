var chai = require('chai')
var sinon = require('sinon')

var melkor = require('../lib/melkor')
var constants = require('./sut/constants')
var reducers = require('./sut/reducers')
var NameActions = constants.NameActions
var CountActions = constants.CountActions

describe('melkor', function () {
	var store

	beforeEach(function () {

		store = melkor.createStore({

			names: reducers.names,
			count: reducers.count

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
		var actions = melkor.bindActionCreators({
			create: function (name) {
				return {
					type: NameActions.ADD_NAME,
					name: name
				}
			}
		}, store)

		actions.create('Tony')

		console.log(store.getState())

		var names = store.getState().names

		chai.assert.equal(names[names.length - 1], 'Tony')
	})



})
