import * as tf from '..';

let ann = new tf.FeedForwardNeuralNetwork({
    activationFunction: tf.Activations.RELU,
    errorFunction: tf.Errors.SQUARE,
    learningRate: 0.1,
    layers: [2, 3, 1],
    momentum: 0
});

/*console.log(ann.query([0, 1]));
console.log(ann.cost([1]));*/

tf.Utilities.repeat(() => {
    console.log(ann.fit([0, 1], [1]).getCurrentError([1]));
    console.log(ann.fit([1, 1], [0]).getCurrentError([0]));
    console.log(ann.fit([1, 0], [1]).getCurrentError([1]));
    console.log(ann.fit([0, 0], [0]).getCurrentError([0]));
}, 1e3);

console.log(ann.predict([1, 1]));
console.log(ann.predict([1, 0]));
