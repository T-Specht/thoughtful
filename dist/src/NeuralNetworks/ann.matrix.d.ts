import { ActivationFunction, ErrorFunction, Matrix } from '..';
export declare module FeedForward {
    interface ANNOptions {
        learningRate: number;
        layers: number[];
        activationFunction: ActivationFunction;
        errorFunction: ErrorFunction;
        momentum: number;
    }
    class Network {
        private options;
        private weights;
        private deltas;
        layers: Matrix[];
        private inputs;
        constructor(options: ANNOptions);
        forwardPass(inputs: Matrix | number[]): Matrix;
        backwardPass(targets: Matrix | number[]): void;
        updateWeights(): void;
        error(inputs: Matrix | number[], targets: Matrix | number[]): Matrix;
    }
}
