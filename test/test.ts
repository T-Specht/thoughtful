import * as tf from '..';

let ann = new tf.FeedForward.Network({
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.SQUARE,
    layers: [2, 3, 1],
    learningRate: 0.3
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


/*for(let i = 0; i < 1000; i++){
    for(let node of data) ann.train(node.input, node.output);
}
*/
/*console.log(ann.feedForwardPass([1, 0]).error([1]));
console.log(ann.layers.map(l => l.neurons.map(n => n.output)));*/

console.log(ann.feedForwardPass([1, 0]).getOutput());
tf.repeat(() => ann.train([1, 0], [1]), 100);

console.log(ann.feedForwardPass([1, 0]).getOutput());
/*for(let node of data) console.log(`Output for [${node.input.join(',')}] is [${ann.feedForwardPass(node.input).getOutput().join(',')}]`);*/

