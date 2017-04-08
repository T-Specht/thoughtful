import { ActivationFunction, ErrorFunction, Matrix, Maths} from '..';


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
        private biases: Matrix[] = [];


        private deltas: Matrix[] = [];
        public layers: Matrix[] = [];
        private inputs: Matrix[] = [];

        constructor(private options: ANNOptions){
            // Create weight matrices
            for(let j = 0; j < this.options.layers.length - 1; j++){
                let neuronsInLayerI = this.options.layers[j];
                let neuronsInLayerK = this.options.layers[j+1];
                
                

                this.biases.push(Matrix.rand(1, neuronsInLayerK)/*.map(val => Maths.randomInt(1, 10))*/.show());
                this.weights.push(Matrix.rand(neuronsInLayerI, neuronsInLayerK)/*.map(val => Maths.randomInt(1, 10))*/);
            }
        }

        private get numberOfLayers(){
            return this.options.layers.length
        }

        public forwardPass(inputs: Matrix | number[]){
            // clear inputs and layer
            this.layers = [];
            this.inputs = [];
            // I for input Matrix
            let I = inputs instanceof Matrix ? inputs : Matrix.rowVector(...inputs);   
            // T for temporary calculation Matrix
            let T = I;

            for(let l = 0; l < this.numberOfLayers - 1; l++){
                let X = T;
                // Weight
                let W = this.weights[l].copy();
                // Input for Layer
                let Z = X.dot(W);
                // Bias Matrix
                let B = Matrix.ones(Z.getNumberOfRows(), 1).dot(this.biases[l].copy());
                Z.add(B);
                // Save input
                this.inputs.push(Z);
                // Activity
                let A = Z.map(v => this.options.activationFunction.output(v));
                // Save activity
                this.layers.push(A);
                // Pass on to next layer
                T = A.copy();
            }         
            return T;
        }

        public backwardPass(targets: Matrix | number[]){
            // T for targets
            let T = targets instanceof Matrix ? targets : new Matrix([targets]);
            
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