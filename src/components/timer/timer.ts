import { NUMERIC_SYSTEM } from '@/constants';
import type Time from '../../interfaces/time';
import TimerModel from './timer-model';
import TimerView from './timer-view';

const ZERO_IN_SYSTEM = 0;
export default class Timer {
  private readonly model: TimerModel;

  private readonly view: TimerView;

  private currentTime = '';

  constructor() {
    this.view = new TimerView();
    this.model = new TimerModel();
    this.model.onTick = this.updateView.bind(this);
  }

  public getTime(): string {
    return this.getCurrentTime(this.model.getTime());
  }

  public start(delay = ZERO_IN_SYSTEM): void {
    setTimeout(() => {
      this.model.start();
    }, delay);
  }

  public reset(): void {
    this.model.reset();
  }

  public getSeconds(): number {
    return this.model.getSeconds();
  }

  private updateView(currentTime: Time): void {
    this.view.setTime(this.getCurrentTime(currentTime));
  }

  private getCurrentTime(currentTime: Time): string {
    const leasValuableNumber = 1;
    const numberBeforeChange = NUMERIC_SYSTEM - leasValuableNumber;
    this.currentTime = `${
      currentTime.minutes <= numberBeforeChange ? `0${currentTime.minutes}` : currentTime.minutes
    }:${
      currentTime.seconds <= numberBeforeChange ? `0${currentTime.seconds}` : currentTime.seconds
    }`;
    return this.currentTime;
  }
}
