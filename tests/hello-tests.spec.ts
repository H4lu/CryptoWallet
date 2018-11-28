import { hello } from '../src/core/hello'
import { expect } from 'chai'
import 'mocha'

describe('Hello function', () => {
    it('should return hello world', () => {
        const result = hello();
        expect(result).to.equal('Hello world!');
    })
})
