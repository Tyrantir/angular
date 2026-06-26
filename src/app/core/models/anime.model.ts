/** Espelha o AnimeDTO do backend (Jikan). `nota` pode vir nula. */
export interface Anime {
  malId: number;
  titulo: string;
  sinopse: string;
  imagemUrl: string;
  nota: number | null;
}

/** Espelha a entity Favorito (tabela H2). */
export interface Favorito {
  id: number;
  malId: number;
  titulo: string;
  imagemUrl: string;
  nota: number | null;
}
