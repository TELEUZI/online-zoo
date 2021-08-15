import './button.scss';
import BaseComponent from '../base-component';

export default class Button extends BaseComponent {
  onClick: () => void = () => {};

  constructor(textContent: string, buttonClasses?: string[], onClick: () => void = () => {}) {
    super('button', ['button', ...(buttonClasses || [])], textContent);
    this.node.onclick = (e: Event) => {
      e.preventDefault();
      onClick();
    };
  }
}
