import * as tf from '..';
import * as n from 'numeric';

type Tensor = number[][];

function apply(matrix: Tensor, func: (number) => number) {
    return matrix.map(r => r.map(v => func(v)));
}

const SIZE = [2, 4, 1];
const ALPHA = 0.1;
const EPOCHS = 3e4;
const ACTIVATION = tf.Activations.SIGMOID

let W1 = tf.Maths.Tensor2D.generate([SIZE[0], SIZE[1]], Math.random);
let W2 = tf.Maths.Tensor2D.generate([SIZE[1], SIZE[2]], Math.random);

let B1 = tf.Maths.Tensor2D.generate([SIZE[1], 1], Math.random);
let B2 = tf.Maths.Tensor2D.generate([SIZE[2], 1], Math.random);

let A0: Tensor, A1: Tensor, A2: Tensor, Z1: Tensor, Z2: Tensor;

let costGraph = [];

function forward(I: Tensor) {
    A0 = I;
    Z1 = n.dot(n.transpose(W1), A0);
    Z1 = n.add(Z1, B1);
    A1 = apply(Z1, ACTIVATION.output);

    Z2 = n.dot(n.transpose(W2), A1);
    Z2 = n.add(Z2, B2);
    A2 = apply(Z2, ACTIVATION.output);

    return A2;
}

function train(T: Tensor) {
    let D2 = n.mul(n.sub(A2, T), apply(Z2, ACTIVATION.der));
    let D1 = n.mul(n.dot(W2, D2), apply(Z1, ACTIVATION.der));

    let DeltaW1 = n.mul(n.dot(A0, n.transpose(D1)), ALPHA);
    let DeltaW2 = n.mul(n.dot(A1, n.transpose(D2)), ALPHA);

    let DeltaB1 = D1;
    let DeltaB2 = D2;

    W1 = n.sub(W1, DeltaW1)
    W2 = n.sub(W2, DeltaW2)
    B1 = n.sub(B1, DeltaB1)
    B2 = n.sub(B2, DeltaB2)
}

function cost(T: Tensor) {
    return 0.5 * n.sum(n.pow(n.sub(T, A2), 2));
}


let data = [
    {
        input: [[0], [0]],
        target: [[0]]
    },
    {
        input: [[1], [0]],
        target: [[1]]
    },
    {
        input: [[0], [1]],
        target: [[1]]
    },
    {
        input: [[1], [1]],
        target: [[0]]
    },
]

console.time('training');
tf.Utilities.repeat((i) => {
    let example = data[i % data.length];
    //let example = data[0];
    forward(example.input);
    train(example.target);
    let J = cost(example.target);
    costGraph.push(J);
    if (i % (EPOCHS / 10) == 0) console.log(`[COST]\t${tf.Maths.round(J, 4)}\t i = ${i}`);
}, EPOCHS);
console.timeEnd('training');

console.log('\nTesting...\n');

tf.Utilities.repeat((i) => {
    let example = data[i];
    let X = tf.Maths.Tensor2D.getAsString(example.input);
    let O = tf.Maths.Tensor2D.getAsString(forward(example.input));
    

    let log = X.split('\n').filter(s => s.trim() != '').map((s, i) => {
        return i == 0 ? s + '\t' + O.trim() : s;
    }).join('\n') + '\n';

    console.log(log);
}, data.length);

var plot = require('plotter').plot;

plot({
	data:		costGraph,
	filename:	'demo/graph.pdf',
	format:		'pdf'
});
