let ersArr = [
    {
        //Comentarios
        'token': 'Comentario',
        'er': /^[#](.)*$/
    },
    {
        //Cadenas
        'token': 'Cadena',
        'er': /^((['](.)*['])|(["](.)*["]))$/
    },
    {
        'token': 'Parentesis que abre',
        'er': /^\($/
    },
    {
        'token': 'Parentesis que cierra',
        'er': /^\)$/
    },
    {
        'token': 'Llave que abre',
        'er': /^\{$/
    },
    {
        'token': 'Llave que cierra',
        'er': /^\}$/
    },
    {
        'token': 'Importar',
        'er': /^import$/
    },
    {
        'token': 'Clase',
        'er': /^class$/
    },
    {
        'token': 'Retornar',
        'er': /^return$/
    },
    {
        'token': 'Nulo',
        'er': /^null$/
    },
    {
        'token': 'Si',
        'er': /^if$/
    },
    {
        'token': 'Sino',
        'er': /^else$/
    },
    {
        'token': 'Mientras',
        'er': /^while$/
    },
    {
        'token': 'Repite',
        'er': /^for$/
    },
    {
        'token': 'Imprimir',
        'er': /^print$/
    },
    {
        'token': 'Verdadero',
        'er': /^true$/
    },
    {
        'token': 'OperadorLogico',
        'er': /^((==)|(<=?)|(>=?)|(!=))$/
    },
    {
        'token': 'OperadorAsignacion',
        'er': /^[=]$/
    },
    {
        'token': 'OperadorAritmeticos',
        'er': /^[\/|+|\-|*]$/
    },
    {
        //Clases
        'token': 'Clase',
        'er': /^([A-Z][\w]*)$/
    },
    {
        //Variables | Métodos
        'token': 'Variable',
        'er': /^([a-z][\w]*)$/
    },
    {
        //Números Enteros
        'token': 'Entero',
        'er': /^(([-+]\d|\d)\d*)$/
    },
    {
        //Números Dobles
        'token': 'Doble',
        'er': /^(([-+]\d|\d)\d*[.]\d+)$/
    }
];

let ignore = [
    ''
]

let tokens = '';
let errors = '';

export function checkValue(lines: string) {
    tokens = '';
    errors = '';
    if (lines.length > 0) {
        checkLines(lines.replaceAll('\t', '').split('\n'));
    }
}

export function getTokens(): string {
    return tokens;
}
export function getErrors(): string {
    return errors;
}

function checkLines(lines: Array<string>) {
    let bandera = true;
    for (let index in lines) {
        if (lines[index].length > 0) {
            if (!checkLine(lines[index], Number(index) + 1)) {
                bandera = false;
                break;
            }
        }
    }
}

function checkLine(line: string, indexLine: number) {
    let words: Array<string> = new Array();
    let iComment = line.indexOf('#');
    if (iComment > 0) {
        words = (line.substring(0, iComment).split(' '));
        words.push(line.substring(iComment, line.length));
    } else if (iComment == 0) {
        words.push(line);
    } else {
        words = line.split(' ');
    }
    return checkWords(words, indexLine);
}

function checkWords(words: Array<string>, indexLine: number) {
    for (const index in words) {
        let word = words[index];
        if (checkIgnore(word)) {
        } else if (!checkTokens(word, indexLine)) {
        }
    }
    return true;
}

function checkTokens(word: string, index: number) {
    for (const index in ersArr) {
        const { er, token } = ersArr[index];
        if (er.test(word)) {
            tokens += 'Token -> ' + token + "\n";
            tokens += 'Palabra -> ' + word + "\n\n";
            return true;
        }
    }
    errors += 'Línea: ' + index + '   < - >   Causa del Error -> ' + word + "\n";
    return false;
}

function checkIgnore(word: string) {
    for (const index in ignore) {
        if (ignore[index] == word) {
            return true;
        }
    }
    return false;
}