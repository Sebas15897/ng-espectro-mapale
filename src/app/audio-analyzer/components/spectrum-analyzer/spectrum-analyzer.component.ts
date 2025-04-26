import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { SessionAnalyzerService } from '../../services/session-analyzer.service';
import { SessionSummaryComponent } from '../session-summary/session-summary.component';
import { SessionSummary } from '../../models/session-summary.model';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-spectrum-analyzer',
  templateUrl: './spectrum-analyzer.component.html',
  styleUrls: ['./spectrum-analyzer.component.scss'],
  standalone: true,
  imports: [CommonModule, SessionSummaryComponent]
})
export class SpectrumAnalyzerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() frequencyData: Uint8Array | null = null;
  @Input() harmonics: number[] = [];
  @Input() set isRecording(value: boolean) {
    if (this._isRecording !== value) {
      this._isRecording = value;
      if (value) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    }
  }
  get isRecording(): boolean {
    return this._isRecording;
  }
  private _isRecording = false;

  @ViewChild('spectrumCanvas') spectrumCanvas!: ElementRef<HTMLCanvasElement>;

  sessionSummary: SessionSummary | null = null;
  private chart: Chart | null = null;
  private animationFrameId: number | null = null;
  private sampleRate: number = 48000;
  private fftSize: number = 2048;

  dominantFrequency: number = 0;
  dominantAmplitude: number = 0;
  harmonicFrequencies: { frequency: number; amplitude: number }[] = [];

  constructor(private sessionAnalyzer: SessionAnalyzerService) {}

  ngOnInit(): void {
    // No inicializamos el chart aquí, lo haremos en AfterViewInit
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initializeChart(): void {
    if (!this.spectrumCanvas?.nativeElement) {
      console.warn('Canvas element not available');
      return;
    }

    const ctx = this.spectrumCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context');
      return;
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: Array.from({ length: this.fftSize / 2 }, (_, i) =>
          ((i * this.sampleRate) / this.fftSize).toFixed(1)
        ),
        datasets: [
          {
            label: 'Espectro de Frecuencias',
            data: new Array(this.fftSize / 2).fill(0),
            backgroundColor: 'rgba(0, 122, 255, 0.2)',
            borderColor: 'rgba(0, 122, 255, 1)',
            borderWidth: 1
          },
          {
            label: 'Armónicos',
            data: new Array(this.fftSize / 2).fill(0),
            backgroundColor: 'rgba(255, 45, 85, 0.2)',
            borderColor: 'rgba(255, 45, 85, 1)',
            borderWidth: 1,
            type: 'scatter'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 255,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#86868B'
            },
            title: {
              display: true,
              text: 'Amplitud',
              color: '#1D1D1F',
              font: {
                size: 12,
                weight: 500
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#86868B',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            },
            title: {
              display: true,
              text: 'Frecuencia (Hz)',
              color: '#1D1D1F',
              font: {
                size: 12,
                weight: 500
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#1D1D1F',
              font: {
                size: 12,
                weight: 500
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1D1D1F',
            bodyColor: '#1D1D1F',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const frequency = ((context.dataIndex * this.sampleRate) / this.fftSize).toFixed(1);
                return `Frecuencia: ${frequency} Hz, Amplitud: ${context.raw}`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    this.startAnimation();
  }

  private startAnimation(): void {
    const animate = () => {
      if (this.chart && this.frequencyData) {
        this.chart.data.datasets[0].data = Array.from(this.frequencyData);

        const harmonicData = new Array(this.fftSize / 2).fill(null);
        this.harmonics.forEach(freq => {
          const index = Math.round((freq * this.fftSize) / this.sampleRate);
          if (index < harmonicData.length && this.frequencyData) {
            harmonicData[index] = this.frequencyData[index];
          }
        });
        this.chart.data.datasets[1].data = harmonicData;

        this.updateDominantFrequency();
        this.chart.update('none');

        // Actualizar datos de la sesión si está grabando
        if (this.isRecording && this.dominantFrequency > 0) {
          this.sessionAnalyzer.addSample(this.dominantFrequency, this.dominantAmplitude);
        }
      }
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updateDominantFrequency(): void {
    if (!this.frequencyData) return;

    let maxAmplitude = 0;
    let maxIndex = 0;

    for (let i = 0; i < this.frequencyData.length; i++) {
      if (this.frequencyData[i] > maxAmplitude) {
        maxAmplitude = this.frequencyData[i];
        maxIndex = i;
      }
    }

    this.dominantFrequency = (maxIndex * this.sampleRate) / this.fftSize;
    this.dominantAmplitude = maxAmplitude;

    this.harmonicFrequencies = this.harmonics.map(freq => ({
      frequency: freq,
      amplitude: this.frequencyData![Math.round((freq * this.fftSize) / this.sampleRate)] || 0
    }));
  }

  getFrequencyRangeClass(): string {
    if (this.dominantFrequency < 60) {
      return 'range-sub-bass';
    } else if (this.dominantFrequency < 250) {
      return 'range-bass';
    } else if (this.dominantFrequency < 500) {
      return 'range-low-mid';
    } else if (this.dominantFrequency < 2000) {
      return 'range-mid';
    } else if (this.dominantFrequency < 4000) {
      return 'range-upper-mid';
    } else if (this.dominantFrequency < 6000) {
      return 'range-presence';
    } else {
      return 'range-brilliance';
    }
  }

  private startRecording(): void {
    console.log('Iniciando grabación y análisis');
    this.sessionSummary = null;
    this.sessionAnalyzer.startSession();
  }

  private stopRecording(): void {
    console.log('Deteniendo grabación y generando resumen');
    this.sessionSummary = this.sessionAnalyzer.generateSummary();
  }
}
