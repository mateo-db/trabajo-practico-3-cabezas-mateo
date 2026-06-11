const urlApiGeneral = "https://thesimpsonsapi.com/api/characters"
const urlApiInd = "https://thesimpsonsapi.com/api/characters/"

let personajes = []
//bandera logica que nos indicara si el usuario filtró por nombre o no haciendo una busqueda
//comienza al principio de la app, en limpio ya que no se ejecutó nada por ahora
let estaFiltrado = false

const rowCards = document.querySelector("#rowPjSimpson")
const myModal = new bootstrap.Modal("#modalPjSimpson")
const titleModal = document.querySelector("#h1ModPjSimpson")
const inputUser = document.querySelector("#inputBuscar")
const btnSearch = document.querySelector("#btnBuscar")



//hacemos una funcion asincronica (con async) para traer los personajes de la API (con fetch)
//se guarda el resultado del fetch (objeto response) en variable dataCrudaPj y luego en la variable de dataJson se guarda la promesa resuelta
//el "await" hace que se resuelva tanto la promesa que devuelve el fetch a la API como la del metodo JSON al body del objeto response
const traerPersonajes = async () => {
    try {
        const dataCrudaPj = await fetch(urlApiGeneral)
        const dataJson = await dataCrudaPj.json()
        return dataJson.results
    } catch (error) {
        console.error(error)
    }

}

//variable con funcion asincronica que guarda el resultado de "traerPersonajes" en el arreglo de personajes
const personajesCargados = async () => {
    personajes = await traerPersonajes()
    // console.log(personajes)
    cargarPersonajes(personajes)
}

// personajesCargados()
//se declara variable que utilizara una funcion con parametro generico para recorrer el arreglo que le pasemos y renderizar las cards
const cargarPersonajes = (array) => {
    //limpia los resultados anteriores antes de mostrar nuevos (sirve en el momento de ejecutar el buscador)
    rowCards.innerHTML = ""
    array.forEach((personaje) => {
        rowCards.innerHTML +=`
            <div class="col-2 mt-4 mb-4">
                <div class="card" style="width: 10rem;">
                    <img src="https://cdn.thesimpsonsapi.com/500${personaje.portrait_path}" class="card-img-top" style="height: 250px; object-fit: cover" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${personaje.name}</h5>
                        <h6 class="card-text">${personaje.occupation}</h6>
                        <h6 class="card-text">${personaje.status}</h6>
                        <a href="#" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalPjSimpson" data-id="${personaje.id}">Ver detalle</a>
                    </div>
                </div>
            </div>
        `
    })
}

personajesCargados()

//se declara variable que guarda función responsable de capturar
const filtrarPj = () => {
    //se guarda en nombreBuscado el valor del input del usuario (lo que escribió)
    //se utiliza metodo toLowerCase para evitar problemas con mayusculas
    const nombreBuscado = inputUser.value.toLowerCase()
    //estructura if de validacion, si el input del usuario es texto vacío se arroja una alerta, luego un return para detener la función y volver a su inicio
    //esta estructura verifica que el campo de texto no esté vacío la primera vez que se busca un nombre de personaje a filtrar del arreglo
    if (nombreBuscado === "") {
        //si el campo si está vacío, se delega la responsabilidad de decidir que hacer a la función limpiarResultados
        limpiarResultados()
        //si la función de limpiar tomó la decisión de limpiar los resultados, se detiene la función ahí con return
        return
    }
    
    //se filtra personajes por nombre buscado usando metodo filter y el resultado (un arreglo nuevo) se guarda en pjFiltrado
    const pjFiltrado = personajes.filter(personaje => personaje.name.toLowerCase().includes(nombreBuscado.toLowerCase()))
    
    //estructura if de validacion, si el arreglo en pjFiltrado está vacío (es decir, no se encontraron coincidencias entre los nombres de los personajes y el nombre buscado), se muestra un elemento de clase alert de bootstrap con el mensaje de error
    //sino, se prosigue con la carga del personaje filtrado correctamente
    if (pjFiltrado.length === 0) {
        rowCards.innerHTML =`
        <div class="alert alert-warning" role="alert">No se encontraron coincidencias</div>
        `
    } else {
        cargarPersonajes (pjFiltrado)
        //en el caso de que el campo de texto no haya sido vacío la primera vez y se haya encontrado una coincidencia entre personaje del arreglo y el nombre buscado correctamente, la bandera logica que nos indica si los resultados del arreglo están filtrados o no pasa de false a "true"
        estaFiltrado = true
    }

}

