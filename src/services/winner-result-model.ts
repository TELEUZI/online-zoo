import { getCar } from '../api/car-api';
import { createWinner, getWinner, getWinners, updateWinner } from '../api/winners-api';
import APIConstants from '../enums/api-constants';
import ICar from '../interfaces/car-api';
import { WinnerInfo } from '../interfaces/winner-api';
import CarTrack from '../pages/garage-page/garage-components/car-track';
import CarWinner from '../pages/winners-page/winner-components.ts/winner';

export default class WinnersService {
  static async createWinner(page: number, car: CarTrack, time: number): Promise<void> {
    const winner = await getWinner(car.getId());
    if (winner == null) {
      await createWinner({ id: car.getId(), wins: 1, time });
    } else {
      await updateWinner(car.getId(), {
        wins: (winner.wins += 1),
        time: winner.time > time ? time : winner.time,
      });
    }
  }

  static async getWinners(
    page: number,
    sort?: string,
    order?: string,
  ): Promise<(ICar & WinnerInfo)[]> {
    const winners = await getWinners(page, APIConstants.winnerCarLimit, sort, order);

    return Promise.all(
      winners.items.map(async (winner: WinnerInfo) => {
        const carInfo = await getCar(winner.id);
        return {
          id: winner.id,
          name: carInfo.name,
          color: carInfo.color,
          wins: winner.wins,
          time: winner.time,
        };
      }),
    );
  }

  static async getCount(page: number, limit: number): Promise<number> {
    return parseInt((await getWinners(page, limit)).count, 10);
  }
}
