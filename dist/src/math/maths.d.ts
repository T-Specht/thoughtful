export declare namespace Maths {
    type Tensor = number[][];
    type Vector = number[][];
    type Matrix = number[][];
    function randomInt(min: number, max: number): number;
    function random(min: number, max: number): number;
    function argmax(args: number[]): number;
    function randomBool(): boolean;
    function round(value: number, decimals?: number): number;
    function sum(c: number[]): number;
    namespace Tensor2D {
        function getAsString(t: Tensor, markup?: boolean, joinChar?: string, lineSpaceChar?: string, end?: string, fixed?: number): string;
        namespace ElementWise {
            function add(...tensors: Tensor[]): number[][];
            function subtract(...tensors: Tensor[]): number[][];
            function multiply(...tensors: Tensor[]): number[][];
            function divide(...tensors: Tensor[]): number[][];
            function scale(t: Tensor, scl: number): number[][];
        }
        function dot(t1: Tensor, t2: Tensor): any[];
        function transpose(t: Tensor): number[][];
        function sameSize(...tensors: Tensor[]): boolean;
        /**
         *
         * @param size - Size of the 2D Tensor as an array with [#rows, #columns]
         * @param fill
         */
        function generate(size: number[], fillValue?: ((row?: number, column?: number) => number) | number): number[][];
        function fill(tensor: Tensor, fillValue: ((row?: number, column?: number) => number) | number): number[][];
        function getSize(t: Tensor): number[];
        function isValid(t: Tensor): boolean;
        function apply(t: Tensor, func: (value?: number, row?: number, col?: number) => number): number[][];
    }
}
