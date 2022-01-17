/**
 * Plataforma de gestión de entrenamientos
 * @author Javier Rodríguez Bueno 1ºDAW
 * @description Este programa hecho con JS y JQuery nos permite gestionar la información de unos clientes
 * así como guardar y visualizar información sobre sus entrenamientos.
 *
 * TODO hacer el login
 * TODO que las ventanas no se muestren hasta haber creado un cliente/ entrenamiento
 * TODO hacer que las ventanas vayan apareciendo segun elijas las opciones
 * TODO hacer recuadritos para ir avisando de lo que hay que hacer y lo que no
 */
////////////////////////////////////////////////////////////////////////////////////
////// MÉTODOS GENERALES //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
/**
 * Comprueba si un elemento está vacío
 * @param elementToCheck
 * @returns {boolean}
 */
const itsEmpty = elementToCheck => {
    return elementToCheck === "";

}

/**
 * Cambia el background-color según:
 *  -true: rojo
 *  -false: blanco
 * @param element
 * @param empty
 */
const backgroundColor = (element, empty) => {
    /*
    NOTA PARA EL JAVIER DEL FUTURO -> en este caso, el element hay que seleccionarlo como con JQuery
    porque en su origen es un objeto JQuery, y como que no es lo mismo que un objeto normal.
     */
    empty ? $(element).css("background-color", "red") :
        $(element).css("background-color", "white")

}

/**
 * Comprueba que los elementos están vacíos y los pone de color rojo si lo están
 * @param inputsToHighlight
 */
const highlightEmptyFields = inputsToHighlight => {
    //"i" es el contador
    let boolean = true
    inputsToHighlight.each( (i) => {
        if (itsEmpty(inputsToHighlight[i].value)) {
            backgroundColor(inputsToHighlight[i], true)
            boolean = false;
        } else {
            backgroundColor(inputsToHighlight[i], false)
        }

    })
    return boolean;

}



//////////////////////////////////////////////////////////////////////////
//// MÉTODOS DEL CLIENTE ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
/**
 * Devuelve un objeto con información del nuevo cliente
 * @param clientInfo
 * @returns {{name: *, weight: *, email: *, age: *, height: *}}
 */
const clientInitialize = (clientInfo) => {
    return {
        name: clientInfo[0],
        email: clientInfo[1],
        height: clientInfo[2],
        weight: clientInfo[3],
        age: clientInfo[4],
        trainings: []
    }
}

/**
 * Comprueba en plan perrunero que todos los datos del cliente están en regla
 * @param clientInfo
 * @returns {boolean}
 */
const validateClientInfo = (clientInfo) => {
    const regexNumero = /^[0-9]+$/
    const regexEmail = /^[^@]+@[^@]+\.[^@]+$/
    return regexNumero.test(clientInfo.height.toString()) &&
        regexNumero.test(clientInfo.weight.toString()) &&
        regexNumero.test(clientInfo.age.toString()) &&
        !itsEmpty(clientInfo.name) &&
        !itsEmpty(clientInfo.email) && regexEmail.test(clientInfo.email);


}



///////////////////////////////////////////////////////////////////////
////// MÉTODOS DE LOS ENTRENAMIENTOS /////////////////////////////////
/////////////////////////////////////////////////////////////////////

const trainingInitialize = (trainingInfo) => {

    let duration = trainingInfo[0]
    let distance = trainingInfo[1]
    let rythm = obtainRythm(duration, distance)
    let difficulty = obtainTrainingDifficulty(rythm)
    return {
        duration,
        distance,
        rythm,
        difficulty
    }

}

const obtainRythm = (duration, distance) => {
    return distance / duration * 10
}
const obtainTrainingDifficulty = (rythm) => {
    let difficulty;
    if (rythm >= 4) {
        difficulty = "Ritmo Alto";
    } else if (rythm > 3 && rythm < 4) {
        difficulty = "Ritmo medio";
    } else {
        difficulty = "Ritmo bajo";
    }
    return difficulty

}








/**
 * Comienzo del programa con JQuery
 */
$(document).ready( () => {
    /*
    clientsArray -> array donde se guardan todos los clientes que se van creando
    selectedClient -> guarda un número equivalente al id del cliente seleccionado

    En JQuery y javascript moderno como que se supone que queda mejor declarar así las variables
    (o eso he leido por ahí)
     */
       let clientsArray = [],
           selectedClient

    /*
    Evento que comienza al hacer click en el botón de enviar, en el formulario para
    agregar clientes.
     */
    $("#submit-cliente").click( () => {
        let i = 0; //sirve de ID auto-incrementable para dar un identificador a los clientes
        let clientInputs = $("#form-cliente input") //elementos HTML input del formulario de cliente
        let clientInputsValue = clientInputs.map(element => {
            return clientInputs[element].value //arra que contiene la información de todos los inputs del formulario persona
        })

        highlightEmptyFields(clientInputs) //se comprueba si hay campos vacíos


        //clientsArray.push(clientInitialize(clientInputsValue)) //se añade el nuevo cliente al array clientes

        $("#lista-clientes").html("")//se vacía la lista para que los elementos no se repitan al mostrarse

        /*
        En esta variable se guarda una inicialización de un objeto cliente.
        Sin embargo, si no pasa la validación de su información, no se añade al array clientes,
        y por lo tanto, no aparecerá en la lista de clientes.
         */
        let provisionalClient = clientInitialize(clientInputsValue)
        if (validateClientInfo(provisionalClient) === true) {
            clientsArray.push(provisionalClient)

        }

        /*
        Por cada elemento del array clientes se añade a la lista el nombre del usuario y un botón
        para seleccionarlo, cada uno tiene un ID único para poder seleccionarlos

        NOTA PARA EL JAVIER DEL FUTURO -> Con esa movida to loca que se ve en el segundo append,
        puedes añadir elementos así a palo seco con el JQuery para
        ahorrar toda la parafernalia del createElement y to eso.
         */
        clientsArray.forEach( element => {
            $("#lista-clientes").append($("<li>"+element.name+"</li>").append($("<a>", {
                "href": "#",
                "text": " [SELECCIONAR]",
                "id": i.toString()
            }).click( e => {
                selectedClient = $(e.target).attr("id")
            })))
            i++;
        })

    })

    $("#submit-entrenamiento").click( () => {
        let trainingInputs = $("#form-entrenamiento input")
        let trainingInputValues = trainingInputs.map(element => {
            return trainingInputs[element].value
        })

        highlightEmptyFields(trainingInputs)

        let provisionalTraining = trainingInitialize(trainingInputValues)

        clientsArray[selectedClient].trainings.push(provisionalTraining);

    })

    $("#ver-entrenamientos").click( () => {
        let i = 0;
        let trainings = clientsArray[selectedClient].trainings

        $("#lista-entrenamientos").html("")

        trainings.forEach( element => {

            $("#lista-entrenamientos")
                .append($("<p>Entrenamiento "+(i+1)+"</p>")
                .append($("<a>", {
                    "href": "#",
                    "text": "[ELIMINAR]",
                    "id": i.toString()

                }).click( e => {
                    trainings.splice($(e.target).attr("id"), 1)
                    $(e.target).closest("p").hide()
                })))
            i++;

        })
    })



})
