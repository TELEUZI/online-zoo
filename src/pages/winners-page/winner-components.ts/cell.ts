import BaseComponent from '../../../components/base-component';

export default class CellComponent extends BaseComponent {
  constructor(textContent: string, HTMLContent?: string) {
    super('td', ['table__col']);
    this.setContent(textContent);
    if (HTMLContent) {
      this.setHTML(HTMLContent);
    }
  }
}
