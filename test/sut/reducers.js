var melkor = require('../../lib/melkor')
var setupReducer = require('../../lib/melkor').setupReducer
var clone = melkor.clone

var constants = require('./constants')
var CountActions = constants.CountActions
var NameActions = constants.NameActions

exports.count = setupReducer()
	.on(CountActions.INCREMENT, function (oldState, payload) {
		var newState = clone(oldState)

		newState.number = oldState.number + 1
		return newState
	})
	.on(CountActions.DECREMENT, function (oldState, payload) {
		var newState = clone(oldState)

		newState.number = oldState.number - 1]
		return newState
	})
	.create()

exports.name = setupReducer()
	.on(NameActions.ADD_NAME, function (oldState, payload) {

	})
	.on(NameActions.EDIT_NAME, function (oldState, payload) {

	})
	.on(NameActions.REMOVE_NAME, function (oldState, payload) {

	})
	.create()
