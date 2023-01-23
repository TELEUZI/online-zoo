import { createCar, deleteCar, getCars, updateCar } from '@/api/car-api';
import type { CarApiResponse, ICar } from '@/interfaces/car-api';
import APIConstants from '@/enums/api-constants';
import getRandomName, { getRandomColor } from '@/utils/random-name-generator';

export const NUMERIC_SYSTEM = 10;
export default abstract class CarsService {
  static async getCars(page: number, limit?: number): Promise<ICar[]> {
    const cars = await getCars(page, limit);
    return cars.items;
  }

  static async getCarsCount(page = 1): Promise<number> {
    return parseInt((await getCars(page, APIConstants.garageCarLimit)).count, NUMERIC_SYSTEM);
  }

  static async createCars(): Promise<void> {
    await Promise.all(
      Array.from({ length: 100 }, () =>
        createCar({ name: getRandomName(), color: getRandomColor() }),
      ),
    );
  }

  static async createCar(name: string, color: string): Promise<void> {
    await createCar({ name, color });
  }

  static deleteCar(id: number): Promise<CarApiResponse> {
    return deleteCar(id);
  }

  static updateCar(id: number, name: string, color: string): Promise<CarApiResponse> {
    return updateCar(id, {
      name,
      color,
    });
  }
}
