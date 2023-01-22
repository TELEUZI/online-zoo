import Time from '../../interfaces/time';
import TimerModel from './timer-model';
import TimerView from './timer-view';

const lastSingleDigitWithLeadingZero = 9;
export default class Timer {
  private model: TimerModel;

  private view: TimerView;

  private isRunning = true;

  private currentTime = '';

  constructor() {
    this.view = new TimerView();
    this.model = new TimerModel();
    this.model.onTick = this.updateView.bind(this);
  }

  getCurrentTime(currentTime: Time): string {
    this.currentTime = `${
      currentTime.minutes <= lastSingleDigitWithLeadingZero
        ? `0${currentTime.minutes}`
        : currentTime.minutes
    }:${
      currentTime.seconds <= lastSingleDigitWithLeadingZero
        ? `0${currentTime.seconds}`
        : currentTime.seconds
    }`;
    return this.currentTime;
  }

  getTime(): string {
    return this.getCurrentTime(this.model.getTime());
  }

  updateView(currentTime: Time): void {
    this.view.setTime(this.getCurrentTime(currentTime));
  }

  start(delay: number): void {
    setTimeout(() => {
      this.model.start();
    }, delay);
  }

  getNode(): HTMLElement {
    return this.view.getNode();
  }

  toggle(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.model.stop();
    } else {
      this.isRunning = true;
      this.model.start();
    }
  }

  reset(): void {
    this.model.reset();
  }

  getSeconds(): number {
    return this.model.getSeconds();
  }
}
