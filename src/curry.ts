import {CurriedInterface2, CurriedInterface3, CurriedInterface4} from './curryInterface';

const _curry = (fn, ...args) => (fn.length <= args.length) ? fn(...args) : (...more) => _curry(fn, ...args, ...more);

const curry2: { <A, B, R>(fn: (p0: A, p1: B) => R): CurriedInterface2<A, B, R> } = _curry;
const curry3: { <A, B, C, R>(fn: (p0: A, p1: B, p2: C) => R): CurriedInterface3<A, B, C, R> } = _curry;
const curry4: { <A, B, C, D, R>(fn: (p0: A, p1: B, p2: C, p3: D) => R): CurriedInterface4<A, B, C, D, R> } = _curry;

export {curry2, curry3, curry4}
