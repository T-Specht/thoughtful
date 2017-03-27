import { ActivationFunction, ErrorFunction } from '..';
export declare module FeedForward {
    interface ANNOptions {
        learningRate: number;
        layers: number[];
        activationFunction: ActivationFunction;
        errorFunction: ErrorFunction;
    }
    class Layer {
        private options;
        neurons: Neuron[];
        constructor(options: {
            numberOfNeurons: number;
            numberOfNeuronsInPrevLayer: number;
            netOptions: ANNOptions;
        });
        forEachNeuron(func: (n: Neuron, i?: number) => void, excludeBias?: boolean): void;
    }
    class Neuron {
        private options;
        private weights;
        input: number;
        output: number;
        private activationFunction;
        delta: number;
        constructor(options: {
            index: number;
            numberOfNeuronsInPrevLayer: number;
            netOptions: ANNOptions;
            isBiasUnit: boolean;
        });
        activate(prevLayer: Layer): void;
        calculateDelta(nextLayer: Layer, targetValue?: number): void;
        updateWeights(prevLayer: Layer): void;
        isBias(): boolean;
        setOutput(value: number): void;
        getIndex(): number;
    }
    class Weight {
        value: number;
        delta: number;
        constructor(value?: number);
    }
    class Network {
        private options;
        layers: Layer[];
        constructor(options: ANNOptions);
        private readonly inputLayer;
        private readonly outputLayer;
        private readonly hiddenLayers;
        getOutput(): number[];
        feedForwardPass(values: number[]): this;
        backwardPass(targetValues: number[]): this;
        updateWeights(): this;
        train(input: number[], targetValues: number[]): this;
        error(target: number[]): number;
    }
}
