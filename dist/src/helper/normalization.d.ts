export declare namespace Normalization {
    class MinMaxNormalizer {
        private data;
        private minValues;
        private maxValues;
        constructor(data: number[][]);
        normalizeExampleData(): number[][];
        normalizeNewDataRow(row: number[]): number[];
    }
}
