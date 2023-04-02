
async function fetchPokeDex(id) {
const url = `https://pokeapi.co/api/v2/pokemon/${id}`
const res = await fetch(url);
    const data = await res.json();
    return data;
}
const paintPokemons = (mappedPokemons)=> {
    
    const pokedex$$=document.createElement('h1')
    pokedex$$.classList.add("pokeDex");
    document.body.appendChild(pokedex$$)
    pokedex$$.textContent="Pokedex"

    const pokemonPage$$ = document.createElement("div")
    pokemonPage$$.classList.add("container")           
    document.body.appendChild(pokemonPage$$)
    pokemonPage$$.innerHTML =''
    
    for (const pokemon of mappedPokemons) {
        

        const card$$ = document.createElement("div")
        card$$.classList.add("card")                       
        pokemonPage$$.appendChild(card$$)

        const cardName$$ = document.createElement('p')
        cardName$$.classList.add("card-title")
        card$$.appendChild(cardName$$)
        cardName$$.textContent= pokemon.name

        const img$$ = document.createElement("img")
        img$$.classList.add("card-image")
        card$$.appendChild(img$$)
        img$$.setAttribute("src", pokemon.image)

        const abilities$$ = document.createElement("p")
        abilities$$.classList.add("card-subtitle")
        card$$.appendChild(abilities$$)
        abilities$$.textContent=pokemon.abilities.join(', ')

    }
}

async function fetchPokemon(){
    const totalPokemons = 150;
    const pokemons = [];
    for (let index = 1;index < totalPokemons; index++) {
        const pokemon = await fetchPokeDex(index);
        pokemons.push(pokemon);
}
return pokemons;
}



const mapPokemons = (pokemonsWithoutMapping) => { // mapping from main API
    return pokemonsWithoutMapping.map((pokemon)=>({
        name: pokemon.name,
        // order: pokemon.order,
        image: pokemon.sprites.front_default,
        abilities: pokemon.abilities.map((ability) => ability.ability.name),
        id: pokemon.id
    }))
}


const init = async () => {
    const pokemons = await fetchPokemon();
    const mappedPokemons = mapPokemons(pokemons);
    paintPokemons(mappedPokemons);
  }

  init();
  