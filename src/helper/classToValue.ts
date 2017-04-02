export class ClassToValue{

    private dictionary: string[] = [];

    toValue(className: string){

        if(this.dictionary.includes(className)){
            return this.dictionary.indexOf(className)
        }else{
            this.dictionary.push(className);
            return this.dictionary.length - 1;
        }
    }

    toClass(value: number){
        return this.dictionary[value];
    }
}