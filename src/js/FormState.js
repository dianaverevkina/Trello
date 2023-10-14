export default class SavedTasks {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('tasks', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('tasks'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
