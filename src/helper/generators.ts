import { Maths } from '..';

export namespace Generators{
    export function clouds(clouds: number, dataPointsForCloud = 10, dimensions = 2, min = 0, max = 1, spread = 0.1){

        const range = max - min;

        let clusterCenters = new Array(clouds).fill(0).map(c => new Array(dimensions).fill(0).map(c => Maths.random(min, max)));
        
        let data: {
            center: number[],
            points: number[][]
        }[] = [];
        for(let center of clusterCenters){
            let points = [];
            for(let i = 0; i < dataPointsForCloud; i++){
                points.push(center.map(c => c += (Maths.randomBool() ? -1 : 1) * spread * Maths.random(min, max)));
            }
            data.push({center, points})
        }
        return data;
    }
}