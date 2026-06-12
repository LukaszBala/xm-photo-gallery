import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/photos/photos').then(m => m.PhotosPageComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites').then(m => m.FavoritesPageComponent),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./pages/photo-detail/photo-detail').then(m => m.PhotoDetailPageComponent),
  },
  { path: '**', redirectTo: '' },
];
