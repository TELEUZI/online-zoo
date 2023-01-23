import './menu-item.scss';
import BaseComponent from '../../base-component';
import Link from '../../link/link';
import Icon from '../icon/icon';

export default class MenuItem extends BaseComponent {
  private readonly icon: Icon;

  private readonly link: Link;

  constructor(textContent: string, href: string, iconClass?: string) {
    super('li', ['menu__item'], '');
    this.link = new Link(textContent, href);
    this.icon = new Icon(['menu-icon', iconClass ?? '']);
    this.insertChild(this.icon);
    this.insertChild(this.link);
  }
}
