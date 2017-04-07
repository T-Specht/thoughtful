import { ActivationFunction, ErrorFunction, Matrix} from '..';


export module FeedForward {

    export interface ANNOptions {
        learningRate: number,
        layers: number[],
        activationFunction: ActivationFunction,
        errorFunction: ErrorFunction,
        momentum: number
    }

    export class Network{
        private weights: Matrix[] = [];
        public layerInputs: Matrix[] = [];

        constructor(private options: ANNOptions){
            // Create weight matrices
            for(let j = 0; j < this.options.layers.length; j++){
                // + 1 for bias neuron
                let neuronsInLayerI = this.options.layers[j] + 1;
                let neuronsInLayerK = this.options.layers[j+1];
                this.weights.push(Matrix.rand(neuronsInLayerI, neuronsInLayerK));
            }
        }

        public forwardPass(inputs: Matrix | number[]){
            // clear layerInputs
            this.layerInputs = [];
            // I for input Matrix
            let I = inputs instanceof Matrix ? inputs : Matrix.rowVector(...inputs);   
            // T for temporary calculation Matrix         
            let T = I;
            for(let j = 0; j < this.options.layers.length; j++){
                // Add bias input
                T = Matrix.join(T, Matrix.ones(T.getNumberOfRows(), 1), 'right');
                // Save copy of inputs for back propagation
                this.layerInputs.push(T.copy());
                // Calculate neuron input in layer J
                T = T.dot(this.weights[j]);
                // Calculate output using activation function
                T.map(v => this.options.activationFunction.output(v));

            }
            
            return T;
        }

        public error(inputs: Matrix | number[], targets: Matrix | number[]){
            let O = this.forwardPass(inputs);
            let T = targets instanceof Matrix ? targets : Matrix.rowVector(...targets);
            let E = new Matrix(O.getNumberOfRows(), 1);
            for(let r = 0; r < O.getNumberOfRows(); r++){
                let output = O.getRowAsRowVector(r).getArray()[0];
                let target = T.getRowAsRowVector(r).getArray()[0];
                let error = output.reduce((s, o, i) => {
                    return s + this.options.errorFunction.error(o, target[i]);
                }, 0);
                E.set(r, 0, error);
            }
            return E;
        }

    }
}