import {expect} from 'chai';
import {converge} from '../src/converge';

describe('converge Tests', () => {
    it('concat to Lowercase and uppercase', () => {
        const concat = (a: string, b: string): string => a + b;
        const toUpper = (str: string): string =>str.toUpperCase();
        const toLower = (str: string): string => str.toLowerCase();
        const strangeConcat = converge<number>(concat, [toUpper, toLower]);
        expect(strangeConcat('Yodel')).to.eql('YODELyodel');

    });
});

