import * as tf from '..';

let ann = new tf.ANN({
    activation: tf.Activations.RELU,
    error: tf.Errors.SQUARE,
    learningRate: 0.1,
    size: [2, 3, 1],
});

console.log(ann.query([0, 1]));
console.log(ann.cost([1]));

ann.backPropagate([1]);
ann.updateWeights();

console.log(ann.query([0, 1]));
console.log(ann.cost([1]));