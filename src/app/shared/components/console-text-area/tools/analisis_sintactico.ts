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

function getLine(tokens: Array<tokensList>) {
    if (!tokens[indice]) {
        indice--;
    }
    const { linea } = tokens[indice];
    return linea;
}


function ProgramaFuente(tokens: Array<tokensList>) {
    Statements(tokens);
    if (bandera && indice == tokens.length) {
        message = 'Todo OK';
    } else {
        console.log(tokens)
        console.log(indice)
        if (!tokens[indice]) {
            indice--;
        }
        const { linea } = tokens[indice];
        addErrors("No se reconoce como una sentencia válida, ultimá validación: " + tokens[indice].token, linea, '\n', false);
    }
}


function Statements(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        if (evaluarTokens(tokens, indice, ['Comentario'])) {
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['class'])) {
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
        } else if (evaluarTokens(tokens, indice, ['const'])) {
            Desestruct(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['id'])) {
            Asignament(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['def'])) {
            Functions(tokens);
            Statements(tokens);
        } else if (evaluarTokens(tokens, indice, ['return'])) {
            Expression(tokens);
            Statements(tokens);
        }
    }
}

function Desestruct(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['{'])) {
        ParametersF(tokens);
        if (evaluarTokens(tokens, indice, ['}'])) {
            if (evaluarTokens(tokens, indice, ['='])) {
                Expression(tokens);
            } else {
                addErrors('Se esperaba un "="', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba una "}"', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba una "{"', linea, '\n', false);
    }
}

function Class(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['idClase'])) {
        if (evaluarTokens(tokens, indice, ['('])) {
            ParametersF(tokens);
            if (evaluarTokens(tokens, indice, [')'])) {
                if (evaluarTokens(tokens, indice, ['{'])) {
                    Statements(tokens);
                    if (!evaluarTokens(tokens, indice, ['}'])) {
                        addErrors('Se espesraba una "}"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se espesraba una "{"', linea, '\n', false);
                }
            } else {
                addErrors('Se esperaba un ")"', linea, '\n', false);
            }
        } else {
            addErrors('Se esperaba un "("', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba un "idClass"', linea, '\n', false);
    }
}

function For(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['('])) {
        if (evaluarTokens(tokens, indice, ['id'])) {
            if (evaluarTokens(tokens, indice, [':'])) {
                if (evaluarTokens(tokens, indice, ['id'])) {
                    if (evaluarTokens(tokens, indice, [')'])) {
                        if (evaluarTokens(tokens, indice, ['{'])) {
                            Statements(tokens);
                            if (!evaluarTokens(tokens, indice, ['}'])) {
                                addErrors('Se espesraba una "}"', linea, '\n', false);
                            }
                        } else {
                            addErrors('Se espesraba una "{"', linea, '\n', false);
                        }
                    } else {
                        addErrors('Se espesraba un ")"', linea, '\n', false);
                    }
                } else {
                    addErrors('Se espesraba una "id"', linea, '\n', false);
                }
            } else {
                addErrors('Se espesraban ":"', linea, '\n', false);
            }
        } else {
            addErrors('Se espesraba una "id"', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba una "("', linea, '\n', false);
    }
}

function Functions(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['id'])) {
        if (evaluarTokens(tokens, indice, ['('])) {
            ParametersF(tokens);
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
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['='])) {
        Expression(tokens);
    } else {
        addErrors('Se esperaba un =', linea, '\n', false);
    }
}

function While(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['('])) {
        Condition(tokens);
        if (evaluarTokens(tokens, indice, [')'])) {
            if (evaluarTokens(tokens, indice, ['{'])) {
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
        let linea = getLine(tokens);
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
    let linea = getLine(tokens);
    Expression(tokens);
    if (evaluarTokens(tokens, indice, ['OR'])) {
        Condition(tokens);
    }
}

function Expression(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['('])) {
        VBasic(tokens);
        ExpressionP(tokens);
        if (!evaluarTokens(tokens, indice, [')'])) {
            addErrors('Se esperaba un ")"', linea, '\n', false);
        }
        ExpressionP(tokens);
    } else {
        VBasic(tokens);
        ExpressionP(tokens);
    }
}

function ExpressionP(tokens: Array<tokensList>) {
    if (evaluarTokens(tokens, indice, ['OA'])) {
        Expression(tokens);
    }
}

function VBasic(tokens: Array<tokensList>) {
    //Obtenemos la línea del token a evaluar
    let linea = getLine(tokens);
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

function Else(tokens: Array<tokensList>) {
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['if'])) {
        If(tokens);
    } else if (evaluarTokens(tokens, indice, ['{'])) {
        Statements(tokens);
        if (!evaluarTokens(tokens, indice, ["}"])) {
            addErrors('Se esperaba una "}"', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba un if o una "{"', linea, '\n', false);
    }
}

function Print(tokens: Array<tokensList>) {
    //Obtenemos la línea del token a evaluar
    let linea = getLine(tokens);
    if (evaluarTokens(tokens, indice, ['('])) {
        Parameters(tokens);
        if (!evaluarTokens(tokens, indice, [')'])) {
            addErrors('Se esperaba un ")"', linea, '\n', false);
        }
    } else {
        addErrors('Se esperaba un "("', linea, '\n', false);
    }
}

function ParametersF(tokens: Array<tokensList>) {
    if (evaluarTokens(tokens, indice, ["id"])) {
        ParametersFP(tokens);
    }
}
function ParametersFP(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        if (evaluarTokens(tokens, indice, [","])) {
            ParametersFPP(tokens);
        }
    }
}
function ParametersFPP(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        let linea = getLine(tokens);
        if (evaluarTokens(tokens, indice, ["id"])) {
            ParametersFP(tokens);
        } else {
            addErrors('Se esperaba un valor válido despues de la ","', linea, '\n', false);
        }
    }
}

function Parameters(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        //Obtenemos la línea del token a evaluar
        let linea = getLine(tokens);
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
    if (indice < tokens.length) {
        if (evaluarTokens(tokens, indice, [","])) {
            ParametersPP(tokens);
        }
    }
}

function ParametersPP(tokens: Array<tokensList>) {
    if (indice < tokens.length) {
        let linea = getLine(tokens);
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

function evaluarTokens(tokens: Array<tokensList>, index: number, checkTokens: Array<string>): boolean {
    if (indice < tokens.length) {
        if (index + checkTokens.length <= tokens.length && bandera) {
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
    }
    return false;
}