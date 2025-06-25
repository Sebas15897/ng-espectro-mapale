import { Component, Input } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';

export interface FrequencyRange {
  min: number;
  max: number;
  color: string;
  description: string;
}

export interface GeometricShape {
  name: string;
  svg: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-color-mapper',
  templateUrl: './color-mapper.component.html',
  styleUrls: ['./color-mapper.component.scss'],
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
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

  readonly instrumentShapes: { [key: string]: GeometricShape } = {
    tambor: {
      name: 'Círculo',
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="currentColor" stroke="#333" stroke-width="2"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="#333" stroke-width="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
            </svg>`,
      description: 'Círculo - Representa la forma circular del tambor y la propagación omnidireccional del sonido',
      color: '#FF4500'
    },
    alegre: {
      name: 'Triángulo',
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,80 10,80" fill="currentColor" stroke="#333" stroke-width="2"/>
              <polygon points="50,25 75,65 25,65" fill="none" stroke="#333" stroke-width="1" opacity="0.5"/>
              <line x1="50" y1="35" x2="50" y2="55" stroke="#333" stroke-width="1" opacity="0.7"/>
            </svg>`,
      description: 'Triángulo - Simboliza la elevación tonal y la proyección aguda del alegre',
      color: '#FFFF00'
    },
    llamador: {
      name: 'Hexágono',
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,5 85,27.5 85,72.5 50,95 15,72.5 15,27.5" fill="currentColor" stroke="#333" stroke-width="2"/>
              <polygon points="50,20 70,35 70,65 50,80 30,65 30,35" fill="none" stroke="#333" stroke-width="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="8" fill="#333" opacity="0.6"/>
            </svg>`,
      description: 'Hexágono - Representa la complejidad rítmica y la función de marcación del llamador',
      color: '#0000FF'
    },
    tambora: {
      name: 'Cuadrado',
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="80" height="80" fill="currentColor" stroke="#333" stroke-width="2"/>
              <rect x="25" y="25" width="50" height="50" fill="none" stroke="#333" stroke-width="1" opacity="0.5"/>
              <rect x="35" y="35" width="30" height="30" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
              <rect x="45" y="45" width="10" height="10" fill="#333" opacity="0.6"/>
            </svg>`,
      description: 'Cuadrado - Simboliza la base sólida y estable que proporciona la tambora al conjunto',
      color: '#FF0000'
    }
  };

  // Propiedad para controlar la animación de las formas
  private animationIntensity: number = 0;

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

  getInstrumentShape(): GeometricShape | null {
    if (!this.selectedInstrument) return null;
    return this.instrumentShapes[this.selectedInstrument] || null;
  }

  getShapeStyle(): { [key: string]: string } {
    const shape = this.getInstrumentShape();
    if (!shape) return {};

    // Calcular intensidad basada en la frecuencia dominante
    this.calculateAnimationIntensity();

    return {
      'color': shape.color,
      'transform': `scale(${1 + this.animationIntensity * 0.3})`,
      'filter': `brightness(${100 + this.animationIntensity * 50}%)`,
      'transition': 'all 0.1s ease-out'
    };
  }

  private calculateAnimationIntensity(): void {
    if (!this.frequencyData) {
      this.animationIntensity = 0;
      return;
    }

    // Calcular la intensidad basada en la amplitud máxima
    const maxAmplitude = Math.max(...this.frequencyData);
    this.animationIntensity = Math.min(maxAmplitude / 255, 1);
  }

  isShapeVisible(): boolean {
    return this.selectedInstrument !== null && this.getInstrumentShape() !== null;
  }
}
