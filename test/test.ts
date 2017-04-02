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

tf.repeat(() => {
    for (let d of data) {
        ann.fit(d.input, d.output);
    }
}, 1e4);

for (let d of data) {
    console.log(`Input: [${d.input.join(', ')}]    Output: [${ann.predict(d.input).join(', ')}]`);
    
}


