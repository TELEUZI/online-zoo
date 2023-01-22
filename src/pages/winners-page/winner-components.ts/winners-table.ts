import BaseComponent from '../../../components/base-component';
import TableHead from '../../../components/table/table-head';
import type { ICar } from '../../../interfaces/car-api';
import type { WinnerInfo } from '../../../interfaces/winner-api';
import type CarWinner from './winner';

export default class WinnerResult extends BaseComponent {
  private body: BaseComponent;

  private rows: CarWinner[] = [];

  constructor(onWins?: () => void, onTime?: () => void) {
    super('table', ['table']);
    this.body = new BaseComponent('tbody');
    const head = new BaseComponent('thead');
    const headrow = new BaseComponent('tr');

    const headers = [
      new TableHead('Number'),
      new TableHead('Car'),
      new TableHead('Name'),
      new TableHead('Wins', onWins),
      new TableHead('Best time (seconds)', onTime),
    ];
    headrow.appendChildren(headers);
    head.insertChild(headrow);
    this.insertChild(head);
    this.insertChild(this.body);
  }

  setRow(comp: CarWinner): void {
    this.body.insertChild(comp);
    this.rows.push(comp);
  }

  updateRow(data: ICar & WinnerInfo, index: number): void {
    const row = this.rows[index];
    if (row) {
      row.update(data.name, data.color, data.wins, data.time);
    }
  }

  clearBody(): void {
    this.body.destroyChildren();
    this.rows = [];
  }
}
