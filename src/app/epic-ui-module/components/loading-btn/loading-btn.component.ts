import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, Renderer2, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap, takeWhile, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-loading-btn',
  templateUrl: './loading-btn.component.html',
  styleUrls: ['./loading-btn.component.scss'],
})
export class LoadingBtnComponent implements OnInit, OnDestroy {

  isLoading$ = new BehaviorSubject<boolean>(false);

  @Input() btnText: string;
  @Input() disable: boolean;
  @Input() color: string = 'primary';
  @Output() stageChange: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<LoadingMouseEvent> = new EventEmitter();
  loadingIconColor: string;
  destroyed: boolean;
  isloadingSub: Subscription;
  constructor() { }

  ngOnInit() {
    this.isloadingSub = this.isLoading$.subscribe(e => {
      this.loadingIconColor = this.getRandomColor();
      this.stageChange.emit(e);
    });
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.isloadingSub) {
      this.isloadingSub.unsubscribe();
    }
  }
  setLoading(isloading: boolean) {
    const currentStage = this.isLoading$.getValue();
    if (currentStage !== isloading) {
      this.isLoading$.next(isloading);
    }
  }

  onWrapperClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disable) {
      const temp = (event as LoadingMouseEvent);
      temp.isLoading = this.isLoading$.getValue();
      temp.setObservable = this.setObservable.bind(this);
      this.click.emit(temp);
    }
  }
  setObservable(input: Observable<any>): Observable<any> {
    if (input != null) {
      this.isLoading$.next(true);
      input = input.pipe(
        tap(e => { this.isLoading$.next(false); }),
        catchError(error => {
          this.isLoading$.next(false);
          throw error;
        })
      );
    }
    return input;
  }
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color + '73';
  }
}

export class LoadingMouseEvent extends MouseEvent {
  isLoading?: boolean;
  setObservable: (e: Observable<any>) => Observable<any>;
}

