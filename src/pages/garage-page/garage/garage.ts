import CarsService from '../../../services/car-service';
import BaseComponent from '../../../components/base-component';
import Button from '../../../components/button/button';
import CarTrack from '../garage-components/car-track';
import type { ICar } from '../../../interfaces/car-api';

export default class Garage extends BaseComponent {
  private raceButton: Button;

  private stopButton: Button;

  carTracks: CarTrack[] = [];

  constructor(
    private onRaceStart: () => void,
    private onRaceEnd: (winnerCar: ICar) => void,
    private onPaginate: () => void,
    private carOnUpdate: () => void,
  ) {
    super('div', ['garage']);
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
      `Garage (${await CarsService.getCarsCount()})`,
    );
    const pageNumber = new BaseComponent('h3', ['page__number'], `Page #(${page})`);
    const cars = await CarsService.getCars(page ?? 0);
    const raceControls = new BaseComponent('div', ['garage__controls']);
    raceControls.appendChildren([this.stopButton, this.raceButton]);
    this.carTracks = cars.map((car) => new CarTrack(car.name, car.color, car.id));
    this.carTracks.forEach((car) => {
      car.setOnUpdate(this.updateGarage.bind(this));
      this.prepend(car);
    });
    this.prependChildren([raceControls, pageNumber, header]);
  }

  async animateAllCars(): Promise<void> {
    this.toggleRaceMode();
    this.onRaceStart();
    Promise.any(this.carTracks.map((car) => car.animateCar())).then((res) => this.onRaceEnd(res));
  }

  async stopAllCars(): Promise<void> {
    this.toggleDefaultMode();
    this.carTracks.forEach((car) => car.stopCarAnimation());
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
