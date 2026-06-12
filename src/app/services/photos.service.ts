import { Injectable, signal, inject } from '@angular/core';
import { tap } from 'rxjs';
import { Photo } from '../models/photo.model';
import { PhotosApi } from '../api/photos.api';

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private readonly api = inject(PhotosApi);

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
      )
      .subscribe();
  }

  getPhotoById(id: number): Photo | undefined {
    return this._photos().find((p) => p.id === id);
  }
}
