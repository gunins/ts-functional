// @ts-ignore
import {curry2, curry3, curry4} from 'ts-curry';
import {Ilens} from './interfaces';

const {isArray} = Array;
const {assign} = Object;


const ifTailHasSize = <A>({length}: A[]) => length === 0;


const prop = curry2((key: string | number, obj) => (obj || {})[key]);
const assoc = curry3((key: string | number, val, obj) => assign(isArray(obj) ? [] : {}, obj || {}, {[key]: val}));

const lens = <A, B>(get, set): Ilens<A, B> => ({get, set});

const view = curry2((lens, obj) => lens.get(obj));

const set = curry3((lens, val, obj) => lens.set(val, obj));

const over = curry3((lens, fn, obj) => set(lens, fn(view(lens, obj)), obj));

const overAsync = curry3(async (lens, fn, obj) => set(lens, await fn(view(lens, obj)), obj));

const setOver = curry4((setterLens, getterLens, fn, obj) => set(setterLens, fn(view(getterLens, obj)), obj));

const setOverAsync = curry4(async (setterLens, getterLens, fn, obj) => set(setterLens, await fn(view(getterLens, obj)), obj));


const lensProp = <A, B>(key) => lens<A, B>(prop(key), assoc(key));
const lensPath = <A, B>(head: string | number, ...tail: (string | number)[]) => {
    const [tailHead, ...tailTail] = tail;
    return {
        get(obj = {}): B {
            return ifTailHasSize<string | number>(tail) ? view(lensProp<A, B>(head), obj) : view(lensPath<A, B>(tailHead, ...tailTail), obj[head]);
        },
        set(val, obj = {}): B {
            return ifTailHasSize<string | number>(tail) ? set(lensProp<A, B>(head), val, obj) : assoc(head, set(lensPath<A, B>(tailHead, ...tailTail), val, obj[head]), obj);
        }
    }
};

export {prop, assoc, lens, view, set, over, setOver, overAsync, setOverAsync, lensProp, lensPath}
