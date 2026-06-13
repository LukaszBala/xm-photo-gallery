import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Photo } from '../models/photo.model';
import { createPhoto } from '../utils/photo.utils';

export interface PhotosPage {
  photos: Photo[];
  hasMore: boolean;
}

const PAGE_SIZE = 12;
const TOTAL_PHOTOS = 500;

@Injectable({ providedIn: 'root' })
export class PhotosApi {
  getPage(page: number): Observable<PhotosPage> {
    const start = page * PAGE_SIZE;
    const ids = Array.from(
      { length: PAGE_SIZE },
      (_, i) => start + i + 1,
    ).filter((id) => id <= TOTAL_PHOTOS);
    const photos = ids.map(createPhoto);

    return of({ photos, hasMore: (page + 1) * PAGE_SIZE < TOTAL_PHOTOS }).pipe(
      delay(200 + Math.random() * 100),
    );
  }

  getById(id: number): Observable<Photo | undefined> {
    return of(createPhoto(id)).pipe(delay(200 + Math.random() * 100));
  }
}
