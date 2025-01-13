import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Paciente, NuevoPaciente } from 'src/app/models/paciente.interface';
import { NuevoPacienteDialogComponent } from './nuevo-paciente-dialog.component';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading: boolean = false;
  error: string | null = null;
  mostrarDialogo = false;

  constructor(
    private authService: MsalService,
    private backendService: BackendService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPacientes();
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

  cargarPacientes(): void {
    this.loading = true;
    this.backendService.getPacientes().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.pacientes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completo:', error);
        this.error = `Error al cargar los pacientes: ${error.message}`;
        this.loading = false;
      }
    });
  }

  getColorEstado(estado: string): string {
    switch(estado) {
      case 'ESTABLE': return 'text-green-500';
      case 'GRAVE': return 'text-yellow-500';
      case 'CRITICO': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  abrirDialogoNuevoPaciente() {
    this.mostrarDialogo = true;
  }

  cerrarDialogoNuevoPaciente() {
    this.mostrarDialogo = false;
  }

  agregarPaciente(pacienteData: any): void {
    console.log('Datos del paciente a enviar:', pacienteData);

    if (!pacienteData.nombre?.trim()) {
      console.error('El nombre del paciente es obligatorio');
      return;
    }

    if (!pacienteData.numeroHabitacion?.trim()) {
      console.error('El número de habitación es obligatorio');
      return;
    }

    // Asegurarse de que el estado está establecido
    const pacienteToSend = {
      ...pacienteData,
      estado: pacienteData.estado || 'HOSPITALIZADO'
    };

    this.backendService.agregarPaciente(pacienteToSend).subscribe({
      next: (pacienteCreado) => {
        console.log('Paciente creado exitosamente:', pacienteCreado);
        this.pacientes.push(pacienteCreado);
        this.mostrarDialogo = false;
        this.cargarPacientes(); // Recargar la lista de pacientes
      },
      error: (error) => {
        console.error('Error al agregar paciente:', error);
        // Aquí podrías agregar un manejo de errores más específico
        if (error.error?.message) {
          this.error = `Error: ${error.error.message}`;
        } else {
          this.error = 'Error al crear el paciente. Por favor, intente nuevamente.';
        }
      }
    });
  }

  editarPaciente(id: number): void {
    this.backendService.getPaciente(id).subscribe({
      next: (paciente) => {
        this.router.navigate([`/pacientes/editar/${id}`]);
      },
      error: (error) => {
        console.error('Error al obtener paciente:', error);
        this.error = 'Error al obtener los datos del paciente.';
      }
    });
  }

  verDetalles(id: number): void {
    this.router.navigate([`/pacientes/${id}`]);
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'ESTABLE': return 'stable';
      case 'CRITICO': return 'critical';
      case 'GRAVE': return 'grave';
      case 'HOSPITALIZADO': return 'hospitalized';
      default: return '';
    }
  }

  actualizarSignosVitales(pacienteId: number): void {
    this.backendService.getSignosVitales(pacienteId).subscribe({
      next: (signosVitales) => {
        const paciente = this.pacientes.find(p => p.id === pacienteId);
        if (paciente) {
          paciente.signosVitales = [signosVitales];
        }
      },
      error: (error) => {
        console.error('Error al actualizar signos vitales:', error);
        this.error = 'Error al actualizar los signos vitales.';
      }
    });
  }

  eliminarPaciente(id: number): void {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.backendService.eliminarPaciente(id).subscribe({
        next: () => {
          this.pacientes = this.pacientes.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar paciente:', error);
          this.error = 'Error al eliminar el paciente.';
        }
      });
    }
  }
}