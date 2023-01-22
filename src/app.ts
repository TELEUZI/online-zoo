import Controller from './controller';
import './normalize.css';

class App {
  private root: HTMLElement;

  private controller: Controller;

  constructor(root: HTMLElement) {
    this.root = root;
    this.controller = new Controller();
  }

  start(): void {
    this.root.appendChild(this.controller.getNode());
  }
}
const app: App = new App(document.body);
app.start();
