import BaseComponent from './components/base-component';
import Menu from './components/menu/menu';
import Router from './router';
import NameRoute from './enums/routes';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent;

  constructor() {
    super('div', ['app']);
    const menu = new Menu();
    const header = new BaseComponent('header', ['header']);
    this.appRoot = new BaseComponent('div', ['page']);
    header.insertChild(menu);
    this.appendChildren([header, this.appRoot]);
    Router.init(this.appRoot.getNode(), [
      {
        name: NameRoute.Garage,
        component: async () => {
          const { GaragePage } = await import('./pages/garage-page/garage-page');
          return new GaragePage();
        },
      },
      {
        name: NameRoute.Winners,
        component: async () => {
          const { WinnersPage } = await import('./pages/winners-page/winners-page');
          return new WinnersPage();
        },
      },
    ]);
  }
}
