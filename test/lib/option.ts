import {expect} from 'chai';
import {option, lazyOption,optionAsync} from '../../src/option';

describe('test for option(Call by Name)',()=>{
    it('option should return correct value',()=>{
        const a = option<number>()
            .or(true,()=>3)
            .or(false,()=>4)
            .finally(()=>5);
        expect(a).to.be.eql(3);

        const b = option()
            .or(true,()=>3)
            .or(true,()=>4)
            .finally(()=>5);
        expect(b).to.be.eql(3);

        const c = option()
            .or(false,()=>3)
            .or(false,()=>4)
            .finally(()=>5);
        expect(c).to.be.eql(5);
    });

});
describe('test for lazyOption(Call by Value)',()=>{
    it('option should return correct value but lazy evaluated',()=>{
        const a = lazyOption<number>()
            .or(true,()=>3)
            .or(false,()=>4)
            .finally(()=>5);
        expect(a()).to.be.eql(3);

        const b = lazyOption()
            .or(true,()=>3)
            .or(true,()=>4)
            .finally(()=>5);
        expect(b()).to.be.eql(3);
        const c = lazyOption()
            .or(false,()=>3)
            .or(false,()=>4)
            .finally(()=>5);
        expect(c()).to.be.eql(5);
    });
});


describe('test for async option', () => {
    it('async Option test',async ()=>{
        const right =  ()=>Promise.resolve();
        const left =  ()=>Promise.reject();

        const correctA = await optionAsync<number>()
            .or(right,()=>2)
            .or(left,()=>3)
            .or(left,()=>4)
            .or(left,()=>5)
            .finally(()=>6);


        expect(correctA).to.be.eql(2);

        const correctB = await optionAsync<number>()
            .or(left,()=>2)
            .or(left,()=>3)
            .or(right,()=>4)
            .or(right,()=>5)
            .finally(()=>6);
        expect(correctB).to.be.eql(4);

        const correctC = optionAsync()
            .or(left,()=>2)
            .or(left,()=>3)
            .or(left,()=>4)
            .or(left,()=>5)
            .finally(()=>6);

        expect(await correctC).to.be.eql(6);

        const correctD = optionAsync()
            .finally(()=>6);

        expect(await correctD).to.be.eql(6);

        const correctE = optionAsync()
            .or(right,()=>2)
            .finally(()=>6);

        expect(await correctE).to.be.eql(2);


    });
});
