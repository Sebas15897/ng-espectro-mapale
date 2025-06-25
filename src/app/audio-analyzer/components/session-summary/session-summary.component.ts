import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionSummary, FrequencyRange } from '../../models/session-summary.model';
import { WordDocumentService } from '../../services/word-document.service';
import { ResearchReportService } from '../../services/research-report.service';

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-summary" *ngIf="summary">
      <div class="summary-header">
        <h3>Resumen de la Sesión</h3>
        <div class="session-time">
          <span>Duración: {{ summary.duration | number:'1.0-0' }} segundos</span>
          <span>Muestras totales: {{ summary.totalSamples }}</span>
        </div>
        <div class="button-group">
          <button class="download-button" (click)="downloadReport()">
            Descargar Reporte Word
          </button>
        </div>
      </div>

      <div class="frequency-ranges">
        <h4>Rangos de Frecuencia Detectados</h4>
        <div class="ranges-grid">
          <div class="range-card" *ngFor="let occurrence of summary.dominantRanges">
            <div class="range-color" [style.backgroundColor]="occurrence.range.color">
              <span class="range-name">{{ occurrence.range.name }}</span>
            </div>
            <div class="range-details">
              <p class="frequency-range">
                {{ occurrence.range.minFreq }}Hz - {{ occurrence.range.maxFreq }}Hz
              </p>
              <p class="range-description">{{ occurrence.range.description }}</p>
              <div class="occurrence-stats">
                <span class="percentage">{{ occurrence.percentage | number:'1.0-0' }}%</span>
                <span class="time">{{ occurrence.totalTime | number:'1.1-1' }}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="peak-stats">
        <div class="stat-item">
          <span class="stat-label">Frecuencia Pico:</span>
          <span class="stat-value">{{ summary.peakFrequency | number:'1.0-0' }}Hz</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Amplitud Promedio:</span>
          <span class="stat-value">{{ summary.averageAmplitude | number:'1.1-1' }}dB</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-summary {
      background: #1a1a1a;
      border-radius: 12px;
      padding: 1.5rem;
      color: white;
      margin: 1rem 0;
    }

    .summary-header {
      margin-bottom: 1.5rem;
      h3 {
        margin: 0;
        font-size: 1.5rem;
        color: #fff;
      }
      .session-time {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #aaa;
      }
    }

    .button-group {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .download-button, .research-button {
      padding: 0.5rem 1rem;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .download-button {
      background-color: #007bff;

      &:hover {
        background-color: #0056b3;
      }
    }

    .research-button {
      background-color: #28a745;

      &:hover {
        background-color: #1e7e34;
      }
    }

    .frequency-ranges {
      h4 {
        margin: 0 0 1rem;
        font-size: 1.2rem;
        color: #fff;
      }
    }

    .ranges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .range-card {
      background: #2a2a2a;
      border-radius: 8px;
      overflow: hidden;
    }

    .range-color {
      padding: 1rem;
      color: white;
      text-align: center;
      font-weight: 500;
    }

    .range-details {
      padding: 1rem;

      .frequency-range {
        margin: 0;
        font-size: 0.9rem;
        color: #ddd;
      }

      .range-description {
        margin: 0.5rem 0;
        font-size: 0.85rem;
        color: #aaa;
      }
    }

    .occurrence-stats {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.9rem;

      .percentage {
        font-weight: 600;
        color: #fff;
      }

      .time {
        color: #aaa;
      }
    }

    .peak-stats {
      margin-top: 1.5rem;
      display: flex;
      gap: 2rem;

      .stat-item {
        .stat-label {
          font-size: 0.9rem;
          color: #aaa;
          margin-right: 0.5rem;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
        }
      }
    }
  `]
})
export class SessionSummaryComponent {
  @Input() summary: SessionSummary | null = null;

  constructor(
    private wordDocumentService: WordDocumentService,
    private researchReportService: ResearchReportService
  ) {}

  async downloadReport() {
    if (!this.summary) return;

    try {
      const blob = await this.wordDocumentService.generateSessionReport(this.summary);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-analisis-${this.summary.startTime.toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  }

  downloadResearchReport(): void {
    this.researchReportService.downloadReport();
  }
}
