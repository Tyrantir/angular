import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Anime } from '../../core/models/anime.model';
import { AnimeService } from '../../core/services/anime.service';

@Component({
  selector: 'app-detalhe',
  imports: [RouterLink],
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.css'
})
export class DetalheComponent {
  private readonly animeService = inject(AnimeService);

  // Bind do parâmetro de rota `:id` direto na input (withComponentInputBinding).
  readonly id = input.required({ transform: numberAttribute });

  readonly anime = signal<Anime | null>(null);
  readonly loading = signal(true);
  readonly erro = signal<string | null>(null);

  constructor() {
    queueMicrotask(() => this.carregar());
  }

  private carregar(): void {
    this.loading.set(true);
    this.erro.set(null);
    this.animeService.detalhes(this.id()).subscribe({
      next: (a) => {
        this.anime.set(a);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Anime não encontrado.');
        this.loading.set(false);
      }
    });
  }
}
