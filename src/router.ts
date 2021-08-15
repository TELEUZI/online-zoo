import PageController from './interfaces/page-controller';
import RouteNames from './interfaces/route-names';

const BASE_ROUTE = 'garage';
export default class Router {
  private routes: RouteNames[];

  onHashChange: (routeName: PageController) => void;

  constructor(routes: RouteNames[], onHashChange: (page: PageController) => void) {
    this.onHashChange = onHashChange;
    this.routes = routes;
    window.onhashchange = this.hashChanged;
    this.hashChanged();
  }

  hashChanged = (): void => {
    const route = window.location.hash.length > 0 ? window.location.hash.substr(1) : BASE_ROUTE;
    if (this.onHashChange)
      this.onHashChange(this.routes.find((routeName) => routeName.name === route).controller);
  };
}
