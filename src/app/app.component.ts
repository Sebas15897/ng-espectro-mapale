import { Component } from '@angular/core';
import { Instrument } from './audio-analyzer/types/instrument';
import { AudioRecorderComponent } from './audio-analyzer/components/audio-recorder/audio-recorder.component';
import { SpectrumAnalyzerComponent } from './audio-analyzer/components/spectrum-analyzer/spectrum-analyzer.component';
import { ColorMapperComponent } from './audio-analyzer/components/color-mapper/color-mapper.component';
import { InstrumentSelectorComponent } from './audio-analyzer/components/instrument-selector/instrument-selector.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    AudioRecorderComponent,
    SpectrumAnalyzerComponent,
    ColorMapperComponent,
    InstrumentSelectorComponent,
    CommonModule,
    RouterOutlet
  ],
  standalone: true
})
export class AppComponent {
  title = 'Espectro Mapalé';
  selectedInstrument: any = null;
  frequencyData: Uint8Array | null = null;
  timeData: Float32Array | null = null;
  harmonics: number[] = [];
  isRecording: boolean = false;

  onInstrumentSelected(instrument: any): void {
    this.selectedInstrument = instrument;
  }

  onFrequencyDataUpdate(data: Uint8Array): void {
    this.frequencyData = data;
  }

  onTimeDataUpdate(data: Float32Array): void {
    this.timeData = data;
  }

  onHarmonicsUpdate(data: number[]): void {
    this.harmonics = data;
  }

  onRecordingStateChange(isRecording: boolean): void {
    this.isRecording = isRecording;
  }
}
