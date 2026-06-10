const urlApiGeneral = "https://thesimpsonsapi.com/api/characters"
const urlApiInd = "https://thesimpsonsapi.com/api/characters/"

let personajes = [];

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
    if (nombreBuscado === "") {
        alert("Error: campo vacío")
        return
    }
    
    //se filtra personajes por nombre buscado usando metodo filter y el resultado (un arreglo nuevo) se guarda en pjFiltrado
    const pjFiltrado = personajes.filter(personaje => personaje.name.toLowerCase().includes(nombreBuscado.toLowerCase()))
    
    //estructura if de validacion, si el arreglo en pjFiltrado está vacío (es decir, no se encontraron coincidencias entre los personajes y lo buscado), se muestra un elemento de clase alert de bootstrap con el mensaje de error
    //sino, se prosigue con la carga del personaje filtrado correctamente
    if (pjFiltrado.length === 0) {
        rowCards.innerHTML =`
        <div class="alert alert-warning" role="alert">No se encontraron coincidencias</div>
        `
    } else {
        cargarPersonajes (pjFiltrado)
    }

}

//se escucha al evento "click" que sucede en el botón de busqueda, cuando suceda se llama a la función filtrarPj
btnSearch.addEventListener("click", filtrarPj)
