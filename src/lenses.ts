import {curry2, curry3, curry4} from './curry';
import {Ilens, Ifn} from './interfaces';
import {CurriedInterface1, CurriedInterface2, CurriedInterface3} from './curryInterface';

const {isArray} = Array;
const {assign} = Object;


const ifTailHasSize = <A>({length}: A[]) => length === 0;


const prop = curry2((key: string | number, obj) => (obj || {})[key]);
const assoc = curry3((key: string | number, val, obj) => assign(isArray(obj) ? [] : {}, obj || {}, {[key]: val}));

const lens = <A, B>(get, set): Ilens<A, B> => ({get, set});


interface Iview {
    <A, B>(lens: Ilens<A, B>): {
        (obj: A): B;
    };

    <A, B>(lens: Ilens<A, B>, obj: A): B;
}

const view: Iview = curry2((lens, obj) => lens.get(obj));

interface Iset {
    <A, B>(lens: Ilens<A, B>, val: B, obj: A): A;

    <A, B>(lens: Ilens<A, B>, val: B): CurriedInterface1<A, A>;

    <A, B>(lens: Ilens<A, B>): CurriedInterface2<B, A, A>;
}

const set: Iset = curry3((lens, val, obj) => lens.set(val, obj));


interface Iover {
    <A, B>(lens: Ilens<A, B>, fn: Ifn<B>, obj: A): A;

    <A, B>(lens: Ilens<A, B>, fn: Ifn<B>): CurriedInterface1<A, A>;

    <A, B>(lens: Ilens<A, B>): CurriedInterface2<Ifn<B>, A, A>;
}

const over: Iover = curry3((lens, fn, obj) => set(lens, fn(view(lens, obj)), obj));

interface IoverAsync {
    <A, B>(lens: Ilens<A, B>, fn: Ifn<Promise<B>>, obj: A): Promise<A>;

    <A, B>(lens: Ilens<A, B>, fn: Ifn<Promise<B>>): CurriedInterface1<A, Promise<A>>;

    <A, B>(lens: Ilens<A, B>): CurriedInterface2<Ifn<Promise<B>>, A, Promise<A>>;
}

const overAsync: IoverAsync = curry3(async (lens, fn, obj) => set(lens, await fn(view(lens, obj)), obj));

interface IsetOver {
    <A, B, C>(setterLens: Ilens<A, B>, getterLens: Ilens<A, C>, fn: Ifn<C>, obj: A): A;

    <A, B, C>(setterLens: Ilens<A, B>, getterLens: Ilens<A, C>, fn: Ifn<C>): CurriedInterface1<A, A>;

    <A, B, C>(setterLens: Ilens<A, B>, getterLens: Ilens<A, C>): CurriedInterface2<Ifn<C>, A, A>;

    <A, B, C>(setterLens: Ilens<A, B>): CurriedInterface3<Ilens<A, C>, Ifn<C>, A, A>;
}

const setOver: IsetOver = curry4((setterLens, getterLens, fn, obj) => set(setterLens, fn(view(getterLens, obj)), obj));

interface IsetOverAsync {
    <A, B, C>(setterLens: Ilens<A, B>, getterLens: Ilens<A, C>, fn: Ifn<Promise<C>>, obj: A): Promise<A>;

    <A, B, C>(setterLens: Ilens<A, B>, getterLens: Ilens<A, C>, fn: Ifn<Promise<C>>): CurriedInterface1<A, Promise<A>>;

    <A, B, C>(setterLens: Ilens<A, B>, getterLens: Ilens<A, C>): CurriedInterface2<Ifn<Promise<C>>, A, Promise<A>>;

    <A, B, C>(setterLens: Ilens<A, B>): CurriedInterface3<Ilens<A, C>, Ifn<Promise<C>>, A, Promise<A>>;
}

const setOverAsync: IsetOverAsync = curry4(async (setterLens, getterLens, fn, obj) => set(setterLens, await fn(view(getterLens, obj)), obj));


const lensProp = <A, B>(key) => lens<A, B>(prop(key), assoc(key));
const lensPath = <A, B>(head: string | number, ...tail: (string | number)[]) => {
    const [tailHead, ...tailTail] = tail;
    return {
        get(obj = {}): B {
            return ifTailHasSize<string | number>(tail) ? view(lensProp<A, B>(head), obj) : view<A, B>(lensPath<A,B>(tailHead, ...tailTail), obj[head]);
        },
        set(val, obj = {}): A {
            // @ts-ignore
            return ifTailHasSize<string | number>(tail) ? set<A, B>(lensProp<A, B>(head), val, obj) : assoc(head, set(lensPath<A,B>(tailHead, ...tailTail), val, obj[head]), obj);
        }
    }
};

export {prop, assoc, lens, view, set, over, setOver, overAsync, setOverAsync, lensProp, lensPath}
