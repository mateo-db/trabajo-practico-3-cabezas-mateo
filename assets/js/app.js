const urlApiGeneral = "https://thesimpsonsapi.com/api/characters"
const urlApiInd = "https://thesimpsonsapi.com/api/characters/"

let personajes = [];

const rowCards = document.querySelector("#rowPjSimpson")
const myModal = new bootstrap.Modal("#modalPjSimpson")
const titleModal = document.querySelector("#h1ModPjSimpson")



//hacemos una funcion asincronica (con async) para traer los personajes de la API (con fetch)
//se guarda el resultado del fetch (objeto response) en variable dataCrudaPj y luego en la variable de dataJson se guarda la promesa resuelta
//el "await" hace que se resuelva tanto la promesa que devuelve el fetch a la API como la del metodo JSON al body del objeto response
const traerPersonajes = async () => {
    try {
        const dataCrudaPj = await fetch(urlApiGeneral)
        const dataJson = await dataCrudaPj.json()

        return dataJson.results.slice(0, 11)
    } catch (error) {
        console.error(error)
    }

}

// const inApp = async () => {
//     const listRec = await traerPersonajes()

//     console.log(listRec)
// }

