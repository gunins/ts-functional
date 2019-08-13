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

interface Ilens<A, B> {
	get(obj: A): B | undefined,

	set(value: B, obj: A): A
}

export {Ifn, IMethods, IMethodsPromise, Ilens}
