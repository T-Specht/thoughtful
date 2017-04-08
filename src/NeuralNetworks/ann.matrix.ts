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
        private deltas: Matrix[] = [];
        public layers: Matrix[] = [];
        private inputs: Matrix[] = [];

        constructor(private options: ANNOptions){
            // Create weight matrices
            for(let j = 0; j < this.options.layers.length - 1; j++){
                // + 1 for bias neuron
                let neuronsInLayerI = this.options.layers[j] + 1;
                let neuronsInLayerK = this.options.layers[j+1];
                this.weights.push(Matrix.rand(neuronsInLayerI, neuronsInLayerK));
            }
        }

        public forwardPass(inputs: Matrix | number[]){
            // clear inputs and layer
            this.layers = [];
            this.inputs = [];
            // I for input Matrix
            let I = inputs instanceof Matrix ? inputs : Matrix.rowVector(...inputs);   
            // T for temporary calculation Matrix         
            let T = I;
            for(let j = 0; j < this.options.layers.length - 1; j++){
                // Add bias input
                T = Matrix.join(T, Matrix.ones(T.getNumberOfRows(), 1), 'right');
                // Save copy of neuron outputs for back propagation
                this.layers.push(T.copy());
                // Calculate neuron input in layer J
                T = T.dot(this.weights[j]);
                // Save inputs
                this.inputs.push(T.copy());
                // Calculate output using activation function
                T.map(v => this.options.activationFunction.output(v));
            }

            // Save output layer to layers
            this.layers.push(T);

            
            return T;
        }

        public backwardPass(targets: Matrix | number[]){
            // T for targets
            let T = targets instanceof Matrix ? targets : new Matrix([targets]);
            // Output Layer Error Function derivative            
            let dE = this.layers[this.layers.length - 1].copy().map((val, row, column) => {    
                return this.options.errorFunction.der(val, T.get(row, column))
            });            
            // Calc derivative of activation fro Output Layer Delta
            let outputLayerDelta = this.inputs[this.inputs.length - 1].map(val => this.options.activationFunction.der(val));
            
            this.deltas[this.layers.length - 1] = outputLayerDelta;

            // Hidden Layer Deltas
            for(let layer = this.layers.length - 2; layer > 0; layer--){
                let L = this.layers[layer];                
                let W = this.weights[layer].copy();
                let PrevDeltas = this.deltas[layer + 1].copy();
                let Delta = PrevDeltas.dot(W.transpose().slice(0, -1, 0, -2));
                this.deltas[layer] = Delta
            }
            
            // Test size
            //console.log(this.deltas.map(d => d.size()));
        }

        public updateWeights(){
            // Calculate Derivatives

            let Derivatives: Matrix[] = [];

            for(let layer = this.layers.length - 1; layer > 0; layer--){
                let Delta = this.deltas[layer].copy();
                let PrevLayerActivity = this.layers[layer - 1].copy();
                let Derivate = PrevLayerActivity.transpose().dot(Delta);
                Derivatives.unshift(Derivate);
                
            }


            this.weights.forEach((W, i) => W.subtract(Derivatives[i].scale(this.options.learningRate)));
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