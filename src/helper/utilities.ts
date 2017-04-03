import { Maths } from '..';

export namespace Utilities {
    export function repeat(func: (iterations?: number) => any, iterations: number) {
        for (let i = 0; i < iterations; i++) {
            func(i);
        }
    }

    export function csvStringToJSON(csv: string, tryObjectParseIfPossible = true, columnSeparator = ',', rowSeparator = '\r\n'): {}[] | (string | number)[][] {
        let data = csv.trim().split(rowSeparator).map(r => r.split(columnSeparator).map(c => isNaN(c as any) ? c : parseFloat(c)));
        if (data[0].every(c => typeof c == 'string') && tryObjectParseIfPossible) {
            let labels = data.splice(0, 1)[0] as string[];
            let jsonData = data.map((r, i) => {
                let rowObject = {};
                for (let i = 0; i < labels.length; i++) {
                    rowObject[labels[i]] = r[i];
                }
                return rowObject
            });
            return jsonData;
        } else {
            return data;
        }
    }

    export function pickRandomFromArray(array: any[]) {
        return array[Maths.randomInt(0, array.length)];
    }
}