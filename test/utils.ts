import {expect} from 'chai';
import {apply, match, extract} from '../src/utils';

describe('apply Tests', () => {
    it('apply args to all items in a list', () => {
        const result = apply((a, b) => a + b + 1, (a) => a + 2, (_, b) => b);
        expect(result(1, 2)).to.be.eql([4, 3, 2]);
        expect(result(2, 1)).to.be.eql([4, 4, 1]);

    });
});
describe('match Tests', () => {
    it('should return left if false, right if true', () => {
        const left = (l, r) => 'false' + l + r;
        const right = (l, r) => 'true' + l + r;
        const guard = (_) => _ === '_right';
        const matchLeft = match(guard)(left, right);
        const matchRight = match(guard)(left, right);
        expect(matchLeft('_left')('_functionArgs_')).to.be.eql('false_functionArgs__left');
        expect(matchRight('_right')('_functionArgs_')).to.be.eql('true_functionArgs__right');
    });


});

describe('extract tests', () => {
    it('Should extract method from class, and not fail', () => {
        class ClassObj {
            _name: string;

            constructor() {
                this._name = 'empty'
            }

            getName() {
                return this._name;
            }

            setName(name) {
                this._name = name;
            }
        }

        const {getName, setName} = extract(new ClassObj())('getName', 'setName');
        expect(getName()).to.be.eql('empty');
        setName('vasja');
        expect(getName()).to.be.eql('vasja');


    });

});
