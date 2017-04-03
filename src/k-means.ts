import { Utilities, Maths, NumericDistanceFunction } from '.';

export class KMeans {
    private clusters: number[][] = [];
    constructor(private data: number[][], private numberOfClusters) {
        Utilities.repeat(() => {
            this.clusters.push(Utilities.pickRandomFromArray(data));
        }, numberOfClusters);
    }

    public fitClusters(distanceFunction: NumericDistanceFunction) {
        let clusterChanged: boolean;
        do {
            clusterChanged = false;
            let clusterRecord = [];
            for (let point of this.data) {
                let distances = this.clusters.map(c => distanceFunction(point, c));
                let min = Math.min(...distances);
                let clusterIndex = distances.indexOf[min];
                clusterRecord.push(clusterIndex);
            }
            this.clusters.forEach((c, ci) => {
                let numberOfPoints = 0;
                let meanPoint = clusterRecord.map((cr, i) => cr == ci ? this.data[i] : null).filter(c => c != null).reduce((s, p) => {
                    numberOfPoints++;
                    if (!s) return p;
                    else {
                        return s.map((v, i) => v + p[i])
                    }
                }, undefined).map(c => c / numberOfPoints);
                if (meanPoint.every((v, i) => v != c[i])) {
                    this.clusters[ci] = meanPoint;
                    clusterChanged = true;
                }
            });
        } while (clusterChanged);
        return this.clusters;
    }


}