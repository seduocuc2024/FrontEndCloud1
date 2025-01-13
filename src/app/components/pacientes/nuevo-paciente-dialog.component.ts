import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nuevo-paciente-dialog',
  templateUrl: './nuevo-paciente-dialog.component.html',
  styleUrls: ['./nuevo-paciente-dialog.component.css']
})
export class NuevoPacienteDialogComponent {
  @Input() open = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  paciente = {
    nombre: '',
    apellido: '',
    rut: '',
    fechaNacimiento: '',
    grupoSanguineo: 'O_POSITIVO',
    direccion: '',
    email: '',
    estado: '',
    alergias: '',
    antecedentes: '',
    telefono: '',
    edad: 0,
    numeroHabitacion: '',
    signosVitales: [{
      presionArterial: '',
      frecuenciaCardiaca: 0,
      temperatura: 0,
      saturacionOxigeno: 0
    }]
  };

  gruposSanguineos = [
    { valor: 'O_POSITIVO', etiqueta: 'O+' },
    { valor: 'O_NEGATIVO', etiqueta: 'O-' },
    { valor: 'A_POSITIVO', etiqueta: 'A+' },
    { valor: 'A_NEGATIVO', etiqueta: 'A-' },
    { valor: 'B_POSITIVO', etiqueta: 'B+' },
    { valor: 'B_NEGATIVO', etiqueta: 'B-' },
    { valor: 'AB_POSITIVO', etiqueta: 'AB+' },
    { valor: 'AB_NEGATIVO', etiqueta: 'AB-' }
  ];

  guardarPaciente() {
    // Formatear la fecha antes de enviar
    const pacienteFormateado = {
      ...this.paciente,
      fechaNacimiento: this.paciente.fechaNacimiento ? new Date(this.paciente.fechaNacimiento).toISOString() : null
      
    };

    this.onSubmit.emit(pacienteFormateado);
    this.resetForm();
  }

  resetForm() {
    this.paciente = {
      nombre: '',
      apellido: '',
      rut: '',
      fechaNacimiento: '',
      grupoSanguineo: 'O_POSITIVO',
      direccion: '',
      email: '',
      estado: 'HOSPITALIZADO',
      alergias: '',
      antecedentes: '',
      telefono: '',
      edad: 0,
      numeroHabitacion: '',
      signosVitales: [{
        presionArterial: '',
        frecuenciaCardiaca: 0,
        temperatura: 0,
        saturacionOxigeno: 0
      }]
    };
    this.onClose.emit();
  }

  // Validadores
  validarRut(event: any) {
    // Permitir solo números y K
    const input = event.target.value;
    const rutLimpio = input.replace(/[^0-9kK\-]/g, '');
    if (input !== rutLimpio) {
      event.target.value = rutLimpio;
    }
  }

  validarNumero(event: any) {
    // Permitir solo números
    const input = event.target.value;
    const numeroLimpio = input.replace(/[^0-9]/g, '');
    if (input !== numeroLimpio) {
      event.target.value = numeroLimpio;
    }
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  formatearTelefono(event: any) {
    // Formato: +56 9 XXXX XXXX
    let input = event.target.value.replace(/[^\d]/g, '');
    if (input.length > 11) input = input.slice(0, 11);
    
    if (input.length > 8) {
      input = `+${input.slice(0, 2)} ${input.slice(2, 3)} ${input.slice(3, 7)} ${input.slice(7)}`;
    }
    event.target.value = input;
  }
}