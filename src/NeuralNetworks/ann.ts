import { ActivationFunction, ErrorFunction } from '..';


export module FeedForward {
    export interface ANNOptions {
        learningRate: number,
        layers: number[],
        activationFunction: ActivationFunction,
        errorFunction: ErrorFunction
    }


    export class Layer {

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

    export class Neuron {
        private weights: Weight[] = [];
        public input: number;
        public output: number;
        private activationFunction: ActivationFunction;
        public delta: number;


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

        public calculateOutputLayerDelta(target: number) {
            if (this.isBias()) throw 'There should not be an output layer delta calculation for a bias unit for it is never used.';
            this.delta = this.options.netOptions.errorFunction.der(this.output, target) * this.activationFunction.der(this.input);
        }

        public calculateHiddenLayerDelta(nextLayer: Layer) {
            if (this.isBias()) throw 'There should not be an hidden layer delta calculation for a bias unit for it is not connected to the previous layer.';

            let sigma = 0;
            nextLayer.forEachNeuron((n, i) => {
                sigma += n.delta * this.weights[i].value;
            }, true);

            this.delta = this.activationFunction.der(this.input) * sigma;
        }

        /*public updateWeights(nextLayer: Layer) {
            this.weights = this.weights.map((w, i) => {
                let derivative = this.output * nextLayer.neurons[i].delta;
                w.value -= this.options.netOptions.learningRate * derivative;
                return w;
            });
        };*/
        public updateWeights(prevLayer: Layer) {
            prevLayer.forEachNeuron((n, i) => {
                let oldWeight = n.weights[this.getIndex()];
                let derivativeTerm = n.output * this.delta;
                oldWeight.value -= this.options.netOptions.learningRate * derivativeTerm;
            });
        };

        /**
         * 
         * @param n Neuron in next layer k
         */
        public getWeightTo(n: Neuron) {
            return this.weights[n.getIndex()];
        }

        public isBias() {
            return this.options.isBiasUnit;
        }

        public getIndex() {
            return this.options.index;
        }
    }

    export class Weight {
        public value: number;
        public delta: number;
        constructor(value = Math.random()) {
            this.value = value;
        }
    }

    export class Network {
        layers: Layer[] = [];
        constructor(private options: ANNOptions) {
            for (let l = 0; l < options.layers.length; l++) {
                this.layers.push(new Layer({
                    netOptions: options,
                    numberOfNeurons: options.layers[l],
                    numberOfNeuronsInNextLayer: options.layers[l + 1] || 0
                }))
            }
        }

        private get inputLayer() {
            return this.layers[0]
        }
        private get outputLayer() {
            return this.layers[this.layers.length - 1];
        }

        public propagateForward(inputs: number[]) {
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

        public getCurrentOutput() {
            return this.outputLayer.neurons.map(n => n.output).slice(0, -1);
        }

        public calculateDeltas(targetValues: number[]) {
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


        public updateWeights() {

            // go through all layers except input layer and update all the weight with the calculated deltaValues.
            for (let l = 1; l < this.layers.length; l++) {
                let layer = this.layers[l];
                let prevLayer = this.layers[l - 1];                
                layer.forEachNeuron(n => n.updateWeights(prevLayer), true);
                
            }

            return this;
        }

        public fit(inputs: number[], targetValues: number[]) {
            this.propagateForward(inputs).calculateDeltas(targetValues).updateWeights();
            return this;
        }

        public predict(inputs: number[]){
            return this.propagateForward(inputs).getCurrentOutput();
        }

        public getCurrentError(targetValues: number[]) {
            return this.getCurrentOutput().reduce((s, o, i) => {
                return s + this.options.errorFunction.error(o, targetValues[i])
            }, 0);
        }
    }
}