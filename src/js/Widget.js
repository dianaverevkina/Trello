import tasks from './tasks';
import Task from './Task';

export default class Widget {
  constructor(app, state) {
    this.app = app;
    this.state = state;
    this.lists = app.lists;
    this.listsBtns = app.listsBtns;

    this.showInputForAddingTask = this.showInputForAddingTask.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.addEvents();
  }

  // Добавляем обработчики событий
  addEvents() {
    this.lists.forEach((list) => list.addEventListener('mousedown', this.onMouseDown));
    this.listsBtns.forEach((btn) => btn.addEventListener('click', this.showInputForAddingTask));
  }

  // Добавляем обработчики событий для задачи
  addEventsFortask(task) {
    const btnDeleteTask = task.querySelector('.task__delete');
    task.addEventListener('mouseover', () => btnDeleteTask.classList.add('task__delete_visible'));
    task.addEventListener('mouseout', () => btnDeleteTask.classList.remove('task__delete_visible'));
  }

  // Удаляем задачу при клике по кнопке "Крестик"
  deleteTask(btn) {
    const currentTask = btn.closest('.task');
    const list = currentTask.closest('.list');
    const listItems = list.querySelector('.list__items');
    const nameList = list.getAttribute('data-name');
    const taskIndex = tasks.findIndex((item) => item.id === +currentTask.getAttribute('data-id'));
    tasks.splice(taskIndex, 1);
    this.state.save(tasks);
    this.renewList(listItems, nameList);
  }

  // Создаем место под задачу при перемещении карточки с задачей
  createPlaceHolder() {
    this.placeForTask = null;
    this.placeForTask = document.createElement('li');
    this.placeForTask.classList.add('list__placeholder', 'task-placeholder');
    this.placeForTask.style.height = `${this.draggedTask.offsetHeight}px`;
  }

  // Перемещаем карточку за курсором
  moveTask(e) {
    this.draggedTask.style.top = `${e.clientY - this.dragOffsetY}px`;
    this.draggedTask.style.left = `${e.clientX - this.dragOffsetX}px`;
  }

  // Создаем перетаскиваемую карточку и место для нее
  onMouseDown(e) {
    e.preventDefault();
    const btnDelete = e.target.closest('.task__delete');
    if (btnDelete) {
      this.deleteTask(btnDelete);
      return;
    }

    this.draggedTask = e.target.closest('.task');
    if (!this.draggedTask) return;

    this.createPlaceHolder();

    this.dragOffsetX = e.clientX - this.draggedTask.getBoundingClientRect().left;
    this.dragOffsetY = e.clientY - this.draggedTask.getBoundingClientRect().top;

    this.moveTask(e);

    this.draggedTask.classList.add('task_dragged');

    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mousemove', this.onMouseMove);
  }


  // Перемещаем карточку
  onMouseMove(e) {
    e.preventDefault();

    this.moveTask(e);
    this.showPlaceForTask(e);
  }

  // Создаем место под задачу
  showPlaceForTask(event) {
    const task = event.target.closest('.task');
    const list = event.target.closest('.list');

    if (!list) return;

    const container = list.querySelector('.list__items');
    const items = list.querySelectorAll('.task');

    if (container && items.length === 0) {
      container.append(this.placeForTask);
      return;
    }

    if (!task) return;
    const { top, height } = task.getBoundingClientRect();
    const taskCenterY = top + height / 2;

    if (event.clientY < taskCenterY) {
      task.before(this.placeForTask);
    } else {
      task.after(this.placeForTask);
    }
  }

  // Перемещаем задачу в новое место
  onMouseUp() {
    this.placeForTask.replaceWith(this.draggedTask);

    this.draggedTask.classList.remove('task_dragged');
    this.draggedTask.style.top = 0;
    this.draggedTask.style.left = 0;

    const list = this.draggedTask.closest('.list');
    const listName = list.getAttribute('data-name');
    const foundTask = tasks.find((task) => task.id === +this.draggedTask.getAttribute('data-id'));
    foundTask.state = listName;
    this.state.save(tasks);

    this.placeForTask.remove();
    this.draggedTask = null;

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mousemove', this.onMouseMove);
  }

  // Показываем блок для добавления задачи и добавляем обработчики событий на кнопки
  showInputForAddingTask(e) {
    e.preventDefault();
    const { currentTarget } = e;

    if (this.blockForTask) {
      this.blockForTask.remove();
    }

    this.blockForTask = this.app.drawFieldForTask();

    currentTarget.before(this.blockForTask);
    this.fieldForTask = this.blockForTask.querySelector('.input__add-task');
    const btnAddTask = this.blockForTask.querySelector('.task__btn-add');
    const btnCancelTask = this.blockForTask.querySelector('.task__btn-cancel');

    btnAddTask.addEventListener('click', () => this.addTask(e));
    btnCancelTask.addEventListener('click', () => this.cancelTask(e));
  }

  // Добавляем задачу при клике кнопки 'add card'
  addTask(e) {
    e.preventDefault();
    if (!this.fieldForTask.value.trim()) return;

    const list = e.target.closest('.list');
    const listItems = list.querySelector('.list__items');
    const listName = listItems.getAttribute('data-name');
    const id = Math.random() * 100000;

    const task = new Task(this.fieldForTask.value, id, listName);
    tasks.push(task);
    this.state.save(tasks);
    this.blockForTask.remove();
    this.renewList(listItems, listName);
  }

  // Обновляем список задач
  renewList(list, listName) {
    const items = list.querySelectorAll('.task');
    items.forEach((item) => item.remove());
    const filteredTasks = tasks.filter((task) => task.state === listName);
    filteredTasks.forEach((task) => {
      const el = this.app.drawTaskElement(task.text, task.id);
      list.append(el);
      this.addEventsFortask(el);
    });
  }

  // Отменить добавление задачи
  cancelTask(e) {
    e.preventDefault();
    this.blockForTask.remove();
  }

  // Загружаем данные из локального хранилища, если они есть
  loadTasks() {
    const savedTasks = this.state.load();
    if (savedTasks) {
      savedTasks.forEach((obj) => tasks.push(obj));
      tasks.forEach((task) => {
        const taskEl = this.app.drawTaskElement(task.text, task.id);
        const list = this.app.container.querySelector(`[data-name=${task.state}]`);
        list.querySelector('.list__items').append(taskEl);

        this.addEventsFortask(taskEl);
      });
    }
  }
}
