import BaseComponent from '../../../components/base-component';
import Car from '../../garage-page/garage-components/car';

export default class CarWinner extends BaseComponent {
  private car: Car;

  private wins: number;

  private bestTime: number;

  private id: number;

  constructor(id: number, name: string, color: string, wins: number, bestTime: number) {
    super('tr', ['table__row']);
    this.id = id;
    this.car = new Car(name, color);
    this.wins = wins;
    this.bestTime = bestTime;
    this.node.innerHTML += `
    <td class="table__col">${this.car.getSVGInHTML()}</td>
    <td class="table__col">${this.car.getName()}</td>
    <td class="table__col">${this.wins}</td>
    <td class="table__col">${this.bestTime}</td>`;
  }

  destroy(): void {
    this.node.remove();
  }
}
