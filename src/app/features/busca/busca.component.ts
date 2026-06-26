import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';

import { Anime } from '../../core/models/anime.model';
import { AnimeService } from '../../core/services/anime.service';
import { FavoritoService } from '../../core/services/favorito.service';
import { AnimeCardComponent } from '../../shared/components/anime-card/anime-card.component';

@Component({
  selector: 'app-busca',
  imports: [ReactiveFormsModule, AnimeCardComponent],
  templateUrl: './busca.component.html',
  styleUrl: './busca.component.css'
})
export class BuscaComponent {
  private readonly animeService = inject(AnimeService);
  private readonly favoritoService = inject(FavoritoService);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly animes = signal<Anime[]>([]);
  readonly loading = signal(false);
  readonly erro = signal<string | null>(null);
  /** malIds já favoritados, para o coração do card. */
  readonly favoritos = signal<Set<number>>(new Set());

  constructor() {
    this.carregarFavoritos();

    // Busca reativa: debounce evita disparar a cada tecla; switchMap cancela a
    // requisição anterior. O backend exige `query` não-vazia, então filtramos.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        map((q) => q.trim()),
        distinctUntilChanged(),
        filter((q) => q.length >= 2),
        switchMap((query) => {
          this.loading.set(true);
          this.erro.set(null);
          return this.animeService.buscar(query).pipe(
            catchError(() => {
              this.erro.set('Falha ao buscar animes. Tente novamente.');
              return of<Anime[]>([]);
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe((lista) => {
        this.animes.set(lista);
        this.loading.set(false);
      });
  }

  onToggleFavorito(anime: Anime): void {
    const jaFavorito = this.favoritos().has(anime.malId);
    const req: Observable<unknown> = jaFavorito
      ? this.favoritoService.remover(anime.malId)
      : this.favoritoService.favoritar(anime.malId);

    req.subscribe({
      next: () =>
        this.favoritos.update((set) => {
          const novo = new Set(set);
          jaFavorito ? novo.delete(anime.malId) : novo.add(anime.malId);
          return novo;
        }),
      error: () => this.erro.set('Não foi possível atualizar os favoritos.')
    });
  }

  private carregarFavoritos(): void {
    this.favoritoService.listar().subscribe({
      next: (lista) => this.favoritos.set(new Set(lista.map((f) => f.malId)))
    });
  }
}
