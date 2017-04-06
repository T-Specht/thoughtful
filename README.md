# <img src="docs/images/logo-outline.svg" width="25"> thoughtful.js
A zero dependency Machine Learning library for JavaScript.

# Usage

```javascript
import * as tf from 'thoughtful';
```

Please refer to the included d.ts definition files for the usage of specific features or algorithms for now.
The use of Visual Studio Code is recommended.

# Features and Algorithms

- [Feed forward Artificial Neural Network](docs/ann.md) (ANN) as `tf.FeedForward.Network`
    - Variable Activations in network options as `tf.Activations.[NAME]`
        - Sigmoid as `tf.Activations.SIGMOID`
        - Tanh as `tf.Activations.TANH`
        - RELU as `tf.Activations.RELU`
        - Linear as `tf.Activations.LINEAR`
    - Variable Error functions in network options as `tf.Errors.[NAME]`
        - MSE as `tf.Errors.SQUARE`
        - Cross Entropy as `tf.Errors.CROSS_ENTROPY`
- K-Nearest-Neighbor (KNN) as `tf.KNNClassifier`
- K-Means as `tf.KMeans`
- Matrix class as `tf.Matrix`
- Helper and Utilities
    - Class name to value mapper as `tf.ClassToValue`
    - Utility functions as `tf.Utilities.[Name]`
        - Repeat function as `tf.Utilities.repeat`
        - CSV-string to JSON/Array parser as `tf.Utilities.csvStringToJSON`
        - Normalization as `tf.Normalization.MinMaxNormalizer`
        - Pick random value from array with `tf.Utilities.pickRandomFromArray`
    - Various distance calculations as `tf.Distances.[NAME]`
        - Euclidean Distance as `tf.Distances.EUCLIDEAN`
        - Taxi/Manhattan Distance as `tf.Distances.TAXI`
        - Levenshtein Distance as `tf.Distances.LEVENSHTEIN`
    - Various extending math functions as `tf.Maths.[NAME]`
        - Random integer in range as `tf.Maths.randomInt`
        - Random arbitrary in range as `tf.Maths.random`
        - argmax as `tf.Maths.argmax`
