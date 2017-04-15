export declare class NaiveBayesClassifier {
    private tokenizeMethod;
    /**
     * words = {
     *  "word1": {
     *     "label1": count
     *     "label2": count
     *  }
     *  "word2": {
     *     "label1": count
     *     "label2": count
     *  }
     * }
     */
    words: {};
    docs: {};
    labels: string[];
    constructor(tokenizeMethod?: (string) => string[]);
    add(text: string, _label: number | string): void;
    classify(text: string): string;
    private getUnique();
    private propLabel(label);
    private propWordGivenLabel(word, label);
    private readonly numberOfDocs;
    private readonly numberOfUniqueWords;
    private getNumberWordsForLabel(label);
}
