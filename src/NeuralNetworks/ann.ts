import { ActivationFunction, ErrorFunction } from '..';

export interface ANNOptions {
    learningRate: number,
    layers: number[],
    activationFunction: ActivationFunction,
    errorFunction: ErrorFunction,
    momentum: number
}


class Layer {

    // neurons[0] → Bias Unit
    public neurons: Neuron[] = [];

    constructor(private options: {
        numberOfNeurons: number,
        numberOfNeuronsInNextLayer: number,
        netOptions: ANNOptions
    }) {
        // +1 for one bias unit
        for (let n = 0; n < options.numberOfNeurons + 1; n++) {
            this.neurons.push(new Neuron({
                index: n,
                isBiasUnit: n == options.numberOfNeurons,
                netOptions: options.netOptions,
                numberOfNeuronsInNextLayer: options.numberOfNeuronsInNextLayer
            }));
        }
    }

    public forEachNeuron(func: (n: Neuron, i?: number) => void, excludeBias = false) {
        for (let i = 0; i < this.neurons.length - (excludeBias ? 1 : 0); i++) {
            let neuron = this.neurons[i]
            // Bias units are the last ones
            func(neuron, neuron.getIndex());
        }
    }
}

class Neuron {
    public weights: Weight[] = [];
    public input: number;
    public output: number;
    private activationFunction: ActivationFunction;
    public delta: number;
    public prevDelta: number = 0;


    // Bias units are the last ones in array
    constructor(private options: {
        index: number,
        numberOfNeuronsInNextLayer: number,
        netOptions: ANNOptions,
        isBiasUnit: boolean
    }) {

        if (this.isBias()) this.output = 1;

        // Generate weights
        for (let n = 0; n < options.numberOfNeuronsInNextLayer; n++) {
            this.weights.push(new Weight());
        }

        // set shorthand for activation function
        this.activationFunction = this.options.netOptions.activationFunction;

    }

    /**
     * Forward pass of values through the neuron using the prevLayer
     * @param prevLayer i
     */
    public propagateForward(prevLayer: Layer) {
        if (this.isBias()) {
            throw 'A bias unit should not propagate a value forward.'
        }
        let sigma = 0;
        prevLayer.forEachNeuron(n => {
            sigma += n.output * n.getWeightTo(this).value;
        });

        this.input = sigma;
        this.output = this.activationFunction.output(this.input);


    }

    /**
     * Calculates the delta of an output neuron using the derivative term of the specified error function of the network and the target value
     * @param target target value for this output neuron
     */
    public calculateOutputLayerDelta(target: number) {
        if (this.isBias()) throw 'There should not be an output layer delta calculation for a bias unit for it is never used.';
        this.prevDelta = this.delta || 0;
        this.delta = this.options.netOptions.errorFunction.der(this.output, target) * this.activationFunction.der(this.input);
    }

    /**
     * Calculates the delta values for neurons in a hidden layer j using the next layer k
     * @param nextLayer k
     */
    public calculateHiddenLayerDelta(nextLayer: Layer) {
        if (this.isBias()) throw 'There should not be an hidden layer delta calculation for a bias unit for it is not connected to the previous layer.';

        let sigma = 0;
        nextLayer.forEachNeuron((n, i) => {
            sigma += n.delta * this.weights[i].value;
        }, true);

        this.prevDelta = this.delta || 0;
        this.delta = this.activationFunction.der(this.input) * sigma;
    }

    /**
     * Updates the weights which connect the previous layer to the current one using this layer neurons delta values and the output of the previous layer neurons
     * @param prevLayer the previous layer i
     */
    public updateWeights(prevLayer: Layer) {
        prevLayer.forEachNeuron((n, i) => {
            let oldWeight = n.weights[this.getIndex()];
            let derivativeTerm = n.output * this.delta;
            let momentumTerm = this.options.netOptions.momentum * this.prevDelta;
            oldWeight.value -= this.options.netOptions.learningRate * derivativeTerm + momentumTerm;
        });
    };

    /**
     * Get the weight to a neuron in the next layer k from current layer k
     * Weights to layer k are stored in neurons of layer j
     * @param n Neuron in next layer k
     */
    public getWeightTo(n: Neuron) {
        return this.weights[n.getIndex()];
    }

    /**
     * @returns true if the neuron is a bias unit which means it has a constant output of 1
     * Info: Bias units are the last ones in the neurons array in each layer object
     */
    public isBias() {
        return this.options.isBiasUnit;
    }

    /**
     * @returns the index of the current neuron in its layer ranging from 1 to number of specified neurons in layer + 1 because an extra bias neuron is added at the end of neurons array in a layer object.
     */
    public getIndex() {
        return this.options.index;
    }
}

