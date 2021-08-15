import { getCar } from '../../../api/car-api';
import { getWinners } from '../../../api/winners-api';
import APIConstants from '../../../enums/api-constants';
import { WinnerInfo } from '../../../interfaces/winner-api';
import CarWinner from './winner';

export default class WinnerResultModel {
  winners: CarWinner[] = [];

  async getCars(page: number, sort?: string, order?: string): Promise<CarWinner[]> {
    this.winners = [];
    const cars = await getWinners(page, APIConstants.winnerCarLimit, sort, order);

    return Promise.all(
      cars.items.map(async (car: WinnerInfo) => {
        return new CarWinner(
          car.id,
          (await getCar(car.id)).name,
          (await getCar(car.id)).color,
          car.wins,
          car.time,
        );
      }),
    );
  }
}
