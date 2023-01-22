import BaseComponent from '../base-component';

export default class TableHead extends BaseComponent {
  constructor(textContent: string, private onClick?: () => void) {
    super('th', ['table__head'], textContent);
    this.onClick = onClick;
    this.node.onclick = () => this.onClick?.();
  }
}
