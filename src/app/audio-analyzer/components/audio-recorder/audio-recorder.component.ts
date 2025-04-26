import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instrument } from '../../types/instrument';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AudioRecorderComponent implements OnInit, OnDestroy {
  @Input() selectedInstrument: Instrument | null = null;
  @Output() frequencyData = new EventEmitter<Uint8Array>();
  @Output() timeData = new EventEmitter<Float32Array>();
  @Output() harmonics = new EventEmitter<number[]>();
  @Output() recordingStateChange = new EventEmitter<boolean>();

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  isRecording: boolean = false;
  private animationFrameId: number | null = null;
  private sampleRate: number = 0;

  // Configuración del analizador con umbral más alto
  private readonly FFT_SIZE = 2048;
  private readonly SMOOTHING_TIME_CONSTANT = 0.8; // Aumentado para reducir fluctuaciones
  private readonly MIN_DECIBELS = -70; // Reducido el rango de detección
  private readonly MAX_DECIBELS = -10;
  private readonly NOISE_THRESHOLD = 0.015; // Umbral de ruido más alto
  private readonly FREQUENCY_THRESHOLD = 40; // Umbral para detección de frecuencias

  constructor() {}

  private async initAudioContext() {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.configureAnalyser();
      this.sampleRate = this.audioContext.sampleRate;
      console.log('AudioContext inicializado:', {
        state: this.audioContext.state,
        sampleRate: this.sampleRate
      });
    } catch (error) {
      console.error('Error al inicializar AudioContext:', error);
    }
  }

  private configureAnalyser(): void {
    if (!this.analyser) return;

    this.analyser.fftSize = this.FFT_SIZE;
    this.analyser.smoothingTimeConstant = this.SMOOTHING_TIME_CONSTANT;
    this.analyser.minDecibels = this.MIN_DECIBELS;
    this.analyser.maxDecibels = this.MAX_DECIBELS;
  }

  ngOnInit(): void {
    this.initAudioContext();
  }

  ngOnDestroy(): void {
    this.stopRecording();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  private async requestMicrophoneAccess(): Promise<void> {
    if (!this.audioContext || !this.analyser) {
      console.error('AudioContext o Analyser no inicializados');
      return;
    }

    try {
      console.log('Solicitando acceso al micrófono...');
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true, // Activado para reducir ruido
          noiseSuppression: true, // Activado para reducir ruido
          autoGainControl: false, // Desactivado para mejor control manual
          sampleRate: 48000,
          channelCount: 1,
        },
      };

      this.microphone = await navigator.mediaDevices.getUserMedia(constraints);

      // Crear y conectar los nodos de audio
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.microphone);
      this.scriptProcessor = this.audioContext.createScriptProcessor(1024, 1, 1);

      // Conectar los nodos
      this.mediaStreamSource.connect(this.analyser);
      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);

      // Monitorear el audio con umbral de ruido
      this.scriptProcessor.onaudioprocess = (e) => {
        if (this.isRecording) {
          const inputBuffer = e.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          // Calcular RMS y aplicar umbral de ruido
          const rms = Math.sqrt(inputData.reduce((acc, val) => acc + val * val, 0) / inputData.length);

          if (rms > this.NOISE_THRESHOLD) {
            this.timeData.emit(inputData);
          } else {
            // Si está por debajo del umbral, emitir silencio
            this.timeData.emit(new Float32Array(inputData.length));
          }
        }
      };

    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
    }
  }

  async startRecording(): Promise<void> {
    if (!this.isRecording) {
      if (!this.microphone) {
        await this.requestMicrophoneAccess();
      }

      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isRecording = true;
      this.recordingStateChange.emit(true);
      this.startAnimation();
    }
  }

  stopRecording(): void {
    if (this.isRecording) {
      this.isRecording = false;
      this.recordingStateChange.emit(false);

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      if (this.microphone) {
        this.microphone.getTracks().forEach(track => {
          track.stop();
        });
      }

      if (this.scriptProcessor) {
        this.scriptProcessor.disconnect();
      }

      if (this.mediaStreamSource) {
        this.mediaStreamSource.disconnect();
      }

      if (this.analyser) {
        this.analyser.disconnect();
      }
    }
  }

  private startAnimation(): void {
    const animate = () => {
      if (this.isRecording && this.analyser) {
        const frequencyData = this.getFrequencyData();
        if (frequencyData) {
          // Aplicar umbral a los datos de frecuencia
          const significantData = this.applyFrequencyThreshold(frequencyData);
          this.frequencyData.emit(significantData);

          const harmonics = this.detectHarmonics(significantData);
          this.harmonics.emit(harmonics);
        }

        this.animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();
  }

  private getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  private applyFrequencyThreshold(data: Uint8Array): Uint8Array {
    return new Uint8Array(data.map(value =>
      value > this.FREQUENCY_THRESHOLD ? value : 0
    ));
  }

  private detectHarmonics(frequencyData: Uint8Array): number[] {
    const harmonics: number[] = [];
    const threshold = this.FREQUENCY_THRESHOLD;

    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > threshold) {
        const frequency = (i * (this.sampleRate || 48000)) / this.FFT_SIZE;
        harmonics.push(frequency);
      }
    }

    return harmonics;
  }

  getFrequencyResolution(): number {
    return this.audioContext?.sampleRate || 48000 / this.FFT_SIZE;
  }

  getMaxFrequency(): number {
    return this.audioContext?.sampleRate || 48000 / 2;
  }

  public toggleRecording(): void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
}
