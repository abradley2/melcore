var chai = require('chai'),
    DataStore = require('../src/DataStore')

describe('DataStore', function () {

    it('should successfully create an instance of a DataStore', function () {

        var dataStore = new DataStore({
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
            data: [
                {name: 'do laundry', completed: false},
                {name: 'write code', completed: true}
            ]
        })

        chai.assert.ok(dataStore)


        dataStore.dispatch({
            action: 'REMOVE_TASK',

        })

        console.log(dataStore)

    })

})