import BaseComponent from '../../../components/base-component';
import TableHead from '../../../components/table/table-head';

export default class WinnerResult extends BaseComponent {
  private body: BaseComponent;

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
    headrow.insertChilds(headers);
    head.insertChild(headrow);
    this.insertChild(head);
    this.insertChild(this.body);
  }

  setRow(comp: BaseComponent): void {
    this.body.insertChild(comp);
  }

  clearBody(): void {
    this.body.getNode().innerHTML = '';
  }
}
