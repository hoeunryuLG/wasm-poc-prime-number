/* global self */

const getNrOfPrimeNumbers = (limit) => {
    const primeNumbers = Array.from({ length: limit }, (_, k) => k);
    primeNumbers[0] = -1;
    primeNumbers[1] = -1;

    for (const prime of primeNumbers) {
      if (prime === -1) {
        continue;
      }
      for (let i = prime * prime; i < limit; i += prime) {
        if (i % prime === 0) {
          primeNumbers[i] = -1;
        }
      }
    }
    return primeNumbers.reduce((a, v) => (v !== -1 ? a + 1 : a), 0);
};

const postNrPrimeNumbers = (limit) => {
    let before = performance.now();

    const nrOfPrimeNumbers = getNrOfPrimeNumbers(limit);

    let after = performance.now();
    let elapsed = Math.round(after - before);

    self.postMessage({
        nrOfPrimeNumbers: nrOfPrimeNumbers,
        elapsed: elapsed,
    });
};

self.onmessage = (event) => {
    const {limit} = event.data;
    postNrPrimeNumbers(limit);
};
