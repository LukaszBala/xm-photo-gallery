import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Photo } from '../../models';
import { FavoritesService } from '../../services';
import { FavoritesPageComponent } from './favorites';

function makePhoto(id: number): Photo {
  return { id, title: `Photo ${id}`, thumbnailUrl: '', fullUrl: '' };
}

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: { favorites: signal([]), loading: signal(false) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
    router = TestBed.inject(Router);
  });

  it('navigates to /photos/:id on onPhotoClick', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.componentInstance.onPhotoClick(makePhoto(5));
    expect(navigateSpy).toHaveBeenCalledWith(['/photos', 5]);
  });
});
