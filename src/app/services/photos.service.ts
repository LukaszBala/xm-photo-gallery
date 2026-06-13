import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, of } from 'rxjs';
import { Photo } from '../models';
import { PhotosApi } from '../api';

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private readonly api = inject(PhotosApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _photos = signal<Photo[]>([]);
  private readonly _loading = signal(false);
  private readonly _currentPage = signal(0);
  private readonly _hasMore = signal(true);

  readonly photos = this._photos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();

  loadPhotos(): void {
    if (this._loading() || !this._hasMore()) {
      return;
    }

    const page = this._currentPage();
    this._loading.set(true);
    this.api
      .getPage(page)
      .pipe(
        tap(({ photos, hasMore }) => {
          this._photos.update((current) => [...current, ...photos]);
          this._currentPage.update((p) => p + 1);
          this._hasMore.set(hasMore);
          this._loading.set(false);
        }),
        catchError(() => {
          this._loading.set(false);
          return of(null);
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
