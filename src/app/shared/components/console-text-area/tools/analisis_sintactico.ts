import { tokensList } from "src/app/core/models/tokensList";

let bandera: boolean;
let indice: number;
let errors: string = "";
let message: string = "";

export function programaFuente(tokens: Array<tokensList>) {
    bandera = true;
    indice = 0;
    errors = '';
    message = '';
    console.log(tokens);
    ProgramaFuente(tokens);
}

export function getSinErrors(): string {
    return errors;
}

export function getSinMessage(): string {
    return message;
}

function addErrors(message: string, line: number, finalString: string, b: boolean) {
    errors += `Línea - > ${line}, ${message}${finalString}`;
    bandera = b;
}


function ProgramaFuente(tokens: Array<tokensList>) {
    Statements(tokens);
    //Sentencias(tokens);
    if (bandera && indice == tokens.length) {
        message = 'Todo OK';
    } else {
        if (!tokens[indice]) {
            indice--;
        }
        const { linea } = tokens[indice];
        addErrors("No se reconoce como una sentencia válida, ultimá validación: " + tokens[indice].token, linea, '\n', false);
    }
}


function Statements(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        //Obtenemos la línea del token a evaluar
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['Comentario'])) {
            Statements(tokens);
        }else if (evaluarTokens(tokens, indice, ['class'])) {
            Class(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['print'])) {
            Print(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['if'])) {
            If(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['while'])) {
            While(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['for'])) {
            For(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['id'])) {
            Asignament(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['def'])) {
            Functions(tokens);
            Statements(tokens);
        }
    }
}

function Class(tokens:Array<tokensList>){
    const {linea} = tokens[indice];
     if(evaluarTokens(tokens, indice, ['idClase'])){
        if(evaluarTokens(tokens, indice, ['('])){
            Parameters(tokens);
            if(evaluarTokens(tokens, indice, [')'])){
                if(evaluarTokens(tokens, indice, ['{'])){
                    Statements(tokens);
                    if(!evaluarTokens(tokens, indice, ['}'])){
                        addErrors('Se espesraba una "}"', linea, '\n', false);
                    }
                }else{
                    addErrors('Se espesraba una "{"', linea, '\n', false);
                }
            }else{
                addErrors('Se esperaba un ")"', linea, '\n', false);
            }
        }else{
            addErrors('Se esperaba un "("', linea, '\n', false);
        }
     }else{
        addErrors('Se esperaba un "idClass"', linea, '\n', false);
     }
}

