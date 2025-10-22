import { useEffect, useState } from "react"

function FormularioProducto( {agregar,pokemonEditando,editar,setPokemonEditando} ) {
    //Se agrega con useState el valor del número que ingresa el usuario:
    const [numero,setNumero] = useState("")
    const [titulo,setTitulo] = useState("")
    const [contenido,setContenido] = useState("")
    const [error, setError] = useState("")
    
    useEffect(() => {
        if(pokemonEditando){
            setNumero(pokemonEditando.numero)
            setTitulo(pokemonEditando.titulo)
            setContenido(pokemonEditando.contenido)
        }
    },[pokemonEditando])

    const handleSubmit = (event)=>{
        event.preventDefault()
        if(!numero || !titulo || !contenido){
            setError("Todos los campos deben tener información")
            return
        }
        setError("")
        
        if(pokemonEditando){
            editar( {...pokemonEditando,titulo,contenido} )
            setPokemonEditando(null)
        }else{
            //Se modifica el diccionario que se agrega, con número, título, contenido e imagen.
            //La imagen la estoy generando automaticamente con la dirección web que me entrega imagenes pero le doy el mismo ID que el usuario escribe:
            agregar( {numero,titulo,contenido,imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${numero}.png`} )
        }
        //Se limpian todos los campos, incluidos ahora el NUMERO dle pokemon
        setNumero("")
        setTitulo("")
        setContenido("")
    }

    return (
        <form className="mb-4" onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Se agrega un nuevo input para ingresar el NUMERO del pokemon y se le entrega valor */}
            <input className="form-control mb-2"
             type="number"
             placeholder="Ingrese número"
             value={numero}
             disabled={/*Se agrega validación para bloquear el campo del NUMERO cuando se edite el pokemon*/pokemonEditando ? "disabled": ""}
             onChange={(e)=> setNumero(e.target.value) } />
            
            <input className="form-control mb-2"
             type="text"
             placeholder="Ingrese título"
             value={titulo}
             onChange={(e)=> setTitulo(e.target.value) } />
            
            <input className="form-control mb-2"
             type="text"
             placeholder="Ingrese contenido"
             value={contenido}
             onChange={(e)=> setContenido(e.target.value) } />
            
            <button type="submit" className={pokemonEditando ? "btn btn-warning" : "btn btn-success"}>
                {pokemonEditando ? "Actualizar pokemon" : "Agregar pokemon"}
            </button>
        </form>
    )
}

export default FormularioProducto