import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaPublicaComponent } from './pagina-publica/pagina-publica.component';
import { PaginaPrivadaComponent } from './pagina-privada/pagina-privada.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { LoginComponent } from './components/login/login.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { NuevoPacienteDialogComponent } from './components/pacientes/nuevo-paciente-dialog.component';
import { FormsModule } from '@angular/forms';
import { AlertasComponent } from './components/alertas/alertas.component';
import { DetallePacienteComponent } from './components/pacientes/detalle-paciente.component';
import { CommonModule } from '@angular/common';


export function MSALFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '24fb90fc-c2e7-417c-a9ce-8fd19780b98e',
      redirectUri: 'http://localhost:4200',
      authority: 'https://login.microsoftonline.com/e1f62089-0981-4dfd-8a8d-4a7daeca9dda'
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    PaginaPublicaComponent,
    PaginaPrivadaComponent,
    LoginComponent,
    PacientesComponent,
    NuevoPacienteDialogComponent,
    DetallePacienteComponent,
    AlertasComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    HttpClientModule,
    FormsModule,
    CommonModule 
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALFactory
    },
    MsalService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }