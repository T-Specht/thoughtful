//https://www.youtube.com/watch?v=EGKeC2S44Rs

import { Utilities } from ".";
export class NaiveBayesClassifier {

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
    public words: {} = [];
    public docs: {} = {};
    public labels: string[] = [];

    constructor(private tokenizeMethod: (string) => string[] = Utilities.tokenize) {

    }

    public add(text: string, _label: number | string) {
        
        let label: string = (typeof _label == 'string') ? _label : _label.toString();  
        let tokens = this.tokenizeMethod(text);

        // Count doc
        this.docs[label] = this.docs[label] ? this.docs[label]+1 : 1;
        // Save label
        if(!this.labels.includes(label)) this.labels.push(label);


        for(let token of tokens){
            if(!this.words[token]){
                this.words[token] = {};
                this.words[token][label] = 1;
            }else{
                this.words[token][label] = this.words[token][label] ? this.words[token][label] + 1 : 1;
            }
        }
    }

    public classify(text: string){
        let words = this.tokenizeMethod(text);
        let propForLabels = {};
        for(let label of this.labels){
            let prop = 1;
            for(let word of words){
                prop *= this.propWordGivenLabel(word, label);
            }
            propForLabels[label] = prop;
        }        

        // Get biggest prop
        let tentativeBiggest = propForLabels[this.labels[0]];
        let tentativeLabel = this.labels[0];
        for(let label of this.labels){
            if(tentativeBiggest < propForLabels[label]){
                tentativeBiggest = propForLabels[label];
                tentativeLabel = label;
            }
        }
        return tentativeLabel;
    }

    private getUnique() {
        return Object.keys(this.words);
    }

    private propLabel(label: string) {
        return this.docs[label] / this.numberOfDocs;
    }

    private propWordGivenLabel(word: string, label: string){
        let wordOccurrences = this.words[word] ? this.words[word][label] || 0 : 0;
        return (wordOccurrences + 1) / (this.getNumberWordsForLabel(label) + this.numberOfUniqueWords);
    }

    private get numberOfDocs(){
        let sum = 0;
        for(let key in this.docs){
            sum += this.docs[key];
        }
        return sum;
    }

    private get numberOfUniqueWords(){
        return this.getUnique().length;
    }



    private getNumberWordsForLabel(label: string){
        let sum = 0;
        for(let key in this.words){
            sum += this.words[key][label] || 0;
        }
        return sum;
    }
}