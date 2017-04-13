import { LabelToValue, NumericDistanceFunction, Distances, Maths } from '.';

export class KNNClassifier{

    private data: {
        c: number,
        attr: number[]
    }[] = [];

    constructor(private k = 3, private distanceFunction: NumericDistanceFunction = Distances.EUCLIDEAN){
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

    public predict(input: number[], l2v?: LabelToValue){
        let distances: {
            index: number,
            distance: number
        }[] = [];

        // Calculate distances
        this.data.forEach((entry, i) => {
            return distances.push({
                index: i,
                distance: this.distanceFunction(input, entry.attr)
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
        let c =  Maths.argmax(kNearestClasses);

        // return value or class if l2v is passed

        return l2v ? l2v.toLabel(c) : c;

    }

    

}