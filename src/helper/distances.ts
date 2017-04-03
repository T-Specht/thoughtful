
export interface NumericDistanceFunction {
    (a: number[], b: number[]): number
}

export class Distances {

    public static EUCLIDEAN: NumericDistanceFunction = (a: number[], b: number[]) => {
        return Math.sqrt(a.reduce((a, i) => {
            return Math.pow(a - b[i], 2)
        }, 0));
    }

    public static TAXI: NumericDistanceFunction = (a: number[], b: number[]) => {
         return a.reduce((a, i) => {
            return Math.abs(a - b[i])
        }, 0);
    }

    // TODO: Understand
    // https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
    public static LEVENSHTEIN = (a: string, b: string) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        return Math.min(
                Distances.LEVENSHTEIN(a.substr(1), b) + 1,
                Distances.LEVENSHTEIN(b.substr(1), a) + 1,
                Distances.LEVENSHTEIN(a.substr(1), b.substr(1)) + (a[0] !== b[0] ? 1 : 0)
        );
    }

}