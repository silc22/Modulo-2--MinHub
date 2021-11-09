let chamber = document.querySelector("#congress-table") ? "senate" : "house"
let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    headers:{
        "x-API-Key":"2A5GJoZrj3kUeWj1p9soa4B70XwrAW4OZQJjtdjb"
    }
}

fetch(endpoint, init)
    .then(res => res.json())
    .then(data =>{
        
const member = data.results[0].members
const cuerpoTabla = document.querySelector('#congress-table tbody')

// PINTAR TABLAS
// funcion para inyectar las api a las tablas
function inyectarTabla(members){
    
    cuerpoTabla.innerHTML = ""
    
    members.forEach(member => {
        let nombre = `${member.last_name}, ${member.first_name} ${(member.middle_name) ? member.middle_name : ""} `
    
        cuerpoTabla.innerHTML += `
            <tr>
            <td><a target="blank" href=${member.url}> ${nombre}</a></td>
            <td>${member.party}</td>
            <td>${member.state}</td>
            <td>${member.seniority}</td>
            <td>${member.votes_with_party_pct} &percnt;</td>
            </tr>
            `
    })

}

inyectarTabla(member)


// FILTRO POR PARTIDO
// funcion para no repetir los estados antes de incorporarlos al select
function noRepetirPais(array) {
    
    let arrayAux = []
    array.forEach(member => {
        if(!arrayAux.includes(member.state)){
            arrayAux.push(member.state)
        }
    })
    return arrayAux;
    
}

let estados = noRepetirPais(member).sort()

let states = document.querySelector("#select-states")

// funcion para rellenar el select con los estados 
function rellenarEstados() {
    estados.forEach(estado => {
    states.innerHTML += `
                        <option value="${estado}">
                        ${estado}
                        </option> 
                        `
    }) 
    
}
rellenarEstados(estados)


// Evento en Select
// escuchamos al SELECT ANTE UN CAMBPIO SE APLICA LA FUNCION ESTABLECIDA
states.addEventListener("change", filtrarStates)

// funcion para filtrar los estdos en el select

function filtrarStates() {
    // se define una variable vacia
    let estadosElegidos;
    
    // si el valor del select es distinto a "state" (valor por default) entonces le varible vacia tendra el valor del array de "members" filtrado, en donde el "state" de members (CH) va a ser igual al valor del select (los cuales ya se los dimos con anterioridad)
    if(states.value != "All"){
        estadosElegidos = member.filter(estado => estado.state == states.value)
    }else{
        // sino la tabla no cambiará y seguirá sin filtrarse. Aca cuando se llama a la api "member" ya esta filtrada y ordenada alfabeticamente. 
        estadosElegidos = member
    }

    // la varible estadosElegidos tomara el valor donde se filtrará por lo partidos que  incluyan los partidos (NO ENTIENDO)
    estadosElegidos = estadosElegidos.filter(estados => partidos.includes(estados.party))

    // entonces llamo a la funcion que imprime la tabla pero en vez de llamar a la tabla completa llamo a la variable que ya esta filtrada y paso por la condicion de if
    inyectarTabla(estadosElegidos)
}

// filtrar por checkbox
// se crea un array con elementos con el mismo id y name del input de los checkbox
let partidos = ['D','R','ID']

// tomar del html de los checkbox 
let tiposDePartidos = document.querySelectorAll("input[type='checkbox']")

// NODEList pasa a array para aplicarlo a la funcion 
let partidosArray = Array.from(tiposDePartidos)


// por cada elemento del array del checkbox le aplica el escuchador de eventos aplicando el change y se ejecutará el evento que sigue desde la linea 103 a 113.

partidosArray.forEach(check => {
    check.addEventListener('change', evento => {
        // el valor del evento la guardo en una variable
        let checkSeleccionado = evento.target.value;

        // al checkbox queda guardado en checkeado
        let checkeado = evento.target.checkbox;

        // SI, LOS PARTIDOS(ARRAY DE ARRIBA) ESTA INCLUIDO EL VALOR DEL CHECKBOX Y NO ESTA CHECKEADO EL CHECKBOX se le va pedir que al array de partidos sea filtrado y sea distinto a los valores del checkbox, sino que pushee al array de partidos los valores
        if(partidos.includes(checkSeleccionado) && !checkeado){
            partidos = partidos.filter(partido => partido != checkSeleccionado)
        }else{
            partidos.push(checkSeleccionado)
        }
        // por cada partido se aplica la funcion de filtrar los estados para unirlos
        filtrarStates()
    })
})
   

    })
    .catch(err => console.log(err.message))



