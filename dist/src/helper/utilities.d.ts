export declare namespace Utilities {
    function repeat(func: (iterations?: number) => any, iterations: number): void;
    function csvStringToJSON(csv: string, tryObjectParseIfPossible?: boolean, columnSeparator?: string, rowSeparator?: string): {}[] | (string | number)[][];
    function pickRandomFromArray(array: any[]): any;
    function tokenize(str: string, exp?: RegExp): string[];
}
