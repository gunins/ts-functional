import {Ifn} from "./interfaces";

const pipe = <A>(fn: Ifn<A>, ...fns: Ifn<A>[]) => (param, ...staticArgs): A => fns.reduce((acc, f) => f(acc), fn(param, ...staticArgs));

const compose = <A>(...fns: Ifn<A>[]) => {
    const [head, ...tail] = fns.reverse();
    return pipe<A>(head, ...tail);
};

const pipeAsync = <A>(fn, ...fns) => (param, ...staticArgs) => fns
    .reduce((acc, f) => acc
        .then((_): Promise<A> => f(_, ...staticArgs)), fn(param, ...staticArgs));

const composeAsync = <A>(...fns: Ifn<Promise<A>>[]) => {
    const [head, ...tail] = fns.reverse();
    return pipeAsync<A>(head, ...tail);
};

export {compose, composeAsync, pipe, pipeAsync}
