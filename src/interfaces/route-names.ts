import NameRoute from '../enums/routes';
import BaseComponent from '../components/base-component';

export interface Route {
  name: NameRoute;
  component: (props: Record<string, string>) => Promise<BaseComponent>;
}
