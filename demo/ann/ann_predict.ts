import * as tf from '../..';
import * as fs from 'fs';

const weights = JSON.parse(fs.readFileSync('./network.json', 'utf8'));

let ann = tf.FeedForwardNeuralNetwork.restore(weights, {
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.SQUARE,
    layers: [2, 3, 1],
    learningRate: 0.3,
    momentum: 0,
});
console.log(ann.predict([0, 1]));


