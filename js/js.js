/**
 * Plataforma de gestión de entrenamientos
 * @author Javier Rodríguez Bueno 1ºDAW
 * @description Este programa hecho con JS y JQuery nos permite gestionar la información de unos clientes
 * así como guardar y visualizar información sobre sus entrenamientos.
 *
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
 * @param message
 */
const showWarning = (message) => {
    let warning = $(".warning")
    $(warning).text(message)
    $(warning).fadeIn()
    $(warning).delay(2000).fadeOut()

}

/**
 * Cambia la web entre los modos claro y oscuro
 * @param nightModeNumber
 */
const nightMode = nightModeNumber => {

    let everything = $("*")
    nightModeNumber % 2 !== 0 ? $(everything).addClass("noche") : $(everything).removeClass("noche")

}

/**
 * Muestra el menú del programa si se rellenan los campos de usuario y contraseña
 */
const showMainMenu = () => {

    if ( $("#username").val() !== "" && $("#password").val() !== "" ) {
        $("#iniciar-sesion").closest(".wrapper").hide()
        $("#form-entrenamiento").hide()
        $("main").show()
    } else showWarning("¡Todos los campos son obligatorios!")

}

/**
 * Muestra el tipo de récord seleccionado
 * @param message
 * @param popup
 */
const showRecords = (message, popup = $(".records-popup")) => {
    $(popup).text(message)
    $(popup).fadeIn()
    $(popup).delay(3000).fadeOut()
}

/**
 * Animacion de slide hacia la derecha de un mensaje al inicio del programa
 * @param greeting
 */
