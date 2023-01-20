import { getWinners } from '../../api/winners-api';
import BaseComponent from '../../components/base-component';
import Button from '../../components/button/button';
import PageController from '../../interfaces/page-controller';
import { NUMERIC_SYSTEM } from '../car-model';
import PageWithPagination, { PAGINATION_LIMIT_WINNERS } from '../pagination-page';
import CarWinner from './winner-components.ts/winner';
import WinnerResultModel from './winner-components.ts/winner-result-model';
import WinnerResult from './winner-components.ts/winners-table';

export default class WinnersPage extends PageWithPagination implements PageController {
  private root: HTMLElement;

  paginationLimit = PAGINATION_LIMIT_WINNERS;

  private winnersTable: WinnerResult;

  private model: WinnerResultModel;

  private winSortType = 'ASC';

  private lastChosen: string[] = [];

  private garageControls: BaseComponent;

  header: BaseComponent;

  pageNumber: BaseComponent;

  constructor(root: HTMLElement) {
    super();
    this.root = root;
    this.model = new WinnerResultModel();
    this.currentPage = 1;
    this.winnersTable = new WinnerResult(
      this.sortTable.bind(this, 'wins'),
      this.sortTable.bind(this, 'time'),
    );
    this.nextPageButton = new Button('Next page', [], this.showNext.bind(this));
    this.previousPageButton = new Button('Previous page', [], this.showPrevious.bind(this));
    this.garageControls = new BaseComponent('div', ['garage__controls']);
    this.garageControls.appendChildren([this.nextPageButton, this.previousPageButton]);
  }

  async getCount(): Promise<number> {
    return parseInt(
      (await getWinners(this.currentPage, this.paginationLimit)).count,
      NUMERIC_SYSTEM,
    );
  }

  async createPage(): Promise<void> {
    this.header = new BaseComponent('h2', ['page__name'], `Winners (${await this.getCount()})`);
    this.pageNumber = new BaseComponent('h3', ['page__number'], `Page #(${this.currentPage})`);
    this.root.append(...[this.header.getNode(), this.pageNumber.getNode()]);
    this.root.prepend(this.garageControls.getNode());
    return this.updateTable();
  }

  async updateTable(): Promise<void> {
    const winners = await this.model.getCars(this.currentPage, ...this.lastChosen);
    this.createTableUI(winners);
  }

  async sortTable(value = 'id'): Promise<void> {
    const winners = await this.getSorted(value);
    this.createTableUI(winners);
  }

  createTableUI(winners: CarWinner[]): void {
    this.checkPaginationButtons().then(() => {
      this.pageNumber.setContent(`Page #(${this.currentPage})`);
      this.winnersTable.clearBody();
      winners.forEach((row, index) => {
        row.prepend(new BaseComponent('td', [], (index + 1).toString()));
        this.winnersTable.setRow(row);
      });
      this.root.append(this.winnersTable.getNode());
    });
  }

  async getSorted(value: string): Promise<CarWinner[]> {
    if (this.winSortType === 'ASC') {
      this.winSortType = 'DESC';
      this.lastChosen = [value, 'ASC'];
      return this.model.getCars(this.currentPage, value, 'ASC');
    }
    this.winSortType = 'ASC';
    this.lastChosen = [value, 'DESC'];
    return this.model.getCars(this.currentPage, value, 'DESC');
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
