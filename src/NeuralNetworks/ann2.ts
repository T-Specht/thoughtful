import { Maths, ActivationFunction, ErrorFunction} from "..";


export class ANN{

    /*  Declare Tensors */

    // Array of Matrices (#layers - 1)
    private weights: number[][][] = [];
    // Array of Column Vectors (#layers - 1)
    private biases: number[][][] = [];
    // Array of Column Vectors (#layers)
    private inputs: number[][][] = [];
    // Array of Column Vectors (#layers)
    private outputs: number[][][] = [];
    // Array of Column Vectors (#layers-1)
    private deltas: number[][][] = [];

    constructor(private options: {
        size: number[],
        activation: ActivationFunction,
        error: ErrorFunction,
        learningRate: number,
        momentum?: number
    }){
        options.momentum = options.momentum | 0;
        const SIZE = this.options.size;
        // Generate Weights
        for(let j = 0; j < SIZE.length - 1; j++){
            this.weights.push(Maths.Tensor2D.generate([SIZE[j+1], SIZE[j]], Math.random));
        }
        // Generate Biases
        for(let j = 1; j < SIZE.length; j++){
            this.biases.push(Maths.Tensor2D.generate([SIZE[j], 1], Math.random));
        }
    }

    public cost(target: number[]){
        let targetVector = target.map(v => [v]); // Column Vector
        
        let outputVector = this.outputs[this.outputs.length - 1]; // Column Vector
        
        let outputLayerSize = this.options.size[this.options.size.length-1];
        let errorSum = 0;
        for(let i = 0; i < outputLayerSize; i++){
            
            let o = outputVector[0][i],
                t = targetVector[0][i];                
            errorSum += this.options.error.error(o, t);            
        }
        return errorSum;
    }

    public backPropagate(target: number[]){
        // Reset old deltas
        this.deltas = [];

        // Calculate output layer delta vector
        let outputVector = this.outputs[this.outputs.length-1];
        
        // Error function derivative
        let errorDerivative = [outputVector[0].map((o, i) => {                       
            return this.options.error.der(o, target[i]);
        })];
        
        // Calculate Delta by multiplying with output layer g'(inputs)
        let delta = Maths.Tensor2D.ElementWise.multiply(errorDerivative, Maths.Tensor2D.apply(this.inputs[this.inputs.length - 1], this.options.activation.der));

        // Save output layer delta vector
        this.deltas.unshift(delta);

        for(let l = this.options.size.length - 2; l > 0; l--){
            let lastLayerDelta = this.deltas[0];           
            let weightsT = Maths.Tensor2D.transpose(this.weights[l]);
            let layerInput = this.inputs[l];
            let dotWeightsT_LastLayerDelta = Maths.Tensor2D.dot(weightsT, lastLayerDelta);
            let delta = Maths.Tensor2D.ElementWise.multiply(dotWeightsT_LastLayerDelta, Maths.Tensor2D.apply(layerInput, this.options.activation.der));
            this.deltas.unshift(delta);
        }               

    }

    public updateWeights(){
        let weightsDerivatives: number[][][] = [];

        for(let l = this.options.size.length - 1; l > 0; l--){
            let outputPrevLayer = this.outputs[l-1];
            let delta = this.outputs[l];

            let weightsDerivative = Maths.Tensor2D.dot(delta, Maths.Tensor2D.transpose(outputPrevLayer));

            let weights = this.weights[l-1];

            this.weights[l-1] = Maths.Tensor2D.ElementWise.subtract(weights, Maths.Tensor2D.ElementWise.scale(weightsDerivative, this.options.learningRate));

            this.biases[l-1] = Maths.Tensor2D.ElementWise.subtract(this.biases[l-1], Maths.Tensor2D.ElementWise.scale(delta, this.options.learningRate));

            weightsDerivatives.unshift(weightsDerivative);
        }
        //console.log(derivatives);
        
    }

    /**
     * 
     * @param input Vector of Input values matching network size
     */
    public query(input: number[]){

        //Clear set tensors
        this.inputs = [];
        this.outputs = [];

        // Convert to tensor, which is a column vector
        let inputVector = input.map(i => [i]);

        // Store inputs in appropriate tensors
        this.inputs.push(inputVector);
        this.outputs.push(inputVector);

        // Forward propagation
        let tmp = inputVector;
        for(let i = 0; i < this.weights.length; i++){
            // Calculate Input Values
            let beforeActivation = Maths.Tensor2D.dot(this.weights[i], tmp);       
            // Add Bias terms
            beforeActivation = Maths.Tensor2D.ElementWise.add(beforeActivation, this.biases[i]);
            // Save beforeActivation vector
            this.inputs.push(beforeActivation);
            // Apply activation function to layer
            let activity = Maths.Tensor2D.apply(beforeActivation, this.options.activation.output);
            // Save layer activity as output
            this.outputs.push(activity);
            // Set this for tmp
            tmp = activity;
        }
        let output = tmp;
        // Return result as array
        return Maths.Tensor2D.transpose(output)[0];
    }    
}