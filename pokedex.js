
async function fetchPokeDex(id) {
const url = `https://pokeapi.co/api/v2/pokemon/${id}`
const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    return data;
}




const pokedex$$=document.querySelector('h1')

const pokemonPage$$ = document.querySelector(".container")

console.log(pokemonPage$$);

const paintPokemons = (mappedPokemons)=> {

    pokemonPage$$.innerHTML =''
    

    for (const pokemon of mappedPokemons) {
        
        const card$$ = document.createElement("div")
        card$$.classList.add("card")    //Card div                       
        pokemonPage$$.appendChild(card$$)
        
        const flipCardInner$$ =document.createElement("div")
        flipCardInner$$.classList.add("flipCardInner")
        card$$.appendChild(flipCardInner$$)

        const flipCardFront$$ =document.createElement("div")
        flipCardFront$$.classList.add("flipCardFront")
        flipCardInner$$.appendChild(flipCardFront$$)

        
        const flipCardBack$$ =document.createElement("div")
        flipCardBack$$.classList.add("flipCardBack")
        flipCardInner$$.appendChild(flipCardBack$$)

        const pokemonNum$$ = document.createElement("h3")
        pokemonNum$$.classList.add("pokemon-number")
        flipCardBack$$.appendChild(pokemonNum$$)
        pokemonNum$$.textContent=pokemon.pokemonNum
        
        const cardName$$ = document.createElement('h3')
        cardName$$.classList.add("card-title")
        flipCardBack$$.appendChild(cardName$$)
        cardName$$.textContent= pokemon.name

        const img$$ = document.createElement("img")
        img$$.classList.add("card-image")
        flipCardFront$$.appendChild(img$$)
        img$$.setAttribute("src", pokemon.image)

        const abilities$$ = document.createElement("p")
        abilities$$.classList.add("card-subtitle")
        flipCardBack$$.appendChild(abilities$$)
        abilities$$.textContent=pokemon.abilities.join(', ')


        const type$$ = document.createElement("p")
        type$$.classList.add("card-subtitle")
        flipCardBack$$.appendChild(type$$)
        type$$.textContent=pokemon.type

        if (pokemon.type.includes("fire")) {
            img$$.style.background = 'url("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2U3NWE2ZWQ3MjU2YzkyNjYwNTkzODcyZWIyZDFkNTY1MzMwYzU4NSZjdD1n/fiyQQLci4d1w6Njojo/giphy.gif")';
          } else if (pokemon.type.includes("grass") || pokemon.type.includes("bug") || pokemon.type.includes("ground")) {
            img$$.style.background = 'url("https://cutewallpaper.org/21/pokemon-grass-background/Pokemon-forest-by-BlazingIfrit-Fur-Affinity-dot-net.jpg")';
          } else if (pokemon.type.includes("electric")){
            img$$.style.background = 'url("https://media.giphy.com/media/azTii0LN5dOhjLHRrm/giphy.gif")';
          } else if (pokemon.type.includes("water")){
            img$$.style.background = 'url(https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTQzNzliY2VhYzJlNmQ2MWUyOWI2YjRjNmZmYzkzMzJmM2VjYTRiMiZjdD1n/7n1qnrzfg5pPa/giphy.gif)';
          } else {
             img$$.style.background = 'url(https://media.giphy.com/media/5HK4TiiBeLSZq/giphy.gif)';
          }
          


    }
}

async function fetchPokemon(){
    const totalPokemons = 150;
    const pokemons = [];
    for (let index = 1;index <= totalPokemons; index++) {
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
        type: pokemon.types.map((type) => type.type.name).join(', '),
        pokemonNum: pokemon.id,

    }))
}







const drawInput = (mappedPokemons) => { // creamos la funcion 
    const input$$ = document.querySelector('input');
    // const searchCardText$$ = document.querySelector('#search-card-text');

    // searchCardText$$.textContent = input$$.value ? `Buscando: ${input$$.value}` : 'Ingrese el nombre de un Pokémon para buscar';

    
    input$$.addEventListener("input", () => {
        // searchCardText$$.textContent = input$$.value ? `Buscando: ${input$$.value}` : 'Ingrese el nombre de un Pokémon para buscar';
        searchPokemons(input$$.value,mappedPokemons);
    });
};


const searchPokemons = (filter, pokemons) => {
    // console.log(pokemons);
    let filteredPokemon= pokemons.filter((pokemon)=>pokemon.name.toLowerCase().includes(filter.toLowerCase()))
// console.log(filteredPokemon);
    paintPokemons(filteredPokemon)

}


async function init() {
    const pokemons = await fetchPokemon();
    const mappedPokemons = mapPokemons(pokemons);
    // console.log(pokemons);
    paintPokemons(mappedPokemons);
    drawInput(mappedPokemons);


}

  init();


