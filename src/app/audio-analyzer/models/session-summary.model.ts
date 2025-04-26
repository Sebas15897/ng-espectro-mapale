export interface FrequencyRange {
  name: string;
  minFreq: number;
  maxFreq: number;
  color: string;
  description: string;
}

export interface FrequencyOccurrence {
  range: FrequencyRange;
  occurrences: number;
  totalTime: number;
  percentage: number;
}

export interface SessionSummary {
  startTime: Date;
  endTime: Date;
  duration: number;
  dominantRanges: FrequencyOccurrence[];
  peakFrequency: number;
  averageAmplitude: number;
  totalSamples: number;
}
