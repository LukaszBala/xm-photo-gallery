import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Photo } from '../models/photo.model';
import { createPhotos } from '../utils/photo.utils';
import { apiDelay } from '../utils/delay.utils';
import { FAVORITES_STORAGE_KEY } from '../const/favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  getFavorites(): Observable<Photo[]> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]');
    } catch {
      parsed = [];
    }

    const ids = Array.isArray(parsed)
      ? parsed.filter(
          (item): item is number =>
            typeof item === 'number' && Number.isFinite(item),
        )
      : [];

    return of(createPhotos(ids)).pipe(delay(apiDelay()));
  }

  saveFavorites(photos: Photo[]): void {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(photos.map((p) => p.id)),
    );
  }
}
