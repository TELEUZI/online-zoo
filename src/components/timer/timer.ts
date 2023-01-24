import { NUMERIC_SYSTEM } from '@/services/car-service';
import type Time from '../../interfaces/time';
import TimerModel from './timer-model';
import TimerView from './timer-view';

export default class Timer {
  private model: TimerModel;

  private view: TimerView;

  private currentTime = '';

  constructor() {
    this.view = new TimerView();
    this.model = new TimerModel();
    this.model.onTick = this.updateView.bind(this);
  }

  getTime(): string {
    return this.getCurrentTime(this.model.getTime());
  }

  start(delay = 0): void {
    setTimeout(() => {
      this.model.start();
    }, delay);
  }

  reset(): void {
    this.model.reset();
  }

  getSeconds(): number {
    return this.model.getSeconds();
  }

  private updateView(currentTime: Time): void {
    this.view.setTime(this.getCurrentTime(currentTime));
  }

  private getCurrentTime(currentTime: Time): string {
    this.currentTime = `${
      currentTime.minutes <= NUMERIC_SYSTEM - 1 ? `0${currentTime.minutes}` : currentTime.minutes
    }:${
      currentTime.seconds <= NUMERIC_SYSTEM - 1 ? `0${currentTime.seconds}` : currentTime.seconds
    }`;
    return this.currentTime;
  }
}
