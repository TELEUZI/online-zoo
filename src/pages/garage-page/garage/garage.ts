import GarageModel from './garage-model';
import BaseComponent from '../../../components/base-component';
import Button from '../../../components/button/button';
import CarTrack from '../garage-components/car-track';

export default class Garage extends BaseComponent {
  onRaceStart: () => void;

  onRaceEnd: (winnerCar: CarTrack) => void;

  onPaginate: () => void;

  carOnUpdate: () => void;

  private raceButton: Button;

  private stopButton: Button;

  model: GarageModel;

  constructor(
    onRaceStart: () => void,
    onRaceEnd: (winnerCar: CarTrack) => void,
    onPaginate: () => void,
    carOnUpdate: () => void,
  ) {
    super('div', ['garage']);
    this.carOnUpdate = carOnUpdate;
    this.onRaceStart = onRaceStart;
    this.onRaceEnd = onRaceEnd;
    this.onPaginate = onPaginate;
    this.model = new GarageModel();
    this.raceButton = new Button('Start Race', [], this.animateAllCars.bind(this));
    this.stopButton = new Button('Stop Race', [], this.stopAllCars.bind(this));
  }

  async createGarage(page?: number): Promise<void> {
    this.stopButton.setAttribute('disabled', 'disabled');
    this.node.innerHTML = '';
    this.onPaginate();
    const header = new BaseComponent(
      'h2',
      ['page__name'],
      `Garage (${await this.model.getCarsCount()})`,
    );
    const pageNumber = new BaseComponent('h3', ['page__number'], `Page #(${page})`);
    const carTracks = await this.model.getCars(page);
    const raceControls = new BaseComponent('div', ['garage__controls']);
    raceControls.appendChildren([this.stopButton, this.raceButton]);
    carTracks.forEach((car) => {
      car.setOnUpdate(this.updateGarage.bind(this));
      this.prepend(car);
    });
    this.prependChildren([raceControls, pageNumber, header]);
  }

  async animateAllCars(): Promise<void> {
    this.toggleRaceMode();
    this.onRaceStart();
    Promise.any(this.model.carTracks.map(async (car) => car.animateCar()))
      .then((res: CarTrack) => this.onRaceEnd(res))
      .catch();
  }

  async stopAllCars(): Promise<void> {
    this.toggleDefaultMode();
    this.model.carTracks.forEach((car) => car.stopCarAnimation());
  }

  updateGarage(): void {
    this.node.innerHTML = '';
    this.carOnUpdate();
  }

  toggleRaceMode(): void {
    this.stopButton.removeAttribute('disabled');
    this.raceButton.setAttribute('disabled', 'disabled');
  }

  toggleDefaultMode(): void {
    this.raceButton.removeAttribute('disabled');
    this.stopButton.setAttribute('disabled', 'disabled');
  }
}
