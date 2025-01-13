
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private msalService: MsalService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.msalService.instance.getActiveAccount() != null;
    
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}