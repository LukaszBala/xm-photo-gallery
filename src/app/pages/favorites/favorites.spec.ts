import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritesPageComponent } from './favorites';

function makePhoto(id: number): Photo {
  return { id, title: `Photo ${id}`, thumbnailUrl: '', fullUrl: '' };
}

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let favoritesServiceSpy: {
    favorites: ReturnType<typeof signal<Photo[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    loadFavorites: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    favoritesServiceSpy = {
      favorites: signal([]),
      loading: signal(false),
      loadFavorites: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [
        provideRouter([]),
        { provide: FavoritesService, useValue: favoritesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
    router = TestBed.inject(Router);
  });

  it('calls loadFavorites on init', async () => {
    await fixture.whenStable();
    expect(favoritesServiceSpy.loadFavorites).toHaveBeenCalledTimes(1);
  });

  it('navigates to /photos/:id on onPhotoClick', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.componentInstance.onPhotoClick(makePhoto(5));
    expect(navigateSpy).toHaveBeenCalledWith(['/photos', 5]);
  });
});
