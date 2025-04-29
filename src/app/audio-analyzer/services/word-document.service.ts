import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { SessionSummary } from '../models/session-summary.model';

@Injectable({
  providedIn: 'root'
})
export class WordDocumentService {
  async generateSessionReport(summary: SessionSummary): Promise<Blob> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Reporte de Análisis de Audio',
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Fecha: ${summary.startTime.toLocaleDateString()}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Duración: ${summary.duration.toFixed(2)} segundos`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Rangos de Frecuencia Detectados',
                bold: true,
                size: 24,
              }),
            ],
          }),
          this.createFrequencyRangesTable(summary),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Estadísticas Principales',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Frecuencia Pico: ${summary.peakFrequency.toFixed(2)} Hz`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Amplitud Promedio: ${summary.averageAmplitude.toFixed(2)} dB`,
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }

  private createFrequencyRangesTable(summary: SessionSummary): Table {
    const rows = summary.dominantRanges.map(range => {
      return new TableRow({
        children: [
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph(range.range.name)],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph(`${range.range.minFreq}Hz - ${range.range.maxFreq}Hz`)],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph(`${range.percentage.toFixed(2)}%`)],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph(`${range.totalTime.toFixed(2)}s`)],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph(range.range.description)],
          }),
        ],
      });
    });

    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 20,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph('Rango')],
            }),
            new TableCell({
              width: {
                size: 20,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph('Frecuencia')],
            }),
            new TableCell({
              width: {
                size: 20,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph('Porcentaje')],
            }),
            new TableCell({
              width: {
                size: 20,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph('Tiempo')],
            }),
            new TableCell({
              width: {
                size: 20,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph('Descripción')],
            }),
          ],
        }),
        ...rows,
      ],
    });
  }

  async generateProjectDocumentation(): Promise<Blob> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Espectro Mapalé',
                bold: true,
                size: 36,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Sistema de Análisis de Audio para Instrumentos Tradicionales',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Descripción del Proyecto',
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Espectro Mapalé es una aplicación web diseñada para analizar y visualizar el espectro de frecuencias de instrumentos musicales tradicionales, con un enfoque especial en los instrumentos utilizados en el mapalé. El sistema permite capturar, analizar y documentar las características espectrales únicas de estos instrumentos.',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Características Principales',
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Analizador Espectral',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Visualización en tiempo real del espectro de frecuencias\n• Detección de frecuencia dominante y armónicos\n• Interfaz interactiva con información detallada\n• Sistema responsive y modular',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Sistema de Visualización',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Gráfico de barras para espectro completo\n• Visualización separada de armónicos\n• Tooltips informativos\n• Clasificación por rangos de frecuencia',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Características Técnicas',
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Componente Angular standalone\n• Actualización en tiempo real\n• FFT de 2048 puntos\n• Frecuencia de muestreo: 48kHz\n• Visualización de amplitud y frecuencia',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Justificación del Proyecto',
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Artística',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Visualización de la "huella digital" sonora de instrumentos tradicionales\n• Representación cromática de patrones espectrales',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Científica',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Análisis de procesamiento cerebral de frecuencias específicas\n• Estudio de correlaciones entre estímulos visuales y auditivos',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Cultural',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Documentación objetiva de elementos sonoros patrimoniales\n• Preservación digital de características espectrales del mapalé',
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }
}
