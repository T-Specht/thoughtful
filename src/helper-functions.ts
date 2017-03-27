export function repeat(func: (iterations?: number) => any, iterations: number){
    for(let i = 0; i < iterations; i++){
        func(i);
    }
}