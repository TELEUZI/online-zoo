import { getCars } from '../../../api/car-api';
import ICar from '../../../interfaces/car-api';
import CarModel from '../../car-model';
import CarTrack from '../garage-components/car-track';

export default class GarageModel extends CarModel {
  carTracks: CarTrack[] = [];

  async getCars(page: number): Promise<CarTrack[]> {
    this.carTracks = [];
    const cars = await getCars(page);
    cars.items.forEach((car: ICar) =>
      this.carTracks.push(new CarTrack(car.name, car.color, car.id)),
    );
    return this.carTracks;
  }
}
