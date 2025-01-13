import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaPublicaComponent } from './pagina-publica/pagina-publica.component';
import { PaginaPrivadaComponent } from './pagina-privada/pagina-privada.component';
import { MsalGuard } from './msal.guard';
import { LoginComponent } from './components/login/login.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { AlertasComponent } from './components/alertas/alertas.component';
import { DetallePacienteComponent } from './components/pacientes/detalle-paciente.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'pagina-publica', component: PaginaPublicaComponent },
  { path: 'pagina-privada', component: PaginaPrivadaComponent, canActivate: [MsalGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'pacientes', component:PacientesComponent, canActivate:[MsalGuard]},
  { path: 'alertas', component: AlertasComponent, canActivate:[MsalGuard]},
  { path: 'pacientes/:id', component: DetallePacienteComponent, canActivate:[MsalGuard]}, // Corregido aquí
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
