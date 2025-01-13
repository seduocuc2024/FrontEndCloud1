// src/app/models/rangos-vitales.interface.ts
export interface RangosVitales {
    presionArterialMin: number;  // mmHg
    presionArterialMax: number;  // mmHg
    frecuenciaCardiacaMin: number;  // bpm
    frecuenciaCardiacaMax: number;  // bpm
    temperaturaMin: number;  // °C
    temperaturaMax: number;  // °C
    saturacionOxigenoMin: number;  // %
    saturacionOxigenoMax: number;  // %
  }
  
  export const RANGOS_NORMALES: RangosVitales = {
    presionArterialMin: 90,
    presionArterialMax: 140,
    frecuenciaCardiacaMin: 60,
    frecuenciaCardiacaMax: 100,
    temperaturaMin: 36,
    temperaturaMax: 37.5,
    saturacionOxigenoMin: 95,
    saturacionOxigenoMax: 100
  };