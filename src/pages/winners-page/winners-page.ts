import BaseComponent from '@/components/base-component';
import WinnersService from '@/services/winners-service';
import type { ICar } from '@/interfaces/car-api';
import type { WinnerInfo } from '@/interfaces/winner-api';
import CellComponent from '@/components/table/cell';
import PaginationControls from '@/components/controls/pagination-controls/pagination-controls';
import WinnerResult from './winners-table/winners-table';
import CarWinner from './winners-row/winner';
import PageWithPagination, { PAGINATION_LIMIT_WINNERS } from '../pagination-page';

export class WinnersPage extends PageWithPagination {
  protected readonly paginationLimit = PAGINATION_LIMIT_WINNERS;

  private readonly winnersTable: WinnerResult;

  private winSortType = 'ASC';

  private lastChosen: [string?, string?] = [];

  protected readonly paginationControls: PaginationControls;

  private readonly header: BaseComponent;

  private readonly pageNumber: BaseComponent;

  constructor() {
    super();
    this.currentPage = 1;
    this.winnersTable = new WinnerResult(
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

    WinnersService.winnersCount.subscribe((count) => {
      this.header.setContent(`Winners (${count})`);
    });

    this.updateTable();
  }

  async getCount(): Promise<number> {
    return WinnersService.getCount();
  }

  async updateTable(): Promise<void> {
    const winners = await WinnersService.getWinners(this.currentPage, ...this.lastChosen);
    const carWinners = winners.map(
      ({ name, color, wins, time }) => new CarWinner(name, color, wins, time),
    );

    this.createTableUI(carWinners);
  }

  async sortTable(value = 'id'): Promise<void> {
    const winners = await this.getSortedBy(value);
    this.recreateTableUI(winners);
  }

  createTableUI(winners: CarWinner[]): void {
    this.winnersTable.clearBody();
    this.updatePaginationButtons().then(() => {
      this.pageNumber.setContent(`Page #(${this.currentPage})`);
      winners.forEach((row, index) => {
        row.prepend(new CellComponent((index + 1).toString()));
        this.winnersTable.pushRow(row);
      });
    });
  }

  recreateTableUI(winners: (ICar & WinnerInfo)[]): void {
    winners.forEach((row, index) => {
      this.winnersTable.updateRow(row, index);
    });
  }

  async getSortedBy(value: string): Promise<(ICar & WinnerInfo)[]> {
    this.winSortType = this.winSortType === 'ASC' ? 'DESC' : 'ASC';
    this.lastChosen = [value, this.winSortType];
    return WinnersService.getWinners(this.currentPage, value, this.winSortType);
  }

  async showNext(): Promise<void> {
    this.currentPage += 1;
    return this.updateTable();
  }

  async showPrevious(): Promise<void> {
    this.currentPage -= 1;
    return this.updateTable();
  }
}
