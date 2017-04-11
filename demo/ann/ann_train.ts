import * as tf from '../..';
import * as fs from 'fs';

let ann = new tf.FeedForwardNeuralNetwork({
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.SQUARE,
    layers: [2, 3, 1],
    learningRate: 0.3,
    momentum: 0
});

let data = [
    {
        input: [0, 0],
        output: [0]
    },
    {
        input: [1, 0],
        output: [1]
    },
    {
        input: [0, 1],
        output: [1]
    },
    {
        input: [1, 1],
        output: [0]
    },
]

tf.Utilities.repeat(() => {
    for (let d of data) {
        ann.fit(d.input, d.output);
    }
}, 1e6);

let weights = ann.exportWeights();
fs.writeFileSync('./network.json', JSON.stringify(weights));



