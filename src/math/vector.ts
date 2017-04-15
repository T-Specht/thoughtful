import { Maths } from "..";

export class Vector{
    constructor(private components: number[]){

    }

    public static rand(size: number){
        return new Vector(new Array(size).fill(0).map(v => Math.random()));
    }

    public copy(){
        return new Vector(this.components.slice());
    }

    public getArray(){
        return this.components;
    }

    public append(vec: Vector){
        this.components.push(...vec.components);
        return this;
    }
    public prepend(vec: Vector){
        this.components.unshift(...vec.components);
        return this;
    }

    public get size(){
        return this.components.length;
    }

    public get magnitude(){
        return Math.sqrt(this.components.reduce((s, c) => s + (c * c), 0));
    }

    public get(component: number){
        return this.components[component];
    }
    public set(component: number, value: number){
        this.components[component] = value;
        return this;
    }

    public add(vec: Vector){
        this.assertSameSize(vec);
        this.components.map((c, i) => c + vec.get(i));
        return this;
    }
    public subtract(vec: Vector){
        this.assertSameSize(vec);
        this.components.map((c, i) => c - vec.get(i));
        return this;
    }
    public multiply(vec: Vector){
        this.assertSameSize(vec);
        this.components.map((c, i) => c * vec.get(i));
        return this;
    }
    public divide(vec: Vector){
        this.assertSameSize(vec);
        this.components.map((c, i) => c / vec.get(i));
        return this;
    }
    public pow(exponent: number ){
        
        this.components.map((c, i) => Math.pow(c, exponent));
        return this;
    }

    public sum(){
        return Maths.sum(this.components);
    }

    public scale(scl: number){
        this.components.map(c => c * scl);
        return this;
    }

    /**
     * this vector will be a row vector
     * @param vec column vector
     */
    public dot(vec: Vector){
        let val = 0;
        this.assertSameSize(vec);
        return Maths.sum(this.components.map((c, i) => c * vec.get(i)));
    }

    public apply(func: (number) => number){
        this.components = this.components.map(c => func(c));
        return this;
    }

    private assertSameSize(vec: Vector){
        if(this.size != vec.size) new Error('Vectors do not have matching sizes');
    }
}