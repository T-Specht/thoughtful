import * as tf from '..';
import * as fs from 'fs';
import { resolve } from 'path';

const c2v = new tf.ClassToValue();


const data = tf.csvStringToJSON(fs.readFileSync(resolve(__dirname, 'data', 'real_estate.csv'), 'utf8'), false, ';').slice(1).map(r => {
    r[0] = c2v.toValue(r[0]);
    return r;
}) as number[][];

const nl = new tf.Normalization.MinMaxNormalizer(data.map(e => e.slice(1)));

let knn = new tf.KNNClassifier(3);
knn.addData(data.map(e => e[0]), nl.normalizeExampleData());
console.log(knn.predict(nl.normalizeNewDataRow([1e4, 100, 5]), c2v));
