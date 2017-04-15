export namespace Normalization{
    export class MinMaxNormalizer{

        private minValues: number[] = [];
        private maxValues: number[] = [];

        constructor(private data: number[][]){
            let columns = data[0].length;
            for(let c = 0; c < columns; c++){
                let column = data.map(r => r[c]);
                this.minValues.push(Math.min(...column))
                this.maxValues.push(Math.max(...column))
            }
            
        }

        public normalizeExampleData(){
            return this.data.map((row, r) => row.map((x, column) => {
                return (x - this.minValues[column])/(this.maxValues[column] - this.minValues[column])
            }))
        }

        public normalizeNewDataRow(row: number[]){
            return row.map((value, v) => {
                return (v - this.minValues[v])/(this.maxValues[v] - this.minValues[v])
            });
        }

        public denormalize(row: number[]){
            return row.map((value, v) => {
                return v *(this.maxValues[v] - this.minValues[v]) + this.minValues[v];
            });
        }


    }
}