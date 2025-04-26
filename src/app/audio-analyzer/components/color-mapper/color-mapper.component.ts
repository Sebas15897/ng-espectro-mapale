import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FrequencyRange {
  min: number;
  max: number;
  color: string;
  description: string;
}

@Component({
  selector: 'app-color-mapper',
  templateUrl: './color-mapper.component.html',
  styleUrls: ['./color-mapper.component.scss'],
  standalone: true,
  imports: [CommonModule],
})

export class ColorMapperComponent {
  @Input() frequencyData: Uint8Array | null = null;
  @Input() selectedInstrument: string | null | undefined = null;

  readonly frequencyRanges: FrequencyRange[] = [
    {
      min: 20,
      max: 60,
      color: '#FF0000',
      description: 'Infrarrojo - Frecuencias muy bajas',
    },
    {
      min: 61,
      max: 100,
      color: '#FF4500',
      description: 'Rojo - Frecuencias bajas',
    },
    {
      min: 101,
      max: 200,
      color: '#FFA500',
      description: 'Naranja - Frecuencias medio-bajas',
    },
    {
      min: 201,
      max: 400,
      color: '#FFFF00',
      description: 'Amarillo - Frecuencias medias',
    },
    {
      min: 401,
      max: 600,
      color: '#00FF00',
      description: 'Verde - Frecuencias medio-altas',
    },
    {
      min: 601,
      max: 800,
      color: '#0000FF',
      description: 'Azul - Frecuencias altas',
    },
    {
      min: 801,
      max: 1000,
      color: '#4B0082',
      description: 'Índigo - Frecuencias muy altas',
    },
    {
      min: 1001,
      max: 20000,
      color: '#9400D3',
      description: 'Violeta - Frecuencias ultrasónicas',
    },
  ];

  readonly instrumentRanges: { [key: string]: FrequencyRange } = {
    tambor: {
      min: 20,
      max: 200,
      color: '#FF4500',
      description: 'Tambor - Frecuencias bajas a medias',
    },
    alegre: {
      min: 200,
      max: 600,
      color: '#FFFF00',
      description: 'Alegre - Frecuencias medias',
    },
    llamador: {
      min: 600,
      max: 1000,
      color: '#0000FF',
      description: 'Llamador - Frecuencias altas',
    },
    tambora: {
      min: 20,
      max: 100,
      color: '#FF0000',
      description: 'Tambora - Frecuencias muy bajas',
    },
  };

  getDominantFrequencyColor(): string {
    if (!this.frequencyData) return '#FFFFFF';

    const maxIndex = this.frequencyData.indexOf(
      Math.max(...this.frequencyData)
    );
    return this.getColorForFrequency(maxIndex);
  }

  getColorForFrequency(frequency: number): string {
    const range = this.frequencyRanges.find(
      (r) => frequency >= r.min && frequency <= r.max
    );
    return range ? range.color : '#FFFFFF';
  }

  getInstrumentColor(): string {
    if (!this.selectedInstrument) return '#FFFFFF';
    return this.instrumentRanges[this.selectedInstrument]?.color || '#FFFFFF';
  }

  getInstrumentDescription(): string {
    if (!this.selectedInstrument) return 'Selecciona un instrumento';
    return this.instrumentRanges[this.selectedInstrument]?.description || '';
  }
}
