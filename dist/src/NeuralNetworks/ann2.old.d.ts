import { ActivationFunction, ErrorFunction } from "..";
export declare class ANN {
    private options;
    private weights;
    private biases;
    private inputs;
    private outputs;
    private deltas;
    constructor(options: {
        size: number[];
        activation: ActivationFunction;
        error: ErrorFunction;
        learningRate: number;
        momentum?: number;
    });
    cost(target: number[]): number;
    backPropagate(target: number[]): void;
    updateWeights(): void;
    /**
     *
     * @param input Vector of Input values matching network size
     */
    query(input: number[]): number[];
}
