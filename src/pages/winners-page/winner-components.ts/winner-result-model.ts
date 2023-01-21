import { getCar } from '../../../api/car-api';
import { getWinners } from '../../../api/winners-api';
import APIConstants from '../../../enums/api-constants';
import { WinnerInfo } from '../../../interfaces/winner-api';
import CarWinner from './winner';

export default class WinnerResultModel {
  winners: CarWinner[] = [];

  async getCars(page: number, sort?: string, order?: string): Promise<CarWinner[]> {
    this.winners = [];
    const winners = await getWinners(page, APIConstants.winnerCarLimit, sort, order);

    return Promise.all(
      winners.items.map(async (winner: WinnerInfo) => {
        const carInfo = await getCar(winner.id);
        return new CarWinner(winner.id, carInfo.name, carInfo.color, winner.wins, winner.time);
      }),
    );
  }
}
