import type PaginationControls from '@/components/controls/pagination-controls/pagination-controls';
import BaseComponent from '../components/base-component';

export const PAGINATION_LIMIT_GARAGE = 7;
export const PAGINATION_LIMIT_WINNERS = 2;
export const START_PAGE = 1;

export default abstract class PageWithPagination extends BaseComponent {
  protected currentPage = START_PAGE;

  protected paginationLimit: number = PAGINATION_LIMIT_GARAGE;

  protected abstract paginationControls: PaginationControls;

  protected async updatePaginationButtons(): Promise<void> {
    const count = await this.getCount();
    const pagesCount = Math.ceil(count / this.paginationLimit);
    const isPreviousPageDisabled = this.currentPage === START_PAGE;
    const isNextPageDisabled = pagesCount === this.currentPage;
    this.paginationControls.updateControlsState(isNextPageDisabled, isPreviousPageDisabled);
  }

  protected abstract getCount(): Promise<number>;
}
