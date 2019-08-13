import {compose,composeAsync} from "../src/compose";

const a = (_) => _ + 1;
const b = (_) => _ * 2;
const c = (_) => _ * 2;

const composedFunction = compose(a, b, c);


const noCompose = (_) => a(b(c(_)));

a(b(c(3)));
noCompose(3);

compose(a, b, c)(3);
composedFunction(3);

[1, 2, 3].map(_ => a(_))
    .map(_ => b(_))
    .map(_ => c(_));

[1, 2, 3].map(_ => a(b(c(_))));


[1, 2, 3].map(_ => compose(a, b, c)(_));
[1, 2, 3].map(_ => composedFunction(_));

const aA = async (_) => _ + 1;
const bA = async (_) => _ * 2;
const cA = async (_) => _ * 2;

const composedAsyncFunction =  composeAsync(aA, bA, cA);
composedAsyncFunction(3)
    .then(result=>console.log(result));

aA(3)
    .then(_=>bA(_))
    .then(_=>cA(_))
    .then(result=>console.log(result));
