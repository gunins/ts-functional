// @ts-ignore
import {curry2} from 'ts-curry';

//converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))

const converge = curry2((after, fns) => (...args) => after(...fns.map((_) => _(...args))));

export {converge}
