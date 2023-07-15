import BaseComponent from '../../../components/base-component';
import Input from '../../../components/input/input';
import CarImageComponent from '../car-image/car-image';

export default class Car extends BaseComponent {
  public readonly carNameUpdate: Input;

  public readonly carColorUpdate: Input;

  private color: string;

  private name: string;

  private readonly carImage: CarImageComponent;

  private readonly carName: BaseComponent;

  constructor(name: string, color: string) {
    super('div', ['car-container']);
    this.name = name;
    this.color = color;

    const carInfoWrapper = new BaseComponent('div', ['car-container__info']);
    this.carImage = new CarImageComponent(this.color);
    this.carName = new BaseComponent('label', ['car-name'], name);
    this.carNameUpdate = new Input('text', ['task__input', 'hidden']);
    this.carColorUpdate = new Input('color', ['task__input', 'hidden']);
    this.carNameUpdate.setValue(name);
    this.carColorUpdate.setValue(color);
    carInfoWrapper.appendChildren([this.carName, this.carNameUpdate, this.carColorUpdate]);
    this.appendChildren([carInfoWrapper, this.carImage]);
  }

  public setColor(color: string): void {
    this.color = color;
    this.carImage.setColor(color);
  }

  public setName(name: string): void {
    this.name = name;
    this.carName.setContent(name);
  }

  public getName(): string {
    return this.name;
  }

  public getColor(): string {
    return this.color;
  }

  public startAnimation(duration: string): void {
    this.carImage.setAnimationParams({
      name: 'slide',
      duration,
      playState: 'running',
      fillMode: 'forwards',
    });
  }

  public stopAnimation(): void {
    this.carImage.clearAnimation();
  }

  public pauseAnimation(): void {
    this.carImage.setPlayState('paused');
  }

  public toggleUpdateMode(): void {
    this.carName.toggleClass('hidden');
    this.carNameUpdate.toggleClass('hidden');
    this.carColorUpdate.toggleClass('hidden');
  }

  public getSVG(): string {
    return this.carImage.getSVG();
  }

  public updateValuesFromForm(): void {
    this.setName(this.carNameUpdate.getValue());
    this.setColor(this.carColorUpdate.getValue());
  }
}
