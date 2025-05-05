/**
 * Complex number class for FFT calculations
 */
class Complex {
  constructor(real = 0, imag = 0) {
    this.real = real;
    this.imag = imag;
  }

  add(other) {
    return new Complex(
      this.real + other.real,
      this.imag + other.imag
    );
  }

  subtract(other) {
    return new Complex(
      this.real - other.real,
      this.imag - other.imag
    );
  }

  multiply(other) {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }
}

/**
 * Calculate FFT using Cooley-Tukey algorithm
 * @param {Array<Complex>} x - Input array of complex numbers
 * @returns {Array<Complex>} - FFT result
 */
export function fft(x) {
  const N = x.length;

  // Base case
  if (N <= 1) {
    return x;
  }

  // Check if N is power of 2
  if ((N & (N - 1)) !== 0) {
    throw new Error('入力長は2のべき乗である必要があります');
  }

  // Split into even and odd indices
  const even = x.filter((_, i) => i % 2 === 0);
  const odd = x.filter((_, i) => i % 2 === 1);

  // Recursive FFT on even and odd arrays
  const evenFFT = fft(even);
  const oddFFT = fft(odd);

  // Combine results using butterfly operation
  const result = new Array(N).fill(null);
  for (let k = 0; k < N / 2; k++) {
    const twiddle = new Complex(
      Math.cos(-2 * Math.PI * k / N),
      Math.sin(-2 * Math.PI * k / N)
    );
    
    const oddTerm = twiddle.multiply(oddFFT[k]);
    
    // First half
    result[k] = evenFFT[k].add(oddTerm);
    // Second half
    result[k + N/2] = evenFFT[k].subtract(oddTerm);
  }

  return result;
}

/**
 * Helper function to convert audio data to complex numbers
 * @param {Float32Array} audioData - Raw audio data
 * @returns {Array<Complex>} - Array of complex numbers
 */
export function prepareAudioData(audioData) {
  // Ensure input length is power of 2
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(audioData.length)));
  const paddedData = new Array(nextPowerOf2).fill(0);
  
  // Copy audio data and convert to complex numbers
  for (let i = 0; i < audioData.length; i++) {
    paddedData[i] = new Complex(audioData[i], 0);
  }
  
  return paddedData;
}

/**
 * Get magnitude spectrum from FFT result
 * @param {Array<Complex>} fftResult - FFT result
 * @returns {Array<number>} - Magnitude spectrum
 */
export function getMagnitudeSpectrum(fftResult) {
  return fftResult.map(complex => 
    Math.sqrt(complex.real * complex.real + complex.imag * complex.imag)
  );
}

/**
 * Get phase spectrum from FFT result
 * @param {Array<Complex>} fftResult - FFT result
 * @returns {Array<number>} - Phase spectrum
 */
export function getPhaseSpectrum(fftResult) {
  return fftResult.map(complex => 
    Math.atan2(complex.imag, complex.real)
  );
}

/**
 * Get FFT steps for visualization
 * @param {Array<Complex>} input - Input array of complex numbers
 * @returns {Array<Array<Complex>>} - Array of FFT steps
 */
export function getFFTSteps(input) {
  const steps = [];
  const N = input.length;
  
  // Add initial input
  steps.push([...input]);
  
  // Calculate steps recursively
  function calculateStep(arr, level) {
    if (arr.length <= 1) return;
    
    const even = arr.filter((_, i) => i % 2 === 0);
    const odd = arr.filter((_, i) => i % 2 === 1);
    
    steps.push([...even, ...odd]);
    
    calculateStep(even, level + 1);
    calculateStep(odd, level + 1);
  }
  
  calculateStep(input, 0);
  return steps;
}