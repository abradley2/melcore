var melkor = require('../../lib/melkor')
var setupReducer = require('../../lib/melkor').setupReducer
var clone = melkor.clone
var checkTypes = melkor.checkTypes

var constants = require('./constants')
var CountActions = constants.CountActions
var NameActions = constants.NameActions

exports.count = setupReducer()
	.on(CountActions.INCREMENT, function (oldState, action) {
		var newState = oldState + 1

		return newState
	})
	.on(CountActions.DECREMENT, function (oldState, action) {
		var newState = oldState - 1

		return newState
	})
	.create()

exports.name = setupReducer()
	.on(NameActions.ADD_NAME, function (oldState, action) {
		checkTypes(action, {
			name: String
		})
	})
	.on(NameActions.EDIT_NAME, function (oldState, action) {
		checkTypes(action, {
			idx: Number,
			name: String
		})
	})
	.on(NameActions.REMOVE_NAME, function (oldState, action) {
		checkTypes(action, {
			idx: Number
		})
	})
	.create()
