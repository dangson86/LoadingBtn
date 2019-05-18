import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, Renderer2, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, fromEvent } from 'rxjs';
import { tap, takeWhile, catchError, debounce, debounceTime, throttleTime } from 'rxjs/operators';
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
  @Input() template: string = 'template1';
  @Output() stageChange: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<LoadingMouseEvent> = new EventEmitter();
  loadingIconColor: string;
  destroyed: boolean;
  isloadingSub: Subscription;
  myClass: boolean;
  @ViewChild('btnWrapper') private btnWrapper: ElementRef;
  private _throttleTime = 1000;//take input every 1s, prevent duplicate click
  constructor() { }

  ngOnInit() {
    fromEvent(this.btnWrapper.nativeElement, 'click')
      .pipe(
        tap((event: MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
        }),
        throttleTime(this._throttleTime)//take input every 1s, prevent duplicate click
      )
      .subscribe((event: MouseEvent) => {
        if (!this.disable) {
          const temp = (event as LoadingMouseEvent);
          temp.isLoading = this.isLoading$.getValue();
          temp.setObservable = this.setObservable.bind(this);
          this.click.emit(temp);
        }
      });
    this.isloadingSub = this.isLoading$.subscribe(loading => {
      this.loadingIconColor = this.getRandomColor();
      this.stageChange.emit(loading);
      this.myClass = loading;
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
  toggleclass() {
    this.myClass = !this.myClass;
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

