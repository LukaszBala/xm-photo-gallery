import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services';
import { PhotoGridComponent } from '../../components';
import { Photo } from '../../models';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoGridComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesPageComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  readonly favorites = this.favoritesService.favorites;
  readonly loading = this.favoritesService.loading;

  onPhotoClick(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
