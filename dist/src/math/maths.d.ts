export declare namespace Maths {
    function randomInt(min: number, max: number): number;
    function random(min: number, max: number): number;
    function argmax(args: number[]): number;
    function randomBool(): boolean;
    function round(value: number, decimals?: number): number;
    function sum(c: number[]): number;
    namespace Tensor2D {
        namespace ElementWise {
            function add(...tensors: number[][][]): number[][];
            function subtract(...tensors: number[][][]): number[][];
            function multiply(...tensors: number[][][]): number[][];
            function divide(...tensors: number[][][]): number[][];
            function scale(t: number[][], scl: number): number[][];
        }
        function dot(t1: number[][], t2: number[][]): any[][];
        function transpose(t: number[][]): any[][];
        function sameSize(...tensors: number[][][]): boolean;
        /**
         *
         * @param size - Size of the 2D Tensor as an array with [#rows, #columns]
         * @param fill
         */
        function generate(size: number[], fillValue?: ((row?: number, column?: number) => number) | number): any[][];
        function fill(tensor: number[][], fillValue: ((row?: number, column?: number) => number) | number): number[][];
        function getSize(t: number[][]): number[];
        function isValid(t: number[][]): boolean;
        function apply(t: number[][], func: (value?: number, row?: number, col?: number) => number): number[][];
    }
}
