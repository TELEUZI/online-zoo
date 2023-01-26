import BaseComponent from '@/components/base-component';
import WinnersService from '@/services/winners-service';
import type { ICar } from '@/interfaces/car-api';
import type { WinnerInfo } from '@/interfaces/winner-api';
import CellComponent from '@/components/table/cell';
import PaginationControls from '@/components/controls/pagination-controls/pagination-controls';
import WinnersTable from './winners-table/winners-table';
import WinnerRow from './winners-row/winner-row';
import PageWithPagination, { PAGINATION_LIMIT_WINNERS } from '../pagination-page';

export class WinnersPage extends PageWithPagination {
  protected readonly paginationControls: PaginationControls;

  protected readonly paginationLimit = PAGINATION_LIMIT_WINNERS;

  private readonly winnersTable: WinnersTable;

  private readonly header: BaseComponent;

  private readonly pageNumber: BaseComponent;

  private winSortType = 'ASC';

  private lastChosen: [string?, string?] = [];

  private readonly onWinnersCountChange: (count: number) => void;

  constructor() {
    super();
    this.currentPage = 1;
    this.winnersTable = new WinnersTable(
      this.sortTable.bind(this, 'wins'),
      this.sortTable.bind(this, 'time'),
    );
    this.paginationControls = new PaginationControls(
      this.showNext.bind(this),
      this.showPrevious.bind(this),
      ['page__controls_pagination', 'garage__controls'],
    );
    this.header = new BaseComponent('h2', ['page__name']);
    this.pageNumber = new BaseComponent('h3', ['page__number'], `Page #(${this.currentPage})`);
    this.appendChildren([this.paginationControls, this.header, this.pageNumber, this.winnersTable]);

    this.onWinnersCountChange = (count: number) => {
      this.header.setContent(`Winners (${count})`);
    };

    WinnersService.winnersCount.subscribe(this.onWinnersCountChange);

    this.updateTable();
  }

  public destroy(): void {
    WinnersService.winnersCount.unsubscribe(this.onWinnersCountChange);
    super.destroy();
  }

  protected async getCount(): Promise<number> {
    return WinnersService.getCount();
  }

  private async updateTable(): Promise<void> {
    const winners = await WinnersService.getWinners(this.currentPage, ...this.lastChosen);
    const carWinners = winners.map(
      ({ name, color, wins, time }) => new WinnerRow(name, color, wins, time),
    );

    this.createTableUI(carWinners);
  }

  private async sortTable(value = 'id'): Promise<void> {
    const winners = await this.getSortedBy(value);
    this.recreateTableUI(winners);
  }

  private createTableUI(winners: WinnerRow[]): void {
    this.winnersTable.clearBody();
    this.updatePaginationButtons().then(() => {
      this.pageNumber.setContent(`Page #(${this.currentPage})`);
      winners.forEach((row, index) => {
        const incrementIndexBy = 1;
        row.prepend(new CellComponent((index + incrementIndexBy).toString()));
        this.winnersTable.pushRow(row);
      });
    });
  }

  private recreateTableUI(winners: (ICar & WinnerInfo)[]): void {
    winners.forEach((row, index) => {
      this.winnersTable.updateRow(row, index);
    });
  }

  private async getSortedBy(value: string): Promise<(ICar & WinnerInfo)[]> {
    this.winSortType = this.winSortType === 'ASC' ? 'DESC' : 'ASC';
    this.lastChosen = [value, this.winSortType];
    return WinnersService.getWinners(this.currentPage, value, this.winSortType);
  }

  private async showNext(): Promise<void> {
    this.currentPage += 1;
    return this.updateTable();
  }

  private async showPrevious(): Promise<void> {
    this.currentPage -= 1;
    return this.updateTable();
  }
}
