import * as tf from '..';
import * as fs from 'fs';


let ann = new tf.FeedForward.Network({
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.CROSS_ENTROPY,
    layers: [2, 3, 1],
    learningRate: 0.6,
    momentum: 0
});

//console.log(ann);

ann.forwardPass(new tf.Matrix([[0, 1]])).show();

ann.error(new tf.Matrix([[1, 0], [0, 0], [1, 1], [0, 1]]), tf.Matrix.columnVector(1, 0, 1, 0)).show();
//ann.forwardPass(new tf.Matrix([[1, 0]])).show();
/*for(let layer of ann.layerInputs) layer.show();*/