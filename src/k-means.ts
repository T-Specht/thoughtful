import { Utilities } from '.';

export class KMeans{
    private clusters: number[][] = [];
    constructor(private data: number[][], private numberOfClusters){
        Utilities.repeat(() => {
            this.clusters.push(Utilities.pickRandomFromArray(data));
        }, numberOfClusters);
    }


}