const greetingAnimation = (greeting = $(".bienvenida")) => {
    greeting.animate({"left": "35%"}, 6000)
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

const trainingInitialize = (trainingInfo, partner, temperature) => {
    let date = new Date()
    let duration = trainingInfo[0]
    let distance = trainingInfo[1]
    let rythm = obtainRythm(duration, distance)
    let difficulty = obtainTrainingDifficulty(rythm)
    date = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
    return {
        duration,
        distance,
        rythm,
        difficulty,
        date,
        partner,
        temperature
    }

}

/**
 * Calcula el ritmo de un entrenamiento basandose en su duración y la distancia recorrida
 * @param duration
 * @param distance
 * @returns {number}
 */
const obtainRythm = (duration, distance) => {

    return Math.round(duration / distance)

}

/**
 * Calcula el ritmo de un entrenamiento
 * @param rythm
 * @returns {string}
 */
const obtainTrainingDifficulty = (rythm) => {

    let difficulty;
    if (rythm >= 5) {
        difficulty = "Ritmo bajo"
    } else if (rythm > 3 && rythm < 4) {
        difficulty = "Ritmo medio"
    } else {
        difficulty = "Ritmo alto"
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
    $(trainingList).html("") //se vacía la lista de entrenamientos para que no se repita la informacion


    trainings.forEach(() => {

        /**
        Se añade un <li> con la informacion por cada entrenamiento del array trainings que se le pase.
         */
        $(trainingList).append($("<li><strong>Entrenamiento </strong> " + (i + 1) +
            " <strong> Duracion: </strong> " + trainings[i].duration + " min." +
            " <strong> Distancia: </strong> " + trainings[i].distance + "km " +
            " <strong> Ritmo: </strong> " + trainings[i].rythm + " m/s " +
            " <strong> Nivel: </strong> " + trainings[i].difficulty + " "+
            " <strong> Fecha: </strong> " + trainings[i].date +
            " <strong> Acompañante: </strong> " + trainings[i].partner +
            " <strong> Temperatura: </strong> " + trainings[i].temperature +
            "ºC </li>")
            .append($("<button>", {

                "text": "ELIMINAR",
                "id": i.toString()

            }).click(e => { //elimina por completo el entrenamiento al que hace referencia
                trainings.splice($(e.target).attr("id"), 1)
                $(e.target).closest("li").hide()

            })))
        i++;
    })

}
/**
 * Hace desaparecer la animación de loading cuando la página carga y otros elementos
 */
$(window).on('load', () => {

    $(".loader-page").delay(2000).fadeOut()
    $(".warning").hide()
    $(".lista-clientes").hide()
    $("main").hide()
    $(".records-popup").hide()
    $(".bocadillo").hide()

    greetingAnimation()

})

$(document).ready(() => {

    let clientsArray = [], //array con los clientes
        selectedClient = 0, //posición en clientsArray de el cliente seleccionado
        nightModeNumber = 1, //contador para el modo noche
        clientList = $(".lista-clientes"), // lista de clientes
        temperature

    /**
    Recoje la temperatura actual con ajax.
     */
    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?q=spain&appid=0ded9adb788b472da47a3612195a7209&units=metric',
        dataType: 'json'
    }).done( a => {
        temperature = a.main.temp
    })

    /**
     * Hace arrastrable el cuadradito negro de vienbenida
     */
    $(".bienvenida").draggable()

    /**
     * Usando AJAX accede a la API de star wars para mostrar acompañantes para salir a correr
     */
    $.ajax({
        type: 'GET',
        url: 'https://swapi.dev/api/people',
        dataType: 'json'
    }).done( a => {
        for (let i = 0; i < 20; i++) {
            $("#liebres").append($("<option>"+a.results[i].name+"</option>"))
        }
    })

    /**
     * Si el número del modo oscuro es par se activa, si es impar, se desactiva
     */
    $("#modonoche").click(() => nightMode(nightModeNumber++))

    /**
     * Muestra la lista de clientes
     */
    $("#ver-clientes").click(() => $(clientList).show())
    $("#nombre-cliente").click(() => $(clientList).show())
    /**
     * Esconde la lista de clientes
     */
    $(".cerrar").click(() => $(clientList).hide())

    /**
     * Guarda la sesión, y muestra la interfaz del programa
     */
    $("#iniciar-sesion").click(() => {
        showMainMenu()
    })

    /**
     * Muestra el bocadillo con el mensaje
     */
    $("h1").mouseover( ()  => {
        $(".bocadillo").fadeIn()
        $(".bocadillo").delay(2000).fadeOut()
    })

    /**
     * Cierra el mensaje con slide del principio del programa
     */
    $("#cerrar-bienvenida").click( () => {
        $(".bienvenida").hide()
    })

    /**
     * Se encarga de crear los nuevos clientes y añadirlos a la lista de clientes.
     */
    $("#submit-cliente").click(() => {

        let i = 0; // contador para dar ID a los clientes en la lista
        let clientInputs = $("#form-cliente label input"), //inputs del formulario de cliente
            clientInputsValue = clientInputs.map(element => {
                return clientInputs[element].value
            }) //nuevo array con todos los valores del cliente

        /**
         * 1. Vacía la lista de clientes para evitar redundancia de datos
         */
        $("#lista-clientes").html("")

        /**
         * 2. Se obtiene un objeto cliente provisinal, a la espera deque se valide su información
         * @type {{name: *, weight: *, email: *, age: *, height: *}}
         */
        let provisionalClient = clientInitialize(clientInputsValue)

        /**
         * 3. Se valida la información del cliente,
         *  - si no es correcta, muestra un POP de error.
         *  - si es correcta, añade el nuevo cliente a la lista
         *
         */
        validateClientInfo(provisionalClient) === true ?
            clientsArray.push(provisionalClient) && $("#form-entrenamiento").show() : showWarning()

        if (clientsArray.length === 1) {
            $("#nombre-cliente").text(clientsArray[selectedClient].name)
        }
        /**
         * 4. Se añade la información del nuevo cliente a la lista de clientes del programa.
         *
         * Le añade a cada uno un botón con un ID respectivo a su posición en el array de clientes, para
         * que se los pueda seleccionar haciendo clic.
         */
        clientsArray.forEach(element => {
            console.log("a")
            $("#lista-clientes").append($("<li>Nombre : " + element.name +
                "<br> E-mail : " + element.email +
                "<br> Altura : " + element.height +
                "<br> Peso : " + element.weight +
                "<br> Edad : " + element.age + " </li>").append($("<button>", {
                "text": " SELECCIONAR",
                "value": "paco",
                "id": i.toString()

            }).click(e => {
                /*
                 * Aquí es donde se selecciona el cliente, y se le pone un borde azul para indicar
                 * cual está seleccionado
                 * @type {jQuery|HTMLElement|*}
                 */
                let listaEntrenamientos = $("#lista-entrenamientos")
                selectedClient = $(e.target).attr("id")

                /*
                 * Se le quita el borde a todos los clientes, para que deje de estar resaltado alguno
                 * que se hubiera seleccionado anteriormente
                 */
                $("#lista-clientes li").each((index, elemento) => $(elemento).css("border", "none"))

                /*
                 * Se resalta el cliente seleccionado
                 */
                $(e.target).closest("li").css("border", "2px solid dodgerblue")

                /*
                 * Si el cliente seleccionado tiene entrenamientos, se mostrarán
                 */
                element.trainings.length !== 0 ?
                    showTrainings(element.trainings, $(listaEntrenamientos)) : $(listaEntrenamientos).html("")

                /*
                 * Se muestra el nombre del cliente seleccionado
                 */
                $("#nombre-cliente").text(clientsArray[selectedClient].name)
            })))
            i++
        })
    })

    /**
     * Filtra los clientes según lo que se escriba en una barra de búsqueda
     */
    $("#barra-buscar-clientes").keyup(e => {
        let textToSearch = $(e.currentTarget)
        textToSearch = textToSearch.val()

        /*
         * Si el nombre de algún cliente contiene el texto inrtoducido, se muestra, si no, desaparece
         */
        $("#lista-clientes li").each((index, elemento) => {
            if (clientsArray[index].name.indexOf(textToSearch) >= 0) {
                $(elemento).show()
            } else {
                $(elemento).hide()
            }
        })
    })

    /**
     * Se encarga de crear y validar los entrenamientos de cada cliente.
     */
    $("#submit-entrenamiento").click(() => {

        let trainingInputs = $("#form-entrenamiento input") //los inputs del form entrenamiento
        let trainingInputValues = trainingInputs.map(element => {
            return trainingInputs[element].value
        })
        let partnerValue = $("#liebres").val()
        /*
         * Si la información del nuevo entrenamiento es correcta, se añade a los entrenamientos del cliente.
         * Si no es correcta, muestra el POP UP de error
         */
        if ($("#duracion-input").val() !== "" && $("#distancia-input").val() !== "") {

            let provisionalTraining = trainingInitialize(trainingInputValues, partnerValue, temperature)
            clientsArray[selectedClient].trainings.push(provisionalTraining)
            showTrainings(clientsArray[selectedClient].trainings, $("#lista-entrenamientos"))

        } else showWarning("¡Todos los campos son obligatorios!")

    })

    /**
     * Dependiendo del record que queramos ver, te mostrará uno u otro en un POP UP que aparece y desaparece
     */
    $("#comprobar-record").click(() => {
        let trainings = clientsArray[selectedClient].trainings

        let durations = trainings.map(element => { return element.duration })
        let distances = trainings.map(element => { return element.distance })
        let rythms = trainings.map(element => { return element.rythm })

        let higestDuration = Math.max(...durations)
        let longestDistance = Math.max(...distances)
        let bestRythm = Math.max(...rythms)

        switch ($("#select-record").val()) {
            case "1":
                showRecords("Record de distancia: "+longestDistance +" KM")
                break
            case "2":
                showRecords("Entrenamiento mas largo: "+higestDuration + " min")
                break
            case "3":
                showRecords("El mejor ritmo fue: "+bestRythm + "KM/min")
                break;
            default:
                alert("no funciona esto")
                break;
        }


    })

})
