import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeTextAreaComponent } from './components/code-text-area/code-text-area.component';
import { ConsoleTextAreaComponent } from './components/console-text-area/console-text-area.component';



@NgModule({
  declarations: [
    CodeTextAreaComponent,
    ConsoleTextAreaComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CodeTextAreaComponent,
    ConsoleTextAreaComponent
  ]
})
export class SharedModule { }
