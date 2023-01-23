import Button from '@/components/button/button';

export default class EditButton extends Button {
  constructor(onClick: () => void) {
    super('Edit', ['task__edit-btn'], onClick);
  }

  moveToEditState(onClick: () => void): void {
    this.setContent('Edit');
    this.updateOnClick(onClick);
  }

  moveToSubmitState(onClick: () => void): void {
    this.setContent('Submit');
    this.updateOnClick(onClick);
  }
}
