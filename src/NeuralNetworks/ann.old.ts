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
            // +1 for bias Unit
            for (let i = 0; i < options.numberOfNeurons + 1; i++) {
                this.neurons.push(new Neuron({
                    index: i - 1,
                    isBiasUnit: i == 0,
                    netOptions: options.netOptions,
                    numberOfNeuronsInNextLayer: options.numberOfNeuronsInNextLayer
                }));
            }
        }



        public forEachNeuron(func: (n: Neuron, i?: number) => void, excludeBias = false) {
            for (let i = excludeBias ? 1 : 0; i < this.neurons.length; i++) {
                let neuron = this.neurons[i]
                // Bias units have Index of -1
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


        // Bias units have index == -1
        constructor(private options: {
            index: number,
            numberOfNeuronsInNextLayer: number,
            netOptions: ANNOptions,
            isBiasUnit: boolean
        }) {
            for (let i = 0; i < options.numberOfNeuronsInNextLayer; i++)
                this.weights.push(new Weight());

            if (options.isBiasUnit) this.setOutput(1);
            this.activationFunction = options.netOptions.activationFunction;
        }

        public activate(prevLayer: Layer) {

            if (this.options.isBiasUnit) {
                throw 'Cannot activate Bias Unit!';
            }
            this.input = 0;
            prevLayer.forEachNeuron(n => this.input += n.output * n.getWeightToNeuronFromNextLayer(this).value);
            this.output = this.activationFunction.output(this.input);
        };

        public calculateDelta(nextLayer: Layer, targetValue?: number) {
            if (nextLayer) {
                let deltaSum = 0;
                nextLayer.forEachNeuron(n => {
                    deltaSum += n.delta * this.getWeightToNeuronFromNextLayer(n).value;
                }, true);
                this.delta = this.activationFunction.output(this.input) * deltaSum;
            } else {
                // Neuron in Output Layer
                this.delta = this.options.netOptions.errorFunction.der(this.output, targetValue) * this.activationFunction.der(this.input);
            }
        }

        public updateWeights(prevLayer: Layer) {
            prevLayer.forEachNeuron((n, i) => {
                let oldWeight = this.getWeightToThisNeuronFromPrevLayerNeuron(n).value;
                let newWeight = oldWeight - this.options.netOptions.learningRate * this.delta * n.output;
                this.setWeightToThisNeuronFromPrevLayerNeuron(n, newWeight);
            });
        }

        public isBias() {
            return this.options.isBiasUnit;
        }

        public getWeightToNeuronFromNextLayer(n: Neuron) {
            return this.weights[n.options.index];
        }
        public getWeightToThisNeuronFromPrevLayerNeuron(n: Neuron) {

            return n.weights[this.options.index];
        }
        public setWeightToThisNeuronFromPrevLayerNeuron(n: Neuron, value: number) {
            n.weights[this.options.index].value = value;
        }


        public setOutput(value: number) {
            this.output = value;
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

            // Create Layers
            options.layers.forEach((l, i) => {
                this.layers.push(new Layer({
                    numberOfNeurons: l,
                    numberOfNeuronsInNextLayer: options.layers[i + 1] || 0,
                    netOptions: options
                }));
            });
        }

        private get inputLayer() {
            return this.layers[0];
        }
        private get outputLayer() {
            return this.layers[this.layers.length - 1];
        }

        private get hiddenLayers() {
            return this.layers.slice(1, -2);
        }

        public getOutput() {
            return this.outputLayer.neurons.slice(1).map(n => n.output);
        }

        public feedForwardPass(values: number[]) {
            this.inputLayer.forEachNeuron((n, i) => {
                n.setOutput(values[i]);
            }, true);

            for (let i = 1; i < this.layers.length; i++) {
                let layer = this.layers[i];
                let prevLayer = this.layers[i - 1];
                layer.forEachNeuron(n => n.activate(prevLayer), true);
            }

            return this;
        }

        public backwardPass(targetValues: number[]) {
            let output = this.getOutput();
            this.outputLayer.forEachNeuron((n, i) => n.calculateDelta(undefined, targetValues[i]), true);

            for (let i = this.layers.length - 2; i >= 0; i--) {
                let layer = this.layers[i];
                let nextLayer = this.layers[i + 1];
                layer.forEachNeuron(n => n.calculateDelta(nextLayer), true);
            }
            return this;
        }

        public updateWeights() {
            for (let i = 1; i < this.layers.length; i++) {
                let layer = this.layers[i];
                let prevLayer = this.layers[i - 1];
                layer.forEachNeuron(n => n.updateWeights(prevLayer), true);
            }
            return this;
        }

        public train(input: number[], targetValues: number[]) {
            this.feedForwardPass(input);
            this.backwardPass(targetValues);
            this.updateWeights();
            return this;
        }

        public error(target: number[]) {
            let sum = 0;
            let output = this.getOutput();
            target.forEach((t, i) => {
                sum += this.options.errorFunction.error(output[i], t);
            })
            return sum;
        }
    }
}