import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultBackendService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      
    })
  };
  
  public consumirBackend() {
    return this.http.get('http://localhost:8080/mensaje', this.httpOptions);
  }
}
