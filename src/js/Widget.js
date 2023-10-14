import tasks from "./tasks";
import Task from "./Task";

export default class Widget {
  constructor(app, state) {
    this.app = app;
    this.state = state;
    this.lists = app.lists;
    this.listsBtns = app.listsBtns;

    this.showInputForAddingTask = this.showInputForAddingTask.bind(this);

    this.addEvents();
  }

  addEvents() {
    this.lists.forEach(list => {
      list.addEventListener('mousedown', () => console.log('here'));
    });

    this.listsBtns.forEach(btn => btn.addEventListener('click', this.showInputForAddingTask));
  }

  showInputForAddingTask(e) {
    e.preventDefault();
    const { target } = e;
    const list = target.closest('.list');
    this.listItems = list.querySelector('.list__items');
    this.listName = this.listItems.getAttribute('data-name');
    this.blockForTask = this.app.drawFieldForTask();

    this.listItems.append(this.blockForTask);
    this.fieldForTask = this.blockForTask.querySelector('.input__add-task');
    const btnAddTask = this.blockForTask.querySelector('.task__btn-add');
    const btnCancelTask = this.blockForTask.querySelector('.task__btn-cancel');

    btnAddTask.addEventListener('click', () => this.addTask(e));
    btnCancelTask.addEventListener('click', () => this.cancelTask(e));
  }

  addTask(e) {
    e.preventDefault();
    const { target } = e;
    const id = Math.random() * 100000;
    const task = new Task(this.fieldForTask.value, id, this.listName);
    tasks.push(task);
    this.blockForTask.remove();
    this.renewList();
  }

  renewList() {
    const items = this.listItems.querySelectorAll('.task');
    items.forEach(item => item.remove());
    const filteredTasks = tasks.filter(task => task.state === this.listName);
    filteredTasks.forEach(task => {
      const el = this.app.drawTaskElement(task.text);
      this.listItems.append(el);
    });

    this.state.save(tasks);
  }

  cancelTask(e) {
    e.preventDefault();
    this.blockForTask.remove();
  }

  loadTasks() {
    const savedTasks = this.state.load();

    if (savedTasks) {
      savedTasks.forEach(task => {
        const taskEl = this.app.drawTaskElement(task.text);
        const list = this.app.container.querySelector(`[data-name=${task.state}]`);
        list.append(taskEl);
      });
    }
  }
}
