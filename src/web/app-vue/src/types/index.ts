export interface ComplexNumber {
  real: number;
  imag: number;
}

export interface FFTStep {
  data: ComplexNumber[];
  level: number;
}

export interface AudioData {
  samples: Float32Array;
  sampleRate: number;
}