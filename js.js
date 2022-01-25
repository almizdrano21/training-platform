/**
 * Plataforma de gestión de entrenamientos
 * @author Javier Rodríguez Bueno 1ºDAW
 * @description Este programa hecho con JS y JQuery nos permite gestionar la información de unos clientes
 * así como guardar y visualizar información sobre sus entrenamientos.
 *
 * TODO el slideshow de imagenes, aunque no se aun donde meterlo
 * TODO lo de que el login se guarde en el localStorage
 * TODO que el login furule
 */
////////////////////////////////////////////////////////////////////////////////////
////// FUNCIONES PARA LA INTERFAZ //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
/**
 * Comprueba que si un elemento no contiene ningun texto y devuelve true si esta vacío
 * @param elemento
 * @returns {boolean}
 */

const isEmpty = elemento => {
    return elemento === ""
}
/**
 * Hace aparecer y desaparecer un POPUP de "Todos los campos son obligatorios"
 * @param warning
 */
const showWarning = (warning = $(".warning")) => {
    $(warning).fadeIn()
    $(warning).delay(2000).fadeOut()
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
 * Comprueba si la información recibida de un cliente es válida
 * @param client
 * @returns {boolean}
 */
const validateClientInfo = (client) => {
    const regexNumero = /^[0-9]+$/
    const regexEmail = /^[^@]+@[^@]+\.[^@]+$/
    return regexNumero.test(client.height.toString()) &&
        regexNumero.test(client.weight.toString()) &&
        regexNumero.test(client.age.toString()) &&
        !isEmpty(client.name) &&
        !isEmpty(client.email) && regexEmail.test(client.email)
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
        difficulty = "Nivel Alto"
    } else if (rythm > 3 && rythm < 4) {
        difficulty = "Nivel medio"
    } else {
        difficulty = "Nivel bajo"
    }
    return difficulty
}

/**
 * Actualiza la lista de entrenamientos con los que tenga el cliente seleccionado
 * @param trainings
 * @param trainingList
 */
const showTrainings = (trainings, trainingList) => {
    let i = 0;
    $(trainingList).html("") //se vacía la lista de entrenamientos

    trainings.forEach(() => {

        /*
        Se añade un <li> con la informacion por cada entrenamiento del array trainings que se le pase.
         */
        $(trainingList)
            .append($("<li><strong>Entrenamiento </strong>" + (i + 1) +
                " <strong>Duracion: </strong>" + trainings[i].duration +
                " | <strong>Distancia: </strong>" + trainings[i].distance +
                " | <strong>Ritmo: </strong>" + trainings[i].rythm +
                " | <strong>Nivel: </strong>" + trainings[i].difficulty +
                " " +
                "</li>")
                .append($("<button>", {
                    "text": "ELIMINAR",
                    "id": i.toString()

                }).click(e => {
                    trainings.splice($(e.target).attr("id"), 1)
                    $(e.target).closest("li").hide()

                })))
        i++;

    })

}
const showClients = () => {

}

/*
 * Hace desaparecer la animación de loading cuando la página carga
 */
$(window).on('load', () => {
    $(".loader-page").css({visibility: "hidden", opacity: "0"})
    $(".warning").hide()
    $(".lista-clientes").hide()
})

$(document).ready(() => {

    let xd = 1;
    $("#modonoche").click(e => {
        let everything = $("*")
        xd % 2 !== 0 ? $(everything).addClass("noche") : $(everything).removeClass("noche")
        xd++
    })

    $("main").hide()
    let clientsArray = [],
        selectedClient = 0 //posición en clientsArray de el cliente seleccionado

    $("#iniciar-sesion").click(e => {
        let inputs = $(".inicio-sesion input")
        $("#iniciar-sesion").closest(".wrapper").hide()
        $("#form-entrenamiento").hide()
        $("main").show()

    })

    $("#submit-cliente").click(() => {

        let i = 0;
        let clientInputs = $("#form-cliente input")
        let clientInputsValue = clientInputs.map(element => {
            return clientInputs[element].value
        })


        $("#lista-clientes").html("") //vacía la lista de clientes para evitar redundancia

        let provisionalClient = clientInitialize(clientInputsValue)
        validateClientInfo(provisionalClient) === true ?
            clientsArray.push(provisionalClient) &&
            $("#form-entrenamiento").show() :
            showWarning()

        showClients()
        clientsArray.forEach(element => {
            $("#lista-clientes").append($("<li><strong>Nombre: </strong>" + element.name +
                " <strong>E-mail: </strong>" + element.email +
                " <strong>Altura: </strong>" + element.height +
                " <strong>Peso: </strong>" + element.weight +
                " <strong>Edad: </strong>" + element.age + " </li>").append($("<button>", {
                "text": " SELECCIONAR",
                "value": "paco",
                "id": i.toString()
            }).click(e => {
                let listaEntrenamientos = $("#lista-entrenamientos")
                selectedClient = $(e.target).attr("id")

                $("#lista-clientes li").each((index, elemento) => $(elemento).css("border", "none"))

                $(e.target).closest("li").css("border", "2px solid dodgerblue")

                element.trainings.length !== 0 ?
                    showTrainings(element.trainings, $(listaEntrenamientos)) : $(listaEntrenamientos).html("")
            })))
            i++
        })
    })

    $("#submit-entrenamiento").click(() => {
        let trainingInputs = $("#form-entrenamiento input") //los inputs del form entrenamiento
        let trainingInputValues = trainingInputs.map(element => { //los valores de los inputs de los entrenamientos
            return trainingInputs[element].value
        })

        let provisionalTraining = trainingInitialize(trainingInputValues) //inicialización del entrenamiento
        clientsArray[selectedClient].trainings.push(provisionalTraining) //subida del entrenamiento al array de entrenamientos del cliente sleeccionado

        if ($("#duracion-input").val() !== "" && $("#distancia-input").val() !== "") {
            showTrainings(clientsArray[selectedClient].trainings, $("#lista-entrenamientos"))
        } else {
            showWarning()
        }


    })

    /**
     * Filtra los clientes segun lo que se escriba en el input de buscar
     */
    $("#barra-buscar-clientes").keyup( e => {
        let textToSearch = $(e.currentTarget)
        textToSearch = textToSearch.val()

        $("#lista-clientes li").each((index, elemento) => {
            console.log(clientsArray[index])
           if (clientsArray[index].name.indexOf(textToSearch) >= 0 ) {
                $(elemento).show()
            } else {
                $(elemento).hide()
            }
        })
    })

    $("#ver-clientes").click(() => {
        $(".lista-clientes").show()
    })

})
