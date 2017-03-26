export interface ActivationFunction {
    output: (input: number) => number;
    der: (input: number) => number;
}
export declare class Activations {
    static TANH: ActivationFunction;
    static SIGMOID: ActivationFunction;
    static RELU: ActivationFunction;
    static LINEAR: ActivationFunction;
}
