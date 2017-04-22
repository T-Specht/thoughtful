import { Matrix } from '..';

export namespace Maths {

    export type Tensor = number[][];
    export type Vector = number[][];
    export type Matrix = number[][];

    export function randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }
    export function random(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    export function argmax(args: number[]) {
        let record = {};
        args.forEach(a => record[a] = record[a] + 1 || 1);

        let max = record[args[0]];
        let arg = args[0];

        for (let key of args) {
            if (record[key] > max) {
                max = record[key];
                arg = key;
            }
        }

        return arg;

    }

    export function randomBool() {
        return Math.random() > 0.5 ? true : false;
    }
    export function round(value: number, decimals = 1) {
        let f = Math.pow(10, decimals);
        return Math.round(value * f) / f;
    }
    export function sum(c: number[]) {
        let M = c instanceof Matrix ? c.getColumnAsRowVector(0).getArray()[0] : c;
        return M.reduce((s, x) => s + x, 0);
    }

    export namespace Tensor2D {




        const NOT_VALID = new Error('The tensor is not valid.');
        const SIZE_NOT_MATCHING = new Error('Tensors do not have matching sizes.');


        export function getAsString(t: Tensor, markup = true, joinChar = '\t', lineSpaceChar = ' ', end = '\n', fixed = 3) {
            if (!markup) {
                return t.map(r => r.map(n => n.toFixed(fixed)).join('\t')).join('\n') + end;
            } else {
                return t.map((r, i) => {

                    let middlePart = r.map(n => n.toFixed(fixed)).join(joinChar)


                    if (i == 0 && t.length == 1) {
                        return `[${lineSpaceChar}${middlePart}${lineSpaceChar}]`
                    } else if (i == 0) {
                        return `⎡${lineSpaceChar}${middlePart}${lineSpaceChar}⎤`
                    } else if (i == t.length - 1) {
                        return `⎣${lineSpaceChar}${middlePart}${lineSpaceChar}⎦`
                    } else {
                        return `⎜${lineSpaceChar}${middlePart}${lineSpaceChar}⎟`
                    }
                }).join('\n') + end;
            }
        }

        export namespace ElementWise {
            export function add(...tensors: Tensor[]) {
                if (!sameSize(...tensors)) throw SIZE_NOT_MATCHING
                let result = tensors[0].slice();
                for (let i = 1; i < tensors.length; i++) {
                    let tensor = tensors[i];
                    result = result.map((r, i) => r.map((c, j) => c + tensor[i][j]))
                }
                return result;
            }
            export function subtract(...tensors: Tensor[]) {
                if (!sameSize(...tensors)) throw SIZE_NOT_MATCHING
                let result = tensors[0].slice();
                for (let i = 1; i < tensors.length; i++) {
                    let tensor = tensors[i];
                    result = result.map((r, i) => r.map((c, j) => c - tensor[i][j]))
                }
                return result;
            }
            export function multiply(...tensors: Tensor[]) {
                if (!sameSize(...tensors)) throw SIZE_NOT_MATCHING
                let result = tensors[0].slice();
                for (let i = 1; i < tensors.length; i++) {
                    let tensor = tensors[i];
                    result = result.map((r, i) => r.map((c, j) => c * tensor[i][j]))
                }
                return result;
            }
            export function divide(...tensors: Tensor[]) {
                if (!sameSize(...tensors)) throw SIZE_NOT_MATCHING
                let result = tensors[0].slice();
                for (let i = 1; i < tensors.length; i++) {
                    let tensor = tensors[i];
                    result = result.map((r, i) => r.map((c, j) => c / tensor[i][j]))
                }
                return result;
            }

            export function scale(t: Tensor, scl: number) {
                return t.map((row, r) => row.map((col, c) => col * scl));
            }
        }

        export function dot(t1: Tensor, t2: Tensor) {
            const [ROWS_T1, COLS_T1] = getSize(t1);
            const [ROWS_T2, COLS_T2] = getSize(t2);

            if (COLS_T1 != ROWS_T2) throw SIZE_NOT_MATCHING;

            let resultTensor = new Array(COLS_T2).fill(new Array());
            //generate([ROWS_T1, COLS_T2])

            for (let colOfT2 = 0; colOfT2 < COLS_T2; colOfT2++) {
                for (let rowOfT1 = 0; rowOfT1 < ROWS_T1; rowOfT1++) {
                    let sum = 0;
                    for (let numberAt_T1_Or_T2 = 0; numberAt_T1_Or_T2 < COLS_T1; numberAt_T1_Or_T2++) {
                        sum += t1[rowOfT1][numberAt_T1_Or_T2] * t2[numberAt_T1_Or_T2][colOfT2];
                    }
                    resultTensor[rowOfT1][colOfT2] = sum;
                }
            }

            return resultTensor;
        }

        export function transpose(t: Tensor) {
            let [ROWS, COLS] = getSize(t);
            let newSize = getSize(t).reverse();
            let resultTensor = generate(newSize);
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    resultTensor[col][row] = t[row][col];
                }
            }
            return resultTensor;
        }

        export function sameSize(...tensors: Tensor[]) {
            let firstTensorSize = getSize(tensors[0]);
            return tensors.every(t => {
                let size = getSize(t);
                return isValid(t) && firstTensorSize[0] == size[0] && firstTensorSize[1] == size[1]
            })
        }

        /**
         * 
         * @param size - Size of the 2D Tensor as an array with [#rows, #columns]
         * @param fill 
         */
        export function generate(size: number[], fillValue: ((row?: number, column?: number) => number) | number = 0) {
            let tensor: Tensor = new Array(size[0]).fill(0).map(r => new Array(size[1]).fill(0));
            return fillValue === 0 ? tensor : fill(tensor, fillValue);
        }

        export function fill(tensor: Tensor, fillValue: ((row?: number, column?: number) => number) | number) {
            throwIfNotValid(tensor);
            if (typeof fillValue == 'number') {
                return tensor.map(r => r.map(v => v = fillValue));
            } else {
                return tensor.map((r, row) => r.map((v, col) => v = fillValue(row, col)));
            }
        }

        export function getSize(t: Tensor) {
            return isValid(t) ? [t.length, t[0].length] : null;
        }

        function throwIfNotValid(t: Tensor) {
            if (!isValid(t)) throw NOT_VALID;
        }

        export function isValid(t: Tensor) {
            return t.every(r => r.length == t[0].length && r.every(n => typeof n == 'number'));
        }

        export function apply(t: Tensor, func: (value?: number, row?: number, col?: number) => number) {
            let copy = t.slice();
            return copy.map((r, i) => r.map((c, j) => func(c, i, j)));
        }
    }
}