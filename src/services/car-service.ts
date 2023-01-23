import { createCar, deleteCar, getCars, updateCar } from '@/api/car-api';
import type { CarApiResponse, ICar } from '@/interfaces/car-api';
import getRandomName, { getRandomColor } from '@/utils/random-name-generator';
import { deleteWinner } from '@/api/winners-api';
import Observable from '@/utils/Observable';

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

  static async createCars(): Promise<void> {
    await Promise.all(
      Array.from({ length: 100 }, () =>
        createCar({ name: getRandomName(), color: getRandomColor() }),
      ),
    );
    this.carsCount.notify((val) => val + 100);
  }

  static async createCar(name: string, color: string): Promise<void> {
    await createCar({ name, color });
    this.carsCount.notify((val) => val + 1);
  }

  static deleteCar(id: number): Promise<CarApiResponse> {
    this.carsCount.notify((val) => val - 1);
    return deleteWinner(id).then(() => deleteCar(id));
  }

  static updateCar(id: number, name: string, color: string): Promise<CarApiResponse> {
    return updateCar(id, {
      name,
      color,
    });
  }
}
