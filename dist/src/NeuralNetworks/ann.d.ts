import { ActivationFunction, ErrorFunction } from '..';
export declare module FeedForward {
    interface ANNOptions {
        learningRate: number;
        layers: number[];
        activationFunction: ActivationFunction;
        errorFunction: ErrorFunction;
    }
    class Network {
        private options;
        private layers;
        constructor(options: ANNOptions);
        /**
         * @returns the input layer
         */
        private readonly inputLayer;
        /**
         * @returns the output layer
         */
        private readonly outputLayer;
        /**
         * Forward Pass of the network where values are propagated through the network
         * @param inputs input values matching the specified size of the network's input layer
         */
        private propagateForward(inputs);
        /**
         * @returns the current output of the network
         */
        private getCurrentOutput();
        /**
         * Calculate all the neurons delta values
         * @param targetValues target values for the network with respect to last forward pass
         */
        private calculateDeltas(targetValues);
        /**
         * Update the connection weights using previous calculated delta values
         */
        private updateWeights();
        /**
         * Fits given inputs to given target values by training the network
         * @param inputs inputs to the network
         * @param targetValues expected outputs for given input
         */
        fit(inputs: number[], targetValues: number[]): this;
        /**
         * Predict output values for given inputs
         * @param inputs input values
         */
        predict(inputs: number[]): number[];
        /**
         * Calculate the error for current outputs
         * @param targetValues target values
         */
        private getCurrentError(targetValues);
        /**
         * Calculates the error for given inputs
         * @param inputs inputs to network
         * @param targetValues expected output for given inputs
         */
        error(inputs: number[], targetValues: number[]): number;
    }
}