function For(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    if (evaluarTokens(tokens, indice, ['('])) {
        if(evaluarTokens(tokens, indice, ['id'])){
            if(evaluarTokens(tokens, indice, [':'])){
                if(evaluarTokens(tokens, indice, ['id'])){
                    if(evaluarTokens(tokens, indice, [')'])){
                        if(evaluarTokens(tokens, indice, ['{'])){
                            Statements(tokens);
                            if(!evaluarTokens(tokens, indice, ['}'])){
                                addErrors('Se espesraba una "}"', linea, '\n', false);
                            }
                        }else{
                            addErrors('Se espesraba una "{"', linea, '\n', false);
                        }
                    }else{
                        addErrors('Se espesraba un ")"', linea, '\n', false);
                    }
                }else{
                    addErrors('Se espesraba una "id"', linea, '\n', false);
                }
            }else{
                addErrors('Se espesraban ":"', linea, '\n', false);
            }
        }else{
            addErrors('Se espesraba una "id"', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba una "("', linea, '\n', false);
    }
}

function Functions(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    if (evaluarTokens(tokens, indice, ['id'])) {
        if (evaluarTokens(tokens, indice, ['('])) {
            Parameters(tokens);
            if (evaluarTokens(tokens, indice, [')'])) {
                if (evaluarTokens(tokens, indice, ['{'])) {
                    Statements(tokens);
                    if (!evaluarTokens(tokens, indice, ['}'])) {
                        addErrors('Se esperaba una "}"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se esperaba una "{"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba una ")"', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba una "("', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba un nombre válido', linea, '\n', false);
    }
}

function Asignament(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    if (evaluarTokens(tokens, indice, ['='])) {
        Expresion(tokens);
    }
}

function While(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    if (evaluarTokens(tokens, indice, ['('])) {
        Condition(tokens);
        if (evaluarTokens(tokens, indice, [')'])) {
            if (evaluarTokens(tokens, indice, ['{'])) {
                console.log('hOla')
                Statements(tokens);
                if (!evaluarTokens(tokens, indice, ["}"])) {
                    addErrors('Se esperaba una "}"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba una "{"', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba un ")"', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba un "("', linea, '\n', false);
    }
}

function If(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['('])) {
            Condition(tokens);
            if (evaluarTokens(tokens, indice, [')'])) {
                if (evaluarTokens(tokens, indice, ['{'])) {
                    Statements(tokens);
                    if (evaluarTokens(tokens, indice, ["}"])) {
                        if (evaluarTokens(tokens, indice, ['else'])) {
                            Else(tokens);
                        }
                    } else {
                        addErrors('Se esperaba una "}"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se esperaba una "{"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba un ")"', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba un "("', linea, '\n', false);
        }
    } else {
        addErrors('Instrucción incompleta', tokens[indice - 1].linea, '\n', false);
    }
}

function Condition(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    Expresion(tokens);
    if (evaluarTokens(tokens, indice, ['OR'])) {
        Condition(tokens);
    }
}

function Expresion(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    if (evaluarTokens(tokens, indice, ['('])) {
        VBasic(tokens);
        ExpresionP(tokens);
        if (!evaluarTokens(tokens, indice, [')'])) {
            addErrors('Se esperaba un ")"', linea, '\n', false);
        }
        ExpresionP(tokens);
    } else {
        VBasic(tokens);
        ExpresionP(tokens);
    }
}

function ExpresionP(tokens: Array<tokensList>) {
    const { linea } = tokens[indice];
    if (evaluarTokens(tokens, indice, ['OA'])) {
        Expresion(tokens);
    }
}

function VBasic(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        //Obtenemos la línea del token a evaluar
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ["int"])) {
        } else if (evaluarTokens(tokens, indice, ["double"])) {
        } else if (evaluarTokens(tokens, indice, ["id"])) {
            if (evaluarTokens(tokens, indice, ['('])) {
                Parameters(tokens);
                if (!evaluarTokens(tokens, indice, [')'])) {
                    addErrors('Se esperaba un )', indice, '\n', false);
                }
            }
        } else if (evaluarTokens(tokens, indice, ["Cadena"])) {
        } else if (evaluarTokens(tokens, indice, ['true'])) {
        } else if (evaluarTokens(tokens, indice, ['false'])) {
        } else {
            addErrors('Se esperaba una expresión válida', linea, '\n', false);
        }
    }
}

function Else(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['if'])) {
            If(tokens);
        } else if (evaluarTokens(tokens, indice, ['{'])) {
            Statements(tokens);
            if (!evaluarTokens(tokens, indice, ["}"])) {
                addErrors('Se esperaba una "}"', linea, '\n', false);
            }
        }
    }
}

function Print(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        //Obtenemos la línea del token a evaluar
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['('])) {
            Parameters(tokens);
            if (!evaluarTokens(tokens, indice, [')'])) {
                addErrors('Se esperaba un ")"', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba un "("', linea, '\n', false);
        }
    }
}

function Parameters(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        //Obtenemos la línea del token a evaluar
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ["int"])) {
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ["double"])) {
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ["id"])) {
            if (evaluarTokens(tokens, indice, ['('])) {
                Parameters(tokens);
                if (!evaluarTokens(tokens, indice, [')'])) {
                    addErrors('Se esperaba un )', 0, '\n', false);
                }
            }
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ["Cadena"])) {
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ['true'])) {
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ['false'])) {
            ParametersP(tokens);
        }
    }
}

function ParametersP(tokens: Array<tokensList>) {
    if (evaluarTokens(tokens, indice, [","])) {
        ParametersPP(tokens);
    }
}

function ParametersPP(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ["int"])) {
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ["double"])) {
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ["id"])) {
            if (evaluarTokens(tokens, indice, ['('])) {
                Parameters(tokens);
                if (!evaluarTokens(tokens, indice, [')'])) {
                    addErrors('Se esperaba un )', 0, '\n', false);
                }
            }
            ParametersP(tokens);
        } else if (evaluarTokens(tokens, indice, ["Cadena"])) {
            ParametersP(tokens);
        } else {
            addErrors('Se esperaba un valor válido despues de la ","', linea, '\n', false);
        }
    }
}

