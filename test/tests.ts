import * as tf from '..';
import * as fs from 'fs';


let ann = new tf.FeedForward.Network({
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.CROSS_ENTROPY,
    layers: [2, 3, 1],
    learningRate: 0.1,
    momentum: 0
});

//console.log(ann);

let X = new tf.Matrix([
    [0, 1],
    [0, 0],
    [1, 0],
    [1, 1],
]);

let Y = new tf.Matrix([
    [1],
    [0],
    [1],
    [0],
]);


/*console.log('y Hat:');
ann.forwardPass(X);*/
/*tf.Utilities.repeat(() => {
    //console.log('Error:', tf.Maths.sum(ann.error(X, Y)));
    ann.forwardPass(X).show();
    ann.backwardPass(Y);
    ann.updateWeights();

}, 20);*/