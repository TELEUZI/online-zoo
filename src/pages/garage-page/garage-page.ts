import BaseComponent from '../../components/base-component';
import Button from '../../components/button/button';
import ModalWindow from '../../components/pop-up/modal-window';
import PopUpWindow from '../../components/pop-up/pop-up';
import CarForm, { CarChars } from '../../components/reg-form/reg-form';
import Timer from '../../components/timer/timer';
import PageController from '../../interfaces/page-controller';
import PageWithPagination, { PAGINATION_LIMIT } from '../pagination-page';
import CarTrack from './garage-components/car-track';
import Garage from './garage/garage';
import WinnerResultModel from '../../services/winners-service';
import CarsService from '../../services/car-service';
import ICar from '../../interfaces/car-api';

const TIMER_DELAY = 0;

export class GaragePage extends PageWithPagination implements PageController {
  private garage: Garage;

  private form!: CarForm;

  paginationLimit = PAGINATION_LIMIT;

  private popUp!: PopUpWindow;

  private modal!: ModalWindow;

  private timer!: Timer;

  private randomCarsButton!: Button;

  constructor() {
    super();
    this.garage = new Garage(
      this.startTimer.bind(this),
      this.handleRaceEnd.bind(this),
      this.updatePaginationButtons.bind(this),
      this.updateGarage.bind(this),
    );
    this.createPage();
  }

  async createPage(): Promise<void> {
    this.garage.createGarage(this.currentPage).then(() => {
      this.form = new CarForm(['car-form']);
      this.form.onSubmit = this.getFormData.bind(this);
      this.nextPageButton = new Button('Next page', [], this.showNext.bind(this));
      this.previousPageButton = new Button('Previous page', [], this.showPrevious.bind(this));
      this.randomCarsButton = new Button(
        'Generate random cars',
        ['page__controls_random-cars'],
        this.createRandomCars.bind(this),
      );
      this.timer = new Timer();
      const garageControls = new BaseComponent('div', ['page__controls']);
      const paginationControls = new BaseComponent('div', ['page__controls_pagination']);
      const carFormLabel = new BaseComponent('h2', ['form-explanation'], 'Create new car!');
      paginationControls.appendChildren([this.nextPageButton, this.previousPageButton]);
      garageControls.appendChildren([this.randomCarsButton, paginationControls]);
      this.appendChildren([carFormLabel, this.form, garageControls, this.garage]);
      this.popUp = new PopUpWindow('');
      this.popUp.onOkClick = this.toggleModal.bind(this);
      this.modal = new ModalWindow(this.popUp, this.node);
      this.toggleModal();
    });
  }

  async getCount(): Promise<number> {
    return CarsService.getCarsCount(this.currentPage);
  }

  private handleRaceEnd = async (winner: ICar): Promise<void> => {
    await WinnerResultModel.createWinner(winner.id, this.timer.getSeconds());
    this.createWinPopup(`Первым пришёл водитель ${winner.name} за ${this.timer.getTime()}`);
    this.toggleModal();
    this.timer.reset();
  };

  private startTimer(): void {
    this.timer.start(TIMER_DELAY);
  }

  private async getFormData(car: CarChars): Promise<void> {
    await this.updatePaginationButtons();
    CarsService.createCar(car.name, car.color);
    this.garage.updateGarage();
  }

  private async showNext(): Promise<void> {
    this.currentPage += 1;
    this.garage.updateGarage();
  }

  private createRandomCars(): void {
    CarsService.createCars().then(() => {
      this.garage.updateGarage();
    });
  }

  private async showPrevious(): Promise<void> {
    this.currentPage -= 1;
    this.garage.updateGarage();
  }

  private toggleModal(): void {
    this.modal.toggleModal();
  }

  private createWinPopup(result: string): void {
    const resultText = new BaseComponent('span', [], result);
    this.popUp.insertChild(resultText);
  }

  private async updateGarage(): Promise<void> {
    return this.garage.createGarage(this.currentPage);
  }
}
