//*

const div$$ = document.createElement('div');
div$$.classList.add('task-list-container');
document.body.appendChild(div$$);

const btn$$ = document.createElement('button');
btn$$.classList.add('task-list-btn');
btn$$.innerHTML = '<span class="add-icon">+</span>';
div$$.appendChild(btn$$);

const input$$ = document.createElement('input');
input$$.classList.add('task-list-bar');
input$$.setAttribute('placeholder', 'Add a task and press Enter...');
div$$.appendChild(input$$);

const ul$$ = document.createElement('ul');
ul$$.classList.add('task-list');
div$$.appendChild(ul$$);

const completed$$ = document.createElement('ul');
completed$$.classList.add('task-list', 'completed');
div$$.appendChild(completed$$);

const clearBtn$$ = document.createElement('button');
clearBtn$$.classList.add('clear-completed-btn');
clearBtn$$.textContent = 'Clear Completed';
div$$.appendChild(clearBtn$$);

const clearAllBtn$$ = document.createElement('button');
clearAllBtn$$.classList.add('clear-all-btn');
clearAllBtn$$.textContent = 'Clear All';
div$$.appendChild(clearAllBtn$$);

btn$$.addEventListener('click', addTask);
input$$.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    addTask();
  }
});

function addTask() {
  const taskText = input$$.value.trim();
  if (taskText === '') {
    // Don't add empty tasks
    return;
  }

  const task$$ = document.createElement('li');
  task$$.textContent = taskText;
  task$$.classList.add('task-list-item');

  const deleteBtn$$ = document.createElement('button');
  deleteBtn$$.classList.add('delete-task-btn');
  deleteBtn$$.innerHTML = '<span class="delete-icon">x</span>';
  task$$.appendChild(deleteBtn$$);

  const completeBtn$$ = document.createElement('button');
  completeBtn$$.classList.add('complete-task-btn');
  completeBtn$$.innerHTML = '<span class="complete-icon">✓</span>';
  task$$.appendChild(completeBtn$$);

  ul$$.appendChild(task$$);
  input$$.value = ''; // clear the input field

  // Add animation class to task element
  setTimeout(() => {
    task$$.classList.add('task-list-item--show');
  }, 10);

  deleteBtn$$.addEventListener('click', function() {
    task$$.parentNode.removeChild(task$$);
  });

  completeBtn$$.addEventListener('click', function() {
    task$$.classList.add('task-list-item--completed');
    completed$$.appendChild(task$$);
  });
}

clearBtn$$.addEventListener('click', function() {
  const completedTasks$$ = completed$$.querySelectorAll('.task-list-item');
  completedTasks$$.forEach(function(task$$) {
    task$$.parentNode.removeChild(task$$);
  });
});

clearAllBtn$$.addEventListener('click', function() {
  const allTasks$$ = document.querySelectorAll('.task-list-item');
  allTasks$$.forEach(function(task$$) {
    task$$.parentNode.removeChild(task$$);
  });
  const completedTasks$$ = document.querySelectorAll('.completed .task-list-item');
  completedTasks$$.forEach(function(task$$) {
    task$$.parentNode.removeChild(task$$);
  });
});
