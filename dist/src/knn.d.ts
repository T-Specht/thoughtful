import { LabelToValue, NumericDistanceFunction } from '.';
export declare class KNNClassifier {
    private k;
    private distanceFunction;
    private data;
    constructor(k?: number, distanceFunction?: NumericDistanceFunction);
    addData(classes: number[], data: number[][]): this;
    predict(input: number[], l2v?: LabelToValue): string | number;
}
