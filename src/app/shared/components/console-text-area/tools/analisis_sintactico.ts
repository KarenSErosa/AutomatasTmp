export function programaFuente(tokens:Array<string>){
    tokens = 'while ( variable ocomparacion variable )'.split(' ');
    console.log(tokens);
    whileT(tokens, 0);
}

function whileT(tokens:Array<string>, index: number){
    if(tokens[index] == 'while'){
        if(tokens[++index] == '('){
            if(checkCondicion(tokens, ++index)){
                if(tokens[++index] == ')'){
                    console.log('ok2')
                }
            }
        }
    }
}

function checkCondicion(tokens:Array<string>, index: number){
    if(tokens[index] == 'variable'){
        if(tokens[++index] == 'ocomparacion'){
            if(tokens[++index] == 'variable'){
                return true;
            }
        }
    }
    return false;
}