import BaseComponent from '@/components/base-component';
import carTemplate from '@/assets/car_inline.svg';

interface AnimationParams {
  name: string;
  duration: string;
  playState: string;
  fillMode: string;
}

export default class CarImageComponent extends BaseComponent {
  constructor(fill = 'black') {
    super('div', ['car-container__image']);
    this.node.innerHTML = carTemplate;
    this.node.style.fill = fill;
  }

  public setSVG(svg: string): void {
    this.node.innerHTML = svg;
  }

  public setColor(color: string): void {
    this.node.style.fill = color;
  }

  public getSVG(): string {
    return this.node.innerHTML;
  }

  public setAnimationParams({ name, duration, playState, fillMode }: AnimationParams): void {
    this.node.style.animationName = name;
    this.node.style.animationDuration = duration;
    this.node.style.animationPlayState = playState;
    this.node.style.animationFillMode = fillMode;
  }

  public setPlayState(playState: string): void {
    this.node.style.animationPlayState = playState;
  }

  public setDuration(duration: string): void {
    this.node.style.animationDuration = duration;
  }

  public setFillMode(fillMode: string): void {
    this.node.style.animationFillMode = fillMode;
  }

  public setAnimationName(name: string): void {
    this.node.style.animationName = name;
  }

  public clearAnimation(): void {
    this.node.style.animation = '';
  }
}
