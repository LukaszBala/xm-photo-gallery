import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, tap, filter, catchError, of } from 'rxjs';
import { PhotosApi } from '../../api/photos.api';
import { FavoritesService } from '../../services/favorites.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photo-detail-page',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss',
})
export class PhotoDetailPageComponent {
  private readonly photosApi = inject(PhotosApi);
  private readonly favoritesService = inject(FavoritesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  private readonly photoId$ = this.route.paramMap.pipe(
    map((p) => parseInt(p.get('id') ?? '', 10)),
    filter((id) => !isNaN(id)),
  );

  readonly photoId = toSignal(this.photoId$);

  readonly photo = toSignal(
    this.photoId$.pipe(
      tap(() => {
        this.loading.set(true);
      }),
      switchMap((id) =>
        this.photosApi.getById(id).pipe(
          tap(() => {
            this.loading.set(false);
          }),
          catchError(() => {
            this.loading.set(false);
            return of(null);
          }),
        ),
      ),
    ),
  );

  isFavorite(): boolean {
    const id = this.photoId();
    return id != null ? this.favoritesService.isFavorite(id) : false;
  }

  removeFromFavorites(): void {
    const id = this.photoId();

    if (id != null) {
      this.favoritesService.removeFromFavorites(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/favorites']);
  }
}
