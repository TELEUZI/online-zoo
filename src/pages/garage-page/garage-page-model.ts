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
      await createWinner({ id: car.getId(), wins: 1, time });
    } else {
      await updateWinner(car.getId(), {
        wins: (winner.wins += 1),
        time: winner.time > time ? time : winner.time,
      });
    }
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
}
