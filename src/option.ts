import {Ifn, IMethods, IMethodsPromise} from './interfaces';

const getMethod = <A>(methods: IMethods<A>[]) => methods.find(({bool}) => bool) || {bool: false};
//Option will find true statement and returning result (Call by Value)
const option = <A>(...methods: IMethods<A>[]) => ({
    or(bool: boolean, left: Ifn<A>) {
        return option<A>(...methods, {bool, left})
    },
    finally(right: Ifn<A>): A {
        const {left} = getMethod(methods);
        return left ? left() : right();
    }
});

// lazyOption will find true statement, and return function (Call by Name)
const lazyOption = <A>(...methods: IMethods<A>[]) => ({
    or(bool: boolean, left: Ifn<A>) {
        return lazyOption(...methods, {bool, left})
    },
    finally(right): Ifn<A> {
        const {left} = getMethod(methods);
        return left ? left : right;
    }
});

const testHead = <A>(head: IMethodsPromise<A>) => head || {};

const findAsync = <A>([head, ...tail]: IMethodsPromise<A>[]) => {
    const {bool, left} = testHead<A>(head);
    return bool
        ? bool()
            .then(() => left)
            .catch(() => findAsync(tail))
        : Promise.reject();
};

const optionAsync = <A>(...methods: IMethodsPromise<A>[]) => ({
    or(bool, left: Ifn<A>) {
        return optionAsync<A>(...methods, {bool, left})
    },
    finally(right: Ifn<A>) {
        return findAsync<A>(methods)
            .then(left => left())
            .catch(() => right())
    }
});

const promiseOption = (cond:boolean) => cond ? Promise.resolve(cond) : Promise.reject(cond);


export {option, lazyOption, optionAsync, promiseOption};
