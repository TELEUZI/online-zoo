import Button from '../components/button/button';

export const PAGINATION_LIMIT = 7;
export const PAGINATION_LIMIT_WINNERS = 10;
export default abstract class PageWithPagination {
  protected currentPage = 1;

  protected nextPageButton: Button;

  protected paginationLimit: number;

  protected previousPageButton: Button;

  abstract getCount(): Promise<number>;

  async checkPaginationButtons(): Promise<void> {
    if ((await this.getCount()) / this.paginationLimit <= this.currentPage) {
      this.nextPageButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextPageButton.removeAttribute('disabled');
    }
    if (this.currentPage === 1) {
      this.previousPageButton.setAttribute('disabled', 'disabled');
    } else {
      this.previousPageButton.removeAttribute('disabled');
    }
  }
}
