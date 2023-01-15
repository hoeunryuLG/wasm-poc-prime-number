/* global self */

import WASM_MODULE from "./primeNumberWasm.js";

let primeNumberWasm;

(async () => {
    primeNumberWasm = await WASM_MODULE();
})();

const generatePrimeNumbers = (limit) => {
    let nrOfPrimeNumbers = 0;

    let before = performance.now();

    nrOfPrimeNumbers = primeNumberWasm.getNrOfPrimeNumbers(limit);

    let after = performance.now();
    let elapsed = Math.round(after - before);

    self.postMessage({
        nrOfPrimeNumbers: nrOfPrimeNumbers,
        elapsed: elapsed,
    });
};

self.onmessage = (event) => {
    const {limit} = event.data;
    generatePrimeNumbers(limit);
};
