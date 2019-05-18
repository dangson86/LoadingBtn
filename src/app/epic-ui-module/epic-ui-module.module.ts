import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBtnComponent } from './components/loading-btn/loading-btn.component';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [LoadingBtnComponent],
  exports: [
    LoadingBtnComponent
  ]
})
export class EpicUiModuleModule { }
