import BaseComponent from '../base-component';
import Input from '../input/input';

export interface CarChars {
  name: string;
  color: string;
}
export default class CarForm extends BaseComponent {
  colorInput: Input;

  submit: Input;

  inputs: Input[] = [];

  onSubmit: (carChars: CarChars) => void;

  reset: Input;

  carNameInput: Input;

  constructor(classlist: string[]) {
    super('form', ['form', ...classlist], '');
    this.setAttribute('action', '');
    this.createFormComponents();

    this.inputs.push(this.carNameInput, this.colorInput);
    this.createUI();
    this.addUserInputListeners();
  }

  addUserInputListeners(): void {
    this.reset.addListener('click', (e: Event) => {
      e.preventDefault();
      this.resetForm();
    });
    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      const [name, color] = [...this.inputs.map((input) => input.getValue())];
      this?.onSubmit({ name, color });
      this.resetForm();
    });
  }

  onValidate(): void {
    if (this.inputs.every((el) => el.isValid)) {
      this.submit.removeAttribute('disabled');
    }
  }

  resetForm(): void {
    this.carNameInput.getNode().value = '';
    this.colorInput.getNode().value = '#000000';
  }

  private createFormComponents(): void {
    this.carNameInput = new Input('text', ['form__car-input_text'], 'Car name');
    this.colorInput = new Input('color', ['form__car-input_color']);

    this.reset = new Input('reset', ['form__car-input_control'], '', 'Reset');
    this.submit = new Input('submit', ['form__car-input_control'], '', 'Create');
  }

  private createUI(): void {
    const inputsWrapper = new BaseComponent('div', ['form__inputs-wrapper']);
    const formControls = new BaseComponent('div', ['form__controls']);
    inputsWrapper.insertChilds(this.inputs);
    formControls.insertChilds([this.reset, this.submit]);
    this.insertChilds([inputsWrapper, formControls]);
  }
}
