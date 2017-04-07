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
        layerInputs: Matrix[];
        constructor(options: ANNOptions);
        forwardPass(inputs: Matrix | number[]): Matrix;
        error(inputs: Matrix | number[], targets: Matrix | number[]): Matrix;
    }
}
