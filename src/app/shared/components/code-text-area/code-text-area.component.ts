import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { handleKeydown } from './tools/handleKey';
import { addLineNumber, line_counter } from './tools/numberTextArea'
@Component({
  selector: 'app-code-text-area',
  templateUrl: './code-text-area.component.html',
  styleUrls: ['./code-text-area.component.css']
})
export class CodeTextAreaComponent implements OnInit {

  @Input() $data?: EventEmitter<string>;

  form: FormGroup = new FormGroup({});
  private fileReader = new FileReader();

  constructor() { }


  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl('', []),
      textArea: new FormControl('', []),
      lineCount: new FormControl('', [])
    });
    this.fileReader.onload = () => {
      const { textArea } = this.form.controls;
      const valueFromFile = ('' + this.fileReader.result).replaceAll("\r\n", "\n");
      textArea.setValue(valueFromFile);
      line_counter();
    }
    addLineNumber('lineCounter', 'codeEditor');

  }

  fileChanged(e: any) {
    let file = e.target.files[0];
    this.fileReader.readAsText(file);
  }

  keyDown(event: any) {
    handleKeydown(event);
    line_counter();
  }

  sendData() {
    const { textArea } = this.form.controls;
    if (this.$data) {
      this.$data.emit(textArea.value);
    }
  }


}