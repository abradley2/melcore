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

		store = melkor.setupStore({
			count: 0,
			names: []
		})
			.addReducer('names', reducers.names)
			.addReducer('count', reducers.count)
			.create()
	})

	it('should create a store', function () {
		chai.assert.isFunction(store.applyMiddleware)
		chai.assert.isFunction(store.dispatch)
		chai.assert.isFunction(store.getState)
	})

	it('should be able to bind action creators', function () {
		var actions = melkor.bindActionCreators({
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
		var actions = melkor.bindActionCreators({
			create: function (name) {
				return {
					type: NameActions.ADD_NAME,
					name: name
				}
			}
		}, store)

		actions.create('Tony')

		var names = store.getState().names

		chai.assert.equal(names[names.length - 1], 'Tony')
	})



})
