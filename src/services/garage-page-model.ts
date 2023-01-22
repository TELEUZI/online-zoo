import { createCar } from '../api/car-api';
import { getWinners, createWinner, updateWinner } from '../api/winners-api';
import getRandomName, { getRandomColor } from '../utils/random-name-generator';
import CarModel from './car-model';
import CarTrack from '../pages/garage-page/garage-components/car-track';

export default class GaragePageModel extends CarModel {
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
}
