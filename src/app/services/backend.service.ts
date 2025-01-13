import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Environment } from '../environments/environment.interface';
import { Paciente, NuevoPaciente,SignosVitales } from '../models/paciente.interface';



@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getPacientes(): Observable<Paciente[]> {
    console.log('Calling:', `${this.apiUrl}/pacientes`);
    return this.http.get<Paciente[]>(`${this.apiUrl}/pacientes`);
  }

  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/pacientes/${id}`);
  }

  agregarPaciente(paciente: NuevoPaciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/pacientes`, paciente);
  }

  actualizarPaciente(id: number, paciente: NuevoPaciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/pacientes/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pacientes/${id}`);
  }

  getSignosVitales(pacienteId: number): Observable<SignosVitales> {
    return this.http.get<SignosVitales>(`${this.apiUrl}/pacientes/${pacienteId}/signosVitales`);
  }

}