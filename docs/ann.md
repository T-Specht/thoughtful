# Feed Forward Neural Network

A [Feed Forward Neural Network](https://en.wikipedia.org/wiki/Artificial_neural_network), in the following simply referred to as _ANN_, is the most basic form of an Artificial Neural Network, which propagates values through layers of neurons and is being trained by propagating an error value back through the network using a method called back-propagation.

![Representation of an ANN](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Colored_neural_network.svg/296px-Colored_neural_network.svg.png)

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
- Error Function: Which function should be used to calculate the network's error. You can define your own error function (refer to the interface `tf.Activations.ErrorFunction`) or use one of the following predefined ones:
    - MSE as `tf.Errors.SQUARE`
    - Cross Entropy as `tf.Errors.CROSS_ENTROPY`

Most of the times, you have to experiment a lot to find the right parameters for the network.

Now, we can create a new Network like:

```javascript
let ann = new tf.FeedForward.Network({
    layers: [2, 3, 1],
    learningRate: 0.1,
    momentum: 0,
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.SQUARE,
});
```