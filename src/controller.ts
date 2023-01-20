import BaseComponent from './components/base-component';
import Menu from './components/menu/menu';
import PageController from './interfaces/page-controller';
import GaragePage from './pages/garage-page/garage-page';
import WinnersPage from './pages/winners-page/winners-page';
import Router from './router';

const GARAGE_ROUTE = 'garage';
const WINNER_ROUTE = 'winners';
export default class Controller extends BaseComponent {
  private appRoot: BaseComponent;

  private router: Router;

  constructor() {
    super('div', ['app']);
    const menu = new Menu();
    const header = new BaseComponent('header', ['header']);
    header.insertChild(menu);
    this.insertChild(header);
    this.appRoot = new BaseComponent('div', ['page']);
    this.insertChild(this.appRoot);
    this.router = new Router(
      [
        {
          name: GARAGE_ROUTE,
          controller: new GaragePage(this.getAppRoot()),
        },
        {
          name: WINNER_ROUTE,
          controller: new WinnersPage(this.getAppRoot()),
        },
      ],
      this.moveToPage.bind(this),
    );
  }

  moveToPage(page: PageController): void {
    this.render(page);
  }

  render(page: PageController): void {
    this.appRoot.getNode().innerHTML = '';
    page.createPage();
  }

  getAppRoot(): HTMLElement {
    return this.appRoot.getNode();
  }
}
