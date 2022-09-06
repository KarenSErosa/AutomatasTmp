import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { tokensList } from 'src/app/core/models/tokensList';
import {checkValue, getLexErrors, getLexTokens} from 'src/app/shared/components/console-text-area/tools/analisis_lexico'
import {programaFuente, getSinErrors, getSinMessage} from 'src/app/shared/components/console-text-area/tools/analisis_sintactico'

@Component({
  selector: 'app-console-text-area',
  templateUrl: './console-text-area.component.html',
  styleUrls: ['./console-text-area.component.css']
})
export class ConsoleTextAreaComponent implements OnInit {
  @Input() $data?: EventEmitter<string>;
  tokens: Array<tokensList> = [];

  constructor() { }

  ngOnInit(): void {
    this.$data?.subscribe(
      (data) => {
        this.tokens = checkValue(data);
        if(!this.getLexErrorsInfo()){
          programaFuente(this.tokens);
        }
      }
    )
  }

  // Obtenemos la información ( String ) para mostrar la información.

  getLexTokensInfo(){
    return getLexTokens();
  }

  getLexErrorsInfo(){
    return getLexErrors();
  }

  getSinErrorsInfo(){
    return getSinErrors();
  }

  getSinMessageInfo(){
    return getSinMessage();
  }
}