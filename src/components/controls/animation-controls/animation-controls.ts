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
}
