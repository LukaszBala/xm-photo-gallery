import { Component, input, output } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [MatCardModule, MatRippleModule, MatProgressSpinnerModule],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGridComponent {
  photos = input.required<Photo[]>();
  loading = input<boolean>(false);
  photoClick = output<Photo>();

  onCardClick(photo: Photo): void {
    this.photoClick.emit(photo);
  }
}
