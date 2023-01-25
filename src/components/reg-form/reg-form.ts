import BaseComponent from '../base-component';
import Input from '../input/input';

export interface CarCharacteristics {
  name: string;
  color: string;
}
export default class CarForm extends BaseComponent {
  private readonly colorInput: Input;

  private readonly submit: Input;

  private readonly inputs: Input[] = [];

  private readonly reset: Input;

  private readonly carNameInput: Input;

  constructor(
    classList: string[],
    private readonly onSubmit?: (CarCharacteristics: CarCharacteristics) => void,
  ) {
    super('form', ['form', ...classList], '');
    this.setAttribute('action', '');
    this.carNameInput = new Input('text', ['form__car-input_text'], 'Car name');
    this.colorInput = new Input('color', ['form__car-input_color']);
    this.inputs.push(this.carNameInput, this.colorInput);

    this.reset = new Input('reset', ['form__car-input_control'], '', 'Reset');
    this.submit = new Input('submit', ['form__car-input_control'], '', 'Create');

    const inputsWrapper = new BaseComponent('div', ['form__inputs-wrapper']);
    inputsWrapper.appendChildren(this.inputs);

    const formControls = new BaseComponent('div', ['form__controls']);
    formControls.appendChildren([this.reset, this.submit]);

    this.appendChildren([inputsWrapper, formControls]);

    this.reset.addListener('click', (e: Event) => {
      e.preventDefault();
      this.resetForm();
    });

    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      const [name, color] = [...this.inputs.map((input) => input.getValue())];
      this.onSubmit?.({ name: name || 'Default', color });
      this.resetForm();
    });
  }

  private resetForm(): void {
    this.carNameInput.setValue('');
    this.colorInput.setValue('#000000');
  }
}
