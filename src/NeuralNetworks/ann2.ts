import { Maths, ActivationFunction, ErrorFunction } from "..";
import * as n from 'numeric';

export class ANN {

    /*  Declare Tensors */

    // Array of Matrices (#layers - 1)
    private weights: Maths.Matrix[] = [];
    // Array of Column Vectors (#layers - 1)
    private biases: Maths.Vector[] = [];
    // Array of Column Vectors (#layers)
    private inputs: Maths.Vector[] = [];
    // Array of Column Vectors (#layers)
    private outputs: Maths.Vector[] = [];
    // Array of Column Vectors (#layers-1)
    private deltas: Maths.Vector[] = [];

    private gradients: Maths.Vector[] = [];

    constructor(private options: {
        size: number[],
        activation: ActivationFunction,
        error: ErrorFunction,
        learningRate: number,
        momentum?: number
    }) {
        options.momentum = options.momentum | 0;
        const SIZE = this.options.size;
        // Generate Weights
        for (let i = 0; i < SIZE.length - 1; i++) {
            this.weights.push(n.random([SIZE[i], SIZE[i + 1]]));
            this.biases.push(n.random([SIZE[i + 1], 1]));
        }

    }

    private apply(tensor: Maths.Tensor, func: (number) => number) {
        let rows = tensor.length;
        let cols = tensor[0].length;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                tensor[i][j] = func(tensor[i][j]);
            }
        }
        return tensor;
    }

    public cost(output: Maths.Vector, target: Maths.Vector): number {
        return n.mul(0.5, n.sum(n.pow(n.sub(target, output), 2)));
    }

    public backward(target: Maths.Vector) {
        // Reset deltas
        this.deltas = [];

        // Output Layer Delta with MSE function
        let lastLayerActivity = this.outputs[this.outputs.length - 1];
        let lastLayerInput = this.inputs[this.inputs.length - 1];
        let errorDerivative = n.sub(lastLayerActivity, target);
        let outputLayerDelta = n.mul(errorDerivative, this.apply(lastLayerInput, this.options.activation.der));

        this.deltas.unshift(outputLayerDelta);
        

        for (let i = this.outputs.length - 2; i > 0; i--) {            
            let layerActivity = this.outputs[i];
            let layerInput = this.outputs[i];
            let nextLayerDelta = this.deltas[0];
            let activationDerivative = this.apply(layerInput, this.options.activation.der);
            let weights = this.weights[i];

            let delta = n.mul(n.dot(weights, nextLayerDelta), activationDerivative);

            this.deltas.unshift(delta);
        }

        return this.deltas;
    }

    public calculateGradients(deltas: Maths.Vector[] = this.deltas){
        // Reset gradients
        this.gradients = [];

        for(let i = this.outputs.length - 1; i > 0; i--){
            let prevLayerActivity = this.outputs[i-1];
            let deltaTranspose = n.transpose(this.deltas[i-1]);
            let gradient = n.dot(prevLayerActivity, deltaTranspose);
            this.gradients.unshift(gradient);
        }
        return this.gradients;
    }

    public updateWeightsAndBiases(gradients: Maths.Vector[] = this.gradients, deltas: Maths.Vector[] = this.deltas){
        const ALPHA = this.options.learningRate;
                
        for(let i = 0; i < this.weights.length; i++){
            this.weights[i] = n.sub(this.weights[i], n.mul(ALPHA, gradients[i]));
            this.biases[i] = n.sub(this.biases[i], n.mul(ALPHA, deltas[i]));
        }

    }

    forward(input: Maths.Vector) {
        this.inputs = [];
        this.outputs = [];

        let prevLayerActivity = input;

        // Save for backward pass
        this.inputs.push(prevLayerActivity);
        this.outputs.push(prevLayerActivity);

        for (let i = 0; i < this.weights.length; i++) {

            let weightsTranspose = n.transpose(this.weights[i]);
            let biases = this.biases[i];
            let z = n.add(n.dot(weightsTranspose, prevLayerActivity), biases);
            let a = this.apply(z, this.options.activation.output);
            prevLayerActivity = a;

            // Save backward pass
            this.inputs.push(z);
            this.outputs.push(a);
        }
        return prevLayerActivity;
    }

}