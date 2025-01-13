import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { Paciente } from '../models/paciente.interface';

@Component({
  selector: 'app-pagina-privada',
  templateUrl: './pagina-privada.component.html',
  styleUrls: ['./pagina-privada.component.css']
})
export class PaginaPrivadaComponent implements OnInit {
  pacientesHospitalizados: number = 0;
  pacientesCriticos: number = 0;

  constructor(
    private authService: MsalService,
    private backendService: BackendService, // Cambiado a BackendService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.backendService.getPacientes().subscribe({
      next: (pacientes: Paciente[]) => {
        console.log('Pacientes cargados:', pacientes);
        this.pacientesHospitalizados = pacientes.filter(
          paciente => paciente.estado === 'HOSPITALIZADO'
        ).length;
        
        this.pacientesCriticos = pacientes.filter(
          paciente => paciente.estado === 'CRITICO'
        ).length;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  obtenerUsuario(): string {
    if (this.authService.instance.getActiveAccount() == null) {
      return 'error';
    }
    return this.authService.instance.getActiveAccount().name;
  }

  cerrarSesion(): void {
    localStorage.removeItem('jwt');
    this.authService.instance.setActiveAccount(null);
    this.authService.logout();
  }

  navegarAPacientes(): void {
    this.router.navigate(['/pacientes']);
  }
  navegarAAlertas(): void {
    this.router.navigate(['/alertas']);
  }
}