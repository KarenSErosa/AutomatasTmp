export function handleKeydown(event: any) {
    if (event.key == 'Tab') {
      event.preventDefault();
      var start = event.target.selectionStart;
      var end = event.target.selectionEnd;
      event.target.value = event.target.value.substring(0, start) + '\t' + event.target.value.substring(end);
      event.target.selectionStart = event.target.selectionEnd = start + 1;
    } else if (event.key == '{') {
      agregarCaracterFinal(event, '{', '}', '\n', 1);
    } else if (event.key == "'") {
      agregarCaracterFinal(event, "'", "'", '', 1);
    } else if (event.key == '"') {
      agregarCaracterFinal(event, '"', '"', '', 1);
    } else if (event.key == '(') {
      agregarCaracterFinal(event, ' (', ') ', '  ', 3);
    } else if (event.key == '+') {
      agregarCaracterFinal(event, ' ', '+ ', '', 3);
    }
  }

  function agregarCaracterFinal(event: any, caracterInicio: string, caracterFinal: string, separador: string, newPos: number) {
    event.preventDefault();
    var start = event.target.selectionStart;
    var end = event.target.selectionEnd;
    event.target.value = event.target.value.substring(0, start) + caracterInicio + separador + caracterFinal + event.target.value.substring(end);
    event.target.selectionStart = event.target.selectionEnd = start + newPos;
  }