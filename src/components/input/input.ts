import ValidType from '../../enums/input-types';
import BaseComponent from '../base-component';

export default class Input extends BaseComponent {
  public onInput?: (input: HTMLInputElement) => boolean;

  protected input: HTMLInputElement;

  private isValid = true;

  constructor(type: string, classlist: string[], placeholder?: string, value?: number | string) {
    super('input', ['input', ...classlist], '');
    this.input = this.node as HTMLInputElement;
    this.setAttributes(type, placeholder ?? '', value ?? '');
    this.input.addEventListener('input', () => {
      this.checkValidation();
    });
  }

  public getValue(): string {
    return this.input.value;
  }

  public setValue(value: string): void {
    this.input.value = value;
  }

  private checkValidation(): void {
    if (this.onInput) {
      this.input.reportValidity();
      this.isValid = this.onInput(this.input);
      this.input.classList.add(this.isValid ? ValidType.Valid : ValidType.Invalid);
      this.input.classList.remove(this.isValid ? ValidType.Invalid : ValidType.Valid);
    }
  }

  private setAttributes(type: string, placeholder: string, value: number | string): void {
    this.setAttribute('type', type);
    this.setAttribute('placeholder', placeholder);
    if (value) {
      this.setAttribute('value', value.toString());
    }
  }
}
