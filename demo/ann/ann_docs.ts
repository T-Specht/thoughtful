import * as tf from "../..";
let ann = new tf.FeedForwardNeuralNetwork({
    layers: [2, 3, 1],
    learningRate: 1,
    momentum: 0,
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.CROSS_ENTROPY,
});

// Train network on XOR
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
];

// Simple training with fixed training iterations
for(let i = 0; i < 1000; i++){
    for(let example of data){
        ann.fit(example.input, example.output);
        // Log current error
        console.log(ann.error(example.input, example.output));
    }
}

for(let example of data){
    let prediction = ann.predict(example.input);
    console.log(`Input: ${example.input}, network output: ${prediction}, expected: ${example.output}`)
}