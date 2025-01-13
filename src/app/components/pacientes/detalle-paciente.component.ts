// detalle-paciente.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Paciente } from 'src/app/models/paciente.interface';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-detalle-paciente',
  templateUrl: './detalle-paciente.component.html',
  styleUrls: ['./detalle-paciente.component.css']
})
export class DetallePacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService,
    private authService: MsalService
  ) { }

  ngOnInit(): void {
    this.cargarPaciente();
  }

  cargarPaciente(): void {
    this.loading = true;
    const id = this.route.snapshot.params['id'];
    
    this.backendService.getPaciente(id).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar paciente:', error);
        this.error = 'Error al cargar los datos del paciente';
        this.loading = false;
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
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  volverALista(): void {
    this.router.navigate(['/pacientes']);
  }
}