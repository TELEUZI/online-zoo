import type PaginationControls from '@/components/controls/pagination-controls/pagination-controls';
import BaseComponent from '../components/base-component';

export const PAGINATION_LIMIT_GARAGE = 7;
export const PAGINATION_LIMIT_WINNERS = 2;
export default abstract class PageWithPagination extends BaseComponent {
  protected currentPage = 1;

  protected abstract paginationControls: PaginationControls;

  protected paginationLimit: number = PAGINATION_LIMIT_GARAGE;

  abstract getCount(): Promise<number>;

  async updatePaginationButtons(): Promise<void> {
    const count = await this.getCount();
    const pagesCount = Math.ceil(count / this.paginationLimit);
    const isPreviousPageDisabled = this.currentPage === 1;
    const isNextPageDisabled = pagesCount === this.currentPage;
    this.paginationControls.updateControlsState(isNextPageDisabled, isPreviousPageDisabled);
  }
}
