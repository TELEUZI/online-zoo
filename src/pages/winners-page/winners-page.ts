import BaseComponent from '../../components/base-component';
import Button from '../../components/button/button';
import PageController from '../../interfaces/page-controller';
import PageWithPagination, { PAGINATION_LIMIT_WINNERS } from '../pagination-page';
import CarWinner from './winner-components.ts/winner';
import WinnerResult from './winner-components.ts/winners-table';
import WinnersService from '../../services/winners-service';
import ICar from '../../interfaces/car-api';
import { WinnerInfo } from '../../interfaces/winner-api';
import CellComponent from './winner-components.ts/cell';

// eslint-disable-next-line import/prefer-default-export
export class WinnersPage extends PageWithPagination implements PageController {
  paginationLimit = PAGINATION_LIMIT_WINNERS;

  private winnersTable: WinnerResult;

  private winSortType = 'ASC';

  private lastChosen: [string?, string?] = [];

  private garageControls: BaseComponent;

  header!: BaseComponent;

  pageNumber!: BaseComponent;

  constructor() {
    super();
    this.currentPage = 1;
    this.winnersTable = new WinnerResult(
      this.sortTable.bind(this, 'wins'),
      this.sortTable.bind(this, 'time'),
    );
    this.nextPageButton = new Button('Next page', [], this.showNext.bind(this));
    this.previousPageButton = new Button('Previous page', [], this.showPrevious.bind(this));
    this.garageControls = new BaseComponent('div', ['garage__controls']);
    this.garageControls.appendChildren([this.nextPageButton, this.previousPageButton]);
    this.createPage();
  }

  async getCount(): Promise<number> {
    return WinnersService.getCount(this.currentPage, this.paginationLimit);
  }

  async createPage(): Promise<void> {
    this.header = new BaseComponent('h2', ['page__name'], `Winners (${await this.getCount()})`);
    this.pageNumber = new BaseComponent('h3', ['page__number'], `Page #(${this.currentPage})`);
    this.node.append(...[this.header.getNode(), this.pageNumber.getNode()]);
    this.node.prepend(this.garageControls.getNode());
    this.node.append(this.winnersTable.getNode());

    return this.updateTable();
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
        this.winnersTable.setRow(row);
      });
    });
  }

  recreateTableUI(winners: (ICar & WinnerInfo)[]): void {
    winners.forEach((row, index) => {
      this.winnersTable.updateRow(row, index);
    });
  }

  async getSortedBy(value: string): Promise<(ICar & WinnerInfo)[]> {
    const otherSortType = this.winSortType === 'ASC' ? 'DESC' : 'ASC';
    this.winSortType = otherSortType;
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
