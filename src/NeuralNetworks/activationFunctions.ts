export interface ActivationFunction {
    output: (input: number) => number;
    der: (input: number) => number;
}

export class Activations {
    public static TANH: ActivationFunction = {
        output: x => Math.tanh(x),
        der: x => {
            let output = Activations.TANH.output(x);
            return 1 - output * output;
        }
    }
    public static SIGMOID: ActivationFunction = {
        output: x => 1 / (1 + Math.exp(x)),
        der: x => {
            let output = Activations.SIGMOID.output(x);
            return output * (1 - output);
        }
    }
    public static RELU: ActivationFunction = {
        output: x => Math.max(0, x),
        der: x => x <= 0 ? 0 : 1
    }
    public static LINEAR: ActivationFunction = {
        output: x => x,
        der: x => 1
    }
}