import { ClassToValue } from '.';

export class KNNClassifier{

    private data: {
        c: number,
        attr: number[]
    }[] = [];

    constructor(private k = 3){
        return this;
    }

    public addData(classes: number[], data: number[][]){
        classes.forEach((c, i) => {
            this.data.push({
                c: c,
                attr: data[i]
            });
        });
        return this;        
    }

    public predict(input: number[], c2v?: ClassToValue){
        let distances: {
            index: number,
            distance: number
        }[] = [];

        // Calculate distances
        this.data.forEach((entry, i) => {
            return distances.push({
                index: i,
                distance: this.distance(input, entry.attr)
            });
        });

        // Sort distances
        distances = distances.sort((a, b) => {
            if(a.distance > b.distance) return 1;
            if(a.distance < b.distance) return -1;
            return 0;
        });

        // get k smallest distances
        let kNearest = distances.slice(0, this.k);
        
        // get classes to those k distances from data array
        let kNearestClasses = kNearest.map(e => this.data[e.index].c);

        // get the most often occurring class
        let c =  this.argMax(kNearestClasses);

        // return value or class if c2v is passed

        return c2v ? c2v.toClass(c) : c;

    }

    private argMax(args: number[]){
        let record = {};
        args.forEach(a => record[a] = record[a] + 1 || 1);
        
        let max = record[args[0]];
        let arg = args[0];

        for(let key of args){
            if(record[key] > max){
                max = record[key];
                arg = key;
            }
        }

        return arg;
        
    }

    private distance(a: number[], b: number[]){
        let sigma = 0;
        for(let i = 0; i < a.length; i++){
            sigma += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(sigma);
    }

}