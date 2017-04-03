import * as tf from '../..';
import * as fs from 'fs';
import * as path from 'path';
const dataPath = path.resolve(__dirname, '..', 'data');

/*const data = fs.readFileSync(path.resolve(dataPath, 'linear_regression_data.csv'), 'utf8').trim().split('\r\n').map(r => r.split(',').map(d => parseFloat(d)));*/

const data = (() => {
    let ret: number[][] = [];
    for(let x = -10; x < 10; x+=0.5){
        ret.push([x, Math.pow(Math.random() + x, 2)]);
    }
    return ret;
})();

let ann = new tf.FeedForward.Network({
    activationFunction: tf.Activations.RELU,
    errorFunction: tf.Errors.SQUARE,
    layers: [1, 4, 1],
    learningRate: 1e-3,
    momentum: 0,
});


tf.Utilities.repeat(() => {
    for (let d of data) {
        let input = [d[0]],
            target = [d[1]];
        ann.fit(input, target);
        //console.log(ann.error(input, target));
    }
}, 1e4);

let resData = '';
for(let x = -20; x < 20; x+=1){
    resData += `${x},${ann.predict([x])[0]}\n`
}

fs.writeFileSync(path.resolve(__dirname, 'regression.json'), resData);









