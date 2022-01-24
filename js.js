/**
 * Plataforma de gestión de entrenamientos
 * @author Javier Rodríguez Bueno 1ºDAW
 * @description Este programa hecho con JS y JQuery nos permite gestionar la información de unos clientes
 * así como guardar y visualizar información sobre sus entrenamientos.
 *
 * TODO el ritmo y el nivel del entrenamiento se tienen que calcular mejor
 * TODO el slideshow de imagenes, aunque no se aun donde meterlo
 * TODO lo de que el login se guarde en el localStorage
 * TODO que el login furule
 * TODO dar buen formato a la informacion que muestra el programa y a los comentarios
 */
////////////////////////////////////////////////////////////////////////////////////
////// FUNCIONES PARA LA INTERFAZ //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
/**
 * Comprueba que si un elemento no contiene ningun texto y devuelve true si esta vacío
 * @param elementToCheck
 * @returns {boolean}
 */

const itsEmpty = elementToCheck => {
    return elementToCheck === "";

}


//////////////////////////////////////////////////////////////////////////
//// FUNCIONES RELATIVAS A CLIENTES ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Recibe array con información del cliente y lo convierte en un objeto
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
 * Comprueba información cliente
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

/**
 * Recibe array con informacion de entrenamiento y la convierte en un objeto
 * @param trainingInfo
 * @returns {{duration: *, difficulty, distance: *, rythm: *}}
 */
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

/**
 * Calcula el ritmo de un entrenamiento basandose en su duración y la distancia recorrida
 * @param duration
 * @param distance
 * @returns {number}
 */
const obtainRythm = (duration, distance) => {
    return distance / duration * 10
}

/**
 * Calcula el ritmo de un entrenamiento
 * @param rythm
 * @returns {string}
 */
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
 * Actualiza la lista de entrenamientos con los que tenga el cliente seleccionado
 * @param trainings
 * @param listaEntrenamientos
 */
const mostrarEntrenamientos = (trainings, listaEntrenamientos) => {
    let i = 0;
    $(listaEntrenamientos).html("") //se vacía la lista de entrenamientos

    trainings.forEach( () => {

        /*
        Se añade un <li> con la informacion por cada entrenamiento del array trainings que se le pase.
         */
        $(listaEntrenamientos)
            .append($("<li>Entrenamiento "+(i+1)+
                " Duracion: "+trainings[i].duration+
                " | Distancia: "+trainings[i].distance+
                " | Ritmo: "+trainings[i].rythm+
                " | Nivel: "+trainings[i].difficulty+
                " "+
                "</li>")
                .append($("<button>", {
                    "text": "ELIMINAR",
                    "id": i.toString()

                }).click( e => {
                    trainings.splice($(e.target).attr("id"), 1)
                    $(e.target).closest("li").hide()

                })))
        i++;

    })

}


/**
 * Hace desaparecer la animación de loading cuando la página carga
 */
$(window).on('load', () => {
    $(".loader-page").css({visibility:"hidden",opacity:"0"})
    $(".warning").hide()
})

$(document).ready( () => {
    $("main").hide()
       let clientsArray = [],
           selectedClient //posición en clientsArray de el cliente seleccionado

   $("#iniciar-sesion").click( e => {
        let inputs = $(".inicio-sesion input")
        $("#iniciar-sesion").closest(".wrapper").hide()
        $("#form-entrenamiento").hide()
        $("<main>").show()

    })

    $("#submit-cliente").click( () => {

        let i = 0;
        let clientInputs = $("#form-cliente input")
        let clientInputsValue = clientInputs.map(element => {
            return clientInputs[element].value
        })

        $("#form-entrenamiento").show() //se muestra el formulario para crear entrenamientos

        $("#lista-clientes").html("") //vacía la lista de clientes para evitar redundancia

        let provisionalClient = clientInitialize(clientInputsValue)
        if (validateClientInfo(provisionalClient) === true) {
            clientsArray.push(provisionalClient)

        }

        clientsArray.forEach( element => {
            $("#lista-clientes").append($("<li>Nombre: "+element.name+
                " E-mail"+element.email+
                " Altura:"+element.height+
                " Peso: "+element.weight+
                " Edad"+element.age+" </li>").append($("<button>", {
                "text": " SELECCIONAR",
                "value": "paco",
                "id": i.toString()
            }).click( e => {
                let listaEntrenamientos = $("#lista-entrenamientos")
                selectedClient = $(e.target).attr("id")

                $("#lista-clientes li").each((index, elemento) => $(elemento).css("border", "none"))

                $(e.target).closest("li").css("border", "2px solid dodgerblue")

                element.trainings.length !== 0 ?
                    mostrarEntrenamientos(element.trainings, $(listaEntrenamientos)) : $(listaEntrenamientos).html("")


            })))
            i++;
        })
    })

    $("#submit-entrenamiento").click( () => {
        let trainingInputs = $("#form-entrenamiento input") //los inputs del form entrenamiento
        let trainingInputValues = trainingInputs.map(element => { //los valores de los inputs de los entrenamientos
            return trainingInputs[element].value
        })

        let provisionalTraining = trainingInitialize(trainingInputValues) //inicialización del entrenamiento
        clientsArray[selectedClient].trainings.push(provisionalTraining); //subida del entrenamiento al array de entrenamientos del cliente sleeccionado

        mostrarEntrenamientos(clientsArray[selectedClient].trainings, $("#lista-entrenamientos") )


    })

})
