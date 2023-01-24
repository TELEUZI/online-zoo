import PaginationControls from '@/components/controls/pagination-controls/pagination-controls';
import BaseComponent from '@/components/base-component';
import Button from '@/components/button/button';
import ModalWindow from '@/components/pop-up/modal-window';
import PopUpWindow from '@/components/pop-up/pop-up';
import CarForm, { CarChars } from '@/components/reg-form/reg-form';
import Timer from '@/components/timer/timer';
import WinnerResultModel from '@/services/winners-service';
import CarsService from '@/services/car-service';
import type { ICar } from '@/interfaces/car-api';
import Garage from './garage/garage';
import PageWithPagination from '../pagination-page';

export class GaragePage extends PageWithPagination {
  private readonly garage: Garage;

  private readonly form: CarForm;

  private readonly popUp: PopUpWindow;

  private readonly modal: ModalWindow;

  private readonly timer: Timer;

  private readonly randomCarsButton: Button;

  protected paginationControls: PaginationControls;

  constructor() {
    super();
    this.garage = new Garage(
      this.startTimer.bind(this),
      this.handleRaceEnd.bind(this),
      this.updatePaginationButtons.bind(this),
    );
    this.paginationControls = new PaginationControls(
      this.showNext.bind(this),
      this.showPrevious.bind(this),
      ['page__controls_pagination'],
    );
    this.form = new CarForm(['car-form'], this.getFormData.bind(this));
    this.randomCarsButton = new Button(
      'Generate random cars',
      ['page__controls_random-cars'],
      this.createRandomCars.bind(this),
    );
    this.timer = new Timer();
    const garageControls = new BaseComponent('div', ['page__controls']);
    const carFormLabel = new BaseComponent('h2', ['form-explanation'], 'Create new car!');
    garageControls.appendChildren([this.randomCarsButton, this.paginationControls]);
    this.appendChildren([carFormLabel, this.form, garageControls, this.garage]);

    this.popUp = new PopUpWindow('', this.toggleModal.bind(this));
    this.modal = new ModalWindow(this.popUp, this.node);
    this.toggleModal();
    this.garage.createGarage(this.currentPage).then(() => {
      return this.updatePaginationButtons();
    });
  }

  async getCount(): Promise<number> {
    return CarsService.getCarsCount();
  }

  private handleRaceEnd = async (winner: ICar): Promise<void> => {
    await WinnerResultModel.createWinner(winner.id, this.timer.getSeconds());
    this.createWinPopup(`Первым пришёл водитель ${winner.name} за ${this.timer.getTime()}`);
    this.toggleModal();
    this.timer.reset();
  };

  private startTimer(): void {
    this.timer.start();
  }

  private async getFormData(car: CarChars): Promise<void> {
    await this.updatePaginationButtons();
    await CarsService.createCar(car.name, car.color);
    return this.garage.updateGarageWithPagination(this.currentPage);
  }

  private showNext(): Promise<void> {
    this.currentPage += 1;
    return this.garage.updateTracksNumber(this.currentPage);
  }

  private createRandomCars(): Promise<void> {
    return CarsService.createCars().then(() => {
      return this.garage.updateGarageWithPagination(this.currentPage);
    });
  }

  private async showPrevious(): Promise<void> {
    this.currentPage -= 1;
    return this.garage.updateTracksNumber(this.currentPage);
  }

  private toggleModal(): void {
    this.modal.toggleModal();
  }

  private createWinPopup(result: string): void {
    const resultText = new BaseComponent('span', [], result);
    this.popUp.insertChild(resultText);
  }
}
