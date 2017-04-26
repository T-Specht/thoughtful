import { Maths, ActivationFunction, ErrorFunction } from "..";
export declare class ANN {
    private options;
    private weights;
    private biases;
    private inputs;
    private outputs;
    private deltas;
    private gradients;
    constructor(options: {
        size: number[];
        activation: ActivationFunction;
        error: ErrorFunction;
        learningRate: number;
        momentum?: number;
    });
    private apply(tensor, func);
    cost(output: Maths.Vector, target: Maths.Vector): number;
    backward(target: Maths.Vector): number[][][];
    calculateGradients(deltas?: Maths.Vector[]): number[][][];
    updateWeightsAndBiases(gradients?: Maths.Vector[], deltas?: Maths.Vector[]): void;
    forward(input: Maths.Vector): number[][];
}
