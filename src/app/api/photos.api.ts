import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Photo } from '../models/photo.model';
import { createPhoto } from '../utils/photo.utils';
import { apiDelay } from '../utils/delay.utils';
import { PHOTOS_PAGE_SIZE, PHOTOS_TOTAL } from '../const/photos';

export interface PhotosPage {
  photos: Photo[];
  hasMore: boolean;
}

@Injectable({ providedIn: 'root' })
export class PhotosApi {
  getPage(page: number): Observable<PhotosPage> {
    const start = page * PHOTOS_PAGE_SIZE;
    const ids = Array.from(
      { length: PHOTOS_PAGE_SIZE },
      (_, i) => start + i + 1,
    ).filter((id) => id <= PHOTOS_TOTAL);
    const photos = ids.map(createPhoto);

    return of({
      photos,
      hasMore: (page + 1) * PHOTOS_PAGE_SIZE < PHOTOS_TOTAL,
    }).pipe(delay(apiDelay()));
  }

  getById(id: number): Observable<Photo | undefined> {
    return of(createPhoto(id)).pipe(delay(apiDelay()));
  }
}
