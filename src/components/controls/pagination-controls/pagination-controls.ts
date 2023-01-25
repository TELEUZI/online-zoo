import Controls from '@/components/controls/controls';

interface ButtonConfig {
  textContent: string;
}

interface ControlsConfig {
  start: ButtonConfig;
  stop: ButtonConfig;
}

export default class PaginationControls extends Controls {
  constructor(
    onStart: () => Promise<unknown>,
    onStop: () => Promise<unknown>,
    containerClasses: string[] = [],
    config: ControlsConfig = {
      start: { textContent: 'Next page' },
      stop: { textContent: 'Previous page' },
    },
  ) {
    super(onStart, onStop, ['pagination-controls', ...containerClasses], config);
  }

  public updateControlsState(isStartButtonDisabled: boolean, isStopButtonDisabled: boolean): void {
    if (isStartButtonDisabled) {
      this.startButton.setAttribute('disabled', 'disabled');
    } else {
      this.startButton.removeAttribute('disabled');
    }
    if (isStopButtonDisabled) {
      this.stopButton.setAttribute('disabled', 'disabled');
    } else {
      this.stopButton.removeAttribute('disabled');
    }
  }

  protected handleEmits(
    callback: () => Promise<unknown>,
    stateHandler: PaginationControls['setStartState'] | PaginationControls['setStopState'],
  ): void {
    callback().then(() => {
      stateHandler();
    });
  }
}
