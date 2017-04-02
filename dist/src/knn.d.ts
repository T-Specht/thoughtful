import { ClassToValue } from '.';
export declare class KNNClassifier {
    private k;
    private data;
    constructor(k?: number);
    addData(classes: number[], data: number[][]): this;
    predict(input: number[], c2v?: ClassToValue): string | number;
    private argMax(args);
    private distance(a, b);
}
