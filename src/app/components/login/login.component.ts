import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private msalService: MsalService,
    private router: Router
  ) {}

  ngOnInit() {
    const account = this.msalService.instance.getActiveAccount();
    if (account) {
      // Recuperamos la URL guardada o vamos a página privada por defecto
      const redirectUrl = localStorage.getItem('redirectUrl') || '/pagina-privada';
      localStorage.removeItem('redirectUrl'); // Limpiamos la URL guardada
      this.router.navigate([redirectUrl]);
    }
  }

  usuarioEstaConectado(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  iniciarSesion(): void {
    this.msalService.loginPopup()
      .subscribe({
        next: (response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          
          this.msalService.acquireTokenSilent({ scopes: [] }).subscribe({
            next: (tokenResponse) => {
              localStorage.setItem('jwt', tokenResponse.idToken);
              this.router.navigate(['/pagina-privada']);
            }
          });
        }
      });
  }
  login() {
    this.msalService.loginRedirect();
  }

}