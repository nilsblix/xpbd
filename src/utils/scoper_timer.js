/*
EXAMPLE:

const timer = new ScopedTimer();

function foo(mult) {
    let a = 10;
    for (let i = 0; i < 100_000_000; i++) {
        a *= mult;
    }
    return a;
}

const a = timer.measure(() => foo(0.9999999999));
*/
export class ScopedTimer {
    constructor() {
        this.dt = 0;
    }

    /**
     * The time "foo" takes is stored in this.dt as SECONDS.
     * @param {Function} foo Can be void or not.
     * @returns void or whatever foo returns
     */
    measure(foo) {
        const st = performance.now();
        const result = foo();
        const et = performance.now();
        this.dt = et - st;
        this.dt *= 1E-3;

        return result;
    }

}