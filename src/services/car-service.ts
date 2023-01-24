import { createCar, deleteCar, getCars, updateCar } from '@/api/car-api';
import type { CarApiResponse, ICar } from '@/interfaces/car-api';
import getRandomName, { getRandomColor } from '@/utils/random-name-generator';
import Observable from '@/utils/observable';
import WinnersService from '@/services/winners-service';

export const NUMERIC_SYSTEM = 10;
export default abstract class CarsService {
  static readonly carsCount = new Observable<number>(0);

  static async getCars(page: number, limit?: number): Promise<ICar[]> {
    const cars = await getCars(page, limit);
    this.carsCount.notify(parseInt(cars.count, NUMERIC_SYSTEM));
    return cars.items;
  }

  static async getCarsCount(): Promise<number> {
    return CarsService.carsCount.getValue();
  }

  static createCars(): Promise<void> {
    const size = 100;
    return Promise.all(
      Array.from({ length: size }, () =>
        createCar({ name: getRandomName(), color: getRandomColor() }),
      ),
    ).then(() => {
      this.carsCount.notify((val) => val + size);
    });
  }

  static createCar(name: string, color: string): Promise<void> {
    return createCar({ name, color }).then(() => {
      this.carsCount.notify((val) => val + 1);
    });
  }

  static deleteCar(id: number): Promise<void> {
    return Promise.all([WinnersService.deleteWinner(id), deleteCar(id)]).then(() => {
      this.carsCount.notify((val) => val - 1);
    });
  }

  static updateCar(id: number, name: string, color: string): Promise<CarApiResponse> {
    return updateCar(id, {
      name,
      color,
    });
  }
}
