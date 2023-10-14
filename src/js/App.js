export default class App {
  constructor(container) {
    this.container = container;
  }

  drawWidget() {
    return `
      <div class="trello__column list">
        <h2 class="list__name">TO DO</h2>
        <ul class="list__items" data-name="todo"></ul>
        <button type="button" class="list__button-add">
          <span class="list__button-icon">
            <img src="./images/add-icon.svg" alt="">
          </span>
          <span class="list__button-text">Add another cart</span>
        </button>
      </div>
      <div class="trello__column list">
        <h2 class="list__name">IN PROGRESS</h2>
        <ul class="list__items" data-name="inProgress"></ul>
        <button type="button" class="list__button-add">
          <span class="list__button-icon">
            <img src="./images/add-icon.svg" alt="">
          </span>
          <span class="list__button-text">Add another cart</span>
        </button>
      </div>
      <div class="trello__column list">
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

    this.lists = this.container.querySelectorAll('.list');
    this.listsBtns = this.container.querySelectorAll('.list__button-add');
  }

  drawFieldForTask() {
    const block = document.createElement('li');
    block.classList.add('task__add');
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

  drawTaskElement(text) {
    const task = document.createElement('li');
    task.classList.add('list__item', 'task');
    task.innerHTML = `
      <p class="task__text">${text}</p>
      <div class="task__more">
        <img src="./images/more-icon.svg" class="task__more-icon" alt="More about task">
      </div>
    `;

    return task;
  }
}