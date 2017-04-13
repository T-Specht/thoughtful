import * as tf from "..";
import * as fs from "fs";
import { resolve } from "path";

let l2v = new tf.LabelToValue();
l2v.toValue('negative');
l2v.toValue('positive');

const RAW = fs.readFileSync(resolve(__dirname, 'data', 'sentiment.txt'), 'utf8');
const DATA = RAW.trim().split('\n').map(e => {
    let parts = e.split('\t');
    return {
        label: l2v.toLabel(parseInt(parts[0])),
        sentence: parts[1]
    }
});

// Train classifier

let nbc = new tf.NaiveBayesClassifier();

for(let example of DATA){
    nbc.add(example.sentence, example.label);
}


const TEST = fs.readFileSync(resolve(__dirname, 'data', 'sentiment_test.txt'), 'utf8').trim().split('\n');

tf.Utilities.repeat(() => {
    console.log('--------');
    let test = tf.Utilities.pickRandomFromArray(TEST);
    console.log(test);
    console.log('→', nbc.classify(test));
    
}, 20);
