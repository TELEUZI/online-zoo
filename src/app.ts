import Controller from './controller';

class App {
  private readonly root: HTMLElement;

  private readonly controller: Controller;

  constructor(root: HTMLElement) {
    this.root = root;
    this.controller = new Controller();
  }

  public start(): void {
    this.root.appendChild(this.controller.getNode());
  }
}
const appElement = document.getElementById('app');
if (!appElement) {
  throw new Error('App container is not found');
}
const app: App = new App(appElement);
app.start();
