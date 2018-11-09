interface Ifn<A> {
    (...args: any[]): A;
}

interface IMethods<A> {
    bool: boolean,
    left?: Ifn<A>
}

interface IMethodsPromise<A> {
    bool?: () => Promise<boolean>,
    left?: Ifn<A>
}

export {Ifn, IMethods, IMethodsPromise}
