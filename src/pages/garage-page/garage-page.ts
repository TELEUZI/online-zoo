import BaseComponent from '../../components/base-component';
import Button from '../../components/button/button';
import ModalWindow from '../../components/pop-up/modal-window';
import PopUpWindow from '../../components/pop-up/pop-up';
import CarForm, { CarChars } from '../../components/reg-form/reg-form';
import Timer from '../../components/timer/timer';
import PageController from '../../interfaces/page-controller';
import PageWithPagination, { PAGINATION_LIMIT } from '../pagination-page';
import CarTrack from './garage-components/car-track';
import GaragePageModel from './garage-page-model';
import Garage from './garage/garage';

const TIMER_DELAY = 0;

export default class GaragePage extends PageWithPagination implements PageController {
  private root: HTMLElement;

  private garage: Garage;

  private form: CarForm;

  paginationLimit = PAGINATION_LIMIT;

  private popUp: PopUpWindow;

  private modal: ModalWindow;

  private timer: Timer;

  private randomCarsButton: Button;

  private model = new GaragePageModel();

  constructor(root: HTMLElement) {
    super();
    this.root = root;
    this.garage = new Garage(
      this.startTimer.bind(this),
      this.handleRaceEnd.bind(this),
      this.checkPaginationButtons.bind(this),
      this.updateGarage.bind(this),
    );
    this.garage.createGarage(this.currentPage);
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
  }

  async createPage(): Promise<void> {
    const garageControls = new BaseComponent('div', ['page__controls']);
    const paginationControls = new BaseComponent('div', ['page__controls_pagination']);
    const carFormLabel = new BaseComponent('h2', ['form-explanation'], 'Create new car!');
    paginationControls.insertChilds([this.nextPageButton, this.previousPageButton]);
    garageControls.insertChilds([this.randomCarsButton, paginationControls]);
    this.root.append(
      carFormLabel.getNode(),
      this.form.getNode(),
      garageControls.getNode(),
      this.garage.getNode(),
    );
    this.popUp = new PopUpWindow('');
    this.popUp.onOkClick = this.toggleModal.bind(this);
    this.modal = new ModalWindow(this.popUp, this.root);
    this.toggleModal();
  }

  async getCount(): Promise<number> {
    return this.model.getCarsCount(this.currentPage);
  }

  handleRaceEnd = async (winner: CarTrack): Promise<void> => {
    GaragePageModel.createWinner(this.currentPage, winner, this.timer.getSeconds());
    this.createWinPopup(
      `Первым пришёл водитель ${winner.getCar().getName()} за ${this.timer.getTime()}`,
    );
    this.toggleModal();
    this.timer.reset();
  };

  startTimer(): void {
    this.timer.start(TIMER_DELAY);
  }

  async getFormData(car: CarChars): Promise<void> {
    this.checkPaginationButtons();
    GaragePageModel.createCar(car.name, car.color);
    this.garage.updateGarage();
  }

  async showNext(): Promise<void> {
    this.currentPage += 1;
    this.garage.updateGarage();
  }

  createRandomCars(): void {
    GaragePageModel.сreateCars();
    this.garage.updateGarage();
  }

  async showPrevious(): Promise<void> {
    this.currentPage -= 1;
    this.garage.updateGarage();
  }

  toggleModal(): void {
    this.modal.toggleModal();
  }

  createWinPopup(result: string): void {
    const resultText = new BaseComponent('span', [], result);
    this.popUp.insertChild(resultText);
  }

  updateGarage(): void {
    this.garage.createGarage(this.currentPage);
  }
}
