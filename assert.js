var assert = require('assert')

describe('Basic Mocha string test', function(){
    it('should return number of chracter in a string', function(){
        assert.equal("hello".length,4)
    })
    it('should return number of chracter in a string', function(){
        assert.equal("hello".charAt(0),'h')
    })
})