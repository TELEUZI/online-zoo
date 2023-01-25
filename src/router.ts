import type BaseComponent from './components/base-component';
import type { Route } from './interfaces/route-names';
import NameRoute from './enums/routes';
import type PageWithPagination from './pages/pagination-page';

export default class Router {
  private static pageContainer: HTMLElement;

  private static currentRoute: Promise<BaseComponent | undefined> | undefined;

  private static routes: Route[];

  public static onPathChangeHandler(): void {
    const path = window.location.pathname;

    const route = Router.routes.find((r) => Router.pathToRegex(r.name).test(path));
    const props = Object.fromEntries(new URLSearchParams(window.location.search).entries());

    if (route) {
      const endIndex = -1;
      const values = Router.pathToRegex(route.name).exec(window.location.pathname)?.slice(endIndex);
      if (values) {
        Object.assign(props, Router.getParams(route.name, values));
      }
    }

    Router.currentRoute?.then((component) => {
      component?.destroy();
    });

    Router.currentRoute = Router.onPathChange(
      route ?? { name: NameRoute.Default, component: this.defaultComponent },
      props,
    );
  }

  public static init(pageContainer: HTMLElement, routes: Route[]): void {
    this.pageContainer = pageContainer;
    this.routes = routes;
    window.addEventListener('popstate', this.onPathChangeHandler.bind(this));
    this.onPathChangeHandler();
  }

  public static destroy(): void {
    window.removeEventListener('popstate', this.onPathChangeHandler.bind(this));
  }

  private static onPathChange(
    route: Route | undefined,
    props: Record<string, string>,
  ): Promise<BaseComponent | PageWithPagination> {
    if (route) {
      return route.component(props).then((component) => {
        Router.pageContainer.append(component.getNode());

        return component;
      });
    }
    return Router.defaultComponent();
  }

  private static readonly pathToRegex = (path: NameRoute) =>
    new RegExp(`^${path.replace(/\//g, '\\/').replace(/:\w+/g, '([^/]+)')}$`);

  private static readonly getParams = (path: NameRoute, values: string[]) => {
    const keys = Array.from(path.matchAll(/:(\w+)/g)).map((result) => result[1]);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  };

  private static readonly defaultComponent = async () => {
    const { GaragePage } = await import('./pages/garage-page/garage-page');

    return new GaragePage();
  };
}
