import { Utilities, Maths, NumericDistanceFunction, Distances } from '.';

export class KMeans {
    private clusters: number[][] = [];
    constructor(private data: number[][], private numberOfClusters) {
        Utilities.repeat(() => {
            this.clusters.push(Utilities.pickRandomFromArray(data));
        }, numberOfClusters);

    }

    public fitClusters(distanceFunction: NumericDistanceFunction = Distances.EUCLIDEAN) {

        /*console.log('Data');
        console.log(this.data[0]);*/
        
        let clusterChanged: boolean;
        do {
            clusterChanged = false;
            let clusterRecord = [];
            for (let point of this.data) {
                let distances = this.clusters.map(c => distanceFunction(point, c));
                //console.log(distances);
                
                let min = Math.min(...distances);                
                let clusterIndex = distances.indexOf(min);
                
                
                clusterRecord.push(clusterIndex);
            }
            //console.log(clusterRecord);
            
            this.clusters.forEach((c, ci) => {

                let pointsForCluster = clusterRecord.map((cr, i) => cr == ci ? this.data[i] : null).filter(c => c != null);
                let numberOfPoints = pointsForCluster.length;
                let meanPoint = pointsForCluster.reduce((s, p) => {
                    if (p != undefined) {
                        return s.map((v, i) => v + p[i])
                    }
                }, new Array(this.data[0].length).fill(0)).map(c => c / numberOfPoints);

                if (meanPoint.every((v, i) => v != c[i])) {
                    this.clusters[ci] = meanPoint;
                    clusterChanged = true;
                }
            });
        } while (clusterChanged);
        return this.clusters;
    }


}