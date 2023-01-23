import BaseComponent from '@/components/base-component';
import Button from '@/components/button/button';

export interface ButtonConfig {
  textContent: string;
}

export interface ControlsConfig {
  start: ButtonConfig;
  stop: ButtonConfig;
}

export default abstract class Controls extends BaseComponent {
  protected readonly startButton: Button;

  protected readonly stopButton: Button;

  protected constructor(
    onStart: () => Promise<unknown>,
    onStop: () => Promise<unknown>,
    containerClasses: string[] = [],
    { start, stop }: ControlsConfig = {
      start: { textContent: 'Start' },
      stop: { textContent: 'Stop' },
    },
  ) {
    super('div', ['controls', ...(containerClasses ?? [])]);
    this.startButton = new Button(start.textContent, ['start-button'], () => {
      this.handleEmits(onStart, this.setStartState.bind(this), 'after');
    });
    this.stopButton = new Button(stop.textContent, ['stop-button'], () => {
      this.handleEmits(onStop, this.setStopState.bind(this), 'before');
    });
    this.stopButton.setAttribute('disabled', 'disabled');
    this.appendChildren([this.startButton, this.stopButton]);
  }

  abstract handleEmits(
    callback: () => Promise<unknown>,
    stateHandler: Controls['setStartState'] | Controls['setStopState'],
    emitMoment?: 'before' | 'after',
  ): void;

  private setStartState(): void {
    this.startButton.setAttribute('disabled', 'disabled');
    this.stopButton.removeAttribute('disabled');
  }

  private setStopState(): void {
    this.stopButton.setAttribute('disabled', 'disabled');
    this.startButton.removeAttribute('disabled');
  }
}
