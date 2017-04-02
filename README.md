# thoughtful.js
A zero dependency Machine Learning library for JavaScript.

# Usage

```javascript
import * as tf from 'thoughtful';
```

Please refer to the included d.ts definition files for the usage of specific features or algorithms for now.
The use of Visual Studio Code is recommended.

# Features and Algorithms

- Feed forward Artificial Neural Network (ANN) as `tf.FeedForward.Network`
    - Variable Activations in network options as `tf.Activations.[NAME]`
        - Sigmoid as `tf.Activations.SIGMOID`
        - Tanh as `tf.Activations.TANH`
        - RELU as `tf.Activations.RELU`
        - Linear as `tf.Activations.LINEAR`
    - Variable Error functions in network options as `tf.Errors.[NAME]`
        - MSE as `tf.Errors.SQUARE`
        - Cross Entropy as `tf.Errors.CROSS_ENTROPY`
- K-Nearest-Neighbor (KNN) as `tf.KNNClassifier`
- Matrix class as `tf.Matrix`
- Helper Methods
    - Class name to value mapper as `tf.ClassToValue`
    - Repeat function as `tf.repeat`
    - CSV-string to JSON/Array parser as `tf.csvStringToJSON`
    - Normalization as `tf.Normalization.MinMaxNormalizer`