export default class App {
  constructor(container) {
    this.container = container;
  }

  drawWidget() {
    return `
      <div class="trello__column list" data-name="todo">
        <h2 class="list__name">TO DO</h2>
        <ul class="list__items" data-name="todo"></ul>
        <button type="button" class="list__button-add">
          <span class="list__button-icon">
            <img src="./images/add-icon.svg" alt="">
          </span>
          <span class="list__button-text">Add another cart</span>
        </button>
      </div>
      <div class="trello__column list" data-name="inProgress">
        <h2 class="list__name">IN PROGRESS</h2>
        <ul class="list__items" data-name="inProgress"></ul>
        <button type="button" class="list__button-add">
          <span class="list__button-icon">
            <img src="./images/add-icon.svg" alt="">
          </span>
          <span class="list__button-text">Add another cart</span>
        </button>
      </div>
      <div class="trello__column list" data-name="done">
        <h2 class="list__name">DONE</h2>
        <ul class="list__items" data-name="done"></ul>
        <button type="button" class="list__button-add">
          <span class="list__button-icon">
            <img src="./images/add-icon.svg" alt="">
          </span>
          <span class="list__button-text">Add another cart</span>
        </button>
      </div>
    `;
  }

  bindToDOM() {
    this.container.innerHTML = this.drawWidget();

    this.lists = this.container.querySelectorAll('.list__items');
    this.listsBtns = this.container.querySelectorAll('.list__button-add');
  }

  // Создаем блок для добавления новой задачи
  drawFieldForTask() {
    const block = document.createElement('div');
    block.classList.add('list__block-add');
    block.innerHTML = `
      <textarea name="add-task" class="task__input input__add-task" placeholder="Enter a title for this card..."></textarea>
      <div class="task__buttons">
        <button type="button" class="task__btn-add">
          Add card
        </button>
        <button type="button" class="task__btn-cancel">
          <img src="./images/cross.svg" alt="" class="task__btn-cancel-icon">
        </button>
      </div>
    `;

    return block;
  }

  // Создаем HTML элемент задачи
  drawTaskElement(text, id) {
    const task = document.createElement('li');
    task.classList.add('list__item', 'task');
    task.setAttribute('data-id', id);
    task.innerHTML = `
      <p class="task__text">${text}</p>
      <div class="task__more">
        <img src="./images/more-icon.svg" class="task__more-icon" alt="More about task">
      </div>
      <div class="task__delete">
        <img src="./images/cross.svg" alt="Delete task" class="task__delete-icon">
      </div>
    `;

    return task;
  }
}
