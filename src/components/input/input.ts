import ValidType from '../../enums/input-types';
import BaseComponent from '../base-component';

export default class Input extends BaseComponent {
  onInput?: (input: HTMLInputElement) => boolean;

  protected input: HTMLInputElement;

  isValid = true;

  constructor(type: string, classlist: string[], placeholder?: string, value?: string | number) {
    super('input', ['input', ...classlist], '');
    this.input = <HTMLInputElement>this.node;
    this.setAttributes(type, placeholder ?? '', value ?? '');
    this.createListeners();
  }

  checkValidation(): void {
    if (this.onInput) {
      this.input.reportValidity();
      this.isValid = this?.onInput(this.input);
      this.input.classList.add(this.isValid ? ValidType.valid : ValidType.invalid);
      this.input.classList.remove(this.isValid ? ValidType.invalid : ValidType.valid);
    }
  }

  setAttributes(type: string, placeholder: string, value: string | number): void {
    this.setAttribute('type', type);
    this.setAttribute('placeholder', placeholder);
    if (value) {
      this.setAttribute('value', value.toString());
    }
  }

  createListeners(): void {
    this.input.addEventListener('input', () => {
      this.checkValidation();
    });
    this.input.addEventListener('invalid', () => {}, false);
  }

  getValue(): string {
    return this.input.value;
  }

  getNode(): HTMLInputElement {
    return <HTMLInputElement>this.node;
  }

  setValue(value: string): void {
    this.input.value = value;
  }
}
