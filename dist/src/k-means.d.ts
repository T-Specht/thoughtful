import { NumericDistanceFunction } from '.';
export declare class KMeans {
    private data;
    private numberOfClusters;
    private clusters;
    constructor(data: number[][], numberOfClusters: any);
    fitClusters(distanceFunction?: NumericDistanceFunction): number[][];
}
