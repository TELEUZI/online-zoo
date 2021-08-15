import { createCar } from '../../api/car-api';
import { getWinners, createWinner, updateWinner } from '../../api/winners-api';
import getRandomName, { getRandomColor } from '../../utils/random-name-generator';
import CarModel from '../car-model';
import CarTrack from './garage-components/car-track';

export default class GaragePageModel extends CarModel {
  static async createWinner(page: number, car: CarTrack, time: number): Promise<void> {
    const cars = await getWinners(page);
    const winner = cars.items.find((cart) => cart.id === car.getId());
    if (typeof winner === 'undefined') {
      createWinner({ id: car.getId(), wins: 1, time });
    } else {
      updateWinner(car.getId(), {
        wins: (winner.wins += 1),
        time: winner.time > time ? time : winner.time,
      });
    }
  }

  static async сreateCars(): Promise<void> {
    for (let i = 0; i < 100; i += 1) {
      createCar({ name: getRandomName(), color: getRandomColor() });
    }
  }

  static createCar(name: string, color: string): void {
    createCar({ name, color });
  }
}
