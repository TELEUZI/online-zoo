import BaseComponent from './components/base-component';
import Menu from './components/menu/menu';
import PageController from './interfaces/page-controller';
import Router from './router';
import NameRoute from './enums/routes';

export default class Controller extends BaseComponent {
  private appRoot: BaseComponent;

  constructor() {
    super('div', ['app']);
    const menu = new Menu();
    const header = new BaseComponent('header', ['header']);
    header.insertChild(menu);
    this.insertChild(header);
    this.appRoot = new BaseComponent('div', ['page']);
    this.insertChild(this.appRoot);
    Router.init(this.appRoot.getNode(), [
      {
        name: NameRoute.Garage,
        component: async (props) => {
          const { GaragePage } = await import('./pages/garage-page/garage-page');

          return new GaragePage(props);
        },
      },
      {
        name: NameRoute.Winners,
        component: async (props) => {
          const { WinnersPage } = await import('./pages/winners-page/winners-page');
          return new WinnersPage(props);
        },
      },
    ]);
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
