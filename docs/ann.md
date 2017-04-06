# Feed Forward Neural Network

A [Feed Forward Neural Network](https://en.wikipedia.org/wiki/Artificial_neural_network), in the following simply referred to as _ANN_, is the most basic form of an Artificial Neural Network, which propagates values through layers of neurons and is being trained by propagating an error value back through the network using a method called back-propagation.

---

<!--![Representation of an ANN](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Colored_neural_network.svg/296px-Colored_neural_network.svg.png)-->

You can access the ANN using `tf.FeedForward.Network`. To create a new ANN, you have to specify these specific options:
- Network size: Specify the network's size as a JavaScript Array where each element in the array represents a layer and the value the number of neurons. (`[2, 3, 1]` would create a 3-Layer-Network with 2 neurons in first layer, 3 in the second and so on...)
- Learning rate: How fast should the network learn? Most likely a small value less than `1`
- Momentum: Most likely small value less than `1`
- Activation Function: Which function should be used to squash the neuron's output values? Predefined activation functions are accessible under the namespace `tf.Activations` but you can also implement your own (refer to the interface `tf.Activations.ActivationFunction`).
Predefined are:
    - Sigmoid as `tf.Activations.SIGMOID`
    - Tanh as `tf.Activations.TANH`
    - RELU as `tf.Activations.RELU`
    - Linear as `tf.Activations.LINEAR`
- Error Function: Which function should be used to calculate the network's error? You can define your own error function (refer to the interface `tf.Activations.ErrorFunction`) or use one of the following predefined ones:
    - MSE as `tf.Errors.SQUARE`
    - Cross Entropy as `tf.Errors.CROSS_ENTROPY`

Most of the times, you have to experiment a lot to find the right parameters for the network.

Now, we can create a new instance of an ANN with the following code snippet:

```javascript
let ann = new tf.FeedForward.Network({
    layers: [2, 3, 1],
    learningRate: 1,
    momentum: 0,
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.CROSS_ENTROPY,
});
```

Train it with the method `ann.fit(input: number[], targetValues: number[])` and calculate the error with `ann.error(input: number[], targetValues: number[])`.

```javascript
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

// Simple training with fixed training iterations which may not work at every execution but is enough for simple testing purposes.
for(let i = 0; i < 1000; i++){
    for(let example of data){
        ann.fit(example.input, example.output);
        // Log current error
        console.log(ann.error(example.input, example.output));
    }
}
```

To predict outputs for new inputs, use the method `ann.predict(input: number[])`

```javascript
// Get network's prediction for training XOR data
for(let example of data){
    let prediction = ann.predict(example.input);
    console.log(`Input: ${example.input}, network output: ${prediction}, expected: ${example.output}`)
}
```

> Please note that we were using ES6 standards in the examples given above. To use the code provided you need to bundle and transpile it.