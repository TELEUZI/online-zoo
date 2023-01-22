import './link.scss';
import BaseComponent from '../base-component';
import Router from '../../router';

export default class Link extends BaseComponent {
  constructor(textContent: string, href: string) {
    super('a', ['link'], textContent);
    this.setAttribute('href', href);
    this.node.addEventListener('click', this.changeRoute);
  }

  private changeRoute = (event: Event) => {
    event.preventDefault();
    const { currentTarget } = event;
    if (currentTarget instanceof HTMLAnchorElement) {
      window.history.pushState({}, '', currentTarget.href);
      Router.onPathChangeHandler();
    }
  };
}
