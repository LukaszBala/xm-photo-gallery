import {
  Injectable,
  signal,
  computed,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, of } from 'rxjs';
import { Photo } from '../models/photo.model';
import { FavoritesApi } from '../api/favorites.api';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favoritesApi = inject(FavoritesApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _favorites = signal<Photo[]>([]);
  private readonly _loading = signal(false);

  readonly favorites = this._favorites.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly favoriteIds = computed(
    () => new Set(this._favorites().map((p) => p.id)),
  );

  loadFavorites(): void {
    if (this._loading()) {
      return;
    }

    this._loading.set(true);
    this.favoritesApi
      .getFavorites()
      .pipe(
        tap((photos) => {
          this._favorites.set(photos);
          this._loading.set(false);
        }),
        catchError(() => {
          this._loading.set(false);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  toggleFavorite(photo: Photo): void {
    this.isFavorite(photo.id)
      ? this.removeFromFavorites(photo.id)
      : this.addToFavorites(photo);
  }

  addToFavorites(photo: Photo): void {
    if (this.isFavorite(photo.id)) {
      return;
    }

    this._favorites.update((items) => [...items, photo]);
    this.favoritesApi.saveFavorites(this._favorites());
  }

  removeFromFavorites(id: number): void {
    if (!this.isFavorite(id)) {
      return;
    }

    this._favorites.update((items) => items.filter((p) => p.id !== id));
    this.favoritesApi.saveFavorites(this._favorites());
  }
}
