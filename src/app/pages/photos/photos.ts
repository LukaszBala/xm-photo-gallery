import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, Subject, tap } from 'rxjs';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';
import { PhotosService } from '../../services/photos.service';

@Component({
  selector: 'app-photos-page',
  imports: [PhotoGridComponent, InfiniteScrollDirective],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class PhotosPageComponent implements OnInit {
  private readonly photosService = inject(PhotosService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly photos = this.photosService.photos;
  readonly loading = this.photosService.loading;
  readonly hasMore = this.photosService.hasMore;

  private readonly intersection$ = new Subject<boolean>();
  private readonly loading$ = toObservable(this.photosService.loading);

  ngOnInit(): void {
    if (!this.photos().length) {
      this.photosService.loadPhotos();
    }

    combineLatest([this.intersection$.pipe(), this.loading$.pipe()])
      .pipe(
        debounceTime(100),
        tap(([intersecting, loading]) => {
          if (loading || !intersecting || !this.photosService.hasMore()) {
            return;
          }

          this.photosService.loadPhotos();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onPhotoClick(photo: Photo): void {
    this.favoritesService.addToFavorites(photo);
  }

  onIntersectionChange(intersecting: boolean): void {
    this.intersection$.next(intersecting);
  }
}
