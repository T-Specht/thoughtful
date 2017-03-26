import * as tf from '..';

let ann = new tf.ANN({
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.SQUARE,
    layers: [2, 3, 1],
    learningRate: 0.3
});



console.log(ann.feedForwardPass([1, 1]));

console.log(ann.layers.map(l => l.neurons.map(n => n.output)));