function Sentencias(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['Comentario'])) {
            Sentencias(tokens);
        } else if (evaluarTokens(tokens, indice, ['id'])) {
            if (evaluarTokens(tokens, indice, ['='])) {
                Dec_Var(tokens);
                Sentencias(tokens);
            } else {
                addErrors('Se esperaba una asignación "="', linea, '\n', false);
            }
        } else if (evaluarTokens(tokens, indice, ['def'])) {
            if (evaluarTokens(tokens, indice, ['id'])) {
                if (evaluarTokens(tokens, indice, ['('])) {
                    S3(tokens);
                    if (evaluarTokens(tokens, indice, [')'])) {
                        if (evaluarTokens(tokens, indice, ['{'])) {
                            Sentencias(tokens);
                            if (evaluarTokens(tokens, indice, ['}'])) {
                                Sentencias(tokens);
                            } else {
                                addErrors('Se esperaba un "}"', linea, '\n', false);
                            }
                        } else {
                            addErrors('Se esperaba un "{"', linea, '\n', false);
                        }
                    } else {
                        addErrors('Se esperaba un ")"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se esperaba un "("', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba un identificador a definir "nombreFuncion"', linea, '\n', false);
            }
        } else if (evaluarTokens(tokens, indice, ['while'])) {
            if (evaluarTokens(tokens, indice, ['('])) {
                Condicion(tokens);
                if (evaluarTokens(tokens, indice, [')'])) {
                    if (evaluarTokens(tokens, indice, ['{'])) {
                        Sentencias(tokens);
                        if (evaluarTokens(tokens, indice, ['}'])) {
                            Sentencias(tokens);
                        } else {
                            addErrors('Se esperaba un "}"', linea, '\n', false);
                        }
                    } else {
                        addErrors('Se esperaba un "{"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se esperaba un ")"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba un "("', linea, '\n', false);
            }
        } else if (evaluarTokens(tokens, indice, ['print'])) {
            if (evaluarTokens(tokens, indice, ['('])) {
                if (evaluarTokens(tokens, indice, ['Cadena'])) {
                    Cadena(tokens);
                } else {
                    Dec_Var(tokens);
                }
                if (evaluarTokens(tokens, indice, [')'])) {
                    Sentencias(tokens);
                } else {
                    addErrors('Se esperaba un ")"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba un "("', linea, '\n', false);
            }
        } else if (evaluarTokens(tokens, indice, ['return'])) {
            Dec_Var(tokens);
            Sentencias(tokens);
        } else if (evaluarTokens(tokens, indice, ['if'])) {
            SI(tokens);
        } else {
            //Vacio
        }
    }
}

function Asignacion(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['='])) {
            Dec_Var(tokens);
            Sentencias(tokens);
        } else {
            addErrors('Se esperaba una asignación "="', linea, '\n', false);
        }
    }
}

function SI(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        const { linea } = tokens[indice];
        if (evaluarTokens(tokens, indice, ['('])) {
            Condicion(tokens);
            if (evaluarTokens(tokens, indice, [')'])) {
                if (evaluarTokens(tokens, indice, ['{'])) {
                    Sentencias(tokens);
                    if (evaluarTokens(tokens, indice, ["}"])) {
                        S2(tokens);
                        Sentencias(tokens);
                    } else {
                        addErrors('Se esperaba una "}"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se esperaba una "{"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba un ")"', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba un "("', linea, '\n', false);
        }
    }
}

function S2(tokens: Array<tokensList>) {
    if (evaluarTokens(tokens, indice, ['else'])) {
        S4(tokens);
    } else {
        //Vacio
    }
}

function S4(tokens: Array<tokensList>) {
    if (evaluarTokens(tokens, indice, ['{'])) {
        Sentencias(tokens);
        if (evaluarTokens(tokens, indice, ["}"])) {
            Sentencias(tokens);
        } else {
            errors += 'Se esperaba un }';
            bandera = false;
        }
    } else if (evaluarTokens(tokens, indice, ['if'])) {
        SI(tokens);
    } else {
        bandera = false;
    }
}

function Condicion(tokens: Array<tokensList>) {
    if (evaluarTokens(tokens, indice, ["true"])) {
    } else if (evaluarTokens(tokens, indice, ["false"])) {
    } else {
        Cond(tokens);
        S5(tokens);
    }
}

function S5(tokens: Array<tokensList>) {
    console.log('S5', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["OL"])) {
        Cond(tokens);
        S5(tokens);
    } else {
        console.log("Vacio", tokens[indice]);
    }
}

function Cond(tokens: Array<tokensList>) {
    console.log('Cond', tokens[indice]);
    S1(tokens);
    if (evaluarTokens(tokens, indice, ["OR"])) {
        S6(tokens);
    } else {
        console.log("Error, se esperaba OperadorRelacional", tokens[indice]);
        bandera = false;
    }
}

function S1(tokens: Array<tokensList>) {
    console.log('S1', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["id"])) {
    } else if (evaluarTokens(tokens, indice, ["int"])) {
    } else if (evaluarTokens(tokens, indice, ["double"])) {
    } else {
        Exp(tokens);
    }
}
function S6(tokens: Array<tokensList>) {
    console.log('S6', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["true"])) {
    } else if (evaluarTokens(tokens, indice, ["false"])) {
    } else {
        Exp(tokens);
    }
}

function Exp(tokens: Array<tokensList>) {
    console.log('Exp', tokens[indice]);
    if (indice < tokens.length) {
        if (evaluarTokens(tokens, indice, ["("])) {
            S1(tokens);
            ExpP(tokens);
            if (evaluarTokens(tokens, indice, [")"])) {
            } else {
                console.log("Error, se esperaba }", tokens[indice]);
                bandera = false;
            }
        } else {
            S1(tokens);
            ExpP(tokens);
        }
    }
}

function ExpP(tokens: Array<tokensList>) {
    console.log('ExpP', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["OA"])) {
        Exp(tokens);
    } else {

    }
}

