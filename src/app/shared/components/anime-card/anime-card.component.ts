import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Anime } from '../../../core/models/anime.model';

@Component({
  selector: 'app-anime-card',
  imports: [RouterLink],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.css'
})
export class AnimeCardComponent {
  readonly anime = input.required<Anime>();
  readonly favorito = input(false);
  readonly toggleFavorito = output<Anime>();

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggleFavorito.emit(this.anime());
  }
}
