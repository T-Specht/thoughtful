export interface ErrorFunction {
    error: (output: number, target: number) => number;
    der: (output: number, target: number) => number;
}

export class Errors {
    public static SQUARE: ErrorFunction = {
        error: (output: number, target: number) => 0.5 * Math.pow(output - target, 2),
        der: (output: number, target: number) => output - target
    };
    public static CROSS_ENTROPY: ErrorFunction = {
        error: (output: number, target: number) => {
            return -(target * Math.log(output) + (1-target) * Math.log(1 - output));
        },
        der: (output: number, target: number) => {
            return (output - target)/((1-output) * output);
        }
    }
}