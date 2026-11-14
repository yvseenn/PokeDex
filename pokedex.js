const API_URL = "https://pokeapi.co/api/v2/pokemon";
const TOTAL_POKEMONS = 300;
const BATCH_SIZE = 50; // peticiones en paralelo por lote, para no saturar la API

const TYPE_BACKGROUNDS = {
  fire: "fire",
  grass: "nature",
  bug: "nature",
  ground: "nature",
  electric: "electric",
  water: "water",
};

const container$$ = document.querySelector(".container");
const input$$ = document.querySelector(".search-bar");
const status$$ = document.querySelector(".status");

const setStatus = (message) => {
  status$$.textContent = message;
  status$$.hidden = !message;
};

//* Petición de un único pokémon
async function fetchPokemon(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar el pokémon ${id}`);
  return res.json();
}

//* Descarga todos los pokémon por lotes en paralelo (mucho más rápido que uno a uno)
async function fetchAllPokemons(total) {
  const pokemons = [];
  for (let start = 1; start <= total; start += BATCH_SIZE) {
    const ids = [];
    for (let id = start; id < start + BATCH_SIZE && id <= total; id++) ids.push(id);

    const results = await Promise.allSettled(ids.map(fetchPokemon));
    for (const result of results) {
      if (result.status === "fulfilled") pokemons.push(result.value);
      else console.warn(result.reason);
    }
    setStatus(`Cargando pokémon... ${Math.min(start + BATCH_SIZE - 1, total)}/${total}`);
  }
  return pokemons;
}

//* Nos quedamos sólo con los datos que necesitamos de la API
const mapPokemons = (pokemons) =>
  pokemons.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default,
    abilities: pokemon.abilities.map(({ ability }) => ability.name),
    types: pokemon.types.map(({ type }) => type.name),
  }));

const backgroundFor = (types) => {
  for (const type of types) {
    if (TYPE_BACKGROUNDS[type]) return TYPE_BACKGROUNDS[type];
  }
  return "default";
};

const createElement = (tag, className, text) => {
  const el$$ = document.createElement(tag);
  if (className) el$$.className = className;
  if (text !== undefined) el$$.textContent = text;
  return el$$;
};

//* Crea la carta (anverso con imagen, reverso con los datos)
const createCard = (pokemon) => {
  const card$$ = createElement("article", "card");
  card$$.tabIndex = 0;
  card$$.setAttribute("role", "button");
  card$$.setAttribute("aria-label", `${pokemon.name}, número ${pokemon.id}. Pulsa para girar la carta`);
  card$$.setAttribute("data-aos", "fade-down");

  const inner$$ = createElement("div", "flipCardInner");
  const front$$ = createElement("div", "flipCardFront");
  const back$$ = createElement("div", "flipCardBack");

  const img$$ = createElement("img", `card-image bg-${backgroundFor(pokemon.types)}`);
  img$$.src = pokemon.image;
  img$$.alt = pokemon.name;
  img$$.loading = "lazy";
  front$$.appendChild(img$$);

  back$$.append(
    createElement("h3", "pokemon-number", `#${String(pokemon.id).padStart(3, "0")}`),
    createElement("h3", "card-title", pokemon.name),
    createElement("p", "card-subtitle", pokemon.abilities.join(", ")),
    createElement("p", "card-subtitle", pokemon.types.join(", "))
  );

  inner$$.append(front$$, back$$);
  card$$.appendChild(inner$$);

  // En móvil no hay hover: permitimos girar la carta con click / teclado
  const flip = () => card$$.classList.toggle("is-flipped");
  card$$.addEventListener("click", flip);
  card$$.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  });

  return card$$;
};

//* Pinta todas las cartas una sola vez
const paintPokemons = (pokemons) => {
  const fragment = document.createDocumentFragment();
  const cards = pokemons.map((pokemon) => {
    const card$$ = createCard(pokemon);
    fragment.appendChild(card$$);
    return { pokemon, card$$ };
  });
  container$$.replaceChildren(fragment);
  return cards;
};

//* Filtro por nombre, número o tipo. En lugar de repintar, ocultamos/mostramos cartas.
const matches = (pokemon, query) =>
  !query ||
  pokemon.name.includes(query) ||
  String(pokemon.id) === query.replace(/^#0*/, "") ||
  pokemon.types.some((type) => type.includes(query));

const setupSearch = (cards) => {
  const search = () => {
    const query = input$$.value.trim().toLowerCase();
    let visible = 0;
    for (const { pokemon, card$$ } of cards) {
      const show = matches(pokemon, query);
      card$$.hidden = !show;
      if (show) visible++;
    }
    setStatus(visible ? "" : `No se ha encontrado ningún pokémon para "${input$$.value.trim()}"`);
    if (window.AOS) AOS.refresh();
  };

  let timeout;
  input$$.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(search, 150);
  });
};

async function init() {
  setStatus("Cargando pokémon...");
  try {
    const pokemons = mapPokemons(await fetchAllPokemons(TOTAL_POKEMONS));
    if (!pokemons.length) throw new Error("No se ha podido cargar ningún pokémon");

    const cards = paintPokemons(pokemons);
    setupSearch(cards);
    setStatus("");
    //* Animaciones de https://michalsnik.github.io/aos/
    if (window.AOS) AOS.init({ once: true });
  } catch (error) {
    console.error(error);
    setStatus("Ups... no se han podido cargar los pokémon. Recarga la página para intentarlo de nuevo.");
  }
}

init();
