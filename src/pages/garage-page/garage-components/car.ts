import carTemplate from '../../../assets/car-svg';
import BaseComponent from '../../../components/base-component';
import Input from '../../../components/input/input';

type SvgInHtml = HTMLElement & SVGElement;

export default class Car extends BaseComponent {
  private color: string;

  private name: string;

  private carImage: HTMLElement;

  private carName: BaseComponent;

  carNameUpdate: Input;

  carColorUpdate: Input;

  constructor(name: string, color: string) {
    super('div', ['car-container']);
    const carInfoWrapper = new BaseComponent('div', ['car-container__info']);
    this.carImage = document.createElement('svg') as SvgInHtml;
    this.carImage.style.fill = color;
    this.carImage.innerHTML = carTemplate;
    this.name = name;
    this.color = color;
    this.carName = new BaseComponent('label', ['car-name'], name);
    this.carNameUpdate = new Input('text', ['task__input', 'hidden']);
    this.carColorUpdate = new Input('color', ['task__input', 'hidden']);
    this.carNameUpdate.setValue(name);
    this.carColorUpdate.setValue(color);
    carInfoWrapper.appendChildren([this.carName, this.carNameUpdate, this.carColorUpdate]);
    this.node.append(carInfoWrapper.getNode());
    this.node.append(this.carImage);
  }

  setColor(color: string): void {
    this.color = color;
    this.carImage.style.fill = color;
  }

  setName(name: string): void {
    this.name = name;
    this.carName.setContent(name);
  }

  getName(): string {
    return this.name;
  }

  getColor(): string {
    return this.color;
  }

  startAnimation(duration: string): void {
    this.carImage.style.animationName = 'slide';
    this.carImage.style.animationDuration = duration;
    this.carImage.style.animationPlayState = 'running';
    this.carImage.style.animationFillMode = 'forwards';
  }

  stopAnimation(): void {
    this.carImage.style.animation = '';
  }

  pauseAnimation(): void {
    this.carImage.style.animationPlayState = 'paused';
  }

  setUpdateMode(): void {
    this.carName.toggleClass('hidden');
    this.carNameUpdate.toggleClass('hidden');
    this.carColorUpdate.toggleClass('hidden');
  }

  getSVGInHTML(): string {
    return this.carImage.outerHTML;
  }
}
