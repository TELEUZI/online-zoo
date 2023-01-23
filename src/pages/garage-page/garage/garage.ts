import AnimationControls from '@/components/controls/animation-controls/animation-controls';
import CarsService from '@/services/car-service';
import BaseComponent from '@/components/base-component';
import type { ICar } from '@/interfaces/car-api';
import CarTrack from '../car-track/car-track';

export default class Garage extends BaseComponent {
  carTracks: CarTrack[] = [];

  private readonly animationControls: AnimationControls;

  private cancelRace = false;

  constructor(
    private onRaceStart: () => void,
    private onRaceEnd: (winnerCar: ICar) => void,
    private onPaginate: () => void,
  ) {
    super('div', ['garage']);
    this.animationControls = new AnimationControls(
      this.animateAllCars.bind(this),
      this.stopAllCars.bind(this),
      ['garage__controls'],
      {
        start: {
          textContent: 'Start race',
        },
        stop: {
          textContent: 'Stop race',
        },
      },
    );
  }

  async createGarage(page?: number): Promise<void> {
    this.destroyChildren();
    this.onPaginate();
    const header = new BaseComponent(
      'h2',
      ['page__name'],
      `Garage (${await CarsService.getCarsCount()})`,
    );
    const pageNumber = new BaseComponent('h3', ['page__number'], `Page #(${page})`);
    const cars = await CarsService.getCars(page ?? 0);
    this.carTracks = cars.map(
      (car) =>
        new CarTrack(car, () => {
          return this.updateGarage(page ?? 0);
        }),
    );
    this.prependChildren([...this.carTracks, this.animationControls, pageNumber, header]);
  }

  async animateAllCars(): Promise<void> {
    this.onRaceStart();
    Promise.any(this.carTracks.map((car) => car.animateCar())).then((res) => {
      if (!this.cancelRace) {
        this.onRaceEnd(res);
      } else {
        this.cancelRace = false;
      }
    });
  }

  async stopAllCars(): Promise<Awaited<void>> {
    return Promise.all(this.carTracks.map((car) => car.stopCarAnimation())).then(() => {
      this.cancelRace = true;
    });
  }

  updateGarage(page: number): Promise<void> {
    this.destroyChildren();
    return this.createGarage(page);
  }
}
