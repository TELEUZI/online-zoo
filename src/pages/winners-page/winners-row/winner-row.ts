import CellComponent from '@/components/table/cell';
import BaseComponent from '@/components/base-component';
import Car from '@/pages/garage-page/car/car';

export default class WinnerRow extends BaseComponent {
  private readonly car: Car;

  private readonly carImage: CellComponent;

  private readonly carName: CellComponent;

  private readonly winsAmount: CellComponent;

  private readonly winnerBestTime: CellComponent;

  constructor(name: string, color: string, private wins: number, private bestTime: number) {
    super('tr', ['table__row']);
    this.car = new Car(name, color);
    this.wins = wins;
    this.bestTime = bestTime;
    this.carImage = new CellComponent('', this.car.getSVGInHTML());
    this.carName = new CellComponent(this.car.getName());
    this.winsAmount = new CellComponent(this.wins.toString());
    this.winnerBestTime = new CellComponent(this.bestTime.toString());
    this.appendChildren([this.carImage, this.carName, this.winsAmount, this.winnerBestTime]);
  }

  public update(name: string, color: string, wins: number, bestTime: number): void {
    this.car.setColor(color);
    this.car.setName(name);
    this.wins = wins;
    this.bestTime = bestTime;
    this.updateRow();
  }

  private updateRow(): void {
    this.carImage.setHTML(this.car.getSVGInHTML());
    this.carName.setContent(this.car.getName());
    this.winsAmount.setContent(this.wins.toString());
    this.winnerBestTime.setContent(this.bestTime.toString());
  }
}
