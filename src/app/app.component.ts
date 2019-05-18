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
    for (let i = 0; i < 2; i++) {
      this.list.push({
        btnText: 'hello ' + i.toString(),
        template: 'template' + (i + 1)
      });
    }
  }

  onClick(event: LoadingMouseEvent) {
    const value = this.getRandomInt(1000, 4000);
    const temp = timer(value);
    console.log('loading start ' + value);
    event.setObservable(temp).subscribe(e => {
      console.log('loading stop');
    }, error => {
      console.error(error);
      console.log('loading stop');
    });

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
}

