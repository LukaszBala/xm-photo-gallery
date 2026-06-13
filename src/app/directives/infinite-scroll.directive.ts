import { Directive, ElementRef, DestroyRef, inject, input, output, OnInit } from '@angular/core';

export interface IntersectionMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnInit {
  readonly intersectionMargin = input<IntersectionMargin>({});
  readonly intersectionChange = output<boolean>();

  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const { top = 0, right = 0, bottom = 0, left = 0 } = this.intersectionMargin();
    const observer = new IntersectionObserver(
      (entries) => {
        this.intersectionChange.emit(entries[0].isIntersecting);
      },
      { rootMargin: `${top}px ${right}px ${bottom}px ${left}px` },
    );

    observer.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
