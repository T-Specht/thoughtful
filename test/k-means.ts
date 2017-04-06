import * as tf from '..';
let clouds = 2;
let data = tf.Generators.clouds(clouds);

console.log('Expected cluster centers:\n\n', data.map(cloud => cloud.center).map(c => c.join(', ')).join('\n'));
console.log('\n\n');

let raw: number[][] = [];
data.forEach(cloud => cloud.points.forEach(point => raw.push(point)));
let km = new tf.KMeans(raw, clouds);
let clusters = km.fitClusters();
console.log('Output Clusters:\n\n', clusters.map(c => c.join(', ')).join('\n'));


