import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Photo } from '../../models/photo.model';
import { PhotoGridComponent } from './photo-grid';

function makePhoto(id: number): Photo {
  return { id, title: `Photo ${id}`, thumbnailUrl: '', fullUrl: '' };
}

describe('PhotoGridComponent', () => {
  let fixture: ComponentFixture<PhotoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGridComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGridComponent);
  });

  it('renders a card for each photo', async () => {
    fixture.componentRef.setInput('photos', [
      makePhoto(1),
      makePhoto(2),
      makePhoto(3),
    ]);
    await fixture.whenStable();
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards).toHaveLength(3);
  });

  it('renders no cards when photos list is empty', async () => {
    fixture.componentRef.setInput('photos', []);
    await fixture.whenStable();
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards).toHaveLength(0);
  });

  it('shows spinner when loading is true', async () => {
    fixture.componentRef.setInput('photos', []);
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('hides spinner when loading is false', async () => {
    fixture.componentRef.setInput('photos', []);
    fixture.componentRef.setInput('loading', false);
    await fixture.whenStable();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeFalsy();
  });

  it('emits photoClick with the correct photo when a card is clicked', async () => {
    const photo = makePhoto(7);
    fixture.componentRef.setInput('photos', [photo]);
    await fixture.whenStable();

    const emitSpy = vi.spyOn(fixture.componentInstance.photoClick, 'emit');
    fixture.nativeElement.querySelector('mat-card').click();

    expect(emitSpy).toHaveBeenCalledWith(photo);
  });
});
