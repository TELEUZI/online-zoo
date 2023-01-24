import './menu.scss';
import BaseComponent from '../base-component';
import MenuItem from './menu-item/menu-item';

export default class Menu extends BaseComponent {
  private readonly items: MenuItem[] = [];

  constructor() {
    super('ul', ['menu'], '');
    this.items.push(
      new MenuItem('Garage', 'garage', 'garage-icon'),
      new MenuItem('Winners', 'winners', 'trophy-icon'),
    );
    this.items.map((el) => this.insertChild(el));
  }
}
