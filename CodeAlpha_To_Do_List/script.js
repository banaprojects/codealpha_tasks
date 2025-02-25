class Task {
    constructor(id, text, completed = false, priority = 'medium') {
      this.id = id;
      this.text = text;
      this.completed = completed;
      this.priority = priority;
    }
  }
  
  class TodoList {
    constructor() {
      this.tasks = [];
      this.currentFilter = 'all';
      this.loadFromLocalStorage();
    }
    
    addTask(text) {
      const id = Date.now().toString();
      const newTask = new Task(id, text);
      this.tasks.push(newTask);
      this.saveToLocalStorage();
      this.renderTasks();
      return newTask;
    }
    
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveToLocalStorage();
      this.renderTasks();
    }
    
    toggleTaskStatus(id) {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.completed = !task.completed;
        this.saveToLocalStorage();
        this.renderTasks();
      }
    }
    
    updateTaskPriority(id, priority) {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.priority = priority;
        this.saveToLocalStorage();
        this.renderTasks();
      }
    }
    
    clearCompleted() {
      this.tasks = this.tasks.filter(task => !task.completed);
      this.saveToLocalStorage();
      this.renderTasks();
    }
    
    setFilter(filter) {
      this.currentFilter = filter;
      this.renderTasks();
    }
    
    getFilteredTasks() {
      switch (this.currentFilter) {
        case 'active':
          return this.tasks.filter(task => !task.completed);
        case 'completed':
          return this.tasks.filter(task => task.completed);
        default:
          return this.tasks;
      }
    }
    
    updateStatus() {
      const status = document.getElementById('status');
      const activeCount = this.tasks.filter(task => !task.completed).length;
      
      if (this.tasks.length === 0) {
        status.textContent = 'No tasks yet';
      } else if (activeCount === 0) {
        status.textContent = 'All tasks completed!';
      } else {
        status.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
      }
    }
    
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.tasks));
    }
    
    loadFromLocalStorage() {
      const savedTasks = localStorage.getItem('todos');
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      }
    }
    
    renderTasks() {
      const tasksContainer = document.getElementById('tasks-container');
      tasksContainer.innerHTML = '';
      
      const filteredTasks = this.getFilteredTasks();
      
      if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No tasks to display';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '2rem';
        emptyMessage.style.color = '#888';
        tasksContainer.appendChild(emptyMessage);
      } else {
        filteredTasks
          .sort((a, b) => {
            if (a.completed === b.completed) {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.completed ? 1 : -1;
          })
          .forEach(task => {
            const taskElement = this.createTaskElement(task);
            tasksContainer.appendChild(taskElement);
          });
      }
      
      this.updateStatus();
    }
    
    createTaskElement(task) {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskItem.dataset.id = task.id;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));
      
      const label = document.createElement('label');
      label.textContent = task.text;
      label.addEventListener('click', () => checkbox.click());
      
      const priorityIndicator = document.createElement('div');
      priorityIndicator.className = `priority-indicator priority-${task.priority}`;
      
      const prioritySelector = document.createElement('select');
      prioritySelector.className = 'priority-selector';
      prioritySelector.innerHTML = `
        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
      `;
      prioritySelector.addEventListener('change', (e) => {
        this.updateTaskPriority(task.id, e.target.value);
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Delete task';
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
      
      const taskActions = document.createElement('div');
      taskActions.className = 'task-actions';
      taskActions.appendChild(priorityIndicator);
      taskActions.appendChild(prioritySelector);
      taskActions.appendChild(deleteBtn);
      
      taskItem.appendChild(checkbox);
      taskItem.appendChild(label);
      taskItem.appendChild(taskActions);
      
      return taskItem;
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const todoList = new TodoList();
    
    // Initial render (only need to do this once)
    todoList.renderTasks();
    
    // Set up input handling
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    
    const addTask = () => {
      const text = taskInput.value.trim();
      if (text) {
        todoList.addTask(text);
        taskInput.value = '';
        taskInput.focus();
      }
    };
    
    addButton.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTask();
      }
    });
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.filter-button[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        todoList.setFilter(button.dataset.filter);
      });
    });
    
    // Set up clear completed button (only need one event listener)
    document.getElementById('clear-completed').addEventListener('click', () => {
      todoList.clearCompleted();
    });
  });