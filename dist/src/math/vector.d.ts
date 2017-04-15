export declare class Vector {
    private components;
    constructor(components: number[]);
    static rand(size: number): Vector;
    copy(): Vector;
    getArray(): number[];
    append(vec: Vector): this;
    prepend(vec: Vector): this;
    readonly size: number;
    readonly magnitude: number;
    get(component: number): number;
    set(component: number, value: number): this;
    add(vec: Vector): this;
    subtract(vec: Vector): this;
    multiply(vec: Vector): this;
    divide(vec: Vector): this;
    pow(exponent: number): this;
    sum(): number;
    scale(scl: number): this;
    /**
     * this vector will be a row vector
     * @param vec column vector
     */
    dot(vec: Vector): number;
    apply(func: (number) => number): this;
    private assertSameSize(vec);
}
