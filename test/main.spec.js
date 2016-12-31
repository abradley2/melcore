const chai = require('chai')
const sinon = require('sinon')

const createStore = require('../lib/melcore').createStore
const constants = require('./sut/constants')
const reducers = require('./sut/reducers')
const NameActions = constants.NameActions
const CountActions = constants.CountActions

describe('melcore', function () {
	var store

	beforeEach(function () {
		console.log('reducers = ', reducers)
		store = createStore([
			reducers.count,
			reducers.names
		])
	})

	it('should create a store', function () {
		chai.assert.isFunction(store.dispatch)
		chai.assert.isFunction(store.getState)
	})

	it('should be able to bind action creators', function () {
		const actions = store.bindActionCreators({
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
		const actions = store.bindActionCreators({
			create: function (name) {
				return {
					type: NameActions.ADD_NAME,
					name: name
				}
			}
		}, store)

		actions.create('Tony')

		const names = store.getState('names')

		chai.assert.equal(names[names.length - 1], 'Tony')
	})

})
