import App from './App';
import SavedTasks from './FormState';
import Widget from './Widget';

const container = document.querySelector('.trello__container');
const app = new App(container);

app.bindToDOM();

const savedTasks = new SavedTasks(localStorage);
const widget = new Widget(app, savedTasks);
widget.loadTasks();
