import BaseComponent from '@/components/base-component';
import Button from '@/components/button/button';

interface ButtonConfig {
  textContent: string;
}

interface ControlsConfig {
  start: ButtonConfig;
  stop: ButtonConfig;
}

export default class AnimationControls extends BaseComponent {
  private readonly startButton: Button;

  private readonly stopButton: Button;

  constructor(
    onStart: () => Promise<unknown>,
    onStop: () => Promise<unknown>,
    containerClasses: string[] = [],
    { start, stop }: ControlsConfig = {
      start: { textContent: 'Start' },
      stop: { textContent: 'Stop' },
    },
  ) {
    super('div', ['animation-controls', ...(containerClasses ?? [])]);
    this.startButton = new Button(start.textContent, ['start-button'], () => {
      this.handleEmits('after', onStart, this.setStartState.bind(this));
    });
    this.stopButton = new Button(stop.textContent, ['stop-button'], () => {
      this.handleEmits('before', onStop, this.setStopState.bind(this));
    });
    this.stopButton.setAttribute('disabled', 'disabled');
    this.appendChildren([this.startButton, this.stopButton]);
  }

  private handleEmits(
    emitMoment: 'before' | 'after',
    callback: () => Promise<unknown>,
    stateHandler: AnimationControls['setStartState'] | AnimationControls['setStopState'],
  ): void {
    if (emitMoment === 'before') {
      callback().then(() => stateHandler());
    } else {
      stateHandler();
      callback();
    }
  }

  private setStartState(): void {
    this.startButton.setAttribute('disabled', 'disabled');
    this.stopButton.removeAttribute('disabled');
  }

  private setStopState(): void {
    this.stopButton.setAttribute('disabled', 'disabled');
    this.startButton.removeAttribute('disabled');
  }
}
