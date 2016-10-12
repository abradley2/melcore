var melkor = require('../../lib/melkor')
var setupReducer = melkor.setupReducer
var checkTypes = melkor.checkTypes
var clone = melkor.clone

var constants = require('./constants')
var CountActions = constants.CountActions
var NameActions = constants.NameActions

exports.count = setupReducer()
	.on(CountActions.INCREMENT, function (oldState, payload) {
		checkTypes({
			number: Number
		})

		return cloneWithProps(oldState, {
			number: oldState.number + 1
		})
	})
	.on(CountActions.DECREMENT, function (oldState, payload) {
		checkTypes({
			number: Number
		})

		return cloneWithProps(oldState, {
			number: oldState.number - 1
		})
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
