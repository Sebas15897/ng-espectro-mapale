import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instrument } from '../../types/instrument';

@Component({
  selector: 'app-instrument-selector',
  templateUrl: './instrument-selector.component.html',
  styleUrls: ['./instrument-selector.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InstrumentSelectorComponent {
  @Input() selectedInstrument: Instrument | null = null;
  @Output() instrumentChange = new EventEmitter<Instrument>();

  readonly instruments: Instrument[] = [
    {
      id: 'tambor',
      name: 'Tambor',
      description: 'Instrumento de percusión principal del mapalé'
    },
    {
      id: 'alegre',
      name: 'Alegre',
      description: 'Tambor de tono medio-alto'
    },
    {
      id: 'llamador',
      name: 'Llamador',
      description: 'Tambor de tono alto que marca el ritmo'
    },
    {
      id: 'tambora',
      name: 'Tambora',
      description: 'Tambor de tono bajo'
    }
  ];

  onInstrumentSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedId = select.value;
    const instrument = this.instruments.find(i => i.id === selectedId);
    if (instrument) {
      this.selectedInstrument = instrument;
      this.instrumentChange.emit(instrument);
    }
  }
}
