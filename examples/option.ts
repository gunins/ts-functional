import {option} from '../src/option';

const testAisBigger = (a, b) => a > b;
const testBisBigger = (a, b) => b > a;

const whoIsBigger = (a, b) => {
    return option()
        .or(testAisBigger(a, b), () => 'A is bigger')
        .or(testBisBigger(a, b), () => 'B is bigger')
        .finally(() => 'Neither is bigger');
};

console.log(whoIsBigger(10, 20));
console.log(whoIsBigger(20, 10));
console.log(whoIsBigger(10, 10));

