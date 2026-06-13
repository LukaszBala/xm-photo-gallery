import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';
import { PhotosService } from '../../services/photos.service';
import { PhotosPageComponent } from './photos';

function makePhoto(id: number): Photo {
  return { id, title: `Photo ${id}`, thumbnailUrl: '', fullUrl: '' };
}

// jsdom does not implement IntersectionObserver, stub so the directive can instantiate
vi.stubGlobal('IntersectionObserver', function () {
  return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
});

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;
  let photosServiceSpy: {
    photos: ReturnType<typeof signal<Photo[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    hasMore: ReturnType<typeof signal<boolean>>;
    loadPhotos: ReturnType<typeof vi.fn>;
  };
  let favoritesServiceSpy: { addToFavorites: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    photosServiceSpy = {
      photos: signal([]),
      loading: signal(false),
      hasMore: signal(true),
      loadPhotos: vi.fn(),
    };
    favoritesServiceSpy = { addToFavorites: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [
        provideRouter([]),
        { provide: PhotosService, useValue: photosServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPageComponent);
  });

  it('calls loadPhotos on init when photos list is empty', async () => {
    photosServiceSpy.photos.set([]);
    await fixture.whenStable();
    expect(photosServiceSpy.loadPhotos).toHaveBeenCalledTimes(1);
  });

  it('does not call loadPhotos on init when photos are already loaded', async () => {
    photosServiceSpy.photos.set([makePhoto(1)]);
    fixture = TestBed.createComponent(PhotosPageComponent);
    await fixture.whenStable();
    expect(photosServiceSpy.loadPhotos).not.toHaveBeenCalled();
  });

  it('calls addToFavorites with the photo on onPhotoClick', () => {
    const photo = makePhoto(3);
    fixture.componentInstance.onPhotoClick(photo);
    expect(favoritesServiceSpy.addToFavorites).toHaveBeenCalledWith(photo);
  });
});
