import { tokensList } from "src/app/core/models/tokensList";

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
        'token': ',',
        'er': /^,$/
    },
    {
        'token': '(',
        'er': /^\($/
    },
    {
        'token': ')',
        'er': /^\)$/
    },
    {
        'token': '{',
        'er': /^\{$/
    },
    {
        'token': '}',
        'er': /^\}$/
    },
    {
        'token': 'import',
        'er': /^import$/
    },
    {
        'token': 'class',
        'er': /^class$/
    },
    {
        'token': 'def',
        'er': /^def$/
    },
    {
        'token': 'return',
        'er': /^return$/
    },
    {
        'token': 'null',
        'er': /^null$/
    },
    {
        'token': 'if',
        'er': /^if$/
    },
    {
        'token': 'else',
        'er': /^else$/
    },
    {
        'token': 'while',
        'er': /^while$/
    },
    {
        'token': 'for',
        'er': /^for$/
    },
    {
        'token': 'print',
        'er': /^print$/
    },
    {
        'token': 'true',
        'er': /^true$/
    },
    {
        'token': 'OR',
        'er': /^((==)|(<=?)|(>=?)|(!=))$/
    },
    {
        'token': '=',
        'er': /^[=]$/
    },
    {
        'token': 'OA',
        'er': /^[\/|+|\-|*]$/
    },
    {
        //Clases
        'token': 'idClase',
        'er': /^([A-Z][\w]*)$/
    },
    {
        //Variables | Métodos
        'token': 'id',
        'er': /^([a-z][\w]*)$/
    },
    {
        //Números Enteros
        'token': 'int',
        'er': /^(([-+]\d|\d)\d*)$/
    },
    {
        //Números Dobles
        'token': 'double',
        'er': /^(([-+]\d|\d)\d*[.]\d+)$/
    }
];

let ignore = [
    ''
]

let tokens = '';
let errors = '';
let tokensList: Array<tokensList> = [];

export function checkValue(lines: string): Array<tokensList> {
    tokensList = [];
    tokens = '';
    errors = '';
    if (lines.length > 0) {
        checkLines(lines.replaceAll('\t', '').split('\n'));
    }
    return tokensList;
}

function getA(a:number, b:number):number{
    return a+b;
}

export function getLexTokens(): string {
    return tokens;
}
export function getLexErrors(): string {
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

function checkTokens(word: string, indexA: number) {
    for (const index in ersArr) {
        const { er, token } = ersArr[index];
        if (er.test(word)) {
            tokens += 'Palabra -> ' + word + "\n";
            tokens += 'Token -> ' + token + "\n\n";
            tokensList.push(
                {
                    'token': token,
                    'linea': Number(indexA)
                }
            );
            return true;
        }
    }
    errors += 'Línea: ' + indexA + '   < - >   Causa del Error -> ' + word + "\n";
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