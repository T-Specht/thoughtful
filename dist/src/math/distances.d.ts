export interface NumericDistanceFunction {
    (a: number[], b: number[]): number;
}
export declare class Distances {
    static EUCLIDEAN: NumericDistanceFunction;
    static TAXI: NumericDistanceFunction;
    static LEVENSHTEIN: (a: string, b: string) => any;
}