function Dec_Var(tokens: Array<tokensList>) {
    console.log('Dec_Var', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["Cadena"])) {
        Cadena(tokens);
    } else if (evaluarTokens(tokens, indice, ["id", "("])) {
        S1P(tokens);
        if (evaluarTokens(tokens, indice, [")"])) {
        } else {
            console.log('Se esperaba ), tokens[indice]')
            bandera = false;
        }
    } else if (evaluarTokens(tokens, indice, ["false"])) {
    } else if (evaluarTokens(tokens, indice, ["true"])) {
    } else {
        Exp(tokens);
    }
}

function S1P(tokens: Array<tokensList>) {
    console.log('S1P', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["int"])) {
        S1PP(tokens);
    } else if (evaluarTokens(tokens, indice, ["double"])) {
        S1PP(tokens);
    } else if (evaluarTokens(tokens, indice, ["id"])) {
        S1PP(tokens);
    } else if (evaluarTokens(tokens, indice, ["Cadena"])) {
        S1PP(tokens);
    } else {
        console.log("Vacio", tokens[indice]);
    }
}

function S1PP(tokens: Array<tokensList>) {
    console.log('S1PP', tokens[indice]);
    if (evaluarTokens(tokens, indice, [","])) {
        S1PPP(tokens);
    } else {
        console.log("Vacio", tokens[indice]);
    }
}

function S1PPP(tokens: Array<tokensList>) {
    console.log('S1PPP', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["int"])) {
        S1PP(tokens);
    } else if (evaluarTokens(tokens, indice, ["double"])) {
        S1PP(tokens);
    } else if (evaluarTokens(tokens, indice, ["id"])) {
        S1PP(tokens);
    } else if (evaluarTokens(tokens, indice, ["Cadena"])) {
        S1PP(tokens);
    } else {
        console.log("Error, se esperaba ValorEntero, ValorReal o NombreVariable", tokens[indice]);
        bandera = false;
    }
}

function Cadena(tokens: Array<tokensList>) {
    console.log('Cadena', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["OA", "Cadena"])) {
        Cadena(tokens);
    } else {
        console.log('Vacio', tokens[indice]);
    }
}

function S3(tokens: Array<tokensList>) {
    console.log('S3', tokens[indice]);
    if (evaluarTokens(tokens, indice, ["id"])) {
        Parametros(tokens);
    } else {
        console.log("Vacio", tokens[indice]);
    }
}

function Parametros(tokens: Array<tokensList>) {
    console.log('Parametros', tokens[indice]);
    if (evaluarTokens(tokens, indice, [",", "id"])) {
        Parametros(tokens);
    } else {
        console.log("Vacio", tokens[indice]);
    }
}

function evaluarTokens(tokens: Array<tokensList>, index: number, checkTokens: Array<string>): boolean {
    if (index + checkTokens.length <= tokens.length && bandera) {
        const indiceOriginal: number = index;
        for (const indexToken in checkTokens) {
            const { token } = tokens[index++];
            const checktoken = checkTokens[indexToken];
            if (!(token == checktoken)) {
                return false;
            }
        }
        indice = index;
        return true;
    }
    return false;
}