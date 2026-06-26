import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Anime } from '../models/anime.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/animes`;

  /** GET /api/animes/busca?query=&page= — retorna lista (sem paginação no backend). */
  buscar(query: string, page = 1): Observable<Anime[]> {
    const params = new HttpParams().set('query', query).set('page', page);
    return this.http.get<Anime[]>(`${this.baseUrl}/busca`, { params });
  }

  /** GET /api/animes/{malId} — detalhe (404 vira erro). */
  detalhes(malId: number): Observable<Anime> {
    return this.http.get<Anime>(`${this.baseUrl}/${malId}`);
  }
}
