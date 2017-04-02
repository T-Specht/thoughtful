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
            numberOfNeuronsInNextLayer: number;
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
            numberOfNeuronsInNextLayer: number;
            netOptions: ANNOptions;
            isBiasUnit: boolean;
        });
        propagateForward(prevLayer: Layer): void;
        calculateOutputLayerDelta(target: number): void;
        calculateHiddenLayerDelta(nextLayer: Layer): void;
        updateWeights(prevLayer: Layer): void;
        /**
         *
         * @param n Neuron in next layer k
         */
        getWeightTo(n: Neuron): Weight;
        isBias(): boolean;
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
        propagateForward(inputs: number[]): this;
        getCurrentOutput(): number[];
        calculateDeltas(targetValues: number[]): this;
        updateWeights(): this;
        fit(inputs: number[], targetValues: number[]): this;
        predict(inputs: number[]): number[];
        getCurrentError(targetValues: number[]): number;
    }
}
