import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PhotosApi } from '../../api';
import { FavoritesService } from '../../services';
import { PhotoDetailPageComponent } from './photo-detail';

describe('PhotoDetailPageComponent', () => {
  let fixture: ComponentFixture<PhotoDetailPageComponent>;
  let favoritesServiceSpy: {
    isFavorite: ReturnType<typeof vi.fn>;
    removeFromFavorites: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    favoritesServiceSpy = {
      isFavorite: vi.fn().mockReturnValue(false),
      removeFromFavorites: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotoDetailPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '42' })),
          },
        },
        {
          provide: PhotosApi,
          useValue: { getById: vi.fn().mockReturnValue(of(undefined)) },
        },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailPageComponent);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('returns false from isFavorite when service says no', () => {
    favoritesServiceSpy.isFavorite.mockReturnValue(false);
    expect(fixture.componentInstance.isFavorite()).toBe(false);
  });

  it('returns true from isFavorite when service says yes', () => {
    favoritesServiceSpy.isFavorite.mockReturnValue(true);
    expect(fixture.componentInstance.isFavorite()).toBe(true);
  });

  it('calls removeFromFavorites with the current photoId', () => {
    fixture.componentInstance.removeFromFavorites();
    expect(favoritesServiceSpy.removeFromFavorites).toHaveBeenCalledWith(42);
  });

  it('does not call removeFromFavorites when photoId is undefined', () => {
    vi.spyOn(fixture.componentInstance, 'photoId').mockReturnValue(undefined);
    fixture.componentInstance.removeFromFavorites();
    expect(favoritesServiceSpy.removeFromFavorites).not.toHaveBeenCalled();
  });

  it('navigates to /favorites on goBack', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.componentInstance.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });
});
