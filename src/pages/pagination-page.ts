import type Button from '../components/button/button';
import BaseComponent from '../components/base-component';

export const PAGINATION_LIMIT = 7;
export const PAGINATION_LIMIT_WINNERS = 10;
export default abstract class PageWithPagination extends BaseComponent {
  protected currentPage = 1;

  protected nextPageButton?: Button;

  protected paginationLimit: number = PAGINATION_LIMIT;

  protected previousPageButton?: Button;

  abstract getCount(): Promise<number>;

  async updatePaginationButtons(): Promise<void> {
    if ((await this.getCount()) / this.paginationLimit <= this.currentPage) {
      this.nextPageButton?.setAttribute('disabled', 'disabled');
    } else {
      this.nextPageButton?.removeAttribute('disabled');
    }
    if (this.currentPage === 1) {
      this.previousPageButton?.setAttribute('disabled', 'disabled');
    } else {
      this.previousPageButton?.removeAttribute('disabled');
    }
  }
}
