import { getCars } from '../api/car-api';
import ICar from '../interfaces/car-api';
import CarTrack from '../pages/garage-page/garage-components/car-track';
import CarModel from './car-model';

export default class GarageModel extends CarModel {
  carTracks: CarTrack[] = [];

  carsCount = 0;

  async getCars(page: number): Promise<CarTrack[]> {
    this.carTracks = [];
    const cars = await getCars(page);
    this.carsCount = cars.items.length;
    cars.items.forEach((car: ICar) =>
      this.carTracks.push(new CarTrack(car.name, car.color, car.id)),
    );
    return this.carTracks;
  }
}
