import type { ICar } from '@/interfaces/car-api';
import type { WinnerInfo } from '@/interfaces/winner-api';
import BaseComponent from '@/components/base-component';
import TableHead from '@/components/table/table-head';
import type CarWinner from '../winners-row/winner';

export default class WinnerResult extends BaseComponent {
  private readonly body: BaseComponent;

  private readonly rows: CarWinner[] = [];

  constructor(onWinsClick?: () => void, onTimeClick?: () => void) {
    super('table', ['table']);
    this.body = new BaseComponent('tbody');
    const head = new BaseComponent('thead');
    const headRow = new BaseComponent('tr');

    const headers = [
      new TableHead('Number'),
      new TableHead('Car'),
      new TableHead('Name'),
      new TableHead('Wins', onWinsClick),
      new TableHead('Best time (seconds)', onTimeClick),
    ];
    headRow.appendChildren(headers);
    head.insertChild(headRow);
    this.insertChild(head);
    this.insertChild(this.body);
  }

  pushRow(comp: CarWinner): void {
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
    this.rows.splice(0);
  }
}
