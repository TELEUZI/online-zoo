import type NameRoute from '../enums/routes';
import type BaseComponent from '../components/base-component';

export interface Route {
  name: NameRoute;
  component: (props: Record<string, string>) => Promise<BaseComponent>;
}
