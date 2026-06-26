import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Favorito } from '../../core/models/anime.model';
import { FavoritoService } from '../../core/services/favorito.service';

@Component({
  selector: 'app-favoritos',
  imports: [RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {
  private readonly favoritoService = inject(FavoritoService);

  readonly favoritos = signal<Favorito[]>([]);
  readonly loading = signal(true);
  readonly erro = signal<string | null>(null);

  constructor() {
    this.favoritoService.listar().subscribe({
      next: (lista) => {
        this.favoritos.set(lista);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Falha ao carregar favoritos.');
        this.loading.set(false);
      }
    });
  }

  remover(fav: Favorito): void {
    // DELETE é por malId, não pelo id do banco.
    this.favoritoService.remover(fav.malId).subscribe(() => {
      this.favoritos.update((lista) => lista.filter((f) => f.malId !== fav.malId));
    });
  }
}
