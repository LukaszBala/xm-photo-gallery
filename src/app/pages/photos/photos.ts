import { Component, inject, OnInit } from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid';
import { Photo } from '../../models/photo.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-photos-page',
  imports: [PhotoGridComponent, MatButtonModule],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class PhotosPageComponent implements OnInit {
  private readonly photosService = inject(PhotosService);

  readonly photos = this.photosService.photos;
  readonly loading = this.photosService.loading;
  readonly hasMore = this.photosService.hasMore;

  ngOnInit(): void {
    this.photosService.loadPhotos();
  }

  onPhotoClick(photo: Photo): void {
    // TODO:
  }

  loadMore(): void {
    this.photosService.loadPhotos();
  }
}
