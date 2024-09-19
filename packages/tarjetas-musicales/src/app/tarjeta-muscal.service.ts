import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaMuscalService {
 // URL de los datos
 private jsonUrl = '/musicas.json';
 // Inyeccion de la dependecia HttpClient para protocolos http.
 private http = inject(HttpClient);
 
 // Metodo Get que consume jsonUrl
 public getDatos(): Observable<any[]> {
   return this.http.get<any[]>(this.jsonUrl);
 }
}
