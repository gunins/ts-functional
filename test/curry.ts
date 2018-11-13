import {expect} from 'chai';
import {curry2, curry3, curry4} from '../src/curry';


describe('curry Tests', () => {
    it('curry2 case', () => {
        const result = curry2<number, number, number>((a, b) => a + b);
        expect(result(1, 2)).to.be.eql(3);
        expect(result(1)(2)).to.be.eql(3);
    });
    it('curry3 case', () => {
        const result = curry3<number, number, number, number>((a, b, c) => a + b + c);
        expect(result(1, 2, 3)).to.be.eql(6);
        expect(result(1, 2)(3)).to.be.eql(6);
        expect(result(1)(2)(3)).to.be.eql(6);
        expect(result(1)(2, 3)).to.be.eql(6);
    });
    it('curry4 case', () => {
        const result = curry4<number, number, number, number, number>((a, b, c, d) => a + b + c + d);
        expect(result(1, 2, 3, 4)).to.be.eql(10);
        expect(result(1, 2, 3)(4)).to.be.eql(10);
        expect(result(1)(2, 3)(4)).to.be.eql(10);
        expect(result(1)(2)(3)(4)).to.be.eql(10);
    });
});



