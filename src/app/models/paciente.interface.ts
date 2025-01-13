export interface SignosVitales {
  presionArterial: string;
  frecuenciaCardiaca: number;
  temperatura: number;
  saturacionOxigeno: number;
}

export interface Paciente {
  id?: number;
  nombre: string;
  edad: number;
  numeroHabitacion: string;
  estado: "ESTABLE" | "CRITICO" | "GRAVE" | "HOSPITALIZADO";
  signosVitales: {
      presionArterial: string;
      frecuenciaCardiaca: number;
      temperatura: number;
      saturacionOxigeno: number;
  }[];
}

export type NuevoPaciente = {
  nombre: string;
  edad: number;
  numeroHabitacion: string;
  estado: "ESTABLE" | "CRITICO" | "GRAVE" | "HOSPITALIZADO";
  signosVitales: SignosVitales[];
};