import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Favorito } from '../models/anime.model';

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/favoritos`;

  listar(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.baseUrl);
  }

  /** POST /api/favoritos/{malId} — sem body; backend busca os dados na Jikan. 409 se duplicado. */
  favoritar(malId: number): Observable<Favorito> {
    return this.http.post<Favorito>(`${this.baseUrl}/${malId}`, null);
  }

  /** DELETE /api/favoritos/{malId} — remove por malId, não pelo id do banco. */
  remover(malId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${malId}`);
  }
}
