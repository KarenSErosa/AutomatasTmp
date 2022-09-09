import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { handleKeydown } from './tools/handleKey';
@Component({
  selector: 'app-code-text-area',
  templateUrl: './code-text-area.component.html',
  styleUrls: ['./code-text-area.component.css']
})
export class CodeTextAreaComponent implements OnInit {

  @Input() $data?: EventEmitter<string>;
  private line?: Number = 1;
  private lines?: Number = 1;

  form: FormGroup = new FormGroup({});
  private fileReader = new FileReader();
  private file: any;
  constructor() { }


  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl('', []),
      textArea: new FormControl('', []),
      lineCount: new FormControl('', [])
    });
    this.fileReader.onload = () => {
      const {textArea} = this.form.controls;
      const valueFromFile = (''+this.fileReader.result).replaceAll("\r\n", "\n");
      textArea.setValue(valueFromFile);
    }
    var codeEditor: any = document.getElementById('codeEditor');
    var lineCounter: any = document.getElementById('lineCounter');
    codeEditor.addEventListener('scroll', () => {
      lineCounter.scrollTop = codeEditor.scrollTop;
      lineCounter.scrollLeft = codeEditor.scrollLeft;
    });
    var lineCountCache = 0;
    function line_counter() {
      var lineCount = codeEditor.value.split('\n').length;
      var outarr = new Array();
      if (lineCountCache != lineCount) {
        for (var x = 0; x < lineCount; x++) {
          outarr[x] = (x + 1) + '.';
        }
        lineCounter.value = outarr.join('\n');
      }
      lineCountCache = lineCount;
    }
    codeEditor.addEventListener('input', () => {
      line_counter();
    });
    
  }

  fileChanged(e: any) {
    let file = e.target.files[0];
    this.fileReader.readAsText(file);
  }

  keyDown(event: any) {
    handleKeydown(event);
  }

  sendData() {
    const { textArea } = this.form.controls;
    if (this.$data) {
      this.$data.emit(textArea.value);
    }
  }


}