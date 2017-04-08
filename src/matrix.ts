export class Matrix{

    public data: number[][];

    constructor(data: number[][]);
    constructor(rows: number, columns: number);
    constructor(p1: number[][] | number, p2?: number){
        if(typeof p1 == 'object'){
            this.data = p1;
        }else{
            this.data = Matrix.get2DArray(p1, p2);
        }
    }

    private static get2DArray(m: number, n: number, fill = 0): number[][]{
        return new Array(m).fill(0).map(r => new Array(n).fill(fill));
    }

    public static rowVector(...components: number[]){
        return new Matrix([components])
    }
    public static columnVector(...components: number[]){
        let v = components.map(c => [c]);
        return new Matrix(v);
    }

    public static rand(rows: number, columns: number){
        let m = new Matrix(rows, columns);
        m.map(v => Math.random());
        return m;
    }

    public static ones(rows: number, columns: number){
        let m = new Matrix(rows, columns);
        m.fill(1);
        return m;
    }

    public static eye(size: number){
        let m = new Matrix(size, size);
        for(let i = 0; i < size; i++) m.set(i, i, 1);
        return m;
    }

    public static join(m1: Matrix, m2: Matrix, pos: 'top' | 'bottom' | 'left' | 'right' = 'bottom'){
        let newData: number[][];
        switch (pos) {
            case 'top':
                newData = [...m2.data, ...m1.data];
                break;
            case 'bottom':
                newData = [...m1.data, ...m2.data];
                break;
            case 'left':
                newData = m1.data.map((r, i) => [...m2.data[i], ...r]);
                break;
            case 'right':
                newData = m1.data.map((r, i) => [...r, ...m2.data[i]]);
                break;
            default:
                break;
        }

        return new Matrix(newData);
    }

    public size(){
        return [this.getNumberOfRows(), this.getNumberOfColumns()];
    }
    
    public getNumberOfRows(){
        return this.data.length;
    }
    public getNumberOfColumns(){
        return this.data[0].length;
    }

    public getDimensions(){
        return [this.getNumberOfRows(), this.getNumberOfColumns()];
    }

    public set(row: number, column: number, val: number){
        this.data[row][column] = val;
    }

    public get(row: number, column: number){
        return this.data[row][column];
    }

    public getRowAsRowVector(row: number){
        // Copy without reference
        let v = new Matrix([this.data[row].slice()]);
        return v;
    }

    public getColumnAsRowVector(column: number){
        // Copy without reference
        let v = [];
        for(let row of this.data) v.push(row[column]);
        return new Matrix([v]);
    }

    public getAsScalar(){
        if(this.getDimensions().every(d => d == 1)){
            return this.get(0, 0);
        }else{
            this.error('size', 'getAsFloat (matrix must be 1x1)');
        }
    }

    public getArray(){
        // Deep copy without reference
        return this.data.map(r => r.slice());
    }

    public copy(){
        return new Matrix(this.getArray());
    }

    // endRow and endColumn exclusive if positive
    // startRow and startColumn exclusive if negative
    public slice(startRow: number, endRow: number, startColumn: number, endColumn: number){
        //Handle negatives

        if(endRow < 0){
            endRow = this.getNumberOfRows() + (endRow + 1);
        }
        if(startRow < 0){
            startRow = this.getNumberOfRows() + (startRow + 1);
        }

        if(endColumn < 0){
            endColumn = this.getNumberOfColumns() + (endColumn + 1);
        }
        if(startColumn < 0){
            startColumn = this.getNumberOfColumns() + (startColumn + 1);
        }

        let res = new Matrix(endRow - startRow, endColumn - startColumn);
        for(let row = startRow; row < endRow; row++){
            for(let column = startColumn; column < endColumn; column++){
                res.set(row-startRow, column-startColumn, this.get(row, column));
            }
        }

        return res;
    }

    public map(func: (val: number, row?: number, column?: number) => number){
        for(let i = 0; i < this.getNumberOfRows(); i++){
            for(let j = 0; j < this.getNumberOfColumns(); j++){
                this.data[i][j] = func(this.data[i][j], i, j);
            }
        }
        return this;
    }

    public forEach(func: (val: number, row?: number, column?: number) => void){
        for(let i = 0; i < this.getNumberOfRows(); i++){
            for(let j = 0; j < this.getNumberOfColumns(); j++){
                func(this.data[i][j], i, j);
            }
        }
        return this;
    }

    public fill(newVal: number){
        return this.map(v => newVal);
    }

    public scale(scl: number){
        return this.map(v => v*scl);
    }

    public add(m: Matrix){
        if(!this.hasSameDimensions(m)) this.error('size', 'addition');
        return this.map((v, row, col) => v + m.get(row, col));
    }

    public subtract(m: Matrix){
        if(!this.hasSameDimensions(m)) this.error('size', 'subtraction');
        return this.map((v, row, col) => v - m.get(row, col));
    }
    public multiply(m: Matrix){
        if(!this.hasSameDimensions(m)) this.error('size', 'multiplication');
        return this.map((v, row, col) => v * m.get(row, col));
    }
    public divide(m: Matrix){
        if(!this.hasSameDimensions(m)) this.error('size', 'division');
        return this.map((v, row, col) => v / m.get(row, col));
    }

    public dot(m: Matrix){
        if(!(this.getNumberOfColumns() == m.getNumberOfRows())) this.error('size', 'dot product');

        let newData = Matrix.get2DArray(this.getNumberOfRows(), m.getNumberOfColumns());

        for(let v = 0; v < m.getNumberOfColumns(); v++){
            for(let r = 0; r < this.getNumberOfRows(); r++){
                for(let i = 0; i < m.getNumberOfRows(); i++){
                    newData[r][v] += m.get(i, v) * this.get(r, i);
                }
            }
        }

        this.data = newData;
        return this;
    }

    public transpose(){
        let newData = Matrix.get2DArray(this.getNumberOfColumns(), this.getNumberOfRows());
        this.forEach((v, row, col) => {
            newData[col][row] = v;
        });
        this.data = newData;
        return this;
    }

    public min(){
        let minValues = [];
        for(let c = 0; c < this.getNumberOfColumns(); c++){
            let column = this.getColumnAsRowVector(c).getArray()[0];
            minValues.push(Math.min(...column));
        }

        return Matrix.rowVector(...minValues);
    }
    public max(){
        let maxValues = [];
        for(let c = 0; c < this.getNumberOfColumns(); c++){
            let column = this.getColumnAsRowVector(c).getArray()[0];
            maxValues.push(Math.max(...column));
        }

        return Matrix.rowVector(...maxValues);
    }

    private hasSameDimensions(m: Matrix){
        if(m.getNumberOfColumns() == this.getNumberOfColumns() && m.getNumberOfRows() == this.getNumberOfRows()){
            return true;
        }else{
            return false;
        }
    }
    private error(code: 'size', operation: string){
        switch (code) {
            case 'size':
                throw `Matrices not not have the right sizes for operation ${operation}`;        
            default:
                throw "Error!"
        }
        
    }

    public show(){
        console.log(this.getAsString());
        return this;
    }

    public getAsString(markup = true, joinChar = '\t', lineSpaceChar = ' ', end = '\n', fixed = 3) {
        if (!markup) {
            return this.data.map(r => r.map(n => n.toFixed(fixed)).join('\t')).join('\n') + end;
        } else {
            return this.data.map((r, i) => {

                let middlePart = r.map(n => n.toFixed(fixed)).join(joinChar)


                if (i == 0 && this.data.length == 1) {
                    return `[${lineSpaceChar}${middlePart}${lineSpaceChar}]`
                } else if (i == 0) {
                    return `⎡${lineSpaceChar}${middlePart}${lineSpaceChar}⎤`
                } else if (i == this.data.length - 1) {
                    return `⎣${lineSpaceChar}${middlePart}${lineSpaceChar}⎦`
                } else {
                    return `⎜${lineSpaceChar}${middlePart}${lineSpaceChar}⎟`
                }
            }).join('\n') + end;
        }
    }

}