import { createCar, deleteCar, getCars, updateCar } from '@/api/car-api';
import type { CarApiResponse, ICar } from '@/interfaces/car-api';
import getRandomName, { getRandomColor } from '@/utils/random-name-generator';
import Observable from '@/utils/observable';
import WinnersService from '@/services/winners-service';
import { NUMERIC_SYSTEM } from '@/constants';

const CARS_INITIAL_COUNT = 0;

export default abstract class CarsService {
  public static readonly carsCount = new Observable<number>(CARS_INITIAL_COUNT);

  public static async getCars(page: number, limit?: number): Promise<ICar[]> {
    const cars = await getCars(page, limit);
    this.carsCount.notify(parseInt(cars.count, NUMERIC_SYSTEM));
    return cars.items;
  }

  public static getCarsCount(): Promise<number> {
    return Promise.resolve(CarsService.carsCount.getValue());
  }

  public static createCars(): Promise<void> {
    const size = 100;
    return Promise.all(
      Array.from({ length: size }, () =>
        createCar({ name: getRandomName(), color: getRandomColor() }),
      ),
    ).then(() => {
      this.carsCount.notify((val) => val + size);
    });
  }

  public static createCar(name: string, color: string): Promise<void> {
    return createCar({ name, color }).then(() => {
      const createdCount = 1;
      this.carsCount.notify((val) => val + createdCount);
    });
  }

  public static deleteCar(id: number): Promise<void> {
    return Promise.all([WinnersService.deleteWinner(id), deleteCar(id)]).then(() => {
      const deletedCount = 1;
      this.carsCount.notify((val) => val - deletedCount);
    });
  }

  public static updateCar(id: number, name: string, color: string): Promise<CarApiResponse> {
    return updateCar(id, {
      name,
      color,
    });
  }
}
