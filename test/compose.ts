import {expect} from 'chai';
import {composeAsync, compose} from '../src/compose';

describe('compose tests', () => {
    it('compose, shoud pipe result', () => {
        const a = (_: number): number => _ + 1;
        const b = (_: number) => _ * 2;
        const result = compose<number>(a, b)(2);
        expect(result).to.be.eql(5);

        const resultA = compose(b, a)(2);
        expect(resultA).to.be.eql(6);
    });
    it('composeAsync, should take Promise and return Promise', async () => {
        const a = (_): Promise<number> => Promise.resolve(_ + 1);
        const b = (_): Promise<number> => Promise.resolve(_ * 2);
        const result = await composeAsync<number>(a, b)(2);
        expect(result).to.be.eql(5);

        const resultA = await composeAsync<number>(b, a)(2);
        expect(resultA).to.be.eql(6);
    });
});

