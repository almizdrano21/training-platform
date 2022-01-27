
const swapImage = (i) => {
    $(".diapositivas img").attr("src", "img/img" + i + ".jpg")
}
$(document).ready( () => {
    $(".galeria").hide()
    let i = 1;
    $(".next").click( () => {
        if (i < 4) {
            i++;
            swapImage(i)
        } else {
            i = 1;
            swapImage(i)
        }
    })

    $(".prev").click( () => {
        if (i > 1) {
            i--;
            swapImage(i)
        }
    })

    $("#cerrar-galeria").click( () => {
        $(".galeria").hide()
    })

    $("#galeria").click( () => {
        $(".galeria").show()
    })
})
