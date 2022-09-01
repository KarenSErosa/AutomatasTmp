import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {checkValue, getErrors, getTokens} from 'src/app/shared/components/console-text-area/tools/analisis_lexico'
import {programaFuente} from 'src/app/shared/components/console-text-area/tools/analisis_sintactico'

@Component({
  selector: 'app-console-text-area',
  templateUrl: './console-text-area.component.html',
  styleUrls: ['./console-text-area.component.css']
})
export class ConsoleTextAreaComponent implements OnInit {
  @Input() $data?: EventEmitter<string>;

  constructor() { }

  ngOnInit(): void {
    this.$data?.subscribe(
      (data) => {
        checkValue(data);
        programaFuente([]);
      }
    )
  }

  getTokensInfo(){
    return getTokens();
  }

  getErrorsInfo(){
    return getErrors();
  }
}