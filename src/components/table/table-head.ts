import BaseComponent from '../base-component';

export default class TableHead extends BaseComponent {
  onClick: () => void = () => {};

  constructor(textContent: string, onClick?: () => void) {
    super('th', ['table__head'], textContent);
    this.onClick = onClick;
    this.node.onclick = () => this.onClick?.();
  }
}
