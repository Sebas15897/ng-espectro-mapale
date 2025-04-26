import { Injectable } from '@angular/core';
import { FrequencyRange, FrequencyOccurrence, SessionSummary } from '../models/session-summary.model';

@Injectable({
  providedIn: 'root'
})
export class SessionAnalyzerService {
  private readonly FREQUENCY_RANGES: FrequencyRange[] = [
    {
      name: 'Sub-graves',
      minFreq: 20,
      maxFreq: 60,
      color: '#FF0000',
      description: 'Frecuencias muy bajas, típicas de bombos profundos'
    },
    {
      name: 'Graves',
      minFreq: 60,
      maxFreq: 250,
      color: '#FF7F00',
      description: 'Fundamentales de tambora y llamador'
    },
    {
      name: 'Medios-bajos',
      minFreq: 250,
      maxFreq: 500,
      color: '#FFFF00',
      description: 'Armónicos de tambores, cuerpo del sonido'
    },
    {
      name: 'Medios',
      minFreq: 500,
      maxFreq: 2000,
      color: '#00FF00',
      description: 'Rango principal de percusión y ritmo'
    },
    {
      name: 'Medios-altos',
      minFreq: 2000,
      maxFreq: 4000,
      color: '#0000FF',
      description: 'Definición y ataque de instrumentos'
    },
    {
      name: 'Presencia',
      minFreq: 4000,
      maxFreq: 6000,
      color: '#4B0082',
      description: 'Brillo y claridad del sonido'
    },
    {
      name: 'Brillo',
      minFreq: 6000,
      maxFreq: 20000,
      color: '#9400D3',
      description: 'Armónicos superiores y aire'
    }
  ];

  private sessionData: {
    startTime: Date;
    frequencies: number[];
    amplitudes: number[];
  } = {
    startTime: new Date(),
    frequencies: [],
    amplitudes: []
  };

  startSession(): void {
    this.sessionData = {
      startTime: new Date(),
      frequencies: [],
      amplitudes: []
    };
  }

  addSample(frequency: number, amplitude: number): void {
    this.sessionData.frequencies.push(frequency);
    this.sessionData.amplitudes.push(amplitude);
  }

  generateSummary(): SessionSummary {
    const endTime = new Date();
    const duration = (endTime.getTime() - this.sessionData.startTime.getTime()) / 1000;

    // Calcular ocurrencias por rango
    const rangeOccurrences = this.FREQUENCY_RANGES.map(range => {
      const occurrences = this.sessionData.frequencies.filter(
        f => f >= range.minFreq && f < range.maxFreq
      ).length;

      return {
        range,
        occurrences,
        totalTime: (occurrences / this.sessionData.frequencies.length) * duration,
        percentage: (occurrences / this.sessionData.frequencies.length) * 100
      };
    });

    // Ordenar por ocurrencias
    const dominantRanges = rangeOccurrences
      .filter(o => o.occurrences > 0)
      .sort((a, b) => b.occurrences - a.occurrences);

    const peakFrequency = Math.max(...this.sessionData.frequencies);
    const averageAmplitude = this.sessionData.amplitudes.reduce((a, b) => a + b, 0) /
                            this.sessionData.amplitudes.length;

    return {
      startTime: this.sessionData.startTime,
      endTime,
      duration,
      dominantRanges,
      peakFrequency,
      averageAmplitude,
      totalSamples: this.sessionData.frequencies.length
    };
  }

  getRangeForFrequency(frequency: number): FrequencyRange {
    return this.FREQUENCY_RANGES.find(
      range => frequency >= range.minFreq && frequency < range.maxFreq
    ) || this.FREQUENCY_RANGES[3]; // Default to mid range if not found
  }
}
