import Controls from '@/components/controls/controls';

interface ButtonConfig {
  textContent: string;
}

interface ControlsConfig {
  start: ButtonConfig;
  stop: ButtonConfig;
}

export default class AnimationControls extends Controls {
  constructor(
    onStart: () => Promise<unknown>,
    onStop: () => Promise<unknown>,
    containerClasses: string[] = [],
    { start, stop }: ControlsConfig = {
      start: { textContent: 'Start' },
      stop: { textContent: 'Stop' },
    },
  ) {
    super(onStart, onStop, ['animation-controls', ...(containerClasses ?? [])], { start, stop });
    /*
    this.startButton = new Button(start.textContent, ['start-button'], () => {
      this.handleEmits('after', onStart, this.setStartState.bind(this));
    });
    this.stopButton = new Button(stop.textContent, ['stop-button'], () => {
      this.handleEmits('before', onStop, this.setStopState.bind(this));
    });
    this.stopButton.setAttribute('disabled', 'disabled');
    this.appendChildren([this.startButton, this.stopButton]);
    */
  }

  handleEmits(
    callback: () => Promise<unknown>,
    stateHandler: AnimationControls['setStartState'] | AnimationControls['setStopState'],
    emitMoment: 'before' | 'after',
  ): void {
    if (emitMoment === 'before') {
      callback().then(() => stateHandler());
    } else {
      stateHandler();
      callback();
    }
  }

  /*
  protected setStartState(): void {
    this.startButton.setAttribute('disabled', 'disabled');
    this.stopButton.removeAttribute('disabled');
  }

  protected setStopState(): void {
    this.stopButton.setAttribute('disabled', 'disabled');
    this.startButton.removeAttribute('disabled');
  }
  */
}
