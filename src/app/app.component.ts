import { Component, OnInit } from '@angular/core';
import { timer, of } from 'rxjs';
import { LoadingMouseEvent } from './epic-ui-module/components/loading-btn/loading-btn.component';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'LoadingBtn';
  list: any[] = [];
  constructor() {

  }
  ngOnInit(): void {
    for (let i = 0; i < 3; i++) {
      this.list.push({
        btnText: 'hello ' + i.toString()
      });
    }
  }

  onStageChange(e) {
    console.log('is loading', e);
  }
  onClick(event: LoadingMouseEvent) {
    const temp = timer(2000);
    console.log('loading start');
    event.setObservable(temp).subscribe(e => {
      console.log('loading stop');
    }, error => {
      console.error(error);
      console.log('loading stop');
    });

  }
  divHandle(event) {
    console.log('catch by div', event.defaultPrevented, event.cancelBubble);
  }
}

