import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsalGuard implements CanActivate {
  
  constructor(
    private authService: MsalService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificamos si hay una cuenta activa en MSAL
    const account = this.authService.instance.getAllAccounts()[0];
    
    if (account) {
      // Si hay una cuenta, la establecemos como activa
      this.authService.instance.setActiveAccount(account);
      return true;
    }
    
    // Si no hay cuenta, guardamos la URL y redirigimos al login
    localStorage.setItem('redirectUrl', state.url);
    this.router.navigate(['/login']);
    return false;
  }
}