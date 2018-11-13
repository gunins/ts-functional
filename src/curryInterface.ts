interface CurriedInterface1<A, R> {
    (p0: A): R;
};
interface CurriedInterface2<A, B, R> {
    (p0: A): {
        (p1: B): R;
    };

    (p0: A, p1: B): R;
};

interface CurriedInterface3<A, B, C, R> {
    (p0: A, p1: B, p2: C): R;

    (p0: A, p1: B): {
        (p2: C): R;
    };

    (p0: A): CurriedInterface2<B, C, R>;
};

interface CurriedInterface4<A, B, C, D, R> {
    (p0: A, p1: B, p2: C, p3: D): R;

    (p0: A, p1: B, p2: C): {
        (p3: D): R;
    };

    (p0: A, p1: B): CurriedInterface2<C, D, R>;

    (p0: A): CurriedInterface3<B, C, D, R>;
};

export {CurriedInterface1, CurriedInterface2, CurriedInterface3, CurriedInterface4}
