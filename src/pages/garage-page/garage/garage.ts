import AnimationControls from '@/components/controls/animation-controls/animation-controls';
import CarsService from '@/services/car-service';
import BaseComponent from '@/components/base-component';
import type { ICar } from '@/interfaces/car-api';
import CarTrack from '../car-track/car-track';

export default class Garage extends BaseComponent {
  private readonly animationControls: AnimationControls;

  private readonly tracksContainer: BaseComponent;

  private readonly header: BaseComponent;

  private readonly pageNumber: BaseComponent;

  private carTracks: CarTrack[] = [];

  private cancelRace = false;

  private raceEnded = false;

  constructor(
    private readonly onRaceStart: () => void,
    private readonly onRaceEnd: (winnerCar: ICar) => void,
    private readonly onPaginate: () => void,
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

  public async createGarage(page: number): Promise<void> {
    this.onPaginate();
    return this.updateTracksNumber(page);
  }

  public async updateTracksNumber(page: number): Promise<void> {
    this.pageNumber.setContent(`Page #(${page})`);
    return this.updateTracks(page);
  }

  public async updateGarageWithPagination(page: number): Promise<void> {
    this.onPaginate();
    return this.updateTracks(page);
  }

  private async updateTracks(page: number): Promise<void> {
    this.destroyCarTracks();
    const cars = await CarsService.getCars(page);
    this.carTracks = cars.map(
      (car) =>
        new CarTrack(car, () => {
          return this.updateGarageWithPagination(page);
        }),
    );
    this.tracksContainer.appendChildren([...this.carTracks]);
  }

  private animateAllCars(): Promise<void> {
    this.onRaceStart();
    return Promise.any(this.carTracks.map((car) => car.animateCar())).then((res) => {
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

  private destroyCarTracks(): void {
    this.tracksContainer.destroyChildren();
  }
}
