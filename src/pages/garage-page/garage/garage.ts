import GarageModel from '../../../services/garage-model';
import BaseComponent from '../../../components/base-component';
import Button from '../../../components/button/button';
import CarTrack from '../garage-components/car-track';

export default class Garage extends BaseComponent {
  private raceButton: Button;

  private stopButton: Button;

  private model: GarageModel;

  constructor(
    private onRaceStart: () => void,
    private onRaceEnd: (winnerCar: CarTrack) => void,
    private onPaginate: () => void,
    private carOnUpdate: () => void,
  ) {
    super('div', ['garage']);
    this.model = new GarageModel();
    this.raceButton = new Button('Start Race', [], this.animateAllCars.bind(this));
    this.stopButton = new Button('Stop Race', [], this.stopAllCars.bind(this));
  }

  async createGarage(page?: number): Promise<void> {
    this.stopButton.setAttribute('disabled', 'disabled');
    this.destroyChildren();
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
    this.destroyChildren();
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
