# Pokédex

Pokédex hecha con HTML, SCSS y JavaScript que muestra los primeros 300 pokémon usando la [PokeAPI](https://pokeapi.co/), más una pequeña lista de tareas.

## Funcionalidades

- Cartas que se giran (hover en escritorio, click/toque o Enter en móvil y teclado) con número, nombre, habilidades y tipos.
- Fondo animado según el tipo del pokémon.
- Buscador por **nombre**, **número** (`25` o `#025`) o **tipo** (`fire`, `water`...).
- Carga en paralelo por lotes con indicador de progreso y mensaje de error si falla la API.
- To-do list con tareas que se guardan en el navegador (`localStorage`), se pueden completar, deshacer y borrar.

## Uso

No hace falta instalar nada: abre `index.html` en el navegador (o usa una extensión tipo Live Server).

## Estilos

Los estilos se escriben en SCSS y se compilan a CSS:

```bash
npx sass --no-source-map style.scss style.css
npx sass --no-source-map todolist/todolistStyle.scss todolist/todolistStyle.css
```

## Estructura

```
index.html          Página principal
pokedex.js          Lógica de la Pokédex
style.scss          Entrada de estilos (blocks/ y reset/)
todolist/           Lista de tareas
```
