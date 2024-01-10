export function sleep (seconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('done');
        }, seconds * 1000);
    })
}