import * as tf from '..';

let ann = new tf.ANN({
    activation: tf.Activations.SIGMOID,
    error: tf.Errors.SQUARE,
    learningRate: 1,
    size: [2, 3, 1],
});


let input = [[0], [1]];
let target = [[1]];



tf.Utilities.repeat(() => {
    let output = ann.forward(input);
    let cost = ann.cost(output, target);
    let deltas = ann.backward(target);
    let gradients = ann.calculateGradients();
    ann.updateWeightsAndBiases();
    console.log(cost);
    
}, 100);

console.log(ann.forward(input));


