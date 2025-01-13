import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('jwt');
    if (!token) {
      return next.handle(req);
    }
    const req1 = req.clone({
       headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(req1);
  }
}
