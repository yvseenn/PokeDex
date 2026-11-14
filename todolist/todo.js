const STORAGE_KEY = "pokedex-todo-tasks";

//* Estado: lista de tareas { id, text, done }. Se guarda en localStorage.
const loadTasks = () => {
  try {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
};

let tasks = loadTasks();

const saveTasks = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Modo privado o almacenamiento bloqueado: la lista funciona igual, pero sin persistir
  }
};

const createElement = (tag, className, text) => {
  const el$$ = document.createElement(tag);
  if (className) el$$.className = className;
  if (text !== undefined) el$$.textContent = text;
  return el$$;
};

//* Estructura
const div$$ = createElement("div", "task-list-container");
document.querySelector(".container").appendChild(div$$);

const form$$ = createElement("form", "task-list-form");
const input$$ = createElement("input", "task-list-bar");
input$$.placeholder = "Añade una tarea y pulsa Enter...";
input$$.setAttribute("aria-label", "Nueva tarea");
input$$.maxLength = 200;
const btn$$ = createElement("button", "task-list-btn");
btn$$.type = "submit";
btn$$.setAttribute("aria-label", "Añadir tarea");
btn$$.innerHTML = '<span class="add-icon">+</span>';
form$$.append(btn$$, input$$);

const ul$$ = createElement("ul", "task-list");
const completed$$ = createElement("ul", "task-list completed");
const empty$$ = createElement("p", "task-list-empty", "No hay tareas todavía");

const clearBtn$$ = createElement("button", "clear-completed-btn", "Borrar completadas");
const clearAllBtn$$ = createElement("button", "clear-all-btn", "Borrar todas");

div$$.append(form$$, empty$$, ul$$, completed$$, clearBtn$$, clearAllBtn$$);

//* Pintado a partir del estado
const createTask = (task) => {
  const task$$ = createElement("li", "task-list-item");
  if (task.done) task$$.classList.add("task-list-item--completed");

  const text$$ = createElement("span", "task-text", task.text);

  const completeBtn$$ = createElement("button", "complete-task-btn");
  completeBtn$$.setAttribute("aria-label", task.done ? "Marcar como pendiente" : "Marcar como completada");
  completeBtn$$.innerHTML = `<span class="complete-icon">${task.done ? "↺" : "✓"}</span>`;
  completeBtn$$.addEventListener("click", () => updateTasks(tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))));

  const deleteBtn$$ = createElement("button", "delete-task-btn");
  deleteBtn$$.setAttribute("aria-label", "Borrar tarea");
  deleteBtn$$.innerHTML = '<span class="delete-icon">x</span>';
  deleteBtn$$.addEventListener("click", () => updateTasks(tasks.filter((t) => t.id !== task.id)));

  task$$.append(text$$, completeBtn$$, deleteBtn$$);
  return task$$;
};

const render = () => {
  ul$$.replaceChildren(...tasks.filter((t) => !t.done).map(createTask));
  completed$$.replaceChildren(...tasks.filter((t) => t.done).map(createTask));
  empty$$.hidden = tasks.length > 0;
  clearBtn$$.disabled = !tasks.some((t) => t.done);
  clearAllBtn$$.disabled = tasks.length === 0;
};

const updateTasks = (newTasks) => {
  tasks = newTasks;
  saveTasks();
  render();
};

//* Eventos
form$$.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input$$.value.trim();
  if (!text) return; // no añadimos tareas vacías
  updateTasks([...tasks, { id: Date.now(), text, done: false }]);
  input$$.value = "";
  input$$.focus();
});

clearBtn$$.addEventListener("click", () => updateTasks(tasks.filter((t) => !t.done)));

clearAllBtn$$.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres borrar todas las tareas?")) updateTasks([]);
});

render();