//se escucha al evento "click" que sucede en el botón de busqueda, cuando suceda se llama a la función filtrarPj
btnSearch.addEventListener("click", filtrarPj)

//funcion responsable de limpiar resultados en pantalla y volver a mostrar los 20 personajes
const limpiarResultados = () => {
    if (estaFiltrado === true) {
        //estructura if que evalua, si estaFiltrado es true (osea, si ya se filtró por nombre), se resetea nuestro innerHTML para que esté vacío y luego se vuelve a cargar el arreglo original con 20 personajes
        rowCards.innerHTML = ""
        cargarPersonajes(personajes)
        //apagamos la bandera logica estaFiltrado poniendola como false, para que así vuelva a su estado inicial (el usuario no filtró buscando por nombre)
        estaFiltrado = false
    } else {
        //en caso de que estaFiltrado no sea true, se tira un error con mensaje "campo vacío"
        alert("Error: campo vacío")
    }
}

//se declara variable que guardará funcion asincronica responsable de hacer fetch al API individual de los personajes, le pasaremos como parametro generico "id" lo cual lo hace reutilizable, es decir, cual fuera el valor o argumento que se tome, será el parametro "id"
const traerPjIndividual = async (id) => {
    // se envuelve en try catch, try para "intentar" el fetch y catch para atrapar errores si los hubiere
    try {
        //el fetch se hace entre backticks así ya que concatenamos la url con el id relacionado del personaje en cuestion, para que traiga la informacion detallada solo de ESE personaje en particular
        //el id lo estamos sacando del data-id=${personaje.id} que está en el botón "ver detalle" dentro del innerHTML
        const dataIndCruda = await fetch(`${urlApiInd}${id}`) //
        //esa respuesta de datos crudos lo pasamos a JSON así javascript puede trabajar con él
        const dataIndJson = await dataIndCruda.json()
        //luego hacemos return a lo que devuelva dataIndJson
        return dataIndJson
    } catch (error) {
        console.error("Error: falló fetch a la API")
    }
}

//nota: el nombre del parametro generico realmente no hace nada, en el sentido de que no está accediendo a un "id" ni llamandolo, cualquier nombre que le demos podrá guardar los mismos datos, solo que es mucho mas conveniente darle un nombre generico pero descriptivo de lo que pasaremos como argumento entre esos parametros

//se escucha evento en contenedor principal
rowCards.addEventListener("click", async (e) => {
    //se evalua si el objetivo del event object contiene una clase "btn-success"
    if (e.target.classList.contains('btn-success')) {
        //en caso positivo, se guarda el id del objetivo de ese event object en una variable
        const idPersonaje = e.target.dataset.id
        //se invoca a la funcion traerPjIndividual y se le pasa como argumento la variable que guarda el id del objetivo del event object
        const personajeSeleccionado = await traerPjIndividual(idPersonaje)

        // console.log("Detalles del PJ traido:", personajeSeleccionado)
        //se llama a la funcion responsable de crear y mostrar el modal dentro del evento para pasarle como argumento el personaje seleccionado
        mostrarModalPjInd(personajeSeleccionado)
    }
})

//variable que guardara la construccion del modal por personaje
const mostrarModalPjInd = (personaje) => {

    titleModal.textContent = personaje.name
    const bodyModal = document.querySelector("#bodyPjModal")
    
    bodyModal.innerHTML = `
        <div class="text-center">
            <img src="https://cdn.thesimpsonsapi.com/200${personaje.portrait_path}">
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Edad: ${personaje.age}</li>
            <li class="list-group-item">Fecha de Nacimiento: ${personaje.birthdate}</li>
            <li class="list-group-item">Genero: ${personaje.gender}</li>
            <li class="list-group-item">Ocupación: ${personaje.occupation}</li>
            <li class="list-group-item">Estado: ${personaje.status}</li>
            <li class="list-group-item">Frases: ${personaje.phrases}</li>
        </ul>

    
    `
}