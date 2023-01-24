import { getCar } from '@/api/car-api';
import { createWinner, deleteWinner, getWinner, getWinners, updateWinner } from '@/api/winners-api';
import type { ICar } from '@/interfaces/car-api';
import type { WinnerInfo } from '@/interfaces/winner-api';
import Observable from '@/utils/observable';
import { PAGINATION_LIMIT_WINNERS } from '@/pages/pagination-page';
import { NUMERIC_SYSTEM } from '@/services/car-service';

export default class WinnersService {
  static readonly winnersCount = new Observable<number>(0);

  static async createWinner(carId: number, time: number): Promise<void> {
    const winner = await getWinner(carId);
    if (winner.wins == null) {
      await createWinner({ id: carId, wins: 1, time });
    } else {
      await updateWinner(carId, {
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
    const winners = await getWinners(page, PAGINATION_LIMIT_WINNERS, sort, order);
    this.winnersCount.notify(parseInt(winners.count, NUMERIC_SYSTEM));
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

  static deleteWinner(id: number): Promise<void> {
    return deleteWinner(id).then(() => {
      this.winnersCount.notify((val) => val - 1);
    });
  }

  static async getCount(): Promise<number> {
    return this.winnersCount.getValue();
  }
}
