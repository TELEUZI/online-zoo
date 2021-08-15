import BaseComponent from '../base-component';
import Button from '../button/button';

export default class PopUpWindow extends BaseComponent {
  onOkClick: () => void;

  private okButton: Button;

  constructor(popUpText: string) {
    super('div', [], popUpText);
    this.node.innerText = popUpText;
    this.okButton = new Button('ok', [], this.okButtonHandler.bind(this));
    this.insertChild(this.okButton);
  }

  okButtonHandler = (): void => {
    this.node.innerText = '';
    this.okButton = new Button('ok', [], this.okButtonHandler.bind(this));
    this.insertChild(this.okButton);
    this.onOkClick?.();
  };

  close(): void {
    this.toggleClass('hidden');
  }
}
