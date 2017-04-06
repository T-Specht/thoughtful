import * as tf from '..';
import * as fs from 'fs';


let data = tf.Generators.clouds(2);

let str = '';
for(let cloud of data){
    str += cloud.center.join(',') + '\n\n'
    for(let point of cloud.points){
        str += point.join(',') + '\n'
    }
    str += '\n\n'
}

fs.writeFileSync('./data.csv', str);
