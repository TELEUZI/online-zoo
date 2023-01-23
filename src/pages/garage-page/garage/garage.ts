import AnimationControls from '@/components/controls/animation-controls/animation-controls';
import CarsService from '@/services/car-service';
import BaseComponent from '@/components/base-component';
import type { ICar } from '@/interfaces/car-api';
import CarTrack from '../car-track/car-track';

export default class Garage extends BaseComponent {
  private carTracks: CarTrack[] = [];

  private readonly animationControls: AnimationControls;

  private cancelRace = false;

  private readonly tracksContainer: BaseComponent;

  private readonly header: BaseComponent;

  private readonly pageNumber: BaseComponent;

  private raceEnded = false;

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
    this.tracksContainer = new BaseComponent('div', ['garage__tracks']);
    this.header = new BaseComponent('h2', ['page__name'], `Garage (0)`);
    this.pageNumber = new BaseComponent('h3', ['page__number'], `Page #(0)`);
    this.prependChildren([
      this.tracksContainer,
      this.animationControls,
      this.pageNumber,
      this.header,
    ]);

    CarsService.carsCount.subscribe((count) => {
      this.header.setContent(`Garage (${count})`);
    });
  }

  async createGarage(page: number): Promise<void> {
    this.onPaginate();
    return this.updateTracksNumber(page);
  }

  private async updateTracks(page: number): Promise<void> {
    this.destroyCarTracks();
    const cars = await CarsService.getCars(page ?? 0);
    this.carTracks = cars.map(
      (car) =>
        new CarTrack(car, () => {
          return this.updateGarageWithPagination(page ?? 0);
        }),
    );
    this.tracksContainer.appendChildren([...this.carTracks]);
  }

  private async animateAllCars(): Promise<void> {
    this.onRaceStart();
    Promise.any(this.carTracks.map((car) => car.animateCar())).then((res) => {
      if (!this.cancelRace) {
        this.onRaceEnd(res);
      } else {
        this.cancelRace = false;
      }
      this.raceEnded = true;
    });
  }

  private async stopAllCars(): Promise<Awaited<void>[]> {
    if (!this.raceEnded) {
      this.cancelRace = true;
    }
    return Promise.all(this.carTracks.map((car) => car.stopCarAnimation()));
  }

  async updateTracksNumber(page: number): Promise<void> {
    this.pageNumber.setContent(`Page #(${page})`);
    return this.updateTracks(page);
  }

  async updateGarageWithPagination(page: number): Promise<void> {
    this.onPaginate();
    return this.updateTracks(page);
  }

  private destroyCarTracks(): void {
    this.tracksContainer.destroyChildren();
  }
}
