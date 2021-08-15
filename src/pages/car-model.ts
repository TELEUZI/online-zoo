import { getCars } from '../api/car-api';
import APIConstants from '../enums/api-constants';
import { CarApiResponse } from '../interfaces/car-api';

export const NUMERIC_SYSTEM = 10;
export default abstract class CarModel {
  getCarsFunc: (page: number, limit?: APIConstants) => Promise<CarApiResponse>;

  constructor() {
    this.getCarsFunc = getCars;
  }

  async getCarsCount(page = 1): Promise<number> {
    return parseInt(
      (await this.getCarsFunc(page, APIConstants.garageCarLimit)).count,
      NUMERIC_SYSTEM,
    );
  }
}
