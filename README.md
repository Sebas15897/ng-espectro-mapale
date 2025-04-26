# Espectro Mapalé

## Título
"Relación entre el espectro sonoro del mapalé colombiano y su efecto neuronal: Un enfoque multisensorial"

## Descripción
Este proyecto busca analizar y visualizar el espectro sonoro de los instrumentos tradicionales del mapalé colombiano, estableciendo relaciones entre sus frecuencias características y efectos neuronales mediante un enfoque multisensorial.

## Objetivo Principal
Desarrollar un sistema de análisis espectral que capture, analice y visualice las frecuencias características de los instrumentos del mapalé (tambor, alegre, llamador y tambora), correlacionando sus patrones sonoros con respuestas neuronales y experiencias sinestésicas.

## Metodología

### 1. Captura Sonora
- [x] Recepción de datos de audio en tiempo real
- [x] Análisis FFT con resolución de 2048 puntos
- [x] Frecuencia de muestreo de 48kHz
- [ ] Sistema de grabación de muestras puras
- [ ] Filtrado de ruido ambiental
- [ ] Validación de calidad de señal

### 2. Análisis Espectral
- [x] Detección de frecuencia dominante
- [x] Cálculo de armónicos
- [x] Visualización en tiempo real
- [ ] Identificación específica de instrumentos
- [ ] Almacenamiento de patrones espectrales
- [ ] Análisis comparativo entre instrumentos

### 3. Asignación Cromática
- [x] Sistema básico de clasificación por rangos:
  * Sub-bass (< 60 Hz)
  * Bass (60-250 Hz)
  * Low-mid (250-500 Hz)
  * Mid (500-2000 Hz)
  * Upper-mid (2000-4000 Hz)
  * Presence (4000-6000 Hz)
  * Brilliance (> 6000 Hz)
- [ ] Mapeo al espectro visible (infrarrojo → ultravioleta)
- [ ] Asignación específica por instrumento
- [ ] Sistema de correlación visual-sonora

### 4. Análisis Neuronal (Pendiente)
- [ ] Integración con datos EEG
- [ ] Monitoreo de ondas cerebrales
- [ ] Sistema de seguimiento ocular
- [ ] Cuestionarios de respuesta emocional
- [ ] Análisis de sinestesia

## Estado Actual de Implementación

### Componentes Implementados
1. **Analizador Espectral**
   - Visualización en tiempo real del espectro de frecuencias
   - Detección de frecuencia dominante y armónicos
   - Interfaz interactiva con información detallada
   - Sistema responsive y modular

2. **Sistema de Visualización**
   - Gráfico de barras para espectro completo
   - Visualización separada de armónicos
   - Tooltips informativos
   - Clasificación básica por rangos de frecuencia

### Características Técnicas
- Componente Angular standalone
- Actualización en tiempo real
- FFT de 2048 puntos
- Frecuencia de muestreo: 48kHz
- Visualización de amplitud y frecuencia

## Próximas Implementaciones

### Prioridad Alta
1. Sistema de identificación de instrumentos del mapalé
2. Almacenamiento de muestras puras
3. Filtrado de ruido ambiental
4. Mapeo cromático basado en espectro visible

### Prioridad Media
1. Metadata cultural y documentación
2. Análisis comparativo entre instrumentos
3. Sistema de "huella digital" sonora

### Prioridad Baja
1. Integración con sistemas EEG
2. Cuestionarios de respuesta emocional
3. Análisis de sinestesia

## Justificación del Proyecto

### Artística
- Visualización de la "huella digital" sonora de instrumentos tradicionales
- Representación cromática de patrones espectrales

### Científica
- Análisis de procesamiento cerebral de frecuencias específicas
- Estudio de correlaciones entre estímulos visuales y auditivos

### Cultural
- Documentación objetiva de elementos sonoros patrimoniales
- Preservación digital de características espectrales del mapalé

## Tecnologías Utilizadas

### Framework Principal
- **Angular (v16+)**
  - Framework de desarrollo web moderno y robusto
  - Arquitectura basada en componentes standalone
  - Sistema de detección de cambios optimizado para visualizaciones en tiempo real
  - TypeScript como lenguaje base para tipo seguro

### Análisis y Procesamiento de Audio
- **Web Audio API**
  - API nativa del navegador para procesamiento de audio en tiempo real
  - Implementación de nodos de análisis FFT (Fast Fourier Transform)
  - Buffer de audio para captura y procesamiento de señales
  - Sistema de nodos para efectos y filtros de audio
  - Frecuencia de muestreo: 48kHz
  - Tamaño de buffer FFT: 2048 puntos

### Visualización de Datos
- **Chart.js**
  - Biblioteca de gráficos HTML5 para visualización dinámica
  - Configuración personalizada para visualización espectral
  - Optimización para actualizaciones en tiempo real
  - Soporte para múltiples tipos de gráficos:
    * Gráfico de barras para espectro
    * Gráfico de dispersión para armónicos
    * Sistema de tooltips interactivos

### Desarrollo y Herramientas
- **TypeScript**
  - Tipado estático para mayor robustez del código
  - Interfaces y tipos personalizados para datos espectrales
  - Decoradores para metadatos de componentes
  - Sistema de módulos ES6+

### Estilos y UI
- **SCSS**
  - Preprocesador CSS para estilos modulares
  - Variables para sistema de colores espectrales
  - Mixins para responsividad
  - Anidamiento de selectores para mejor organización

### Herramientas de Desarrollo
- **Angular CLI**
  - Generación de componentes y servicios
  - Sistema de construcción optimizado
  - Servidor de desarrollo con recarga en caliente
  - Herramientas de testing integradas

### Control de Versiones
- **Git**
  - Sistema de control de versiones distribuido
  - Flujo de trabajo basado en ramas
  - Integración con repositorios remotos

### Dependencias Principales
```json
{
  "dependencies": {
    "@angular/core": "^16.0.0",
    "@angular/common": "^16.0.0",
    "chart.js": "^4.0.0",
    "rxjs": "^7.0.0"
  }
}
```

## Instalación y Uso
[Pendiente de documentar]

## Contribución
[Pendiente de documentar]

## Licencia
[Pendiente de documentar]
