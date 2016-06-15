var chai = require('chai'),
    Dispatcher = require('../src/Dispatcher')

describe('Dispatcher', function () {


    it('should create an instance of dispatcher', function () {
        var dispatcher = new Dispatcher()

        chai.assert.ok(dispatcher)

    })

    it ('should register a callback and invoke on dispatch', function () {
        var dispatcher = new Dispatcher(),
            called = false,
            handleDispatch = function () {
                called = true
            }

        dispatcher.register(handleDispatch)

        dispatcher.dispatch()

        chai.assert.isTrue(called)

    }),

    it ('should register and handle multiple callbacks on dispatch', function () {
        var dispatcher = new Dispatcher(),
            calledOne = false,
            calledTwo = false,
            cbOne = function () {calledOne = true},
            cbTwo = function () {calledTwo = true}


        dispatcher.register(cbOne)
        dispatcher.register(cbTwo)

        dispatcher.dispatch('test')

        chai.assert.isTrue(calledOne)
        chai.assert.isTrue(calledTwo)

    })

})