// src/app/components/alertas/alertas.component.ts
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Paciente } from 'src/app/models/paciente.interface';
import { RANGOS_NORMALES } from 'src/app/models/rangos-vitales.interface';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';


@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  pacientesConAlertas: Paciente[] = [];
  loading: boolean = false;
  error: string | null = null;
  private intervalId: any;

  constructor(
    private backendService: BackendService,
    private router: Router,
    private authService: MsalService
  ) { }

  ngOnInit(): void {
    this.cargarPacientesConAlertas();
    // Refrescar cada 30 segundos
    this.intervalId = setInterval(() => {
      this.cargarPacientesConAlertas();
    }, 30000);
  }
  cargarPacientesConAlertas(): void {
    this.loading = true;
    this.backendService.getPacientes().subscribe({
      next: (pacientes) => {
        this.pacientesConAlertas = pacientes.filter(paciente => 
          this.tienePacienteAlerta(paciente)
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.error = 'Error al cargar los pacientes con alertas';
        this.loading = false;
      }
    });
  }

  tienePacienteAlerta(paciente: Paciente): boolean {
    if (!paciente.signosVitales || paciente.signosVitales.length === 0) {
      return false;
    }

    const signosVitales = paciente.signosVitales[0];
    
    // Validar presión arterial (asumiendo formato "120/80")
    const presion = signosVitales.presionArterial.split('/')[0];
    const presionSistolica = parseInt(presion);

    return (
      presionSistolica < RANGOS_NORMALES.presionArterialMin ||
      presionSistolica > RANGOS_NORMALES.presionArterialMax ||
      signosVitales.frecuenciaCardiaca < RANGOS_NORMALES.frecuenciaCardiacaMin ||
      signosVitales.frecuenciaCardiaca > RANGOS_NORMALES.frecuenciaCardiacaMax ||
      signosVitales.temperatura < RANGOS_NORMALES.temperaturaMin ||
      signosVitales.temperatura > RANGOS_NORMALES.temperaturaMax ||
      signosVitales.saturacionOxigeno < RANGOS_NORMALES.saturacionOxigenoMin
    );
  }

  obtenerAlertasPaciente(paciente: Paciente): string[] {
    const alertas: string[] = [];
    const signosVitales = paciente.signosVitales[0];
    
    const presion = signosVitales.presionArterial.split('/')[0];
    const presionSistolica = parseInt(presion);

    if (presionSistolica < RANGOS_NORMALES.presionArterialMin) {
      alertas.push('Presión arterial baja');
    } else if (presionSistolica > RANGOS_NORMALES.presionArterialMax) {
      alertas.push('Presión arterial alta');
    }

    if (signosVitales.frecuenciaCardiaca < RANGOS_NORMALES.frecuenciaCardiacaMin) {
      alertas.push('Frecuencia cardíaca baja');
    } else if (signosVitales.frecuenciaCardiaca > RANGOS_NORMALES.frecuenciaCardiacaMax) {
      alertas.push('Frecuencia cardíaca alta');
    }

    if (signosVitales.temperatura < RANGOS_NORMALES.temperaturaMin) {
      alertas.push('Temperatura baja');
    } else if (signosVitales.temperatura > RANGOS_NORMALES.temperaturaMax) {
      alertas.push('Temperatura alta');
    }

    if (signosVitales.saturacionOxigeno < RANGOS_NORMALES.saturacionOxigenoMin) {
      alertas.push('Saturación de oxígeno baja');
    }

    return alertas;
  }

  verDetallesPaciente(id: number): void {
    this.router.navigate([`/pacientes/${id}`]);
  }

  // Agregar estos métodos
tieneAlertaPresion(paciente: Paciente): boolean {
  const presion = paciente.signosVitales[0].presionArterial.split('/')[0];
  const presionSistolica = parseInt(presion);
  return presionSistolica < RANGOS_NORMALES.presionArterialMin || 
         presionSistolica > RANGOS_NORMALES.presionArterialMax;
}

tieneAlertaFrecuencia(paciente: Paciente): boolean {
  const fc = paciente.signosVitales[0].frecuenciaCardiaca;
  return fc < RANGOS_NORMALES.frecuenciaCardiacaMin || 
         fc > RANGOS_NORMALES.frecuenciaCardiacaMax;
}

tieneAlertaTemperatura(paciente: Paciente): boolean {
  const temp = paciente.signosVitales[0].temperatura;
  return temp < RANGOS_NORMALES.temperaturaMin || 
         temp > RANGOS_NORMALES.temperaturaMax;
}

tieneAlertaSaturacion(paciente: Paciente): boolean {
  return paciente.signosVitales[0].saturacionOxigeno < RANGOS_NORMALES.saturacionOxigenoMin;
}
ordenarPorPrioridad(pacientes: Paciente[]): Paciente[] {
  return pacientes.sort((a, b) => {
    const alertasA = this.obtenerAlertasPaciente(a).length;
    const alertasB = this.obtenerAlertasPaciente(b).length;
    return alertasB - alertasA; // Ordena de más alertas a menos
  });
}
ngOnDestroy(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}

getSeveridad(paciente: Paciente): 'alta' | 'media' | 'baja' {
  const alertas = this.obtenerAlertasPaciente(paciente);
  if (alertas.length >= 3) return 'alta';
  if (alertas.length >= 2) return 'media';
  return 'baja';
}

obtenerUsuario(): string {
  if (this.authService.instance.getActiveAccount() == null) {
    return 'error';
  }
  return this.authService.instance.getActiveAccount().name;
}

cerrarSesion(): void {
  this.authService.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}

}
