import { ActivationFunction, ErrorFunction } from '..';
export interface ANNOptions {
    learningRate: number;
    layers: number[];
    activationFunction: ActivationFunction;
    errorFunction: ErrorFunction;
}
export declare class Layer {
    private options;
    neurons: Neuron[];
    constructor(options: {
        numberOfNeurons: number;
        numberOfNeuronsInNextLayer: number;
        netOptions: ANNOptions;
    });
    forEachNeuron(func: (n: Neuron, i?: number) => void, excludeBias?: boolean): void;
}
export declare class Neuron {
    private options;
    private weights;
    input: number;
    output: number;
    private activationFunction;
    constructor(options: {
        index: number;
        numberOfNeuronsInNextLayer: number;
        netOptions: ANNOptions;
        isBiasUnit: boolean;
    });
    activate(prevLayer: Layer): void;
    calculateDelta(nextLayer: Layer): void;
    isBias(): boolean;
    getWeightToNeuronFromNextLayer(n: Neuron): Weight;
    setOutput(value: number): void;
    getIndex(): number;
}
export declare class Weight {
    value: number;
    delta: number;
    constructor(value?: number);
}
export declare class ANN {
    private options;
    layers: Layer[];
    constructor(options: ANNOptions);
    private readonly inputLayer;
    private readonly outputLayer;
    private readonly hiddenLayers;
    getOutput(): number[];
    feedForwardPass(values: number[]): number[];
    backwardPass(targetValues: number[]): void;
    error(target: number[]): number;
}
