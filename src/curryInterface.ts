interface CurriedInterface1<P0, R> {
    (p0: P0): R;
};
interface CurriedInterface2<P0, P1, R> {
    (p0: P0): {
        (p1: P1): R;
    };

    (p0: P0, p1: P1): R;
};

interface CurriedInterface3<P0, P1, P2, R> {
    (p0: P0, p1: P1, p2: P2): R;

    (p0: P0, p1: P1): {
        (p2: P2): R;
    };

    (p0: P0): CurriedInterface2<P1, P2, R>;
};

interface CurriedInterface4<P0, P1, P2, P3, R> {
    (p0: P0, p1: P1, p2: P2, p3: P3): R;

    (p0: P0, p1: P1, p2: P2): {
        (p3: P3): R;
    };

    (p0: P0, p1: P1): CurriedInterface2<P2, P3, R>;

    (p0: P0): CurriedInterface3<P1, P2, P3, R>;
};

export {CurriedInterface1, CurriedInterface2, CurriedInterface3, CurriedInterface4}
