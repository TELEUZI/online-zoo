import BaseComponent from '../base-component';

export default class ModalWindow extends BaseComponent {
  private readonly modalWrapper: BaseComponent;

  constructor(private readonly modalContent: BaseComponent, parentNode?: HTMLElement) {
    super('div', ['modal']);
    this.modalWrapper = new BaseComponent('div', ['grey-modal']);
    this.modalContent.addClass('modal-content');
    this.insertChild(this.modalContent);
    this.insertChild(this.modalWrapper);
    if (parentNode) {
      parentNode.appendChild(this.node);
    }
  }

  public toggleModal(): void {
    this.toggleClass('hidden');
  }
}
