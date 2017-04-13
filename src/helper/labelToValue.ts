export class LabelToValue {

    private dictionary: string[] = [];

    toValue(label: string) {

        if (this.dictionary.includes(label)) {
            return this.dictionary.indexOf(label)
        } else {
            this.dictionary.push(label);
            return this.dictionary.length - 1;
        }
    }

    toLabel(value: number) {
        return this.dictionary[value];
    }
}
