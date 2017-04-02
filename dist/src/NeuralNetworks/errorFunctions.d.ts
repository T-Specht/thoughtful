export interface ErrorFunction {
    error: (output: number, target: number) => number;
    der: (output: number, target: number) => number;
}
export declare class Errors {
    static SQUARE: ErrorFunction;
    static CROSS_ENTROPY: ErrorFunction;
}
