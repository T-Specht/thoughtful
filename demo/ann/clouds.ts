import * as tf from '../..';


const data = tf.Generators.clouds(3);

let ann = new tf.FeedForwardNeuralNetwork({
    activationFunction: tf.Activations.SIGMOID,
    errorFunction: tf.Errors.CROSS_ENTROPY,
    layers: [data[0].points[0].length, 5, data.length],
    learningRate: 1,
    momentum: 0
});

tf.Utilities.repeat(() => {
    for (let cloud = 0; cloud < data.length; cloud++) {
        let classVector = new Array(data.length).fill(0);
        classVector[cloud] = 1;
        for (let point of data[cloud].points) {
            let e = ann.fit(point, classVector).getCurrentError(classVector);
            console.log('Current Error: ', e);
            
        }
    }
}, 1e3);

for (let cloud = 0; cloud < data.length; cloud++) {

    console.log(`----- Class No. ${cloud + 1} ----- \n`);
    
    let classVector = new Array(data.length).fill(0);
    classVector[cloud] = 1;

    tf.Utilities.repeat(() => {
        let point = tf.Utilities.pickRandomFromArray(data[cloud].points);
        console.log(`Point: [${point.map(v => tf.Maths.round(v, 2)).join(', ')}]`);
        console.log(`Output: [${ann.predict(point).map(v => tf.Maths.round(v, 4)).join(', ')}], expected: [${classVector.join(', ')}]\n`);
    }, 2);
}