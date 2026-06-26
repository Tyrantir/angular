import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/busca/busca.component').then((m) => m.BuscaComponent)
  },
  {
    path: 'anime/:id',
    loadComponent: () =>
      import('./features/detalhe/detalhe.component').then((m) => m.DetalheComponent)
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./features/favoritos/favoritos.component').then((m) => m.FavoritosComponent)
  },
  { path: '**', redirectTo: '' }
];
