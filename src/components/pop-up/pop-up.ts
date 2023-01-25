import BaseComponent from '../base-component';
import Button from '../button/button';

export default class PopUpWindow extends BaseComponent {
  private okButton: Button;

  constructor(popUpText: string, private readonly onOkClick?: () => void) {
    super('div', [], popUpText);
    this.node.innerText = popUpText;
    this.okButton = new Button('ok', [], this.okButtonHandler.bind(this));
    this.insertChild(this.okButton);
  }

  public okButtonHandler = (): void => {
    this.node.innerText = '';
    this.okButton = new Button('ok', [], this.okButtonHandler.bind(this));
    this.insertChild(this.okButton);
    this.onOkClick?.();
  };
}