class Weight {
    public value: number;
    public delta: number;
    constructor(value = Math.random()) {
        this.value = value;
    }
}

export class FeedForwardNeuralNetwork {
    private layers: Layer[] = [];
    constructor(private options: ANNOptions) {
        // Create net's layers
        for (let l = 0; l < options.layers.length; l++) {
            this.layers.push(new Layer({
                netOptions: options,
                numberOfNeurons: options.layers[l],
                numberOfNeuronsInNextLayer: options.layers[l + 1] || 0
            }))
        }
    }

    /**
     * Creates new network with specified weights
     * @param weightData previously saved weights (using Network.exportWeights)
     * @param options network options
     */
    public static restore(weightData: number[][][], options: ANNOptions) {
        let ann = new FeedForwardNeuralNetwork(options);
        for (let l = 0; l < weightData.length; l++) {
            for (let n = 0; n < weightData[l].length; n++) {
                for (let w = 0; w < weightData[l][n].length; w++) {
                    ann.layers[l].neurons[n].weights[w].value = weightData[l][n][w]
                }
            }
        }
        return ann;
    }

    /**
     * @returns the input layer
     */
    private get inputLayer() {
        return this.layers[0]
    }

    /**
     * @returns the output layer
     */
    private get outputLayer() {
        return this.layers[this.layers.length - 1];
    }

    /**
     * Forward Pass of the network where values are propagated through the network
     * @param inputs input values matching the specified size of the network's input layer
     */
    private propagateForward(inputs: number[]) {
        if (inputs.length != this.inputLayer.neurons.length - 1) {
            throw "Inputs do not match network size!";
        }
        // Set input layer neurons output to input values; exclude bias of course
        this.inputLayer.forEachNeuron((n, i) => n.output = inputs[i], true);


        // propagate values forward through layer starting from first hidden layer
        for (let l = 1; l < this.layers.length; l++) {
            let layer = this.layers[l];
            let prevLayer = this.layers[l - 1];
            layer.forEachNeuron(n => n.propagateForward(prevLayer), true);
        }

        return this;

    }

    /**
     * @returns the current output of the network
     */
    private getCurrentOutput() {
        return this.outputLayer.neurons.map(n => n.output).slice(0, -1);
    }

    /**
     * Calculate all the neurons delta values
     * @param targetValues target values for the network with respect to last forward pass
     */
    private calculateDeltas(targetValues: number[]) {
        // calculate Output layer calculateDeltas
        this.outputLayer.forEachNeuron((n, i) => n.calculateOutputLayerDelta(targetValues[i]), true);

        // propagate error backwards through hidden layers
        for (let l = this.layers.length - 2; l > 0; l--) {
            let layer = this.layers[l];
            let nextLayer = this.layers[l + 1];
            layer.forEachNeuron(n => n.calculateHiddenLayerDelta(nextLayer), true);
        }

        return this;
    }

    /**
     * Update the connection weights using previous calculated delta values
     */
    private updateWeights() {

        // go through all layers except input layer and update all the weights with the calculated deltaValues.
        for (let l = 1; l < this.layers.length; l++) {
            let layer = this.layers[l];
            let prevLayer = this.layers[l - 1];
            layer.forEachNeuron(n => n.updateWeights(prevLayer), true);

        }

        return this;
    }

    /**
     * Fits given inputs to given target values by training the network
     * @param inputs inputs to the network
     * @param targetValues expected outputs for given input
     */
    public fit(inputs: number[], targetValues: number[]) {
        this.propagateForward(inputs).calculateDeltas(targetValues).updateWeights();
        return this;
    }

    /**
     * Predict output values for given inputs
     * @param inputs input values
     */
    public predict(inputs: number[]) {
        return this.propagateForward(inputs).getCurrentOutput();
    }

    /**
     * Calculate the error for current outputs (not forward pass)
     * @param targetValues target values
     */
    public getCurrentError(targetValues: number[]) {
        return this.getCurrentOutput().reduce((s, o, i) => {
            return s + this.options.errorFunction.error(o, targetValues[i])
        }, 0);
    }

    /**
     * Calculates the error for given inputs
     * @param inputs inputs to network
     * @param targetValues expected output for given inputs
     */
    public error(inputs: number[], targetValues: number[]) {
        this.propagateForward(inputs);
        return this.getCurrentError(targetValues);
    }

    /**
     * Export the current weights of the network
     */
    public exportWeights() {
        let data: number[][][] = [];
        for (let l = 0; l < this.layers.length - 1; l++) {
            let layer = this.layers[l];
            let layerData = layer.neurons.map(n => n.weights.map(w => w.value));
            data.push(layerData);
        }
        return data;
    }
}