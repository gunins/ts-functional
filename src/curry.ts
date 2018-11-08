import {Ifn} from './Icurry';

const {assign} = Object;
const pipe = <A>(fn: Ifn<A>, ...fns: Ifn<A>[]) => (param, ...staticArgs): A => fns.reduce((acc, f) => f(acc), fn(param, ...staticArgs));

const compose = <A>(...fns: Ifn<A>[]) => {
    const [head, ...tail] = fns.reverse();
    return pipe<A>(head, ...tail);
};

const pipeAsync = <A>(fn, ...fns) => (param, ...staticArgs) => fns.reduce((acc, f) => acc.then(_ => f(_, ...staticArgs)), fn(param, ...staticArgs));

const composeAsync = <A>(...fns) => {
    const [head, ...tail] = fns.reverse();
    return pipeAsync<A>(head, ...tail);
};


const apply = (...fns) => (...args) => fns.map(fn => fn(...args));
const curry = <A>(fn:Ifn<A>, ...args) => (fn.length <= args.length) ? fn(...args) : (...more)=> curry<A>(fn, ...args, ...more);

const match = <A>(guard) => (left:Ifn<A>, right:Ifn<A>) => (...args) => (..._) => guard(...args) ? right(..._, ...args) : left(..._, ...args);
const extract = (_) => (...methods) => methods.reduce((acc, method) => assign(acc, {[method]: (...args) => _[method](...args)}), {});


export {pipe, compose, curry, apply, match, extract, composeAsync, pipeAsync}
