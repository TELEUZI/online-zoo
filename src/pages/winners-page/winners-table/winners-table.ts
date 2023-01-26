import type { ICar } from '@/interfaces/car-api';
import type { WinnerInfo } from '@/interfaces/winner-api';
import BaseComponent from '@/components/base-component';
import TableHead from '@/components/table/table-head';
import type WinnerRow from '../winners-row/winner-row';

export default class WinnersTable extends BaseComponent {
  private readonly body: BaseComponent;

  private readonly rows: WinnerRow[] = [];

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

  public pushRow(comp: WinnerRow): void {
    this.body.insertChild(comp);
    this.rows.push(comp);
  }

  public updateRow(data: ICar & WinnerInfo, index: number): void {
    const row = this.getRowByIndex(index);
    if (row !== undefined) {
      row.update(data.name, data.color, data.wins, data.time);
    }
  }

  public clearBody(): void {
    const startDeleteIndex = 0;
    this.body.destroyChildren();
    this.rows.splice(startDeleteIndex);
  }

  private getRowByIndex(index: number): WinnerRow | undefined {
    return this.rows[index];
  }
}
