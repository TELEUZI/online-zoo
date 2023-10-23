import type PageWithPagination from '@/pages/pagination-page';
import type NameRoute from '../enums/routes';

export interface Route {
  name: NameRoute;
  component: (props: Record<string, string>) => Promise<PageWithPagination>;
}
