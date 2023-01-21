import BaseComponent from './components/base-component';
import { Route } from './interfaces/route-names';
import NameRoute from './enums/routes';
import PageWithPagination from './pages/pagination-page';

export default class Router {
  static pageContainer: HTMLElement;

  private static currentRoute: Promise<BaseComponent> | void;

  private static routes: Route[];

  private static onPathChange: (
    route: Route,
    props: Record<string, string>,
  ) => Promise<BaseComponent | PageWithPagination> | void = (route, props) => {
    if (route) {
      return route.component(props).then((component) => {
        Router.pageContainer.append(component.getNode());

        return component;
      });
    }
    return Router.defaultComponent({});
  };

  private static pathToRegex = (path: NameRoute) =>
    new RegExp(`^${path.replace(/\//g, '\\/').replace(/:\w+/g, '([^/]+)')}$`);

  private static getParams = (path: NameRoute, values: string[]) => {
    const keys = Array.from(path.matchAll(/:(\w+)/g)).map((result) => result[1]);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  };

  private static defaultComponent = async (props: Record<string, string>) => {
    const { GaragePage } = await import('./pages/garage-page/garage-page');

    return new GaragePage(props);
  };

  static onPathChangeHandler = () => {
    const path = window.location.pathname;

    const route = Router.routes.find((r) => Router.pathToRegex(r.name).test(path));
    const props = Object.fromEntries(new URLSearchParams(window.location.search).entries());

    if (route) {
      const values = window.location.pathname.match(Router.pathToRegex(route.name))?.slice(-1);
      if (values) {
        Object.assign(props, Router.getParams(route.name, values));
      }
    }

    if (Router.currentRoute) {
      Router.currentRoute.then((component) => component.destroy());
    }

    Router.currentRoute = Router.onPathChange(
      route ?? { name: NameRoute.Default, component: this.defaultComponent },
      props,
    );
  };

  static init(pageContainer: HTMLElement, routes: Route[]) {
    this.pageContainer = pageContainer;
    this.routes = routes;
    window.addEventListener('popstate', this.onPathChangeHandler);
    this.onPathChangeHandler();
  }

  static destroy() {
    window.removeEventListener('popstate', this.onPathChangeHandler);
  }
}
