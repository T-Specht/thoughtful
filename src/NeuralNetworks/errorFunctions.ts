export interface ErrorFunction {
    error: (output: number, target: number) => number;
    der: (output: number, target: number) => number;
}

export class Errors {
    public static SQUARE: ErrorFunction = {
        error: (output: number, target: number) => 0.5 * Math.pow(output - target, 2),
        der: (output: number, target: number) => output - target
    };
}