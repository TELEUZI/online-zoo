import CellComponent from '@/components/table/cell';
import BaseComponent from '@/components/base-component';
import Car from '@/pages/garage-page/car/car';

export default class CarWinner extends BaseComponent {
  private car!: Car;

  private carImage!: CellComponent;

  private carName!: CellComponent;

  private winsAmount!: CellComponent;

  private winnerBestTime!: CellComponent;

  constructor(name: string, color: string, private wins: number, private bestTime: number) {
    super('tr', ['table__row']);
    this.updateData(name, color, wins, bestTime);
    this.carImage = new CellComponent('', this.car.getSVGInHTML());
    this.carName = new CellComponent(this.car.getName());
    this.winsAmount = new CellComponent(this.wins.toString());
    this.winnerBestTime = new CellComponent(this.bestTime.toString());
    this.appendChildren([this.carImage, this.carName, this.winsAmount, this.winnerBestTime]);
  }

  update(name: string, color: string, wins: number, bestTime: number): void {
    this.updateData(name, color, wins, bestTime);
    this.updateRow();
  }

  private updateData(name: string, color: string, wins: number, bestTime: number): void {
    this.car = new Car(name, color);
    this.wins = wins;
    this.bestTime = bestTime;
  }

  private updateRow(): void {
    this.carImage.setHTML(this.car.getSVGInHTML());
    this.carName.setContent(this.car.getName());
    this.winsAmount.setContent(this.wins.toString());
    this.winnerBestTime.setContent(this.bestTime.toString());
  }
}
