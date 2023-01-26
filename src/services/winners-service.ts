import { getCar } from '@/api/car-api';
import { createWinner, deleteWinner, getWinner, getWinners, updateWinner } from '@/api/winners-api';
import type { ICar } from '@/interfaces/car-api';
import type { WinnerInfo } from '@/interfaces/winner-api';
import Observable from '@/utils/observable';
import { PAGINATION_LIMIT_WINNERS } from '@/pages/pagination-page';
import { NUMERIC_SYSTEM } from '@/constants';

const WINNERS_INITIAL_COUNT = 0;

export default class WinnersService {
  public static readonly winnersCount = new Observable<number>(WINNERS_INITIAL_COUNT);

  public static async createWinner(carId: number, time: number): Promise<void> {
    const winner = await getWinner(carId);
    if (winner.wins == null) {
      await createWinner({ id: carId, wins: 1, time });
      return;
    }
    if (winner.id && winner.wins && winner.time) {
      await updateWinner(carId, {
        wins: (winner.wins += 1),
        time: winner.time > time ? time : winner.time,
      });
    }
  }

  public static async getWinners(
    page: number,
    sort?: string,
    order?: string,
  ): Promise<(ICar & WinnerInfo)[]> {
    const winners = await getWinners(page, PAGINATION_LIMIT_WINNERS, sort, order);
    this.winnersCount.notify(parseInt(winners.count, NUMERIC_SYSTEM));
    return Promise.all(
      winners.items.map(async ({ id, wins, time }: WinnerInfo) => {
        const { name, color } = await getCar(id);
        return {
          id,
          name,
          color,
          wins,
          time,
        };
      }),
    );
  }

  public static deleteWinner(id: number): Promise<void> {
    return deleteWinner(id).then(() => {
      const deletedCount = 1;
      this.winnersCount.notify((val) => val - deletedCount);
    });
  }

  public static getCount(): Promise<number> {
    return Promise.resolve(this.winnersCount.getValue());
  }
}
